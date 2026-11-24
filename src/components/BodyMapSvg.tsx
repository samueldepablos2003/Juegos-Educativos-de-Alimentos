import React, { useId } from 'react';
import { BodyZone } from '../data/superpowerCards';

interface BodyMapSvgProps {
  activeZone: BodyZone;
  className?: string;
}

const INK = '#1E1B2E';

const ZONE_COORDS: Record<BodyZone, { cx: number; cy: number; r: number; color: string }> = {
  brain: { cx: 80, cy: 36, r: 22, color: '#8137ea' },
  eyes: { cx: 80, cy: 52, r: 19, color: '#4efcfb' },
  heart: { cx: 88, cy: 105, r: 20, color: '#fc3e7e' },
  tummy: { cx: 80, cy: 132, r: 21, color: '#fee330' },
  muscles: { cx: 36, cy: 112, r: 21, color: '#5dd118' },
  bones: { cx: 66, cy: 185, r: 23, color: '#fee330' },
};

export const BodyMapSvg: React.FC<BodyMapSvgProps> = ({
  activeZone,
  className = 'w-28 h-36 xl:w-32 xl:h-40',
}) => {
  const uid = useId().replace(/:/g, '');
  const focus = ZONE_COORDS[activeZone];

  return (
    <svg
      viewBox="0 0 160 225"
      className={className}
      role="img"
      aria-label={`Mapa del cuerpo destacando ${activeZone}`}
    >
      <defs>
        <radialGradient id={`skin-${uid}`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFE5CC" />
          <stop offset="100%" stopColor="#F4B886" />
        </radialGradient>
        <linearGradient id={`shirt-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`shorts-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.85" />
          <stop offset="65%" stopColor={focus.color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={focus.color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft standing shadow */}
      <ellipse cx="80" cy="214" rx="44" ry="8" fill="#D6C7B2" opacity="0.55" />

      {/* Legs & Shoes */}
      <rect x="57" y="160" width="16" height="44" rx="8" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2.8" />
      <rect x="87" y="160" width="16" height="44" rx="8" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2.8" />
      <path d="M52 204 Q65 198 76 206 L76 212 L52 212 Z" fill="#EF4444" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M84 206 Q95 198 108 204 L108 212 L84 212 Z" fill="#EF4444" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />

      {/* Shorts */}
      <path
        d="M52 146 L108 146 L112 174 L86 174 L80 158 L74 174 L48 174 Z"
        fill={`url(#shorts-${uid})`}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Left Arm (Flexed muscle silhouette) */}
      <path
        d="M49 93 C31 92, 23 106, 30 120 C35 128, 45 124, 48 113"
        fill={`url(#skin-${uid})`}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Right Arm */}
      <path
        d="M111 93 C129 92, 137 106, 130 120 C125 128, 115 124, 112 113"
        fill={`url(#skin-${uid})`}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Shirt / Torso */}
      <path
        d="M50 88 Q80 82 110 88 L113 149 L47 149 Z"
        fill={`url(#shirt-${uid})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Neck & Head */}
      <rect x="72" y="75" width="16" height="14" rx="5" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="80" cy="48" rx="30" ry="29" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="3" />

      {/* Playful Curly Hair */}
      <path
        d="M50 43 C48 24, 64 16, 80 17 C96 16, 112 24, 110 43 C102 34, 92 31, 80 32 C68 31, 58 34, 50 43 Z"
        fill="#5C3A21"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Happy Eyes & Smile */}
      <circle cx="69" cy="51" r="3.8" fill={INK} />
      <circle cx="67.8" cy="49.7" r="1.3" fill="#FFFFFF" />
      <circle cx="91" cy="51" r="3.8" fill={INK} />
      <circle cx="89.8" cy="49.7" r="1.3" fill="#FFFFFF" />
      <ellipse cx="61" cy="59" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.45" />
      <ellipse cx="99" cy="59" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.45" />
      <path d="M72 62 Q80 69 88 62" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />

      {/* Subtle anatomical cues inside the body */}
      {/* Brain cloud cue */}
      <path
        d="M66 34 C66 26, 79 25, 80 31 C81 25, 94 26, 94 34 C94 40, 86 41, 80 39 C74 41, 66 40, 66 34 Z"
        fill={activeZone === 'brain' ? '#DDD6FE' : '#FDE68A'}
        stroke={activeZone === 'brain' ? '#7E22CE' : INK}
        strokeWidth={activeZone === 'brain' ? '2.4' : '1.4'}
        opacity={activeZone === 'brain' ? 1 : 0.35}
      />

      {/* Heart icon cue */}
      <path
        d="M88 100 C84 95, 76 98, 79 106 L88 114 L97 106 C100 98, 92 95, 88 100 Z"
        fill={activeZone === 'heart' ? '#EF4444' : '#FCA5A5'}
        stroke={activeZone === 'heart' ? '#FFFFFF' : INK}
        strokeWidth={activeZone === 'heart' ? '2.2' : '1.4'}
        opacity={activeZone === 'heart' ? 1 : 0.55}
      />

      {/* Tummy warm swirl cue */}
      <circle
        cx="80"
        cy="132"
        r="11"
        fill={activeZone === 'tummy' ? '#FDBA74' : '#E0F2FE'}
        stroke={activeZone === 'tummy' ? '#C2410C' : INK}
        strokeWidth={activeZone === 'tummy' ? '2.4' : '1.4'}
        opacity={activeZone === 'tummy' ? 0.95 : 0.4}
      />

      {/* Muscle bicep cue */}
      <path
        d="M27 110 C27 101, 41 100, 44 109 C46 115, 39 121, 31 118 Z"
        fill={activeZone === 'muscles' ? '#4ADE80' : '#F4B886'}
        stroke={activeZone === 'muscles' ? '#15803D' : INK}
        strokeWidth={activeZone === 'muscles' ? '2.4' : '1.4'}
        opacity={activeZone === 'muscles' ? 1 : 0.35}
      />

      {/* Bone cue in leg */}
      <g opacity={activeZone === 'bones' ? 1 : 0.35}>
        <rect
          x="62"
          y="170"
          width="6"
          height="28"
          rx="3"
          fill="#FFFFFF"
          stroke={activeZone === 'bones' ? '#B45309' : INK}
          strokeWidth={activeZone === 'bones' ? '2.2' : '1.2'}
        />
        <circle cx="63" cy="170" r="3.5" fill="#FFFFFF" stroke={activeZone === 'bones' ? '#B45309' : INK} strokeWidth="1.5" />
        <circle cx="67" cy="170" r="3.5" fill="#FFFFFF" stroke={activeZone === 'bones' ? '#B45309' : INK} strokeWidth="1.5" />
        <circle cx="63" cy="198" r="3.5" fill="#FFFFFF" stroke={activeZone === 'bones' ? '#B45309' : INK} strokeWidth="1.5" />
        <circle cx="67" cy="198" r="3.5" fill="#FFFFFF" stroke={activeZone === 'bones' ? '#B45309' : INK} strokeWidth="1.5" />
      </g>

      {/* Active Pulsing Golden Highlight Ring & Focus Aura */}
      <circle
        cx={focus.cx}
        cy={focus.cy}
        r={focus.r + 12}
        fill={`url(#glow-${uid})`}
        className="animate-body-zone-pulse"
      />
      <circle
        cx={focus.cx}
        cy={focus.cy}
        r={focus.r}
        fill="none"
        stroke="#FACC15"
        strokeWidth="3.5"
        strokeDasharray="6 4"
        className="animate-body-zone-pulse"
      />
      {activeZone === 'eyes' && (
        <g>
          <circle cx="69" cy="51" r="8" fill="none" stroke="#FACC15" strokeWidth="2.5" />
          <circle cx="91" cy="51" r="8" fill="none" stroke="#FACC15" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
};
