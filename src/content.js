// Structural labels only. Import reviewed workbook lessons separately before release.
export const weeks = [
  'Setting Your Goals and Getting Started', 'Getting Back to Life',
  'Identifying Your Thought Patterns', 'Breaking Negative Thought Patterns',
  'Time and Task Management', 'Facing Your Fears', 'Putting It All Together'
].map((title, i) => ({ id: `cbt-week-${i + 1}`, title, number: i + 1 }));

export const selfLove = Array.from({ length: 24 }, (_, i) => ({ id: `self-love-${i + 1}`, title: `Reading ${i + 1}`, number: i + 1 }));

// Provisional short practice cards; replace with the reviewed 10-card collection.
export const skills = [
  ['Name what is happening', 'Pause and put a few words to what you notice right now. You can keep this private.'],
  ['Find a steady point', 'Notice your feet against the floor or the support of a chair. Stay with that contact for a moment.'],
  ['Choose one small step', 'Pick one action small enough to begin today. It can take less than two minutes.'],
  ['Check the thought', 'Write down a thought, then ask what you know and what you may be assuming.'],
  ['Make room for a feeling', 'Name the feeling without requiring yourself to change it immediately.'],
  ['Ask for support', 'Think of one trusted person and a specific, simple request you could make.'],
  ['Plan a pause', 'Choose a place and a short time to step away when things feel intense.'],
  ['Notice what matters', 'Name one value you want your next small choice to reflect.'],
  ['Break down a task', 'Write just the first visible action. Leave the rest for later.'],
  ['Look back gently', 'Notice one thing you tried today, regardless of how it went.']
].map(([title, body], i) => ({ id: `skill-${i + 1}`, title, body }));

export const mindfulness = [
  ['Orient to the room', 'Look around slowly. Name a few ordinary things you can see.'],
  ['Feel the ground', 'Press your feet gently into the floor and notice the contact.'],
  ['Gentle breathing', 'Let your breathing settle at a comfortable pace. Avoid forcing a deep breath.'],
  ['Longer exhale', 'If comfortable, let an exhale last a little longer than an inhale. Return to natural breathing anytime.'],
  ['Unclench and release', 'Notice your jaw, hands, and shoulders. Let any area soften if it feels comfortable.'],
  ['Gentle humming', 'Hum softly for a few breaths if it feels pleasant; stop whenever you wish.'],
  ['Five senses', 'Notice one thing you can see, hear, touch, smell, or taste. Use only senses that feel comfortable.'],
  ['Choose your own reset', 'Try one familiar, comforting action away from the screen.']
].map(([title, body], i) => ({ id: `mindful-${i + 1}`, title, body }));
