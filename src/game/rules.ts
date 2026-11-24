import {
  FilterTab,
  FoodCategory,
  FoodItem,
  GameMode,
  PlateState,
  SectorId,
  VolunteerStats,
} from '../data/foods';
import { MAX_VISIBLE_PER_SECTOR } from './platingPhysics';

export function createInitialPlate(): PlateState {
  return {
    shield: [],
    protein: null,
    extraProteins: [],
    energy: null,
    extraEnergies: [],
    hydration: null,
  };
}

export function getProteinItems(plate: PlateState): FoodItem[] {
  return [
    ...(plate.protein ? [plate.protein] : []),
    ...(plate.extraProteins ?? []),
  ];
}

export function getEnergyItems(plate: PlateState): FoodItem[] {
  return [
    ...(plate.energy ? [plate.energy] : []),
    ...(plate.extraEnergies ?? []),
  ];
}

export function createInitialVolunteerStats(): VolunteerStats {
  return {
    totalPlatesCompleted: 0,
    rainbowPlatesAchieved: 0,
    waterChosenCount: 0,
    distractorLessonsCount: 0,
    byMode: {
      breakfast: 0,
      lunch: 0,
      free: 0,
    },
    lastUpdatedIso: null,
  };
}

export function getExpectedSectorForCategory(
  category: FoodCategory
): SectorId | null {
  switch (category) {
    case 'vegetable':
    case 'fruit':
      return 'shield';
    case 'protein':
      return 'protein';
    case 'carb':
      return 'energy';
    case 'water':
      return 'hydration';
    case 'distractor':
      return null;
  }
}

export function getSectorLabel(sector: SectorId): string {
  switch (sector) {
    case 'shield':
      return 'Frutas y Hortalizas';
    case 'protein':
      return 'Proteínas';
    case 'energy':
      return 'Energía';
    case 'hydration':
      return 'Hidratación';
  }
}

export function isRainbowPlate(shieldItems: FoodItem[]): boolean {
  if (shieldItems.length < 2) return false;
  const colors = new Set(
    shieldItems.map((item) => item.rainbowColor).filter(Boolean)
  );
  return colors.size >= 2;
}

export function isPlateComplete(plate: PlateState): boolean {
  return (
    plate.shield.length >= 2 &&
    plate.protein !== null &&
    plate.energy !== null &&
    plate.hydration !== null
  );
}

export function countFilledSlots(plate: PlateState): number {
  return (
    Math.min(plate.shield.length, 2) +
    (plate.protein ? 1 : 0) +
    (plate.energy ? 1 : 0) +
    (plate.hydration ? 1 : 0)
  );
}

export interface PlacementResult {
  accepted: boolean;
  reason:
    | 'placed'
    | 'distractor'
    | 'wrong_sector'
    | 'sector_full'
    | 'duplicate_food';
  updatedPlate: PlateState;
  unlockedRainbow: boolean;
  isPlateComplete: boolean;
  message: string;
  targetSector: SectorId | null;
}

export function evaluateFoodPlacement(
  plate: PlateState,
  food: FoodItem,
  requestedSector?: SectorId
): PlacementResult {
  if (food.category === 'distractor' || food.targetSector === null) {
    return {
      accepted: false,
      reason: 'distractor',
      updatedPlate: plate,
      unlockedRainbow: false,
      isPlateComplete: isPlateComplete(plate),
      message: `${food.name}: ${food.speechText}`,
      targetSector: null,
    };
  }

  const expectedSector = food.targetSector;
  const targetSector = requestedSector ?? expectedSector;

  if (targetSector !== expectedSector) {
    return {
      accepted: false,
      reason: 'wrong_sector',
      updatedPlate: plate,
      unlockedRainbow: false,
      isPlateComplete: isPlateComplete(plate),
      message: `¡Casi! ${food.name} pertenece al grupo "${getSectorLabel(expectedSector)}".`,
      targetSector: expectedSector,
    };
  }

  if (expectedSector === 'shield') {
    const updatedShield = [...plate.shield, food].slice(-MAX_VISIBLE_PER_SECTOR);
    const updatedPlate: PlateState = {
      ...plate,
      shield: updatedShield,
    };
    const rainbowNow = isRainbowPlate(updatedShield);
    const completeNow = isPlateComplete(updatedPlate);

    let message = `${food.name}: ${food.speechText}`;
    if (updatedShield.length === 2) {
      if (rainbowNow) {
        message = `¡Plato Arcoíris! Combinaste dos colores distintos. ${food.speechText}`;
      } else {
        message = `¡Genial! Completaste el Escudo Protector. Consejo: prueba 2 colores distintos para lograr el Plato Arcoíris.`;
      }
    }

    return {
      accepted: true,
      reason: 'placed',
      updatedPlate,
      unlockedRainbow: rainbowNow && updatedShield.length === 2,
      isPlateComplete: completeNow,
      message,
      targetSector: 'shield',
    };
  }

  if (expectedSector === 'protein') {
    const existingProteins = getProteinItems(plate);
    const nextProteins = [...existingProteins, food].slice(-MAX_VISIBLE_PER_SECTOR);
    const updatedPlate: PlateState = {
      ...plate,
      protein: nextProteins[0] ?? null,
      extraProteins: nextProteins.slice(1),
    };
    return {
      accepted: true,
      reason: 'placed',
      updatedPlate,
      unlockedRainbow: false,
      isPlateComplete: isPlateComplete(updatedPlate),
      message: `${food.name}: ${food.speechText}`,
      targetSector: 'protein',
    };
  }

  if (expectedSector === 'energy') {
    const existingEnergies = getEnergyItems(plate);
    const nextEnergies = [...existingEnergies, food].slice(-MAX_VISIBLE_PER_SECTOR);
    const updatedPlate: PlateState = {
      ...plate,
      energy: nextEnergies[0] ?? null,
      extraEnergies: nextEnergies.slice(1),
    };
    return {
      accepted: true,
      reason: 'placed',
      updatedPlate,
      unlockedRainbow: false,
      isPlateComplete: isPlateComplete(updatedPlate),
      message: `${food.name}: ${food.speechText}`,
      targetSector: 'energy',
    };
  }

  // Hydration
  if (plate.hydration !== null) {
    return {
      accepted: false,
      reason: 'duplicate_food',
      updatedPlate: plate,
      unlockedRainbow: false,
      isPlateComplete: isPlateComplete(plate),
      message: '¡Tu vaso ya está lleno con Agua Pura fresca!',
      targetSector: 'hydration',
    };
  }

  const updatedPlate: PlateState = { ...plate, hydration: food };
  return {
    accepted: true,
    reason: 'placed',
    updatedPlate,
    unlockedRainbow: false,
    isPlateComplete: isPlateComplete(updatedPlate),
    message: `${food.name}: ${food.speechText}`,
    targetSector: 'hydration',
  };
}

export function removeFoodFromPlate(
  plate: PlateState,
  sector: SectorId,
  itemIndex?: number
): PlateState {
  if (sector === 'shield') {
    if (typeof itemIndex === 'number') {
      return {
        ...plate,
        shield: plate.shield.filter((_, idx) => idx !== itemIndex),
      };
    }
    return { ...plate, shield: plate.shield.slice(0, -1) };
  }
  if (sector === 'protein') {
    const items = getProteinItems(plate);
    const next =
      typeof itemIndex === 'number'
        ? items.filter((_, idx) => idx !== itemIndex)
        : items.slice(0, -1);
    return {
      ...plate,
      protein: next[0] ?? null,
      extraProteins: next.slice(1),
    };
  }
  if (sector === 'energy') {
    const items = getEnergyItems(plate);
    const next =
      typeof itemIndex === 'number'
        ? items.filter((_, idx) => idx !== itemIndex)
        : items.slice(0, -1);
    return {
      ...plate,
      energy: next[0] ?? null,
      extraEnergies: next.slice(1),
    };
  }
  return { ...plate, hydration: null };
}

export function filterFoods(
  foods: FoodItem[],
  mode: GameMode,
  tab: FilterTab
): FoodItem[] {
  const modeFoods =
    mode === 'free' ? foods : foods.filter((f) => f.modes.includes(mode));

  switch (tab) {
    case 'all':
      return modeFoods;
    case 'shield':
      return modeFoods.filter(
        (f) => f.category === 'vegetable' || f.category === 'fruit'
      );
    case 'protein':
      return modeFoods.filter((f) => f.category === 'protein');
    case 'energy':
      return modeFoods.filter((f) => f.category === 'carb');
    case 'drinks':
      return modeFoods.filter(
        (f) =>
          f.category === 'water' ||
          f.id === 'leche' ||
          f.id === 'refresco' ||
          f.id === 'jugo_cajita'
      );
    case 'processed':
      return modeFoods.filter((f) => f.category === 'distractor');
  }
}

export function recordCompletedPlateStats(
  prev: VolunteerStats,
  plate: PlateState,
  mode: GameMode,
  nowIso: string
): VolunteerStats {
  const rainbow = isRainbowPlate(plate.shield);
  const hadWater = plate.hydration?.id === 'agua';

  return {
    ...prev,
    totalPlatesCompleted: prev.totalPlatesCompleted + 1,
    rainbowPlatesAchieved: prev.rainbowPlatesAchieved + (rainbow ? 1 : 0),
    waterChosenCount: prev.waterChosenCount + (hadWater ? 1 : 0),
    byMode: {
      ...prev.byMode,
      [mode]: prev.byMode[mode] + 1,
    },
    lastUpdatedIso: nowIso,
  };
}

export function recordDistractorLessonStats(
  prev: VolunteerStats,
  nowIso: string
): VolunteerStats {
  return {
    ...prev,
    distractorLessonsCount: prev.distractorLessonsCount + 1,
    lastUpdatedIso: nowIso,
  };
}
