import { supabase } from './supabase.js';

export async function runSupabaseDiagnostics() {
  const results = { authUser: null, writeUsersRow: null, readUsersRow: null, errors: [] };
  try {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user || null;
    if (userErr) {
      results.errors.push('Failed to get auth user: ' + (userErr.message || userErr));
      console.log('[Supabase Diagnostics]', results);
      return results;
    }
    results.authUser = user ? { id: user.id, email: user.email } : null;
    if (!user) {
      results.errors.push('No authenticated user; sign in first.');
      return results;
    }
    const uid = user.id;

    // test write (upsert)
    try {
      const payload = { id: uid, diagPingAt: new Date().toISOString(), email: user.email || null };
      const { error } = await supabase.from('users').upsert([payload], { onConflict: 'id' });
      if (error) {
        results.writeUsersRow = 'fail';
        results.errors.push('Write users row failed: ' + (error.message || error));
      } else {
        results.writeUsersRow = 'ok';
      }
    } catch (e) {
      results.writeUsersRow = 'fail';
      results.errors.push('Write users row crashed: ' + (e.message || e));
    }

    // test read
    try {
      const { data, error } = await supabase.from('users').select('id').eq('id', uid).maybeSingle();
      if (error) {
        results.readUsersRow = 'fail';
        results.errors.push('Read users row failed: ' + (error.message || error));
      } else {
        results.readUsersRow = data ? 'ok' : 'not-found';
      }
    } catch (e) {
      results.readUsersRow = 'fail';
      results.errors.push('Read users row crashed: ' + (e.message || e));
    }
  } catch (outer) {
    results.errors.push('Diagnostics crashed: ' + (outer?.message || outer));
  }
  console.log('[Supabase Diagnostics]', results);
  return results;
}
