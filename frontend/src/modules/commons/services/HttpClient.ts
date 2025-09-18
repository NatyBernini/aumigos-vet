import { createHttpClient } from '@/modules/commons/helpers/HttpClient';
import { usePersistentStore } from '@/modules/commons/store/persistentStore/persistent';
import { useAppStore } from '@/modules/commons/store/appStore/app';

export const httpClient = createHttpClient({
  baseURL: import.meta.env.VITE_ENDPOINT,
  timeout: 15000
});

httpClient.defineRequestInterceptor({
  onSuccess: (conf) => {
    const persistentStore = usePersistentStore();
    const jwtToken = persistentStore.jwtToken;
    if (jwtToken) {
      conf.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return conf;
  },
  onError: () => Promise.reject({ msg: 'Erro no serviço', tipo: 'ERROR' })
});

httpClient.defineResponseInterceptor({
  onSuccess: (response) => {
    return response;
  },
  onError: async (data) => {
    if (data?.response?.status === 401) {
      const appStore = useAppStore();
      await appStore.logout();
    }
    return Promise.reject({ msg: 'A solicitação não foi completada, por favor verifique a conexão.', tipo: 'ERROR' });
  }
});
