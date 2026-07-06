/**
 * Browser-side utility to resize and compress a base64 image using HTML Canvas.
 * Scales down to a maximum of 300px (width or height) and encodes as JPEG with 0.6 quality.
 */
export function compressAvatar(base64Str: string): Promise<string> {
  return new Promise((resolve) => {
    // If empty or if it's already a preset emoji, return as-is
    if (!base64Str || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const maxW = 300;
        const maxH = 300;
        let width = img.width;
        let height = img.height;

        // Calculate responsive bounding dimensions
        if (width > maxW || height > maxH) {
          if (width > height) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 0.6 quality (extremely lightweight, well under 30KB)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        resolve(compressedBase64);
      } catch (err) {
        console.error("Erro ao comprimir imagem:", err);
        resolve(base64Str); // Fallback to original
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
}
