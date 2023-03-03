import axiosService, { AxiosService } from './axiosService';
import { EP } from '@/services/config';

class PairDetailService {
  readonly service: AxiosService;
  readonly baseURL: string = `${process.env.NEXT_PUBLIC_BASE_URL_API_BACKEND}`;

  constructor() {
    this.service = axiosService;
  }

  getTradingHistory = (query: any) => {
    return this.service.get<any>(
      `${this.baseURL}${EP.tradingHistory}/${EP.recent}`,
      {
        params: query,
      }
    );
  };
}

export default new PairDetailService();
