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
    vegetables: [],
    fruits: [],
    cereals: [],
    protein: [],
    fats: [],
    hydration: null,
  };
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
      return 'vegetables';
    case 'fruit':
      return 'fruits';
    case 'carb':
      return 'cereals';
    case 'protein':
      return 'protein';
    case 'fat':
      return 'fats';
    case 'water':
      return 'hydration';
    case 'distractor':
      return null;
  }
}

export function getSectorLabel(sector: SectorId): string {
  switch (sector) {
    case 'vegetables':
      return 'Vegetales';
    case 'fruits':
      return 'Frutas';
    case 'cereals':
      return 'Cereales';
    case 'protein':
      return 'Proteínas';
    case 'fats':
      return 'Grasas';
    case 'hydration':
      return 'Hidratación';
  }
}

export function isRainbowPlate(produceItems: FoodItem[]): boolean {
  if (produceItems.length < 2) return false;
  const colors = new Set(
    produceItems.map((item) => item.rainbowColor).filter(Boolean)
  );
  return colors.size >= 2;
}

export function isPlateComplete(plate: PlateState): boolean {
  return (
    plate.vegetables.length >= 1 &&
    plate.fruits.length >= 1 &&
    plate.cereals.length >= 1 &&
    plate.protein.length >= 1 &&
    plate.fats.length >= 1 &&
    plate.hydration !== null
  );
}

export function countFilledSlots(plate: PlateState): number {
  return (
    (plate.vegetables.length > 0 ? 1 : 0) +
    (plate.fruits.length > 0 ? 1 : 0) +
    (plate.cereals.length > 0 ? 1 : 0) +
    (plate.protein.length > 0 ? 1 : 0) +
    (plate.fats.length > 0 ? 1 : 0) +
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

  if (expectedSector === 'hydration') {
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

  const wasRainbow = isRainbowPlate([...plate.vegetables, ...plate.fruits]);
  const nextSectorItems = [...plate[expectedSector], food].slice(-MAX_VISIBLE_PER_SECTOR);
  const updatedPlate: PlateState = {
    ...plate,
    [expectedSector]: nextSectorItems,
  };

  const rainbowNow = isRainbowPlate([
    ...updatedPlate.vegetables,
    ...updatedPlate.fruits,
  ]);
  const unlockedRainbow =
    (expectedSector === 'vegetables' || expectedSector === 'fruits') &&
    !wasRainbow &&
    rainbowNow;
  const completeNow = isPlateComplete(updatedPlate);

  const message = unlockedRainbow
    ? `¡Plato Arcoíris! Combinaste colores distintos de frutas y vegetales. ${food.speechText}`
    : `${food.name}: ${food.speechText}`;

  return {
    accepted: true,
    reason: 'placed',
    updatedPlate,
    unlockedRainbow,
    isPlateComplete: completeNow,
    message,
    targetSector: expectedSector,
  };
}

export function removeFoodFromPlate(
  plate: PlateState,
  sector: SectorId,
  itemIndex?: number
): PlateState {
  if (sector === 'hydration') {
    return { ...plate, hydration: null };
  }

  const currentItems = plate[sector];
  const nextItems =
    typeof itemIndex === 'number'
      ? currentItems.filter((_, idx) => idx !== itemIndex)
      : currentItems.slice(0, -1);

  return {
    ...plate,
    [sector]: nextItems,
  };
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
    case 'vegetables':
      return modeFoods.filter((f) => f.category === 'vegetable');
    case 'fruits':
      return modeFoods.filter((f) => f.category === 'fruit');
    case 'cereals':
      return modeFoods.filter((f) => f.category === 'carb');
    case 'protein':
      return modeFoods.filter((f) => f.category === 'protein');
    case 'fats':
      return modeFoods.filter((f) => f.category === 'fat');
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
  const rainbow = isRainbowPlate([...plate.vegetables, ...plate.fruits]);
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
