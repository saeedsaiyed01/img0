import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Check actual static output: run after npm run build.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const origin = read('src/config/site.ts').match(/url: "([^"]+)"/)[1];
const toolPaths = [...read('src/config/tools.ts').matchAll(/href: "([^"]+)"/g)].map(match => `${match[1]}/`);
const paths = ['/', '/tools/', '/privacy-policy/', ...toolPaths];
const expectedUrls = paths.map(path => origin + path);
const decode = text => text.replace(/&(?:#(x[\da-f]+|\d+)|amp|quot|apos|lt|gt);/gi, (entity, code) => {
  if (code) return String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code));
  return { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }[entity.toLowerCase()];
});
const clean = html => decode(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const titles = new Set();
const descriptions = new Set();
let faqCount = 0;

for (const path of paths) {
  const html = read(`out${path}index.html`);
  const title = clean(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  assert.ok(title, `${path}: missing title`);
  assert.equal((title.match(/img0\.site/g) || []).length, 1, `${path}: brand must appear once`);
  assert.ok(!titles.has(title), `${path}: duplicate title`);
  titles.add(title);
  const tags = [...html.matchAll(/<(meta|link)\b[^>]*>/g)].map(match => Object.fromEntries(
    [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(attr => [attr[1], decode(attr[2])]),
  ));
  const canonicals = tags.filter(tag => tag.rel === 'canonical');
  assert.deepEqual(canonicals.map(tag => tag.href), [origin + path], `${path}: canonical must match final URL`);
  assert.equal(tags.find(tag => tag.property === 'og:url')?.content, origin + path, `${path}: OG URL`);
  assert.equal(tags.find(tag => tag.property === 'og:title')?.content, title, `${path}: OG title`);
  assert.equal(tags.find(tag => tag.name === 'twitter:title')?.content, title, `${path}: Twitter title`);
  const description = tags.find(tag => tag.name === 'description')?.content;
  assert.ok(description && !descriptions.has(description), `${path}: missing or duplicate description`);
  descriptions.add(description);
  assert.ok(!tags.some(tag => /^(robots|googlebot)$/.test(tag.name) && /noindex/.test(tag.content)), `${path}: unexpectedly noindex`);
  const body = html.replace(/<script\b[\s\S]*?<\/script>/g, '');
  assert.equal([...body.matchAll(/<h1\b/g)].length, 1, `${path}: expected one H1`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'Organization'), `${path}: missing organization`);
  assert.ok(!JSON.stringify(schemas).includes('https://img0.site'), `${path}: stale schema host`);
  if (toolPaths.includes(path)) {
    const app = schemas.find(schema => schema['@type'] === 'SoftwareApplication');
    assert.equal(app?.url, origin + path, `${path}: application URL`);
    assert.equal(schemas.find(schema => schema['@type'] === 'BreadcrumbList')?.itemListElement.at(-1)?.item, origin + path, `${path}: breadcrumb URL`);
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
    assert.ok(faq?.mainEntity.length, `${path}: missing FAQ`);
    const details = [...body.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)].map(match => clean(match[1]));
    assert.equal(details.length, faq.mainEntity.length, `${path}: FAQ counts differ`);
    for (const question of faq.mainEntity) {
      assert.ok(details.includes(`${question.name} ${question.acceptedAnswer.text}`), `${path}: FAQ markup must match visible content: ${question.name}`);
      faqCount++;
    }
    const related = body.match(/<aside\b[\s\S]*?<\/aside>/)?.[0] || '';
    assert.ok(related.includes('href="/tools/"'), `${path}: directory link missing`);
    const relatedLinks = [...related.matchAll(/href="(\/tools\/[^"/]+\/)"/g)].map(match => match[1]);
    assert.equal(new Set(relatedLinks).size, 3, `${path}: expected three distinct related tools`);
    assert.ok(relatedLinks.every(link => toolPaths.includes(link) && link !== path), `${path}: invalid related link`);
  }
}

const sitemap = read('out/sitemap.xml');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort(), expectedUrls.sort(), 'Sitemap must include every final canonical page exactly once');
const robots = read('out/robots.txt');
assert.ok(!/Disallow:\s*\/(?:_next|\s*$)/mi.test(robots), 'Robots must allow rendering assets and page crawling');
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Robots must reference the canonical sitemap');
console.log(`SEO checks passed: ${paths.length} pages, ${toolPaths.length} tools, ${faqCount} matching FAQ entries, sitemap and robots.`);
