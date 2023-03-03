import axios, { AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios';
import StorageUtils from '@/helpers/handleBrowserStorage';

export class AxiosService {
  readonly service;

  constructor() {
    // const tokenAccess = StorageUtils.getToken()
    const service = axios.create({
      withCredentials: false,
      responseType: 'json',
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_API_BACKEND || '',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Authorization: 'Bearer ' + tokenAccess
      },
    });
    service.interceptors.request.use(this.handleInterceptRequest);
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  setHeader(name: any, value: any) {
    this.service.defaults.headers.common[name] = value;
  }

  removeHeader(name: string) {
    delete this.service.defaults.headers.common[name];
  }

  handleInterceptRequest(config: any) {
    return config;
  }

  handleSuccess(response: any) {
    return response.data;
  }

  handleError = (error: any) => {
    // if (error?.response?.status === 401) {
    //   throw error
    // }
    throw error;
  };

  redirectTo = (document: any, path: string) => {
    document.location = path;
  };

  getOptionsAuth = (options?: any) => {
    const customOptions = { ...(options || {}) };
    const tokenAccess = StorageUtils.getToken();
    customOptions.headers = customOptions.headers || {};
    customOptions.headers.Authorization = `Bearer ${tokenAccess}`;
    return customOptions;
  };

  async get<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    return this.service.get(endpoint, options);
  }

  async post(endpoint: string, payload: any, options?: AxiosRequestConfig) {
    return this.service.post(endpoint, payload, options);
  }

  async put(endpoint: string, payload: any, options?: AxiosRequestConfig) {
    return this.service.put(endpoint, payload, options);
  }

  async patch(endpoint: string, payload: any, options?: AxiosRequestConfig) {
    return this.service.patch(endpoint, payload, options);
  }

  async delete(endpoint: string, options?: AxiosRequestConfig) {
    return this.service.delete(endpoint, options);
  }

  async getAuth(endpoint: string, options?: any) {
    const customOptions = this.getOptionsAuth(options);
    return this.service.get(endpoint, customOptions);
  }

  async postAuth(endpoint: string, payload: any, options?: any) {
    const customOptions = this.getOptionsAuth(options);
    return this.service.post(endpoint, payload, customOptions);
  }

  async putAuth(endpoint: string, payload: any, options?: any) {
    const customOptions = this.getOptionsAuth(options);
    return this.service.put(endpoint, payload, customOptions);
  }

  async patchAuth(endpoint: string, payload: any, options?: any) {
    const customOptions = this.getOptionsAuth(options);
    return this.service.patch(endpoint, payload, customOptions);
  }

  async deleteAuth(endpoint: string, options?: any) {
    const customOptions = this.getOptionsAuth(options);
    return this.service.delete(endpoint, customOptions);
  }
}

export default new AxiosService();
