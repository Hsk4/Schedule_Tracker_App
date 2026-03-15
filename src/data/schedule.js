export const SCHEDULE_WEEKDAY = [
  { id: 'w_wake',      time: '8:00',  label: 'Wake up + stretch',        icon: '🌅', color: '#2dd4a0', sub: 'Light flexibility · 15 min',           habit: 'wake' },
  { id: 'w_bfast',     time: '8:15',  label: 'Protein breakfast',         icon: '🥚', color: '#f59e0b', sub: 'High protein · fuel for muscle',        habit: 'breakfast' },
  { id: 'w_code1',     time: '9:00',  label: 'Coding work',               icon: '💻', color: '#a594ff', sub: 'Deep work session',                     habit: 'coding' },
  { id: 'w_uni',       time: '11:00', label: 'University / Class',        icon: '🎓', color: '#93c5fd', sub: '11am–1pm · attend & take notes' },
  { id: 'w_lunch',     time: '13:00', label: 'Lunch + recharge',          icon: '🍱', color: '#5c5b72', sub: 'Eat · short rest' },
  { id: 'w_jp',        time: '13:30', label: 'Japanese study',            icon: '🇯🇵', color: '#f472b6', sub: 'Vocab, grammar, listening',             habit: 'japanese' },
  { id: 'w_study',     time: '14:30', label: 'Uni practice / study',      icon: '📚', color: '#93c5fd', sub: 'Assignments & revision' },
  { id: 'w_play',      time: '16:00', label: 'Play time',                 icon: '🎮', color: '#f59e0b', sub: '2–3 hrs gaming / fun',                  habit: 'play' },
  { id: 'w_family',    time: '18:00', label: 'Family + nephew time',      icon: '👨‍👩‍👦', color: '#f472b6', sub: 'Quality time every day',              habit: 'family' },
  { id: 'w_dinner',    time: '19:00', label: 'Dinner',                    icon: '🍽️', color: '#5c5b72', sub: '' },
  { id: 'w_free',      time: '19:30', label: 'Free / buffer',             icon: '☕', color: '#5c5b72', sub: 'Wind down, light tasks' },
  { id: 'w_code2',     time: '21:00', label: 'Evening coding',            icon: '⌨️', color: '#a594ff', sub: 'Extra session if energy allows' },
  { id: 'w_cutoff',    time: '23:00', label: 'Digital cut-off 🔕',        icon: '🔕', color: '#ef4444', sub: 'No screens after this' },
  { id: 'w_plan',      time: '23:00', label: 'Plan for tomorrow',         icon: '📋', color: '#2dd4a0', sub: 'Press clothes · prep bag · to-do list' },
  { id: 'w_sleep',     time: '00:00', label: 'Sleep',                     icon: '😴', color: '#5c5b72', sub: 'Target: in bed by 12am' },
];

export const SCHEDULE_WEEKEND = [
  { id: 'e_wake',      time: '8:00',  label: 'Wake up + stretch',         icon: '🌅', color: '#2dd4a0', sub: 'Light flexibility · 15 min',            habit: 'wake' },
  { id: 'e_bfast',     time: '8:15',  label: 'Protein breakfast',          icon: '🥚', color: '#f59e0b', sub: 'High protein start',                    habit: 'breakfast' },
  { id: 'e_novel',     time: '9:00',  label: 'Novel writing',              icon: '✍️', color: '#f472b6', sub: 'Weekend creative block',               habit: 'novel' },
  { id: 'e_uni',       time: '11:00', label: 'University / Class',         icon: '🎓', color: '#93c5fd', sub: '11am–1pm if scheduled' },
  { id: 'e_lunch',     time: '13:00', label: 'Lunch + recharge',           icon: '🍱', color: '#5c5b72', sub: '' },
  { id: 'e_jp',        time: '14:00', label: 'Japanese study',             icon: '🇯🇵', color: '#f472b6', sub: 'Extended weekend session',             habit: 'japanese' },
  { id: 'e_play',      time: '15:30', label: 'Play time',                  icon: '🎮', color: '#f59e0b', sub: '2–3 hrs gaming / fun',                  habit: 'play' },
  { id: 'e_family',    time: '17:30', label: 'Family + nephew time',       icon: '👨‍👩‍👦', color: '#f472b6', sub: 'Weekend quality time',               habit: 'family' },
  { id: 'e_dinner',    time: '19:00', label: 'Dinner',                     icon: '🍽️', color: '#5c5b72', sub: '' },
  { id: 'e_code',      time: '20:00', label: 'Coding work',                icon: '💻', color: '#a594ff', sub: 'Weekend coding session',               habit: 'coding' },
  { id: 'e_cutoff',    time: '23:00', label: 'Digital cut-off',            icon: '🔕', color: '#ef4444', sub: 'Screens off' },
  { id: 'e_plan',      time: '23:00', label: 'Plan for tomorrow',          icon: '📋', color: '#2dd4a0', sub: 'Press clothes · prep bag · to-do list' },
  { id: 'e_sleep',     time: '00:00', label: 'Sleep',                      icon: '😴', color: '#5c5b72', sub: 'Target: in bed by 12am' },
];

export const HABITS = [
  { id: 'wake',      name: 'Wake @ 8am',        emoji: '🌅', color: '#7c6af7' },
  { id: 'breakfast', name: 'Protein breakfast',  emoji: '🥚', color: '#f59e0b' },
  { id: 'coding',    name: 'Coding',             emoji: '💻', color: '#a594ff' },
  { id: 'japanese',  name: 'Japanese',           emoji: '🇯🇵', color: '#f472b6' },
  { id: 'play',      name: 'Play 2–3h',          emoji: '🎮', color: '#f59e0b' },
  { id: 'family',    name: 'Family time',        emoji: '👨‍👩‍👦', color: '#f472b6' },
  { id: 'novel',     name: 'Novel (weekend)',    emoji: '✍️', color: '#2dd4a0' },
];

export const PREP_ITEMS = [
  "Press / lay out tomorrow's clothes",
  'Prepare university bag & notes',
  'Set morning alarm for 8:00am',
  'Spend time with nephew',
  "Review tomorrow's schedule",
  'Write 3 things you\'re grateful for',
];

export const DAYS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const SECTIONS = { morning: 'Morning', midday: 'Midday', afternoon: 'Afternoon', evening: 'Evening' };

export function getDateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function isWeekend(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.getDay() === 0 || d.getDay() === 6;
}

export function getSchedule(offset = 0) {
  return isWeekend(offset) ? SCHEDULE_WEEKEND : SCHEDULE_WEEKDAY;
}

export function getSectionForTime(time) {
  const h = parseInt(time.split(':')[0]);
  if (h < 11) return 'Morning';
  if (h < 13) return 'Midday';
  if (h < 19) return 'Afternoon';
  return 'Evening';
}
