<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { closeSessionIfExists } from '$lib/services/supabase/session';

  onMount(async () => {
    await closeSessionIfExists();
    goto('/login');
  });
</script>

<!-- Nada visible -->
