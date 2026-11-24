import React, { memo } from 'react';

interface IconProps {
  className?: string;
}

/**
 * Pure SVG vector icon for Nutriplato.
 * Faithfully vectorizes the glossy ceramic plate divided into 50% greens/fruits,
 * 25% proteins, and 25% energy carbs over a starry cyan-to-violet backdrop.
 */
export const NutriplatoIcon: React.FC<IconProps> = memo(({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    className={`overflow-visible pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      {/* Interior clip path seated slightly beneath the outer #1E1B2E border stroke to prevent subpixel fringes */}
      <clipPath id="np-tile-clip">
        <rect x="3.5" y="3.5" width="249" height="249" rx="48.5" />
      </clipPath>

      {/* Background sky-to-violet gradient */}
      <linearGradient id="np-bg" x1="22" y1="16" x2="236" y2="244" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6be4ff" />
        <stop offset="32%" stopColor="#72b4ff" />
        <stop offset="68%" stopColor="#815df7" />
        <stop offset="100%" stopColor="#6c31e3" />
      </linearGradient>

      {/* Top glossy glass sheen */}
      <linearGradient id="np-gloss" x1="128" y1="0" x2="128" y2="148" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Soft ambient bokeh glow */}
      <radialGradient id="np-spark-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>

      {/* Lightweight soft radial plate shadow gradient (replaces costly feDropShadow) */}
      <radialGradient id="np-plate-shadow-grad" cx="50%" cy="50%" r="50%">
        <stop offset="72%" stopColor="#26115c" stopOpacity="0.34" />
        <stop offset="92%" stopColor="#26115c" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#26115c" stopOpacity="0" />
      </radialGradient>

      {/* Plate ceramic rim gradient */}
      <linearGradient id="np-plate-rim" x1="56" y1="36" x2="200" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="58%" stopColor="#eef4fb" />
        <stop offset="100%" stopColor="#c7d5e8" />
      </linearGradient>

      {/* Plate inner well */}
      <radialGradient id="np-plate-well" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="82%" stopColor="#f5f9ff" />
        <stop offset="100%" stopColor="#dde7f4" />
      </radialGradient>

      {/* Quadrant fills */}
      <linearGradient id="np-q-green" x1="48" y1="49" x2="122" y2="207" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94f340" />
        <stop offset="52%" stopColor="#6ad920" />
        <stop offset="100%" stopColor="#4db612" />
      </linearGradient>
      <linearGradient id="np-q-pink" x1="134" y1="49" x2="207" y2="123" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff8599" />
        <stop offset="55%" stopColor="#ff5775" />
        <stop offset="100%" stopColor="#e53559" />
      </linearGradient>
      <linearGradient id="np-q-yellow" x1="134" y1="133" x2="207" y2="207" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff06a" />
        <stop offset="55%" stopColor="#ffd429" />
        <stop offset="100%" stopColor="#efa910" />
      </linearGradient>

      {/* Food gradients */}
      <radialGradient id="np-apple-red" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff6b72" />
        <stop offset="48%" stopColor="#ee2338" />
        <stop offset="100%" stopColor="#ae0d21" />
      </radialGradient>
      <linearGradient id="np-broc-crown" x1="84" y1="62" x2="112" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#72e42c" />
        <stop offset="55%" stopColor="#3fa919" />
        <stop offset="100%" stopColor="#267311" />
      </linearGradient>
      <linearGradient id="np-broc-stem" x1="94" y1="92" x2="108" y2="116" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#b8f26c" />
        <stop offset="100%" stopColor="#65b828" />
      </linearGradient>
      <linearGradient id="np-carrot-body" x1="84" y1="158" x2="112" y2="196" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffb338" />
        <stop offset="52%" stopColor="#f97415" />
        <stop offset="100%" stopColor="#cf4707" />
      </linearGradient>
      <radialGradient id="np-yolk" cx="36%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#fff070" />
        <stop offset="55%" stopColor="#ffc314" />
        <stop offset="100%" stopColor="#e88205" />
      </radialGradient>
      <linearGradient id="np-chicken" x1="168" y1="96" x2="196" y2="122" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f2a255" />
        <stop offset="55%" stopColor="#cf6f29" />
        <stop offset="100%" stopColor="#994211" />
      </linearGradient>
      <linearGradient id="np-bread" x1="142" y1="158" x2="176" y2="192" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e39d52" />
        <stop offset="55%" stopColor="#bc6c27" />
        <stop offset="100%" stopColor="#854212" />
      </linearGradient>
      <linearGradient id="np-rice" x1="156" y1="138" x2="162" y2="164" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#f8f2e4" />
        <stop offset="100%" stopColor="#e5d7be" />
      </linearGradient>
      <linearGradient id="np-wheat" x1="176" y1="142" x2="198" y2="188" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffe159" />
        <stop offset="100%" stopColor="#d48414" />
      </linearGradient>
    </defs>

    {/* Uniform 3D Solid Bottom Extrusion Shadow (identical left & right corner curvature, zero steps or seams) */}
    <rect
      x="0"
      y="11"
      width="256"
      height="256"
      rx="52"
      fill="#1E1B2E"
    />

    {/* Solid Outer Squircle Frame Base (#1E1B2E) */}
    <rect x="0" y="0" width="256" height="256" rx="52" fill="#1E1B2E" />

    {/* Clipped Interior Icon Artwork */}
    <g clipPath="url(#np-tile-clip)">
      {/* Base Vibrant Backdrop */}
      <rect width="256" height="256" fill="url(#np-bg)" />

      {/* Curved Upper Gloss Reflection */}
      <path
        d="M-10 -10 H266 V98 C206 126 50 126 -10 98 Z"
        fill="url(#np-gloss)"
      />

      {/* Concentric Inner Translucent Specular Rim (outer rx=52 minus inset 11.2 = exact rx=40.8) */}
      <rect
        x="11.2"
        y="11.2"
        width="233.6"
        height="233.6"
        rx="40.8"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="4"
      />

      {/* Background Bokeh & Star Sparkles */}
      <circle cx="36" cy="42" r="14" fill="url(#np-spark-glow)" />
      <circle cx="36" cy="42" r="4" fill="#ffffff" />
      <circle cx="222" cy="68" r="15" fill="url(#np-spark-glow)" />
      <circle cx="222" cy="68" r="4.2" fill="#ffffff" />
      <circle cx="30" cy="198" r="12" fill="url(#np-spark-glow)" />
      <circle cx="30" cy="198" r="3.6" fill="#ffffff" />
      <circle cx="212" cy="216" r="10" fill="url(#np-spark-glow)" />
      <circle cx="212" cy="216" r="3" fill="#ffffff" />
      <circle cx="52" cy="226" r="2.6" fill="#ffffff" fillOpacity="0.82" />
      <circle cx="204" cy="34" r="3" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="234" cy="134" r="2.4" fill="#ffffff" fillOpacity="0.72" />
      <circle cx="22" cy="122" r="2.4" fill="#ffffff" fillOpacity="0.72" />

      {/* 4-point crisp sparkles */}
      <path d="M56 22 L58 28 L64 30 L58 32 L56 38 L54 32 L48 30 L54 28 Z" fill="#ffffff" fillOpacity="0.92" />
      <path d="M224 192 L226 197 L231 199 L226 201 L224 206 L222 201 L217 199 L222 197 Z" fill="#ffffff" fillOpacity="0.88" />

      {/* MAIN CERAMIC PLATE — Strictly Centered at cx="128" (50%), cy="128" (50%) */}
      <circle cx="128" cy="136" r="104" fill="url(#np-plate-shadow-grad)" />
      <g>
        {/* Outer Ceramic Rim (exact equal margin on left, right, top, and bottom) */}
        <circle
          cx="128"
          cy="128"
          r="98"
          fill="url(#np-plate-rim)"
          stroke="#211834"
          strokeWidth="4.2"
        />
        {/* Symmetrical Top Ceramic Highlight Arc (concentric r=92 around 128,128) */}
        <path
          d="M55.5 71.36 A92 92 0 0 1 200.5 71.36"
          stroke="#ffffff"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeOpacity="0.82"
        />
        {/* Inner Dish Ring (concentric r=87 around 128,128) */}
        <circle
          cx="128"
          cy="128"
          r="87"
          fill="url(#np-plate-well)"
          stroke="#b6c6dd"
          strokeWidth="2.2"
        />
      </g>

      {/* ========================================================================
          MILLIMETER-SYMMETRIC COMPARTMENTS (ALL CONCENTRIC AT 128,128, R=80)
          Uniform white outer channel (r=80 vs inner dish r=87) across all 360°
          Uniform central white divider (gap=11 centered exactly on x=128 & y=128)
         ======================================================================== */}

      {/* QUADRANT 1: LEFT 50% (VEGETABLES & FRUITS - GREEN) */}
      <path
        d="M114.3 49.18 A80 80 0 0 0 114.3 206.82 A7 7 0 0 0 122.5 199.92 V56.08 A7 7 0 0 0 114.3 49.18 Z"
        fill="url(#np-q-green)"
        stroke="#1e490d"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Concentric inner bevel highlight on green quadrant (r=74.5 around 128,128) */}
      <path
        d="M110 55.7 A74.5 74.5 0 0 0 62.2 93"
        stroke="#d4ff9e"
        strokeOpacity="0.55"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* QUADRANT 2: TOP-RIGHT 25% (PROTEINS - CORAL PINK) */}
      <path
        d="M133.5 56.08 V115.5 A7 7 0 0 0 140.5 122.5 H199.92 A7 7 0 0 0 206.82 114.3 A80 80 0 0 0 141.7 49.18 A7 7 0 0 0 133.5 56.08 Z"
        fill="url(#np-q-pink)"
        stroke="#6e122b"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Concentric inner bevel highlight on pink quadrant (r=74.5 around 128,128) */}
      <path
        d="M146 55.7 A74.5 74.5 0 0 1 197.1 100.1"
        stroke="#ffd0d9"
        strokeOpacity="0.52"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* QUADRANT 3: BOTTOM-RIGHT 25% (ENERGY / CARBS - GOLDEN YELLOW) */}
      <path
        d="M140.5 133.5 A7 7 0 0 0 133.5 140.5 V199.92 A7 7 0 0 0 141.7 206.82 A80 80 0 0 0 206.82 141.7 A7 7 0 0 0 199.92 133.5 Z"
        fill="url(#np-q-yellow)"
        stroke="#784708"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M141 139 H195"
        stroke="#fff9c4"
        strokeOpacity="0.6"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* === FOOD 1: BROCCOLI (Balanced Top-Right of Green Semicircle) === */}
      <g transform="translate(98 91) scale(0.91) translate(-96 -88)">
        {/* Stem */}
        <path
          d="M89 92 L95 114 C96.5 118 103 118.5 106 115 L108 93 Z"
          fill="url(#np-broc-stem)"
          stroke="#1b4210"
          strokeWidth="2.9"
          strokeLinejoin="round"
        />
        <path d="M97 99 L99 112" stroke="#e4ffb5" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
        {/* Crown florets */}
        <path
          d="M84 95 C75 94 71 84 77 77 C76 68 85 61 94 64 C100 58 112 61 114 70 C121 74 121 86 113 91 C111 97 103 99 97 96 C92 99 87 98 84 95 Z"
          fill="url(#np-broc-crown)"
          stroke="#1b4210"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Internal floret scallops */}
        <path
          d="M84 82 C88 78 94 80 95 85 M98 73 C103 70 109 74 109 80 M88 70 C92 67 96 69 97 73"
          stroke="#1d5411"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        {/* Bright top-left broccoli highlights */}
        <circle cx="85" cy="72" r="2.6" fill="#beff73" fillOpacity="0.75" />
        <circle cx="101" cy="67" r="3" fill="#beff73" fillOpacity="0.7" />
        <circle cx="111" cy="79" r="2.2" fill="#beff73" fillOpacity="0.55" />
      </g>

      {/* === FOOD 2: GLOSSY RED APPLE (Balanced Center-Left of Green Semicircle) === */}
      <g transform="translate(83 130) scale(0.92) translate(-79 -130)">
        {/* Stem */}
        <path
          d="M78 114 C79 107 82 103 85 101"
          stroke="#5c2d12"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Leaf */}
        <path
          d="M78 109 C71 102 62 103 60 110 C67 113 74 113 78 109 Z"
          fill="#69dc22"
          stroke="#1c490d"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* Plump Apple Body */}
        <path
          d="M78 114 C69 109 55 115 55 129 C55 144 65 156 74 155 C76.5 154.7 78 153.5 79.5 153.5 C81 153.5 82.5 154.7 85 155 C94 156 103 144 103 129 C103 115 89 109 78 114 Z"
          fill="url(#np-apple-red)"
          stroke="#4f0a14"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Specular shine */}
        <path
          d="M64 123 C63 128 64 134 67 137"
          stroke="#ffffff"
          strokeOpacity="0.88"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="67.5" cy="119" r="2.2" fill="#ffffff" fillOpacity="0.85" />
      </g>

      {/* === FOOD 3: CRUNCHY CARROT (Balanced Bottom-Right of Green Semicircle) === */}
      <g transform="translate(97 171) scale(0.91) translate(-95 -174)">
        {/* Leafy Green Tuft */}
        <path
          d="M84 166 C77 161 75 155 79 152 C83 151 86 156 87 162 M87 164 C84 156 87 149 92 151 C95 153 94 160 91 164 M90 165 C93 158 99 156 101 160 C102 163 97 166 92 167"
          fill="#53cc1b"
          stroke="#1c490d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Carrot Root */}
        <path
          d="M82 166 C87 160 97 162 101 168 L113 190 C115 194 111 198 107 196 L85 182 C79 178 78 170 82 166 Z"
          fill="url(#np-carrot-body)"
          stroke="#5c2105"
          strokeWidth="2.9"
          strokeLinejoin="round"
        />
        {/* Carrot Ridges */}
        <path
          d="M88 171 L95 168 M92 178 L101 174 M98 184 L105 181"
          stroke="#b83b05"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Highlight */}
        <path
          d="M85 170 L95 181"
          stroke="#ffe1a8"
          strokeOpacity="0.65"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      {/* === FOOD 4: SUNNY-SIDE-UP FRIED EGG (Balanced Top-Left of Pink Quadrant) === */}
      <g transform="translate(158 83) scale(0.93) translate(-161 -82)">
        {/* Wavy Egg White */}
        <path
          d="M153 64 C162 60 173 64 176 72 C182 76 183 87 177 93 C173 101 162 104 154 100 C144 101 138 92 141 83 C139 74 145 66 153 64 Z"
          fill="#ffffff"
          stroke="#392842"
          strokeWidth="2.9"
          strokeLinejoin="round"
        />
        {/* Soft inner shadow along egg white bottom */}
        <path
          d="M145 93 C152 99 167 99 174 91"
          stroke="#d7e1ef"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Golden Yolk */}
        <circle
          cx="161"
          cy="82"
          r="11.5"
          fill="url(#np-yolk)"
          stroke="#783e06"
          strokeWidth="2.6"
        />
        {/* Yolk specular highlight */}
        <path
          d="M155.5 78.5 A6.5 6.5 0 0 1 161.5 74.5"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>

      {/* === FOOD 5: ROASTED CHICKEN DRUMSTICK (Balanced Bottom-Right of Pink Quadrant) === */}
      <g transform="translate(177 104) scale(0.9) translate(-180 -107)">
        {/* Bone */}
        <path
          d="M174 107 L166 113 C164 111.5 160.5 112.5 160.5 115.2 C160.5 116.8 161.8 117.7 162.8 118 C162.3 119.4 163.4 121.5 165.8 121.5 C168 121.5 169.3 119.8 169.2 118.2 L178 112 Z"
          fill="#fff8ef"
          stroke="#3c2214"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        {/* Meaty Drumstick Club */}
        <path
          d="M172 106 C175 97 186 89 194 94 C202 99 199 111 190 116 C183 119 175 115 172 106 Z"
          fill="url(#np-chicken)"
          stroke="#4f1e08"
          strokeWidth="2.9"
          strokeLinejoin="round"
        />
        {/* Roast Grill Marks */}
        <path
          d="M180 100 L187 109 M185 96 L192 105"
          stroke="#662709"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Specular Glaze Highlight */}
        <path
          d="M178 99 C181 95 186 94 190 95"
          stroke="#ffe0b3"
          strokeOpacity="0.78"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* === FOOD 6: STEAMED RICE MOUND (Top-Left of Yellow Quadrant) === */}
      <g transform="translate(159 154) scale(0.93) translate(-160 -153)">
        <path
          d="M142 162 C139 156 142 149 148 147 C150 141 158 139 164 142 C171 140 179 145 178 153 C181 157 179 164 173 165 Z"
          fill="url(#np-rice)"
          stroke="#5e3e1c"
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        {/* Tiny rice grain texture marks */}
        <path
          d="M150 151 L154 149 M159 147 L163 149 M167 151 L171 149 M153 156 L158 155 M164 156 L168 155"
          stroke="#c5b498"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </g>

      {/* === FOOD 7: ARTISAN WHOLE-GRAIN BREAD LOAF (Center-Left of Yellow Quadrant) === */}
      <g transform="translate(157 174) scale(0.92) translate(-157 -175)">
        <ellipse
          cx="157"
          cy="175"
          rx="18.5"
          ry="13"
          transform="rotate(-12 157 175)"
          fill="url(#np-bread)"
          stroke="#4f250a"
          strokeWidth="2.9"
        />
        {/* Crust highlight */}
        <path
          d="M144 171 C148 165 158 163 166 165"
          stroke="#ffcf8c"
          strokeOpacity="0.7"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        {/* Bread score slashes */}
        <path
          d="M148 171 L152 178 M155 169 L159 177 M162 168 L166 175"
          stroke="#632e0c"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* === FOOD 8: GOLDEN WHEAT STALK & OAT GRAINS (Right & Bottom of Yellow Quadrant) === */}
      <g>
        <g transform="translate(182 166) scale(0.92) translate(-186 -167)">
          {/* Stem */}
          <path
            d="M174 191 Q186 170 198 144"
            stroke="#804908"
            strokeWidth="2.7"
            strokeLinecap="round"
          />
          {/* Paired Wheat Grains */}
          <g fill="url(#np-wheat)" stroke="#6e3c06" strokeWidth="2.1">
            <ellipse cx="182" cy="176" rx="5.2" ry="3" transform="rotate(-62 182 176)" />
            <ellipse cx="189" cy="178" rx="5.2" ry="3" transform="rotate(-12 189 178)" />
            <ellipse cx="186" cy="166" rx="5.2" ry="3" transform="rotate(-62 186 166)" />
            <ellipse cx="193" cy="168" rx="5.2" ry="3" transform="rotate(-12 193 168)" />
            <ellipse cx="190" cy="156" rx="5" ry="2.8" transform="rotate(-62 190 156)" />
            <ellipse cx="197" cy="158" rx="5" ry="2.8" transform="rotate(-12 197 158)" />
            <ellipse cx="196" cy="147" rx="4.8" ry="2.6" transform="rotate(-38 196 147)" />
          </g>
        </g>
        {/* Scattered small oat grains cleanly inside yellow arc */}
        <g fill="#ffe466" stroke="#784408" strokeWidth="1.8">
          <ellipse cx="145" cy="193.5" rx="3.2" ry="1.9" transform="rotate(-18 145 193.5)" />
          <ellipse cx="154.5" cy="196" rx="3.4" ry="1.9" transform="rotate(14 154.5 196)" />
          <ellipse cx="164.5" cy="193.5" rx="3.2" ry="1.9" transform="rotate(-12 164.5 193.5)" />
        </g>
      </g>
    </g>

    {/* Crisp Outer #1E1B2E Frame Overlay Stroke (eliminates any subpixel gap between gradient and border) */}
    <rect
      x="2.1"
      y="2.1"
      width="251.8"
      height="251.8"
      rx="49.9"
      stroke="#1E1B2E"
      strokeWidth="4.2"
      fill="none"
    />
  </svg>
));

NutriplatoIcon.displayName = 'NutriplatoIcon';

/**
 * Pure SVG vector icon for Cartas del Superpoder.
 * Faithfully vectorizes the 3 fanned superhero cards (emerald leaf card,
 * ocean hydration card, and prominent purple-framed golden lightning hero card)
 * over a radiant sunset coral-to-tangerine burst backdrop.
 */
export const SuperpowerCardsIcon: React.FC<IconProps> = memo(({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      {/* Vibrant sunset radial + diagonal backdrop */}
      <linearGradient id="sp-bg" x1="20" y1="24" x2="236" y2="236" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff5f8d" />
        <stop offset="46%" stopColor="#ff8873" />
        <stop offset="100%" stopColor="#ffa838" />
      </linearGradient>
      <radialGradient id="sp-core-glow" cx="50%" cy="48%" r="54%">
        <stop offset="0%" stopColor="#fff4a3" stopOpacity="0.95" />
        <stop offset="42%" stopColor="#ffc55c" stopOpacity="0.58" />
        <stop offset="100%" stopColor="#ff477e" stopOpacity="0" />
      </radialGradient>

      {/* Top curved glass gloss */}
      <linearGradient id="sp-gloss" x1="128" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.46" />
        <stop offset="62%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Lightweight shadows rendered directly via vector shapes instead of feDropShadow filters */}

      {/* Left green nature card */}
      <linearGradient id="sp-green-card" x1="36" y1="74" x2="118" y2="206" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#77ec34" />
        <stop offset="52%" stopColor="#45c41d" />
        <stop offset="100%" stopColor="#1e8a16" />
      </linearGradient>
      <linearGradient id="sp-leaf-fill" x1="58" y1="112" x2="96" y2="162" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#b2ff6b" />
        <stop offset="55%" stopColor="#5ed923" />
        <stop offset="100%" stopColor="#289416" />
      </linearGradient>

      {/* Right blue hydration card */}
      <linearGradient id="sp-blue-card" x1="142" y1="74" x2="224" y2="206" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6be6ff" />
        <stop offset="50%" stopColor="#35adf5" />
        <stop offset="100%" stopColor="#1b6fd1" />
      </linearGradient>
      <linearGradient id="sp-drop-fill" x1="164" y1="108" x2="188" y2="164" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ccf7ff" />
        <stop offset="45%" stopColor="#4fd1ff" />
        <stop offset="100%" stopColor="#1972d4" />
      </linearGradient>

      {/* Center hero card purple frame & face */}
      <linearGradient id="sp-hero-frame" x1="80" y1="36" x2="176" y2="218" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#b574ff" />
        <stop offset="48%" stopColor="#8944ee" />
        <stop offset="100%" stopColor="#5c21bc" />
      </linearGradient>
      <linearGradient id="sp-hero-face" x1="128" y1="50" x2="128" y2="206" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="72%" stopColor="#f8f6ff" />
        <stop offset="100%" stopColor="#ebe6fc" />
      </linearGradient>

      {/* Golden superhero lightning bolt */}
      <linearGradient id="sp-bolt-main" x1="112" y1="74" x2="146" y2="184" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff87a" />
        <stop offset="46%" stopColor="#ffd21f" />
        <stop offset="100%" stopColor="#f58b0a" />
      </linearGradient>
      <linearGradient id="sp-bolt-shade" x1="124" y1="90" x2="148" y2="178" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffb70f" />
        <stop offset="100%" stopColor="#e37205" />
      </linearGradient>
    </defs>

    {/* Sunset Background */}
    <rect width="256" height="256" fill="url(#sp-bg)" />

    {/* Radiant Sunburst Beams from Center */}
    <g fill="#ffffff" fillOpacity="0.14">
      <polygon points="128,124 8,-10 74,-10" />
      <polygon points="128,124 182,-10 248,-10" />
      <polygon points="128,124 266,76 266,144" />
      <polygon points="128,124 266,220 202,266" />
      <polygon points="128,124 54,266 -10,220" />
      <polygon points="128,124 -10,144 -10,76" />
    </g>

    {/* Warm Center Glow */}
    <circle cx="128" cy="124" r="118" fill="url(#sp-core-glow)" />

    {/* Top Glass Gloss */}
    <path d="M-10 -10 H266 V84 C196 112 60 112 -10 84 Z" fill="url(#sp-gloss)" />

    {/* Subtle Inner Specular Frame */}
    <rect
      x="6"
      y="6"
      width="244"
      height="244"
      rx="50"
      stroke="#ffffff"
      strokeOpacity="0.4"
      strokeWidth="4"
    />

    {/* Decorative Background Sparkles & Rays */}
    <path d="M54 44 L56.5 51.5 L64 54 L56.5 56.5 L54 64 L51.5 56.5 L44 54 L51.5 51.5 Z" fill="#ffffff" />
    <path d="M26 178 L28 184 L34 186 L28 188 L26 194 L24 188 L18 186 L24 184 Z" fill="#ffffff" />
    <path d="M196 42 L198 48 L204 50 L198 52 L196 58 L194 52 L188 50 L194 48 Z" fill="#fff7b8" />
    <path d="M214 58 L226 48 M218 68 L231 64" stroke="#fff3a8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.85" />
    <circle cx="222" cy="196" r="3.2" fill="#ffffff" fillOpacity="0.88" />
    <circle cx="38" cy="80" r="2.8" fill="#ffffff" fillOpacity="0.8" />

    {/* === LEFT CARD: GREEN NATURE SUPERPOWER === */}
    <g transform="rotate(-14 78 144)">
      <rect x="32" y="81" width="92" height="138" rx="15" fill="#54122b" fillOpacity="0.28" />
      <rect
        x="32"
        y="74"
        width="92"
        height="138"
        rx="15"
        fill="url(#sp-green-card)"
        stroke="#1b4212"
        strokeWidth="3.6"
      />
      {/* Crisp white inner border */}
      <rect
        x="40"
        y="82"
        width="76"
        height="122"
        rx="9"
        stroke="#d8ffb5"
        strokeOpacity="0.72"
        strokeWidth="2.4"
      />
      {/* Mini corner leaf emblem */}
      <g fill="#ffffff" fillOpacity="0.9">
        <path d="M52 104 C47 97 49 90 56 91 C58 96 56 101 52 104 Z" />
        <path d="M55 104 C61 101 64 95 61 90 C56 92 54 98 55 104 Z" />
      </g>
      {/* Large Stylized Hero Leaf Peeking Out */}
      <path
        d="M84 114 C65 123 58 146 68 164 C84 166 100 155 102 135 C103 125 94 116 84 114 Z"
        fill="url(#sp-leaf-fill)"
        stroke="#1b4d12"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M68 164 Q78 144 88 124 M74 150 L68 144 M79 140 L73 135 M77 146 L86 144"
        stroke="#1b4d12"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>

    {/* === RIGHT CARD: BLUE HYDRATION SUPERPOWER === */}
    <g transform="rotate(14 178 144)">
      <rect x="132" y="81" width="92" height="138" rx="15" fill="#54122b" fillOpacity="0.28" />
      <rect
        x="132"
        y="74"
        width="92"
        height="138"
        rx="15"
        fill="url(#sp-blue-card)"
        stroke="#123a6b"
        strokeWidth="3.6"
      />
      {/* Crisp white inner border */}
      <rect
        x="140"
        y="82"
        width="76"
        height="122"
        rx="9"
        stroke="#c9f4ff"
        strokeOpacity="0.75"
        strokeWidth="2.4"
      />
      {/* Subtle white nutrition watermark icons along right side */}
      <g fill="#ffffff" fillOpacity="0.52">
        {/* Mini apple */}
        <circle cx="201" cy="105" r="7.5" />
        <rect x="200" y="94" width="2.2" height="5" rx="1" />
        {/* Mini avocado / drop */}
        <ellipse cx="204" cy="133" rx="6.5" ry="8.5" />
        <circle cx="204" cy="135" r="2.6" fill="#2c9ce8" />
        {/* Mini peanut / grain */}
        <ellipse cx="200" cy="164" rx="5.5" ry="8" transform="rotate(20 200 164)" />
        {/* Mini water glass */}
        <path d="M196 184 H208 L206 196 H198 Z" />
      </g>
      {/* Glossy Water Droplet Peeking Out */}
      <path
        d="M172 110 C172 110 154 132 154 146 C154 157 162 165 172 165 C182 165 190 157 190 146 C190 132 172 110 172 110 Z"
        fill="url(#sp-drop-fill)"
        stroke="#123a6b"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M163 142 C163 149 166 155 171 157"
        stroke="#ffffff"
        strokeOpacity="0.88"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="165" cy="134" r="2.3" fill="#ffffff" fillOpacity="0.85" />
    </g>

    {/* === CENTER HERO CARD: GOLDEN LIGHTNING SUPERPOWER === */}
    <g>
      <rect x="79" y="46" width="98" height="182" rx="18" fill="#330e4f" fillOpacity="0.32" />
      {/* 3D Purple Outer Frame */}
      <rect
        x="79"
        y="37"
        width="98"
        height="182"
        rx="18"
        fill="url(#sp-hero-frame)"
        stroke="#241342"
        strokeWidth="4"
      />
      {/* Top Frame Glossy Bevel */}
      <path
        d="M95 42.5 H161"
        stroke="#e7cfff"
        strokeOpacity="0.72"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Crisp White Inner Card Face */}
      <rect
        x="89"
        y="48"
        width="78"
        height="160"
        rx="11"
        fill="url(#sp-hero-face)"
        stroke="#6227be"
        strokeWidth="2.2"
      />
    </g>

    {/* Subtle Warm Radial Halo Behind Lightning Bolt */}
    <circle cx="128" cy="128" r="36" fill="#ffdf4d" fillOpacity="0.22" />

    {/* Crisp Mini Gold Sparkles Inside Hero Card */}
    <g fill="#ffb61a">
      <path d="M104 94 L106.2 100.5 L112.5 102.5 L106.2 104.5 L104 111 L101.8 104.5 L95.5 102.5 L101.8 100.5 Z" />
      <path d="M150 148 L152 154 L158 156 L152 158 L150 164 L148 158 L142 156 L148 154 Z" />
      <path d="M105 148 L106.6 152.5 L111 154 L106.6 155.5 L105 160 L103.4 155.5 L99 154 L103.4 152.5 Z" />
      <path d="M152 98 L153.6 102.2 L157.8 103.8 L153.6 105.4 L152 109.6 L150.4 105.4 L146.2 103.8 L150.4 102.2 Z" />
      <circle cx="114" cy="84" r="2.4" />
      <circle cx="144" cy="172" r="2.2" />
    </g>

    {/* HERO GOLDEN LIGHTNING BOLT */}
    <g>
      <path d="M137 77 L104 137 H126 L116 187 L154 121 H131 L137 77 Z" fill="#ffae00" fillOpacity="0.35" />
      {/* Main Bolt Silhouette */}
      <path
        d="M137 74 L104 134 H126 L116 184 L154 118 H131 L137 74 Z"
        fill="url(#sp-bolt-main)"
        stroke="#592904"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Faceted 3D Right Shade */}
      <path
        d="M134 84 L128.5 120 H148.5 L120.5 173 L129.5 131 H114 Z"
        fill="url(#sp-bolt-shade)"
        fillOpacity="0.52"
      />
      {/* Crisp Specular Highlight along Left Edge */}
      <path
        d="M133 83 L111 129 H125"
        stroke="#fffcd1"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
));

SuperpowerCardsIcon.displayName = 'SuperpowerCardsIcon';

/**
 * Pure SVG vector icon for El Semáforo.
 * Faithfully vectorizes the glossy 3D charcoal traffic light with radiant red,
 * yellow, and green lenses paired with 3 horizontal food-example pill bars
 * over a luminous aqua-to-lavender backdrop.
 */
export const SemaforoIcon: React.FC<IconProps> = memo(({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      {/* Aqua-cyan to lavender-purple backdrop */}
      <linearGradient id="sm-bg" x1="128" y1="0" x2="128" y2="256" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c2ffff" />
        <stop offset="38%" stopColor="#7cf5ff" />
        <stop offset="72%" stopColor="#8fa0ff" />
        <stop offset="100%" stopColor="#8558f2" />
      </linearGradient>

      {/* Top curved glass gloss */}
      <linearGradient id="sm-gloss" x1="128" y1="0" x2="128" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
        <stop offset="65%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Lightweight vector offset shadows used directly on bars and housing */}

      {/* Traffic light metallic body */}
      <linearGradient id="sm-housing" x1="22" y1="36" x2="96" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6c778f" />
        <stop offset="42%" stopColor="#464e63" />
        <stop offset="100%" stopColor="#292e3d" />
      </linearGradient>
      <linearGradient id="sm-housing-inner" x1="30" y1="44" x2="88" y2="212" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#58627a" />
        <stop offset="100%" stopColor="#32384a" />
      </linearGradient>

      {/* 3 Radiant Spherical Lenses */}
      <radialGradient id="sm-lens-red" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#ffc7cc" />
        <stop offset="28%" stopColor="#ff4558" />
        <stop offset="72%" stopColor="#e31932" />
        <stop offset="100%" stopColor="#940a1d" />
      </radialGradient>
      <radialGradient id="sm-lens-yellow" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#fffbd1" />
        <stop offset="30%" stopColor="#ffe138" />
        <stop offset="74%" stopColor="#f5a80a" />
        <stop offset="100%" stopColor="#b85f00" />
      </radialGradient>
      <radialGradient id="sm-lens-green" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#d9ffb8" />
        <stop offset="30%" stopColor="#69ea2c" />
        <stop offset="74%" stopColor="#2db514" />
        <stop offset="100%" stopColor="#146b09" />
      </radialGradient>

      {/* 3 Horizontal Glossy Category Bars */}
      <linearGradient id="sm-bar-red" x1="158" y1="54" x2="158" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff6b7c" />
        <stop offset="52%" stopColor="#f2334c" />
        <stop offset="100%" stopColor="#c71832" />
      </linearGradient>
      <linearGradient id="sm-bar-yellow" x1="158" y1="108" x2="158" y2="154" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffea59" />
        <stop offset="52%" stopColor="#ffbc1f" />
        <stop offset="100%" stopColor="#e08907" />
      </linearGradient>
      <linearGradient id="sm-bar-green" x1="158" y1="162" x2="158" y2="208" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7ff03a" />
        <stop offset="52%" stopColor="#46c41a" />
        <stop offset="100%" stopColor="#268f0f" />
      </linearGradient>
    </defs>

    {/* Aqua-to-Lavender Background */}
    <rect width="256" height="256" fill="url(#sm-bg)" />

    {/* Top Glossy Glass Dome */}
    <path d="M-10 -10 H266 V84 C196 110 60 110 -10 84 Z" fill="url(#sm-gloss)" />

    {/* Subtle Inner Rim Highlight */}
    <rect
      x="6"
      y="6"
      width="244"
      height="244"
      rx="50"
      stroke="#ffffff"
      strokeOpacity="0.52"
      strokeWidth="4"
    />

    {/* ============================================================
        ROW 1: RED BAR (Candy, Pink Frosted Donut, Soda Cup)
       ============================================================ */}
    <g>
      <rect x="82" y="60" width="153" height="45" rx="22.5" fill="#25184d" fillOpacity="0.25" />
      <rect
        x="82"
        y="55"
        width="153"
        height="45"
        rx="22.5"
        fill="url(#sm-bar-red)"
        stroke="#221933"
        strokeWidth="3.6"
      />
      <path
        d="M100 61 H215"
        stroke="#ffb8c2"
        strokeOpacity="0.68"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </g>

    {/* Mini Candy (Red Row Left) */}
    <g transform="translate(120 77) rotate(-30)">
      {/* Twisted Wrappers */}
      <path
        d="M-14 -5 L-7 0 L-14 5 Z M14 -5 L7 0 L14 5 Z"
        fill="#a349ff"
        stroke="#24153d"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {/* Candy Center */}
      <ellipse cx="0" cy="0" rx="8.5" ry="6.8" fill="#5ce1ff" stroke="#24153d" strokeWidth="2.2" />
      <path d="M-4 -6 L-1 6 M2 -6 L5 6" stroke="#ff4588" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-4 -2.5 L2 -2.5" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" />
    </g>

    {/* Mini Pink Frosted Donut (Red Row Center) */}
    <g transform="translate(162 77.5)">
      {/* Dough base */}
      <circle cx="0" cy="1.5" r="13.5" fill="#e89c4a" stroke="#361c12" strokeWidth="2.2" />
      {/* Pink wavy icing */}
      <path
        d="M-12.5 -1 C-12.5 -9.5 -6 -13.5 0 -13.5 C6.8 -13.5 12.5 -9 12.5 -1 C12.5 3.5 9.5 6 7 4.5 C4.5 3 2.5 7 0 6.5 C-2.5 6 -4.5 3.5 -7 5 C-9.5 6.5 -12.5 3.5 -12.5 -1 Z"
        fill="#ff87b2"
        stroke="#4f162c"
        strokeWidth="1.8"
      />
      {/* Donut hole */}
      <circle cx="0" cy="0.5" r="4.2" fill="#e62b44" stroke="#361c12" strokeWidth="2" />
      {/* Colorful sprinkles */}
      <path d="M-7 -6 L-4 -7 M3 -8 L6 -6 M7 -1 L9 1 M-8 1 L-6 3 M1 -5 L3 -4" stroke="#fff066" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-1" cy="-9" r="1.2" fill="#63f2ff" />
      <circle cx="6" cy="-3" r="1.2" fill="#ffffff" />
    </g>

    {/* Mini Soda Cup (Red Row Right) */}
    <g transform="translate(204 77.5)">
      {/* Bent Straw */}
      <path
        d="M1 -10 L3 -17 L9 -18"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 -10 L3 -17 L9 -18"
        stroke="#241933"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cup Body */}
      <path
        d="M-9 -7 H9 L6.8 13.5 C6.5 15 5.2 15.5 3.5 15.5 H-3.5 C-5.2 15.5 -6.5 15 -6.8 13.5 Z"
        fill="#ffffff"
        stroke="#241933"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Red cup stripes */}
      <path d="M-7.5 1 H7.5 L6.7 8 H-6.7 Z" fill="#f02e44" />
      {/* White Lid */}
      <rect x="-10.5" y="-10.5" width="21" height="4.5" rx="2.2" fill="#f2f6ff" stroke="#241933" strokeWidth="2" />
    </g>

    {/* ============================================================
        ROW 2: YELLOW BAR (Cheese Wedge, Bread Roll, Spaghetti Plate)
       ============================================================ */}
    <g>
      <rect x="82" y="114" width="153" height="45" rx="22.5" fill="#25184d" fillOpacity="0.25" />
      <rect
        x="82"
        y="109"
        width="153"
        height="45"
        rx="22.5"
        fill="url(#sm-bar-yellow)"
        stroke="#221933"
        strokeWidth="3.6"
      />
      <path
        d="M100 115 H215"
        stroke="#fff9b3"
        strokeOpacity="0.78"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </g>

    {/* Mini Cheese Wedge (Yellow Row Left) */}
    <g transform="translate(121 132)">
      {/* Top surface */}
      <path
        d="M-13 -3 L4 -11 L13 -3 L-13 -3 Z"
        fill="#fff176"
        stroke="#572c07"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {/* Front face */}
      <path
        d="M-13 -3 H13 V10 C13 11 12 11.5 10.5 11.5 H-10.5 C-12 11.5 -13 11 -13 10 Z"
        fill="#ffcf24"
        stroke="#572c07"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Swiss cheese holes */}
      <circle cx="-5" cy="4" r="2.7" fill="#d97b07" />
      <circle cx="4" cy="2" r="2.1" fill="#d97b07" />
      <circle cx="8" cy="7.5" r="1.6" fill="#d97b07" />
    </g>

    {/* Mini Bread Loaf (Yellow Row Center) */}
    <g transform="translate(162 132) rotate(-14)">
      <ellipse cx="0" cy="0" rx="14.5" ry="9.5" fill="#cc7c31" stroke="#472107" strokeWidth="2.3" />
      <path d="M-9 -3 C-4 -7 4 -7 9 -3" stroke="#ffcf8c" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      <path d="M-6 -4 L-3 3 M0 -5 L3 3 M6 -4 L8 2" stroke="#612c0a" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Mini Spaghetti Plate (Yellow Row Right) */}
    <g transform="translate(204 133)">
      {/* White Plate */}
      <ellipse cx="0" cy="6" rx="16.5" ry="6.5" fill="#ffffff" stroke="#2f2440" strokeWidth="2.1" />
      {/* Golden Pasta Mound */}
      <path
        d="M-12 5 C-12 -4 -6 -9 0 -9 C6 -9 12 -4 12 5 Z"
        fill="#ffe054"
        stroke="#704207"
        strokeWidth="2"
      />
      {/* Pasta Strand Lines */}
      <path d="M-8 3 Q0 -3 8 3 M-6 0 Q0 -5 6 0" stroke="#cf8210" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tomato Sauce Dollop */}
      <path
        d="M-6 -4 C-5 -9 5 -9 6 -4 C5 -1 2 0 0 -1 C-2 0 -5 -1 -6 -4 Z"
        fill="#e82b34"
        stroke="#660d12"
        strokeWidth="1.6"
      />
      {/* Tiny Basil Leaf */}
      <ellipse cx="0" cy="-7" rx="2.8" ry="1.6" fill="#52cf1d" stroke="#1d4f0c" strokeWidth="1.2" />
    </g>

    {/* ============================================================
        ROW 3: GREEN BAR (Broccoli, Red Apple, Yellow Banana)
       ============================================================ */}
    <g>
      <rect x="82" y="168" width="153" height="45" rx="22.5" fill="#25184d" fillOpacity="0.25" />
      <rect
        x="82"
        y="163"
        width="153"
        height="45"
        rx="22.5"
        fill="url(#sm-bar-green)"
        stroke="#221933"
        strokeWidth="3.6"
      />
      <path
        d="M100 169 H215"
        stroke="#c9ff9e"
        strokeOpacity="0.68"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </g>

    {/* Mini Broccoli (Green Row Left) */}
    <g transform="translate(120 186)">
      <path d="M-4 1 L-2 12 C-1 13.5 2 13.5 3 12 L5 1 Z" fill="#a8eb5e" stroke="#1b450f" strokeWidth="2.1" />
      <path
        d="M-9 2 C-13 0 -13 -7 -8 -9 C-7 -14 0 -15 4 -12 C10 -14 14 -8 11 -2 C12 2 8 4 4 3 C1 5 -6 5 -9 2 Z"
        fill="#3fb51a"
        stroke="#1b450f"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="-4" cy="-7" r="2" fill="#9eff5c" fillOpacity="0.7" />
      <circle cx="5" cy="-7" r="1.8" fill="#9eff5c" fillOpacity="0.65" />
    </g>

    {/* Mini Red Apple (Green Row Center) */}
    <g transform="translate(162 186)">
      <path d="M0 -9 C0.5 -13 2 -15 4 -16" stroke="#52260e" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M0 -12 C-4 -15 -8 -14 -8 -10 C-5 -9 -2 -10 0 -12 Z" fill="#6ee624" stroke="#1b470c" strokeWidth="1.7" />
      <path
        d="M0 -9 C-6 -12 -13 -8 -13 1 C-13 9 -7 14 -2 13.5 C-0.5 13.3 0.5 13.3 2 13.5 C7 14 13 9 13 1 C13 -8 6 -12 0 -9 Z"
        fill="#f02438"
        stroke="#4f0a14"
        strokeWidth="2.2"
      />
      <path d="M-7 -3 C-7.5 0 -7 3 -5.5 5" stroke="#ffffff" strokeOpacity="0.86" strokeWidth="2.2" strokeLinecap="round" />
    </g>

    {/* Mini Yellow Banana (Green Row Right) */}
    <g transform="translate(204 186)">
      <path
        d="M9 -12 C13 -5 12 6 3 11 C-4 15 -12 13 -15 8 C-10 8 -4 6 1 1 C5 -3 7 -8 7 -12 Z"
        fill="#ffe33b"
        stroke="#5c3506"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path d="M6 -6 C6 0 2 6 -6 9" stroke="#fff8ba" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8.2" cy="-12.5" r="2" fill="#5c3506" />
      <circle cx="-15" cy="8" r="1.7" fill="#5c3506" />
    </g>

    {/* ============================================================
        LEFT PROMINENT 3D TRAFFIC LIGHT HOUSING
       ============================================================ */}
    <g>
      <rect x="26" y="42" width="74" height="194" rx="28" fill="#1c1438" fillOpacity="0.32" />
      {/* Outer Charcoal Casing */}
      <rect
        x="23"
        y="34"
        width="74"
        height="194"
        rx="28"
        fill="url(#sm-housing)"
        stroke="#1b1f2c"
        strokeWidth="4.4"
      />
      {/* Recessed Inner Metallic Face */}
      <rect
        x="31"
        y="42"
        width="58"
        height="178"
        rx="21"
        fill="url(#sm-housing-inner)"
        stroke="#7e8aa6"
        strokeOpacity="0.5"
        strokeWidth="2.2"
      />

      {/* === RED LENS (TOP) === */}
      <circle cx="60" cy="77.5" r="22.5" fill="#1e2230" />
      <circle cx="60" cy="77.5" r="18.5" fill="url(#sm-lens-red)" stroke="#610815" strokeWidth="2" />
      <ellipse
        cx="53.5"
        cy="70.5"
        rx="6.2"
        ry="3.8"
        transform="rotate(-34 53.5 70.5)"
        fill="#ffffff"
        fillOpacity="0.82"
      />
      <path
        d="M50 89 A14 14 0 0 0 70 89"
        stroke="#ff8a96"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* === YELLOW LENS (MIDDLE) === */}
      <circle cx="60" cy="131.5" r="22.5" fill="#1e2230" />
      <circle cx="60" cy="131.5" r="18.5" fill="url(#sm-lens-yellow)" stroke="#753d00" strokeWidth="2" />
      <ellipse
        cx="53.5"
        cy="124.5"
        rx="6.2"
        ry="3.8"
        transform="rotate(-34 53.5 124.5)"
        fill="#ffffff"
        fillOpacity="0.85"
      />
      <path
        d="M50 143 A14 14 0 0 0 70 143"
        stroke="#fff3a8"
        strokeOpacity="0.58"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* === GREEN LENS (BOTTOM) === */}
      <circle cx="60" cy="185.5" r="22.5" fill="#1e2230" />
      <circle cx="60" cy="185.5" r="18.5" fill="url(#sm-lens-green)" stroke="#0f4d08" strokeWidth="2" />
      <ellipse
        cx="53.5"
        cy="178.5"
        rx="6.2"
        ry="3.8"
        transform="rotate(-34 53.5 178.5)"
        fill="#ffffff"
        fillOpacity="0.84"
      />
      <path
        d="M50 197 A14 14 0 0 0 70 197"
        stroke="#adff78"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>
  </svg>
));

SemaforoIcon.displayName = 'SemaforoIcon';

/**
 * Pure SVG vector icon for Cuestionario Relámpago.
 * Glossy electric-purple-to-indigo backdrop with radiant sparkles,
 * floating cartoon quiz card with 3 colorful answer pills, a bold golden
 * lightning emblem, and vibrant question mark accent.
 */
export const LightningQuizIcon: React.FC<IconProps> = memo(({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      {/* Electric violet-to-royal indigo backdrop */}
      <linearGradient id="lq-bg" x1="18" y1="14" x2="238" y2="246" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#b066ff" />
        <stop offset="48%" stopColor="#8137ea" />
        <stop offset="100%" stopColor="#4618a8" />
      </linearGradient>

      {/* Luminous center halo */}
      <radialGradient id="lq-glow" cx="50%" cy="48%" r="54%">
        <stop offset="0%" stopColor="#fff48f" stopOpacity="0.6" />
        <stop offset="52%" stopColor="#c58bff" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#5a21c7" stopOpacity="0" />
      </radialGradient>

      {/* Top curved glass gloss */}
      <linearGradient id="lq-gloss" x1="128" y1="0" x2="128" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
        <stop offset="65%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Quiz card body */}
      <linearGradient id="lq-card-face" x1="128" y1="42" x2="128" y2="216" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="78%" stopColor="#f7f4ff" />
        <stop offset="100%" stopColor="#e8e0fc" />
      </linearGradient>

      {/* Quiz card header strip */}
      <linearGradient id="lq-card-head" x1="50" y1="44" x2="188" y2="96" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9b4dff" />
        <stop offset="100%" stopColor="#6922d4" />
      </linearGradient>

      {/* Golden lightning bolt */}
      <linearGradient id="lq-bolt-fill" x1="162" y1="74" x2="222" y2="206" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff98c" />
        <stop offset="44%" stopColor="#fee330" />
        <stop offset="100%" stopColor="#ff9408" />
      </linearGradient>

      {/* Vivid emerald checkmark pill */}
      <linearGradient id="lq-green-pill" x1="66" y1="118" x2="168" y2="146" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7ff03a" />
        <stop offset="100%" stopColor="#46c41a" />
      </linearGradient>

      {/* Coral accent badge */}
      <linearGradient id="lq-qbadge" x1="28" y1="28" x2="88" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff7aa2" />
        <stop offset="100%" stopColor="#f52f6a" />
      </linearGradient>
    </defs>

    {/* Vibrant Electric Purple Backdrop */}
    <rect width="256" height="256" fill="url(#lq-bg)" />

    {/* Radiant Sunburst Rays */}
    <g fill="#ffffff" fillOpacity="0.11">
      <polygon points="128,128 0,-10 72,-10" />
      <polygon points="128,128 184,-10 256,-10" />
      <polygon points="128,128 266,86 266,158" />
      <polygon points="128,128 256,266 184,266" />
      <polygon points="128,128 72,266 0,266" />
      <polygon points="128,128 -10,158 -10,86" />
    </g>

    {/* Soft Warm Center Aura */}
    <circle cx="128" cy="128" r="112" fill="url(#lq-glow)" />

    {/* Top Curved Gloss Dome */}
    <path d="M-10 -10 H266 V84 C196 112 60 112 -10 84 Z" fill="url(#lq-gloss)" />

    {/* Concentric Inner Specular Frame */}
    <rect
      x="6"
      y="6"
      width="244"
      height="244"
      rx="50"
      stroke="#ffffff"
      strokeOpacity="0.42"
      strokeWidth="4"
    />

    {/* Decorative Sparkles */}
    <path d="M214 42 L216.5 49 L223.5 51.5 L216.5 54 L214 61 L211.5 54 L204.5 51.5 L211.5 49 Z" fill="#fff7b2" />
    <path d="M36 188 L38.2 194 L44.2 196.2 L38.2 198.4 L36 204.4 L33.8 198.4 L27.8 196.2 L33.8 194 Z" fill="#ffffff" />
    <circle cx="226" cy="204" r="3.4" fill="#fff599" fillOpacity="0.92" />
    <circle cx="34" cy="116" r="2.8" fill="#ffffff" fillOpacity="0.82" />

    {/* === MAIN TILTED QUIZ CARD === */}
    <g transform="rotate(-6 118 134)">
      {/* 3D Solid Card Shadow */}
      <rect x="44" y="54" width="144" height="168" rx="22" fill="#1E1B2E" />
      {/* Card Outer Body */}
      <rect
        x="44"
        y="46"
        width="144"
        height="168"
        rx="22"
        fill="url(#lq-card-face)"
        stroke="#1E1B2E"
        strokeWidth="4.2"
      />
      {/* Purple Top Strip */}
      <path
        d="M46 68 C46 56 55 48 66 48 H166 C177 48 186 56 186 68 V88 H46 V68 Z"
        fill="url(#lq-card-head)"
      />
      <line x1="46" y1="88" x2="186" y2="88" stroke="#1E1B2E" strokeWidth="3.6" />
      {/* Mini Header Dots / Title Lines */}
      <rect x="64" y="64" width="76" height="9" rx="4.5" fill="#ffffff" fillOpacity="0.92" />
      <circle cx="156" cy="68.5" r="5" fill="#fee330" stroke="#1E1B2E" strokeWidth="2" />

      {/* Option 1 (Correct Emerald Highlight) */}
      <rect
        x="58"
        y="102"
        width="116"
        height="28"
        rx="10"
        fill="url(#lq-green-pill)"
        stroke="#1E1B2E"
        strokeWidth="3"
      />
      <circle cx="72" cy="116" r="7.5" fill="#ffffff" stroke="#1E1B2E" strokeWidth="2.2" />
      <path
        d="M69 116 L71.2 118.4 L75.6 113.6"
        stroke="#1e7b0e"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="86" y="112" width="68" height="8" rx="4" fill="#ffffff" fillOpacity="0.92" />

      {/* Option 2 (Neutral White) */}
      <rect
        x="58"
        y="138"
        width="116"
        height="26"
        rx="10"
        fill="#ffffff"
        stroke="#1E1B2E"
        strokeWidth="2.8"
      />
      <rect x="65" y="144" width="14" height="14" rx="4" fill="#fee330" stroke="#1E1B2E" strokeWidth="2" />
      <rect x="86" y="147" width="62" height="7.5" rx="3.75" fill="#d5ccf0" />

      {/* Option 3 (Neutral White) */}
      <rect
        x="58"
        y="172"
        width="116"
        height="26"
        rx="10"
        fill="#ffffff"
        stroke="#1E1B2E"
        strokeWidth="2.8"
      />
      <rect x="65" y="178" width="14" height="14" rx="4" fill="#fee330" stroke="#1E1B2E" strokeWidth="2" />
      <rect x="86" y="181" width="52" height="7.5" rx="3.75" fill="#d5ccf0" />
    </g>

    {/* === TOP-LEFT CORAL QUESTION MARK BADGE === */}
    <g transform="rotate(-10 56 58)">
      <circle cx="56" cy="63" r="28" fill="#1E1B2E" />
      <circle
        cx="56"
        cy="57"
        r="28"
        fill="url(#lq-qbadge)"
        stroke="#1E1B2E"
        strokeWidth="4"
      />
      <path
        d="M42 42 A18 18 0 0 1 68 39"
        stroke="#ffc7d9"
        strokeOpacity="0.72"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Crisp Cartoon Question Mark */}
      <path
        d="M48.5 50.5 C48.5 45 52.2 42 57 42 C62 42 65.5 45.2 65.5 49.8 C65.5 53.5 63 55.6 60 57.5 C57.8 59 57 60.4 57 63"
        stroke="#ffffff"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="57" cy="72" r="3.4" fill="#ffffff" />
    </g>

    {/* === FOREGROUND HERO GOLDEN LIGHTNING BOLT === */}
    <g>
      {/* Solid 3D extrusion shadow */}
      <path
        d="M204 75 L154 146 H184 L168 219 L228 134 H196 L204 75 Z"
        fill="#1E1B2E"
      />
      {/* Main Bolt */}
      <path
        d="M201 69 L151 140 H181 L165 213 L225 128 H193 L201 69 Z"
        fill="url(#lq-bolt-fill)"
        stroke="#1E1B2E"
        strokeWidth="4.4"
        strokeLinejoin="round"
      />
      {/* Inner Facet Highlight */}
      <path
        d="M196 81 L162 133 H181"
        stroke="#fffef0"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
));

LightningQuizIcon.displayName = 'LightningQuizIcon';

