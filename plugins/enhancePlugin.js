// plugins/enhancePlugin.js

// Helper function to apply a convolution matrix (e.g., for blurring)
function applyConvolution(pixels, weights) {
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const src = pixels.data;
  const sw = pixels.width;
  const sh = pixels.height;
  const w = sw;
  const h = sh;
  const output = new ImageData(w, h);
  const dst = output.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sy = y;
      const sx = x;
      const dstOff = (y * w + x) * 4;
      let r = 0, g = 0, b = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
          const scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
          const srcOff = (scy * sw + scx) * 4;
          const wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = src[dstOff + 3]; // Preserve alpha
    }
  }
  return output;
}

// Helper function to adjust color saturation
function adjustSaturation(pixels, value) {
    const data = pixels.data;
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = lumR * r + lumG * g + lumB * b;

        data[i] = gray + value * (r - gray);
        data[i+1] = gray + value * (g - gray);
        data[i+2] = gray + value * (b - gray);
    }
    return pixels;
}

// Helper function to adjust contrast
function adjustContrast(pixels, value) {
    const data = pixels.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
    }
    return pixels;
}


export default {
  name: 'enhance',
  apply: (imageData) => {
    // 1. Apply a gentle blur to smooth out pixelation
    const blurFactor = 1 / 9;
    const blurredData = applyConvolution(imageData, [
      blurFactor, blurFactor, blurFactor,
      blurFactor, blurFactor, blurFactor,
      blurFactor, blurFactor, blurFactor,
    ]);

    // 2. Increase the contrast
    const contrastedData = adjustContrast(blurredData, 20); // Contrast value between -255 and 255

    // 3. Enhance color saturation for more vibrant colors
    const saturatedData = adjustSaturation(contrastedData, 1.25); // 1.25 means 25% more saturation

    return saturatedData;
  },
};
