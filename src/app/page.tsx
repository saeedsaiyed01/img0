import { ArrowDown, ArrowRight, Check, CheckCheck, Crop, FileImage, FileText, LockKeyhole, Minimize2, MoveUpRight, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ToolCard } from "@/components/ui/ToolCard";
import { tools } from "@/config/tools";
import styles from "./page.module.css";

const shortcuts = [
  { title: "Compress", href: "/tools/compress-image", icon: Minimize2 },
  { title: "Convert", href: "/tools/image-to-webp", icon: FileImage },
  { title: "Remove background", href: "/tools/remove-background", icon: Scissors },
  { title: "Crop", href: "/tools/crop-image", icon: Crop },
  { title: "Make a PDF", href: "/tools/image-to-pdf", icon: FileText },
];
const featuredIds = ["compress-image", "remove-background", "image-to-webp", "crop-image", "image-to-pdf", "social-resize"];
const featured = featuredIds.map((id) => tools.find((tool) => tool.id === id)!);

export default function LandingPage() {
  return <div className={styles.home}>
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.statusDot} /> YOUR EVERYDAY IMAGE TOOLKIT</p>
        <h1 id="hero-heading" className={styles.headline}>Image tools.<br /><span>Zero uploads.</span></h1>
        <p className={styles.lead}>Smaller files. The right format. A cleaner crop.<br className="hidden sm:block" /> Free online image tools that keep your files on your device.</p>
        <div className={styles.heroActions}>
          <Link href="#tools" className={styles.primary}>Find your tool <ArrowDown className="size-4" aria-hidden="true" /></Link>
          <Link href="/tools/compress-image?sample=landscape" className={styles.secondary}>Try a sample <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
        <div className={styles.assurances}><span><Check className="size-4" aria-hidden="true" /> No account needed</span><span><LockKeyhole className="size-3.5" aria-hidden="true" /> No image uploads</span></div>
        <nav aria-label="Quick image tasks" className={styles.shortcuts}>
          {shortcuts.map((shortcut) => <Link key={shortcut.title} href={shortcut.href}><shortcut.icon className="size-4 shrink-0" aria-hidden="true" />{shortcut.title}</Link>)}
        </nav>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.visualGlow} />
        <div className={styles.workspace}>
          <div className={styles.windowBar}><span className={styles.windowDots}><i /><i /><i /></span><span>YOUR CREATIVE SPACE</span><ShieldCheck className="size-4 text-emerald-700" aria-hidden="true" /></div>
          <div className={styles.imageFrame}>
            <Image src="/samples/landscape.svg" alt="Sample landscape illustration with mountains, a lake, and a warm sun" width={1200} height={900} priority className={styles.landscape} />
            <span className={styles.imageLabel}>sample-landscape.png</span>
            <span className={styles.frameCorner} aria-hidden="true" />
          </div>
          <div className={styles.workspaceFooter}><span><span className={styles.readyDot} /> Ready for your next edit</span><Link href="/tools/compress-image?sample=landscape" aria-label="Open sample illustration in image compressor"><MoveUpRight className="size-5" aria-hidden="true" /></Link></div>
        </div>
        <div className={styles.localNote}><span className={styles.localIcon}><LockKeyhole className="size-5" aria-hidden="true" /></span><div><strong>Your image. Still yours.</strong><span>Processed on your device</span></div><CheckCheck className="size-5 text-emerald-700" aria-hidden="true" /></div>
      </div>
    </section>

    <section id="tools" className={styles.toolsSection} aria-labelledby="tools-heading">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>LESS SEARCHING. MORE DOING.</p><h2 id="tools-heading">What are we making today?</h2><p>Pick a task. Bring your image. Make it work.</p></div><Link href="/tools" className={styles.allTools}>Explore all {tools.length} tools <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      <div className={styles.toolsGrid}>{featured.map((tool, index) => <ToolCard key={tool.id} {...tool} index={index} icon={<tool.icon className="size-6" />} />)}</div>
      <div className={styles.developerNote}><span className={styles.codeMark} aria-hidden="true">&lt;/&gt;</span><p>Working with code? <Link href="/tools/svg-to-jsx">SVG to JSX</Link>, <Link href="/tools/image-to-base64">Base64</Link>, and <Link href="/tools/favicon-generator">favicons</Link> are here too.</p><ArrowRight className="hidden size-4 sm:block" aria-hidden="true" /></div>
    </section>

    <section className={styles.privacySection} aria-labelledby="privacy-heading">
      <div className={styles.privacyIntro}><span className={styles.privacyIcon}><ShieldCheck className="size-7" aria-hidden="true" /></span><p className={styles.eyebrow}>A SMALLER DIGITAL FOOTPRINT</p><h2 id="privacy-heading">Your files don’t need<br />a round trip.</h2><p>Image processing happens in your browser. Choose a file, make your changes, and download the result.</p><Link href="/privacy-policy" className={styles.allTools}>How your privacy works <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      <div className={styles.privacyDetails}>
        {[{ number: "01", title: "Your images stay local", text: "Image contents are processed on your device, without uploading them to a server." }, { number: "02", title: "Start without an account", text: "No sign-up or payment required. Just open the tool you need." }, { number: "03", title: "Built around your browser", text: "Processing capacity depends on your device. Cached tools may work offline; AI tools need an initial model download." }].map((item) => <div key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}
        <p className={styles.analyticsNote}>We use anonymous site usage analytics. Your image contents and file names are not sent to analytics.</p>
      </div>
    </section>
    <section className={styles.finalCta}><div><Sparkles className="size-5 text-blue-600" aria-hidden="true" /><h2>A useful little tool for your next image.</h2></div><Link href="/tools" className={styles.primary}>Browse the toolkit <ArrowRight className="size-4" aria-hidden="true" /></Link></section>
  </div>;
}
