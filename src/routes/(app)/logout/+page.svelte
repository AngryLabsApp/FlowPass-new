<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/services/supabase/client';
  import { clearSupabaseStorage } from '$lib/services/supabase/auth';
  import { PUBLIC_BD_URL } from '$env/static/public';
  import { goto } from '$app/navigation';

  onMount(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        if (error?.message === 'Auth session missing!') {
          clearSupabaseStorage(PUBLIC_BD_URL);
        }
      } else {
        clearSupabaseStorage(PUBLIC_BD_URL);
      }
    } catch {
      clearSupabaseStorage(PUBLIC_BD_URL);
    } finally {
      goto('/login'); // redirige siempre al login
    }
  });
</script>

<!-- Nada visible -->
