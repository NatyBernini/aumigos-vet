import { defineStore } from 'pinia';
import { API } from '@/modules/commons/services';
import { usePersistentStore } from '../persistentStore';
import { AppState } from '../types';

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    isAuthorized: false,
    userData: null,
  }),

  actions: {
    async login(email: string, senha: string) {
      this.loading = true;
      try {
        const persistentStore = usePersistentStore();

        // Chama o endpoint de login
        const response = await API.post('/usuarios/login/', { email, password: senha });

        // Backend retorna: { refresh, access, usuario, clinica_ativa }
        const { access, refresh, usuario, clinica_ativa } = response;

        // Salva os dados no persistentStore
        persistentStore.jwtToken = access;
        persistentStore.refreshToken = refresh;
        persistentStore.clinicaAtiva = clinica_ativa ?? null;

        // Atualiza os dados do usuário e marca como autorizado
        this.userData = usuario;
        this.isAuthorized = true;

        // Faz chamada extra para garantir que userData está atualizado
        await this.fetchUserData();

        // Retorna clinica_ativa para a página decidir o redirecionamento
        return clinica_ativa ?? null;

      } catch (error: any) {
        console.error('Erro ao efetuar login:', error);
        this.isAuthorized = false;
        this.userData = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchUserData() {
      try {
        const response = await API.get('/usuarios/me');
        this.userData = response;
        this.isAuthorized = true
        console.log("data:", this.userData)
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        this.logout()
        throw error
      }
    },
    logout() {
      const persistentStore = usePersistentStore();

      // Limpa token, clínica ativa e dados do usuário
      persistentStore.jwtToken = null;
      persistentStore.refreshToken = null;
      persistentStore.clinicaAtiva = null;

      this.userData = null;
      this.isAuthorized = false;
    },
  },
});
