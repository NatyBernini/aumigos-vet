import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const usePersistentStore = defineStore('persistent', () => {
  const jwtToken = useStorage('jwtToken', null as string | null);
  const refreshToken = useStorage('refreshToken', null as string | null);
  const clinicaAtiva = useStorage('clinica_ativa', null as any | null);
  const darkTheme = useStorage('darkTheme', false);

  return { jwtToken, refreshToken, clinicaAtiva, darkTheme };
});
