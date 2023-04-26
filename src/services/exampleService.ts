import axiosService, { AxiosService } from './axiosService';
import { EP } from '@/services/config';

class PairDetailService {
  readonly service: AxiosService;
  readonly baseURL: string = `plugins/killbill-stripe`;

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
  getCheckoutSession = (query: { kbAccountId: string; successUrl: string }) => {
    return this.service.post<any>(`${this.baseURL}/checkout`, null, {
      auth: {
        username: 'admin',
        password: 'password',
      },
      headers: {
        'X-Killbill-ApiKey': 'bob',
        'X-Killbill-ApiSecret': 'lazar',
      },
      params: query,
    });
  };
  getCatalog = () => {
    return this.service.get<any>(`1.0/kb/catalog/availableBasePlans`, {
      auth: {
        username: 'admin',
        password: 'password',
      },
      headers: {
        'X-Killbill-ApiKey': 'bob',
        'X-Killbill-ApiSecret': 'lazar',
      },
    });
  };
  addPaymentMethod = (params: { kbAccountId: string; sessionId: string }) => {
    return this.service.post<any>(
      `1.0/kb/accounts/${params.kbAccountId}/paymentMethods?pluginProperty=sessionId=${params.sessionId}`,
      {
        pluginName: 'killbill-stripe',
      },
      {
        auth: {
          username: 'admin',
          password: 'password',
        },
        headers: {
          'X-Killbill-ApiKey': 'bob',
          'X-Killbill-ApiSecret': 'lazar',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Killbill-CreatedBy': 'demo',
          'X-Killbill-Reason': 'demo',
          'X-Killbill-Comment': 'demo',
        },
      }
    );
  };
  createSubscription = (
    payload: {
      accountId: string;
      externalKey: string;
      // planName: string;
      productName: string;
      productCategory: string;
      billingPeriod: string;
      priceList: string;
    },
    params: {
      callCompletion: boolean;
      callTimeoutSec: number;
    }
  ) => {
    return this.service.post<any>(`1.0/kb/subscriptions`, payload, {
      auth: {
        username: 'admin',
        password: 'password',
      },
      headers: {
        'X-Killbill-ApiKey': 'bob',
        'X-Killbill-ApiSecret': 'lazar',
        'Content-Type': 'application/json',
        'X-Killbill-CreatedBy': 'demo',
      },
      params,
    });
  };
  getAccount = (params: {
    accountId: string;
    accountWithBalance: boolean;
    accountWithBalanceAndCBA: boolean;
  }) => {
    return this.service.get<any>(`1.0/kb/accounts/${params.accountId}`, {
      auth: {
        username: 'admin',
        password: 'password',
      },
      headers: {
        'X-Killbill-ApiKey': 'bob',
        'X-Killbill-ApiSecret': 'lazar',
      },
      params: {
        accountWithBalance: params.accountWithBalance,
        accountWithBalanceAndCBA: params.accountWithBalanceAndCBA,
      },
    });
  };
  getAccountInvoices = (params: { accountId: string }) => {
    return this.service.get<any>(
      `1.0/kb/accounts/${params.accountId}/invoices`,
      {
        auth: {
          username: 'admin',
          password: 'password',
        },
        headers: {
          'X-Killbill-ApiKey': 'bob',
          'X-Killbill-ApiSecret': 'lazar',
        },
      }
    );
  };
}

export default new PairDetailService();
