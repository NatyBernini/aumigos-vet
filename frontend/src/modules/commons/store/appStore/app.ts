import { defineStore } from 'pinia';
import { API } from '@/modules/commons/services';
import { usePersistentStore } from '../persistentStore';
import { AppState } from '../types';

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    isAuthorized: false,
    userData: null
  }),

  actions: {
    async login(email: string, senha: string) {
      this.loading = true;
      try {
        const persistentStore = usePersistentStore();

        // Chama o endpoint de login
        const response = await API.post('/usuarios/login/', { email, senha });

        // Supondo que a resposta venha assim: { token: string, user: {...} }
        const { token, user } = response;

        // Salva o token no persistentStore
        persistentStore.jwtToken = token;

        // Atualiza os dados do usuário e marca como autorizado
        this.userData = user;
        this.isAuthorized = true;
      } catch (error: any) {
        // Tratar erros de login
        console.error('Erro ao efetuar login:', error);
        this.isAuthorized = false;
        this.userData = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      const persistentStore = usePersistentStore();

      // Limpa token e dados do usuário
      persistentStore.jwtToken = null;
      this.userData = null;
      this.isAuthorized = false;
    }
  }
});
