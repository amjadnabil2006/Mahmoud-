import React from 'react';

export interface CoolMindLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  variant?: 'icon' | 'horizontal' | 'vertical' | 'full-banner' | 'stamp';
  showSubtitle?: boolean;
  showArabicTagline?: boolean;
  lightModeOnly?: boolean;
  glow?: boolean;
}

/**
 * Official CoolMind Brand Logo Component
 * Precision vector recreation of the brand mark:
 * - Deep Teal 'C' (Psychiatric/Clinical Foundation)
 * - Mint Green 'M' Wave (Tranquility, Balance & Flow)
 * - Warm Peach Human Silhouette (Compassionate, Human-Centered Care)
 */
export const CoolMindLogo: React.FC<CoolMindLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  showArabicTagline = false,
  lightModeOnly = false,
  glow = false
}) => {
  // Dimension resolver
  const getDimensions = () => {
    if (typeof size === 'number') {
      return { iconSize: size, textClass: 'text-xl', subClass: 'text-[9.5px]' };
    }
    switch (size) {
      case 'xs': return { iconSize: 22, textClass: 'text-sm', subClass: 'text-[7px]' };
      case 'sm': return { iconSize: 32, textClass: 'text-base', subClass: 'text-[8.5px]' };
      case 'md': return { iconSize: 44, textClass: 'text-xl', subClass: 'text-[9.5px]' };
      case 'lg': return { iconSize: 58, textClass: 'text-2xl', subClass: 'text-[11px]' };
      case 'xl': return { iconSize: 76, textClass: 'text-3xl', subClass: 'text-[13px]' };
      case '2xl': return { iconSize: 96, textClass: 'text-4xl', subClass: 'text-[15px]' };
      default: return { iconSize: 44, textClass: 'text-xl', subClass: 'text-[9.5px]' };
    }
  };

  const dim = getDimensions();
  const iconPx: number = typeof size === 'number' ? size : dim.iconSize;

  // Vector Emblem Mark
  const renderEmblem = () => (
    <svg
      viewBox="0 0 320 220"
      width={iconPx}
      height={(iconPx * 220) / 320}
      className={`shrink-0 transition-transform ${glow ? 'drop-shadow-[0_4px_16px_rgba(20,184,166,0.35)]' : 'drop-shadow-xs'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Deep Teal Gradient for 'C' */}
        <linearGradient id="cm-teal-grad" x1="20" y1="20" x2="160" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B4B52" />
          <stop offset="50%" stopColor="#0E5E67" />
          <stop offset="100%" stopColor="#147B85" />
        </linearGradient>

        {/* Mint / Seafoam Green Gradient for 'M' Waves */}
        <linearGradient id="cm-mint-grad" x1="100" y1="40" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#83D9BD" />
          <stop offset="60%" stopColor="#64C4A3" />
          <stop offset="100%" stopColor="#4AA888" />
        </linearGradient>

        {/* Soft Peach / Clay Silhouette Gradient for Human Profile */}
        <linearGradient id="cm-peach-grad" x1="180" y1="40" x2="270" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5BFA2" />
          <stop offset="50%" stopColor="#EAA882" />
          <stop offset="100%" stopColor="#D98E67" />
        </linearGradient>

        {/* Bottom Wave Teal Gradient */}
        <linearGradient id="cm-wave-teal" x1="70" y1="120" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#073B40" />
          <stop offset="100%" stopColor="#0E5E67" />
        </linearGradient>

        {/* Soft Drop Shadow for Layered Paper Effect */}
        <filter id="cm-paper-shadow" x="-8%" y="-8%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="2" dy="3" stdDeviation="3.5" floodColor="#062226" floodOpacity="0.28" />
        </filter>

        <filter id="cm-inner-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#041B1F" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Layer 1: Warm Peach Base Shadow & Human Profile Silhouette */}
      <g filter="url(#cm-paper-shadow)">
        {/* Lower peach supportive wave connecting to profile base */}
        <path
          d="M105 168 C125 186 148 190 172 176 C176 174 182 178 186 186 C190 194 196 195 204 195 L228 195 C232 195 236 191 237 186 C238 181 242 172 248 168 C254 163 260 152 260 144 C260 142 264 140 266 137 C269 132 269 126 266 123 C263 120 263 118 266 114 C270 108 274 102 272 96 C270 89 266 87 266 82 C266 77 268 73 264 68 C259 60 250 54 238 52 C226 50 215 54 206 62 C204 64 200 68 197 73 L195 110 C204 98 214 88 226 78 C232 73 241 76 244 83 C247 90 248 98 247 106 C246 113 242 120 241 127 C240 133 244 140 242 147 C240 154 235 159 231 164 L224 172 C216 172 208 170 202 165 C190 155 178 148 165 146 C143 143 122 153 105 168 Z"
          fill="url(#cm-peach-grad)"
        />
        {/* Serene Human Face Silhouette Details */}
        <path
          d="M236 53 
             C246 54 256 61 261 70 
             C265 76 264 80 264 84 
             C264 88 268 91 270 96 
             C272 101 268 107 265 112 
             C262 116 262 119 265 122 
             C268 126 267 131 264 136 
             C262 139 258 141 258 144 
             C258 152 252 161 246 166 
             C241 170 237 178 236 183 
             C235 187 232 190 228 190 
             L206 190 
             C201 190 197 186 194 180 
             C188 168 179 160 167 155
             C158 151 148 150 138 152
             C148 144 160 141 172 144
             C186 147 198 155 210 165
             C216 170 223 172 230 172
             C235 166 240 159 242 152
             C243 145 240 139 241 133
             C242 127 246 120 247 114
             C248 107 247 100 244 94
             C241 87 234 84 228 88
             C218 97 208 107 200 118
             L202 82
             C211 70 222 58 236 53 Z"
          fill="url(#cm-peach-grad)"
        />
      </g>

      {/* Layer 2: Center Mint Green 'M' Arch & Neural Tranquility Wave */}
      <g filter="url(#cm-paper-shadow)">
        <path
          d="M125 54 
             C132 54 138 57 143 63 
             C152 75 162 96 172 117 
             C180 133 189 146 199 154 
             C206 160 216 160 224 154 
             C228 151 232 146 235 140 
             C236 130 235 120 232 111 
             C228 98 221 86 212 76 
             C207 70 203 64 200 58 
             C198 55 200 52 204 52 
             C211 52 218 56 224 63 
             C236 76 245 92 249 108 
             C251 118 251 128 248 138 
             C244 150 236 160 226 167 
             C212 176 195 176 182 165 
             C171 155 161 139 152 122 
             C143 103 134 85 127 75 
             C124 71 120 68 116 68 
             C112 68 109 71 106 75 
             C98 87 91 103 86 120 
             C82 134 80 148 83 162 
             C84 165 82 168 78 168 
             C74 168 72 164 72 160 
             C69 143 72 126 77 110 
             C84 89 94 71 107 59 
             C112 55 118 54 125 54 Z"
          fill="url(#cm-mint-grad)"
        />
        
        {/* Soft flowing central wave crossing through CM */}
        <path
          d="M86 162 
             C106 142 128 133 151 135 
             C170 137 188 147 207 156 
             C218 161 228 162 238 157 
             C232 163 223 167 213 165 
             C196 162 180 152 163 145 
             C142 137 122 140 102 153 
             C94 158 88 163 86 168 
             C85 168 85 165 86 162 Z"
          fill="#A4E4CE"
          opacity="0.95"
        />
      </g>

      {/* Layer 3: Bold Deep Teal 'C' Outer Enclosure */}
      <g filter="url(#cm-inner-glow)">
        <path
          d="M120 40 
             C94 40 70 51 52 69 
             C33 88 23 113 23 140 
             C23 168 33 192 52 211 
             C70 229 95 238 122 236 
             C146 234 167 223 182 206 
             C185 203 184 198 180 195 
             C176 193 172 194 168 198 
             C156 212 139 221 119 222 
             C97 223 77 215 62 200 
             C47 184 39 163 39 140 
             C39 117 47 96 62 80 
             C77 65 97 56 120 57 
             C136 57 151 63 163 73 
             C167 76 172 75 175 72 
             C178 68 177 63 173 59 
             C158 47 140 40 120 40 Z"
          fill="url(#cm-teal-grad)"
          transform="translate(15, -25)"
        />
      </g>

      {/* Layer 4: Deep Ocean Horizon Swirl at Base of C */}
      <path
        d="M62 162 
           C75 152 92 148 112 151 
           C134 154 154 165 176 172 
           C188 176 199 175 210 169 
           C200 176 188 179 175 177 
           C155 173 137 162 118 158 
           C99 154 82 157 68 168 
           C64 171 60 167 62 162 Z"
        fill="url(#cm-wave-teal)"
      />
    </svg>
  );

  // If variant is just icon
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // Text Wordmark
  const renderWordmark = () => {
    const isDarkAware = !lightModeOnly;
    return (
      <div className="flex flex-col justify-center leading-none select-none text-right rtl:text-right ltr:text-left">
        {/* Main Brand Title: Cool Mind */}
        <div className="flex items-baseline gap-1 tracking-tight">
          <span className={`font-black tracking-tight ${dim.textClass} ${
            isDarkAware ? 'text-slate-900 dark:text-white' : 'text-[#0B4B52]'
          }`}>
            Cool
          </span>
          <span className={`font-black tracking-tight ${dim.textClass} text-teal-600 dark:text-teal-400`}>
            Mind
          </span>
          {showArabicTagline && (
            <span className="text-[10px] sm:text-xs font-bold text-teal-700 dark:text-teal-300 mr-1.5 opacity-90 hidden sm:inline">
              كول مايند
            </span>
          )}
        </div>

        {/* Subtitle / Department description */}
        {showSubtitle && (
          <div className="mt-0.5 sm:mt-1 space-y-0.5">
            <span className={`block font-extrabold uppercase tracking-widest text-[#0E5E67] dark:text-teal-300/90 ${dim.subClass}`}>
              PSYCHIATRIC, BEHAVIORAL,
            </span>
            <span className={`block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${dim.subClass}`}>
              SOCIAL, & LIFE COACHING CENTER
            </span>
          </div>
        )}
      </div>
    );
  };

  // Full Corporate Banner Variant (matches official branding card)
  if (variant === 'full-banner') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center relative overflow-hidden ${className}`}>
        {/* Ambient subtle glow background */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo and Wordmark Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-5 relative z-10">
          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800/80 shadow-md border border-slate-200/60 dark:border-slate-700">
            {renderEmblem()}
          </div>
          <div className="text-center sm:text-left ltr:sm:text-left rtl:sm:text-right">
            <div className="text-3xl sm:text-4xl font-black text-[#0B4B52] dark:text-white tracking-tight">
              Cool<span className="text-teal-600 dark:text-teal-400">Mind</span>
            </div>
            <div className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#0E5E67] dark:text-teal-300 mt-1">
              PSYCHIATRIC, BEHAVIORAL,
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
              SOCIAL, & LIFE COACHING CENTER
            </div>
          </div>
        </div>

        {/* Bottom Official Tagline Divider */}
        <div className="w-full max-w-xl pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
          <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            INTEGRATED CENTER FOR PSYCHOLOGICAL CARE & WELLBEING
          </p>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            مركز متكامل للرعاية النفسية، الاستشارات السلوكية، التغذية العلاجية والتطوير الذاتي
          </p>
        </div>
      </div>
    );
  }

  // Vertical layout (e.g. for sidebar header or splash)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        {renderEmblem()}
        {renderWordmark()}
      </div>
    );
  }

  // Stamp badge variant
  if (variant === 'stamp') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-teal-200/80 dark:border-teal-900/60 shadow-sm ${className}`}>
        {renderEmblem()}
        <div className="text-right">
          <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
            Cool<span className="text-teal-600 dark:text-teal-400">Mind</span>
          </div>
          <div className="text-[8px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-tighter">
            Psychiatric & Wellbeing
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal layout
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 ${className}`}>
      {renderEmblem()}
      {renderWordmark()}
    </div>
  );
};
