import React, { useEffect } from 'react';
import {
  AlertCircle,
  Apple,
  Droplets,
  Drumstick,
  Lightbulb,
  Sparkles,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import { SectorId } from '../data/foods';

export type GuideTopic = 'general' | SectorId | 'processed';

export interface GuideFeedback {
  tone: 'info' | 'success' | 'warning';
  title: string;
  message: string;
}

interface NutritionGuideCardProps {
  topic: GuideTopic;
  isOpen: boolean;
  feedback: GuideFeedback | null;
  onToggleOpen: () => void;
  onSelectTopic: (topic: GuideTopic) => void;
}

interface TopicContent {
  badgeLabel: string;
  title: string;
  funFact: string;
  benefit: string;
  examples: string[];
  headerBg: string;
  headerText: string;
  headerSubtext: string;
  headerShadowClass: string;
  iconBg: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const TOPIC_MAP: Record<GuideTopic, TopicContent> = {
  general: {
    badgeLabel: 'Guía del Plato',
    title: '¡Arma tu Plato!',
    funFact:
      'Un plato balanceado se divide en colores: la mitad de frutas y vegetales, un cuarto de proteínas y un cuarto de energía.',
    benefit:
      '¡Combina 2 colores distintos en el lado verde para activar el súper Plato Arcoíris y multiplicar tus defensas!',
    examples: [
      '2 frutas o vegetales',
      '1 proteína fuerte',
      '1 alimento de energía',
      '1 vaso de agua pura',
    ],
    headerBg: 'bg-[#8137ea]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/90',
    headerShadowClass: '',
    iconBg: 'bg-[#ffffff] text-[#8137ea]',
    Icon: Utensils,
  },
  shield: {
    badgeLabel: '50% del Plato',
    title: 'Frutas y Hortalizas',
    funFact:
      'Cada color tiene vitaminas secretas: el naranja cuida tus ojos, el rojo protege tu corazón y el verde te da súper defensas.',
    benefit:
      'Forman tu escudo protector contra resfriados, ayudan a tu digestión y llenan tu cuerpo de vitalidad.',
    examples: ['Auyama', 'Zanahoria', 'Tomate', 'Brócoli', 'Guayaba', 'Mango'],
    headerBg: 'bg-[#5dd118]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.55)]',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Apple,
  },
  protein: {
    badgeLabel: '25% del Plato',
    title: 'Proteínas',
    funFact:
      'Las proteínas son como pequeños ladrillos constructores que reparan tu cuerpo mientras duermes y te hacen crecer.',
    benefit:
      'Fortalecen tus músculos para correr y saltar, cuidan tus huesos y ayudan a tu memoria en la escuela.',
    examples: ['Caraotas Negras', 'Huevo', 'Pollo', 'Queso Blanco', 'Sardinas'],
    headerBg: 'bg-[#fc3e7e]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.45)]',
    iconBg: 'bg-[#ffffff] text-[#fc3e7e]',
    Icon: Drumstick,
  },
  energy: {
    badgeLabel: '25% del Plato',
    title: 'Energía',
    funFact:
      'Una arepa o un plátano funcionan igual que la batería recargable de tu juguete favorito para aguantar todo el día.',
    benefit:
      'Te dan combustible natural para jugar en el recreo, pensar rápido y no sentir cansancio.',
    examples: ['Arepa', 'Plátano Maduro', 'Arroz', 'Yuca', 'Papa', 'Avena'],
    headerBg: 'bg-[#fee330]',
    headerText: 'text-[#1E1B2E]',
    headerSubtext: 'text-[#1E1B2E]/85',
    headerShadowClass: '',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Zap,
  },
  hydration: {
    badgeLabel: 'Acompañante ideal',
    title: 'Hidratación',
    funFact:
      '¡Más de la mitad de tu cuerpo está hecho de agua! Tu cerebro la necesita para mantenerse despierto y alegre.',
    benefit:
      'El agua pura refresca tu cuerpo y cuida tus dientes, a diferencia de los refrescos o jugos de cajita con azúcar.',
    examples: ['Vaso de Agua Pura', 'Evita refrescos y jugos de cajita'],
    headerBg: 'bg-[#4efcfb]',
    headerText: 'text-[#1E1B2E]',
    headerSubtext: 'text-[#1E1B2E]/85',
    headerShadowClass: '',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Droplets,
  },
  processed: {
    badgeLabel: 'Evitar / Ocasionales',
    title: 'Alimentos Procesados',
    funFact:
      'Los alimentos ultraprocesados suelen esconder mucha azúcar, sal, grasas y colorantes que no ayudan a crecer fuerte.',
    benefit:
      'Identificarlos te convierte en un súper detective de la salud: así eliges agua pura, frutas frescas y comida natural para tu plato diario.',
    examples: [
      'Refresco',
      'Charcutería',
      'Salchicha',
      'Caramelos',
      'Chucherías',
      'Galletas',
      'Jugo de Cajita',
      'Donas',
    ],
    headerBg: 'bg-[#fc3e7e]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.45)]',
    iconBg: 'bg-[#ffffff] text-[#fc3e7e]',
    Icon: AlertCircle,
  },
};

export const NutritionGuideCard: React.FC<NutritionGuideCardProps> = ({
  topic,
  isOpen,
  feedback,
  onToggleOpen,
  onSelectTopic,
}) => {
  const content = TOPIC_MAP[topic];
  const TopicIcon = content.Icon;

  // Close modal on Escape when open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onToggleOpen();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, onToggleOpen]);

  return (
    <>
      {/* CLASSIC REALISTIC 2D INCANDESCENT LIGHTBULB BUTTON IN BOTTOM-LEFT BELOW PROGRESS BAR */}
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 flex flex-col items-center">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-label="Abrir guía educativa ¿Sabías que?"
          title="¿Sabías que...? Toca para descubrir datos curiosos"
          data-testid="guide-expand-btn"
          className="group relative flex flex-col items-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-3xl p-1"
        >
          {/* Warm Interactive Yellow-Orange Glow Aura Behind Bulb */}
          <span
            aria-hidden="true"
            className="animate-bulb-aura pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125"
            style={{
              background:
                'radial-gradient(circle, rgba(255,250,205,0.98) 0%, rgba(255,204,36,0.86) 36%, rgba(255,140,0,0.48) 62%, rgba(255,120,0,0) 78%)',
            }}
          />

          {/* Classic Realistic 2D Incandescent Lightbulb SVG (Static drop-shadow, pure GPU scale on hover) */}
          <svg
            viewBox="0 0 120 138"
            className="animate-bulb-bob pointer-events-none relative w-[74px] h-[84px] sm:w-[88px] sm:h-[100px] drop-shadow-[0_6px_10px_rgba(255,136,0,0.42)] group-hover:scale-108 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            aria-hidden="true"
          >
            <defs>
              {/* Luminous warm yellow-orange glass interior gradient */}
              <radialGradient id="classic-bulb-glass" cx="47%" cy="42%" r="56%">
                <stop offset="0%" stopColor="#fffef5" />
                <stop offset="28%" stopColor="#fff3a1" />
                <stop offset="62%" stopColor="#ffd02b" />
                <stop offset="88%" stopColor="#ff9b19" />
                <stop offset="100%" stopColor="#f57c00" />
              </radialGradient>

              {/* Soft inner incandescent filament bloom */}
              <radialGradient id="filament-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#ffe566" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
              </radialGradient>

              {/* Translucent internal glass stem gradient */}
              <linearGradient id="glass-stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff7cc" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>

              {/* Metallic Edison screw socket cylinder shading */}
              <linearGradient id="screw-metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="22%" stopColor="#e2e8f0" />
                <stop offset="42%" stopColor="#f8fafc" />
                <stop offset="68%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* Screw thread ridge metallic sheen */}
              <linearGradient id="screw-thread-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="32%" stopColor="#ffffff" />
                <stop offset="66%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* Bottom ceramic insulator gradient */}
              <linearGradient id="insulator-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="38%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Warm yellow-orange radiating rays gradient */}
              <linearGradient id="ray-warm-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff8c00" />
                <stop offset="100%" stopColor="#ffe14d" />
              </linearGradient>
            </defs>

            {/* Warm Glowing Radiating Light Rays */}
            <g className="animate-bulb-rays" strokeLinecap="round">
              {/* Top center ray */}
              <line x1="60" y1="4" x2="60" y2="14" stroke="#ff8800" strokeWidth="5.4" strokeOpacity="0.45" />
              <line x1="60" y1="4" x2="60" y2="14" stroke="#ffcf33" strokeWidth="3" />

              {/* Upper-left ray */}
              <line x1="22" y1="18" x2="30" y2="26" stroke="#ff8800" strokeWidth="5.4" strokeOpacity="0.45" />
              <line x1="22" y1="18" x2="30" y2="26" stroke="#ffcf33" strokeWidth="3" />

              {/* Upper-right ray */}
              <line x1="98" y1="18" x2="90" y2="26" stroke="#ff8800" strokeWidth="5.4" strokeOpacity="0.45" />
              <line x1="98" y1="18" x2="90" y2="26" stroke="#ffcf33" strokeWidth="3" />

              {/* Mid-left ray */}
              <line x1="9" y1="50" x2="19" y2="51" stroke="#ff8800" strokeWidth="5.2" strokeOpacity="0.42" />
              <line x1="9" y1="50" x2="19" y2="51" stroke="#ffe169" strokeWidth="2.8" />

              {/* Mid-right ray */}
              <line x1="111" y1="50" x2="101" y2="51" stroke="#ff8800" strokeWidth="5.2" strokeOpacity="0.42" />
              <line x1="111" y1="50" x2="101" y2="51" stroke="#ffe169" strokeWidth="2.8" />

              {/* Lower-left warm accent ray */}
              <line x1="17" y1="78" x2="25" y2="73" stroke="#ff8800" strokeWidth="4.6" strokeOpacity="0.38" />
              <line x1="17" y1="78" x2="25" y2="73" stroke="#ffb703" strokeWidth="2.4" />

              {/* Lower-right warm accent ray */}
              <line x1="103" y1="78" x2="95" y2="73" stroke="#ff8800" strokeWidth="4.6" strokeOpacity="0.38" />
              <line x1="103" y1="78" x2="95" y2="73" stroke="#ffb703" strokeWidth="2.4" />
            </g>

            {/* Classic Pear-Shaped Incandescent Glass Envelope */}
            <path
              d="M 60 20 C 39 20, 25 35, 25 54 C 25 67, 32 76, 38 84 C 41.5 89, 43 93, 43.5 98 L 76.5 98 C 77 93, 78.5 89, 82 84 C 88 76, 95 67, 95 54 C 95 35, 81 20, 60 20 Z"
              fill="url(#classic-bulb-glass)"
              stroke="#1E1B2E"
              strokeWidth="3.4"
              strokeLinejoin="round"
            />

            {/* Warm Inner Filament Halo */}
            <circle cx="60" cy="54" r="22" fill="url(#filament-core-glow)" />

            {/* Subtle Inner Glass Rim Refraction */}
            <path
              d="M 60 24.5 C 42 24.5, 29.5 37.5, 29.5 54 C 29.5 65, 35.5 73.5, 41 81"
              fill="none"
              stroke="#fff9d6"
              strokeOpacity="0.65"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 88 46 C 90.5 52, 89.5 62, 84 71"
              fill="none"
              stroke="#ffe082"
              strokeOpacity="0.55"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Internal Translucent Glass Stem & Pinch Seal */}
            <path
              d="M 52 96 L 54.5 78 C 55 75, 65 75, 65.5 78 L 68 96 Z"
              fill="url(#glass-stem-grad)"
              stroke="#b45309"
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <ellipse cx="60" cy="77.5" rx="5.5" ry="2.2" fill="#fffbeb" fillOpacity="0.8" stroke="#b45309" strokeOpacity="0.45" strokeWidth="1.1" />

            {/* Internal Metallic Lead-in Support Wires */}
            <path
              d="M 55.5 95 L 55.5 77 L 46.5 56"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 64.5 95 L 64.5 77 L 73.5 56"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Fine center support anchor wire */}
            <line
              x1="60"
              y1="76"
              x2="60"
              y2="58"
              stroke="#64748b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Visible Glowing Looped Tungsten Filament (Small Coiled Loops) */}
            <path
              d="M 46.5 56 C 46 47, 52.5 47, 51.8 55.5 C 51.2 61, 48.2 60.5, 49.5 54.5 C 51 47, 58.2 46.5, 57.5 55.5 C 56.9 61, 53.8 60.5, 55.2 54.5 C 56.8 46.5, 63.8 46.5, 63.2 55.5 C 62.6 61, 59.6 60.5, 61 54.5 C 62.6 46.5, 69.5 47, 68.8 55.5 C 68.2 61, 65.2 60.5, 66.6 54.5 C 68 47, 74 47.5, 73.5 56"
              fill="none"
              stroke="#ff6d00"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.65"
            />
            <path
              d="M 46.5 56 C 46 47, 52.5 47, 51.8 55.5 C 51.2 61, 48.2 60.5, 49.5 54.5 C 51 47, 58.2 46.5, 57.5 55.5 C 56.9 61, 53.8 60.5, 55.2 54.5 C 56.8 46.5, 63.8 46.5, 63.2 55.5 C 62.6 61, 59.6 60.5, 61 54.5 C 62.6 46.5, 69.5 47, 68.8 55.5 C 68.2 61, 65.2 60.5, 66.6 54.5 C 68 47, 74 47.5, 73.5 56"
              fill="none"
              stroke="#fffbe6"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glossy Curved Glass Specular Highlights */}
            <path
              d="M 35 47 C 35.5 36.5, 42.5 29.5, 52 27.5"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.92"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <circle cx="34.5" cy="56.5" r="2.2" fill="#ffffff" fillOpacity="0.88" />

            {/* Detailed Metallic Edison Screw Base / Socket */}
            {/* Top Collar Ring meeting the glass neck */}
            <rect
              x="42"
              y="96"
              width="36"
              height="5"
              rx="2.5"
              fill="url(#screw-metal-grad)"
              stroke="#1E1B2E"
              strokeWidth="2.4"
            />

            {/* Main Metallic Threaded Cylinder Body */}
            <path
              d="M 43.5 101 L 76.5 101 L 75 122 C 74.8 124, 73.2 125.5, 71 125.5 L 49 125.5 C 46.8 125.5, 45.2 124, 45 122 Z"
              fill="url(#screw-metal-grad)"
              stroke="#1E1B2E"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* Angled 3D Metallic Screw Thread Grooves & Ridges */}
            <g strokeLinecap="round">
              {/* Thread 1 */}
              <path d="M 42.5 105.5 Q 60 103.5 77.5 107.2" fill="none" stroke="#1E1B2E" strokeWidth="2.4" />
              <path d="M 45 104.2 Q 60 102.3 74.5 105.4" fill="none" stroke="url(#screw-thread-highlight)" strokeWidth="2.2" />

              {/* Thread 2 */}
              <path d="M 43 111.5 Q 60 109.5 77 113.2" fill="none" stroke="#1E1B2E" strokeWidth="2.4" />
              <path d="M 45.5 110.2 Q 60 108.3 74 111.4" fill="none" stroke="url(#screw-thread-highlight)" strokeWidth="2.2" />

              {/* Thread 3 */}
              <path d="M 43.8 117.5 Q 60 115.5 76.2 119.2" fill="none" stroke="#1E1B2E" strokeWidth="2.4" />
              <path d="M 46.2 116.2 Q 60 114.3 73.4 117.4" fill="none" stroke="url(#screw-thread-highlight)" strokeWidth="2.2" />

              {/* Thread 4 lower bevel */}
              <path d="M 45.2 122.8 Q 60 121.2 74.8 124" fill="none" stroke="#334155" strokeWidth="1.9" />
            </g>

            {/* Vertical Metallic Specular Sheen Across Threads */}
            <rect
              x="49"
              y="102"
              width="5"
              height="21.5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.34"
            />

            {/* Dark Ceramic Insulator Cone */}
            <path
              d="M 49.5 125.5 L 70.5 125.5 L 66.5 131.5 L 53.5 131.5 Z"
              fill="url(#insulator-grad)"
              stroke="#1E1B2E"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />

            {/* Bottom Metallic Electrical Contact Tip */}
            <path
              d="M 54.5 131.5 L 65.5 131.5 C 65 135, 62.8 136, 60 136 C 57.2 136, 55 135, 54.5 131.5 Z"
              fill="url(#screw-metal-grad)"
              stroke="#1E1B2E"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>

          {/* Compact Cartoon Pill Label Below Lightbulb */}
          <span className="-mt-0.5 px-2.5 py-0.5 rounded-full bg-gradient-to-b from-[#ffe84d] to-[#ffb703] text-[#1E1B2E] font-display text-[11px] sm:text-xs font-bold border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] whitespace-nowrap group-hover:from-[#fff078] group-hover:to-[#ffc324] transition-colors">
            ¿Sabías que...?
          </span>
        </button>
      </div>

      {/* CHEERFUL POPUP MODAL CARD WHEN LIGHTBULB IS PRESSED */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tarjeta informativa nutricional"
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-[#1E1B2E]/55 flex items-center justify-center p-4"
        >
          <aside
            data-testid="nutrition-guide-card"
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-pop w-full max-w-[440px] max-h-[86vh] flex flex-col rounded-[30px] bg-[#ffffff] border-[3px] border-[#1E1B2E] shadow-[0_10px_0_#1E1B2E] overflow-hidden"
          >
            {/* Dynamic Colored Header matching touched food group or last added food */}
            <div
              className={`flex items-center justify-between gap-2.5 px-5 py-4 ${content.headerBg} border-b-[3px] border-[#1E1B2E] transition-colors duration-300`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-11 h-11 rounded-2xl ${content.iconBg} border-2 border-[#1E1B2E] flex items-center justify-center shrink-0 shadow-[0_3px_0_#1E1B2E] transition-colors duration-300`}
                >
                  <TopicIcon className="w-6 h-6" aria-hidden={true} />
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-extrabold leading-none ${content.headerSubtext} ${content.headerShadowClass}`}>
                    {content.badgeLabel}
                  </p>
                  <h2 className={`font-display text-xl font-bold leading-tight mt-0.5 ${content.headerText} ${content.headerShadowClass}`}>
                    {content.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleOpen}
                aria-expanded={true}
                aria-label="Cerrar guía educativa"
                title="Cerrar"
                data-testid="guide-collapse-btn"
                className="w-9 h-9 rounded-xl bg-[#ffffff] hover:bg-[#FFFDF7] text-[#1E1B2E] border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] flex items-center justify-center shrink-0 cursor-pointer transition-transform active:translate-y-[1px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8137ea]"
              >
                <X className="w-5 h-5 stroke-[2.8]" aria-hidden={true} />
              </button>
            </div>

            {/* Pure White (#ffffff) Body with Crisp #1E1B2E Text */}
            <div
              key={`${topic}-${feedback?.title ?? ''}`}
              className="animate-guide-fade-slide p-5 bg-[#ffffff] flex flex-col gap-3.5 overflow-y-auto tray-scroll"
            >
              {/* Contextual Food / Action Feedback Callout */}
              {feedback && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-2xl p-3.5 text-sm leading-snug border-2 border-[#1E1B2E] text-[#1E1B2E] ${
                    feedback.tone === 'warning'
                      ? 'bg-[#fc3e7e]/15'
                      : feedback.tone === 'success'
                        ? 'bg-[#5dd118]/20'
                        : 'bg-[#fee330]/35'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {feedback.tone === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-[#fc3e7e] shrink-0 mt-0.5" aria-hidden={true} />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#8137ea] shrink-0 mt-0.5" aria-hidden={true} />
                    )}
                    <div>
                      <p className="font-display font-bold text-sm leading-tight text-[#1E1B2E]">
                        {feedback.title}
                      </p>
                      <p className="font-bold mt-0.5 text-[#1E1B2E]/90">{feedback.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sabías que... */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-4 h-4 shrink-0 text-[#8137ea]" aria-hidden={true} />
                  <h3 className="font-display text-base font-bold text-[#8137ea]">
                    Sabías que...
                  </h3>
                </div>
                <p className="text-sm font-bold text-[#1E1B2E] leading-relaxed">
                  {content.funFact}
                </p>
              </div>

              <hr className="border-t-2 border-[#1E1B2E]/10" />

              {/* Kid-friendly Nutritional Benefits */}
              <div>
                <h3 className="font-display text-base font-bold text-[#1E1B2E] mb-1">
                  ¿Cómo te ayuda?
                </h3>
                <p className="text-sm font-semibold text-[#1E1B2E]/85 leading-relaxed">
                  {content.benefit}
                </p>
              </div>

              <hr className="border-t-2 border-[#1E1B2E]/10" />

              {/* Clean Unboxed Examples List */}
              <div>
                <h3 className="font-display text-xs font-bold text-[#8137ea] mb-1">
                  {topic === 'processed'
                    ? 'Ejemplos para dejar solo ocasionalmente'
                    : 'Ejemplos saludables'}
                </h3>
                <p className="text-sm font-extrabold text-[#1E1B2E] leading-relaxed">
                  {content.examples.join(' · ')}
                </p>
              </div>

              {/* Footer Action Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {topic !== 'general' ? (
                  <button
                    type="button"
                    onClick={() => onSelectTopic('general')}
                    className="text-xs font-extrabold text-[#8137ea] hover:text-[#1E1B2E] underline underline-offset-2 cursor-pointer"
                  >
                    Ver guía general del plato
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={onToggleOpen}
                  className="px-5 py-2 rounded-2xl bg-[#8137ea] hover:bg-[#7028d9] text-[#ffffff] font-display text-sm font-bold border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  ¡Seguir jugando!
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
