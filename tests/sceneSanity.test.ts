import { describe, it, expect } from 'vitest';
import { sceneSanity, enforceScriptConsistency } from '../shared/sceneSanity';
import { Scene, ScriptBeat } from '../shared/types';

const defaultScene: Scene = {
  setting: 'office_interview',
  timeOfDay: 'morning',
  mood: 'anxious',
  subject: {
    who: 'young_woman',
    action: 'freezing',
    expression: 'worried',
  },
  props: ['laptop'],
  palette: 'warm_anxious',
  cameraMotion: 'slow_zoom_in',
};

describe('Relevance Guard: sceneSanity() and Script Consistency', () => {
  // Case 1: PTA Meeting (Mandatory)
  it('Case 1: corrects office_interview to classroom_pta when PTA / school keywords are present', () => {
    const result = sceneSanity(
      defaultScene,
      'Teacher asks about my son\'s report card in the annual parent-teacher meeting',
      'I freeze during school PTA meetings when teachers speak in English'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('classroom_pta');
    expect(result.scene.subject.who).toBe('mother');
    expect(result.reason).toContain('scene corrected');
  });

  // Case 2: Interview / HR / recruiter
  it('Case 2: corrects cafe to office_interview when recruiter / interview keywords appear', () => {
    const cafeScene: Scene = { ...defaultScene, setting: 'cafe' };
    const result = sceneSanity(
      cafeScene,
      'HR asks tell me about yourself and my mind goes blank',
      'Stuttering in job interviews with recruiters'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('office_interview');
  });

  // Case 3: Cafe / coffee order
  it('Case 3: corrects office_interview to cafe when ordering coffee', () => {
    const result = sceneSanity(
      defaultScene,
      'Trying to order a cappuccino from the barista without getting confused',
      'Ordering coffee at modern cafes'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('cafe');
  });

  // Case 4: Standup / Manager / Office Meeting
  it('Case 4: corrects bedroom_study to conference_room for daily office standup', () => {
    const studyScene: Scene = { ...defaultScene, setting: 'bedroom_study' };
    const result = sceneSanity(
      studyScene,
      'Engineering manager asks for sprint update during morning standup meeting',
      'Fear of speaking up in office scrum meetings'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('conference_room');
  });

  // Case 5: College Campus / Presentation / Professor
  it('Case 5: corrects bus_stop to college_campus for seminar presentation to professor', () => {
    const busScene: Scene = { ...defaultScene, setting: 'bus_stop' };
    const result = sceneSanity(
      busScene,
      'Presenting my final year project presentation to the professor in college',
      'Stage fright during college viva'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('college_campus');
    expect(result.scene.subject.who).toBe('student_f');
  });

  // Case 6: Bus stop / Transit commute
  it('Case 6: corrects classroom_pta to bus_stop when commuting by bus', () => {
    const ptaScene: Scene = { ...defaultScene, setting: 'classroom_pta' };
    const result = sceneSanity(
      ptaScene,
      'Asking the bus conductor for a ticket during morning commute',
      'Hesitation during daily bus transit'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('bus_stop');
  });

  // Case 7: Metro train commute
  it('Case 7: corrects living_room to metro_train for metro subway commute', () => {
    const livingScene: Scene = { ...defaultScene, setting: 'living_room' };
    const result = sceneSanity(
      livingScene,
      'Standing inside the crowded metro train holding the handrail',
      'Speaking English while travelling on the metro'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('metro_train');
  });

  // Case 8: Bedroom study / Mirror practice
  it('Case 8: corrects office_interview to bedroom_study for solo mirror practice', () => {
    const result = sceneSanity(
      defaultScene,
      'Practicing speech alone in front of bedroom mirror late night',
      'Alone at study desk trying to practice sentences'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('bedroom_study');
  });

  // Case 9: Dinner table with relatives
  it('Case 9: corrects street_market to dinner_table for family dinner', () => {
    const marketScene: Scene = { ...defaultScene, setting: 'street_market' };
    const result = sceneSanity(
      marketScene,
      'Relatives speaking English across the dining table during dinner',
      'Family dinner conversations'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('dinner_table');
  });

  // Case 10: Street market / Bargaining with shopkeeper
  it('Case 10: corrects cafe to street_market for bargaining at local stores', () => {
    const cafeScene: Scene = { ...defaultScene, setting: 'cafe' };
    const result = sceneSanity(
      cafeScene,
      'Bargaining with the shopkeeper at the vegetable market',
      'Street market shopping in English'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('street_market');
  });

  // Case 11: Already matching setting
  it('Case 11: keeps setting when chosen setting already matches keywords', () => {
    const result = sceneSanity(
      defaultScene, // already office_interview
      'HR asks me a technical question in the second interview round',
      'I freeze in job interviews'
    );
    expect(result.corrected).toBe(false);
    expect(result.scene.setting).toBe('office_interview');
  });

  // Case 12: No matching keywords keeps LLM choice untouched
  it('Case 12: preserves LLM setting when no strong keywords match', () => {
    const customScene: Scene = {
      ...defaultScene,
      setting: 'bedroom_study',
    };
    const result = sceneSanity(
      customScene,
      'A quiet moment of self reflection and focus',
      'General feeling of inner hesitation'
    );
    expect(result.corrected).toBe(false);
    expect(result.scene.setting).toBe('bedroom_study');
  });

  // Case 13: Preserves Arya avatar on Turn Beat
  it('Case 13: preserves arya_avatar subject when correcting setting for turn beat', () => {
    const aryaScene: Scene = {
      ...defaultScene,
      setting: 'office_interview',
      subject: { who: 'arya_avatar', action: 'holding_phone', expression: 'smiling' },
    };
    const result = sceneSanity(
      aryaScene,
      'Arya gives instant coaching for school parent teacher discussions',
      'PTA meeting nervousness'
    );
    expect(result.corrected).toBe(true);
    expect(result.scene.setting).toBe('classroom_pta');
    expect(result.scene.subject.who).toBe('arya_avatar');
  });

  // Case 14: Enforces consistency across beats in a script
  it('Case 14: enforceScriptConsistency preserves protagonist across beats and allows Arya on Beat 3', () => {
    const sampleBeats: ScriptBeat[] = [
      {
        timecode: '0-2s',
        name: 'Hook',
        voiceover: 'Parent teacher meeting freeze',
        caption: 'PTA freeze',
        visual: 'Mother frozen',
        audioVibe: 'Tension',
        scene: { ...defaultScene, setting: 'classroom_pta', subject: { who: 'mother', action: 'freezing', expression: 'worried' } },
      },
      {
        timecode: '2-6s',
        name: 'Tension',
        voiceover: 'Thinking what to say',
        caption: 'Nervous',
        visual: 'Mother looking down',
        audioVibe: 'Tension',
        // Inconsistent student_m that LLM hallucinated
        scene: { ...defaultScene, setting: 'classroom_pta', subject: { who: 'student_m', action: 'looking_down', expression: 'worried' } },
      },
      {
        timecode: '6-12s',
        name: 'The Turn',
        voiceover: 'Arya helps you practice',
        caption: 'Arya call',
        visual: 'Arya avatar appears',
        audioVibe: 'Warm',
        scene: { ...defaultScene, setting: 'classroom_pta', subject: { who: 'arya_avatar', action: 'holding_phone', expression: 'smiling' } },
      },
      {
        timecode: '12-15s',
        name: 'CTA',
        voiceover: 'Speak with confidence',
        caption: 'Download app',
        visual: 'Mother smiling',
        audioVibe: 'Reward',
        // Inconsistent professional_m
        scene: { ...defaultScene, setting: 'classroom_pta', subject: { who: 'professional_m', action: 'speaking_confidently', expression: 'confident' } },
      },
    ];

    const consistent = enforceScriptConsistency(sampleBeats);
    expect(consistent[0].scene?.subject.who).toBe('mother');
    expect(consistent[1].scene?.subject.who).toBe('mother'); // corrected to mother!
    expect(consistent[2].scene?.subject.who).toBe('arya_avatar'); // preserved Arya!
    expect(consistent[3].scene?.subject.who).toBe('mother'); // corrected to mother!
  });
});
