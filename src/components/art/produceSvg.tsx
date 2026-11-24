import React from 'react';

const INK = '#422415';

export function renderProduceArt(id: string, uid: string): React.ReactNode | null {
  switch (id) {
    case 'auyama':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-auy-skin`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4D7C0F" />
              <stop offset="60%" stopColor="#3F6212" />
              <stop offset="100%" stopColor="#274009" />
            </linearGradient>
            <radialGradient id={`${uid}-auy-flesh`} cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
            <linearGradient id={`${uid}-auy-cut`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>
          {/* Outer dark green rind */}
          <path
            d="M16 56 C14 78, 36 90, 62 88 C86 86, 98 68, 92 48 C84 58, 52 68, 16 56 Z"
            fill={`url(#${uid}-auy-skin)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Rind ribs */}
          <path d="M36 74 Q42 84 48 86" fill="none" stroke="#84CC16" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
          <path d="M62 72 Q68 82 72 82" fill="none" stroke="#84CC16" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
          {/* Main glowing orange flesh wedge */}
          <path
            d="M16 56 C20 30, 44 16, 72 22 C86 25, 95 36, 92 48 C84 62, 50 72, 16 56 Z"
            fill={`url(#${uid}-auy-flesh)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner seed cavity */}
          <path
            d="M36 48 C44 35, 62 31, 74 37 C79 42, 74 52, 58 55 C45 57, 35 53, 36 48 Z"
            fill={`url(#${uid}-auy-cut)`}
            opacity="0.72"
          />
          {/* Seeds */}
          <ellipse cx="48" cy="46" rx="4.5" ry="2.6" transform="rotate(-18 48 46)" fill="#FEF3C7" stroke={INK} strokeWidth="1.6" />
          <ellipse cx="59" cy="43" rx="4.5" ry="2.6" transform="rotate(12 59 43)" fill="#FEF3C7" stroke={INK} strokeWidth="1.6" />
          <ellipse cx="66" cy="48" rx="4.2" ry="2.4" transform="rotate(28 66 48)" fill="#FEF3C7" stroke={INK} strokeWidth="1.6" />
          {/* Cartoon specular highlight */}
          <path d="M27 41 Q38 25 58 24" fill="none" stroke="#FFFBEB" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
          <circle cx="23" cy="47" r="2.2" fill="#FFFBEB" opacity="0.9" />
        </g>
      );

    case 'zanahoria':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-zan-body`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="45%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id={`${uid}-zan-leaf`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
          </defs>
          {/* Leafy crown */}
          <path
            d="M66 32 C65 14, 78 8, 80 18 C88 8, 98 18, 86 28 C98 28, 96 42, 82 38 Z"
            fill={`url(#${uid}-zan-leaf)`}
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path d="M72 30 Q77 20 79 16" fill="none" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
          {/* Carrot root */}
          <path
            d="M62 24 C74 22, 84 32, 78 44 C68 64, 34 86, 17 89 C12 90, 11 84, 15 79 C26 62, 46 27, 62 24 Z"
            fill={`url(#${uid}-zan-body)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Subtle ridges */}
          <path d="M53 38 Q59 42 63 48" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
          <path d="M40 53 Q46 57 49 62" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
          <path d="M29 67 Q33 70 35 74" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          {/* Specular shine */}
          <path d="M58 30 Q42 46 26 70" fill="none" stroke="#FFEDD5" strokeWidth="3.6" strokeLinecap="round" opacity="0.85" />
          <circle cx="63" cy="28" r="2.2" fill="#FFF7ED" />
        </g>
      );

    case 'tomate':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-tom-body`} cx="36%" cy="34%" r="68%">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="32%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
            <linearGradient id={`${uid}-tom-leaf`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
          </defs>
          {/* Plump tomato body */}
          <path
            d="M50 24 C27 22, 13 38, 15 58 C17 77, 33 88, 50 87 C67 88, 83 77, 85 58 C87 38, 73 22, 50 24 Z"
            fill={`url(#${uid}-tom-body)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Bottom shading */}
          <path d="M25 72 Q50 86 76 72" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
          {/* Calyx leaves & stem */}
          <path
            d="M50 25 C43 18, 32 23, 30 30 C38 29, 44 31, 47 35 C49 29, 52 29, 55 36 C59 30, 66 29, 71 31 C67 23, 57 18, 50 25 Z"
            fill={`url(#${uid}-tom-leaf)`}
            stroke={INK}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path d="M50 25 C50 16, 54 12, 57 12" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          {/* Specular highlights */}
          <ellipse cx="32" cy="43" rx="6" ry="10" transform="rotate(-24 32 43)" fill="#FFFFFF" opacity="0.6" />
          <circle cx="27" cy="56" r="2.5" fill="#FFFFFF" opacity="0.7" />
        </g>
      );

    case 'pepino':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-pep-outer`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <radialGradient id={`${uid}-pep-inner`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ECFCCB" />
              <stop offset="75%" stopColor="#BEF264" />
              <stop offset="100%" stopColor="#4ADE80" />
            </radialGradient>
          </defs>
          {/* Back whole/half cucumber */}
          <path
            d="M22 44 C26 22, 58 14, 78 24 C90 30, 88 48, 72 56 C52 66, 18 64, 22 44 Z"
            fill={`url(#${uid}-pep-outer)`}
            stroke={INK}
            strokeWidth="3.2"
          />
          <path d="M36 30 Q54 22 70 28" fill="none" stroke="#BBF7D0" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          {/* Front cucumber slice 1 */}
          <circle cx="38" cy="64" r="22" fill={`url(#${uid}-pep-outer)`} stroke={INK} strokeWidth="3.2" />
          <circle cx="38" cy="64" r="17" fill={`url(#${uid}-pep-inner)`} />
          <circle cx="38" cy="64" r="9" fill="#ECFCCB" opacity="0.85" />
          {/* Seeds */}
          <ellipse cx="38" cy="57" rx="1.6" ry="3.2" fill="#D9F99D" stroke="#65A30D" strokeWidth="0.9" />
          <ellipse cx="38" cy="71" rx="1.6" ry="3.2" fill="#D9F99D" stroke="#65A30D" strokeWidth="0.9" />
          <ellipse cx="31" cy="64" rx="3.2" ry="1.6" fill="#D9F99D" stroke="#65A30D" strokeWidth="0.9" />
          <ellipse cx="45" cy="64" rx="3.2" ry="1.6" fill="#D9F99D" stroke="#65A30D" strokeWidth="0.9" />
          {/* Front cucumber slice 2 */}
          <circle cx="67" cy="68" r="19" fill={`url(#${uid}-pep-outer)`} stroke={INK} strokeWidth="3.2" />
          <circle cx="67" cy="68" r="14.5" fill={`url(#${uid}-pep-inner)`} />
          <ellipse cx="67" cy="62" rx="1.4" ry="2.8" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.8" />
          <ellipse cx="67" cy="74" rx="1.4" ry="2.8" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.8" />
          <ellipse cx="61" cy="68" rx="2.8" ry="1.4" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.8" />
          <ellipse cx="73" cy="68" rx="2.8" ry="1.4" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.8" />
          <path d="M25 54 Q30 48 36 47" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'repollo':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-rep-main`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#BEF264" />
              <stop offset="55%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </radialGradient>
            <linearGradient id={`${uid}-rep-outer`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
          </defs>
          {/* Outer ruffled leaves */}
          <path
            d="M22 68 C10 56, 12 34, 28 24 C40 16, 62 16, 74 26 C88 36, 88 58, 76 70 C62 84, 34 84, 22 68 Z"
            fill={`url(#${uid}-rep-outer)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner layered leaves */}
          <path
            d="M26 52 C28 32, 46 24, 62 30 C76 36, 78 56, 66 68 C52 78, 30 74, 26 52 Z"
            fill={`url(#${uid}-rep-main)`}
            stroke={INK}
            strokeWidth="2.8"
          />
          <path
            d="M36 46 C42 36, 58 36, 64 46 C66 56, 56 64, 44 62 C36 60, 33 52, 36 46 Z"
            fill="#BBF7D0"
            stroke={INK}
            strokeWidth="2.4"
          />
          {/* Leaf veins */}
          <path d="M50 74 Q50 58 46 46" fill="none" stroke="#ECFCCB" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M50 64 Q39 58 34 52" fill="none" stroke="#ECFCCB" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 60 Q60 54 64 47" fill="none" stroke="#ECFCCB" strokeWidth="2" strokeLinecap="round" />
          {/* Shine */}
          <path d="M26 36 Q34 26 48 25" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'brocoli':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-bro-stem`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BEF264" />
              <stop offset="100%" stopColor="#65A30D" />
            </linearGradient>
            <radialGradient id={`${uid}-bro-top`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="60%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>
          </defs>
          {/* Trunk */}
          <path
            d="M41 52 L37 80 C36 86, 64 86, 63 80 L59 52 Z"
            fill={`url(#${uid}-bro-stem)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M46 58 L44 76" fill="none" stroke="#ECFCCB" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          {/* Bushy tree florets */}
          <path
            d="M25 56 C13 54, 12 36, 26 32 C26 18, 44 12, 54 20 C66 12, 82 22, 76 35 C88 40, 84 56, 70 56 C62 62, 36 62, 25 56 Z"
            fill={`url(#${uid}-bro-top)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Floret textures */}
          <path d="M30 38 Q36 32 42 36" fill="none" stroke="#14532D" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
          <path d="M56 36 Q63 31 68 37" fill="none" stroke="#14532D" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
          <path d="M42 26 Q49 21 56 26" fill="none" stroke="#BBF7D0" strokeWidth="2.8" strokeLinecap="round" opacity="0.7" />
          <circle cx="32" cy="27" r="2.6" fill="#BBF7D0" opacity="0.7" />
        </g>
      );

    case 'pimenton':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-pim-body`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="40%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
            <linearGradient id={`${uid}-pim-stem`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
          </defs>
          {/* Lobed bell pepper */}
          <path
            d="M32 30 C16 32, 16 62, 26 78 C33 88, 44 85, 50 82 C56 85, 67 88, 74 78 C84 62, 84 32, 68 30 C60 28, 55 32, 50 32 C45 32, 40 28, 32 30 Z"
            fill={`url(#${uid}-pim-body)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner lobe lines */}
          <path d="M38 35 Q35 58 41 78" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <path d="M62 35 Q65 58 59 78" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          {/* Curved stem */}
          <path
            d="M44 31 C43 20, 48 12, 56 12 C59 12, 60 17, 56 19 C53 20, 54 26, 56 31 Z"
            fill={`url(#${uid}-pim-stem)`}
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Glossy shine */}
          <path d="M26 42 Q24 54 28 65" fill="none" stroke="#FFFFFF" strokeWidth="3.8" strokeLinecap="round" opacity="0.72" />
          <path d="M47 41 Q46 52 48 61" fill="none" stroke="#FECACA" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>
      );

    case 'remolacha':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-rem-bulb`} cx="38%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="45%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </radialGradient>
            <linearGradient id={`${uid}-rem-leaf`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
          </defs>
          {/* Leaves */}
          <path
            d="M46 36 C32 24, 28 12, 38 10 C46 8, 50 22, 50 32 C52 16, 62 8, 68 14 C74 20, 62 30, 54 36 Z"
            fill={`url(#${uid}-rem-leaf)`}
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path d="M40 16 L47 32" fill="none" stroke="#A855F7" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M62 18 L53 32" fill="none" stroke="#A855F7" strokeWidth="2.2" strokeLinecap="round" />
          {/* Bulb + root tail */}
          <path
            d="M50 34 C28 34, 20 52, 26 68 C32 81, 46 84, 50 92 C54 84, 68 81, 74 68 C80 52, 72 34, 50 34 Z"
            fill={`url(#${uid}-rem-bulb)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <ellipse cx="38" cy="50" rx="5" ry="9" transform="rotate(-22 38 50)" fill="#F5D0FE" opacity="0.55" />
          <path d="M36 73 Q50 80 64 73" fill="none" stroke="#3B0764" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        </g>
      );

    case 'cambur':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-cam-peel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id={`${uid}-cam-fruit`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          {/* Creamy peeled banana top */}
          <path
            d="M44 38 C43 22, 52 14, 60 18 C65 21, 62 36, 56 44 Z"
            fill={`url(#${uid}-cam-fruit)`}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Peel flaps & main curved body */}
          <path
            d="M28 50 C20 68, 36 86, 62 84 C78 82, 84 72, 76 68 C62 72, 44 64, 42 42 C34 40, 30 44, 28 50 Z"
            fill={`url(#${uid}-cam-peel)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Left peel curl */}
          <path
            d="M42 40 C30 34, 20 42, 22 50 C30 46, 36 48, 41 52 Z"
            fill="#FDE047"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Right peel curl */}
          <path
            d="M57 42 C68 38, 76 46, 72 54 C64 50, 58 50, 52 54 Z"
            fill="#FACC15"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Highlight */}
          <path d="M36 68 Q48 79 65 76" fill="none" stroke="#FEF9C3" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
        </g>
      );

    case 'guayaba':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-gua-skin`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#BEF264" />
              <stop offset="65%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#3F6212" />
            </radialGradient>
            <radialGradient id={`${uid}-gua-pink`} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="70%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#FCE7F3" />
            </radialGradient>
          </defs>
          {/* Whole green guava in back */}
          <circle cx="38" cy="46" r="24" fill={`url(#${uid}-gua-skin)`} stroke={INK} strokeWidth="3.2" />
          <path d="M38 22 C41 16, 46 14, 49 16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M40 21 C48 16, 55 20, 52 26 C46 26, 42 25, 40 21 Z" fill="#4ADE80" stroke={INK} strokeWidth="2.4" />
          {/* Half guava showing pink interior */}
          <circle cx="62" cy="60" r="24" fill="#84CC16" stroke={INK} strokeWidth="3.2" />
          <circle cx="62" cy="60" r="20" fill="#FEF3C7" />
          <circle cx="62" cy="60" r="16.5" fill={`url(#${uid}-gua-pink)`} />
          {/* Guava seeds */}
          <circle cx="57" cy="56" r="1.8" fill="#FEF3C7" />
          <circle cx="65" cy="54" r="1.8" fill="#FEF3C7" />
          <circle cx="68" cy="61" r="1.8" fill="#FEF3C7" />
          <circle cx="62" cy="66" r="1.8" fill="#FEF3C7" />
          <circle cx="55" cy="63" r="1.8" fill="#FEF3C7" />
          {/* Highlight */}
          <ellipse cx="28" cy="37" rx="4.5" ry="7" transform="rotate(-25 28 37)" fill="#FFFFFF" opacity="0.55" />
        </g>
      );

    case 'mango':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-man-body`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="48%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>
          {/* Leaf */}
          <path
            d="M52 24 C60 12, 76 12, 82 20 C72 26, 60 28, 52 24 Z"
            fill="#22C55E"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Mango kidney-oval silhouette */}
          <path
            d="M54 22 C74 22, 84 40, 76 62 C68 82, 42 89, 26 80 C16 74, 20 56, 26 42 C32 28, 41 22, 54 22 Z"
            fill={`url(#${uid}-man-body)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M33 38 Q27 52 29 66" fill="none" stroke="#FFFBEB" strokeWidth="3.8" strokeLinecap="round" opacity="0.72" />
          <circle cx="38" cy="32" r="2.4" fill="#FFFBEB" opacity="0.85" />
        </g>
      );

    case 'lechosa':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-lec-skin`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#65A30D" />
            </linearGradient>
            <linearGradient id={`${uid}-lec-flesh`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="55%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* Outer crescent rind */}
          <path
            d="M16 58 C24 84, 62 90, 84 62 C88 55, 86 42, 78 36 C64 62, 38 66, 20 44 C14 48, 14 52, 16 58 Z"
            fill={`url(#${uid}-lec-skin)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Orange flesh slice */}
          <path
            d="M20 44 C30 22, 62 18, 78 36 C82 48, 72 68, 52 72 C34 76, 16 62, 20 44 Z"
            fill={`url(#${uid}-lec-flesh)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Hollow seed groove */}
          <ellipse cx="49" cy="46" rx="16" ry="9" transform="rotate(-14 49 46)" fill="#C2410C" opacity="0.55" />
          {/* Black glossy seeds */}
          <circle cx="42" cy="47" r="2.6" fill="#292524" />
          <circle cx="49" cy="44" r="2.8" fill="#292524" />
          <circle cx="56" cy="44" r="2.6" fill="#292524" />
          <circle cx="46" cy="50" r="2.4" fill="#292524" />
          <circle cx="54" cy="49" r="2.5" fill="#292524" />
          <path d="M27 39 Q38 27 56 27" fill="none" stroke="#FFEDD5" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
      );

    case 'patilla':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-pat-red`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
          {/* Green outer rind */}
          <path
            d="M14 58 C24 85, 76 85, 86 58 L78 52 C68 72, 32 72, 22 52 Z"
            fill="#16A34A"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* White pith */}
          <path
            d="M20 53 C30 74, 70 74, 80 53 L74 49 C64 66, 36 66, 26 49 Z"
            fill="#ECFCCB"
          />
          {/* Juicy red triangle */}
          <path
            d="M50 18 L80 53 C68 70, 32 70, 20 53 Z"
            fill={`url(#${uid}-pat-red)`}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Seeds */}
          <ellipse cx="43" cy="44" rx="2" ry="3.2" transform="rotate(-12 43 44)" fill={INK} />
          <ellipse cx="56" cy="43" rx="2" ry="3.2" transform="rotate(14 56 43)" fill={INK} />
          <ellipse cx="50" cy="54" rx="2" ry="3.2" fill={INK} />
          <ellipse cx="36" cy="54" rx="2" ry="3" transform="rotate(-20 36 54)" fill={INK} />
          <ellipse cx="64" cy="54" rx="2" ry="3" transform="rotate(20 64 54)" fill={INK} />
          {/* Shine */}
          <path d="M46 26 L34 45" fill="none" stroke="#FFE4E6" strokeWidth="3.2" strokeLinecap="round" opacity="0.75" />
        </g>
      );

    case 'naranja':
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-nar-skin`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
          </defs>
          {/* Whole orange */}
          <circle cx="40" cy="46" r="24" fill={`url(#${uid}-nar-skin)`} stroke={INK} strokeWidth="3.2" />
          <path d="M40 22 C44 14, 54 12, 58 18 C50 22, 44 23, 40 22 Z" fill="#22C55E" stroke={INK} strokeWidth="2.5" />
          {/* Front juicy slice */}
          <circle cx="62" cy="60" r="23" fill="#F97316" stroke={INK} strokeWidth="3.2" />
          <circle cx="62" cy="60" r="19" fill="#FEF3C7" />
          <circle cx="62" cy="60" r="16.5" fill="#FB923C" />
          {/* Citrus segments */}
          <line x1="62" y1="43" x2="62" y2="77" stroke="#FEF3C7" strokeWidth="2.4" />
          <line x1="45" y1="60" x2="79" y2="60" stroke="#FEF3C7" strokeWidth="2.4" />
          <line x1="50" y1="48" x2="74" y2="72" stroke="#FEF3C7" strokeWidth="2.2" />
          <line x1="74" y1="48" x2="50" y2="72" stroke="#FEF3C7" strokeWidth="2.2" />
          <circle cx="62" cy="60" r="3" fill="#FEF3C7" />
          <ellipse cx="29" cy="36" rx="4" ry="7" transform="rotate(-24 29 36)" fill="#FFFFFF" opacity="0.6" />
        </g>
      );

    case 'pina':
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-pin-crown`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <radialGradient id={`${uid}-pin-slice`} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="65%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </radialGradient>
          </defs>
          {/* Crown leaves */}
          <path
            d="M42 28 L34 12 L46 22 L50 8 L55 22 L67 12 L58 28 Z"
            fill={`url(#${uid}-pin-crown)`}
            stroke={INK}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Pineapple slice ring */}
          <circle cx="50" cy="56" r="29" fill={`url(#${uid}-pin-slice)`} stroke={INK} strokeWidth="3.2" />
          {/* Scalloped texture lines */}
          <path d="M50 28 L50 38 M50 74 L50 84 M22 56 L32 56 M68 56 L78 56" stroke="#A16207" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <path d="M31 37 L38 44 M69 75 L62 68 M69 37 L62 44 M31 75 L38 68" stroke="#A16207" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          {/* Core hole */}
          <circle cx="50" cy="56" r="9.5" fill="#FFFBEB" stroke={INK} strokeWidth="2.8" />
          <path d="M30 42 Q37 33 48 32" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    default:
      return null;
  }
}
