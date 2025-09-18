import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createHttpClient } from './HttpClient';

const getMock = vi.fn().mockResolvedValue({ data: 'get' });
const postMock = vi.fn().mockResolvedValue({ data: 'post' });
const putMock = vi.fn().mockResolvedValue({ data: 'put' });
const patchMock = vi.fn().mockResolvedValue({ data: 'patch' });
const deleteMock = vi.fn().mockResolvedValue({ data: 'delete' });
const useInterceptorMock = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: {
        request: { use: useInterceptorMock },
        response: { use: useInterceptorMock }
      },
      get: getMock,
      post: postMock,
      put: putMock,
      patch: patchMock,
      delete: deleteMock
    })
  }
}));

describe('HttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api with correct response on each request', async () => {
    const httpClient = createHttpClient();

    // Fazer uma requisição GET
    let retorno = await httpClient.get('/route');
    expect(retorno).toBe('get');

    // Fazer uma requisição POST
    retorno = await httpClient.post('/route');
    expect(retorno).toBe('post');

    // Fazer uma requisição PUT
    retorno = await httpClient.put('/route');
    expect(retorno).toBe('put');

    // Fazer uma requisição PATCH
    retorno = await httpClient.patch('/route');
    expect(retorno).toBe('patch');

    // Fazer uma requisição DELETE
    retorno = await httpClient.del('/route');
    expect(retorno).toBe('delete');
  });

  it('should return the same request in cache', async () => {
    const httpClient = createHttpClient();

    // Fazer uma requisição GET com cache
    const retorno = await httpClient.getCache('/route');
    expect(retorno).toBe('get');

    // Fazer outra requisição GET com cache
    getMock.mockResolvedValue({ data: 'new get' });
    let retornoCache = await httpClient.getCache('/route');
    expect(retornoCache).toBe('get');
    retornoCache = await httpClient.getCache('/route');
    expect(retornoCache).toBe('get');

    // Fazer uma requisição GET sem cache
    const retornoSemCache = await httpClient.get('/route');
    expect(retornoSemCache).toBe('new get');
  });

  it('should define request interceptors', () => {
    const httpClient = createHttpClient();

    // Verificar se os interceptors de Request foram definidos
    httpClient.defineRequestInterceptor({
      onSuccess: () => {},
      onError: () => {}
    });
    expect(useInterceptorMock).toHaveBeenCalledOnce();
  });

  it('should define response interceptors', () => {
    const httpClient = createHttpClient();

    // Verificar se os interceptors de Response foram definidos
    httpClient.defineResponseInterceptor({
      onSuccess: () => {},
      onError: () => {}
    });
    expect(useInterceptorMock).toHaveBeenCalledOnce();
  });
});
