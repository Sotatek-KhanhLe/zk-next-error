import axiosService, { AxiosService } from './axiosService';
import { EP } from '@/services/config';

class PairDetailService {
  readonly service: AxiosService;
  readonly baseURL: string = ``;

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

  buildTX(body: { fromAddr: string }) {
    return this.service.post<any>(`/buildTx`, body);
  }
}

export default new PairDetailService();
