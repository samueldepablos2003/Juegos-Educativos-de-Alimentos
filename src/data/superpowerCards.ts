export type CardGroup = 'shield' | 'protein' | 'energy';
export type CategoryFilter = 'random' | CardGroup;
export type BodyZone = 'eyes' | 'muscles' | 'brain' | 'heart' | 'bones' | 'tummy';

export interface SuperpowerCard {
  id: string;
  foodId: string;
  name: string;
  group: CardGroup;
  groupLabel: string;
  frameColor: string;
  badgeBg: string;
  superpowerTitle: string;
  superpowerDesc: string;
  bodyZone: BodyZone;
  bodyZoneLabel: string;
  bodyZoneBenefit: string;
  familyTip: string;
  lightningQuestion: string;
  lightningAnswer: string;
  preguntaRelampago: {
    enunciado: string;
    opciones: [string, string, string];
    correcta: number;
  };
}

export const GROUP_META: Record<
  CardGroup,
  { label: string; shortLabel: string; accentHex: string; softBg: string }
> = {
  shield: {
    label: 'Frutas y Vegetales (Escudo Protector)',
    shortLabel: 'Frutas y Vegetales',
    accentHex: '#5dd118',
    softBg: '#EFFCE4',
  },
  protein: {
    label: 'Proteínas (Constructores de Fuerza)',
    shortLabel: 'Proteínas',
    accentHex: '#fc3e7e',
    softBg: '#FFE8F0',
  },
  energy: {
    label: 'Carbohidratos (Gasolina y Energía)',
    shortLabel: 'Carbohidratos',
    accentHex: '#fee330',
    softBg: '#FFFBE0',
  },
};

export const SUPERPOWER_CARDS: SuperpowerCard[] = [
  // GRUPO 1: FRUTAS Y VEGETALES (6)
  {
    id: 'sp-guayaba',
    foodId: 'guayaba',
    name: 'Guayaba',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#EC4899',
    badgeBg: '#FCE7F3',
    superpowerTitle: 'Escudo Antigripe',
    superpowerDesc:
      'Tiene 4 veces más vitamina C que la naranja para protegerte de los resfriados.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Defensas',
    bodyZoneBenefit: 'Fortalece tus defensas naturales y cuida tu corazón.',
    familyTip:
      'Sírvela en trocitos con su concha bien lavada o en batido sin azúcar añadida: ¡aprovechas toda su vitamina C y fibra!',
    lightningQuestion:
      '¿Qué fruta criolla tiene hasta 4 veces más vitamina C que la naranja?',
    lightningAnswer: '¡La Guayaba! Es la campeona contra la gripe.',
    preguntaRelampago: {
      enunciado:
        '¿Qué fruta criolla tiene hasta 4 veces más vitamina C que la naranja?',
      opciones: ['La Guayaba', 'El Cambur', 'La Arepa'],
      correcta: 0,
    },
  },
  {
    id: 'sp-auyama',
    foodId: 'auyama',
    name: 'Auyama',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#F97316',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Vista de Súper Héroe',
    superpowerDesc:
      'Su color naranja brillante está lleno de vitamina A para que veas súper bien incluso de noche.',
    bodyZone: 'eyes',
    bodyZoneLabel: 'Ojos',
    bodyZoneBenefit: 'Mantiene tus ojos brillantes, sanos y con visión nítida.',
    familyTip:
      'Agrégalo en sopas, cremas o puré junto a un chorrito de aceite vegetal: ayuda a absorber mejor sus vitaminas y rinde para toda la familia.',
    lightningQuestion:
      '¿Qué parte de nuestro cuerpo se vuelve súper fuerte cuando comemos auyama?',
    lightningAnswer: '¡Nuestros ojos! Gracias a su vitamina A.',
    preguntaRelampago: {
      enunciado:
        '¿Qué parte de nuestro cuerpo se vuelve súper fuerte cuando comemos auyama?',
      opciones: ['Las uñas', 'Nuestros ojos', 'El cabello'],
      correcta: 1,
    },
  },
  {
    id: 'sp-cambur',
    foodId: 'cambur',
    name: 'Cambur',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#EAB308',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Turbo Anti-Calambres',
    superpowerDesc:
      'Está cargado de potasio natural para que tus músculos puedan correr y saltar sin cansarse.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Músculos',
    bodyZoneBenefit: 'Evita calambres y mantiene los músculos listos para jugar.',
    familyTip:
      'Es la merienda escolar más práctica y económica: viene en su propio empaque natural y no necesita azúcar ni envolturas.',
    lightningQuestion:
      '¿Cuál es el mineral estrella del cambur que ayuda a tus músculos a no cansarse?',
    lightningAnswer: '¡El Potasio! Ideal antes o después de jugar.',
    preguntaRelampago: {
      enunciado:
        '¿Cuál es el mineral estrella del cambur que ayuda a tus músculos a no cansarse?',
      opciones: ['El Potasio', 'El Azúcar refinado', 'La Sal'],
      correcta: 0,
    },
  },
  {
    id: 'sp-zanahoria',
    foodId: 'zanahoria',
    name: 'Zanahoria',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#EA580C',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Visión Láser y Piel Sana',
    superpowerDesc:
      'Tiene betacarotenos que protegen tus ojos y hacen que tu piel sane rapidito si te raspas jugando.',
    bodyZone: 'eyes',
    bodyZoneLabel: 'Ojos y Piel',
    bodyZoneBenefit: 'Cuida tu vista y protege tu piel como un escudo.',
    familyTip:
      'Rállala cruda con unas gotitas de limón en la ensalada o inclúyela en las caraotas y sopas para darle un toque dulce natural.',
    lightningQuestion:
      'Si queremos proteger nuestra vista y piel, ¿de qué color deben ser vegetales como la zanahoria?',
    lightningAnswer: '¡De color naranja brillante!',
    preguntaRelampago: {
      enunciado:
        'Si queremos proteger nuestra vista y piel, ¿de qué color deben ser vegetales como la zanahoria?',
      opciones: ['Color azul', 'Color naranja brillante', 'Color blanco'],
      correcta: 1,
    },
  },
  {
    id: 'sp-tomate',
    foodId: 'tomate',
    name: 'Tomate',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#EF4444',
    badgeBg: '#FEE2E2',
    superpowerTitle: 'Motor del Corazón',
    superpowerDesc:
      'Su color rojo guarda licopeno, un guardián que mantiene tu corazón fuerte y contento.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón',
    bodyZoneBenefit: 'Ayuda a que tu corazón lata con fuerza y buena circulación.',
    familyTip:
      'Prepara salsas caseras con tomate natural, cebolla y ajo en lugar de salsas comerciales: ahorras dinero y evitas exceso de sal.',
    lightningQuestion:
      '¿Qué órgano del cuerpo tiene forma parecida y es protegido por el tomate rojo?',
    lightningAnswer: '¡El Corazón!',
    preguntaRelampago: {
      enunciado:
        '¿Qué órgano del cuerpo tiene forma parecida y es protegido por el tomate rojo?',
      opciones: ['Los pulmones', 'El estómago', 'El Corazón'],
      correcta: 2,
    },
  },
  {
    id: 'sp-lechosa',
    foodId: 'lechosa',
    name: 'Lechosa',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#FB923C',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Barriguita Feliz',
    superpowerDesc:
      'Tiene enzimas mágicas y mucha agua para ayudar a tu estómago a digerir súper bien la comida.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Barriguita',
    bodyZoneBenefit: 'Cuida tu digestión para que nunca te duela la barriguita.',
    familyTip:
      'Desayunar lechosa picada en cubitos con unas gotas de limón activa la digestión de niños y adultos desde temprano.',
    lightningQuestion:
      '¿Qué fruta tropical ayuda a que tu barriguita digiera súper bien toda la comida?',
    lightningAnswer: '¡La Lechosa!',
    preguntaRelampago: {
      enunciado:
        '¿Qué fruta tropical ayuda a que tu barriguita digiera súper bien toda la comida?',
      opciones: ['La Lechosa', 'El Refresco', 'La Dona'],
      correcta: 0,
    },
  },
  {
    id: 'sp-brocoli',
    foodId: 'brocoli',
    name: 'Brócoli',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#15803D',
    badgeBg: '#DCFCE7',
    superpowerTitle: 'Arbolito de Súper Defensas',
    superpowerDesc:
      'Sus ramitas verdes traen vitamina C, calcio y fibra para proteger tus huesos y evitar resfriados.',
    bodyZone: 'bones',
    bodyZoneLabel: 'Defensas y Huesos',
    bodyZoneBenefit: 'Fortalece tus huesos y activa tu escudo protector cada día.',
    familyTip:
      'Cocínalo al vapor por 4 a 5 minutos para que quede verde brillante, crujiente y conserve todas sus vitaminas.',
    lightningQuestion:
      '¿Qué vegetal verde con forma de arbolito ayuda a fortalecer tus defensas y huesos?',
    lightningAnswer: '¡El Brócoli!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vegetal verde con forma de arbolito ayuda a fortalecer tus defensas y huesos?',
      opciones: ['El Brócoli', 'Los Caramelos', 'El Refresco'],
      correcta: 0,
    },
  },
  {
    id: 'sp-berenjena',
    foodId: 'berenjena',
    name: 'Berenjena',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#7E22CE',
    badgeBg: '#F3E8FF',
    superpowerTitle: 'Escudo Morado del Corazón',
    superpowerDesc:
      'Su piel morada guarda antioxidantes especiales y fibra que cuidan tu corazón y tu cerebro.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Cerebro',
    bodyZoneBenefit: 'Protege las células de tu cuerpo y mantiene tu corazón contento.',
    familyTip:
      'Prepárala horneada, guisada con tomate o en crema untable con su piel bien lavada para aprovechar todo su poder morado.',
    lightningQuestion:
      '¿En qué parte de la berenjena se concentran sus súper antioxidantes morados?',
    lightningAnswer: '¡En su piel morada brillante!',
    preguntaRelampago: {
      enunciado:
        '¿En qué parte de la berenjena se concentran sus súper antioxidantes morados?',
      opciones: ['En su piel morada brillante', 'Solo en el tallo', 'En la sal'],
      correcta: 0,
    },
  },
  {
    id: 'sp-manzana',
    foodId: 'manzana',
    name: 'Manzana',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#DC2626',
    badgeBg: '#FEE2E2',
    superpowerTitle: 'Crujido Saludable',
    superpowerDesc:
      'Al morderla limpia naturalmente tus dientes y su fibra cuida tu barriguita con dulzor natural.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Dientes y Barriguita',
    bodyZoneBenefit: 'Cuida tu digestión y te da energía limpia para la escuela.',
    familyTip:
      'Córtala en gajos con su cáscara bien lavada para la lonchera: es una merienda fresca, crujiente y sin azúcar añadida.',
    lightningQuestion:
      '¿Por qué es tan bueno comer la manzana con su cáscara bien lavada?',
    lightningAnswer: '¡Porque allí guarda mucha fibra y vitaminas!',
    preguntaRelampago: {
      enunciado:
        '¿Por qué es tan bueno comer la manzana con su cáscara bien lavada?',
      opciones: [
        'Porque allí guarda mucha fibra y vitaminas',
        'Porque tiene azúcar artificial',
        'Porque no se puede pelar',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-aguacate',
    foodId: 'aguacate',
    name: 'Aguacate',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#4D7C0F',
    badgeBg: '#ECFCCB',
    superpowerTitle: 'Súper Grasa para el Cerebro',
    superpowerDesc:
      'Está lleno de grasas buenas y vitamina E que alimentan tu cerebro y protegen tu corazón.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro y Corazón',
    bodyZoneBenefit: 'Ayuda a tu cerebro a concentrarse y mantiene tu corazón fuerte.',
    familyTip:
      'Úsalo en rebanadas o machacado como crema natural para la arepa en lugar de mantequilla o salsas comerciales.',
    lightningQuestion:
      '¿Qué tipo de grasas tiene el aguacate que ayudan a nuestro cerebro y corazón?',
    lightningAnswer: '¡Grasas buenas y saludables!',
    preguntaRelampago: {
      enunciado:
        '¿Qué tipo de grasas tiene el aguacate que ayudan a nuestro cerebro y corazón?',
      opciones: ['Grasas buenas y saludables', 'Grasas de golosinas', 'Azúcar líquida'],
      correcta: 0,
    },
  },
  {
    id: 'sp-parchita',
    foodId: 'parchita',
    name: 'Parchita',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#D97706',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Escudo Refrescante de Vitamina C',
    superpowerDesc:
      'Su pulpa dorada tiene vitamina C y fibra natural para subir tus defensas y refrescarte.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Defensas y Barriguita',
    bodyZoneBenefit: 'Protege contra resfriados y ayuda a una digestión tranquila.',
    familyTip:
      'Prepara jugo de parchita natural con agua fría y sin exceso de azúcar (o disfruta sus semillitas crujientes con yogur o fruta).',
    lightningQuestion:
      '¿Qué vitamina abundante en la parchita fortalece nuestro escudo contra la gripe?',
    lightningAnswer: '¡La Vitamina C!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vitamina abundante en la parchita fortalece nuestro escudo contra la gripe?',
      opciones: ['La Vitamina C', 'La sal refinada', 'El colorante artificial'],
      correcta: 0,
    },
  },
  {
    id: 'sp-mango',
    foodId: 'mango',
    name: 'Mango',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Sol de Vitaminas A y C',
    superpowerDesc:
      'Su dulzor natural está repleto de vitaminas A y C que cuidan tu vista, tu piel y tus defensas.',
    bodyZone: 'eyes',
    bodyZoneLabel: 'Ojos y Piel',
    bodyZoneBenefit: 'Ilumina tu vista y llena tu piel de defensas naturales.',
    familyTip:
      'En temporada de mango, disfrútalo fresco en trocitos como postre o merienda: ¡es delicioso, económico y no necesita azúcar!',
    lightningQuestion:
      '¿Por qué el mango maduro es una merienda tan buena en lugar de caramelos?',
    lightningAnswer: '¡Porque su dulzor es natural y trae vitaminas A y C!',
    preguntaRelampago: {
      enunciado:
        '¿Por qué el mango maduro es una merienda tan buena en lugar de caramelos?',
      opciones: [
        'Su dulzor es natural y trae vitaminas A y C',
        'Tiene mucha sal añadida',
        'Está hecho de refresco',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-pepino',
    foodId: 'pepino',
    name: 'Pepino',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#16A34A',
    badgeBg: '#DCFCE7',
    superpowerTitle: 'Hidratación Crujiente',
    superpowerDesc:
      'Más del 95% del pepino es agua natural con minerales que refrescan todo tu cuerpo al instante.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Hidratación y Piel',
    bodyZoneBenefit: 'Refresca tu cuerpo y aporta fibra ligera para tu barriguita.',
    familyTip:
      'Sírvelo en rueditas frescas con un poquito de limón: es un acompañante crujiente y económico que encanta a los niños.',
    lightningQuestion:
      '¿Cuál es el ingrediente natural que ocupa casi todo el interior del pepino?',
    lightningAnswer: '¡Agua pura y refrescante!',
    preguntaRelampago: {
      enunciado:
        '¿Cuál es el ingrediente natural que ocupa casi todo el interior del pepino?',
      opciones: ['Agua pura y refrescante', 'Azúcar refinada', 'Aceite frito'],
      correcta: 0,
    },
  },
  {
    id: 'sp-mandarina',
    foodId: 'mandarina',
    name: 'Mandarina',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#F97316',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Gajos de Vitamina C',
    superpowerDesc:
      'Sus gajos jugosos vienen llenos de vitamina C y fibra para protegerte de la gripe y llenar tu recreo de frescura.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Defensas y Corazón',
    bodyZoneBenefit: 'Refuerza tu escudo protector y cuida tu barriguita.',
    familyTip:
      'Es facilísima de pelar para los más pequeños: envíala entera en la lonchera como merienda natural sin azúcar añadida.',
    lightningQuestion:
      '¿Qué vitamina abunda en los gajos dulces de la mandarina para cuidar nuestras defensas?',
    lightningAnswer: '¡La Vitamina C!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vitamina abunda en los gajos dulces de la mandarina para cuidar nuestras defensas?',
      opciones: ['La Vitamina C', 'La sal refinada', 'El aceite frito'],
      correcta: 0,
    },
  },
  {
    id: 'sp-uvas',
    foodId: 'uvas',
    name: 'Uvas',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#7E22CE',
    badgeBg: '#F3E8FF',
    superpowerTitle: 'Perlas Moradas del Corazón',
    superpowerDesc:
      'Su piel morada guarda antioxidantes naturales y agua dulce que cuidan tu corazón y te refrescan.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Energía',
    bodyZoneBenefit: 'Cuida tus vasos sanguíneos y aporta energía limpia de fruta fresca.',
    familyTip:
      'Lávalas muy bien y sírvelas frescas (partidas a la mitad para los más chiquitos) como merienda dulce sin azúcar añadida.',
    lightningQuestion:
      '¿Qué superpoder esconden las uvas moradas en su piel brillante?',
    lightningAnswer: '¡Antioxidantes que cuidan el corazón!',
    preguntaRelampago: {
      enunciado:
        '¿Qué superpoder esconden las uvas moradas en su piel brillante?',
      opciones: [
        'Antioxidantes que cuidan el corazón',
        'Colorante artificial',
        'Exceso de sal',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-repollo',
    foodId: 'repollo',
    name: 'Repollo',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#65A30D',
    badgeBg: '#ECFCCB',
    superpowerTitle: 'Hojas Crujientes de Fibra',
    superpowerDesc:
      'Sus hojas crujientes aportan vitamina C, vitamina K y fibra para que tu barriguita y defensas estén al 100%.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Barriguita y Defensas',
    bodyZoneBenefit: 'Ayuda a la digestión y fortalece tus defensas naturales.',
    familyTip:
      'Pícalo bien finito con zanahoria rallada y limón: rinde muchísimo, es económico y le da un toque crujiente al almuerzo.',
    lightningQuestion:
      '¿Qué hace que la ensalada de repollo con zanahoria sea tan buena para tu barriguita?',
    lightningAnswer: '¡Su fibra natural y sus vitaminas!',
    preguntaRelampago: {
      enunciado:
        '¿Qué hace que la ensalada de repollo con zanahoria sea tan buena para tu barriguita?',
      opciones: [
        'Su fibra natural y sus vitaminas',
        'Mucho azúcar añadido',
        'Salsas comerciales',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-fresa',
    foodId: 'fresa',
    name: 'Fresa',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#E11D48',
    badgeBg: '#FFE4E6',
    superpowerTitle: 'Corazón Rojo de Vitamina C',
    superpowerDesc:
      'Su color rojo brillante está repleto de vitamina C y antioxidantes que fortalecen tus defensas y cuidan tu corazón.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Defensas',
    bodyZoneBenefit: 'Protege contra resfriados y mantiene tu corazón fuerte.',
    familyTip:
      'Lávalas muy bien y sírvelas frescas con yogurt natural sin azúcar o en la lonchera como merienda deliciosa.',
    lightningQuestion:
      '¿Qué vitamina abunda en las fresas rojas para proteger nuestras defensas?',
    lightningAnswer: '¡La Vitamina C!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vitamina abunda en las fresas rojas para proteger nuestras defensas?',
      opciones: ['La Vitamina C', 'La sal refinada', 'El aceite frito'],
      correcta: 0,
    },
  },
  {
    id: 'sp-durazno',
    foodId: 'durazno',
    name: 'Durazno',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#FB923C',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Piel Suave y Vista Brillante',
    superpowerDesc:
      'Trae betacarotenos, fibra y agua dulce natural para cuidar tu vista, tu piel y tu barriguita.',
    bodyZone: 'eyes',
    bodyZoneLabel: 'Ojos y Piel',
    bodyZoneBenefit: 'Ayuda a ver con claridad y mantiene tu piel sana.',
    familyTip:
      'Disfrútalo fresco y bien lavado con su piel aterciopelada en lugar de duraznos en almíbar llenos de azúcar.',
    lightningQuestion:
      '¿Cómo es más nutritivo comer el durazno: fresco natural o en lata con almíbar azucarado?',
    lightningAnswer: '¡Fresco y natural con toda su fibra!',
    preguntaRelampago: {
      enunciado: '¿Cómo es más nutritivo comer el durazno?',
      opciones: [
        'Fresco y natural con toda su fibra',
        'En almíbar con mucha azúcar',
        'Convertido en caramelo',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-melon',
    foodId: 'melon',
    name: 'Melón',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#F97316',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Ola Refrescante de Vitamina A',
    superpowerDesc:
      'Casi 90% del melón es agua natural junto con vitamina A y potasio para hidratarte y cuidar tu vista.',
    bodyZone: 'eyes',
    bodyZoneLabel: 'Ojos e Hidratación',
    bodyZoneBenefit: 'Refresca tu cuerpo y protege tu visión en días soleados.',
    familyTip:
      'Córtalo en cubitos fríos para la merienda o el desayuno: calma la sed y da dulzor natural sin azúcar añadida.',
    lightningQuestion:
      '¿Qué vitamina del melón anaranjado ayuda a mantener sana nuestra vista?',
    lightningAnswer: '¡La Vitamina A!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vitamina del melón anaranjado ayuda a mantener sana nuestra vista?',
      opciones: ['La Vitamina A', 'La sal marina', 'Los colorantes'],
      correcta: 0,
    },
  },
  {
    id: 'sp-cebolla',
    foodId: 'cebolla',
    name: 'Cebolla',
    group: 'shield',
    groupLabel: 'Escudo Protector',
    frameColor: '#D97706',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Guardiana de las Defensas',
    superpowerDesc:
      'Sus capas guardan antioxidantes naturales y fibra prebiótica que defienden tu cuerpo y dan sabor real a las comidas.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Defensas y Barriguita',
    bodyZoneBenefit: 'Alimenta las bacterias buenas de tu barriguita y refuerza tus defensas.',
    familyTip:
      'Úsala en sofritos caseros con tomate y pimentón para dar mucho sabor sin necesidad de cubitos ni exceso de sal.',
    lightningQuestion:
      '¿Cómo ayuda la cebolla cuando la usamos en sofritos caseros?',
    lightningAnswer: '¡Da sabor natural y evita usar exceso de sal o cubitos!',
    preguntaRelampago: {
      enunciado: '¿Cómo ayuda la cebolla cuando la usamos en sofritos caseros?',
      opciones: [
        'Da sabor natural y evita exceso de sal',
        'Añade azúcar refinado',
        'Reemplaza el agua pura',
      ],
      correcta: 0,
    },
  },

  // GRUPO 2: PROTEÍNAS (6)
  {
    id: 'sp-caraotas',
    foodId: 'caraotas',
    name: 'Caraotas Negras',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#4B5563',
    badgeBg: '#F3F4F6',
    superpowerTitle: 'Hierro de Velocista',
    superpowerDesc:
      'Te dan hierro y proteína vegetal para que tu sangre lleve oxígeno rápido y tengas mucha fuerza.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Músculos y Sangre',
    bodyZoneBenefit: 'Construye músculos fuertes y evita el cansancio.',
    familyTip:
      'Si las combinas con arroz o arepa, formas una proteína tan completa como la carne a mucho menor costo.',
    lightningQuestion:
      '¿Con qué alimento podemos combinar las caraotas para formar una proteína completa?',
    lightningAnswer: '¡Con arroz o arepa de maíz!',
    preguntaRelampago: {
      enunciado:
        '¿Con qué alimento podemos combinar las caraotas para formar una proteína completa?',
      opciones: ['Con refresco oscuro', 'Con arroz o arepa de maíz', 'Con chucherías'],
      correcta: 1,
    },
  },
  {
    id: 'sp-huevo',
    foodId: 'huevo',
    name: 'Huevo',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Súper Cerebro y Músculos',
    superpowerDesc:
      'Su clara construye músculos fuertes y su yema alimenta tu cerebro para aprender más rápido.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro',
    bodyZoneBenefit: 'Potencia tu memoria, atención y aprendizaje en clases.',
    familyTip:
      'Sancochado o revuelto con tomate y pimentón (perico) es una de las proteínas más completas, rápidas y económicas para el desayuno.',
    lightningQuestion:
      '¿Qué parte del huevo ayuda especialmente a alimentar nuestro cerebro y memoria?',
    lightningAnswer: '¡La yema dorada!',
    preguntaRelampago: {
      enunciado:
        '¿Qué parte del huevo ayuda especialmente a alimentar nuestro cerebro y memoria?',
      opciones: ['La cáscara dura', 'La yema dorada', 'Solo el aceite'],
      correcta: 1,
    },
  },
  {
    id: 'sp-sardinas',
    foodId: 'sardinas',
    name: 'Sardinas',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#0284C7',
    badgeBg: '#E0F2FE',
    superpowerTitle: 'Chispa para la Memoria',
    superpowerDesc:
      'Están llenas de Omega-3 y calcio marino para pensar rápido y crecer con huesos firmes.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro y Memoria',
    bodyZoneBenefit: 'Ayuda a conectar tus neuronas y fortalece tus huesos.',
    familyTip:
      'Las sardinas frescas o enlatadas al natural son un tesoro nutricional súper económico: con limón y cilantro quedan deliciosas.',
    lightningQuestion:
      '¿Qué grasa buena tienen las sardinas que hace brillar nuestra memoria?',
    lightningAnswer: '¡El Omega-3!',
    preguntaRelampago: {
      enunciado:
        '¿Qué grasa buena tienen las sardinas que hace brillar nuestra memoria?',
      opciones: ['El Omega-3', 'Colorante artificial', 'Azúcar añadido'],
      correcta: 0,
    },
  },
  {
    id: 'sp-pollo',
    foodId: 'pollo',
    name: 'Pollo Desmechado',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#D97706',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Fuerza para Saltar',
    superpowerDesc:
      'Sus fibras suaves ayudan a reparar y hacer crecer tus músculos después de correr y jugar.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Músculos',
    bodyZoneBenefit: 'Aporta ladrillos de proteína para crecer fuerte.',
    familyTip:
      'Cocinar pollo desmechado con bastante pimentón, cebolla y zanahoria rallada rinde el doble para rellenar arepas o acompañar el almuerzo.',
    lightningQuestion:
      '¿Qué grupo de alimentos funciona como "ladrillos" para construir nuestros músculos?',
    lightningAnswer: '¡Las Proteínas, como el pollo desmechado!',
    preguntaRelampago: {
      enunciado:
        '¿Qué grupo de alimentos funciona como "ladrillos" para construir nuestros músculos?',
      opciones: ['Las Proteínas', 'Los dulces', 'Las gaseosas'],
      correcta: 0,
    },
  },
  {
    id: 'sp-queso',
    foodId: 'queso',
    name: 'Queso Blanco',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#CA8A04',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Armadura de Huesos y Dientes',
    superpowerDesc:
      'Tiene muchísimo calcio natural para que tus huesos crezcan largos y tus dientes estén firmes.',
    bodyZone: 'bones',
    bodyZoneLabel: 'Huesos y Dientes',
    bodyZoneBenefit: 'Endurece tus huesos y protege tu sonrisa.',
    familyTip:
      'Prefiere queso blanco fresco poco salado en porciones moderadas; combinado con arepa y tomate hace un desayuno criollo balanceado.',
    lightningQuestion:
      '¿Qué mineral tiene el queso blanco que hace duros nuestros huesos y dientes?',
    lightningAnswer: '¡El Calcio!',
    preguntaRelampago: {
      enunciado:
        '¿Qué mineral tiene el queso blanco que hace duros nuestros huesos y dientes?',
      opciones: ['Azúcar', 'El Calcio', 'Sodio'],
      correcta: 1,
    },
  },
  {
    id: 'sp-lentejas',
    foodId: 'lentejas',
    name: 'Lentejas',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#92400E',
    badgeBg: '#FDE68A',
    superpowerTitle: 'Pequeñas Gigantes de Hierro',
    superpowerDesc:
      'Aunque son chiquitas, traen hierro, fibra y proteína para crecer sano y con mucha vitalidad.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Sangre',
    bodyZoneBenefit: 'Lleva energía limpia a través de tu sangre a todo el cuerpo.',
    familyTip:
      'Sírvelas junto a un poquito de tomate o naranja de postre: la vitamina C multiplica la absorción del hierro de las lentejas.',
    lightningQuestion:
      '¿Qué vitamina ayuda a que nuestro cuerpo absorba mejor el hierro de las lentejas?',
    lightningAnswer: '¡La Vitamina C (como la de la guayaba, tomate o naranja)!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vitamina ayuda a que nuestro cuerpo absorba mejor el hierro de las lentejas?',
      opciones: ['La Vitamina C', 'La sal marina', 'La grasa frita'],
      correcta: 0,
    },
  },
  {
    id: 'sp-leche',
    foodId: 'leche',
    name: 'Leche Líquida',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#0EA5E9',
    badgeBg: '#E0F2FE',
    superpowerTitle: 'Constructor de Huesos y Sonrisa',
    superpowerDesc:
      'Combina calcio, proteínas y vitamina D para que tus huesos crezcan largos y tus dientes estén firmes.',
    bodyZone: 'bones',
    bodyZoneLabel: 'Huesos y Dientes',
    bodyZoneBenefit: 'Fortalece el esqueleto y ayuda a crecer fuerte cada día.',
    familyTip:
      'Sírvela natural sin agregar polvos achocolatados llenos de azúcar, o combínala con avena y cambur maduro.',
    lightningQuestion:
      '¿Qué mineral estrella de la leche líquida ayuda a construir huesos y dientes fuertes?',
    lightningAnswer: '¡El Calcio!',
    preguntaRelampago: {
      enunciado:
        '¿Qué mineral estrella de la leche líquida ayuda a construir huesos y dientes fuertes?',
      opciones: ['El Calcio', 'El Sodio', 'El Colorante'],
      correcta: 0,
    },
  },
  {
    id: 'sp-atun',
    foodId: 'atun',
    name: 'Atún en Lata',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#0284C7',
    badgeBg: '#E0F2FE',
    superpowerTitle: 'Proteína Marina Inteligente',
    superpowerDesc:
      'Está lleno de proteína magra y Omega-3 que ayudan a tus músculos a crecer y a tu mente a recordar todo.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro y Músculos',
    bodyZoneBenefit: 'Alimenta tu memoria y construye músculos ágiles.',
    familyTip:
      'Prefiere atún en agua (o escúrrelo bien) y mézclalo con tomate, cebolla y limón para rellenar arepas o acompañar ensaladas.',
    lightningQuestion:
      '¿Cuál es la mejor forma de elegir el atún en lata para hacerlo aún más saludable?',
    lightningAnswer: '¡Al natural en agua y mezclado con vegetales frescos!',
    preguntaRelampago: {
      enunciado:
        '¿Cuál es la mejor forma de elegir el atún en lata para hacerlo aún más saludable?',
      opciones: [
        'Al natural en agua y con vegetales',
        'Con mucha mayonesa comercial',
        'Acompañado de refresco',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-mani',
    foodId: 'mani',
    name: 'Maní',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#B45309',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Semillas de Súper Concentración',
    superpowerDesc:
      'Trae proteína vegetal, vitamina E y grasas saludables que ayudan a tu cerebro a concentrarse mejor.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro y Fuerza',
    bodyZoneBenefit: 'Aporta energía duradera y grasas buenas en un puñadito.',
    familyTip:
      'Elige maní tostado sin sal ni azúcar cubierta y sírvelo en porciones pequeñas junto a una fruta fresca.',
    lightningQuestion:
      '¿Cómo es más saludable disfrutar el maní como merienda?',
    lightningAnswer: '¡Natural o tostado sin exceso de sal ni azúcar!',
    preguntaRelampago: {
      enunciado: '¿Cómo es más saludable disfrutar el maní como merienda?',
      opciones: [
        'Natural o tostado sin exceso de sal',
        'Cubierto de caramelo y colorantes',
        'Frito con mucha sal',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-yogurt',
    foodId: 'yogurt',
    name: 'Yogurt',
    group: 'protein',
    groupLabel: 'Constructores de Fuerza',
    frameColor: '#38BDF8',
    badgeBg: '#E0F2FE',
    superpowerTitle: 'Probióticos y Huesos de Acero',
    superpowerDesc:
      'Combina calcio, proteínas y probióticos amigables que fortalecen tus huesos y protegen tu digestión.',
    bodyZone: 'bones',
    bodyZoneLabel: 'Huesos y Barriguita',
    bodyZoneBenefit: 'Fortalece el esqueleto y cuida las defensas de tu estómago.',
    familyTip:
      'Prefiere yogurt natural sin azúcar añadida y endúlzalo en casa con fresas, cambur o durazno picadito.',
    lightningQuestion:
      '¿Qué amigos invisibles del yogurt natural ayudan a mantener feliz tu barriguita?',
    lightningAnswer: '¡Los probióticos!',
    preguntaRelampago: {
      enunciado:
        '¿Qué amigos invisibles del yogurt natural ayudan a mantener feliz tu barriguita?',
      opciones: ['Los probióticos', 'Los colorantes artificiales', 'El exceso de sal'],
      correcta: 0,
    },
  },

  // GRUPO 3: CARBOHIDRATOS (6)
  {
    id: 'sp-arepa',
    foodId: 'arepa',
    name: 'Arepa',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#EAB308',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Gasolina de Campeones',
    superpowerDesc:
      'Es la energía favorita para llegar despierto a la escuela, estudiar y jugar todo el recreo.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro y Energía',
    bodyZoneBenefit: 'Le da combustible inmediato al cerebro para concentrarse.',
    familyTip:
      'Puedes enriquecer la masa de la arepa mezclándole auyama cocida, zanahoria rallada o avena en hojuelas para sumar fibra y vitaminas.',
    lightningQuestion:
      '¿Qué vegetal naranja podemos mezclar en la masa de la arepa para darle súper vitaminas?',
    lightningAnswer: '¡Auyama o zanahoria rallada!',
    preguntaRelampago: {
      enunciado:
        '¿Qué vegetal naranja podemos mezclar en la masa de la arepa para darle súper vitaminas?',
      opciones: ['Auyama o zanahoria rallada', 'Caramelo líquido', 'Papa frita'],
      correcta: 0,
    },
  },
  {
    id: 'sp-platano',
    foodId: 'platano',
    name: 'Plátano Maduro',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#D97706',
    badgeBg: '#FFEDD5',
    superpowerTitle: 'Energía Dulce Natural',
    superpowerDesc:
      'Su dulzor natural te da energía rápida junto con potasio y vitaminas sin azúcar refinada.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Músculos en Movimiento',
    bodyZoneBenefit: 'Recarga las baterías de tus piernas y brazos al instante.',
    familyTip:
      'Horneado o asado en sartén con poquito aceite en vez de sumergido en fritura conserva todo su sabor dulce de forma mucho más saludable.',
    lightningQuestion:
      '¿Cuál es la forma más saludable de cocinar el plátano maduro: horneado/asado o muy frito?',
    lightningAnswer: '¡Horneado o asado a la plancha!',
    preguntaRelampago: {
      enunciado:
        '¿Cuál es la forma más saludable de cocinar el plátano maduro?',
      opciones: ['Muy frito en aceite', 'Horneado o asado a la plancha', 'Cubierto de azúcar'],
      correcta: 1,
    },
  },
  {
    id: 'sp-arroz',
    foodId: 'arroz',
    name: 'Arroz',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#0EA5E9',
    badgeBg: '#E0F2FE',
    superpowerTitle: 'Batería para toda la Tarde',
    superpowerDesc:
      'Sus granitos suaves liberan energía constante para que hagas tareas y juegues sin agotarte.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Energía y Digestión',
    bodyZoneBenefit: 'Es ligero para la barriguita y mantiene tu batería cargada.',
    familyTip:
      'Acompáñalo siempre con caraotas o lentejas y una ensalada colorida para lograr un almuerzo completo y económico.',
    lightningQuestion:
      'En el plato saludable, ¿qué tamaño de espacio deben ocupar el arroz y otros carbohidratos?',
    lightningAnswer: '¡Un cuarto (25%) del plato!',
    preguntaRelampago: {
      enunciado:
        'En el plato saludable, ¿qué tamaño de espacio deben ocupar el arroz y otros carbohidratos?',
      opciones: ['Todo el plato (100%)', 'Un cuarto (25%) del plato', 'Nada del plato'],
      correcta: 1,
    },
  },
  {
    id: 'sp-yuca',
    foodId: 'yuca',
    name: 'Yuca',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#A16207',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Fuerza de la Tierra',
    superpowerDesc:
      'Esta raíz criolla guarda almidón bueno que te da energía duradera para correr sin parar.',
    bodyZone: 'bones',
    bodyZoneLabel: 'Cuerpo y Resistencia',
    bodyZoneBenefit: 'Aporta energía limpia y minerales para aguantar todo el día.',
    familyTip:
      'Sancochada con un toque de ajo o cilantro es una alternativa local excelente y económica al pan o harinas empaquetadas.',
    lightningQuestion:
      '¿De dónde nace la yuca: de un árbol alto o debajo de la tierra como raíz?',
    lightningAnswer: '¡Debajo de la tierra, es una raíz nutritiva!',
    preguntaRelampago: {
      enunciado:
        '¿De dónde nace la yuca?',
      opciones: ['De un árbol alto', 'Debajo de la tierra como raíz', 'Del fondo del mar'],
      correcta: 1,
    },
  },
  {
    id: 'sp-avena',
    foodId: 'avena',
    name: 'Avena',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#9333EA',
    badgeBg: '#F3E8FF',
    superpowerTitle: 'Energía Lenta y Corazón Sano',
    superpowerDesc:
      'Libera energía poco a poco durante horas y su fibra cuida tu corazón y barriguita.',
    bodyZone: 'heart',
    bodyZoneLabel: 'Corazón y Barriguita',
    bodyZoneBenefit: 'Mantiene tu energía estable y limpia tu sistema digestivo.',
    familyTip:
      'Cocínala con canela y trocitos de cambur maduro en lugar de azúcar: queda cremosita, dulce y súper nutritiva.',
    lightningQuestion:
      '¿Con qué fruta podemos endulzar naturalmente un tazón de avena sin usar azúcar?',
    lightningAnswer: '¡Con cambur maduro o mango dulce!',
    preguntaRelampago: {
      enunciado:
        '¿Con qué fruta podemos endulzar naturalmente un tazón de avena sin usar azúcar?',
      opciones: ['Con cambur maduro o mango', 'Con salsa picante', 'Con sal marina'],
      correcta: 0,
    },
  },
  {
    id: 'sp-papa',
    foodId: 'papa',
    name: 'Papa',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#CA8A04',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Combustible Constante',
    superpowerDesc:
      'Te da energía fácil de digerir y vitamina B6 para que tu cerebro trabaje a toda máquina.',
    bodyZone: 'brain',
    bodyZoneLabel: 'Cerebro Activo',
    bodyZoneBenefit: 'Alimenta tu mente para resolver problemas y aprender.',
    familyTip:
      'Prepárala sancochada, al horno o en puré con su piel bien lavada: ahí se concentra mucha de su fibra y potasio.',
    lightningQuestion:
      '¿Por qué es bueno comer papas sancochadas o al horno en vez de papitas de bolsa?',
    lightningAnswer:
      '¡Porque las de bolsa tienen exceso de sal y grasa, y las naturales te dan energía sana!',
    preguntaRelampago: {
      enunciado:
        '¿Por qué es mejor comer papas sancochadas o al horno en vez de papitas de bolsa?',
      opciones: [
        'Las de bolsa tienen exceso de sal y grasa',
        'Las de bolsa están hechas de plástico',
        'Las papas naturales no dan energía',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-pasta',
    foodId: 'pasta',
    name: 'Pasta',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#EAB308',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Energía para Correr sin Parar',
    superpowerDesc:
      'Aporta carbohidratos complejos que recargan tus músculos y tu cerebro para estudiar y jugar con entusiasmo.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Músculos y Energía',
    bodyZoneBenefit: 'Da combustible constante para mantenerte activo toda la tarde.',
    familyTip:
      'Acompáñala con salsa de tomate natural casera, vegetales picaditos y pollo, carne o lentejas en lugar de salsas comerciales.',
    lightningQuestion:
      '¿Con qué conviene acompañar la pasta para armar un almuerzo completo y balanceado?',
    lightningAnswer: '¡Con vegetales frescos y una proteína natural!',
    preguntaRelampago: {
      enunciado:
        '¿Con qué conviene acompañar la pasta para armar un almuerzo completo y balanceado?',
      opciones: [
        'Con vegetales frescos y una proteína natural',
        'Solo con refresco y caramelos',
        'Con papas fritas de bolsa',
      ],
      correcta: 0,
    },
  },
  {
    id: 'sp-casabe',
    foodId: 'casabe',
    name: 'Casabe',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#B45309',
    badgeBg: '#FEF3C7',
    superpowerTitle: 'Crujido Ancestral de Fibra',
    superpowerDesc:
      'Hecho 100% de yuca natural sin frituras, te regala fibra y energía sana para toda la jornada.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Energía y Digestión',
    bodyZoneBenefit: 'Da energía limpia y cuida tu barriguita gracias a su alta fibra.',
    familyTip:
      'Úsalo crujiente para acompañar sopas, pescado o pollo desmechado: es un carbohidrato tradicional sin grasas añadidas.',
    lightningQuestion:
      '¿De qué raíz venezolana se prepara tradicionalmente el casabe?',
    lightningAnswer: '¡De la yuca!',
    preguntaRelampago: {
      enunciado:
        '¿De qué raíz venezolana se prepara tradicionalmente el casabe?',
      opciones: ['De la yuca', 'De la manzana', 'Del azúcar'],
      correcta: 0,
    },
  },
  {
    id: 'sp-cotufas',
    foodId: 'cotufas',
    name: 'Cotufas',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#DC2626',
    badgeBg: '#FEE2E2',
    superpowerTitle: 'Nubes de Maíz Integral',
    superpowerDesc:
      'Cuando se preparan en casa con poquito aceite y poca sal, las cotufas son un grano entero con fibra y energía ligera.',
    bodyZone: 'tummy',
    bodyZoneLabel: 'Fibra y Energía',
    bodyZoneBenefit: 'Dan saciedad ligera y energía saludable para jugar.',
    familyTip:
      'Prepáralas en olla tapada en casa en lugar de comprar paquetes ultraprocesados con exceso de mantequilla artificial y sal.',
    lightningQuestion:
      '¿De qué cereal natural nacen las cotufas?',
    lightningAnswer: '¡Del maíz natural!',
    preguntaRelampago: {
      enunciado: '¿De qué cereal natural nacen las cotufas?',
      opciones: ['Del maíz natural', 'De caramelos derretidos', 'De embutidos'],
      correcta: 0,
    },
  },
  {
    id: 'sp-jojoto',
    foodId: 'jojoto',
    name: 'Jojoto',
    group: 'energy',
    groupLabel: 'Gasolina y Energía',
    frameColor: '#EAB308',
    badgeBg: '#FEF9C3',
    superpowerTitle: 'Granos Dorados de Energía',
    superpowerDesc:
      'Sus granitos amarillos aportan carbohidratos naturales, fibra y antioxidantes que dan energía limpia para todo el día.',
    bodyZone: 'muscles',
    bodyZoneLabel: 'Energía y Vista',
    bodyZoneBenefit: 'Recarga tus músculos y aporta fibra natural del maíz tierno.',
    familyTip:
      'Disfrútalo sancochado, asado o en cachapas caseras con queso blanco fresco en lugar de mantequilla en exceso.',
    lightningQuestion:
      '¿Qué nutriente energético principal nos regala el jojoto tierno?',
    lightningAnswer: '¡Carbohidratos naturales y fibra del maíz!',
    preguntaRelampago: {
      enunciado: '¿Qué nutriente energético principal nos regala el jojoto tierno?',
      opciones: [
        'Carbohidratos naturales y fibra',
        'Azúcar refinada artificial',
        'Grasas de frituras',
      ],
      correcta: 0,
    },
  },
];
