import { Scene } from '@shared/types';

/**
 * Builds rich text-to-image prompts adhering to MySivi visual brand standards:
 * - Clean vertical 9:16 composition
 * - Stylized Indian context
 * - Cinematic lighting matching timeOfDay and mood
 */
export function buildSceneImagePrompt(scene: Scene, contextDescription: string): string {
  const settingDescriptions: Record<string, string> = {
    classroom_pta: 'inside a modern Indian school classroom during a parent-teacher meeting, blackboard with chalk notes in background',
    office_interview: 'inside a corporate office interview room with glass partitions and soft reflections',
    cafe: 'cozy contemporary urban cafe with warm wooden textures and hanging ambient pendant lights',
    conference_room: 'sleek office boardroom with sprint diagram whiteboard and meeting table',
    college_campus: 'sunlit Indian university campus with brick pillars and lush green lawn',
    bus_stop: 'clean city bus transit stop shelter during daily morning commute',
    bedroom_study: 'warm study desk in a contemporary bedroom with reading lamp and books',
    metro_train: 'interior of a modern metro train with handrails and route map',
    living_room: 'contemporary Indian family apartment living room with sofa and potted indoor plant',
    dinner_table: 'warm family dining table set for an evening meal',
    street_market: 'colorful bustling Indian neighborhood street market with vibrant awnings',
  };

  const settingText = settingDescriptions[scene.setting] || scene.setting.replace('_', ' ');

  return `Vertical 9:16 cinematic illustration, ${settingText}. ${contextDescription}. Time of day: ${scene.timeOfDay}, mood: ${scene.mood}. Clean modern flat-vector aesthetic with subtle textures, harmonious MySivi lavender and indigo tones, authentic relatable Indian context, professional composition.`;
}
