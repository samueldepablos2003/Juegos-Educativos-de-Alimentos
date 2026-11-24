import React from 'react';

const INK = '#422415';

export function renderMainsAndDrinksArt(id: string, uid: string): React.ReactNode | null {
  switch (id) {
    // PROTEINS
    case 'caraotas':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-car-bowl`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <radialGradient id={`${uid}-car-broth`} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#44403C" />
              <stop offset="100%" stopColor="#1C1917" />
            </radialGradient>
          </defs>
          {/* Steam curls */}
          <path d="M38 26 Q34 18 40 12" fill="none" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M52 24 Q48 16 54 10" fill="none" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M64 26 Q60 18 66 12" fill="none" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
          {/* Ceramic bowl */}
          <path
            d="M16 46 C16 74, 32 86, 50 86 C68 86, 84 74, 84 46 Z"
            fill={`url(#${uid}-car-bowl)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <ellipse cx="50" cy="46" rx="34" ry="13" fill="#FFF7ED" stroke={INK} strokeWidth="3.2" />
          <ellipse cx="50" cy="46" rx="29" ry="9.5" fill={`url(#${uid}-car-broth)`} />
          {/* Glossy black beans */}
          <ellipse cx="36" cy="45" rx="6" ry="4" transform="rotate(-15 36 45)" fill="#292524" stroke="#57534E" strokeWidth="1.2" />
          <ellipse cx="48" cy="43" rx="6.2" ry="4" transform="rotate(10 48 43)" fill="#292524" stroke="#57534E" strokeWidth="1.2" />
          <ellipse cx="61" cy="45" rx="6" ry="4" transform="rotate(22 61 45)" fill="#292524" stroke="#57534E" strokeWidth="1.2" />
          <ellipse cx="42" cy="50" rx="5.8" ry="3.8" transform="rotate(8 42 50)" fill="#1C1917" stroke="#57534E" strokeWidth="1.2" />
          <ellipse cx="55" cy="50" rx="5.8" ry="3.8" transform="rotate(-12 55 50)" fill="#1C1917" stroke="#57534E" strokeWidth="1.2" />
          {/* Bean specular highlights */}
          <circle cx="35" cy="44" r="1.3" fill="#E7E5E4" />
          <circle cx="47" cy="42" r="1.4" fill="#E7E5E4" />
          <circle cx="60" cy="44" r="1.3" fill="#E7E5E4" />
          <path d="M26 65 Q36 76 50 78" fill="none" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>
      );

    case 'huevo':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-hue-white`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </radialGradient>
            <radialGradient id={`${uid}-hue-yolk`} cx="38%" cy="34%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="55%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          {/* Left egg half */}
          <path
            d="M36 22 C22 22, 14 40, 16 60 C18 76, 28 84, 38 84 C48 84, 54 74, 54 58 C54 38, 48 22, 36 22 Z"
            fill={`url(#${uid}-hue-white)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <circle cx="35" cy="60" r="11" fill={`url(#${uid}-hue-yolk)`} stroke="#B45309" strokeWidth="2" />
          <circle cx="31" cy="56" r="2.8" fill="#FFFBEB" opacity="0.85" />
          {/* Right egg half */}
          <path
            d="M65 26 C52 26, 46 42, 47 60 C48 76, 56 84, 67 84 C78 84, 86 72, 85 56 C84 38, 76 26, 65 26 Z"
            fill={`url(#${uid}-hue-white)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <circle cx="66" cy="61" r="11" fill={`url(#${uid}-hue-yolk)`} stroke="#B45309" strokeWidth="2" />
          <circle cx="62" cy="57" r="2.8" fill="#FFFBEB" opacity="0.85" />
        </g>
      );

    case 'pollo':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-pol-skin`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id={`${uid}-pol-meat`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="60%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Back crispy golden wing/breast */}
          <path
            d="M24 58 C18 40, 32 24, 54 24 C74 24, 86 38, 84 56 C82 70, 68 78, 50 78 C36 78, 28 70, 24 58 Z"
            fill={`url(#${uid}-pol-skin)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Roasted drumstick in foreground */}
          <path
            d="M22 44 L14 38 C10 35, 13 28, 18 30 L21 32 C20 27, 26 24, 29 29 L35 36 Z"
            fill="#FFFBEB"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M27 42 C34 32, 54 30, 68 42 C78 50, 76 66, 62 72 C48 78, 30 68, 25 56 C22 50, 24 46, 27 42 Z"
            fill={`url(#${uid}-pol-meat)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Juicy shredded chicken strands */}
          <path d="M36 46 Q48 39 60 46" fill="none" stroke="#FFFBEB" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <path d="M34 55 Q49 48 64 56" fill="none" stroke="#FEF3C7" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
          <path d="M40 64 Q52 59 62 64" fill="none" stroke="#92400E" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
          {/* Glossy roasted highlight */}
          <ellipse cx="47" cy="38" rx="8" ry="3.5" transform="rotate(-10 47 38)" fill="#FFFFFF" opacity="0.6" />
          {/* Fresh herb leaves garnish */}
          <path
            d="M64 30 C60 22, 68 16, 73 22 C79 16, 85 24, 77 31 Z"
            fill="#22C55E"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </g>
      );

    case 'sardinas':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-sar-body`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="45%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          {/* Silver sardine */}
          <path
            d="M14 54 C28 34, 60 32, 76 50 L88 38 L84 52 L88 66 L76 54 C60 72, 28 70, 14 54 Z"
            fill={`url(#${uid}-sar-body)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Gill, eye, fin */}
          <path d="M32 45 Q36 53 32 61" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="51" r="2.8" fill={INK} />
          <circle cx="23" cy="50" r="1" fill="#FFFFFF" />
          <path d="M44 40 L54 32 L56 41 Z" fill="#CBD5E1" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M38 50 Q55 47 70 51" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          {/* Lemon wedge beside fish */}
          <path d="M42 74 C52 86, 72 86, 80 74 Z" fill="#FACC15" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M47 75 C55 82, 67 82, 75 75 Z" fill="#FEF08A" />
        </g>
      );

    case 'queso':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-que-top`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id={`${uid}-que-side`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
          {/* 3D fresh white cheese wedge */}
          <path
            d="M16 48 L52 24 L84 42 L84 72 L42 82 L16 68 Z"
            fill={`url(#${uid}-que-side)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M16 48 L52 24 L84 42 L42 58 Z"
            fill={`url(#${uid}-que-top)`}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <line x1="42" y1="58" x2="42" y2="82" stroke={INK} strokeWidth="2.8" />
          {/* Soft cheese holes */}
          <circle cx="58" cy="64" r="4.2" fill="#F59E0B" opacity="0.45" />
          <circle cx="72" cy="56" r="3" fill="#F59E0B" opacity="0.45" />
          <circle cx="29" cy="64" r="3.4" fill="#F59E0B" opacity="0.45" />
          <circle cx="51" cy="40" r="3.2" fill="#FDE68A" />
        </g>
      );

    case 'carne':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-crn-main`} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="65%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
          </defs>
          {/* Juicy shredded/ground beef mound */}
          <path
            d="M16 64 C14 44, 30 30, 50 30 C70 30, 86 44, 84 64 C82 78, 68 82, 50 82 C32 82, 18 78, 16 64 Z"
            fill={`url(#${uid}-crn-main)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Rich texture & sweet pepper bits */}
          <path d="M26 56 Q44 42 66 52" fill="none" stroke="#D97706" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M32 68 Q52 58 72 68" fill="none" stroke="#9A3412" strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="39" cy="48" r="3" fill="#EF4444" />
          <circle cx="59" cy="45" r="2.8" fill="#22C55E" />
          <circle cx="52" cy="60" r="3" fill="#EF4444" />
          <path d="M34 39 Q46 34 60 39" fill="none" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        </g>
      );

    case 'lentejas':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-len-bowl`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path
            d="M16 48 C16 74, 32 86, 50 86 C68 86, 84 74, 84 48 Z"
            fill={`url(#${uid}-len-bowl)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <ellipse cx="50" cy="48" rx="34" ry="13" fill="#FFFBEB" stroke={INK} strokeWidth="3.2" />
          <ellipse cx="50" cy="48" rx="29" ry="9.5" fill="#92400E" />
          {/* Warm lentils */}
          <circle cx="36" cy="47" r="4" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          <circle cx="46" cy="44" r="4.2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <circle cx="56" cy="45" r="4" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          <circle cx="64" cy="49" r="3.8" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <circle cx="43" cy="51" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          <circle cx="53" cy="52" r="4" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          <circle cx="50" cy="48" r="2.2" fill="#EF4444" />
        </g>
      );

    // CARBS
    case 'arepa':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-are-body`} cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="55%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          {/* Thick golden grilled Venezuelan arepa */}
          <ellipse cx="50" cy="56" rx="35" ry="27" fill="#CA8A04" stroke={INK} strokeWidth="3.2" />
          <ellipse cx="50" cy="49" rx="35" ry="26" fill={`url(#${uid}-are-body)`} stroke={INK} strokeWidth="3.2" />
          {/* Budare grill marks */}
          <path d="M30 40 Q42 36 52 40" fill="none" stroke="#92400E" strokeWidth="3.4" strokeLinecap="round" opacity="0.7" />
          <path d="M56 44 Q66 41 72 46" fill="none" stroke="#92400E" strokeWidth="3.2" strokeLinecap="round" opacity="0.65" />
          <path d="M28 53 Q40 50 50 54" fill="none" stroke="#92400E" strokeWidth="3.4" strokeLinecap="round" opacity="0.65" />
          <path d="M44 62 Q58 59 68 62" fill="none" stroke="#92400E" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          {/* Specular shine */}
          <path d="M26 36 Q38 27 56 28" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.75" />
        </g>
      );

    case 'platano':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-pla-gold`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Slice 1 */}
          <path
            d="M16 56 C18 42, 42 26, 62 28 C70 29, 72 38, 64 46 C50 60, 26 68, 16 56 Z"
            fill={`url(#${uid}-pla-gold)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M28 52 Q44 39 58 36" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          {/* Slice 2 */}
          <path
            d="M30 74 C32 60, 56 44, 78 46 C86 47, 88 56, 80 64 C66 78, 40 86, 30 74 Z"
            fill={`url(#${uid}-pla-gold)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M42 70 Q58 57 74 54" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <path d="M44 38 Q54 32 60 33" fill="none" stroke="#FFFBEB" strokeWidth="2.8" strokeLinecap="round" opacity="0.8" />
        </g>
      );

    case 'arroz':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-arr-bowl`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          {/* Fluffy white rice dome */}
          <path
            d="M20 50 C20 26, 36 18, 50 18 C64 18, 80 26, 80 50 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Individual rice grains */}
          <ellipse cx="40" cy="34" rx="3.2" ry="1.6" transform="rotate(-20 40 34)" fill="#E2E8F0" />
          <ellipse cx="52" cy="29" rx="3.2" ry="1.6" transform="rotate(15 52 29)" fill="#E2E8F0" />
          <ellipse cx="62" cy="36" rx="3.2" ry="1.6" transform="rotate(25 62 36)" fill="#E2E8F0" />
          <ellipse cx="34" cy="43" rx="3.2" ry="1.6" transform="rotate(10 34 43)" fill="#E2E8F0" />
          <ellipse cx="49" cy="40" rx="3.2" ry="1.6" transform="rotate(-10 49 40)" fill="#E2E8F0" />
          {/* Bowl */}
          <path
            d="M16 48 C16 74, 32 86, 50 86 C68 86, 84 74, 84 48 Z"
            fill={`url(#${uid}-arr-bowl)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <path d="M26 66 Q36 77 50 78" fill="none" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>
      );

    case 'yuca':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-yuc-flesh`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          {/* Back cassava piece */}
          <path
            d="M22 44 C22 30, 44 24, 62 28 C72 30, 74 44, 66 52 C52 58, 22 56, 22 44 Z"
            fill={`url(#${uid}-yuc-flesh)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <path d="M28 40 Q46 34 62 38" fill="none" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Front cassava piece */}
          <path
            d="M28 66 C26 52, 48 44, 72 48 C82 50, 84 64, 74 74 C60 82, 32 80, 28 66 Z"
            fill={`url(#${uid}-yuc-flesh)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <path d="M36 62 Q54 56 72 60" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <circle cx="72" cy="60" r="2.2" fill="#D97706" opacity="0.45" />
        </g>
      );

    case 'papa':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-pap-body`} cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </radialGradient>
          </defs>
          {/* Back potato */}
          <path
            d="M20 44 C18 28, 38 20, 56 26 C70 30, 72 48, 60 58 C44 66, 22 58, 20 44 Z"
            fill={`url(#${uid}-pap-body)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Front golden potato */}
          <path
            d="M34 62 C32 46, 52 38, 72 44 C86 48, 88 68, 74 78 C56 86, 36 76, 34 62 Z"
            fill={`url(#${uid}-pap-body)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <circle cx="52" cy="56" r="1.8" fill="#78350F" opacity="0.55" />
          <circle cx="67" cy="64" r="1.8" fill="#78350F" opacity="0.55" />
          <circle cx="36" cy="38" r="1.6" fill="#78350F" opacity="0.55" />
          <path d="M43 50 Q55 44 66 47" fill="none" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'avena':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-ave-bowl`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
          </defs>
          <path
            d="M16 48 C16 74, 32 86, 50 86 C68 86, 84 74, 84 48 Z"
            fill={`url(#${uid}-ave-bowl)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <ellipse cx="50" cy="48" rx="34" ry="13" fill="#FFFBEB" stroke={INK} strokeWidth="3.2" />
          <ellipse cx="50" cy="48" rx="29" ry="9.5" fill="#FDE68A" />
          {/* Cinnamon swirl & oat flakes */}
          <path d="M36 48 Q50 42 64 48 Q52 54 40 49" fill="none" stroke="#B45309" strokeWidth="2.8" strokeLinecap="round" />
          <ellipse cx="44" cy="45" rx="3" ry="1.8" fill="#F59E0B" />
          <ellipse cx="58" cy="46" rx="3" ry="1.8" fill="#F59E0B" />
          <path d="M46 28 Q42 18 48 12" fill="none" stroke="#CBD5E1" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M58 28 Q54 18 60 12" fill="none" stroke="#CBD5E1" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );

    // HYDRATION & DISTRACTORS
    case 'agua':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-agu-water`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="60%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Glass body */}
          <path
            d="M27 20 L73 20 L66 84 C65 87, 35 87, 34 84 Z"
            fill="#E0F2FE"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Water fill */}
          <path
            d="M29 36 C38 33, 62 39, 71 36 L65 82 C64 84, 36 84, 35 82 Z"
            fill={`url(#${uid}-agu-water)`}
          />
          <ellipse cx="50" cy="36" rx="21" ry="4.5" fill="#BAE6FD" opacity="0.85" />
          {/* Happy water droplet / bubbles */}
          <circle cx="42" cy="54" r="3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="58" cy="64" r="2.2" fill="#FFFFFF" opacity="0.7" />
          <circle cx="48" cy="72" r="2.6" fill="#FFFFFF" opacity="0.65" />
          {/* Cute smile inside glass */}
          <circle cx="44" cy="57" r="2.2" fill={INK} />
          <circle cx="56" cy="57" r="2.2" fill={INK} />
          <path d="M46 62 Q50 66 54 62" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          {/* Glass specular reflection */}
          <line x1="34" y1="26" x2="39" y2="78" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'refresco':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-ref-cola`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#451A03" />
              <stop offset="50%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>
          </defs>
          {/* Bottle */}
          <path
            d="M42 12 L58 12 L58 22 L68 38 L68 82 C68 86, 32 86, 32 82 L32 38 L42 22 Z"
            fill={`url(#${uid}-ref-cola)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Cap */}
          <rect x="40" y="10" width="20" height="7" rx="3" fill="#EF4444" stroke={INK} strokeWidth="2.6" />
          {/* Label */}
          <rect x="33" y="45" width="34" height="20" fill="#DC2626" stroke={INK} strokeWidth="2.4" />
          <path d="M36 55 Q50 50 64 55" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Fizz & warning sugar cubes vibe */}
          <path d="M38 38 L38 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        </g>
      );

    case 'jugo_cajita':
      return (
        <g>
          {/* Straw */}
          <path d="M56 26 L62 10 L74 12" fill="none" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Juice box */}
          <rect x="28" y="26" width="44" height="58" rx="6" fill="#FB923C" stroke={INK} strokeWidth="3.2" />
          <rect x="33" y="38" width="34" height="28" rx="4" fill="#FEF3C7" />
          <circle cx="50" cy="52" r="9" fill="#F97316" stroke={INK} strokeWidth="2" />
          <path d="M50 43 C53 39, 57 39, 58 42" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="33" y1="31" x2="33" y2="78" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
        </g>
      );

    case 'chucheria':
      return (
        <g>
          {/* Crinkled snack bag */}
          <path
            d="M24 18 L76 18 L70 30 L74 72 L78 84 L22 84 L26 72 L30 30 Z"
            fill="#EF4444"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <rect x="29" y="34" width="42" height="32" rx="6" fill="#FACC15" stroke={INK} strokeWidth="2.6" />
          <circle cx="45" cy="50" r="8" fill="#FB923C" stroke={INK} strokeWidth="2" />
          <circle cx="56" cy="52" r="7" fill="#F97316" stroke={INK} strokeWidth="2" />
          <path d="M34 38 L34 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        </g>
      );

    case 'dona':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-don-dough`} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          {/* Dough ring */}
          <circle cx="50" cy="52" r="32" fill={`url(#${uid}-don-dough)`} stroke={INK} strokeWidth="3.2" />
          {/* Pink frosting */}
          <path
            d="M22 46 C22 26, 78 26, 78 46 C78 58, 70 62, 64 56 C58 50, 52 64, 46 58 C40 52, 34 62, 26 56 C22 52, 22 48, 22 46 Z"
            fill="#F472B6"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Center hole */}
          <circle cx="50" cy="50" r="10" fill="#FFF8EB" stroke={INK} strokeWidth="3" />
          {/* Sprinkles */}
          <line x1="34" y1="36" x2="39" y2="39" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="35" x2="65" y2="38" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="48" y1="31" x2="53" y2="33" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="46" x2="72" y2="43" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'perro_caliente':
      return (
        <g>
          {/* Golden bun back */}
          <path
            d="M14 48 C14 33, 30 28, 50 28 C70 28, 86 33, 86 48 C86 58, 70 62, 50 62 C30 62, 14 58, 14 48 Z"
            fill="#FBBF24"
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Sausage */}
          <rect
            x="10"
            y="43"
            width="80"
            height="18"
            rx="9"
            fill="#DC2626"
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Front bun lip */}
          <path
            d="M14 58 C14 71, 30 76, 50 76 C70 76, 86 71, 86 58 C86 54, 70 57, 50 57 C30 57, 14 54, 14 58 Z"
            fill="#F59E0B"
            stroke={INK}
            strokeWidth="3.2"
          />
          {/* Mustard squiggle */}
          <path
            d="M18 51 Q26 44 34 51 T50 51 T66 51 T82 51"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Bun shine */}
          <path
            d="M28 35 Q50 31 72 35"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      );

    case 'papas_fritas':
      return (
        <g>
          {/* Crispy fries */}
          <rect x="26" y="16" width="9" height="36" rx="3" transform="rotate(-10 30 34)" fill="#FACC15" stroke={INK} strokeWidth="2.8" />
          <rect x="37" y="12" width="9" height="38" rx="3" transform="rotate(-3 41 31)" fill="#FDE047" stroke={INK} strokeWidth="2.8" />
          <rect x="48" y="10" width="9" height="40" rx="3" fill="#FACC15" stroke={INK} strokeWidth="2.8" />
          <rect x="59" y="13" width="9" height="38" rx="3" transform="rotate(6 63 32)" fill="#FDE047" stroke={INK} strokeWidth="2.8" />
          <rect x="68" y="19" width="9" height="34" rx="3" transform="rotate(14 72 36)" fill="#F59E0B" stroke={INK} strokeWidth="2.8" />
          {/* Red carton */}
          <path
            d="M22 42 C36 48, 64 48, 78 42 L72 84 C71 87, 29 87, 28 84 Z"
            fill="#EF4444"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Yellow stripe badge */}
          <circle cx="50" cy="65" r="10" fill="#FACC15" stroke={INK} strokeWidth="2.4" />
          <path d="M46 65 L54 65" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="30" y1="50" x2="34" y2="79" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
        </g>
      );

    case 'caramelos':
      return (
        <g>
          {/* Candy 1 (Pink/Purple swirl) */}
          <path d="M18 32 L10 24 L14 40 Z" fill="#F472B6" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M52 46 L60 54 L56 38 Z" fill="#F472B6" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <ellipse cx="35" cy="39" rx="19" ry="13" transform="rotate(20 35 39)" fill="#EC4899" stroke={INK} strokeWidth="3" />
          <path d="M27 34 Q35 39 42 44" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          {/* Lollipop / Candy 2 */}
          <line x1="66" y1="54" x2="78" y2="86" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <line x1="66" y1="54" x2="78" y2="86" stroke={INK} strokeWidth="5" strokeLinecap="round" opacity="0.2" />
          <circle cx="62" cy="44" r="18" fill="#A855F7" stroke={INK} strokeWidth="3.2" />
          <path d="M62 44 C62 38, 69 38, 69 44 C69 52, 55 52, 55 44 C55 34, 72 32, 74 44" fill="none" stroke="#FEF08A" strokeWidth="3.2" strokeLinecap="round" />
          {/* Candy 3 */}
          <path d="M22 72 L12 68 L18 82 Z" fill="#38BDF8" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M52 72 L62 68 L56 82 Z" fill="#38BDF8" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <ellipse cx="37" cy="75" rx="16" ry="11" fill="#0EA5E9" stroke={INK} strokeWidth="3" />
          <ellipse cx="34" cy="72" rx="6" ry="2.5" fill="#FFFFFF" opacity="0.65" />
        </g>
      );

    default:
      return null;
  }
}
