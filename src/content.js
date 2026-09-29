// Structural labels only. Import reviewed workbook lessons separately before release.
export const weeks = [
  'Setting Your Goals and Getting Started', 'Getting Back to Life',
  'Identifying Your Thought Patterns', 'Breaking Negative Thought Patterns',
  'Time and Task Management', 'Facing Your Fears', 'Putting It All Together'
].map((title, i) => ({ id: `cbt-week-${i + 1}`, title, number: i + 1 }));

export const selfLove = Array.from({ length: 24 }, (_, i) => ({ id: `self-love-${i + 1}`, title: `Reading ${i + 1}`, number: i + 1 }));

// Ten practical cards, including three expanded cards reviewed by the app owner.
export const skills = [
  ['Name what is happening', 'Pause and put a few words to what you notice right now. You can keep this private.'],
  ['Find a steady point', 'Notice your feet against the floor or the support of a chair. Stay with that contact for a moment.'],
  ['Choose one small step', 'Pick one action small enough to begin today. It can take less than two minutes.'],
  ['Talk to yourself with kindness', `When you notice harsh self-talk, pause and name the thought: “I’m telling myself that I messed everything up.”

Ask: What actually happened? What am I assuming? What would I say to someone I care about?

Try a response that is both kind and believable:

“That didn’t go how I hoped. I can decide what to do next without putting myself down.”

You don’t have to feel positive. Start with being fair to yourself.`],
  ['Make room for a feeling', 'Name the feeling without requiring yourself to change it immediately.'],
  ['Make room for your own needs', `Before agreeing to a request, take a moment to check: Do I want to do this? Do I have the time and energy? What would I need to give up?

You can pause before answering:

“Let me check and get back to you.”

If the answer is no, try a clear, respectful response:

“I can’t do that today.”

If you want to offer a smaller commitment:

“I can help for twenty minutes, but I can’t stay longer.”

Someone may feel disappointed. That feeling doesn’t automatically mean your decision was unkind. Your needs belong in the conversation, too.`],
  ['Plan a pause', 'Choose a place and a short time to step away when things feel intense.'],
  ['Notice what matters', 'Name one value you want your next small choice to reflect.'],
  ['Practice “good enough”', `Choose one small, low-stakes task. Before you begin, decide what finished looks like.

For example: “This message needs to be clear and kind. It doesn’t need to be perfectly worded.”

Do the task. When it meets your definition of finished, try stopping—even if you feel tempted to keep adjusting it.

Notice what happens. Was another revision necessary, or was it hard to let the task be done?

You can care about doing something well and still let it be finished.`],
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
