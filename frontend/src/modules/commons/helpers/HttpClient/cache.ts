import { HttpClienteCache } from './types';
import { AxiosRequestConfig, AxiosInstance } from 'axios';

export function createCache(httpClient: AxiosInstance) {
  const cachedRequests: Record<string, HttpClienteCache> = {};

  const getCacheKey = (url: string, config: AxiosRequestConfig): string => {
    const normalizedParams = JSON.stringify(config.params);
    return `${url}?${normalizedParams}`;
  };

  const createPromise = (key: string, url: string, config: AxiosRequestConfig): Promise<any> => {
    const pendingPromise = httpClient.get(url, config);
    cachedRequests[key] = {
      promise: pendingPromise,
      expires_at: Date.now() + 1000 * 60 // 1 minuto
    };
    return pendingPromise;
  };

  // Recupera a promise de uma requisição já feita
  const get = (url: string, config: AxiosRequestConfig): Promise<any> => {
    const key = getCacheKey(url, config);

    // Se não existe promise da request, cria a promise, salva no cache e retorna
    if (!cachedRequests[key]) {
      return createPromise(key, url, config);
    }

    const { promise: cachedPromise, expires_at } = cachedRequests[key];
    // Se existe promise da request, verifica se ela expirou
    if (expires_at < Date.now()) {
      // Se expirou, cria a promise e salva no cache
      createPromise(key, url, config);
    }
    // Retorna a promise cacheada
    return cachedPromise;
  };

  return {
    get
  };
}
