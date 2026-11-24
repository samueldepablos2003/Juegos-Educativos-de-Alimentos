export type TrafficLightColor = 'red' | 'yellow' | 'green';

export interface SemaforoFoodItem {
  id: string;
  foodId: string;
  name: string;
  light: TrafficLightColor;
  hintIfWrong: string;
  successNote: string;
}

export interface TrafficLightRule {
  color: TrafficLightColor;
  title: string;
  subtitle: string;
  description: string;
  bandHex: string;
  bandLightHex: string;
  textOnBand: string;
  exampleFoodIds: string[];
}

export const TRAFFIC_LIGHT_RULES: Record<TrafficLightColor, TrafficLightRule> = {
  red: {
    color: 'red',
    title: 'Luz Roja',
    subtitle: 'Alimentos a evitar / ocasionales',
    description:
      'Son alimentos ultraprocesados con mucha azúcar, sal o grasas saturadas (como refrescos, dulces, perros calientes, donas o papas fritas). Debemos evitarlos o dejarlos solo para ocasiones muy especiales.',
    bandHex: '#fc3e7e',
    bandLightHex: '#FFF0F5',
    textOnBand: '#ffffff',
    exampleFoodIds: ['refresco', 'dona', 'perro_caliente', 'papas_fritas'],
  },
  yellow: {
    color: 'yellow',
    title: 'Luz Amarilla',
    subtitle: 'Alimentos moderados',
    description:
      'Tienen nutrientes y energía importantes para crecer, pero debemos comerlos en porciones medidas y equilibradas (como carnes, quesos, huevos, pan, arepa, arroz y cereales).',
    bandHex: '#fee330',
    bandLightHex: '#FEFCE8',
    textOnBand: '#1E1B2E',
    exampleFoodIds: ['arepa', 'queso', 'huevo', 'pan'],
  },
  green: {
    color: 'green',
    title: 'Luz Verde',
    subtitle: '¡Luz verde para comer todos los días!',
    description:
      'Son alimentos naturales llenos de vitaminas, minerales, fibra y agua pura (como frutas frescas, vegetales y hortalizas). ¡Nos dan defensas y vitalidad cada día!',
    bandHex: '#5dd118',
    bandLightHex: '#F0FDF4',
    textOnBand: '#ffffff',
    exampleFoodIds: ['zanahoria', 'brocoli', 'cambur', 'agua'],
  },
};

export const SEMAFORO_FOODS: SemaforoFoodItem[] = [
  // ================= LUZ ROJA (#fc3e7e) =================
  {
    id: 'sem-refresco',
    foodId: 'refresco',
    name: 'Refresco',
    light: 'red',
    hintIfWrong:
      '¡Casi! El refresco tiene muchísima azúcar añadida; va en la luz de ocasiones muy especiales.',
    successNote: '¡Bien visto! El refresco es solo ocasional por su exceso de azúcar.',
  },
  {
    id: 'sem-dona',
    foodId: 'dona',
    name: 'Dona',
    light: 'red',
    hintIfWrong:
      '¡Prueba otra luz! La dona tiene mucha azúcar y grasa saturada.',
    successNote: '¡Correcto! La dona va en Luz Roja como dulce ocasional.',
  },
  {
    id: 'sem-chucheria',
    foodId: 'chucheria',
    name: 'Chucherías',
    light: 'red',
    hintIfWrong:
      '¡Uy! Las chucherías empaquetadas tienen exceso de sal y grasas; busca su luz adecuada.',
    successNote: '¡Exacto! Las chucherías pertenecen a la Luz Roja.',
  },
  {
    id: 'sem-jugo_cajita',
    foodId: 'jugo_cajita',
    name: 'Jugo de Cajita',
    light: 'red',
    hintIfWrong:
      '¡Ojo! Aunque tenga dibujo de fruta, el jugo de cajita trae mucha azúcar añadida.',
    successNote: '¡Súper! Es mucho mejor elegir fruta fresca o agua pura.',
  },
  {
    id: 'sem-perro_caliente',
    foodId: 'perro_caliente',
    name: 'Perro Caliente',
    light: 'red',
    hintIfWrong:
      '¡Casi! Las salchichas y salsas tienen mucha sal y grasas; prueba en otra luz.',
    successNote: '¡Correcto! El perro caliente se deja solo para ocasiones especiales.',
  },
  {
    id: 'sem-papas_fritas',
    foodId: 'papas_fritas',
    name: 'Papas Fritas',
    light: 'red',
    hintIfWrong:
      '¡Cuidado! Las papas fritas tienen mucha grasa saturada y sal; busca la luz de evitar.',
    successNote: '¡Muy bien! Las papas fritas van en Luz Roja.',
  },
  {
    id: 'sem-caramelos',
    foodId: 'caramelos',
    name: 'Caramelos',
    light: 'red',
    hintIfWrong:
      '¡Casi! Los caramelos son pura azúcar que no nutre; prueba en otra luz.',
    successNote: '¡Genial! Los dulces y caramelos pertenecen a la Luz Roja.',
  },
  {
    id: 'sem-charcuteria',
    foodId: 'charcuteria',
    name: 'Charcutería',
    light: 'red',
    hintIfWrong:
      '¡Ojo! Los embutidos y la charcutería tienen mucha sal y grasas saturadas; busca la luz ocasional.',
    successNote: '¡Excelente! La charcutería va en Luz Roja como alimento ocasional.',
  },
  {
    id: 'sem-salchicha',
    foodId: 'salchicha',
    name: 'Salchicha',
    light: 'red',
    hintIfWrong:
      '¡Cuidado! Las salchichas son embutidos con mucha sal y grasas saturadas; busca la luz ocasional.',
    successNote: '¡Muy bien! Las salchichas van en Luz Roja.',
  },
  {
    id: 'sem-galletas',
    foodId: 'galletas',
    name: 'Galletas',
    light: 'red',
    hintIfWrong:
      '¡Casi! Las galletas rellenas tienen mucha azúcar y grasas; prueba en la luz ocasional.',
    successNote: '¡Correcto! Las galletas rellenas pertenecen a la Luz Roja.',
  },

  // ================= LUZ AMARILLA (#fee330) =================
  {
    id: 'sem-arepa',
    foodId: 'arepa',
    name: 'Arepa',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! La arepa nos da energía rica para estudiar, pero en porciones medidas.',
    successNote: '¡Excelente! La arepa va en Luz Amarilla con porción equilibrada.',
  },
  {
    id: 'sem-queso',
    foodId: 'queso',
    name: 'Queso Blanco',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra vez! El queso fortalece huesos, pero se come con moderación.',
    successNote: '¡Bien! El queso blanco es un alimento moderado de Luz Amarilla.',
  },
  {
    id: 'sem-huevo',
    foodId: 'huevo',
    name: 'Huevo',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! El huevo da proteínas importantes en porciones medidas y equilibradas.',
    successNote: '¡Perfecto! El huevo encaja en Luz Amarilla.',
  },
  {
    id: 'sem-pollo',
    foodId: 'pollo',
    name: 'Pollo',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! Las carnes como el pollo aportan fuerza en porciones moderadas.',
    successNote: '¡Muy bien! El pollo va en la franja de Luz Amarilla.',
  },
  {
    id: 'sem-carne',
    foodId: 'carne',
    name: 'Carne',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra luz! La carne aporta hierro, pero se disfruta en porciones medidas.',
    successNote: '¡Correcto! La carne pertenece a los alimentos moderados.',
  },
  {
    id: 'sem-pan',
    foodId: 'pan',
    name: 'Pan',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! El pan es un cereal que da energía cuando lo comemos en porciones equilibradas.',
    successNote: '¡Así es! El pan va en Luz Amarilla.',
  },
  {
    id: 'sem-arroz',
    foodId: 'arroz',
    name: 'Arroz',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! El arroz nos da energía para el día en porciones medidas.',
    successNote: '¡Excelente! El arroz se clasifica en Luz Amarilla.',
  },
  {
    id: 'sem-avena',
    foodId: 'avena',
    name: 'Avena',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra luz! La avena es un cereal nutritivo ideal en porciones equilibradas.',
    successNote: '¡Muy bien! La avena va en la Luz Amarilla.',
  },
  {
    id: 'sem-platano',
    foodId: 'platano',
    name: 'Plátano',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! El plátano nos da mucha energía natural y se disfruta en porciones equilibradas.',
    successNote: '¡Súper! El plátano pertenece a los alimentos moderados de Luz Amarilla.',
  },
  {
    id: 'sem-lentejas',
    foodId: 'lentejas',
    name: 'Lentejas',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra luz! Las lentejas aportan proteínas y hierro en porciones medidas y nutritivas.',
    successNote: '¡Muy bien! Las lentejas van en Luz Amarilla con porción balanceada.',
  },
  {
    id: 'sem-papa',
    foodId: 'papa',
    name: 'Papa',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! La papa natural da energía constante cuando la comemos en porciones moderadas.',
    successNote: '¡Correcto! La papa forma parte de la Luz Amarilla.',
  },
  {
    id: 'sem-leche',
    foodId: 'leche',
    name: 'Leche Líquida',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra luz! La leche líquida aporta calcio y proteínas en porciones equilibradas.',
    successNote: '¡Excelente! La leche líquida pertenece a la Luz Amarilla.',
  },
  {
    id: 'sem-caraotas',
    foodId: 'caraotas',
    name: 'Caraotas Negras',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! Las caraotas negras aportan hierro y proteína vegetal en porciones equilibradas.',
    successNote: '¡Súper! Las caraotas negras van en Luz Amarilla.',
  },
  {
    id: 'sem-sardinas',
    foodId: 'sardinas',
    name: 'Sardinas',
    light: 'yellow',
    hintIfWrong:
      '¡Prueba otra luz! Las sardinas tienen proteínas y Omega-3 para comer en porciones medidas.',
    successNote: '¡Excelente! Las sardinas forman parte de la Luz Amarilla.',
  },
  {
    id: 'sem-yuca',
    foodId: 'yuca',
    name: 'Yuca',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! La yuca sancochada aporta energía natural en porciones moderadas.',
    successNote: '¡Muy bien! La yuca va en la franja de Luz Amarilla.',
  },
  {
    id: 'sem-pasta',
    foodId: 'pasta',
    name: 'Pasta',
    light: 'yellow',
    hintIfWrong:
      '¡Casi! La pasta es un carbohidrato que nos da energía rica en porciones medidas.',
    successNote: '¡Excelente! La pasta va en Luz Amarilla con porción equilibrada.',
  },

  // ================= LUZ VERDE (#5dd118) =================
  {
    id: 'sem-zanahoria',
    foodId: 'zanahoria',
    name: 'Zanahoria',
    light: 'green',
    hintIfWrong:
      '¡Casi! La zanahoria es una hortaliza natural llena de vitaminas para todos los días.',
    successNote: '¡Luz verde! La zanahoria cuida tus ojos todos los días.',
  },
  {
    id: 'sem-tomate',
    foodId: 'tomate',
    name: 'Tomate',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! El tomate es fresco, natural y cuida tu corazón todos los días.',
    successNote: '¡Súper! El tomate tiene luz verde para comer a diario.',
  },
  {
    id: 'sem-brocoli',
    foodId: 'brocoli',
    name: 'Brócoli',
    light: 'green',
    hintIfWrong:
      '¡Casi! El brócoli es un súper vegetal natural lleno de vitaminas y fibra.',
    successNote: '¡Genial! El brócoli va directo a la Luz Verde.',
  },
  {
    id: 'sem-lechuga',
    foodId: 'repollo',
    name: 'Lechuga',
    light: 'green',
    hintIfWrong:
      '¡Casi! La lechuga es fresca, natural y rica en agua y fibra para todos los días.',
    successNote: '¡Correcto! La lechuga es parte de la Luz Verde diaria.',
  },
  {
    id: 'sem-pepino',
    foodId: 'pepino',
    name: 'Pepino',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! El pepino es un vegetal súper fresco lleno de agua natural.',
    successNote: '¡Muy bien! El pepino va en Luz Verde.',
  },
  {
    id: 'sem-cambur',
    foodId: 'cambur',
    name: 'Cambur',
    light: 'green',
    hintIfWrong:
      '¡Casi! El cambur es una fruta fresca natural llena de potasio y vitaminas.',
    successNote: '¡Excelente! Las frutas frescas como el cambur son Luz Verde.',
  },
  {
    id: 'sem-lechosa',
    foodId: 'lechosa',
    name: 'Lechosa',
    light: 'green',
    hintIfWrong:
      '¡Casi! La lechosa es una fruta natural con mucha agua y fibra para cada día.',
    successNote: '¡Luz verde! La lechosa cuida tu barriguita todos los días.',
  },
  {
    id: 'sem-patilla',
    foodId: 'patilla',
    name: 'Patilla',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! La patilla es fruta fresca cargada de agua natural y vitaminas.',
    successNote: '¡Perfecto! La patilla es Luz Verde para disfrutar cada día.',
  },
  {
    id: 'sem-naranja',
    foodId: 'naranja',
    name: 'Naranja',
    light: 'green',
    hintIfWrong:
      '¡Casi! La naranja es fruta natural con mucha vitamina C para tus defensas diarias.',
    successNote: '¡Bravo! La naranja va en la Luz Verde.',
  },
  {
    id: 'sem-agua',
    foodId: 'agua',
    name: 'Agua Pura',
    light: 'green',
    hintIfWrong:
      '¡Casi! El agua pura es la mejor bebida natural para tomar todos los días.',
    successNote: '¡Excelente! El agua pura siempre tiene Luz Verde.',
  },
  {
    id: 'sem-berenjena',
    foodId: 'berenjena',
    name: 'Berenjena',
    light: 'green',
    hintIfWrong:
      '¡Casi! La berenjena es un vegetal natural lleno de fibra y vitaminas para todos los días.',
    successNote: '¡Luz verde! La berenjena protege tu cuerpo con su color morado.',
  },
  {
    id: 'sem-manzana',
    foodId: 'manzana',
    name: 'Manzana',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! La manzana es una fruta fresca natural llena de fibra para comer a diario.',
    successNote: '¡Genial! La manzana tiene Luz Verde para disfrutar todos los días.',
  },
  {
    id: 'sem-aguacate',
    foodId: 'aguacate',
    name: 'Aguacate',
    light: 'green',
    hintIfWrong:
      '¡Casi! El aguacate es natural y está lleno de grasas buenas y vitaminas para tu cuerpo.',
    successNote: '¡Luz verde! El aguacate nutre tu cerebro y corazón.',
  },
  {
    id: 'sem-parchita',
    foodId: 'parchita',
    name: 'Parchita',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! La parchita es una fruta natural rica en vitamina C para todos los días.',
    successNote: '¡Súper! La parchita va en la Luz Verde.',
  },
  {
    id: 'sem-mango',
    foodId: 'mango',
    name: 'Mango',
    light: 'green',
    hintIfWrong:
      '¡Casi! El mango es una fruta tropical dulce y natural llena de vitaminas diarias.',
    successNote: '¡Bravo! El mango tiene Luz Verde para disfrutar todos los días.',
  },
  {
    id: 'sem-auyama',
    foodId: 'auyama',
    name: 'Auyama',
    light: 'green',
    hintIfWrong:
      '¡Casi! La auyama es una hortaliza natural rica en vitamina A para comer todos los días.',
    successNote: '¡Luz verde! La auyama cuida tu vista todos los días.',
  },
  {
    id: 'sem-pimenton',
    foodId: 'pimenton',
    name: 'Pimentón Rojo',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! El pimentón rojo es un vegetal natural lleno de vitamina C diaria.',
    successNote: '¡Genial! El pimentón rojo va directo a la Luz Verde.',
  },
  {
    id: 'sem-remolacha',
    foodId: 'remolacha',
    name: 'Remolacha',
    light: 'green',
    hintIfWrong:
      '¡Casi! La remolacha es una hortaliza natural morada que te llena de vitalidad.',
    successNote: '¡Excelente! La remolacha tiene Luz Verde.',
  },
  {
    id: 'sem-guayaba',
    foodId: 'guayaba',
    name: 'Guayaba',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! La guayaba es una fruta natural campeona en vitamina C.',
    successNote: '¡Súper! La guayaba pertenece a la Luz Verde diaria.',
  },
  {
    id: 'sem-pina',
    foodId: 'pina',
    name: 'Piña',
    light: 'green',
    hintIfWrong:
      '¡Casi! La piña es fruta fresca natural llena de agua y fibra para cada día.',
    successNote: '¡Muy bien! La piña va en la Luz Verde.',
  },
  {
    id: 'sem-guanabana',
    foodId: 'guanabana',
    name: 'Guanábana',
    light: 'green',
    hintIfWrong:
      '¡Prueba otra luz! La guanábana es una fruta natural llena de fibra y vitaminas.',
    successNote: '¡Perfecto! La guanábana tiene Luz Verde todos los días.',
  },
  {
    id: 'sem-mandarina',
    foodId: 'mandarina',
    name: 'Mandarina',
    light: 'green',
    hintIfWrong:
      '¡Casi! La mandarina es una fruta fresca natural llena de vitamina C para todos los días.',
    successNote: '¡Luz verde! La mandarina fortalece tus defensas todos los días.',
  },
];
