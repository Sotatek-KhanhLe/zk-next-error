import BaseSocket from './baseSocket';
import { EXAMPLE_EVENT } from './config';

class ExampleSocket extends BaseSocket {
  private static instance: ExampleSocket;

  constructor() {
    super(`${process.env.NEXT_PUBLIC_BASE_URL_WS_BACKEND}`);
  }

  public static getInstance(): ExampleSocket {
    if (!ExampleSocket.instance) ExampleSocket.instance = new ExampleSocket();
    return ExampleSocket.instance;
  }

  listenPairsFilter(cb: (e: any) => void): boolean {
    this.listen(EXAMPLE_EVENT.PAIR_FILTER, (e: any) => {
      cb(e);
    });
    return true;
  }

  removePairsFilterListener() {
    this.removeListener(EXAMPLE_EVENT.PAIR_FILTER);
  }

  emitPairsFilter(emitData: any) {
    this.emitData(EXAMPLE_EVENT.PAIR_FILTER, emitData);
  }
}

export default ExampleSocket;
