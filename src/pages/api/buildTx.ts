// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Token from '@/configs/ABIs/Erc20_mina.raw';
import Hooks from '@/configs/ABIs/Hooks';
import { Bridge } from '@/configs/ABIs/Bridge';
import {
  Experimental,
  fetchAccount,
  Field,
  Mina,
  PublicKey,
  UInt64,
} from 'o1js';
import moment from 'moment';

function getTime() {
  return moment().format('MMMM Do YYYY, h:mm:ss a');
}

interface Request extends NextApiRequest {
  body: {
    fromAddr: string;
    // brideAddr: string;
  };
}

const router = createRouter<Request, NextApiResponse>();

router.post(async (req, res) => {
  console.log(req.body);

  // hook pubkey
  const hook = PublicKey.fromBase58(
    'B62qj8oiQzRDzvGWS89mNkpKvufyYWMP9Uombsy73sLWBzHi9swY4a2'
  );

  // token pubkey
  const zkAppAddress = PublicKey.fromBase58(
    'B62qohaSdFQHsRwePtARWT8rUQMU92L5D5HWQ9pA2xUVJKHpytaW873'
  );

  // bridge pubkey
  const zkBridgeAddress = PublicKey.fromBase58(
    'B62qjw7APgQFKZKsufgVvoArwmpxppn7aPpmnAXXwpGPGzsX3vDQga3'
  );

  console.log('compile token', getTime());
  await Token.compile();

  console.log('compile hook', getTime());
  await Hooks.compile();

  console.log('compile bridge', getTime());
  await Bridge.compile();

  const zkApp = new Token(zkAppAddress);

  const zkBridge = new Bridge(zkBridgeAddress, zkApp.token.id);

  console.log('save instance', getTime());
  Mina.setActiveInstance(
    Mina.Network({
      mina: 'https://proxy.berkeley.minaexplorer.com/graphql',
      // mina: 'https://api.minascan.io/node/berkeley/v1/graphql',
      archive: 'https://api.minascan.io/archive/berkeley/v1/graphql/',
    })
  );

  console.log('fetch token account', getTime());
  // fetch token account
  await fetchAccount({
    publicKey: zkAppAddress,
  });

  console.log('fetch bridge account', getTime());
  // fetch bridge account
  await fetchAccount({
    publicKey: zkBridgeAddress,
  });

  console.log('fetch hook account', getTime());
  // fetch hook account
  await fetchAccount({
    publicKey: hook,
  });

  const sender = PublicKey.fromBase58(req.body.fromAddr);

  console.log('fetch sender account', getTime());
  // fetch sender
  const account = await fetchAccount({
    publicKey: sender,
  });

  console.log('build tx', getTime());
  let tx = await Mina.transaction(sender, async () => {
    const cb = Experimental.Callback.create(zkBridge, 'checkMinMax', [
      UInt64.from(1_000_000_000n),
    ]);
    await zkApp.lock(
      Field.from('0x64797030263Fa2f3be3Fb4d9b7c16FDf11e6d8E1'),
      zkBridgeAddress,
      cb
    );
  });

  console.log('prove tx', getTime());
  await tx.prove();

  res.status(200).json(tx.toJSON());
});

export default router.handler({
  onError: (err, req, res) => {
    console.error((err as any).stack);
    res.status(500).end((err as any).message);
  },
  onNoMatch: (req, res) => {
    console.log('🚀 ~ req:', req);
    res.status(404).end('Page is not found');
  },
});
