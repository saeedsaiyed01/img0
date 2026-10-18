import assert from "node:assert/strict";
import { test } from "node:test";
import { pngToIco, canvasBlob, fileStem } from "../src/lib/image-export.ts";

const png = new Uint8Array(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jC3sAAAAASUVORK5CYII=", "base64"));

test("ICO contains a valid directory pointing to the unchanged PNG payload", async () => {
  const blob = pngToIco(png, 1, 1);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const header = new DataView(bytes.buffer);
  assert.equal(blob.type, "image/x-icon");
  assert.equal(header.getUint16(0, true), 0);
  assert.equal(header.getUint16(2, true), 1);
  assert.equal(header.getUint16(4, true), 1);
  assert.equal(bytes[6], 1);
  assert.equal(bytes[7], 1);
  assert.equal(header.getUint16(10, true), 1);
  assert.equal(header.getUint16(12, true), 32);
  assert.equal(header.getUint32(14, true), png.length);
  assert.equal(header.getUint32(18, true), 22);
  assert.deepEqual(bytes.slice(header.getUint32(18, true)), png);
});

test("ICO encodes the 256 px dimension sentinel and rejects invalid dimensions/data", async () => {
  const bytes = new Uint8Array(await pngToIco(png, 256, 256).arrayBuffer());
  assert.equal(bytes[6], 0);
  assert.equal(bytes[7], 0);
  for (const dimension of [0, -1, 257, 1.5]) assert.throws(() => pngToIco(png, dimension, 32));
  assert.throws(() => pngToIco(new Uint8Array([0, 1, 2]), 32, 32));
});

test("canvas export rejects unsupported format fallback and missing results", async () => {
  await assert.rejects(canvasBlob({ toBlob: (callback) => callback(new Blob([png], { type: "image/png" })) }, "image/webp"), /does not support/);
  await assert.rejects(canvasBlob({ toBlob: (callback) => callback(null) }, "image/png"), /could not be exported/);
});

test("extensionless and multi-dot filenames remain usable", () => {
  assert.equal(fileStem("photo"), "photo");
  assert.equal(fileStem("photo.original.png"), "photo.original");
});
