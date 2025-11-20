// Phone linking service - currently stubbed for Supabase migration
// TODO: Implement Supabase phone auth/linking if needed

export function ensureRecaptcha() {
  // Not needed for Supabase in the same way, or handled differently
  console.log('ensureRecaptcha called - stubbed');
}

export async function linkPhoneToCurrentUser(phoneNumber) {
  console.log('linkPhoneToCurrentUser called with', phoneNumber);
  // Stub success
  return true;
}

export async function startPhoneLinking(phoneNumber) {
  console.log('startPhoneLinking called with', phoneNumber);
  // Stub success
  return {
    confirm: async (code) => {
      console.log('Confirming code stub', code);
      return true;
    }
  };
}
