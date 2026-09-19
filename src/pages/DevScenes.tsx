import React, { useState } from 'react';
import { SceneComposer } from '@/components/studio/SceneComposer';
import {
  Setting,
  TimeOfDay,
  Mood,
  SubjectWho,
  SubjectAction,
  SubjectExpression,
  Prop,
  Palette,
  CameraMotion,
  Scene,
} from '@shared/types';
import { Play, Pause } from 'lucide-react';

const SETTINGS: Setting[] = [
  'classroom_pta',
  'office_interview',
  'cafe',
  'conference_room',
  'college_campus',
  'bus_stop',
  'bedroom_study',
  'metro_train',
  'living_room',
  'dinner_table',
  'street_market',
];

const WHO_LIST: SubjectWho[] = [
  'young_woman',
  'young_man',
  'mother',
  'father',
  'student_f',
  'student_m',
  'professional_f',
  'professional_m',
  'arya_avatar',
  'none',
];

const ACTIONS: SubjectAction[] = [
  'freezing',
  'looking_down',
  'speaking_confidently',
  'holding_phone',
  'sipping_coffee',
  'presenting',
];

const EXPRESSIONS: SubjectExpression[] = [
  'worried',
  'neutral',
  'smiling',
  'awkward_smile',
  'confident',
];

const PROPS: Prop[] = [
  'phone_with_mysivi',
  'coffee_cup',
  'resume_folder',
  'notebook',
  'laptop',
  'none',
];

const PALETTES: Palette[] = [
  'warm_anxious',
  'cool_corporate',
  'hopeful_lavender',
  'bold_success',
];

export const DevScenes: React.FC = () => {
  const [setting, setSetting] = useState<Setting>('classroom_pta');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [mood, setMood] = useState<Mood>('anxious');
  const [who, setWho] = useState<SubjectWho>('mother');
  const [action, setAction] = useState<SubjectAction>('freezing');
  const [expression, setExpression] = useState<SubjectExpression>('worried');
  const [prop, setProp] = useState<Prop>('notebook');
  const [palette, setPalette] = useState<Palette>('warm_anxious');
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>('slow_zoom_in');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const currentScene: Scene = {
    setting,
    timeOfDay,
    mood,
    subject: { who, action, expression },
    props: prop === 'none' ? [] : [prop],
    palette,
    cameraMotion,
  };

  return (
    <div className="min-h-screen bg-[#0E1322] text-white p-6 space-y-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-brand-purple text-xs font-bold uppercase tracking-wider">
              DEV ONLY
            </span>
            <h1 className="text-2xl font-black">SceneComposer Visual Test Bench</h1>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Dynamic 9:16 flat-vector engine testing 11 settings, 10 character archetypes, time-of-day lighting, and Ken Burns motion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-xs"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
        </button>
      </div>

      {/* Main Interactive Studio Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Phone Canvas Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[320px] aspect-[9/16] rounded-[36px] overflow-hidden shadow-2xl ring-1 ring-white/20 relative bg-black">
            <SceneComposer
              scene={currentScene}
              isPlaying={isPlaying}
              showLabel={true}
            />
          </div>
        </div>

        {/* Right: Interactive Parameter Controls */}
        <div className="lg:col-span-7 bg-[#161D31] p-6 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-purple">
            Scene Directives Controls
          </h2>

          {/* Setting */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-2">Setting ({SETTINGS.length})</label>
            <div className="flex flex-wrap gap-1.5">
              {SETTINGS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSetting(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    setting === s
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Character Archetype */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-2">Character Who ({WHO_LIST.length})</label>
            <div className="flex flex-wrap gap-1.5">
              {WHO_LIST.map((w) => (
                <button
                  key={w}
                  onClick={() => setWho(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    who === w
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {w.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Action & Expression */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Action / Pose</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as SubjectAction)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>{a.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Expression</label>
              <select
                value={expression}
                onChange={(e) => setExpression(e.target.value as SubjectExpression)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {EXPRESSIONS.map((ex) => (
                  <option key={ex} value={ex}>{ex.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time of Day & Mood */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Mood FX</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {(['anxious', 'embarrassed', 'hesitant', 'hopeful', 'confident', 'joyful'] as Mood[]).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Props & Palette & Camera Motion */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Prop</label>
              <select
                value={prop}
                onChange={(e) => setProp(e.target.value as Prop)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {PROPS.map((p) => (
                  <option key={p} value={p}>{p.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Palette</label>
              <select
                value={palette}
                onChange={(e) => setPalette(e.target.value as Palette)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {PALETTES.map((pal) => (
                  <option key={pal} value={pal}>{pal.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2">Camera Motion</label>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
                className="w-full bg-[#0E1322] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                {(['slow_zoom_in', 'pan_right', 'static', 'subtle_shake'] as CameraMotion[]).map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery of all 11 Settings */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-lg font-black tracking-tight">Gallery: All 11 Verified Settings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SETTINGS.map((s) => (
            <div
              key={s}
              onClick={() => setSetting(s)}
              className="cursor-pointer group flex flex-col space-y-2 bg-[#161D31] p-2 rounded-2xl border border-white/10 hover:border-brand-purple transition-all"
            >
              <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black">
                <SceneComposer
                  scene={{
                    setting: s,
                    timeOfDay: 'morning',
                    mood: 'confident',
                    subject: { who: 'young_woman', action: 'speaking_confidently', expression: 'neutral' },
                    props: [],
                    palette: 'warm_anxious',
                    cameraMotion: 'static',
                  }}
                  showLabel={false}
                />
              </div>
              <span className="text-[11px] font-bold text-center capitalize text-white/90 group-hover:text-brand-purple">
                {s.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DevScenes;
