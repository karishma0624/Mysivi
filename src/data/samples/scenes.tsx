import React from 'react';

export type SceneSvgId =
  | 'interview_freeze'
  | 'mirror_practice'
  | 'arya_call'
  | 'speaking_breakthrough';

interface SceneSvgProps {
  id: SceneSvgId;
  className?: string;
}

export const SceneSvg: React.FC<SceneSvgProps> = ({ id, className = 'w-full h-full' }) => {
  switch (id) {
    case 'interview_freeze':
      return (
        <svg
          viewBox="0 0 360 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Room Background */}
          <rect width="360" height="640" fill="#181B2C" />
          <circle cx="180" cy="180" r="140" fill="#2F5BFF" fillOpacity="0.15" />
          <circle cx="280" cy="380" r="100" fill="#7B4DFF" fillOpacity="0.1" />

          {/* Glowing Laptop Screen on Desk */}
          <rect x="50" y="380" width="260" height="170" rx="8" fill="#20263E" stroke="#374151" strokeWidth="2" />
          <rect x="62" y="392" width="236" height="130" rx="4" fill="#0E1322" />
          {/* Video call UI on laptop */}
          <circle cx="180" cy="445" r="28" fill="#313958" />
          <path d="M165 470C165 455 195 455 195 470" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <rect x="75" y="405" width="45" height="12" rx="3" fill="#EF4444" fillOpacity="0.8" />
          <text x="80" y="414" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">● LIVE HR</text>

          {/* Candidate Silhouette in foreground */}
          <circle cx="180" cy="220" r="55" fill="#2A3353" />
          <path
            d="M100 350C100 280 260 280 260 350V380H100V350Z"
            fill="#1F2844"
          />

          {/* Freeze indicator / Thought hesitation */}
          <g transform="translate(180, 130)">
            <rect x="-80" y="-20" width="160" height="34" rx="17" fill="#0B1020" fillOpacity="0.9" stroke="#6D4AFF" strokeWidth="1.5" />
            <text x="0" y="2" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              "Tell me about yourself..."
            </text>
            <circle cx="-60" cy="22" r="4" fill="#6D4AFF" />
            <circle cx="-50" cy="28" r="2" fill="#6D4AFF" />
          </g>

          {/* Subtle Panic Waveform */}
          <g transform="translate(110, 560)">
            <rect x="0" y="10" width="4" height="8" rx="2" fill="#EF4444" />
            <rect x="12" y="6" width="4" height="16" rx="2" fill="#EF4444" />
            <rect x="24" y="2" width="4" height="24" rx="2" fill="#EF4444" />
            <rect x="36" y="8" width="4" height="12" rx="2" fill="#EF4444" />
            <rect x="48" y="11" width="4" height="6" rx="2" fill="#EF4444" />
            <text x="65" y="18" fill="#F87171" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              Heart rate 130 bpm • 3s Freeze
            </text>
          </g>
        </svg>
      );

    case 'mirror_practice':
      return (
        <svg
          viewBox="0 0 360 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="360" height="640" fill="#1C1B2E" />
          <circle cx="180" cy="240" r="160" fill="#7B4DFF" fillOpacity="0.12" />

          {/* Mirror Frame */}
          <rect x="45" y="70" width="270" height="380" rx="135" fill="#24233C" stroke="#484278" strokeWidth="3" />
          <rect x="55" y="80" width="250" height="360" rx="125" fill="#141324" />

          {/* Reflection: Candidate practicing */}
          <circle cx="180" cy="200" r="50" fill="#3D3768" />
          <path d="M110 330C110 265 250 265 250 330V430H110V330Z" fill="#2D2852" />
          
          {/* Resume in hand */}
          <rect x="120" y="320" width="55" height="75" rx="4" fill="#FFFFFF" fillOpacity="0.9" transform="rotate(-10 120 320)" />
          <line x1="128" y1="335" x2="160" y2="335" stroke="#94A3B8" strokeWidth="2" />
          <line x1="128" y1="345" x2="155" y2="345" stroke="#94A3B8" strokeWidth="2" />
          <line x1="128" y1="355" x2="162" y2="355" stroke="#94A3B8" strokeWidth="2" />

          {/* Speech bubble trial */}
          <g transform="translate(180, 480)">
            <rect x="-120" y="-20" width="240" height="42" rx="12" fill="#2E2856" stroke="#6D4AFF" strokeWidth="1" />
            <text x="0" y="6" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif">
              "Actually... I am having 2 years experience..."
            </text>
            <text x="0" y="40" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">
              Translating in head • Stuttering alone
            </text>
          </g>
        </svg>
      );

    case 'arya_call':
      return (
        <svg
          viewBox="0 0 360 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Warm Purplish Background */}
          <rect width="360" height="640" fill="#151228" />
          <circle cx="180" cy="260" r="160" fill="#2F5BFF" fillOpacity="0.18" />
          <circle cx="180" cy="260" r="100" fill="#7B4DFF" fillOpacity="0.25" />

          {/* Arya Glow Avatar */}
          <circle cx="180" cy="210" r="64" fill="url(#aryaGlow)" />
          <circle cx="180" cy="210" r="58" fill="#1E193C" />
          
          {/* Friendly Stylized Avatar */}
          <circle cx="180" cy="195" r="26" fill="#F4B8A5" />
          {/* Hair */}
          <path d="M152 195C152 165 208 165 208 195C208 215 198 220 198 220C188 205 172 205 162 220C162 220 152 215 152 195Z" fill="#372620" />
          {/* Smile */}
          <path d="M174 204C176 208 184 208 186 204" stroke="#7A3D2A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="172" cy="195" r="2" fill="#372620" />
          <circle cx="188" cy="195" r="2" fill="#372620" />
          {/* Shoulders */}
          <path d="M135 260C135 235 225 235 225 260" fill="#6D4AFF" />

          {/* Teacher Tag */}
          <g transform="translate(180, 295)">
            <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#6D4AFF" />
            <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              Arya • AI Teacher
            </text>
          </g>

          {/* Active Audio Waveform */}
          <g transform="translate(90, 360)">
            <rect x="0" y="15" width="4" height="20" rx="2" fill="#2F5BFF" />
            <rect x="10" y="5" width="4" height="40" rx="2" fill="#7B4DFF" />
            <rect x="20" y="0" width="4" height="50" rx="2" fill="#6D4AFF" />
            <rect x="30" y="10" width="4" height="30" rx="2" fill="#2F5BFF" />
            <rect x="40" y="2" width="4" height="46" rx="2" fill="#7B4DFF" />
            <rect x="50" y="8" width="4" height="34" rx="2" fill="#6D4AFF" />
            <rect x="60" y="0" width="4" height="50" rx="2" fill="#2F5BFF" />
            <rect x="70" y="12" width="4" height="26" rx="2" fill="#7B4DFF" />
            <rect x="80" y="4" width="4" height="42" rx="2" fill="#6D4AFF" />
            <rect x="90" y="14" width="4" height="22" rx="2" fill="#2F5BFF" />
            <rect x="100" y="2" width="4" height="46" rx="2" fill="#7B4DFF" />
            <rect x="110" y="8" width="4" height="34" rx="2" fill="#6D4AFF" />
            <rect x="120" y="0" width="4" height="50" rx="2" fill="#2F5BFF" />
            <rect x="130" y="12" width="4" height="26" rx="2" fill="#7B4DFF" />
            <rect x="140" y="16" width="4" height="18" rx="2" fill="#6D4AFF" />
            <rect x="150" y="5" width="4" height="40" rx="2" fill="#2F5BFF" />
            <rect x="160" y="12" width="4" height="26" rx="2" fill="#7B4DFF" />
            <rect x="170" y="18" width="4" height="14" rx="2" fill="#6D4AFF" />
          </g>

          {/* Supportive Spoken Feedback */}
          <g transform="translate(180, 470)">
            <rect x="-135" y="-24" width="270" height="52" rx="16" fill="#1C1938" stroke="#2F5BFF" strokeWidth="1.5" />
            <text x="0" y="-4" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              "Great start! Instead of 'I am having',"
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#A5B4FC" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              "try: 'I have 2 years of experience.' Say it with me!"
            </text>
          </g>

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="aryaGlow" x1="120" y1="150" x2="240" y2="270" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F5BFF" />
              <stop offset="1" stopColor="#7B4DFF" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'speaking_breakthrough':
      return (
        <svg
          viewBox="0 0 360 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="360" height="640" fill="#0E1726" />
          <circle cx="180" cy="220" r="150" fill="#12A36B" fillOpacity="0.12" />
          <circle cx="260" cy="180" r="90" fill="#2F5BFF" fillOpacity="0.15" />

          {/* Modern Corporate Glass Office Background */}
          <line x1="40" y1="0" x2="40" y2="450" stroke="#1E293B" strokeWidth="2" />
          <line x1="320" y1="0" x2="320" y2="450" stroke="#1E293B" strokeWidth="2" />
          <line x1="0" y1="280" x2="360" y2="280" stroke="#1E293B" strokeWidth="1" />

          {/* Confident Speaker Profile */}
          <circle cx="180" cy="180" r="55" fill="#1E293B" stroke="#12A36B" strokeWidth="3" />
          <circle cx="180" cy="170" r="28" fill="#F4B8A5" />
          <path d="M155 165C155 140 205 140 205 165C205 180 180 185 180 185C180 185 155 180 155 165Z" fill="#1E293B" />
          <path d="M173 178C176 182 184 182 187 178" stroke="#7A3D2A" strokeWidth="2" strokeLinecap="round" />
          <path d="M130 260C130 225 230 225 230 260" fill="#2F5BFF" />

          {/* Confidence Badge */}
          <g transform="translate(180, 260)">
            <rect x="-80" y="-14" width="160" height="28" rx="14" fill="#12A36B" />
            <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              ✓ Fluency Score 92/100
            </text>
          </g>

          {/* Final Punch Call to Action */}
          <g transform="translate(180, 360)">
            <rect x="-140" y="-25" width="280" height="110" rx="16" fill="#1E2438" stroke="#4338CA" strokeWidth="1" />
            <text x="0" y="-2" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="sans-serif">
              OFFER LETTER READY
            </text>
            <text x="0" y="20" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif">
              "I confidently answered every round."
            </text>
            
            <rect x="-100" y="40" width="200" height="34" rx="17" fill="url(#ctaGrad)" />
            <text x="0" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              Download MySivi App
            </text>
          </g>

          <defs>
            <linearGradient id="ctaGrad" x1="-100" y1="40" x2="100" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F5BFF" />
              <stop offset="1" stopColor="#7B4DFF" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
