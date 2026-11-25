import React, { useEffect } from 'react';
import {
  AlertCircle,
  Apple,
  Carrot,
  Droplets,
  Drumstick,
  Flame,
  Lightbulb,
  Sparkles,
  Utensils,
  Wheat,
  X,
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
      'Un plato saludable reúne 4 zonas principales (Vegetales, Frutas, Cereales y Proteínas), un platito extra para Grasas saludables y tu vaso de Agua Pura.',
    benefit:
      '¡Combina distintos colores entre tus Vegetales y Frutas para activar el súper Plato Arcoíris y multiplicar tus defensas!',
    examples: [
      'Vegetales',
      'Frutas',
      'Cereales',
      'Proteínas',
      'Grasas saludables',
      'Agua Pura',
    ],
    headerBg: 'bg-[#8137ea]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/90',
    headerShadowClass: '',
    iconBg: 'bg-[#ffffff] text-[#8137ea]',
    Icon: Utensils,
  },
  vegetables: {
    badgeLabel: 'Grupo del Plato',
    title: 'Vegetales',
    funFact:
      'Los vegetales ocupan la sección más grande del plato: cada color aporta vitaminas secretas para tus ojos, tu corazón y tus defensas.',
    benefit:
      'Te dan fibra, minerales y vitalidad todos los días para mantener tu cuerpo fuerte y protegido.',
    examples: ['Auyama', 'Zanahoria', 'Tomate', 'Brócoli', 'Pepino', 'Repollo'],
    headerBg: 'bg-[#32B23E]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.55)]',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Carrot,
  },
  fruits: {
    badgeLabel: 'Grupo del Plato',
    title: 'Frutas',
    funFact:
      'Las frutas enteras tienen dulzor natural, agua fresca y muchísima vitamina C que protege tu cuerpo contra resfriados.',
    benefit:
      'Ayudan a tu digestión, hidratan tu cuerpo y te llenan de energía natural sin azúcar añadida.',
    examples: ['Mango', 'Guayaba', 'Fresa', 'Melón', 'Cambur', 'Naranja'],
    headerBg: 'bg-[#B4133F]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.45)]',
    iconBg: 'bg-[#ffffff] text-[#B4133F]',
    Icon: Apple,
  },
  cereals: {
    badgeLabel: 'Grupo del Plato',
    title: 'Cereales',
    funFact:
      'Los cereales y alimentos ricos en carbohidratos naturales funcionan como la batería recargable de tu cuerpo para rendir todo el día.',
    benefit:
      'Te dan combustible constante para estudiar, jugar en el recreo y pensar rápido sin cansarte.',
    examples: ['Arepa', 'Arroz', 'Avena', 'Jojoto', 'Casabe', 'Plátano Maduro'],
    headerBg: 'bg-[#A88864]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.45)]',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Wheat,
  },
  protein: {
    badgeLabel: 'Grupo del Plato',
    title: 'Proteínas',
    funFact:
      'Las proteínas son como pequeños ladrillos constructores que reparan tu cuerpo mientras duermes y te ayudan a crecer.',
    benefit:
      'Fortalecen tus músculos para correr y saltar, cuidan tus huesos y apoyan tu memoria en la escuela.',
    examples: ['Caraotas Negras', 'Huevo', 'Pollo', 'Queso Blanco', 'Atún', 'Yogurt'],
    headerBg: 'bg-[#E88322]',
    headerText: 'text-[#ffffff]',
    headerSubtext: 'text-[#ffffff]/95',
    headerShadowClass: 'drop-shadow-[0_1.5px_0_rgba(30,27,46,0.45)]',
    iconBg: 'bg-[#ffffff] text-[#E88322]',
    Icon: Drumstick,
  },
  fats: {
    badgeLabel: 'Plato Extra',
    title: 'Grasas Saludables',
    funFact:
      'Las grasas saludables van en su platito aparte en porciones pequeñas: ayudan a que tu cuerpo absorba mejor las vitaminas.',
    benefit:
      'Cuidan tu cerebro, protegen tu corazón y te brindan energía de calidad cuando eliges opciones naturales.',
    examples: ['Aguacate', 'Aceite vegetal', 'Maní'],
    headerBg: 'bg-[#F5B82E]',
    headerText: 'text-[#1E1B2E]',
    headerSubtext: 'text-[#1E1B2E]/85',
    headerShadowClass: '',
    iconBg: 'bg-[#ffffff] text-[#1E1B2E]',
    Icon: Flame,
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
      'Mayonesa',
      'Helado',
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
      {/* CHEERFUL POPUP MODAL CARD */}
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
