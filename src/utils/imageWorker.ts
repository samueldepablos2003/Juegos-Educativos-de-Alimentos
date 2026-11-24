/// <reference lib="webworker" />

interface WorkerRequest {
  id: number;
  bitmap: ImageBitmap;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, bitmap } = event.data;
  try {
    const width = bitmap.width;
    const height = bitmap.height;

    if (!width || !height) {
      bitmap.close();
      self.postMessage({ id, ok: false, error: 'Empty bitmap' });
      return;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      bitmap.close();
      self.postMessage({ id, ok: false, error: 'No 2d context' });
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const totalPixels = width * height;
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let head = 0;
    let tail = 0;

    const enqueueIfBg = (x: number, y: number) => {
      const idx = y * width + x;
      if (visited[idx]) return;
      const o = idx * 4;
      if (
        data[o] > 245 &&
        data[o + 1] > 245 &&
        data[o + 2] > 245 &&
        data[o + 3] > 0
      ) {
        visited[idx] = 1;
        queue[tail++] = idx;
      }
    };

    for (let x = 0; x < width; x++) {
      enqueueIfBg(x, 0);
      enqueueIfBg(x, height - 1);
    }
    for (let y = 1; y < height - 1; y++) {
      enqueueIfBg(0, y);
      enqueueIfBg(width - 1, y);
    }

    while (head < tail) {
      const idx = queue[head++];
      data[idx * 4 + 3] = 0;
      const x = idx % width;
      const y = (idx - x) / width;
      if (x > 0) enqueueIfBg(x - 1, y);
      if (x + 1 < width) enqueueIfBg(x + 1, y);
      if (y > 0) enqueueIfBg(x, y - 1);
      if (y + 1 < height) enqueueIfBg(x, y + 1);
    }

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      for (let x = 0; x < width; x++) {
        if (data[(rowOffset + x) * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      self.postMessage({ id, ok: false, error: 'No foreground pixels' });
      return;
    }

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;
    ctx.putImageData(imageData, 0, 0);

    const outCanvas = new OffscreenCanvas(cropW, cropH);
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) {
      self.postMessage({ id, ok: false, error: 'No out 2d context' });
      return;
    }

    outCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    const outBlob = await outCanvas.convertToBlob({ type: 'image/png' });
    self.postMessage({ id, ok: true, blob: outBlob, width: cropW, height: cropH });
  } catch (err) {
    try {
      bitmap.close();
    } catch {
      // already closed
    }
    self.postMessage({ id, ok: false, error: String(err) });
  }
};
