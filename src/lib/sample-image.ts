import { canvasBlob, loadImage } from "./image-export";

export async function loadSampleImage(signal?: AbortSignal): Promise<File> {
  const response = await fetch("/samples/landscape.svg", { signal });
  if (!response.ok) throw new Error("The sample could not be loaded. Choose an image from your device instead.");
  const source = URL.createObjectURL(await response.blob());
  try {
    const image = await loadImage(source);
    signal?.throwIfAborted();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");
    context.drawImage(image, 0, 0);
    const png = await canvasBlob(canvas, "image/png");
    signal?.throwIfAborted();
    return new File([png], "sample-landscape.png", { type: "image/png" });
  } finally {
    URL.revokeObjectURL(source);
  }
}
