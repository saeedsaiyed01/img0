export const IMAGE_INPUT_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function fileStem(name: string) {
  return name.replace(/\.[^.]+$/, "") || "image";
}

export function imageExtension(mime: string) {
  return mime === "image/jpeg" ? "jpg" : mime === "image/x-icon" ? "ico" : mime.split("/")[1];
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ICO supports PNG image data inside an ICONDIR / ICONDIRENTRY container.
// A zero width/height byte denotes 256 pixels in the ICO directory.
export function pngToIco(png: Uint8Array, width: number, height: number): Blob {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 256 || height > 256) {
    throw new Error("Icon dimensions must be between 1 and 256 pixels.");
  }
  if (![137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => png[index] === byte)) {
    throw new Error("The icon could not be encoded as PNG.");
  }
  const bytes = new Uint8Array(22 + png.byteLength);
  const view = new DataView(bytes.buffer);
  view.setUint16(2, 1, true); // Image type: icon
  view.setUint16(4, 1, true); // One image
  bytes[6] = width === 256 ? 0 : width;
  bytes[7] = height === 256 ? 0 : height;
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, png.byteLength, true);
  view.setUint32(18, 22, true);
  bytes.set(png, 22);
  return new Blob([bytes], { type: "image/x-icon" });
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This image could not be opened. Choose a valid JPG, PNG, or WebP file."));
    image.src = url;
  });
}

export function canvasBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("The image could not be exported. Try a smaller image."));
      else if (blob.type !== mime) reject(new Error("Your browser does not support this output format. Choose another format."));
      else resolve(blob);
    }, mime, quality);
  });
}

export function iconCanvas(image: HTMLImageElement, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing is unavailable in this browser.");
  const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
  return canvas;
}

export async function encodeImage(image: HTMLImageElement, mime: string, quality: number) {
  if (mime === "image/x-icon") {
    const canvas = iconCanvas(image, 256);
    const png = await canvasBlob(canvas, "image/png");
    return { blob: pngToIco(new Uint8Array(await png.arrayBuffer()), 256, 256), preview: png, width: 256, height: 256 };
  }
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing is unavailable in this browser.");
  if (mime === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(image, 0, 0);
  const blob = await canvasBlob(canvas, mime, quality / 100);
  return { blob, preview: blob, width: canvas.width, height: canvas.height };
}
