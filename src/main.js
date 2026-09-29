import './style.css';
import { configured, supabase, loadData, setCompleted, addEntry, removeEntry } from './store.js';
import { weeks, selfLove, skills, mindfulness } from './content.js';

const app = document.querySelector('#app');
const state = { page: 'home', completed: new Set(), entries: [], user: null, busy: false };
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icons = { cbt: '◒', love: '♡', skills: '✳', mindfulness: '◌', goals: '✧', ideals: '✦' };

function shell(body, title = '') {
  app.innerHTML = `<div class="app-shell"><header class="topbar"><button class="brand" data-page="home" aria-label="Go home"><span class="brand-mark">✺</span> Abby’s App</button>${state.user ? '<button class="small-link" id="signout">Sign out</button>' : ''}</header><main>${title ? `<div class="page-heading"><button class="back" data-page="home" aria-label="Back to home">←</button><h1>${title}</h1></div>` : ''}${body}</main><footer>A little support for the next step. <span>Take what helps, then return to your day.</span></footer></div>`;
  app.querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => { state.page = b.dataset.page; render(); window.scrollTo(0, 0); }));
  app.querySelector('#signout')?.addEventListener('click', async () => { await supabase.auth.signOut(); state.user = null; state.entries = []; state.completed = new Set(); state.page = 'home'; render(); });
}

function home() {
  const button = (page, label, description, tone) => `<button class="nav-card ${tone}" data-page="${page}"><span class="nav-icon" aria-hidden="true">${icons[page]}</span><span><strong>${label}</strong><small>${description}</small></span><span class="arrow" aria-hidden="true">→</span></button>`;
  shell(`<section class="hero"><div class="eyebrow">A space to grow into</div><div class="hero-symbol" aria-hidden="true">✦</div><h1>Your ideals, your way</h1><p>Images and words that feel like you can live here. There’s room to begin whenever you’re ready.</p><button class="hero-action" data-page="ideals">Visit Ideals <span aria-hidden="true">→</span></button></section><section><div class="section-title"><h2>To do</h2><span>Choose your own pace</span></div><div class="card-stack">${button('cbt', '7 Week CBT workbook', 'Seven weeks, one step at a time', 'lavender')}${button('love', 'Self-love workbook', 'Read and reflect at your pace', 'peach')}</div></section><section><div class="section-title"><h2>Resources</h2><span>Here when you need them</span></div><div class="card-stack">${button('skills', 'Skills', 'Small actions for everyday moments', 'sage')}${button('mindfulness', 'Mindfulness', 'Grounding and gentle regulation', 'blue')}${button('goals', 'Goals & Vision', 'Your own direction and hopes', 'butter')}${button('ideals', 'Ideals', 'Words and images to keep close', 'rose')}</div></section>`);
}

function workbook(kind) {
  const isCbt = kind === 'cbt';
  const items = isCbt ? weeks : selfLove;
  const done = items.filter(i => state.completed.has(i.id)).length;
  const list = items.map(i => `<article class="list-card"><div class="list-number">${String(i.number).padStart(2, '0')}</div><div class="list-copy"><h3>${escapeHtml(i.title)}</h3><p>${isCbt ? 'Workbook week' : 'Workbook reading'} · Content pending review</p></div><button class="check ${state.completed.has(i.id) ? 'checked' : ''}" data-complete="${i.id}" aria-label="${state.completed.has(i.id) ? 'Mark incomplete' : 'Mark complete'}: ${escapeHtml(i.title)}" aria-pressed="${state.completed.has(i.id)}">${state.completed.has(i.id) ? '✓' : '○'}</button></article>`).join('');
  shell(`<p class="intro">Move through this at your own pace. Your checkmarks are saved privately.</p><div class="progress-panel"><div><strong>${done} of ${items.length}</strong><span> marked complete</span></div><div class="progress-track"><span style="width:${Math.round(done / items.length * 100)}%"></span></div></div><div class="notice">The original lesson text and activities are awaiting review for this separate app. These labels and checkmarks are ready now.</div><div class="list-stack">${list}</div>`, isCbt ? '7 Week CBT workbook' : 'Self-love workbook');
  app.querySelectorAll('[data-complete]').forEach(button => button.addEventListener('click', async () => {
    if (state.busy) return;
    state.busy = true;
    const id = button.dataset.complete; const next = !state.completed.has(id);
    try { await setCompleted(id, next); next ? state.completed.add(id) : state.completed.delete(id); render(); }
    catch (e) { showError(e); }
    finally { state.busy = false; }
  }));
}

function library(kind) {
  const items = kind === 'skills' ? skills : mindfulness;
  const lead = kind === 'skills' ? 'Simple practices to try in everyday life. Choose one, then put the phone down.' : 'Pick a gentle practice. If anything feels uncomfortable, stop and choose something else.';
  shell(`<p class="intro">${lead}</p>${kind === 'skills' ? '<div class="notice">These ten short cards are provisional; the established wording is awaiting review.</div>' : '<div class="notice">Practice wording is provisional until the existing library is reviewed.</div>'}<div class="practice-list">${items.map((item, i) => `<details class="practice"><summary><span class="practice-number">${String(i + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.title)}</strong><span class="expand" aria-hidden="true">＋</span></summary><div class="practice-body"><p>${escapeHtml(item.body)}</p><span class="away">Try it away from the screen when you’re ready.</span></div></details>`).join('')}</div>`, kind === 'skills' ? 'Skills' : 'Mindfulness');
}

function personal(kind) {
  const isIdeal = kind === 'ideals';
  const records = state.entries.filter(e => e.kind === (isIdeal ? 'ideal' : 'goal'));
  const title = isIdeal ? 'Ideals' : 'Goals & Vision';
  const description = isIdeal ? 'Your own words and images can live here. Add an ideal when you’re ready; artwork can be added in a later update.' : 'A private place for hopes, small goals, and ideas for the future. Start wherever you are.';
  shell(`<div class="personal-intro"><div class="personal-art" aria-hidden="true">${isIdeal ? '✦' : '✧'}</div><p>${description}</p></div>${records.length ? `<div class="entry-list">${records.map(e => `<article class="entry"><div><h3>${escapeHtml(e.title)}</h3>${e.body ? `<p>${escapeHtml(e.body)}</p>` : ''}</div><button class="small-link remove" data-remove="${escapeHtml(e.id)}" aria-label="Remove ${escapeHtml(e.title)}">Remove</button></article>`).join('')}</div>` : `<div class="empty"><strong>Room for your story</strong><p>Nothing has been added yet. This space is yours to shape.</p></div>`}<form id="entry-form" class="entry-form"><h2>Add ${isIdeal ? 'an ideal' : 'a goal or vision'}</h2><label for="entry-title">Title</label><input id="entry-title" name="title" maxlength="120" required placeholder="A few words to remember"/><label for="entry-body">Your words <span>(optional)</span></label><textarea id="entry-body" name="body" maxlength="2000" rows="3" placeholder="What does this mean to you?"></textarea><button class="primary" type="submit">Save privately</button></form>`, title);
  app.querySelector('#entry-form').addEventListener('submit', async e => {
    e.preventDefault(); const form = e.currentTarget; const btn = form.querySelector('button'); btn.disabled = true;
    try { await addEntry(isIdeal ? 'ideal' : 'goal', form.elements.namedItem('title').value.trim(), form.elements.namedItem('body').value.trim()); const data = await loadData(); state.entries = data.entries; render(); }
    catch (err) { showError(err); btn.disabled = false; }
  });
  app.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Remove this entry?')) return;
    try { await removeEntry(b.dataset.remove); state.entries = state.entries.filter(e => e.id !== b.dataset.remove); render(); } catch (err) { showError(err); }
  }));
}

function showError(e) { alert(e?.message || 'Something went wrong. Please try again.'); }
function signInMessage(error) {
  if (error?.code === 'email_not_confirmed') return 'This email needs to be confirmed in Abby’s Supabase project before signing in.';
  if (error?.code === 'invalid_credentials') return 'Email or password did not match. Check the account and password in Abby’s Supabase project.';
  if (error?.code === 'over_request_rate_limit') return 'Too many attempts. Please wait a few minutes before trying again.';
  return 'Could not sign in right now. Please try again or check Abby’s account in Supabase.';
}
function login() {
  shell(`<div class="auth-card"><div class="auth-icon">✺</div><h1>Abby’s App</h1><p>Your private space is ready when you are.</p><form id="login-form"><label for="email">Email</label><input id="email" type="email" autocomplete="username" required/><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" required/><button class="primary" type="submit">Sign in</button><p id="login-error" class="error" role="alert"></p></form></div>`);
  app.querySelector('#login-form').addEventListener('submit', async e => {
    e.preventDefault(); const form = e.currentTarget; const button = form.querySelector('button'); button.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({ email: form.querySelector('#email').value, password: form.querySelector('#password').value });
    if (error) { app.querySelector('#login-error').textContent = signInMessage(error); button.disabled = false; }
  });
}
function render() {
  if (!configured) { shell('<div class="auth-card"><div class="auth-icon">✺</div><h1>Setup in progress</h1><p>This private app is waiting for its own Supabase project. No personal content is available yet.</p></div>'); return; }
  if (!state.user) { login(); return; }
  if (state.page === 'home') home();
  else if (['cbt', 'love'].includes(state.page)) workbook(state.page);
  else if (['skills', 'mindfulness'].includes(state.page)) library(state.page);
  else personal(state.page);
}
async function boot() {
  if (!configured) { render(); return; }
  const { data: { session } } = await supabase.auth.getSession();
  state.user = session?.user ?? null;
  supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user ?? null;
    if (state.user) setTimeout(async () => { try { Object.assign(state, await loadData()); render(); } catch (e) { showError(e); } }, 0);
    else { state.entries = []; state.completed = new Set(); render(); }
  });
  if (state.user) { try { Object.assign(state, await loadData()); } catch (e) { showError(e); } }
  render();
}
boot();
