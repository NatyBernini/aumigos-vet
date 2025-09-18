import { createHttpClient } from './HttpClient';

export interface AxiosInterceptorCallbacks {
  onSuccess?: (value: any) => any;
  onError?: (error: any) => any;
}

export interface HttpClienteCache {
  promise: Promise<any>;
  expires_at: number;
}

export type httpClient = ReturnType<typeof createHttpClient>;
