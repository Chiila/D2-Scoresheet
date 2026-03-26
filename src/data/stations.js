/**
 * HERmazing Race — station criteria and max points per criterion.
 * Keys are used in submission.scores objects.
 */
export const STATIONS = {
  1: {
    code: 'S1',
    name: 'Confidence',
    criteria: [
      { key: 'confidence', label: 'Confidence', max: 25 },
      { key: 'teamSupport', label: 'Team support', max: 20 },
      { key: 'creativity', label: 'Creativity', max: 20 },
      { key: 'stagePresence', label: 'Stage presence', max: 20 },
      { key: 'energy', label: 'Energy', max: 15 },
    ],
  },
  2: {
    code: 'S2',
    name: 'Courage',
    criteria: [
      { key: 'taskCompletion', label: 'Task completion', max: 30 },
      { key: 'problemSolving', label: 'Problem-solving', max: 25 },
      { key: 'coordination', label: 'Coordination', max: 20 },
      { key: 'speed', label: 'Speed', max: 15 },
      { key: 'determination', label: 'Determination', max: 10 },
    ],
  },
  3: {
    code: 'S3',
    name: 'Compassion',
    criteria: [
      { key: 'kits', label: 'Kits', max: 30 },
      { key: 'quality', label: 'Quality', max: 20 },
      { key: 'cooperation', label: 'Cooperation', max: 20 },
      { key: 'reflection', label: 'Reflection', max: 20 },
      { key: 'sincerity', label: 'Sincerity', max: 10 },
    ],
  },
  4: {
    code: 'S4',
    name: 'Creativity',
    criteria: [
      { key: 'creativity', label: 'Creativity', max: 30 },
      { key: 'message', label: 'Message', max: 25 },
      { key: 'execution', label: 'Execution', max: 20 },
      { key: 'participation', label: 'Participation', max: 15 },
      { key: 'impact', label: 'Impact', max: 10 },
    ],
  },
  5: {
    code: 'S5',
    name: 'Collaboration',
    criteria: [
      { key: 'sync', label: 'Sync', max: 35 },
      { key: 'coordination', label: 'Coordination', max: 25 },
      { key: 'accuracy', label: 'Accuracy', max: 20 },
      { key: 'unity', label: 'Unity', max: 10 },
      { key: 'energy', label: 'Energy', max: 10 },
    ],
  },
}

/** Stable ids for storage and consolidation keys. */
export const TEAMS = [
  { id: 'pink', name: 'Pink Team', emoji: '💗' },
  { id: 'violet', name: 'Violet Team', emoji: '💜' },
  { id: 'yellow', name: 'Yellow Team', emoji: '💛' },
  { id: 'orange', name: 'Orange Team', emoji: '🧡' },
  { id: 'red', name: 'Red Team', emoji: '❤️' },
  { id: 'blue', name: 'Blue Team', emoji: '💙' },
  { id: 'green', name: 'Green Team', emoji: '💚' },
  { id: 'brown', name: 'Brown Team', emoji: '🤎' },
]

const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]))

/** Legacy numeric team index 1–8 → id (for older saved data). */
const LEGACY_NUM_TO_ID = TEAMS.map((t) => t.id)

export function normalizeTeamId(team) {
  if (typeof team === 'number' && team >= 1 && team <= TEAMS.length) {
    return LEGACY_NUM_TO_ID[team - 1]
  }
  if (typeof team === 'string' && TEAM_BY_ID[team]) return team
  return null
}

export function getTeamById(id) {
  const normalized = normalizeTeamId(id)
  return normalized ? TEAM_BY_ID[normalized] : null
}

export function getTeamDisplayName(id) {
  const t = getTeamById(id)
  return t ? t.name : 'Unknown team'
}

export const STATION_IDS = [1, 2, 3, 4, 5]
