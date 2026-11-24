import { SectorId } from '../data/foods';

export type PlateFoodSector = Exclude<SectorId, 'hydration'>;

export interface DropPointContext {
  clientX: number;
  clientY: number;
  bowlRect?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export interface PlatedTransform {
  instanceId: string;
  foodId: string;
  sector: PlateFoodSector;
  /** Local percentage X (0..100) inside the sector dropzone */
  localX: number;
  /** Local percentage Y (0..100) inside the sector dropzone */
  localY: number;
  /** Cumulative layer order (starts at 10 and increments by +1 per item added to the plate) */
  zIndex: number;
  /** Slight organic rotation in degrees [-15, 15] */
  rotation: number;
  /** Slight organic scale variation [0.95, 1.05] */
  scale: number;
}

export const BASE_PLATE_Z_INDEX = 10;
export const MAX_VISIBLE_PER_SECTOR = 12;
export const BOWL_CENTER = 50;
export const SAFE_BOWL_RADIUS = 50;
export const OUTER_EXPANSION_MARGIN_PX = 24;
export const DEFAULT_BOWL_DIAMETER_PX = 656;
export const OUTER_OVERFLOW_RADIUS = 54.5;
export const DIVIDER_MARGIN = 7.5;
export const DRAG_THRESHOLD_PX = 5;
export const MIN_FOOD_SCALE = 0.7;
export const MAX_FOOD_SCALE = 2.4;
export const STANDARD_FOOD_SCALE = 1.44;
export const ROTATION_INNER_RATIO = 0.6;

export type GripZone = 'drag' | 'rotate';
export type FoodVolumeTier = 'base' | 'medium' | 'detail';

export interface RadialGripResult {
  zone: GripZone;
  centerX: number;
  centerY: number;
  radius: number;
  dist: number;
}

export interface SafeZoneOptions {
  outerRadius?: number;
  dividerMargin?: number;
}

export interface ReorganizeOptions {
  rng?: () => number;
  maxExpansionPx?: number;
  bowlDiameterPx?: number;
}

const FOOD_VOLUME_TIERS: Record<string, FoodVolumeTier> = {
  // Voluminous / base bed foods (lower z-index, larger scale)
  repollo: 'base',
  brocoli: 'base',
  auyama: 'base',
  patilla: 'base',
  pina: 'base',
  lechosa: 'base',
  guanabana: 'base',
  pollo: 'base',
  carne: 'base',
  sardinas: 'base',
  arroz: 'base',
  arepa: 'base',
  avena: 'base',
  pan: 'base',

  // Medium-volume foods
  mango: 'medium',
  aguacate: 'medium',
  cambur: 'medium',
  zanahoria: 'medium',
  pimenton: 'medium',
  berenjena: 'medium',
  queso: 'medium',
  leche: 'medium',
  yuca: 'medium',
  platano: 'medium',
  papa: 'medium',

  // Smaller / round / topping detail foods (higher z-index)
  tomate: 'detail',
  pepino: 'detail',
  remolacha: 'detail',
  guayaba: 'detail',
  manzana: 'detail',
  parchita: 'detail',
  naranja: 'detail',
  huevo: 'detail',
  caraotas: 'detail',
  lentejas: 'detail',
};

const TIER_WEIGHT: Record<FoodVolumeTier, number> = {
  base: 0,
  medium: 1,
  detail: 2,
};

export function getFoodVolumeTier(foodId: string): FoodVolumeTier {
  return FOOD_VOLUME_TIERS[foodId] ?? 'medium';
}

/**
 * Computes radial grip zone from an element's bounding rect and pointer coordinates.
 * Inner core (dist <= R * 0.6) activates translation; outer ring (dist > R * 0.6) activates rotation.
 */
export function detectRadialGripZone(
  rect: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number
): RadialGripResult {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radius = Math.min(rect.width, rect.height) / 2;
  const dist = Math.hypot(clientX - centerX, clientY - centerY);
  const zone: GripZone = dist <= radius * ROTATION_INNER_RATIO ? 'drag' : 'rotate';
  return { zone, centerX, centerY, radius, dist };
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Clamps normalized bowl coordinates (0..100) inside the target sector.
 * Allows controlled overflow over the outer rim (OUTER_OVERFLOW_RADIUS) while
 * strictly enforcing internal straight dividers between groups.
 */
export function clampToSectorSafeZone(
  sector: PlateFoodSector,
  rawBowlX: number,
  rawBowlY: number,
  options?: SafeZoneOptions
): { bowlX: number; bowlY: number } {
  const outerRadius = options?.outerRadius ?? OUTER_OVERFLOW_RADIUS;
  const dividerMargin = options?.dividerMargin ?? DIVIDER_MARGIN;
  const maxXFromDivider =
    BOWL_CENTER + Math.sqrt(Math.max(0, outerRadius * outerRadius - dividerMargin * dividerMargin));

  if (sector === 'shield') {
    const bowlX = clamp(
      rawBowlX,
      BOWL_CENTER - outerRadius,
      BOWL_CENTER - dividerMargin
    );
    const dx = bowlX - BOWL_CENTER;
    const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
    const bowlY = clamp(rawBowlY, BOWL_CENTER - maxDy, BOWL_CENTER + maxDy);
    return { bowlX, bowlY };
  }

  if (sector === 'protein') {
    const bowlX = clamp(rawBowlX, BOWL_CENTER + dividerMargin, maxXFromDivider);
    const dx = bowlX - BOWL_CENTER;
    const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
    const bowlY = clamp(rawBowlY, BOWL_CENTER - maxDy, BOWL_CENTER - dividerMargin);
    return { bowlX, bowlY };
  }

  // energy (bottom-right quadrant)
  const bowlX = clamp(rawBowlX, BOWL_CENTER + dividerMargin, maxXFromDivider);
  const dx = bowlX - BOWL_CENTER;
  const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
  const bowlY = clamp(rawBowlY, BOWL_CENTER + dividerMargin, BOWL_CENTER + maxDy);
  return { bowlX, bowlY };
}

/**
 * Converts normalized circular bowl coordinates (0..100) to the sector's local percentage (0..100).
 */
export function bowlToSectorLocal(
  sector: PlateFoodSector,
  bowlX: number,
  bowlY: number
): { localX: number; localY: number } {
  if (sector === 'shield') {
    return { localX: bowlX * 2, localY: bowlY };
  }
  if (sector === 'protein') {
    return { localX: (bowlX - 50) * 2, localY: bowlY * 2 };
  }
  return { localX: (bowlX - 50) * 2, localY: (bowlY - 50) * 2 };
}

/**
 * Inverse of bowlToSectorLocal: converts sector-local percentage (0..100) back to bowl percentage (0..100).
 */
export function sectorLocalToBowl(
  sector: PlateFoodSector,
  localX: number,
  localY: number
): { bowlX: number; bowlY: number } {
  if (sector === 'shield') {
    return { bowlX: localX / 2, bowlY: localY };
  }
  if (sector === 'protein') {
    return { bowlX: 50 + localX / 2, bowlY: localY / 2 };
  }
  return { bowlX: 50 + localX / 2, bowlY: 50 + localY / 2 };
}

/**
 * Computes clamped sector-local coordinates when dragging a plated food item by a pixel delta.
 */
export function computeMovedSectorLocal(params: {
  sector: PlateFoodSector;
  startBowlX: number;
  startBowlY: number;
  deltaClientX: number;
  deltaClientY: number;
  bowlWidth: number;
  bowlHeight: number;
}): { localX: number; localY: number } {
  const { sector, startBowlX, startBowlY, deltaClientX, deltaClientY, bowlWidth, bowlHeight } =
    params;
  if (bowlWidth <= 0 || bowlHeight <= 0) {
    return bowlToSectorLocal(sector, startBowlX, startBowlY);
  }
  const rawBowlX = startBowlX + (deltaClientX / bowlWidth) * 100;
  const rawBowlY = startBowlY + (deltaClientY / bowlHeight) * 100;
  const { bowlX, bowlY } = clampToSectorSafeZone(sector, rawBowlX, rawBowlY);
  const { localX, localY } = bowlToSectorLocal(sector, bowlX, bowlY);
  return {
    localX: Math.round(localX * 100) / 100,
    localY: Math.round(localY * 100) / 100,
  };
}

export function clampFoodScale(scale: number): number {
  return Math.round(clamp(scale, MIN_FOOD_SCALE, MAX_FOOD_SCALE) * 1000) / 1000;
}

/**
 * Computes the next scale for a plated food item from a mouse wheel deltaY.
 * Negative deltaY (scroll up) increases size; positive deltaY (scroll down) decreases size.
 */
export function computeWheelScale(currentScale: number, deltaY: number): number {
  if (!Number.isFinite(deltaY) || deltaY === 0) {
    return clampFoodScale(currentScale);
  }
  const normalizedDelta = clamp(-deltaY / 100, -1, 1);
  return clampFoodScale(currentScale + normalizedDelta * 0.12);
}

/**
 * Computes the updated 360-degree rotation angle from pointer movement around the item's center.
 */
export function computeRotatedAngle(
  startRotationDeg: number,
  startPointerAngleDeg: number,
  currentPointerAngleDeg: number
): number {
  const raw = startRotationDeg + (currentPointerAngleDeg - startPointerAngleDeg);
  const normalized = ((raw % 360) + 360) % 360;
  return Math.round(normalized * 10) / 10;
}

/**
 * Assigns maxZIndex + 1 across all plated items to the specified food instance so it renders on top.
 */
export function bringTransformToFront(
  placements: Record<PlateFoodSector, PlatedTransform[]>,
  sector: PlateFoodSector,
  instanceId: string
): { updated: Record<PlateFoodSector, PlatedTransform[]>; nextZIndex: number } {
  const maxZ = Math.max(
    BASE_PLATE_Z_INDEX - 1,
    ...placements.shield.map((p) => p.zIndex),
    ...placements.protein.map((p) => p.zIndex),
    ...placements.energy.map((p) => p.zIndex)
  );
  const nextZIndex = maxZ + 1;
  return {
    nextZIndex,
    updated: {
      ...placements,
      [sector]: placements[sector].map((item) =>
        item.instanceId === instanceId ? { ...item, zIndex: nextZIndex } : item
      ),
    },
  };
}

function getOrganicSectorFallbackCenter(
  sector: PlateFoodSector,
  rng: () => number
): { bowlX: number; bowlY: number } {
  const spreadX = (rng() - 0.5) * 26;
  const spreadY = (rng() - 0.5) * 32;

  if (sector === 'shield') {
    return { bowlX: 25 + spreadX * 0.9, bowlY: 50 + spreadY * 1.45 };
  }
  if (sector === 'protein') {
    return { bowlX: 73 + spreadX * 0.8, bowlY: 27 + spreadY * 0.8 };
  }
  return { bowlX: 73 + spreadX * 0.8, bowlY: 73 + spreadY * 0.8 };
}

/**
 * Computes natural organic plating coordinates, cumulative z-index, organic angle (-14deg..14deg),
 * and consistent standard large scale without shrinking as more foods are added.
 */
export function createPlatedTransform(params: {
  instanceId: string;
  foodId: string;
  sector: PlateFoodSector;
  zIndex: number;
  dropContext?: DropPointContext;
  rng?: () => number;
}): PlatedTransform {
  const rng = params.rng ?? Math.random;
  const { sector, dropContext } = params;

  let baseBowlX: number;
  let baseBowlY: number;

  const hasValidPointerPoint =
    dropContext &&
    dropContext.bowlRect &&
    dropContext.bowlRect.width > 0 &&
    dropContext.bowlRect.height > 0 &&
    (dropContext.clientX !== 0 || dropContext.clientY !== 0);

  if (hasValidPointerPoint && dropContext?.bowlRect) {
    const { left, top, width, height } = dropContext.bowlRect;
    baseBowlX = ((dropContext.clientX - left) / width) * 100;
    baseBowlY = ((dropContext.clientY - top) / height) * 100;

    // Random pixel scatter of +/- 10px to 25px around the cursor/finger drop point
    const offsetRadiusPx = 10 + rng() * 15;
    const offsetAngle = rng() * Math.PI * 2;
    const dxPct = ((Math.cos(offsetAngle) * offsetRadiusPx) / width) * 100;
    const dyPct = ((Math.sin(offsetAngle) * offsetRadiusPx) / height) * 100;

    baseBowlX += dxPct;
    baseBowlY += dyPct;
  } else {
    const fallback = getOrganicSectorFallbackCenter(sector, rng);
    const offsetRadiusPct = 2 + rng() * 4;
    const offsetAngle = rng() * Math.PI * 2;
    baseBowlX = fallback.bowlX + Math.cos(offsetAngle) * offsetRadiusPct;
    baseBowlY = fallback.bowlY + Math.sin(offsetAngle) * offsetRadiusPct;
  }

  const { bowlX, bowlY } = clampToSectorSafeZone(sector, baseBowlX, baseBowlY);
  const { localX, localY } = bowlToSectorLocal(sector, bowlX, bowlY);

  const rotation = Math.round((rng() * 28 - 14) * 10) / 10;
  const scale = Math.round((STANDARD_FOOD_SCALE + (rng() - 0.5) * 0.06) * 1000) / 1000;

  return {
    instanceId: params.instanceId,
    foodId: params.foodId,
    sector,
    localX: Math.round(localX * 100) / 100,
    localY: Math.round(localY * 100) / 100,
    zIndex: params.zIndex,
    rotation,
    scale,
  };
}

/**
 * Interleaves array items from both ends inward so base anchors distribute across the full arc.
 */
function spreadOrderFromEnds<T>(arr: T[]): T[] {
  const result: T[] = [];
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    result.push(arr[left]);
    if (left !== right) {
      result.push(arr[right]);
    }
    left += 1;
    right -= 1;
  }
  return result;
}

function linspaceAngles(start: number, end: number, count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [(start + end) / 2];
  return Array.from({ length: count }, (_, i) => start + ((end - start) * i) / (count - 1));
}

function polarToBowl(r: number, theta: number): { bowlX: number; bowlY: number } {
  return {
    bowlX: BOWL_CENTER + r * Math.cos(theta),
    bowlY: BOWL_CENTER + r * Math.sin(theta),
  };
}

/**
 * Generates abundant, gap-free layered polar anchor points covering the full width and height
 * of each sector (50% semicircle for shield, 25% quadrants for protein/energy), including
 * perimeter anchors hugging the outer plate rim and central focal pockets for foreground layers.
 */
function generateSectorCollageAnchors(
  sector: PlateFoodSector,
  count: number,
  outerRadiusLimit: number
): Array<{ bowlX: number; bowlY: number; layerBand: 'outer' | 'mid' | 'inner' }> {
  if (count <= 0) return [];

  // Perimeter anchors sit close to the outer bowl edge so large foods cover the quadrant edge-to-edge
  const rimRadius = Math.min(46.5, outerRadiusLimit - 4.2);

  if (sector === 'shield') {
    // Left 50% semicircle: theta in [0.5 * PI (bottom), 1.5 * PI (top)], center = PI (far left)
    if (count === 1) {
      return [{ ...polarToBowl(24, Math.PI), layerBand: 'inner' }];
    }
    if (count === 2) {
      return [
        { ...polarToBowl(28, 1.24 * Math.PI), layerBand: 'outer' },
        { ...polarToBowl(29, 0.76 * Math.PI), layerBand: 'inner' },
      ];
    }
    if (count === 3) {
      return [
        { ...polarToBowl(38, 1.32 * Math.PI), layerBand: 'outer' },
        { ...polarToBowl(38, 0.68 * Math.PI), layerBand: 'outer' },
        { ...polarToBowl(23, Math.PI), layerBand: 'inner' },
      ];
    }

    if (count <= 6) {
      const outerCount = Math.ceil(count * 0.55);
      const innerCount = count - outerCount;
      const outerAngles = spreadOrderFromEnds(
        linspaceAngles(0.6 * Math.PI, 1.4 * Math.PI, outerCount)
      );
      const innerAngles = spreadOrderFromEnds(
        linspaceAngles(0.74 * Math.PI, 1.26 * Math.PI, innerCount)
      );

      return [
        ...outerAngles.map((theta, idx) => ({
          ...polarToBowl(idx % 2 === 0 ? rimRadius - 2 : rimRadius - 5.5, theta),
          layerBand: 'outer' as const,
        })),
        ...innerAngles.map((theta, idx) => ({
          ...polarToBowl(idx % 2 === 0 ? 19.5 : 24, theta),
          layerBand: 'inner' as const,
        })),
      ];
    }

    // 7 to 12+ items: lush 3-band collage bed (outer rim bed -> mid overlapping ring -> central hero pocket)
    const outerCount = Math.max(4, Math.round(count * 0.44));
    const midCount = Math.max(2, Math.round((count - outerCount) * 0.58));
    const innerCount = Math.max(1, count - outerCount - midCount);

    const outerAngles = spreadOrderFromEnds(
      linspaceAngles(0.57 * Math.PI, 1.43 * Math.PI, outerCount)
    );
    const midAngles = spreadOrderFromEnds(
      linspaceAngles(0.65 * Math.PI, 1.35 * Math.PI, midCount)
    );
    const innerAngles = spreadOrderFromEnds(
      linspaceAngles(0.75 * Math.PI, 1.25 * Math.PI, innerCount)
    );

    return [
      ...outerAngles.map((theta, idx) => ({
        ...polarToBowl(idx % 2 === 0 ? rimRadius - 1.2 : rimRadius - 4.8, theta),
        layerBand: 'outer' as const,
      })),
      ...midAngles.map((theta, idx) => ({
        ...polarToBowl(idx % 2 === 0 ? 29.5 : 33.5, theta),
        layerBand: 'mid' as const,
      })),
      ...innerAngles.map((theta, idx) => ({
        ...polarToBowl(idx % 2 === 0 ? 16.5 : 21, theta),
        layerBand: 'inner' as const,
      })),
    ];
  }

  // 25% quadrants: protein (top-right, center = -0.25*PI) & energy (bottom-right, center = +0.25*PI)
  const centerAngle = sector === 'protein' ? -0.25 * Math.PI : 0.25 * Math.PI;
  const outerHalfSpan = 0.178 * Math.PI;

  if (count === 1) {
    return [{ ...polarToBowl(29, centerAngle), layerBand: 'inner' }];
  }
  if (count === 2) {
    return [
      { ...polarToBowl(34, centerAngle - 0.115 * Math.PI), layerBand: 'outer' },
      { ...polarToBowl(30, centerAngle + 0.115 * Math.PI), layerBand: 'inner' },
    ];
  }
  if (count === 3) {
    return [
      { ...polarToBowl(rimRadius - 3.5, centerAngle - 0.145 * Math.PI), layerBand: 'outer' },
      { ...polarToBowl(rimRadius - 3.5, centerAngle + 0.145 * Math.PI), layerBand: 'outer' },
      { ...polarToBowl(22.5, centerAngle), layerBand: 'inner' },
    ];
  }

  if (count <= 6) {
    const outerCount = Math.ceil(count * 0.52);
    const innerCount = count - outerCount;
    const outerAngles = spreadOrderFromEnds(
      linspaceAngles(centerAngle - outerHalfSpan, centerAngle + outerHalfSpan, outerCount)
    );
    const innerAngles = spreadOrderFromEnds(
      linspaceAngles(centerAngle - 0.135 * Math.PI, centerAngle + 0.135 * Math.PI, innerCount)
    );

    return [
      ...outerAngles.map((theta, idx) => ({
        ...polarToBowl(idx % 2 === 0 ? rimRadius - 1.8 : rimRadius - 5, theta),
        layerBand: 'outer' as const,
      })),
      ...innerAngles.map((theta, idx) => ({
        ...polarToBowl(idx % 2 === 0 ? 20.5 : 25.5, theta),
        layerBand: 'inner' as const,
      })),
    ];
  }

  // 7 to 12+ items in a 25% quadrant: abundant 3-layer bodegon filling rim, mid-arc & inner corner
  const outerCount = Math.max(3, Math.round(count * 0.44));
  const midCount = Math.max(2, Math.round((count - outerCount) * 0.58));
  const innerCount = Math.max(1, count - outerCount - midCount);

  const outerAngles = spreadOrderFromEnds(
    linspaceAngles(centerAngle - outerHalfSpan, centerAngle + outerHalfSpan, outerCount)
  );
  const midAngles = spreadOrderFromEnds(
    linspaceAngles(centerAngle - 0.15 * Math.PI, centerAngle + 0.15 * Math.PI, midCount)
  );
  const innerAngles = spreadOrderFromEnds(
    linspaceAngles(centerAngle - 0.11 * Math.PI, centerAngle + 0.11 * Math.PI, innerCount)
  );

  return [
    ...outerAngles.map((theta, idx) => ({
      ...polarToBowl(idx % 2 === 0 ? rimRadius - 1.2 : rimRadius - 4.2, theta),
      layerBand: 'outer' as const,
    })),
    ...midAngles.map((theta, idx) => ({
      ...polarToBowl(idx % 2 === 0 ? 31.5 : 34.5, theta),
      layerBand: 'mid' as const,
    })),
    ...innerAngles.map((theta, idx) => ({
      ...polarToBowl(idx % 2 === 0 ? 19.5 : 23, theta),
      layerBand: 'inner' as const,
    })),
  ];
}

/**
 * Protected protagonist scale curve:
 * Keeps every food large and prominent regardless of quantity (3..12+ items),
 * favoring lush harmonious collage overlap over excessive shrinking.
 */
function computeAdaptiveScaleForCount(
  count: number,
  tier: FoodVolumeTier,
  rng: () => number
): number {
  const variation = (rng() - 0.5) * 0.1;

  if (count <= 2) {
    const countBase = count === 1 ? 1.54 : 1.44;
    const tierBoost = tier === 'base' ? 0.08 : tier === 'medium' ? 0.02 : -0.04;
    return Math.round(clamp(countBase + tierBoost + variation, 1.34, 1.66) * 1000) / 1000;
  }

  // Protected minimum protagonist floor across 3..12+ items (never shrinks into tiny icons)
  const gentleDensity = clamp((count - 3) / 9, 0, 1);
  const tierBase =
    tier === 'base'
      ? 1.4 - gentleDensity * 0.08 // stays 1.32..1.40
      : tier === 'medium'
        ? 1.31 - gentleDensity * 0.07 // stays 1.24..1.31
        : 1.24 - gentleDensity * 0.06; // stays 1.18..1.24

  return Math.round(clamp(tierBase + variation, 1.16, 1.48) * 1000) / 1000;
}

/**
 * Reorganizes a single plate sector into an abundant, structured collage / bodegón:
 * - Protected protagonist scale (never shrinks excessively even with 12 foods)
 * - Full-quadrant polar anchoring reaching the outer rim margin and close to internal dividers
 * - Volume-based z-index layering (bases anchored at bottom layers, details overlapping cleanly on top)
 * - Organic alternating rotations (-14deg..+14deg) with controlled jitter
 */
export function reorganizarSectorCoherente(
  items: PlatedTransform[],
  sector: PlateFoodSector,
  options?: ReorganizeOptions
): PlatedTransform[] {
  if (items.length === 0) return [];

  const rng = options?.rng ?? Math.random;
  const bowlDiameterPx =
    options?.bowlDiameterPx && options.bowlDiameterPx > 0
      ? options.bowlDiameterPx
      : DEFAULT_BOWL_DIAMETER_PX;
  const maxExpansionPx = clamp(options?.maxExpansionPx ?? OUTER_EXPANSION_MARGIN_PX, 18, 28);
  const expansionPct = (maxExpansionPx / bowlDiameterPx) * 100;
  const outerRadiusLimit = clamp(SAFE_BOWL_RADIUS + expansionPct, 52.5, 55);
  const jitterPct = (9 / bowlDiameterPx) * 100;

  // Base & voluminous foods go on lower z-index layers; medium & detail foods layer organically on top
  const sortedMeta = items
    .map((item, idx) => ({
      idx,
      tier: getFoodVolumeTier(item.foodId),
      tierWeight: TIER_WEIGHT[getFoodVolumeTier(item.foodId)],
    }))
    .sort((a, b) => a.tierWeight - b.tierWeight || a.idx - b.idx);

  const anchors = generateSectorCollageAnchors(sector, items.length, outerRadiusLimit);
  const nextItems = [...items];

  sortedMeta.forEach((meta, rank) => {
    const anchor = anchors[rank];
    const scale = computeAdaptiveScaleForCount(items.length, meta.tier, rng);

    // Subtle organic alternating tilt (-14deg..+14deg) so neighboring items compose naturally
    const sign = rank % 2 === 0 ? 1 : -1;
    const rotation = Math.round(sign * (3 + rng() * 11) * 10) / 10;

    // Controlled organic jitter around the quadrant anchor
    const rawBowlX = anchor.bowlX + (rng() * 2 - 1) * jitterPct;
    const rawBowlY = anchor.bowlY + (rng() * 2 - 1) * jitterPct;

    // Keep inner divider clearance lean (7.5..10.2) so quadrants fill edge-to-edge without crossing groups
    const adaptiveDividerMargin = clamp(DIVIDER_MARGIN + (scale - 1.15) * 3.5, DIVIDER_MARGIN, 10.2);

    const { bowlX, bowlY } = clampToSectorSafeZone(sector, rawBowlX, rawBowlY, {
      outerRadius: outerRadiusLimit,
      dividerMargin: adaptiveDividerMargin,
    });
    const { localX, localY } = bowlToSectorLocal(sector, bowlX, bowlY);

    nextItems[meta.idx] = {
      ...items[meta.idx],
      localX: Math.round(localX * 100) / 100,
      localY: Math.round(localY * 100) / 100,
      scale,
      rotation,
      zIndex: BASE_PLATE_Z_INDEX + rank,
    };
  });

  return nextItems;
}

/**
 * Analyzes all added foods across the three plate sectors and reorganizes them
 * into a harmonic, abundant organic collage with volume-layered depth.
 */
export function reorganizarPlatoCoherente(
  placements: Record<PlateFoodSector, PlatedTransform[]>,
  options?: ReorganizeOptions
): Record<PlateFoodSector, PlatedTransform[]> {
  return {
    shield: reorganizarSectorCoherente(placements.shield, 'shield', options),
    protein: reorganizarSectorCoherente(placements.protein, 'protein', options),
    energy: reorganizarSectorCoherente(placements.energy, 'energy', options),
  };
}

/**
 * Computes gentle layered depth cues so overlapping foods read sharply without shrinking base layers.
 */
export function getStackDepthStyle(
  indexInSector: number,
  totalInSector: number
): { depthScale: number; brightness: number } {
  const depthFromTop = Math.max(0, totalInSector - 1 - indexInSector);
  const depthScale = Math.max(0.97, Math.round((1 - depthFromTop * 0.004) * 1000) / 1000);
  const brightness = Math.max(0.93, Math.round((1 - depthFromTop * 0.009) * 1000) / 1000);
  return { depthScale, brightness };
}
