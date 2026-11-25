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
export const MAX_VISIBLE_PER_SECTOR = 18;
export const BOWL_CENTER = 50;
export const SAFE_BOWL_RADIUS = 50;
export const LEFT_SPLIT_BOWL_Y = 64;
export const RIGHT_SPLIT_BOWL_Y = 50;
export const FATS_SAFE_RADIUS = 36;
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
  lechuga: 'base',
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
  casabe: 'base',

  // Medium-volume foods
  mango: 'medium',
  aguacate: 'medium',
  cambur: 'medium',
  zanahoria: 'medium',
  pimenton: 'medium',
  berenjena: 'medium',
  uvas: 'medium',
  melon: 'medium',
  queso: 'medium',
  leche: 'medium',
  yogurt: 'medium',
  atun: 'medium',
  yuca: 'medium',
  platano: 'medium',
  papa: 'medium',
  pasta: 'medium',
  cotufas: 'medium',
  jojoto: 'medium',

  // Smaller / round / topping detail foods (higher z-index)
  tomate: 'detail',
  pepino: 'detail',
  remolacha: 'detail',
  guayaba: 'detail',
  manzana: 'detail',
  parchita: 'detail',
  naranja: 'detail',
  mandarina: 'detail',
  fresa: 'detail',
  durazno: 'detail',
  cebolla: 'detail',
  huevo: 'detail',
  caraotas: 'detail',
  lentejas: 'detail',
  mani: 'detail',
  aceite: 'detail',
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
 * - vegetables: top-left (x <= 50 - dividerMargin, y <= LEFT_SPLIT_BOWL_Y - dividerMargin)
 * - fruits: bottom-left (x <= 50 - dividerMargin, y >= LEFT_SPLIT_BOWL_Y + dividerMargin)
 * - cereals: top-right (x >= 50 + dividerMargin, y <= RIGHT_SPLIT_BOWL_Y - dividerMargin)
 * - protein: bottom-right (x >= 50 + dividerMargin, y >= RIGHT_SPLIT_BOWL_Y + dividerMargin)
 * - fats: standalone circular mini-plate centered at (50, 50)
 */
export function clampToSectorSafeZone(
  sector: PlateFoodSector,
  rawBowlX: number,
  rawBowlY: number,
  options?: SafeZoneOptions
): { bowlX: number; bowlY: number } {
  const outerRadius = options?.outerRadius ?? OUTER_OVERFLOW_RADIUS;
  const dividerMargin = options?.dividerMargin ?? DIVIDER_MARGIN;

  if (sector === 'fats') {
    const fatsRadius = Math.min(outerRadius, FATS_SAFE_RADIUS);
    const dx = rawBowlX - BOWL_CENTER;
    const dy = rawBowlY - BOWL_CENTER;
    const dist = Math.hypot(dx, dy);
    if (dist <= fatsRadius || dist === 0) {
      return { bowlX: rawBowlX, bowlY: rawBowlY };
    }
    const factor = fatsRadius / dist;
    return {
      bowlX: BOWL_CENTER + dx * factor,
      bowlY: BOWL_CENTER + dy * factor,
    };
  }

  const maxXFromDivider =
    BOWL_CENTER +
    Math.sqrt(Math.max(0, outerRadius * outerRadius - dividerMargin * dividerMargin));

  if (sector === 'vegetables') {
    const bowlX = clamp(
      rawBowlX,
      BOWL_CENTER - outerRadius,
      BOWL_CENTER - dividerMargin
    );
    const dx = bowlX - BOWL_CENTER;
    const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
    const maxAllowedY = Math.min(BOWL_CENTER + maxDy, LEFT_SPLIT_BOWL_Y - dividerMargin);
    const minAllowedY = Math.min(BOWL_CENTER - maxDy, maxAllowedY);
    const bowlY = clamp(rawBowlY, minAllowedY, maxAllowedY);
    return { bowlX, bowlY };
  }

  if (sector === 'fruits') {
    const minFruitY = LEFT_SPLIT_BOWL_Y + dividerMargin;
    const minFruitDy = minFruitY - BOWL_CENTER;
    const maxFruitDx = Math.sqrt(
      Math.max(0, outerRadius * outerRadius - minFruitDy * minFruitDy)
    );
    const minBowlX = Math.min(BOWL_CENTER - dividerMargin, BOWL_CENTER - maxFruitDx);
    const bowlX = clamp(rawBowlX, minBowlX, BOWL_CENTER - dividerMargin);
    const dx = bowlX - BOWL_CENTER;
    const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
    const maxAllowedY = Math.max(minFruitY, BOWL_CENTER + maxDy);
    const bowlY = clamp(rawBowlY, minFruitY, maxAllowedY);
    return { bowlX, bowlY };
  }

  if (sector === 'cereals') {
    const bowlX = clamp(rawBowlX, BOWL_CENTER + dividerMargin, maxXFromDivider);
    const dx = bowlX - BOWL_CENTER;
    const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
    const bowlY = clamp(rawBowlY, BOWL_CENTER - maxDy, RIGHT_SPLIT_BOWL_Y - dividerMargin);
    return { bowlX, bowlY };
  }

  // protein (bottom-right quadrant)
  const bowlX = clamp(rawBowlX, BOWL_CENTER + dividerMargin, maxXFromDivider);
  const dx = bowlX - BOWL_CENTER;
  const maxDy = Math.sqrt(Math.max(0, outerRadius * outerRadius - dx * dx));
  const bowlY = clamp(rawBowlY, RIGHT_SPLIT_BOWL_Y + dividerMargin, BOWL_CENTER + maxDy);
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
  if (sector === 'fats') {
    return { localX: bowlX, localY: bowlY };
  }
  if (sector === 'vegetables') {
    return { localX: bowlX * 2, localY: (bowlY / LEFT_SPLIT_BOWL_Y) * 100 };
  }
  if (sector === 'fruits') {
    return {
      localX: bowlX * 2,
      localY: ((bowlY - LEFT_SPLIT_BOWL_Y) / (100 - LEFT_SPLIT_BOWL_Y)) * 100,
    };
  }
  if (sector === 'cereals') {
    return { localX: (bowlX - 50) * 2, localY: (bowlY / RIGHT_SPLIT_BOWL_Y) * 100 };
  }
  return {
    localX: (bowlX - 50) * 2,
    localY: ((bowlY - RIGHT_SPLIT_BOWL_Y) / (100 - RIGHT_SPLIT_BOWL_Y)) * 100,
  };
}

/**
 * Inverse of bowlToSectorLocal: converts sector-local percentage (0..100) back to bowl percentage (0..100).
 */
export function sectorLocalToBowl(
  sector: PlateFoodSector,
  localX: number,
  localY: number
): { bowlX: number; bowlY: number } {
  if (sector === 'fats') {
    return { bowlX: localX, bowlY: localY };
  }
  if (sector === 'vegetables') {
    return { bowlX: localX / 2, bowlY: (localY / 100) * LEFT_SPLIT_BOWL_Y };
  }
  if (sector === 'fruits') {
    return {
      bowlX: localX / 2,
      bowlY: LEFT_SPLIT_BOWL_Y + (localY / 100) * (100 - LEFT_SPLIT_BOWL_Y),
    };
  }
  if (sector === 'cereals') {
    return { bowlX: 50 + localX / 2, bowlY: (localY / 100) * RIGHT_SPLIT_BOWL_Y };
  }
  return {
    bowlX: 50 + localX / 2,
    bowlY: RIGHT_SPLIT_BOWL_Y + (localY / 100) * (100 - RIGHT_SPLIT_BOWL_Y),
  };
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
    ...placements.vegetables.map((p) => p.zIndex),
    ...placements.fruits.map((p) => p.zIndex),
    ...placements.cereals.map((p) => p.zIndex),
    ...placements.protein.map((p) => p.zIndex),
    ...placements.fats.map((p) => p.zIndex)
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
  const spreadX = (rng() - 0.5) * 20;
  const spreadY = (rng() - 0.5) * 20;

  if (sector === 'vegetables') {
    return { bowlX: 27 + spreadX * 0.85, bowlY: 36 + spreadY * 0.9 };
  }
  if (sector === 'fruits') {
    return { bowlX: 31 + spreadX * 0.65, bowlY: 81 + spreadY * 0.45 };
  }
  if (sector === 'cereals') {
    return { bowlX: 73 + spreadX * 0.8, bowlY: 27 + spreadY * 0.8 };
  }
  if (sector === 'protein') {
    return { bowlX: 73 + spreadX * 0.8, bowlY: 73 + spreadY * 0.8 };
  }
  // fats circular mini-plate
  return { bowlX: 47 + spreadX * 0.7, bowlY: 48 + spreadY * 0.7 };
}

/**
 * Computes natural organic plating coordinates, cumulative z-index, organic angle (-14deg..14deg),
 * and consistent standard scale without shrinking as more foods are added.
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

    // Random pixel scatter of +/- 8px to 20px around the cursor/finger drop point
    const offsetRadiusPx = sector === 'fats' ? 4 + rng() * 8 : 10 + rng() * 14;
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
  const baseScale = sector === 'fats' ? 1.15 : STANDARD_FOOD_SCALE;
  const scale = Math.round((baseScale + (rng() - 0.5) * 0.06) * 1000) / 1000;

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

function generateSectorCollageAnchors(
  sector: PlateFoodSector,
  count: number,
  outerRadiusLimit: number
): Array<{ bowlX: number; bowlY: number; layerBand: 'outer' | 'mid' | 'inner' }> {
  if (count <= 0) return [];

  if (sector === 'fats') {
    if (count === 1) {
      return [{ bowlX: 48, bowlY: 49, layerBand: 'inner' }];
    }
    return Array.from({ length: count }, (_, i) => {
      const theta = (i / count) * Math.PI * 2;
      const r = i % 2 === 0 ? 18 : 11;
      return {
        bowlX: 48 + r * Math.cos(theta),
        bowlY: 49 + r * Math.sin(theta),
        layerBand: i === count - 1 ? ('inner' as const) : ('outer' as const),
      };
    });
  }

  const rimRadius = Math.min(46.5, outerRadiusLimit - 4.2);

  // Angular spans in standard screen polar coords (0 = right, +PI/2 = bottom, PI = left, 1.5*PI = top)
  let startAngle: number;
  let endAngle: number;
  let singleRadius = 29;

  if (sector === 'vegetables') {
    // Top-left ~34%: from ~0.95*PI (just above left split) to ~1.43*PI (top)
    startAngle = 0.96 * Math.PI;
    endAngle = 1.43 * Math.PI;
    singleRadius = 28;
  } else if (sector === 'fruits') {
    // Bottom-left ~16%: from ~0.58*PI (bottom) to ~0.82*PI (below left split)
    startAngle = 0.58 * Math.PI;
    endAngle = 0.82 * Math.PI;
    singleRadius = 35;
  } else if (sector === 'cereals') {
    // Top-right 25%: from -0.43*PI to -0.07*PI
    startAngle = -0.43 * Math.PI;
    endAngle = -0.07 * Math.PI;
  } else {
    // Bottom-right 25% (protein): from +0.07*PI to +0.43*PI
    startAngle = 0.07 * Math.PI;
    endAngle = 0.43 * Math.PI;
  }

  const centerAngle = (startAngle + endAngle) / 2;

  if (count === 1) {
    return [{ ...polarToBowl(singleRadius, centerAngle), layerBand: 'inner' }];
  }
  if (count === 2) {
    const quarterSpan = (endAngle - startAngle) * 0.28;
    return [
      { ...polarToBowl(34, centerAngle - quarterSpan), layerBand: 'outer' },
      { ...polarToBowl(30, centerAngle + quarterSpan), layerBand: 'inner' },
    ];
  }
  if (count === 3) {
    const thirdSpan = (endAngle - startAngle) * 0.36;
    return [
      { ...polarToBowl(rimRadius - 3.5, centerAngle - thirdSpan), layerBand: 'outer' },
      { ...polarToBowl(rimRadius - 3.5, centerAngle + thirdSpan), layerBand: 'outer' },
      { ...polarToBowl(sector === 'fruits' ? 32 : 24, centerAngle), layerBand: 'inner' },
    ];
  }

  const outerCount = Math.ceil(count * 0.52);
  const innerCount = count - outerCount;
  const outerAngles = spreadOrderFromEnds(linspaceAngles(startAngle, endAngle, outerCount));
  const innerAngles = spreadOrderFromEnds(
    linspaceAngles(
      centerAngle - (endAngle - startAngle) * 0.34,
      centerAngle + (endAngle - startAngle) * 0.34,
      innerCount
    )
  );

  return [
    ...outerAngles.map((theta, idx) => ({
      ...polarToBowl(idx % 2 === 0 ? rimRadius - 1.8 : rimRadius - 5, theta),
      layerBand: 'outer' as const,
    })),
    ...innerAngles.map((theta, idx) => ({
      ...polarToBowl(
        sector === 'fruits' ? (idx % 2 === 0 ? 31 : 34) : idx % 2 === 0 ? 21 : 26,
        theta
      ),
      layerBand: 'inner' as const,
    })),
  ];
}

function computeAdaptiveScaleForCount(
  count: number,
  tier: FoodVolumeTier,
  rng: () => number,
  sector: PlateFoodSector
): number {
  const variation = (rng() - 0.5) * 0.1;
  const sectorScaleMult = sector === 'fats' ? 0.8 : sector === 'fruits' ? 0.92 : 1;

  if (count <= 2) {
    const countBase = count === 1 ? 1.54 : 1.44;
    const tierBoost = tier === 'base' ? 0.08 : tier === 'medium' ? 0.02 : -0.04;
    return (
      Math.round(clamp((countBase + tierBoost + variation) * sectorScaleMult, 0.95, 1.66) * 1000) /
      1000
    );
  }

  const gentleDensity = clamp((count - 3) / 9, 0, 1);
  const tierBase =
    tier === 'base'
      ? 1.4 - gentleDensity * 0.08
      : tier === 'medium'
        ? 1.31 - gentleDensity * 0.07
        : 1.24 - gentleDensity * 0.06;

  return (
    Math.round(clamp((tierBase + variation) * sectorScaleMult, 0.9, 1.48) * 1000) / 1000
  );
}

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
    const scale = computeAdaptiveScaleForCount(items.length, meta.tier, rng, sector);

    const sign = rank % 2 === 0 ? 1 : -1;
    const rotation = Math.round(sign * (3 + rng() * 11) * 10) / 10;

    const rawBowlX = anchor.bowlX + (rng() * 2 - 1) * jitterPct;
    const rawBowlY = anchor.bowlY + (rng() * 2 - 1) * jitterPct;

    const adaptiveDividerMargin = clamp(
      DIVIDER_MARGIN + (scale - 1.15) * 3.5,
      DIVIDER_MARGIN,
      10.2
    );

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

export function reorganizarPlatoCoherente(
  placements: Record<PlateFoodSector, PlatedTransform[]>,
  options?: ReorganizeOptions
): Record<PlateFoodSector, PlatedTransform[]> {
  return {
    vegetables: reorganizarSectorCoherente(placements.vegetables, 'vegetables', options),
    fruits: reorganizarSectorCoherente(placements.fruits, 'fruits', options),
    cereals: reorganizarSectorCoherente(placements.cereals, 'cereals', options),
    protein: reorganizarSectorCoherente(placements.protein, 'protein', options),
    fats: reorganizarSectorCoherente(placements.fats, 'fats', options),
  };
}

export function getStackDepthStyle(
  indexInSector: number,
  totalInSector: number
): { depthScale: number; brightness: number } {
  const depthFromTop = Math.max(0, totalInSector - 1 - indexInSector);
  const depthScale = Math.max(0.97, Math.round((1 - depthFromTop * 0.004) * 1000) / 1000);
  const brightness = Math.max(0.93, Math.round((1 - depthFromTop * 0.009) * 1000) / 1000);
  return { depthScale, brightness };
}
