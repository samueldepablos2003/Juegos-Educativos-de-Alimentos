import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'excited' | 'teaching' | 'celebrating';

interface ChefMascotProps {
  message: string;
  mood: MascotMood;
  compact?: boolean;
}

const INK = '#1E1B2E';

export const ChefMascot: React.FC<ChefMascotProps> = ({
  message,
  mood,
  compact = false,
}) => {
  const isCelebrating = mood === 'celebrating' || mood === 'excited';
  const isTeaching = mood === 'teaching';

  return (
    <div className="flex items-end gap-3.5 w-full" data-testid="chef-mascot">
      {/* Prominent Animated Chef Puppy SVG */}
      <div
        className={`shrink-0 ${
          isCelebrating ? 'animate-puppy-celebrate' : 'animate-puppy-breathe'
        } ${compact ? 'w-20 h-24' : 'w-28 h-32 xl:w-32 xl:h-36'}`}
      >
        <svg
          viewBox="0 0 120 135"
          className="w-full h-full drop-shadow-[0_8px_12px_rgba(30,27,46,0.22)]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="puppy-fur" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <linearGradient id="puppy-hat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
          </defs>

          {/* Left floppy ear */}
          <g className="animate-puppy-ear-left">
            <path
              d="M28 54 C14 54, 8 76, 16 90 C22 96, 30 88, 32 74 Z"
              fill="#B45309"
              stroke={INK}
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
          </g>

          {/* Right floppy ear */}
          <g className="animate-puppy-ear-right">
            <path
              d="M92 54 C106 54, 112 76, 104 90 C98 96, 90 88, 88 74 Z"
              fill="#B45309"
              stroke={INK}
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
          </g>

          {/* Torso + Chef apron */}
          <path
            d="M34 94 C30 112, 30 128, 36 130 L84 130 C90 128, 90 112, 86 94 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="3.4"
            strokeLinejoin="round"
          />
          {/* Strawberry Pink chef kerchief */}
          <path
            d="M36 92 Q60 106 84 92 L66 112 Q60 116 54 112 Z"
            fill="#fc3e7e"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Head */}
          <ellipse
            cx="60"
            cy="68"
            rx="32"
            ry="29"
            fill="url(#puppy-fur)"
            stroke={INK}
            strokeWidth="3.4"
          />

          {/* Creamy muzzle patch */}
          <ellipse cx="60" cy="77" rx="18" ry="14" fill="#FFFBEB" />

          {/* Cheek blushes */}
          <ellipse cx="38" cy="75" rx="5.5" ry="3.2" fill="#fc3e7e" opacity="0.55" />
          <ellipse cx="82" cy="75" rx="5.5" ry="3.2" fill="#fc3e7e" opacity="0.55" />

          {/* Eyes (blinking) */}
          <g className="animate-puppy-blink">
            <circle cx="46" cy="63" r="5" fill={INK} />
            <circle cx="44.5" cy="61" r="1.9" fill="#FFFFFF" />
            <circle cx="74" cy="63" r="5" fill={INK} />
            <circle cx="72.5" cy="61" r="1.9" fill="#FFFFFF" />
          </g>

          {/* Expressive eyebrows */}
          {isTeaching ? (
            <>
              <path d="M40 53 Q46 50 52 54" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M68 54 Q74 50 80 53" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M40 54 Q46 49 52 53" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M68 53 Q74 49 80 54" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
            </>
          )}

          {/* Shiny dog nose */}
          <ellipse cx="60" cy="72" rx="6.5" ry="4.5" fill={INK} />
          <ellipse cx="58" cy="70.5" rx="2.2" ry="1.1" fill="#FFFFFF" opacity="0.75" />

          {/* Mouth & happy tongue */}
          {isTeaching ? (
            <path
              d="M52 81 Q60 77 68 81"
              fill="none"
              stroke={INK}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          ) : (
            <g>
              <path
                d="M49 78 Q55 85 60 79 Q65 85 71 78"
                fill="none"
                stroke={INK}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M56 82 C56 90, 64 90, 64 82 Z"
                fill="#fc3e7e"
                stroke={INK}
                strokeWidth="2.2"
              />
            </g>
          )}

          {/* Puffy Chef Toque Hat */}
          <path
            d="M36 44 C26 38, 28 20, 44 20 C48 10, 72 10, 76 20 C92 20, 94 38, 84 44 Z"
            fill="url(#puppy-hat)"
            stroke={INK}
            strokeWidth="3.4"
            strokeLinejoin="round"
          />
          <rect
            x="38"
            y="38"
            width="44"
            height="10"
            rx="4"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="3.2"
          />
          <line x1="49" y1="22" x2="50" y2="35" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="60" y1="19" x2="60" y2="35" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="71" y1="22" x2="70" y2="35" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Expressive Children's Comic Speech Bubble */}
      <div
        className={`relative flex-1 rounded-3xl border-[3px] border-[#1E1B2E] px-5 py-3 shadow-[0_5px_0_#1E1B2E] transition-colors duration-200 mb-2 ${
          isTeaching
            ? 'bg-[#fee330] text-[#1E1B2E]'
            : isCelebrating
              ? 'bg-[#5dd118]/25 text-[#1E1B2E]'
              : 'bg-[#ffffff] text-[#1E1B2E]'
        }`}
        aria-live="polite"
      >
        <div
          className={`absolute -left-3 bottom-6 w-5 h-5 rotate-45 border-l-[3px] border-b-[3px] border-[#1E1B2E] ${
            isTeaching
              ? 'bg-[#fee330]'
              : isCelebrating
                ? 'bg-[#dcf7cb]'
                : 'bg-[#ffffff]'
          }`}
          aria-hidden="true"
        />
        <p className="relative z-10 text-base sm:text-lg xl:text-xl font-extrabold leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};
