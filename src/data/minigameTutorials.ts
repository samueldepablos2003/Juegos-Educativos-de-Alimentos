export interface TutorialSlideItem {
  id: string;
  headerTitle: string;
  headerSubtitle: string;
  headline: string;
  description: string;
  foodId: string;
  foodCaption: string;
  headerGradient: string;
  bodyGradient: string;
  textOnHeader: '#ffffff' | '#1E1B2E';
  accentBarBg: string;
  titleColor: string;
  dotPattern: string;
  badgeEmoji: string;
}

export const NUTRIPLATO_TUTORIAL_SLIDES: TutorialSlideItem[] = [
  {
    id: 'nutriplato-veg-fruit',
    headerTitle: 'Vegetales y Frutas',
    headerSubtitle: 'Lado izquierdo del plato · Vitaminas y Colores',
    headline: '¡Llena tu plato de colores naturales!',
    description:
      'El lado izquierdo del plato se divide en Vegetales (la parte más grande, arriba) y Frutas (abajo). Combina colores distintos como brócoli, zanahoria, tomate, fresa o mango para fortalecer tus defensas.',
    foodId: 'brocoli',
    foodCaption: 'Brócoli',
    headerGradient:
      'linear-gradient(112deg, #16a34a 0%, #32B23E 54%, #65a30d 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #f4ffe8 65%, #dcfce7 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#32B23E',
    titleColor: '#15803d',
    dotPattern: 'radial-gradient(rgba(50, 178, 62, 0.24) 2px, transparent 2px)',
    badgeEmoji: '🥦',
  },
  {
    id: 'nutriplato-cereals-protein',
    headerTitle: 'Cereales y Proteínas',
    headerSubtitle: 'Lado derecho del plato · Energía y Fuerza',
    headline: '¡Combustible para estudiar y músculos fuertes!',
    description:
      'Arriba a la derecha van los Cereales (arepa, arroz, avena, jojoto, casabe o plátano) para darte energía. Abajo a la derecha van las Proteínas (pollo, huevo, caraotas, queso o yogurt) para crecer fuerte.',
    foodId: 'pollo',
    foodCaption: 'Pollo',
    headerGradient:
      'linear-gradient(112deg, #d97706 0%, #E88322 56%, #f59e0b 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #fff7ed 65%, #ffedd5 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#E88322',
    titleColor: '#c2410c',
    dotPattern: 'radial-gradient(rgba(232, 131, 34, 0.22) 2px, transparent 2px)',
    badgeEmoji: '🍗',
  },
  {
    id: 'nutriplato-fats-water',
    headerTitle: 'Grasas Saludables y Agua',
    headerSubtitle: 'Platito extra de Grasas + Vaso de Hidratación',
    headline: '¡El toque final perfecto!',
    description:
      'En el platito circular extra coloca Grasas saludables en poca cantidad como aguacate, aceite vegetal o maní. Y no olvides acompañar siempre tu comida con tu vaso de Agua Pura fresca.',
    foodId: 'aguacate',
    foodCaption: 'Aguacate',
    headerGradient:
      'linear-gradient(112deg, #eab308 0%, #F5B82E 56%, #fde047 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #fffdf0 65%, #fef9c3 100%)',
    textOnHeader: '#1E1B2E',
    accentBarBg: '#F5B82E',
    titleColor: '#a16207',
    dotPattern: 'radial-gradient(rgba(245, 184, 46, 0.24) 2px, transparent 2px)',
    badgeEmoji: '🥑',
  },
  {
    id: 'nutriplato-howto',
    headerTitle: '¿Cómo se juega?',
    headerSubtitle: 'Modo Educativo o Modo Contrarreloj',
    headline: '¡Arrastra alimentos y evita ultraprocesados!',
    description:
      'Arrastra (o toca) cada alimento de la bandeja derecha hacia su lugar en el plato y evita ultraprocesados como refrescos o dulces. Puedes jugar sin prisas en Modo Educativo o retarte contra el reloj.',
    foodId: 'refresco',
    foodCaption: 'Evita ultraprocesados',
    headerGradient:
      'linear-gradient(112deg, #6d28d9 0%, #8137ea 54%, #a855f7 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #faf5ff 65%, #ede9fe 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#8137ea',
    titleColor: '#6d28d9',
    dotPattern: 'radial-gradient(rgba(129, 55, 234, 0.2) 2px, transparent 2px)',
    badgeEmoji: '🎯',
  },
];

export const SUPERPOWER_TUTORIAL_SLIDES: TutorialSlideItem[] = [
  {
    id: 'superpower-vote',
    headerTitle: 'Cartas del Superpoder',
    headerSubtitle: 'Paso 1 · Explora y vota en grupo',
    headline: '¡Elige una de las tres cartas!',
    description:
      'En cada ronda aparecerán 3 alimentos distintos listos para descubrir. En clase o en familia, voten juntos cuál les da más curiosidad y tóquenlo (o presionen 1, 2 o 3) para abrir su carta.',
    foodId: 'aguacate',
    foodCaption: 'Aguacate',
    headerGradient:
      'linear-gradient(112deg, #6d28d9 0%, #8137ea 54%, #a855f7 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #faf5ff 65%, #ede9fe 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#8137ea',
    titleColor: '#6d28d9',
    dotPattern: 'radial-gradient(rgba(129, 55, 234, 0.2) 2px, transparent 2px)',
    badgeEmoji: '🃏',
  },
  {
    id: 'superpower-reveal',
    headerTitle: 'Descubre su Superpoder',
    headerSubtitle: 'Paso 2 · Ficha educativa en 3D',
    headline: '¡Conoce cómo ayuda a tu cuerpo!',
    description:
      'Al abrir una carta verás al alimento cobrando vida en 3D junto a su Superpoder Nutricional: descubre qué órganos fortalece, qué vitaminas aporta y por qué es tan valioso para crecer sano.',
    foodId: 'zanahoria',
    foodCaption: 'Zanahoria',
    headerGradient:
      'linear-gradient(112deg, #16a34a 0%, #5dd118 54%, #84cc16 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #f4ffe8 65%, #dcfce7 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#5dd118',
    titleColor: '#15803d',
    dotPattern: 'radial-gradient(rgba(93, 209, 24, 0.24) 2px, transparent 2px)',
    badgeEmoji: '✨',
  },
  {
    id: 'superpower-hometip',
    headerTitle: 'Consejo para Casa',
    headerSubtitle: 'Paso 3 · 10 rondas de aprendizaje',
    headline: '¡Lleva las ideas a tu mesa!',
    description:
      'Cada carta incluye un consejo práctico para preparar el alimento de forma rica y saludable en casa. Usa las flechas amarillas para avanzar por las 10 rondas y explorar todo el catálogo.',
    foodId: 'mango',
    foodCaption: 'Mango',
    headerGradient:
      'linear-gradient(112deg, #eab308 0%, #fee330 56%, #fde047 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #fffdf0 65%, #fef9c3 100%)',
    textOnHeader: '#1E1B2E',
    accentBarBg: '#eab308',
    titleColor: '#a16207',
    dotPattern: 'radial-gradient(rgba(234, 179, 8, 0.24) 2px, transparent 2px)',
    badgeEmoji: '🏡',
  },
];

export const LIGHTNING_TUTORIAL_SLIDES: TutorialSlideItem[] = [
  {
    id: 'lightning-questions',
    headerTitle: 'Preguntas Relámpago',
    headerSubtitle: 'Paso 1 · Piensa bien tu respuesta',
    headline: '¡Responde sin pistas del alimento!',
    description:
      'Leerás una pregunta sobre alimentación saludable con 3 opciones posibles (puedes tocar tu respuesta o usar las teclas 1, 2 y 3). ¡El alimento secreto permanecerá oculto hasta que aciertes!',
    foodId: 'avena',
    foodCaption: 'Avena',
    headerGradient:
      'linear-gradient(112deg, #6d28d9 0%, #8137ea 54%, #a855f7 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #faf5ff 65%, #ede9fe 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#8137ea',
    titleColor: '#6d28d9',
    dotPattern: 'radial-gradient(rgba(129, 55, 234, 0.2) 2px, transparent 2px)',
    badgeEmoji: '⚡',
  },
  {
    id: 'lightning-reveal',
    headerTitle: 'Aciertos y Errores',
    headerSubtitle: 'Paso 2 · Revelación 3D y Barra de Estrella',
    headline: '¡Acierta para llenar la barra al 100%!',
    description:
      'Cuando respondes correctamente, el alimento aparece flotando en 3D con su explicación y tu barra con estrella avanza hasta la victoria. Si te equivocas, verás una alerta en rojo y se registrará el fallo.',
    foodId: 'mandarina',
    foodCaption: 'Mandarina',
    headerGradient:
      'linear-gradient(112deg, #16a34a 0%, #5dd118 54%, #84cc16 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #f4ffe8 65%, #dcfce7 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#5dd118',
    titleColor: '#15803d',
    dotPattern: 'radial-gradient(rgba(93, 209, 24, 0.24) 2px, transparent 2px)',
    badgeEmoji: '⭐',
  },
  {
    id: 'lightning-modes',
    headerTitle: 'Individual o en Equipos',
    headerSubtitle: 'Paso 3 · Configura tu partida ideal',
    headline: '¡Juega solo, contrarreloj o en duelo!',
    description:
      'Antes de iniciar puedes elegir dificultad (Fácil, Medio, Difícil o Mixto), cantidad de preguntas, límite de tiempo o activar el Modo en Equipos (Equipo 1 vs. Equipo 2) por turnos alternos.',
    foodId: 'sardinas',
    foodCaption: 'Sardinas',
    headerGradient:
      'linear-gradient(112deg, #e11d48 0%, #fc3e7e 56%, #fb7185 100%)',
    bodyGradient:
      'linear-gradient(155deg, #ffffff 0%, #fff5f8 65%, #ffe4ec 100%)',
    textOnHeader: '#ffffff',
    accentBarBg: '#fc3e7e',
    titleColor: '#be123c',
    dotPattern: 'radial-gradient(rgba(252, 62, 126, 0.2) 2px, transparent 2px)',
    badgeEmoji: '🏆',
  },
];
