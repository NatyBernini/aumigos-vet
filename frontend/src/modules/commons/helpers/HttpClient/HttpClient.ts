import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createCache } from './cache';
import { AxiosInterceptorCallbacks } from './types';

export function createHttpClient(config: AxiosRequestConfig = {}) {
  const axiosHttpClient = axios.create(config);
  const cacheHttpClient = createCache(axiosHttpClient);

  // GET Request padronizado
  function get(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    return axiosHttpClient.get(url, { ...config, params }).then((response: AxiosResponse) => response.data);
  }

  // GET Request com cache
  function getCache(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    return cacheHttpClient.get(url, { ...config, params }).then((response: AxiosResponse) => response.data);
  }

  // POST Request padronizado
  function post(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    return axiosHttpClient.post(url, params, config).then((response: AxiosResponse) => response.data);
  }

  // PATCH Request padronizado
  function patch(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    return axiosHttpClient.patch(url, params, config).then((response: AxiosResponse) => response.data);
  }

  // PUT Request padronizado
  function put(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    return axiosHttpClient.put(url, params, config).then((response: AxiosResponse) => response.data);
  }

  // DEL Request padronizado
  function del(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<any> {
    // Envia os dados no corpo da requisição usando 'data' em vez de 'params'
    return axiosHttpClient.delete(url, { ...config, data: params }).then((response: AxiosResponse) => response.data);
  }

  // Define os interceptors de Request
  function defineRequestInterceptor({ onSuccess, onError }: AxiosInterceptorCallbacks): void {
    axiosHttpClient.interceptors.request.use(onSuccess, onError);
  }

  // Define os interceptors de Response
  function defineResponseInterceptor({ onSuccess, onError }: AxiosInterceptorCallbacks): void {
    axiosHttpClient.interceptors.response.use(onSuccess, onError);
  }

  return {
    get,
    getCache,
    post,
    patch,
    put,
    del,
    defineRequestInterceptor,
    defineResponseInterceptor
  };
}
