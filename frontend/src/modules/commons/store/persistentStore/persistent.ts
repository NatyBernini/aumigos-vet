import { defineStore } from 'pinia';
import { PersistentState } from '../types';
import { useStorage } from '@vueuse/core';

export const usePersistentStore = defineStore('persistent', () => {
  const jwtToken = useStorage('jwtToken', null as string | null);
  const darkTheme = useStorage('darkTheme', false);

  return { jwtToken, darkTheme };
});
