export interface ToolSeoContent {
  title: string;
  description: string;
  overview: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
}

export const toolSeo: Record<string, ToolSeoContent> = {
  'image-to-base64': {
    title: 'Image to Base64 Converter — Free Data URL Encoder',
    description: 'Convert an image to a Base64 data URL for HTML, CSS, or code. Copy the encoded result from your browser without uploading your image.',
    overview: 'Create a data URL containing the image MIME type and Base64 content. This is useful for small embedded assets, prototypes, and testing CSS backgrounds.',
    steps: ['Choose an image from your device.', 'Review the generated data URL in the output panel.', 'Copy the result and use it as an image source or CSS background URL.'],
    faqs: [
      { question: 'Does Base64 make an image smaller?', answer: 'No. Base64 encoding typically adds about one third to the binary size before text compression. For large images, a separate optimized image file is usually more suitable.' },
      { question: 'Is the output just the Base64 string?', answer: 'The output is a complete data URL, including its data:image/...;base64, prefix. Keep the prefix when using it as an HTML image source.' },
    ],
    related: ['compress-image', 'svg-to-jsx', 'image-to-webp'],
  },
  'image-to-png': {
    title: 'Image to PNG Converter — No Uploads',
    description: 'Convert JPG, WebP, and other browser-supported images to PNG locally. Download a PNG image without sending your file to a server.',
    overview: 'PNG is useful for screenshots, graphics, and images that need transparency. Conversion keeps the decoded image dimensions, but does not restore detail lost in an earlier JPEG export.',
    steps: ['Choose an image your browser can open, such as JPG or WebP.', 'Wait for the PNG preview and output size.', 'Download the PNG and check the result before replacing your original.'],
    faqs: [
      { question: 'Will converting JPG to PNG make the background transparent?', answer: 'No. Converting formats does not remove a background. Use the background remover first if you need a cutout with transparency.' },
      { question: 'Why is the PNG bigger than my JPG?', answer: 'PNG uses lossless compression and can be much larger for photographs. Use JPG or WebP when a smaller photographic image is more important than lossless storage.' },
    ],
    related: ['remove-background', 'image-to-webp', 'compress-image'],
  },
  'image-to-jpg': {
    title: 'Image to JPG Converter — Adjust Quality Online',
    description: 'Convert PNG, WebP, and browser-supported images to JPG. Adjust JPEG quality and download the result with no image uploads.',
    overview: 'JPG is a practical format for photographs and email attachments. The quality control trades visual detail for file size. Transparent pixels are flattened onto a white background.',
    steps: ['Choose the image you want to convert to JPG.', 'Adjust quality and review the resulting preview and file size.', 'Download the JPG while keeping your original as a backup.'],
    faqs: [
      { question: 'Can JPG keep a transparent background?', answer: 'No. JPG does not support transparency. This converter fills transparent areas with white; use PNG or WebP to retain transparency.' },
      { question: 'Will JPG conversion always reduce file size?', answer: 'No. Output size depends on the original format, image content, and quality setting. Compare the output size before using the new file.' },
    ],
    related: ['compress-image', 'image-to-webp', 'image-to-pdf'],
  },
  'image-to-webp': {
    title: 'Image to WebP Converter — Free & Local',
    description: 'Convert JPG and PNG images to WebP in your browser. Adjust quality, preview the image, and download without uploading your files.',
    overview: 'WebP supports transparency and can reduce the size of images used on websites. Choose a quality level that keeps important details clear and compare the output with the original.',
    steps: ['Select a browser-supported image such as JPG or PNG.', 'Adjust the WebP quality setting and review the preview.', 'Download your WebP file and confirm your target app supports it.'],
    faqs: [
      { question: 'Does WebP support transparency?', answer: 'Yes, WebP supports transparent pixels. For images with transparent areas, check the downloaded result in an app that supports WebP.' },
      { question: 'Does this convert every frame of an animated image?', answer: 'No. This canvas-based converter creates a still image, not an animated WebP. Use an animation-specific tool if you need to preserve all frames.' },
    ],
    related: ['compress-image', 'image-to-png', 'image-to-jpg'],
  },
  'image-to-ico': {
    title: 'Image to ICO Converter — Free 256px Icon Export',
    description: 'Convert a JPG, PNG, or WebP image into a 256-pixel ICO icon locally. Preview and download an icon file without uploading your image.',
    overview: 'Create a 256 by 256 pixel icon in an ICO container with PNG image data. The image is scaled to fit the square, with transparent padding for non-square sources.',
    steps: ['Choose a JPG, PNG, or WebP image with a clear, simple design.', 'Review the 256-pixel icon preview and any padding around the image.', 'Download the ICO file, or use the favicon generator when you need a package of website icon sizes.'],
    faqs: [
      { question: 'Does this just rename a PNG file?', answer: 'No. The tool wraps the PNG image data in an ICO directory and image entry. The downloaded file is an ICO container containing one 256-pixel image.' },
      { question: 'Does the ICO contain multiple resolutions?', answer: 'No. This converter produces a single 256-pixel image. The favicon generator offers separate PNG sizes and a 32-pixel ICO icon for website use.' },
    ],
    related: ['favicon-generator', 'crop-image', 'image-to-png'],
  },
  'image-to-pdf': {
    title: 'Images to PDF Converter — Combine Photos Locally',
    description: 'Combine photos into one PDF in your browser. Reorder images, choose A4 or image-sized pages, and download without uploading your files.',
    overview: 'Build a PDF from a collection of photos or scanned pages. Each selected image becomes a page. Choose A4 for a consistent paper size or fit pages to the image dimensions.',
    steps: ['Select the images to include in your PDF.', 'Use the ordering controls to arrange pages and choose A4 or fit-to-image sizing.', 'Generate and download the PDF, then review page order and orientation.'],
    faqs: [
      { question: 'Does this make scanned text searchable?', answer: 'No. The PDF contains images of your pages. It does not perform optical character recognition or turn photographed text into editable text.' },
      { question: 'How can I keep the PDF size manageable?', answer: 'Compress large photos before combining them. A PDF containing many high-resolution images can use significant memory and produce a large download.' },
    ],
    related: ['compress-image', 'rotate-image', 'crop-image'],
  },
  'favicon-generator': {
    title: 'Favicon Generator — PNG Icons & Web Manifest',
    description: 'Generate 16, 32, 180, 192, and 512 pixel PNG icons with a web manifest. Download a website icon ZIP package without image uploads.',
    overview: 'Create a set of PNG icons for browser tabs, Apple touch icons, and web app manifests. Start with a square image with enough detail for the largest size, and check that it remains legible at 16 pixels.',
    steps: ['Choose a square source image, ideally at least 512 by 512 pixels.', 'Generate the ZIP package containing PNG sizes and a manifest.', 'Extract the files, review the manifest values, and add the icons to your website.'],
    faqs: [
      { question: 'Which PNG sizes are included?', answer: 'The package includes 16×16, 32×32, 180×180, 192×192, and 512×512 PNG icons, along with a web manifest.' },
      { question: 'What else is in the ZIP package?', answer: 'The package also contains a 32-pixel favicon.ico file and site.webmanifest. Update the manifest name, paths, and other settings for your own website before publishing it.' },
    ],
    related: ['crop-image', 'image-to-png', 'image-to-ico'],
  },
  'svg-to-jsx': {
    title: 'SVG to JSX Converter — React SVG Attributes',
    description: 'Convert an SVG file to JSX-compatible markup for React. Transform common SVG attributes and copy the result locally in your browser.',
    overview: 'Turn common SVG attribute names such as class and stroke-width into their JSX equivalents, className and strokeWidth. The output is SVG markup for use inside a React component.',
    steps: ['Choose an SVG file from your device.', 'Review the converted JSX markup in the output panel.', 'Copy the JSX into your React component and test the rendered icon.'],
    faqs: [
      { question: 'Does this generate a complete React component?', answer: 'It converts SVG markup to JSX-compatible markup. Wrap the output in your own component function and add props as needed.' },
      { question: 'Does conversion sanitize untrusted SVG files?', answer: 'No. Attribute conversion is not sanitization. Review external SVG content before adding it to an application, especially scripts, links, and complex styles.' },
    ],
    related: ['image-to-base64', 'favicon-generator', 'image-to-png'],
  },
  'crop-image': {
    title: 'Crop Image Online — Free Browser Photo Cropper',
    description: 'Crop photos in your browser using a freeform selection or aspect ratio. Preview the crop and download a PNG without uploading your image.',
    overview: 'Remove unwanted edges and focus a photo on its subject. Use an aspect ratio for a consistent composition or a freeform crop when you need a custom shape.',
    steps: ['Choose the image you want to crop.', 'Adjust the crop box, aspect ratio, and zoom while checking the preview.', 'Download the edited PNG and compare it with your original.'],
    faqs: [
      { question: 'Is cropping the same as resizing?', answer: 'No. Cropping removes parts of the image. Resizing changes pixel dimensions; use social media resize when you need one of its preset output sizes.' },
      { question: 'Can I recover the removed edges from the downloaded file?', answer: 'No. The export contains only the selected crop. Your original file is unchanged, so keep it if you may need another composition later.' },
    ],
    related: ['social-resize', 'rotate-image', 'compress-image'],
  },
  'rotate-image': {
    title: 'Rotate & Flip Image Online — No Uploads',
    description: 'Rotate a photo in 90-degree steps or flip it horizontally and vertically. Preview the result and download a PNG in your browser.',
    overview: 'Correct sideways photos or mirror an image using the editor controls. Rotation and flipping change the visible pixels rather than relying on an orientation tag.',
    steps: ['Choose a photo from your device.', 'Use rotate or flip controls until the preview has the orientation you want.', 'Download the edited PNG and review the full image.'],
    faqs: [
      { question: 'What is the difference between rotating and flipping?', answer: 'Rotation turns the image around its center. Flipping mirrors it across a horizontal or vertical axis, which can also reverse text.' },
      { question: 'Does this overwrite my original photo?', answer: 'No. The tool downloads a separate PNG file. Keep your original photo if you need its original format or metadata.' },
    ],
    related: ['crop-image', 'image-to-pdf', 'image-to-jpg'],
  },
  'remove-background': {
    title: 'AI Background Remover — Process Photos Locally',
    description: 'Remove a photo background with AI running in your browser. Download a transparent PNG without uploading your image to a processing server.',
    overview: 'Separate a foreground subject from its background with an AI model running on your device. The first use needs a model download and may take longer than later runs.',
    steps: ['Choose a JPG, PNG, or WebP image with a clear foreground subject.', 'Start background removal and allow time for the initial model download and processing.', 'Review edges around hair and fine details, then download the transparent PNG.'],
    faqs: [
      { question: 'Why is the first run slower?', answer: 'The browser needs to download AI model assets before processing. Speed also depends on image size, available memory, and your device.' },
      { question: 'Will every background be removed perfectly?', answer: 'No. Fine hair, transparent objects, and low-contrast edges can be difficult. Review the result before using it for product listings or other published images.' },
    ],
    related: ['image-to-png', 'blur-background', 'add-watermark'],
  },
  'blur-background': {
    title: 'Blur Photo Background — Browser AI Tool',
    description: 'Blur a photo background while keeping the detected subject in focus. Adjust blur intensity and download a PNG with local browser processing.',
    overview: 'Use AI subject detection to separate a photo into foreground and background, then soften the background. This simulates a portrait-style effect, with results depending on the subject edges.',
    steps: ['Choose a photo with a clearly defined foreground subject.', 'Run processing and adjust the blur intensity.', 'Inspect the subject edges and download the processed PNG.'],
    faqs: [
      { question: 'Does this blur the whole photo?', answer: 'The tool attempts to keep the detected subject sharp while blurring the background. If detection misses an area, that part may also be blurred.' },
      { question: 'Does the AI need an internet connection?', answer: 'An initial model download needs a connection. Later availability depends on cached assets, your browser, and device resources; offline use is not guaranteed.' },
    ],
    related: ['remove-background', 'crop-image', 'compress-image'],
  },
  'join-images': {
    title: 'Join Images Online — Merge Photos Horizontally or Vertically',
    description: 'Combine images into a horizontal or vertical strip. Set spacing and a background color, then download a PNG without uploading your photos.',
    overview: 'Place multiple pictures into one PNG for comparisons, photo strips, or step-by-step illustrations. The layout controls let you choose direction, spacing, and background color.',
    steps: ['Select the images you want to combine.', 'Choose a horizontal or vertical layout, spacing, and background color.', 'Review the joined preview and download the PNG.'],
    faqs: [
      { question: 'Is the output a layered image file?', answer: 'No. The result is a single flattened PNG. Keep your source images if you want to rearrange them later.' },
      { question: 'Why does joining many large photos use more memory?', answer: 'The browser decodes each input and creates a canvas for the combined image. Reduce the number or dimensions of the images if your device runs out of memory.' },
    ],
    related: ['crop-image', 'add-watermark', 'compress-image'],
  },
  'compress-image': {
    title: 'Free Image Compressor — JPG, PNG & WebP',
    description: 'Compress JPG, PNG, and WebP images locally. Compare file sizes, adjust JPG or WebP quality, and download without image uploads.',
    overview: 'Compare an image with a new browser-encoded version to find a useful balance between detail and file size. JPG and WebP offer quality controls; PNG output does not use a lossy quality slider.',
    steps: ['Choose a JPG, PNG, or WebP image.', 'Choose an output format and adjust quality when available. Compare the preview and file sizes.', 'Download the output if it meets your needs, or keep the original if it is smaller.'],
    faqs: [
      { question: 'Can I guarantee an output smaller than 100 KB?', answer: 'No. This tool offers format and quality controls, not a guaranteed target-size mode. Output depends on image dimensions and content; you may also need to crop or resize the source.' },
      { question: 'Why can the compressed image be larger?', answer: 'The original may already be well optimized, or the chosen format may be less efficient for that image. Compare sizes and keep the original when re-encoding does not help.' },
      { question: 'Does PNG quality change like JPEG quality?', answer: 'No. Browser PNG encoding does not use a lossy quality setting. Try WebP or JPG for adjustable compression, and remember that JPG replaces transparency with a solid background.' },
    ],
    related: ['image-to-webp', 'image-to-jpg', 'crop-image'],
  },
  'social-resize': {
    title: 'Social Media Image Resizer — Preset Photo Sizes',
    description: 'Create PNG images using preset sizes for social posts, stories, and thumbnails. Preview center-cropped results and download them in your browser.',
    overview: 'Generate versions of one image for the social media dimensions listed in the tool. Images are center-cropped to fill each preset, so check that important subjects and text remain visible.',
    steps: ['Choose a source image with enough resolution for the largest preset.', 'Generate the preset images and review each center-cropped preview.', 'Download individual images or the ZIP package.'],
    faqs: [
      { question: 'Will the full source image appear in every preset?', answer: 'No. Different aspect ratios require cropping. The tool crops around the center, so details near the edges can be removed.' },
      { question: 'Are these dimensions guaranteed to match every platform placement?', answer: 'No. Platforms and placements change. Check the displayed pixel dimensions against the current requirements for the placement you plan to use.' },
    ],
    related: ['crop-image', 'add-watermark', 'compress-image'],
  },
  'add-watermark': {
    title: 'Add Watermark to Image — Text & Logo Overlays',
    description: 'Add a text or logo watermark to an image locally. Adjust placement and appearance, then download a watermarked PNG without image uploads.',
    overview: 'Overlay a name, credit, or logo on a photo before sharing it. Adjust the watermark so it is readable without hiding the most important parts of the image.',
    steps: ['Choose the image you want to watermark.', 'Add text or select a logo and adjust the available position, size, and appearance controls.', 'Review the preview and download the watermarked PNG.'],
    faqs: [
      { question: 'Does a watermark prevent someone from copying my image?', answer: 'No. A visible watermark can identify a source or discourage casual reuse, but it is not copy protection and can be cropped or edited.' },
      { question: 'Can I remove the watermark from my exported file later?', answer: 'The PNG export is flattened. Keep the original image if you may need an unwatermarked version or a different watermark.' },
    ],
    related: ['social-resize', 'join-images', 'compress-image'],
  },
};
