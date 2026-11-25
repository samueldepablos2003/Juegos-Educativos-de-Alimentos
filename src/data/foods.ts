export type FoodCategory =
  | 'vegetable'
  | 'fruit'
  | 'protein'
  | 'carb'
  | 'fat'
  | 'water'
  | 'distractor';

export type SectorId =
  | 'vegetables'
  | 'fruits'
  | 'cereals'
  | 'protein'
  | 'fats'
  | 'hydration';

export type RainbowColor = 'orange' | 'red' | 'green' | 'purple' | 'yellow' | 'pink';

export type GameMode = 'breakfast' | 'lunch' | 'free';

export type FilterTab =
  | 'all'
  | 'vegetables'
  | 'fruits'
  | 'cereals'
  | 'protein'
  | 'fats'
  | 'drinks'
  | 'processed';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  targetSector: SectorId | null;
  rainbowColor?: RainbowColor;
  rainbowColorLabel?: string;
  modes: GameMode[];
  speechText: string;
  superpower: string;
  accentHex: string;
}

export interface PlateState {
  vegetables: FoodItem[];
  fruits: FoodItem[];
  cereals: FoodItem[];
  protein: FoodItem[];
  fats: FoodItem[];
  hydration: FoodItem | null;
}

export interface VolunteerStats {
  totalPlatesCompleted: number;
  rainbowPlatesAchieved: number;
  waterChosenCount: number;
  distractorLessonsCount: number;
  byMode: Record<GameMode, number>;
  lastUpdatedIso: string | null;
}

export const MODE_CONFIG: Record<
  GameMode,
  {
    id: GameMode;
    title: string;
    subtitle: string;
    greeting: string;
    colorHex: string;
    bgHex: string;
  }
> = {
  breakfast: {
    id: 'breakfast',
    title: 'Desayuno Saludable',
    subtitle: 'Arepa, frutas, huevito y agua para arrancar el día',
    greeting:
      '¡Buenos días, chef! Armemos un Desayuno Saludable para tener energía en la escuela.',
    colorHex: '#D97706',
    bgHex: '#FEF3C7',
  },
  lunch: {
    id: 'lunch',
    title: 'Almuerzo Completo',
    subtitle: 'Vegetales, proteínas y sabores criollos para crecer',
    greeting:
      '¡Hora del almuerzo! Elige alimentos de todos los grupos para armar un súper plato.',
    colorHex: '#059669',
    bgHex: '#D1FAE5',
  },
  free: {
    id: 'free',
    title: 'Reto Libre',
    subtitle: 'Los 64 alimentos para crear combinaciones arcoíris',
    greeting:
      '¡Reto Libre activado! Explora todo el mercado venezolano y busca el Plato Arcoíris.',
    colorHex: '#2563EB',
    bgHex: '#DBEAFE',
  },
};

export const FOODS: FoodItem[] = [
  // VEGETALES (8 opciones - Escudo Protector)
  {
    id: 'auyama',
    name: 'Auyama',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['lunch', 'free'],
    speechText: '¡Te da vitaminas para tener vista de súper héroe!',
    superpower: 'Vista de súper héroe',
    accentHex: '#F97316',
  },
  {
    id: 'zanahoria',
    name: 'Zanahoria',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Protege tus ojos y tu piel!',
    superpower: 'Ojos y piel sanos',
    accentHex: '#EA580C',
  },
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'red',
    rainbowColorLabel: 'Rojo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Cuida tu corazón y te mantiene sano!',
    superpower: 'Corazón fuerte',
    accentHex: '#EF4444',
  },
  {
    id: 'pepino',
    name: 'Pepino',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Es súper fresco y te ayuda a hidratarte!',
    superpower: 'Frescura e hidratación',
    accentHex: '#22C55E',
  },
  {
    id: 'lechuga',
    name: 'Lechuga',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['lunch', 'free'],
    speechText: '¡Te ayuda a tener buena digestión!',
    superpower: 'Digestión feliz',
    accentHex: '#16A34A',
  },
  {
    id: 'repollo',
    name: 'Repollo',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['lunch', 'free'],
    speechText: '¡Crujiente y lleno de fibra y vitamina C para tus defensas!',
    superpower: 'Fibra y defensas crujientes',
    accentHex: '#65A30D',
  },
  {
    id: 'brocoli',
    name: 'Brócoli',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['lunch', 'free'],
    speechText: '¡Lleno de vitaminas para crecer sano!',
    superpower: 'Escudo de vitaminas',
    accentHex: '#15803D',
  },
  {
    id: 'pimenton',
    name: 'Pimentón Rojo',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'red',
    rainbowColorLabel: 'Rojo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Tiene mucha vitamina C para tus defensas!',
    superpower: 'Defensas altas',
    accentHex: '#DC2626',
  },
  {
    id: 'remolacha',
    name: 'Remolacha',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'purple',
    rainbowColorLabel: 'Morado',
    modes: ['lunch', 'free'],
    speechText: '¡Ayuda a que tu sangre lleve energía a todo el cuerpo!',
    superpower: 'Sangre llena de energía',
    accentHex: '#9333EA',
  },
  {
    id: 'berenjena',
    name: 'Berenjena',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'purple',
    rainbowColorLabel: 'Morado',
    modes: ['lunch', 'free'],
    speechText: '¡Su color morado guarda fibra y defensas que cuidan tu corazón!',
    superpower: 'Escudo morado antioxidante',
    accentHex: '#7E22CE',
  },
  {
    id: 'cebolla',
    name: 'Cebolla',
    category: 'vegetable',
    targetSector: 'vegetables',
    rainbowColor: 'yellow',
    rainbowColorLabel: 'Amarillo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Da sabor natural a las comidas y fortalece tus defensas!',
    superpower: 'Defensas y sabor natural',
    accentHex: '#D97706',
  },

  // FRUTAS (7 opciones - Escudo Protector)
  {
    id: 'cambur',
    name: 'Cambur',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'yellow',
    rainbowColorLabel: 'Amarillo',
    modes: ['breakfast', 'free'],
    speechText: '¡Te da potasio para correr sin cansarte!',
    superpower: 'Potasio para correr',
    accentHex: '#EAB308',
  },
  {
    id: 'guayaba',
    name: 'Guayaba',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'pink',
    rainbowColorLabel: 'Rosado',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Tiene muchísima vitamina C contra la gripe!',
    superpower: 'Súper vitamina C',
    accentHex: '#EC4899',
  },
  {
    id: 'mango',
    name: 'Mango',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Dulce, delicioso y lleno de vitaminas!',
    superpower: 'Vitaminas tropicales',
    accentHex: '#F59E0B',
  },
  {
    id: 'lechosa',
    name: 'Lechosa',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'free'],
    speechText: '¡Cuida tu barriguita y te da mucha vitalidad!',
    superpower: 'Barriguita contenta',
    accentHex: '#FB923C',
  },
  {
    id: 'patilla',
    name: 'Patilla / Sandía',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'red',
    rainbowColorLabel: 'Rojo',
    modes: ['lunch', 'free'],
    speechText: '¡Súper refrescante y llena de agua natural!',
    superpower: 'Hidratación dulce',
    accentHex: '#F43F5E',
  },
  {
    id: 'naranja',
    name: 'Naranja',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'free'],
    speechText: '¡Escudo protector contra los resfriados!',
    superpower: 'Escudo antiresfriados',
    accentHex: '#F97316',
  },
  {
    id: 'pina',
    name: 'Piña',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'yellow',
    rainbowColorLabel: 'Amarillo',
    modes: ['lunch', 'free'],
    speechText: '¡Te ayuda a digerir súper bien la comida!',
    superpower: 'Digestión ligera',
    accentHex: '#CA8A04',
  },
  {
    id: 'guanabana',
    name: 'Guanábana',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Tiene vitaminas y mucha fibra para cuidar tu barriguita!',
    superpower: 'Fibra y vitaminas',
    accentHex: '#15803D',
  },
  {
    id: 'manzana',
    name: 'Manzana',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'red',
    rainbowColorLabel: 'Rojo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Crujiente, dulce y llena de fibra para cuidar tus dientes y barriguita!',
    superpower: 'Fibra y sonrisa sana',
    accentHex: '#DC2626',
  },
  {
    id: 'aguacate',
    name: 'Aguacate',
    category: 'fat',
    targetSector: 'fats',
    rainbowColor: 'green',
    rainbowColorLabel: 'Verde',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Tiene grasas saludables mágicas que cuidan tu cerebro y corazón!',
    superpower: 'Grasas buenas para el cerebro',
    accentHex: '#4D7C0F',
  },
  {
    id: 'parchita',
    name: 'Parchita',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'yellow',
    rainbowColorLabel: 'Amarillo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Refrescante y cargada de vitamina C y fibra para tus defensas!',
    superpower: 'Defensas tropicales',
    accentHex: '#D97706',
  },
  {
    id: 'mandarina',
    name: 'Mandarina',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Dulce, fácil de pelar y llena de vitamina C para proteger tus defensas!',
    superpower: 'Vitamina C en gajos',
    accentHex: '#F97316',
  },
  {
    id: 'uvas',
    name: 'Uvas',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'purple',
    rainbowColorLabel: 'Morado',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Dulces y jugosas, llenas de antioxidantes morados para tu corazón!',
    superpower: 'Antioxidantes para el corazón',
    accentHex: '#7E22CE',
  },
  {
    id: 'fresa',
    name: 'Fresa',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'red',
    rainbowColorLabel: 'Rojo',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Dulce, fresca y llena de vitamina C para cuidar tus defensas y sonrisa!',
    superpower: 'Vitamina C y corazón sano',
    accentHex: '#E11D48',
  },
  {
    id: 'durazno',
    name: 'Durazno',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Suave, jugoso y cargado de vitaminas A y C para tu piel y vista!',
    superpower: 'Piel sana y vista brillante',
    accentHex: '#FB923C',
  },
  {
    id: 'melon',
    name: 'Melón',
    category: 'fruit',
    targetSector: 'fruits',
    rainbowColor: 'orange',
    rainbowColorLabel: 'Naranja',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Súper refrescante, rico en agua natural y vitamina A para hidratarte!',
    superpower: 'Hidratación y vitamina A',
    accentHex: '#F97316',
  },

  // PROTEÍNAS (7 opciones - Fuerza y Músculos)
  {
    id: 'caraotas',
    name: 'Caraotas Negras',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Te dan mucha fuerza y hierro para correr rápido!',
    superpower: 'Hierro y velocidad',
    accentHex: '#4B5563',
  },
  {
    id: 'huevo',
    name: 'Huevo',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Ayuda a que tus músculos y cerebro crezcan fuertes!',
    superpower: 'Músculos y cerebro',
    accentHex: '#F59E0B',
  },
  {
    id: 'pollo',
    name: 'Pollo Desmechado',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Construye músculos fuertes para saltar!',
    superpower: 'Músculos para saltar',
    accentHex: '#D97706',
  },
  {
    id: 'sardinas',
    name: 'Sardinas / Pescado',
    category: 'protein',
    targetSector: 'protein',
    modes: ['lunch', 'free'],
    speechText: '¡Excelente para tu memoria y crecimiento!',
    superpower: 'Memoria brillante',
    accentHex: '#0EA5E9',
  },
  {
    id: 'queso',
    name: 'Queso Blanco',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Fortalece tus huesos y dientes!',
    superpower: 'Huesos y dientes',
    accentHex: '#FBBF24',
  },
  {
    id: 'carne',
    name: 'Carne Molida / Mechada',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Te da hierro y fuerza de campeón!',
    superpower: 'Fuerza de campeón',
    accentHex: '#B91C1C',
  },
  {
    id: 'lentejas',
    name: 'Lentejas',
    category: 'protein',
    targetSector: 'protein',
    modes: ['lunch', 'free'],
    speechText: '¡Pequeñas pero llenas de poder para crecer!',
    superpower: 'Poder para crecer',
    accentHex: '#92400E',
  },
  {
    id: 'leche',
    name: 'Leche Líquida',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Aporta calcio y proteínas para que tus huesos y dientes crezcan súper fuertes!',
    superpower: 'Calcio y huesos fuertes',
    accentHex: '#0EA5E9',
  },
  {
    id: 'atun',
    name: 'Atún en Lata',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Trae proteína y Omega-3 para músculos fuertes y memoria brillante!',
    superpower: 'Proteína y Omega-3',
    accentHex: '#0284C7',
  },
  {
    id: 'mani',
    name: 'Maní',
    category: 'fat',
    targetSector: 'fats',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Aporta grasas saludables y energía natural para tu concentración y corazón!',
    superpower: 'Grasas buenas y energía',
    accentHex: '#B45309',
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    category: 'protein',
    targetSector: 'protein',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Tiene calcio para tus huesos y probióticos que cuidan tu barriguita!',
    superpower: 'Calcio y barriguita feliz',
    accentHex: '#38BDF8',
  },

  // CARBOHIDRATOS (6 opciones - Energía para Jugar)
  {
    id: 'arepa',
    name: 'Arepa',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Es la gasolina favorita para estudiar y jugar!',
    superpower: 'Gasolina para estudiar',
    accentHex: '#EAB308',
  },
  {
    id: 'platano',
    name: 'Plátano Maduro',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Te da energía natural y sabor delicioso!',
    superpower: 'Energía natural',
    accentHex: '#D97706',
  },
  {
    id: 'arroz',
    name: 'Arroz Blanco',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['lunch', 'free'],
    speechText: '¡Te mantiene activo durante toda la tarde!',
    superpower: 'Energía toda la tarde',
    accentHex: '#94A3B8',
  },
  {
    id: 'yuca',
    name: 'Yuca Sancochada',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['lunch', 'free'],
    speechText: '¡Energía de la tierra para moverte sin parar!',
    superpower: 'Energía de la tierra',
    accentHex: '#A16207',
  },
  {
    id: 'papa',
    name: 'Papa',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['lunch', 'free'],
    speechText: '¡Te da energía constante para aprender!',
    superpower: 'Energía constante',
    accentHex: '#CA8A04',
  },
  {
    id: 'avena',
    name: 'Avena',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'free'],
    speechText: '¡Energía duradera para todo el día!',
    superpower: 'Energía duradera',
    accentHex: '#B45309',
  },
  {
    id: 'pan',
    name: 'Pan',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Te da energía rápida para estudiar y jugar!',
    superpower: 'Energía para jugar',
    accentHex: '#D97706',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['lunch', 'free'],
    speechText: '¡Te da energía deliciosa y duradera para correr y aprender!',
    superpower: 'Energía para campeones',
    accentHex: '#EAB308',
  },
  {
    id: 'casabe',
    name: 'Casabe',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Crujiente y hecho de yuca natural, te da fibra y energía criolla!',
    superpower: 'Energía criolla con fibra',
    accentHex: '#B45309',
  },
  {
    id: 'cotufas',
    name: 'Cotufas',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Hechas de maíz natural con poca sal, te dan energía y fibra para jugar!',
    superpower: 'Maíz inflado con fibra',
    accentHex: '#DC2626',
  },
  {
    id: 'aceite',
    name: 'Aceite',
    category: 'fat',
    targetSector: 'fats',
    modes: ['lunch', 'free'],
    speechText: '¡Un chorrito de aceite vegetal te da grasas saludables y ayuda a absorber vitaminas!',
    superpower: 'Grasas buenas en poquita cantidad',
    accentHex: '#D97706',
  },
  {
    id: 'jojoto',
    name: 'Jojoto',
    category: 'carb',
    targetSector: 'cereals',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡Maíz tierno natural lleno de fibra y energía sabrosa para estudiar y jugar!',
    superpower: 'Energía y fibra de maíz',
    accentHex: '#EAB308',
  },

  // HIDRATACIÓN Y ULTRAPROCESADOS (5 opciones)
  {
    id: 'agua',
    name: 'Vaso de Agua Pura',
    category: 'water',
    targetSector: 'hydration',
    modes: ['breakfast', 'lunch', 'free'],
    speechText: '¡El agua mantiene tu cuerpo fresco y despierto!',
    superpower: 'Cuerpo fresco y despierto',
    accentHex: '#0284C7',
  },
  {
    id: 'refresco',
    name: 'Refresco',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tiene muchísima azúcar; mejor elige agua pura para tener energía de verdad.',
    superpower: 'Procesado con exceso de azúcar',
    accentHex: '#7F1D1D',
  },
  {
    id: 'jugo_cajita',
    name: 'Jugo de Cajita',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tiene mucha azúcar añadida; es mucho mejor comer la fruta entera.',
    superpower: 'Procesado con azúcar añadida',
    accentHex: '#EA580C',
  },
  {
    id: 'chucheria',
    name: 'Chucherías',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tienen mucha sal, grasa y colorantes; guárdalas solo para ocasiones especiales.',
    superpower: 'Procesado con exceso de sal',
    accentHex: '#DC2626',
  },
  {
    id: 'dona',
    name: 'Dona',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tiene mucha azúcar y grasa; no te da fuerza real para crecer.',
    superpower: 'Procesado con azúcar y grasa',
    accentHex: '#DB2777',
  },
  {
    id: 'galletas',
    name: 'Galletas',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Las galletas rellenas tienen mucha azúcar y grasas; mejor elige fruta fresca o una arepita.',
    superpower: 'Procesado con azúcar y crema',
    accentHex: '#92400E',
  },
  {
    id: 'salchicha',
    name: 'Salchicha',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Las salchichas son embutidos ultraprocesados con exceso de sal; prefiere proteínas naturales como pollo, huevo o lentejas.',
    superpower: 'Procesado con exceso de sodio',
    accentHex: '#DC2626',
  },
  {
    id: 'charcuteria',
    name: 'Charcutería',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Los embutidos y la charcutería tienen mucha sal y grasas; prefiere proteínas frescas como huevo, pollo o caraotas.',
    superpower: 'Procesado con exceso de sal y grasa',
    accentHex: '#B91C1C',
  },
  {
    id: 'caramelos',
    name: 'Caramelos',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Son pura azúcar y colorantes que dañan los dientes; mejor disfruta una fruta dulce natural.',
    superpower: 'Procesado con pura azúcar',
    accentHex: '#E11D48',
  },
  {
    id: 'perro_caliente',
    name: 'Perro Caliente',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tiene embutidos, salsas y mucha sal; déjalo solo para ocasiones muy especiales.',
    superpower: 'Procesado con exceso de sal y grasa',
    accentHex: '#DC2626',
  },
  {
    id: 'pastelito',
    name: 'Pastelito',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Al ser frito absorbe mucha grasa y harina refinada; mejor elige una arepa asada o casabe.',
    superpower: 'Fritura con exceso de grasa',
    accentHex: '#D97706',
  },
  {
    id: 'azucar',
    name: 'Azúcar',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'El azúcar refinado no nutre y daña tus dientes; mejor disfruta el dulzor natural de las frutas.',
    superpower: 'Azúcar refinada sin nutrientes',
    accentHex: '#94A3B8',
  },
  {
    id: 'mayonesa',
    name: 'Mayonesa',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'La mayonesa comercial tiene mucha grasa y sal; mejor usa aguacate cremoso o un toque de limón.',
    superpower: 'Salsa procesada con exceso de grasa',
    accentHex: '#CA8A04',
  },
  {
    id: 'helado',
    name: 'Helado',
    category: 'distractor',
    targetSector: null,
    modes: ['breakfast', 'lunch', 'free'],
    speechText:
      'Tiene mucha azúcar añadida y grasa; resérvalo para ocasiones especiales y prefiere frutas frías.',
    superpower: 'Postre con exceso de azúcar',
    accentHex: '#EC4899',
  },
];

export const FAMILY_TIPS: string[] = [
  'Combina dos colores diferentes de vegetales o frutas en el almuerzo (como tomate rojo y pepino verde) para multiplicar las vitaminas en casa.',
  'Cambia las bebidas azucaradas por agua pura o fruta picada en trocitos: ¡los niños se hidratan mejor y cuidan sus dientes!',
  'Una arepa con caraotas, huevo o queso blanco y una fruta fresca es un desayuno completo, económico y lleno de energía para estudiar.',
  'Las sardinas, el huevo, las caraotas y las lentejas son proteínas accesibles y poderosas para el crecimiento y la memoria.',
  'Cuando los niños ayudan a lavar las frutas o armar su plato de colores en familia, disfrutan mucho más comer saludable.',
];
