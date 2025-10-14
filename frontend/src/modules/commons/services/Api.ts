import { createHttpClient } from '@/modules/commons/helpers/HttpClient';
import { usePersistentStore } from '@/modules/commons/store/persistentStore/persistent';
import { useAppStore } from '@/modules/commons/store/appStore/app';

export const API = createHttpClient({
  baseURL: import.meta.env.VITE_BACKEND,
  timeout: 15000
});

API.defineRequestInterceptor({
  onSuccess: (conf) => {
    const persistentStore = usePersistentStore();
    const jwtToken = persistentStore.jwtToken;
    if (jwtToken) {
      conf.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return conf;
  },
  onError: () =>
    Promise.reject({ msg: 'Erro no serviço', tipo: 'ERROR' })
});

API.defineResponseInterceptor({
  onSuccess: (response) => {
    return response;
  },
  onError: async (error) => {
    const appStore = useAppStore();
    // TO DO
    // se for 401 → desloga
    // if (error?.response?.status === 401) {
    //   await appStore.logout();
    // }

    // se backend retornou validação do DRF
    if (error?.response?.data && typeof error.response.data === 'object') {
      return Promise.reject({
        tipo: 'VALIDATION',
        errors: error.response.data // { email: [...], cnpj: [...] }
      });
    }

    // erro genérico
    return Promise.reject({
      tipo: 'ERROR',
      msg: 'A solicitação não foi completada, por favor verifique a conexão.'
    });
  }
});
