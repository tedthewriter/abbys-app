import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key && !url.includes('YOUR-SEPARATE-PROJECT'));
export const supabase = configured ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
}) : null;

async function readPrivateData() {
  const [progress, entries] = await Promise.all([
    supabase.from('progress').select('item_id, completed_at'),
    supabase.from('private_entries').select('id, kind, title, body, image_path, created_at').order('created_at', { ascending: false })
  ]);
  if (progress.error) throw progress.error;
  if (entries.error) throw entries.error;
  return { completed: new Set(progress.data.map(p => p.item_id)), entries: entries.data };
}

export async function loadData() {
  try {
    return await readPrivateData();
  } catch (error) {
    // A newly issued token can briefly arrive before the data API's clock catches up.
    // Retry only this transient validation error; never bypass token verification.
    if (!/JWT issued at future|JWTIssuedAtFuture/i.test(error?.message || '')) throw error;
    await new Promise(resolve => setTimeout(resolve, 1500));
    return readPrivateData();
  }
}

export async function setCompleted(itemId, completed) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error('Please sign in again.');
  const result = completed
    ? await supabase.from('progress').upsert({ user_id: user.id, item_id: itemId, completed_at: new Date().toISOString() })
    : await supabase.from('progress').delete().eq('item_id', itemId).eq('user_id', user.id);
  if (result.error) throw result.error;
}

export async function addEntry(kind, title, body) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error('Please sign in again.');
  const { error } = await supabase.from('private_entries').insert({ user_id: user.id, kind, title, body });
  if (error) throw error;
}

export async function removeEntry(id) {
  const { error } = await supabase.from('private_entries').delete().eq('id', id);
  if (error) throw error;
}
