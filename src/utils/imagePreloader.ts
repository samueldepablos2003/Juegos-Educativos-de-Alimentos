export interface FoodImageAssetMeta {
  src: string;
  alt: string;
  priority?: 'critical' | 'normal';
}

export interface ProcessedAsset {
  url: string;
  width: number;
  height: number;
}

export const HYDRATION_GLASS_SRC = '/assets/aistudio/image_dac11057.png';

export const FOOD_IMAGE_ASSETS: Record<string, FoodImageAssetMeta> = {
  auyama: {
    src: '/assets/aistudio/Auyama_e2600d00.jpg',
    alt: 'Auyama',
    priority: 'critical',
  },
  zanahoria: {
    src: '/assets/aistudio/Zanahoria_28c6dd33.jpg',
    alt: 'Zanahoria',
    priority: 'critical',
  },
  arepa: {
    src: '/assets/aistudio/Arepa_e887ce3f.jpg',
    alt: 'Arepa',
    priority: 'critical',
  },
  patilla: {
    src: '/assets/aistudio/Patilla_c96053be.jpg',
    alt: 'Patilla',
    priority: 'critical',
  },
  cambur: {
    src: '/assets/aistudio/Cambur_34dfa547.jpg',
    alt: 'Cambur',
  },
  huevo: {
    src: '/assets/aistudio/Huevos_5bb5607c.jpg',
    alt: 'Huevo',
  },
  pollo: {
    src: '/assets/aistudio/image_f3a2eda3.png',
    alt: 'Pollo Desmechado',
  },
  carne: {
    src: '/assets/aistudio/Carne_Mechada_75b57456.jpg',
    alt: 'Carne mechada',
  },
  pan: {
    src: '/assets/aistudio/Pan_abf2d6c1.jpg',
    alt: 'Pan',
  },
  caraotas: {
    src: '/assets/aistudio/Caraotas_Negras_be4cf929.jpg',
    alt: 'Caraotas negras',
  },
  lechuga: {
    src: '/assets/aistudio/Lechuga_45c48223.jpg',
    alt: 'Lechuga',
  },
  pina: {
    src: '/assets/aistudio/Pi_a_bbff265a.jpg',
    alt: 'Piña',
  },
  lechosa: {
    src: '/assets/aistudio/Lechosa_3a9231b1.jpg',
    alt: 'Lechosa',
  },
  yuca: {
    src: '/assets/aistudio/Yuca_bee05833.jpg',
    alt: 'Yuca',
  },
  guayaba: {
    src: '/assets/aistudio/Guayaba_8a12dae0.jpg',
    alt: 'Guayaba',
  },
  guanabana: {
    src: '/assets/aistudio/Guan_bana_90869df7.jpg',
    alt: 'Guanábana',
  },
  brocoli: {
    src: '/assets/aistudio/Br_coli_ef418bef.jpg',
    alt: 'Brócoli',
  },
  berenjena: {
    src: '/assets/aistudio/Berenjena_4896edb7.jpg',
    alt: 'Berenjena',
  },
  platano: {
    src: '/assets/aistudio/Pl_tano_90639ed8.jpg',
    alt: 'Plátano',
  },
  lentejas: {
    src: '/assets/aistudio/Lentejas_724e4c35.jpg',
    alt: 'Lentejas',
  },
  papa: {
    src: '/assets/aistudio/Papa_6e676187.jpg',
    alt: 'Papa',
  },
  queso: {
    src: '/assets/aistudio/Queso_39b26a1a.jpg',
    alt: 'Queso',
  },
  manzana: {
    src: '/assets/aistudio/Manzana_59b2ee72.jpg',
    alt: 'Manzana',
  },
  refresco: {
    src: '/assets/aistudio/Refresco_f72b147d.jpg',
    alt: 'Refresco',
  },
  charcuteria: {
    src: '/assets/aistudio/Charcuter_a_ff29704a.jpg',
    alt: 'Charcutería',
  },
  caramelos: {
    src: '/assets/aistudio/Caramelos_9ba2c381.jpg',
    alt: 'Caramelos',
  },
  aguacate: {
    src: '/assets/aistudio/Aguacate_1b90c650.jpg',
    alt: 'Aguacate',
  },
  salchicha: {
    src: '/assets/aistudio/Salchicha_b245b825.jpg',
    alt: 'Salchicha',
  },
  parchita: {
    src: '/assets/aistudio/Parchita_7a4450e7.jpg',
    alt: 'Parchita',
  },
  chucheria: {
    src: '/assets/aistudio/Chucherias_25806b89.jpg',
    alt: 'Chucherías',
  },
  galletas: {
    src: '/assets/aistudio/Galletas_727d8a36.jpg',
    alt: 'Galletas',
  },
  mango: {
    src: '/assets/aistudio/Mango_2ab7ca05.jpg',
    alt: 'Mango',
  },
  tomate: {
    src: '/assets/aistudio/Tomate_b135074d.jpg',
    alt: 'Tomate',
  },
  leche: {
    src: '/assets/aistudio/Leche_L_quida_02684a46.jpg',
    alt: 'Leche líquida',
  },
  pepino: {
    src: '/assets/aistudio/Pepino_6323a8e3.jpg',
    alt: 'Pepino',
  },
  mandarina: {
    src: '/assets/aistudio/Mandarina_268f257d.jpg',
    alt: 'Mandarina',
  },
  pasta: {
    src: '/assets/aistudio/Pasta_b4011cc5.jpg',
    alt: 'Pasta',
  },
  arroz: {
    src: '/assets/aistudio/Arroz_d530ab44.jpg',
    alt: 'Arroz',
  },
  sardinas: {
    src: '/assets/aistudio/Sardinas_a00237cd.jpg',
    alt: 'Sardinas',
  },
  avena: {
    src: '/assets/aistudio/Avena_62f1a73d.jpg',
    alt: 'Avena',
  },
  cotufas: {
    src: '/assets/aistudio/Cotufas_6ddc1501.jpg',
    alt: 'Cotufas',
  },
  mani: {
    src: '/assets/aistudio/Man__d3bc5a65.jpg',
    alt: 'Maní',
  },
  uvas: {
    src: '/assets/aistudio/Uvas_4a85b8aa.jpg',
    alt: 'Uvas',
  },
  pastelito: {
    src: '/assets/aistudio/Pastelito_3c3ed7fd.jpg',
    alt: 'Pastelito',
  },
  casabe: {
    src: '/assets/aistudio/Casabe_b6656464.jpg',
    alt: 'Casabe',
  },
  atun: {
    src: '/assets/aistudio/At_n_en_lata_6f62abf5.jpg',
    alt: 'Atún en Lata',
  },
  perro_caliente: {
    src: '/assets/aistudio/Perro_Caliente_a0c7c259.jpg',
    alt: 'Perro caliente',
  },
  azucar: {
    src: '/assets/aistudio/Az_car_2a46702b.jpg',
    alt: 'Azúcar',
  },
  aceite: {
    src: '/assets/aistudio/Aceite_3ed010c9.jpg',
    alt: 'Aceite',
  },
  repollo: {
    src: '/assets/aistudio/Repollo_a9b83778.jpg',
    alt: 'Repollo',
  },
  fresa: {
    src: '/assets/aistudio/Fresa_8f808c83.jpg',
    alt: 'Fresa',
  },
  pimenton: {
    src: '/assets/aistudio/Piment_n_1a11741e.jpg',
    alt: 'Pimentón Rojo',
  },
  yogurt: {
    src: '/assets/aistudio/Yogurt_11ae044b.jpg',
    alt: 'Yogurt',
  },
  durazno: {
    src: '/assets/aistudio/Durazno_af35e5d3.jpg',
    alt: 'Durazno',
  },
  mayonesa: {
    src: '/assets/aistudio/Mayonesa_96f1e0f0.jpg',
    alt: 'Mayonesa',
  },
  cebolla: {
    src: '/assets/aistudio/Cebolla_071033b5.jpg',
    alt: 'Cebolla',
  },
  helado: {
    src: '/assets/aistudio/Helado_14e1d98f.jpg',
    alt: 'Helado',
  },
  jojoto: {
    src: '/assets/aistudio/Jojoto_8ab8fc29.jpg',
    alt: 'Jojoto',
  },
  naranja: {
    src: '/assets/aistudio/Naranja_d623c6bb.jpg',
    alt: 'Naranja',
  },
  melon: {
    src: '/assets/aistudio/Mel_n_79dcfde3.jpg',
    alt: 'Melón',
  },
};

const processedCache = new Map<string, ProcessedAsset>();
const inFlightCache = new Map<string, Promise<ProcessedAsset>>();
let preloadStarted = false;

interface WorkerSuccessMessage {
  id: number;
  ok: true;
  blob: Blob;
  width: number;
  height: number;
}

interface WorkerErrorMessage {
  id: number;
  ok: false;
  error: string;
}

type WorkerResponse = WorkerSuccessMessage | WorkerErrorMessage;

let workerInstance: Worker | null = null;
let workerUnavailable = false;
let workerJobCounter = 0;
const workerResolvers = new Map<
  number,
  {
    resolve: (value: { blob: Blob; width: number; height: number }) => void;
    reject: (reason?: unknown) => void;
    timerId: number;
  }
>();

function getImageWorker(): Worker | null {
  if (workerUnavailable || typeof window === 'undefined') return null;
  if (workerInstance) return workerInstance;

  if (
    typeof Worker === 'undefined' ||
    typeof OffscreenCanvas === 'undefined' ||
    typeof createImageBitmap === 'undefined'
  ) {
    workerUnavailable = true;
    return null;
  }

  try {
    const worker = new Worker(new URL('./imageWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data;
      const pending = workerResolvers.get(msg.id);
      if (!pending) return;
      window.clearTimeout(pending.timerId);
      workerResolvers.delete(msg.id);
      if (msg.ok) {
        pending.resolve({
          blob: msg.blob,
          width: msg.width,
          height: msg.height,
        });
      } else {
        pending.reject(new Error(msg.error));
      }
    };

    worker.onerror = () => {
      workerUnavailable = true;
      worker.terminate();
      workerInstance = null;
      workerResolvers.forEach((pending) => {
        window.clearTimeout(pending.timerId);
        pending.reject(new Error('Image worker error'));
      });
      workerResolvers.clear();
    };

    workerInstance = worker;
    return worker;
  } catch {
    workerUnavailable = true;
    return null;
  }
}

function processBitmapWithWorker(
  bitmap: ImageBitmap
): Promise<{ blob: Blob; width: number; height: number }> {
  const worker = getImageWorker();
  if (!worker) {
    bitmap.close();
    return Promise.reject(new Error('Worker unavailable'));
  }

  return new Promise((resolve, reject) => {
    const id = ++workerJobCounter;
    const timerId = window.setTimeout(() => {
      const pending = workerResolvers.get(id);
      if (!pending) return;
      workerResolvers.delete(id);
      pending.reject(new Error('Image worker timeout'));
    }, 6000);

    workerResolvers.set(id, { resolve, reject, timerId });
    try {
      worker.postMessage({ id, bitmap }, [bitmap]);
    } catch (err) {
      window.clearTimeout(timerId);
      workerResolvers.delete(id);
      bitmap.close();
      reject(err);
    }
  });
}

async function decodeImageUrl(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const finish = () =>
        resolve({
          width: img.naturalWidth || 256,
          height: img.naturalHeight || 256,
        });
      if (typeof img.decode === 'function') {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };
    img.onerror = () => resolve({ width: 256, height: 256 });
    img.src = url;
  });
}

async function processOnMainThreadFallback(
  src: string,
  prefetchedBlob?: Blob
): Promise<ProcessedAsset> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    let tempBlobUrl: string | null = null;
    const cleanupTemp = () => {
      if (tempBlobUrl) {
        URL.revokeObjectURL(tempBlobUrl);
        tempBlobUrl = null;
      }
    };

    img.onload = async () => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode().catch(() => undefined);
        }
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height) {
          cleanupTemp();
          resolve({ url: src, width: 256, height: 256 });
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          cleanupTemp();
          resolve({ url: src, width, height });
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        cleanupTemp();

        const imageData = ctx.getImageData(0, 0, width, height);
        const { data } = imageData;
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
          resolve({ url: src, width, height });
          return;
        }

        ctx.putImageData(imageData, 0, 0);
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) {
          resolve({ url: src, width, height });
          return;
        }
        outCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

        outCanvas.toBlob(
          async (blob) => {
            if (!blob) {
              try {
                const dataUrl = outCanvas.toDataURL('image/png');
                resolve({ url: dataUrl, width: cropW, height: cropH });
              } catch {
                resolve({ url: src, width: cropW, height: cropH });
              }
              return;
            }
            const url = URL.createObjectURL(blob);
            await decodeImageUrl(url);
            resolve({ url, width: cropW, height: cropH });
          },
          'image/png'
        );
      } catch {
        cleanupTemp();
        resolve({ url: src, width: 256, height: 256 });
      }
    };

    img.onerror = () => {
      cleanupTemp();
      resolve({ url: src, width: 256, height: 256 });
    };

    if (prefetchedBlob) {
      tempBlobUrl = URL.createObjectURL(prefetchedBlob);
      img.src = tempBlobUrl;
    } else {
      // Same-origin load WITHOUT crossOrigin so session cookies are preserved
      img.src = src;
    }
  });
}

export function getCachedProcessedAsset(src: string): ProcessedAsset | undefined {
  return processedCache.get(src);
}

export function loadAndProcessAsset(src: string): Promise<ProcessedAsset> {
  const existing = processedCache.get(src);
  if (existing) return Promise.resolve(existing);

  const pending = inFlightCache.get(src);
  if (pending) return pending;

  const task = (async (): Promise<ProcessedAsset> => {
    try {
      let sourceBlob: Blob | undefined;
      try {
        // Fetch on the main thread with same-origin credentials so authenticated previews succeed
        const response = await fetch(src, { credentials: 'same-origin' });
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0 && (!blob.type || blob.type.startsWith('image/'))) {
            sourceBlob = blob;
          }
        }

        if (sourceBlob && typeof createImageBitmap === 'function') {
          const bitmap = await createImageBitmap(sourceBlob);
          const { blob: processedBlob, width, height } =
            await processBitmapWithWorker(bitmap);
          const objectUrl = URL.createObjectURL(processedBlob);
          await decodeImageUrl(objectUrl);
          const asset: ProcessedAsset = { url: objectUrl, width, height };
          processedCache.set(src, asset);
          return asset;
        }
      } catch {
        // Fall through cleanly to main-thread fallback
      }

      try {
        const fallback = await processOnMainThreadFallback(src, sourceBlob);
        processedCache.set(src, fallback);
        return fallback;
      } catch {
        const raw: ProcessedAsset = { url: src, width: 256, height: 256 };
        processedCache.set(src, raw);
        return raw;
      }
    } finally {
      inFlightCache.delete(src);
    }
  })();

  inFlightCache.set(src, task);
  return task;
}

function injectPreloadHint(href: string): void {
  if (typeof document === 'undefined') return;
  const selector = `link[rel="preload"][href="${href}"]`;
  if (document.head.querySelector(selector)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  document.head.appendChild(link);
}

function scheduleIdle(cb: () => void): void {
  if (typeof window === 'undefined') return;
  const win = window as Window & {
    requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(cb, { timeout: 350 });
  } else {
    window.setTimeout(cb, 45);
  }
}

export function startBackgroundAssetPreload(): void {
  if (preloadStarted || typeof window === 'undefined') return;
  preloadStarted = true;

  const entries = Object.values(FOOD_IMAGE_ASSETS);
  const criticalSrcs = [
    HYDRATION_GLASS_SRC,
    ...entries.filter((a) => a.priority === 'critical').map((a) => a.src),
  ];
  const normalSrcs = entries
    .filter((a) => a.priority !== 'critical')
    .map((a) => a.src);

  criticalSrcs.forEach(injectPreloadHint);

  const queue = [...criticalSrcs, ...normalSrcs];
  let cursor = 0;

  const processNext = () => {
    if (cursor >= queue.length) return;
    const src = queue[cursor++];
    loadAndProcessAsset(src).finally(() => {
      scheduleIdle(processNext);
    });
  };

  scheduleIdle(processNext);
  window.setTimeout(() => scheduleIdle(processNext), 120);
}
