import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Scene,
  Setting,
  TimeOfDay,
  Mood,
  SubjectWho,
  SubjectAction,
  SubjectExpression,
  Prop,
  Palette,
  ScriptBeat,
  StoryboardFrame,
} from '@shared/types';
import { sceneSanity } from '@shared/sceneSanity';

export interface SceneComposerProps {
  scene?: Scene;
  beatIndex?: number;
  beat?: ScriptBeat;
  frame?: StoryboardFrame;
  scenarioHint?: string;
  isPlaying?: boolean;
  className?: string;
  showLabel?: boolean;
  isAiGenerated?: boolean;
  imageUrl?: string | null;
}

/**
 * Palette color token mapping
 */
const PALETTES: Record<Palette, {
  bgGradient: [string, string, string];
  ambientOverlay: string;
  accent: string;
  floor: string;
  wall: string;
}> = {
  warm_anxious: {
    bgGradient: ['#1A162B', '#2D1B36', '#4A1D38'],
    ambientOverlay: 'rgba(239, 68, 68, 0.08)',
    accent: '#F43F5E',
    floor: '#1E1528',
    wall: '#281E38',
  },
  cool_corporate: {
    bgGradient: ['#0E172A', '#1E293B', '#334155'],
    ambientOverlay: 'rgba(59, 130, 246, 0.08)',
    accent: '#38BDF8',
    floor: '#0F172A',
    wall: '#1E293B',
  },
  hopeful_lavender: {
    bgGradient: ['#1E1638', '#2D2054', '#442B7D'],
    ambientOverlay: 'rgba(167, 139, 250, 0.14)',
    accent: '#A78BFA',
    floor: '#191330',
    wall: '#261B45',
  },
  bold_success: {
    bgGradient: ['#0D2520', '#133D35', '#1B564B'],
    ambientOverlay: 'rgba(52, 211, 153, 0.12)',
    accent: '#34D399',
    floor: '#0B1E1A',
    wall: '#133830',
  },
};

/**
 * Lighting overlays per time of day
 */
const TIME_LIGHTING: Record<TimeOfDay, {
  skyGradient: [string, string];
  sunColor: string;
  windowLight: string;
  ambientTint: string;
}> = {
  morning: {
    skyGradient: ['#FDE68A', '#93C5FD'],
    sunColor: '#FEF08A',
    windowLight: 'rgba(254, 240, 138, 0.25)',
    ambientTint: 'rgba(253, 230, 138, 0.08)',
  },
  afternoon: {
    skyGradient: ['#60A5FA', '#E0F2FE'],
    sunColor: '#FFFFFF',
    windowLight: 'rgba(255, 255, 255, 0.22)',
    ambientTint: 'rgba(255, 255, 255, 0.05)',
  },
  evening: {
    skyGradient: ['#F97316', '#7C3AED'],
    sunColor: '#FB923C',
    windowLight: 'rgba(249, 115, 22, 0.28)',
    ambientTint: 'rgba(249, 115, 22, 0.12)',
  },
  night: {
    skyGradient: ['#050814', '#1E1B4B'],
    sunColor: '#E2E8F0',
    windowLight: 'rgba(129, 140, 248, 0.15)',
    ambientTint: 'rgba(15, 23, 42, 0.25)',
  },
};

/**
 * 11 Rich Setting Backgrounds
 */
const SettingBackground: React.FC<{ setting: Setting; timeOfDay: TimeOfDay; palette: Palette }> = ({
  setting,
  timeOfDay,
  palette,
}) => {
  const p = PALETTES[palette] || PALETTES.warm_anxious;
  const t = TIME_LIGHTING[timeOfDay] || TIME_LIGHTING.morning;

  const content = (() => {
    switch (setting) {
    case 'classroom_pta':
      return (
        <g id="setting-classroom-pta">
          {/* Wall */}
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          {/* Floor */}
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />
          {/* Floor planks perspective lines */}
          <line x1="0" y1="640" x2="120" y2="440" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <line x1="180" y1="640" x2="180" y2="440" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <line x1="360" y1="640" x2="240" y2="440" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

          {/* Classroom Blackboard */}
          <rect x="30" y="70" width="300" height="150" rx="8" fill="#14261C" stroke="#8D6E63" strokeWidth="6" />
          {/* Chalkboard content */}
          <text x="50" y="110" fill="#E2E8F0" fontSize="13" fontFamily="monospace" fontWeight="bold">
            ANNUAL P.T.A. MEETING
          </text>
          <text x="50" y="135" fill="#A7F3D0" fontSize="10" fontFamily="sans-serif">
            Class IV-B • Term Report Card
          </text>
          <line x1="50" y1="145" x2="290" y2="145" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 3" />
          <text x="50" y="170" fill="#FCD34D" fontSize="10" fontFamily="sans-serif">
            Teacher Notes: English Speaking & Reading
          </text>
          {/* Chalk ledge */}
          <rect x="25" y="220" width="310" height="6" rx="2" fill="#6D4C41" />
          <rect x="80" y="217" width="16" height="4" rx="1" fill="#FFFFFF" opacity="0.9" />
          <rect x="105" y="217" width="12" height="4" rx="1" fill="#FDE047" opacity="0.9" />

          {/* Teacher's Desk */}
          <rect x="230" y="380" width="115" height="75" rx="4" fill="#4E342E" stroke="#3E2723" strokeWidth="2" />
          <rect x="225" y="375" width="125" height="10" rx="2" fill="#5D4037" />
          {/* Student Books Stack on desk */}
          <rect x="245" y="360" width="35" height="7" rx="1" fill="#EF4444" />
          <rect x="243" y="352" width="37" height="7" rx="1" fill="#3B82F6" />
          <rect x="246" y="344" width="33" height="7" rx="1" fill="#10B981" />
          {/* Pen Stand */}
          <rect x="295" y="355" width="14" height="20" rx="2" fill="#94A3B8" />
          <line x1="299" y1="355" x2="296" y2="343" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="304" y1="355" x2="306" y2="340" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

          {/* School window with daylight */}
          <rect x="15" y="240" width="70" height="90" rx="4" fill="url(#window-sky)" stroke="#78716C" strokeWidth="3" />
          <line x1="50" y1="240" x2="50" y2="330" stroke="#78716C" strokeWidth="2" />
          <line x1="15" y1="285" x2="85" y2="285" stroke="#78716C" strokeWidth="2" />
        </g>
      );

    case 'office_interview':
      return (
        <g id="setting-office-interview">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Big City Glass Wall Window */}
          <rect x="30" y="40" width="300" height="280" rx="6" fill="#0B132B" stroke="#475569" strokeWidth="3" />
          {/* Skyline buildings */}
          <rect x="50" y="160" width="45" height="158" fill="#1C2541" />
          <rect x="105" y="110" width="60" height="208" fill="#1E293B" />
          <rect x="175" y="140" width="50" height="178" fill="#1A2238" />
          <rect x="235" y="90" width="75" height="228" fill="#1E293B" />
          {/* Lit windows in buildings */}
          {[125, 145, 165, 185, 205].map((y, i) => (
            <g key={i}>
              <rect x="115" y={y} width="12" height="8" rx="1" fill="#FDE047" opacity="0.75" />
              <rect x="140" y={y} width="12" height="8" rx="1" fill="#FDE047" opacity="0.65" />
              <rect x="250" y={y - 20} width="14" height="8" rx="1" fill="#60A5FA" opacity="0.7" />
              <rect x="280" y={y - 20} width="14" height="8" rx="1" fill="#FDE047" opacity="0.8" />
            </g>
          ))}
          {/* Glass Mullions */}
          <line x1="180" y1="40" x2="180" y2="320" stroke="#475569" strokeWidth="2.5" />
          <line x1="30" y1="180" x2="330" y2="180" stroke="#475569" strokeWidth="2" />

          {/* Corporate Glass Conference / Interview Desk */}
          <polygon points="20,440 340,440 310,380 50,380" fill="#1E293B" opacity="0.9" stroke="#64748B" strokeWidth="2" />
          {/* Glass reflection beam */}
          <polygon points="80,440 140,440 190,380 150,380" fill="white" opacity="0.08" />

          {/* Interviewer Corporate Laptop */}
          <polygon points="70,395 120,395 115,385 75,385" fill="#94A3B8" />
          <rect x="75" y="360" width="40" height="25" rx="2" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="80" y="365" width="30" height="15" rx="1" fill="#38BDF8" opacity="0.7" />

          {/* Candidate Water Glass */}
          <rect x="255" y="375" width="12" height="18" rx="2" fill="#E2E8F0" opacity="0.4" stroke="#94A3B8" strokeWidth="1" />
        </g>
      );

    case 'cafe':
      return (
        <g id="setting-cafe">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Warm Brick Texture Accent */}
          {[60, 100, 140, 180].map((y) => (
            <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
          ))}

          {/* Cafe Blackboard Menu Board */}
          <rect x="35" y="60" width="130" height="160" rx="6" fill="#1E293B" stroke="#B45309" strokeWidth="4" />
          <text x="50" y="90" fill="#FBBF24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">COFFEE BAR</text>
          <text x="50" y="115" fill="#E2E8F0" fontSize="9">Espresso ...... ₹180</text>
          <text x="50" y="135" fill="#E2E8F0" fontSize="9">Cappuccino .. ₹220</text>
          <text x="50" y="155" fill="#E2E8F0" fontSize="9">Oat Latte ...... ₹260</text>
          <text x="50" y="175" fill="#E2E8F0" fontSize="9">Cold Brew .... ₹240</text>

          {/* Hanging Edison Lamp */}
          <line x1="260" y1="0" x2="260" y2="100" stroke="#475569" strokeWidth="2" />
          <circle cx="260" cy="115" r="14" fill="#FDE047" opacity="0.85" />
          <circle cx="260" cy="115" r="30" fill="#FDE047" opacity="0.18" />

          {/* Barista Counter */}
          <rect x="190" y="240" width="170" height="180" fill="#3E2723" stroke="#271815" strokeWidth="2" />
          {/* Espresso Machine */}
          <rect x="215" y="200" width="70" height="42" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="225" y="210" width="22" height="14" rx="1" fill="#0F172A" />
          <circle cx="270" cy="218" r="5" fill="#DC2626" />
          {/* Steam from coffee */}
          <path d="M235 195 Q232 185 237 175" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Cafe Table */}
          <polygon points="20,480 200,480 180,410 40,410" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
        </g>
      );

    case 'conference_room':
      return (
        <g id="setting-conference-room">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Presentation Screen / Whiteboard */}
          <rect x="40" y="50" width="280" height="160" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" />
          <rect x="55" y="70" width="70" height="35" rx="3" fill="#EEF2F6" stroke="#6D4AFF" strokeWidth="1.5" />
          <text x="65" y="92" fill="#6D4AFF" fontSize="10" fontWeight="bold">Sprint 24</text>
          {/* Bar Chart on whiteboard */}
          <rect x="150" y="130" width="18" height="40" fill="#6D4AFF" rx="2" />
          <rect x="180" y="110" width="18" height="60" fill="#10B981" rx="2" />
          <rect x="210" y="90" width="18" height="80" fill="#F59E0B" rx="2" />
          <rect x="240" y="75" width="18" height="95" fill="#3B82F6" rx="2" />

          {/* Big Modern Boardroom Table */}
          <polygon points="10,480 350,480 300,370 60,370" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          {/* Ergonomic Office Chairs */}
          <rect x="25" y="340" width="30" height="45" rx="6" fill="#334155" />
          <rect x="305" y="340" width="30" height="45" rx="6" fill="#334155" />
        </g>
      );

    case 'college_campus':
      return (
        <g id="setting-college-campus">
          {/* Outdoor Sky */}
          <rect x="0" y="0" width="360" height="420" fill="url(#window-sky)" />
          {/* Lawn / Grass Ground */}
          <rect x="0" y="420" width="360" height="220" fill="#1E3A2F" />

          {/* University Campus Classical Columns */}
          <rect x="40" y="100" width="280" height="30" fill="#94A3B8" />
          <polygon points="30,100 180,40 330,100" fill="#64748B" />
          <text x="130" y="85" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="serif">UNIVERSITY</text>
          {[60, 110, 160, 210, 260].map((x) => (
            <rect key={x} x={x} y="130" width="22" height="190" fill="#E2E8F0" rx="2" />
          ))}

          {/* Green Tree Foliage */}
          <circle cx="30" cy="280" r="60" fill="#166534" opacity="0.85" />
          <circle cx="70" cy="240" r="45" fill="#15803D" opacity="0.9" />
          <rect x="25" y="280" width="16" height="140" fill="#78350F" />

          {/* Campus Bench */}
          <rect x="230" y="380" width="90" height="8" rx="2" fill="#92400E" />
          <rect x="235" y="388" width="6" height="35" fill="#451A03" />
          <rect x="309" y="388" width="6" height="35" fill="#451A03" />
        </g>
      );

    case 'bus_stop':
      return (
        <g id="setting-bus-stop">
          {/* City Street Background */}
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          {/* Road Curb & Pavement */}
          <rect x="0" y="440" width="360" height="60" fill="#475569" />
          <rect x="0" y="500" width="360" height="140" fill="#1E293B" />
          {/* Yellow Road Stripe */}
          <line x1="0" y1="560" x2="360" y2="560" stroke="#FBBF24" strokeWidth="6" strokeDasharray="25 15" />

          {/* Bus Stop Glass Shelter */}
          <polygon points="50,140 310,140 280,180 80,180" fill="#334155" />
          <rect x="65" y="180" width="10" height="260" fill="#64748B" />
          <rect x="285" y="180" width="10" height="260" fill="#64748B" />
          <rect x="75" y="180" width="210" height="230" fill="rgba(56, 189, 248, 0.12)" stroke="#64748B" strokeWidth="2" />

          {/* Bus Stop Sign Board */}
          <rect x="25" y="120" width="40" height="55" rx="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
          <text x="35" y="145" fill="#FFFFFF" fontSize="18" fontWeight="bold">BUS</text>
          <text x="31" y="162" fill="#FDE047" fontSize="9" fontWeight="bold">STOP</text>
          <rect x="42" y="175" width="6" height="265" fill="#64748B" />

          {/* Shelter Bench */}
          <rect x="110" y="380" width="140" height="10" rx="3" fill="#B45309" />
          <rect x="125" y="390" width="6" height="50" fill="#78350F" />
          <rect x="230" y="390" width="6" height="50" fill="#78350F" />
        </g>
      );

    case 'bedroom_study':
      return (
        <g id="setting-bedroom-study">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Cozy Bedroom Bookshelf */}
          <rect x="230" y="80" width="110" height="240" rx="4" fill="#451A03" stroke="#2A0E02" strokeWidth="3" />
          {[130, 190, 250].map((shelfY, i) => (
            <g key={i}>
              <line x1="230" y1={shelfY} x2="340" y2={shelfY} stroke="#78350F" strokeWidth="4" />
              <rect x="240" y={shelfY - 35} width="14" height="35" fill="#DC2626" rx="1" />
              <rect x="256" y={shelfY - 40} width="16" height="40" fill="#2563EB" rx="1" />
              <rect x="274" y={shelfY - 30} width="12" height="30" fill="#16A34A" rx="1" />
              <rect x="288" y={shelfY - 36} width="18" height="36" fill="#D97706" rx="1" />
            </g>
          ))}

          {/* Study Desk Mirror */}
          <ellipse cx="110" cy="180" rx="65" ry="85" fill="#1E293B" stroke="#D97706" strokeWidth="5" />
          <ellipse cx="110" cy="180" rx="55" ry="75" fill="rgba(147, 197, 253, 0.15)" />

          {/* Study Table */}
          <rect x="30" y="370" width="220" height="70" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          {/* Desk Lamp */}
          <polygon points="60,370 75,320 85,320 80,370" fill="#E2E8F0" />
          <path d="M60 320 L100 320 L90 295 L70 295 Z" fill="#F59E0B" />
          <circle cx="80" cy="325" r="25" fill="#FEF08A" opacity="0.3" />
        </g>
      );

    case 'metro_train':
      return (
        <g id="setting-metro-train">
          <rect x="0" y="0" width="360" height="640" fill="#1E293B" />
          {/* Metro Ceiling & Fluorescent Lights */}
          <rect x="0" y="0" width="360" height="70" fill="#334155" />
          <rect x="40" y="30" width="280" height="12" rx="4" fill="#F8FAFC" opacity="0.9" />

          {/* Overhead grab handrails */}
          <line x1="30" y1="70" x2="330" y2="70" stroke="#94A3B8" strokeWidth="4" />
          {[70, 140, 210, 280].map((hx) => (
            <g key={hx}>
              <line x1={hx} y1="70" x2={hx} y2="120" stroke="#94A3B8" strokeWidth="3" />
              <circle cx={hx} cy="130" r="12" fill="none" stroke="#F59E0B" strokeWidth="4" />
            </g>
          ))}

          {/* Train Window with passing tunnel light streaks */}
          <rect x="45" y="160" width="270" height="190" rx="16" fill="#090D16" stroke="#64748B" strokeWidth="4" />
          <line x1="60" y1="210" x2="290" y2="210" stroke="#FDE047" strokeWidth="2" opacity="0.6" />
          <line x1="80" y1="250" x2="300" y2="250" stroke="#60A5FA" strokeWidth="3" opacity="0.5" />
          <line x1="55" y1="290" x2="260" y2="290" stroke="#F43F5E" strokeWidth="2" opacity="0.7" />

          {/* Metro Seat Base */}
          <rect x="30" y="420" width="300" height="60" rx="8" fill="#2563EB" />
          <rect x="30" y="480" width="300" height="160" fill="#1E3A8A" />
        </g>
      );

    case 'living_room':
      return (
        <g id="setting-living-room">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Large Living Room Window */}
          <rect x="40" y="50" width="160" height="180" rx="6" fill="url(#window-sky)" stroke="#78716C" strokeWidth="3" />
          {/* Wall Photo Frame */}
          <rect x="235" y="70" width="85" height="105" rx="4" fill="#3B82F6" stroke="#D97706" strokeWidth="4" />
          <circle cx="277" cy="115" r="16" fill="#FDE047" />

          {/* Large Potted Indoor Monstera Plant */}
          <circle cx="45" cy="380" r="30" fill="#15803D" />
          <circle cx="70" cy="350" r="35" fill="#166534" />
          <circle cx="85" cy="390" r="28" fill="#14532D" />
          <polygon points="40,440 85,440 80,395 45,395" fill="#B45309" />

          {/* Comfy Living Room Sofa / Couch */}
          <rect x="110" y="360" width="220" height="90" rx="14" fill="#4338CA" stroke="#312E81" strokeWidth="3" />
          <rect x="125" y="375" width="85" height="60" rx="8" fill="#4F46E5" />
          <rect x="225" y="375" width="85" height="60" rx="8" fill="#4F46E5" />
          {/* Cushions */}
          <rect x="135" y="365" width="35" height="35" rx="6" fill="#F59E0B" transform="rotate(-8 135 365)" />
        </g>
      );

    case 'dinner_table':
      return (
        <g id="setting-dinner-table">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill={p.floor} />

          {/* Overhead Dining Pendant Chandelier */}
          <line x1="180" y1="0" x2="180" y2="90" stroke="#78716C" strokeWidth="2.5" />
          <path d="M140 120 Q180 80 220 120 Z" fill="#D97706" />
          <circle cx="180" cy="130" r="16" fill="#FEF08A" opacity="0.9" />
          <circle cx="180" cy="130" r="50" fill="#FEF08A" opacity="0.15" />

          {/* Dining Table */}
          <ellipse cx="180" cy="450" rx="160" ry="60" fill="#5D4037" stroke="#3E2723" strokeWidth="3" />
          {/* Table Runner & Plates */}
          <ellipse cx="180" cy="450" rx="130" ry="35" fill="#8D6E63" />
          {[100, 180, 260].map((px) => (
            <g key={px}>
              <ellipse cx={px} cy={450} rx="22" ry="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <ellipse cx={px} cy={450} rx="14" ry="7" fill="#F1F5F9" />
            </g>
          ))}
        </g>
      );

    case 'street_market':
      return (
        <g id="setting-street-market">
          <rect x="0" y="0" width="360" height="440" fill={p.wall} />
          <rect x="0" y="440" width="360" height="200" fill="#334155" />

          {/* Striped Market Canopies */}
          <polygon points="10,130 180,130 160,70 30,70" fill="#DC2626" />
          <polygon points="50,130 90,130 80,70 40,70" fill="#FFFFFF" />
          <polygon points="130,130 170,130 150,70 110,70" fill="#FFFFFF" />

          <polygon points="180,130 350,130 330,70 200,70" fill="#2563EB" />
          <polygon points="220,130 260,130 250,70 210,70" fill="#FFFFFF" />
          <polygon points="300,130 340,130 320,70 280,70" fill="#FFFFFF" />

          {/* Hanging string festival lights */}
          <path d="M20 140 Q180 180 340 140" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          {[60, 120, 180, 240, 300].map((lx) => (
            <circle key={lx} cx={lx} cy={140 + Math.sin(lx * 0.02) * 15} r="5" fill="#FDE047" />
          ))}

          {/* Fruit / Vegetable Baskets */}
          <ellipse cx="80" cy="420" rx="35" ry="18" fill="#B45309" />
          <circle cx="70" cy="410" r="8" fill="#EF4444" />
          <circle cx="85" cy="412" r="8" fill="#F59E0B" />
          <circle cx="95" cy="410" r="7" fill="#10B981" />

          <ellipse cx="280" cy="420" rx="35" ry="18" fill="#B45309" />
          <circle cx="270" cy="410" r="8" fill="#8B5CF6" />
          <circle cx="285" cy="412" r="8" fill="#EAB308" />
        </g>
      );

        default:
          return (
            <g id="setting-default">
              <rect x="0" y="0" width="360" height="640" fill={p.wall} />
            </g>
          );
      }
    })();

    return (
      <g id={`setting-${setting}`}>
        {content}
        <rect x="0" y="0" width="360" height="640" fill={t.ambientTint} pointerEvents="none" />
      </g>
    );
  };

/**
 * 10 Stylized Character Archetypes with 6 Poses and 5 Expressions
 */
const StylizedCharacter: React.FC<{
  who: SubjectWho;
  action: SubjectAction;
  expression: SubjectExpression;
  props: Prop[];
}> = ({ who, action, expression, props }) => {
  if (who === 'none') return null;

  const isArya = who === 'arya_avatar';

  // Skin tone & hair tones (Warm Indian palette)
  const skinTone = isArya ? '#EDE9FE' : '#D99B77';
  const hairTone = isArya ? '#6D4AFF' : '#1F1B24';

  // Clothing color mapping
  const clothingColor = useMemo(() => {
    switch (who) {
      case 'mother':
        return { primary: '#BE185D', secondary: '#F472B6' }; // Deep magenta saree
      case 'father':
        return { primary: '#1E3A8A', secondary: '#60A5FA' }; // Formal blue
      case 'student_f':
        return { primary: '#7C3AED', secondary: '#C4B5FD' }; // Violet hoodie
      case 'student_m':
        return { primary: '#0284C7', secondary: '#38BDF8' }; // Casual sky blue
      case 'professional_f':
        return { primary: '#312E81', secondary: '#A5B4FC' }; // Indigo corporate blazer
      case 'professional_m':
        return { primary: '#1E293B', secondary: '#94A3B8' }; // Charcoal suit
      case 'arya_avatar':
        return { primary: '#6D4AFF', secondary: '#C084FC' }; // Brand purple
      case 'young_man':
        return { primary: '#0D9488', secondary: '#2DD4BF' }; // Teal
      case 'young_woman':
      default:
        return { primary: '#6D4AFF', secondary: '#F472B6' }; // Lavender & coral
    }
  }, [who]);

  // Head center coords
  const headX = 180;
  const headY = 270;

  // Arms position based on action
  const renderArms = () => {
    switch (action) {
      case 'freezing':
        return (
          <g id="arms-freezing">
            {/* Rigid tense arms glued to torso */}
            <path d="M140 330 Q130 380 135 430" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M220 330 Q230 380 225 430" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="135" cy="435" r="10" fill={skinTone} />
            <circle cx="225" cy="435" r="10" fill={skinTone} />
          </g>
        );

      case 'looking_down':
        return (
          <g id="arms-looking-down">
            {/* Hands folded together nervously */}
            <path d="M140 330 Q150 400 170 425" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M220 330 Q210 400 190 425" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <ellipse cx="180" cy="428" rx="14" ry="10" fill={skinTone} />
          </g>
        );

      case 'speaking_confidently':
        return (
          <g id="arms-speaking-confidently">
            {/* One hand open gesture forward */}
            <path d="M140 330 Q120 380 105 400" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M220 330 Q250 360 265 375" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="105" cy="405" r="10" fill={skinTone} />
            {/* Open gesture hand */}
            <circle cx="268" cy="375" r="11" fill={skinTone} />
          </g>
        );

      case 'holding_phone':
        return (
          <g id="arms-holding-phone">
            {/* Left arm down */}
            <path d="M140 330 Q125 380 120 420" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="120" cy="425" r="10" fill={skinTone} />
            {/* Right arm bent holding smartphone */}
            <path d="M220 330 Q245 380 220 400" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="220" cy="400" r="10" fill={skinTone} />
          </g>
        );

      case 'sipping_coffee':
        return (
          <g id="arms-sipping-coffee">
            <path d="M140 330 Q125 380 120 420" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="120" cy="425" r="10" fill={skinTone} />
            {/* Right arm up holding cup to mouth */}
            <path d="M220 330 Q250 350 205 315" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="202" cy="315" r="10" fill={skinTone} />
          </g>
        );

      case 'presenting':
      default:
        return (
          <g id="arms-presenting">
            {/* Arm pointing towards board */}
            <path d="M140 330 Q110 320 85 300" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="82" cy="298" r="11" fill={skinTone} />
            <path d="M220 330 Q235 380 230 420" stroke={clothingColor.primary} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="230" cy="425" r="10" fill={skinTone} />
          </g>
        );
    }
  };

  // Facial expression rendering
  const renderFace = () => {
    switch (expression) {
      case 'worried':
        return (
          <g id="face-worried">
            {/* Furrowed eyebrows */}
            <line x1="165" y1="260" x2="175" y2="264" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="195" y1="264" x2="185" y2="260" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wide anxious eyes */}
            <ellipse cx="170" cy="270" rx="4" ry="5" fill="#1F1B24" />
            <ellipse cx="190" cy="270" rx="4" ry="5" fill="#1F1B24" />
            {/* Nervous wavy mouth */}
            <path d="M172 288 Q180 285 188 288" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Nervous blue sweat drop */}
            <path d="M198 256 Q201 250 203 256 Q205 261 201 262 Q197 261 198 256 Z" fill="#38BDF8" />
          </g>
        );

      case 'awkward_smile':
        return (
          <g id="face-awkward-smile">
            <line x1="166" y1="262" x2="175" y2="262" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="262" x2="194" y2="262" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <circle cx="170" cy="270" r="3.5" fill="#1F1B24" />
            <circle cx="190" cy="270" r="3.5" fill="#1F1B24" />
            {/* Half-smile grin */}
            <path d="M174 287 Q182 291 190 285" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'smiling':
        return (
          <g id="face-smiling">
            {/* Arched friendly happy eyes */}
            <path d="M166 268 Q171 264 176 268" stroke="#1F1B24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M184 268 Q189 264 194 268" stroke="#1F1B24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Warm smile */}
            <path d="M170 282 Q180 294 190 282" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />
          </g>
        );

      case 'confident':
        return (
          <g id="face-confident">
            <line x1="165" y1="262" x2="175" y2="260" stroke="#1F1B24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="185" y1="260" x2="195" y2="262" stroke="#1F1B24" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="170" cy="269" r="4" fill="#1F1B24" />
            <circle cx="190" cy="269" r="4" fill="#1F1B24" />
            {/* Confident smile */}
            <path d="M170 282 Q180 293 190 282" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />
            {/* Sparkle spark */}
            <polygon points="198,258 202,255 200,260 204,262 199,261 198,265" fill="#FDE047" />
          </g>
        );

      case 'neutral':
      default:
        return (
          <g id="face-neutral">
            <line x1="166" y1="262" x2="175" y2="262" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="262" x2="194" y2="262" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <circle cx="170" cy="270" r="3.5" fill="#1F1B24" />
            <circle cx="190" cy="270" r="3.5" fill="#1F1B24" />
            <line x1="174" y1="287" x2="186" y2="287" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
    }
  };

  // Props rendering
  const renderProps = () => {
    return props.map((prop, idx) => {
      switch (prop) {
        case 'phone_with_mysivi':
          return (
            <g key={idx} id="prop-phone" transform="translate(205, 370)">
              {/* Smartphone Frame */}
              <rect x="0" y="0" width="30" height="52" rx="6" fill="#0B1020" stroke="#A78BFA" strokeWidth="2" />
              {/* Glowing screen with waveform */}
              <rect x="3" y="5" width="24" height="42" rx="3" fill="#1E1638" />
              <circle cx="15" cy="16" r="6" fill="#6D4AFF" />
              {/* Waveform bars on screen */}
              <line x1="7" y1="34" x2="7" y2="38" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="31" x2="11" y2="41" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="28" x2="15" y2="44" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
              <line x1="19" y1="32" x2="19" y2="40" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
              <line x1="23" y1="35" x2="23" y2="37" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            </g>
          );

        case 'coffee_cup':
          return (
            <g key={idx} id="prop-coffee" transform="translate(195, 298)">
              <rect x="0" y="0" width="18" height="22" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
              <path d="M18 5 C23 5 23 15 18 15" stroke="#64748B" strokeWidth="2" fill="none" />
              {/* Warm coffee steam */}
              <path d="M5 -4 Q8 -10 6 -16" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M12 -4 Q15 -10 13 -16" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          );

        case 'resume_folder':
          return (
            <g key={idx} id="prop-resume" transform="translate(155, 410)">
              <rect x="0" y="0" width="45" height="32" rx="3" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1.5" />
              {/* White resume paper peeking */}
              <rect x="4" y="-8" width="37" height="20" rx="1" fill="#FFFFFF" />
              <line x1="8" y1="-3" x2="28" y2="-3" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="8" y1="2" x2="35" y2="2" stroke="#94A3B8" strokeWidth="1.5" />
            </g>
          );

        case 'laptop':
          return (
            <g key={idx} id="prop-laptop" transform="translate(150, 420)">
              <polygon points="0,20 60,20 54,12 6,12" fill="#94A3B8" />
              <rect x="10" y="-12" width="40" height="24" rx="2" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="13" y="-9" width="34" height="18" rx="1" fill="#38BDF8" opacity="0.85" />
            </g>
          );

        case 'notebook':
          return (
            <g key={idx} id="prop-notebook" transform="translate(158, 415)">
              <rect x="0" y="0" width="36" height="26" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="26" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          );

        case 'none':
        default:
          return null;
      }
    });
  };

  return (
    <g id={`character-${who}`}>
      {/* Arya Aura Glow */}
      {isArya && (
        <circle cx={headX} cy={headY} r="70" fill="url(#arya-halo-glow)" opacity="0.8" />
      )}

      {/* Body / Torso */}
      <path
        d="M135 320 Q180 305 225 320 L235 480 Q180 490 125 480 Z"
        fill={clothingColor.primary}
      />
      {/* Collar / Neckline Accent */}
      <polygon points="165,315 195,315 180,340" fill={clothingColor.secondary} />

      {/* Arms */}
      {renderArms()}

      {/* Neck */}
      <rect x="172" y="295" width="16" height="22" rx="3" fill={skinTone} />

      {/* Head Base */}
      <ellipse cx={headX} cy={headY} rx="28" ry="32" fill={skinTone} />

      {/* Mother's Bindi */}
      {who === 'mother' && (
        <circle cx={headX} cy={headY - 14} r="2.5" fill="#BE185D" />
      )}

      {/* Hair Styles */}
      {isArya ? (
        <g id="hair-arya">
          {/* Sleek lavender hairstyle */}
          <path d="M152 265 Q180 220 208 265 Q215 285 208 300 Q180 235 152 300 Z" fill={hairTone} />
          {/* Headset for Arya voice tutor */}
          <path d="M150 270 Q180 230 210 270" stroke="#A78BFA" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="146" y="265" width="8" height="15" rx="3" fill="#6D4AFF" stroke="#DDD8F5" strokeWidth="1" />
          <rect x="206" y="265" width="8" height="15" rx="3" fill="#6D4AFF" stroke="#DDD8F5" strokeWidth="1" />
          {/* Mini mic boom */}
          <path d="M150 275 Q160 295 172 292" stroke="#6D4AFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="173" cy="292" r="2.5" fill="#34D399" />
        </g>
      ) : who === 'mother' || who === 'young_woman' || who === 'student_f' || who === 'professional_f' ? (
        <g id="hair-female">
          <path d="M150 270 Q180 225 210 270 Q218 310 212 335 Q180 240 148 335 Z" fill={hairTone} />
        </g>
      ) : (
        <g id="hair-male">
          <path d="M152 265 Q180 228 208 265 Q212 250 180 235 Q148 250 152 265 Z" fill={hairTone} />
        </g>
      )}

      {/* Facial Features */}
      {renderFace()}

      {/* Props */}
      {renderProps()}
    </g>
  );
};

/**
 * Mood Effect Overlay
 */
const MoodEffect: React.FC<{ mood: Mood }> = ({ mood }) => {
  switch (mood) {
    case 'anxious':
      return (
        <g id="mood-anxious" opacity="0.6">
          <path d="M40 80 Q55 70 70 80 T100 80" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeDasharray="4 3" />
          <path d="M260 80 Q275 70 290 80 T320 80" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeDasharray="4 3" />
        </g>
      );

    case 'hesitant':
      return (
        <g id="mood-hesitant" opacity="0.7">
          <circle cx="215" cy="215" r="4" fill="#CBD5E1" />
          <circle cx="225" cy="205" r="6" fill="#CBD5E1" />
          <circle cx="240" cy="190" r="9" fill="#E2E8F0" />
          <text x="236" y="194" fill="#64748B" fontSize="10" fontWeight="bold">?</text>
        </g>
      );

    case 'hopeful':
      return (
        <g id="mood-hopeful">
          {[
            { cx: 70, cy: 120, r: 3 },
            { cx: 290, cy: 110, r: 4 },
            { cx: 60, cy: 260, r: 3 },
            { cx: 310, cy: 240, r: 4 },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={s.cx} cy={s.cy} r={s.r} fill="#C084FC" />
              <circle cx={s.cx} cy={s.cy} r={s.r * 2.5} fill="#C084FC" opacity="0.25" />
            </g>
          ))}
        </g>
      );

    case 'confident':
    case 'joyful':
      return (
        <g id="mood-confident">
          {[
            { cx: 80, cy: 100 },
            { cx: 280, cy: 95 },
            { cx: 50, cy: 200 },
            { cx: 310, cy: 190 },
          ].map((pt, i) => (
            <g key={i}>
              <polygon
                points={`${pt.cx},${pt.cy - 7} ${pt.cx + 2},${pt.cy - 2} ${pt.cx + 7},${pt.cy} ${pt.cx + 2},${pt.cy + 2} ${pt.cx},${pt.cy + 7} ${pt.cx - 2},${pt.cy + 2} ${pt.cx - 7},${pt.cy} ${pt.cx - 2},${pt.cy - 2}`}
                fill="#FDE047"
              />
            </g>
          ))}
        </g>
      );

    case 'embarrassed':
    default:
      return null;
  }
};

/**
 * Main Pure SceneComposer Component
 */
const RawSceneComposer: React.FC<SceneComposerProps> = ({
  scene: propScene,
  beatIndex = 0,
  beat,
  frame,
  scenarioHint = '',
  isPlaying = false,
  className = '',
  showLabel = true,
  isAiGenerated = false,
  imageUrl = null,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Resolve structured Scene data
  const resolvedScene: Scene = useMemo(() => {
    if (propScene) return propScene;
    if (frame?.scene) return frame.scene;
    if (beat?.scene) return beat.scene;

    // Infer from hint / beat
    const hint = `${scenarioHint} ${beat?.voiceover || ''} ${beat?.visual || ''} ${frame?.sceneDescription || ''}`;
    const baseScene: Scene = {
      setting: 'office_interview',
      timeOfDay: beatIndex >= 2 ? 'afternoon' : 'morning',
      mood: beatIndex === 0 ? 'anxious' : beatIndex === 1 ? 'hesitant' : beatIndex === 2 ? 'hopeful' : 'confident',
      subject: {
        who: beatIndex === 2 ? 'arya_avatar' : 'young_woman',
        action: beatIndex === 0 ? 'freezing' : beatIndex === 1 ? 'looking_down' : beatIndex === 2 ? 'holding_phone' : 'speaking_confidently',
        expression: beatIndex === 0 ? 'worried' : beatIndex === 1 ? 'awkward_smile' : beatIndex === 2 ? 'smiling' : 'confident',
      },
      props: beatIndex === 2 ? ['phone_with_mysivi'] : beatIndex === 0 ? ['laptop'] : ['none'],
      palette: beatIndex === 2 ? 'hopeful_lavender' : beatIndex === 3 ? 'bold_success' : 'warm_anxious',
      cameraMotion: beatIndex === 0 ? 'slow_zoom_in' : beatIndex === 1 ? 'pan_right' : 'static',
    };

    const sanity = sceneSanity(baseScene, hint, scenarioHint);
    return sanity.scene;
  }, [propScene, frame?.scene, beat?.scene, scenarioHint, beat?.voiceover, beat?.visual, frame?.sceneDescription, beatIndex]);

  // Framer Motion Ken Burns variants
  const motionVariants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        initial: { scale: 1, x: 0, y: 0 },
        animate: { scale: 1, x: 0, y: 0, transition: { duration: 0 } },
      };
    }

    switch (resolvedScene.cameraMotion) {
      case 'slow_zoom_in':
        return {
          initial: { scale: 1.0, x: 0, y: 0 },
          animate: {
            scale: isPlaying ? 1.06 : 1.02,
            transition: { duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' as const },
          },
        };
      case 'pan_right':
        return {
          initial: { scale: 1.03, x: -6 },
          animate: {
            x: isPlaying ? 6 : 0,
            transition: { duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' as const },
          },
        };
      case 'subtle_shake':
        return {
          initial: { scale: 1.02, x: 0 },
          animate: {
            x: isPlaying ? [-1.5, 1.5, -1, 1, 0] : 0,
            transition: { duration: 0.6, repeat: Infinity },
          },
        };
      case 'static':
      default:
        return {
          initial: { scale: 1, x: 0, y: 0 },
          animate: { scale: 1, x: 0, y: 0 },
        };
    }
  }, [resolvedScene.cameraMotion, isPlaying, shouldReduceMotion]);

  // If real AI image is available, render with fallback
  if (isAiGenerated && imageUrl) {
    return (
      <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
        <img src={imageUrl} alt="AI Generated Scene" className="w-full h-full object-cover" />
        {showLabel && (
          <div className="absolute top-3 right-3 z-20">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
              AI-generated
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-[#0B1020] ${className}`}>
      {/* Dynamic Ken Burns Animated Canvas */}
      <motion.div
        className="w-full h-full origin-center flex items-center justify-center"
        variants={motionVariants}
        initial="initial"
        animate="animate"
      >
        <svg
          viewBox="0 0 360 640"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Window Sky Gradient based on Time of Day */}
            <linearGradient id="window-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TIME_LIGHTING[resolvedScene.timeOfDay].skyGradient[0]} />
              <stop offset="100%" stopColor={TIME_LIGHTING[resolvedScene.timeOfDay].skyGradient[1]} />
            </linearGradient>

            {/* Arya Halo Glow */}
            <radialGradient id="arya-halo-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#6D4AFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
            </radialGradient>

            {/* Mood Ambient Overlay */}
            <linearGradient id="ambient-overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor={PALETTES[resolvedScene.palette].ambientOverlay} />
            </linearGradient>
          </defs>

          {/* 1. Setting Architecture Background */}
          <SettingBackground
            setting={resolvedScene.setting}
            timeOfDay={resolvedScene.timeOfDay}
            palette={resolvedScene.palette}
          />

          {/* 2. Stylized Character Archetype */}
          <StylizedCharacter
            who={resolvedScene.subject.who}
            action={resolvedScene.subject.action}
            expression={resolvedScene.subject.expression}
            props={resolvedScene.props}
          />

          {/* 3. Mood Emotional Overlay & FX */}
          <MoodEffect mood={resolvedScene.mood} />

          {/* 4. Ambient Vignette Gradient */}
          <rect x="0" y="0" width="360" height="640" fill="url(#ambient-overlay)" pointerEvents="none" />
        </svg>
      </motion.div>

      {/* Verified Label */}
      {showLabel && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6D4AFF]/90 text-white backdrop-blur-md shadow-sm border border-white/20">
            Illustrated scene
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Memoized SceneComposer: Prevents SVG redraws on audio/time progress scrub
 */
export const SceneComposer = React.memo(RawSceneComposer, (prevProps, nextProps) => {
  // Only re-render if scene, beatIndex, isPlaying state, or imageUrl actually change
  return (
    prevProps.beatIndex === nextProps.beatIndex &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.isAiGenerated === nextProps.isAiGenerated &&
    prevProps.showLabel === nextProps.showLabel &&
    prevProps.scenarioHint === nextProps.scenarioHint &&
    JSON.stringify(prevProps.scene) === JSON.stringify(nextProps.scene)
  );
});
