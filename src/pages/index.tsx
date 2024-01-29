import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  PreviewData,
} from 'next';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { NextPageWithLayout } from './_app';
import { LAYOUTS } from '@/components/layouts';
import { getExampleState, useAppSelector } from '@/store';
import { useEffect, useMemo } from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { LANG } from '@/configs/langs';
import styles from '@/styles/home.module.scss';
import variables from '@/styles/_variables.module.scss';
import { getStaticLocalePath } from '@/helpers/handleSeverProps';
import { ParsedUrlQuery } from 'querystring';
import exampleService from '@/services/exampleService';
import { handleRequest, handleRequestWithError } from '@/helpers/handleAsync';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Mina } from 'o1js';
import moment from 'moment';

const inter = Inter({ subsets: ['latin'] });

enum WalletName {
  METAMASK = 'METAMASK',
  AURO = 'AURO',
}

type Props = {
  lang: string;
} & SSRConfig;

export const getStaticPath: GetStaticPaths = async (context) => {
  return getStaticLocalePath<{ name: string }>({ fallback: false });
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const lang = context.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(lang)),
      lang: lang,
    },
  };
};
function getTime() {
  return moment().format('MMMM Do YYYY, h:mm:ss a');
}

const Home: NextPageWithLayout<Props> = (props) => {
  const exampleState = useAppSelector(getExampleState);
  const { t } = useTranslation();
  async function connectWallet(walletName: WalletName) {
    if (walletName === WalletName.METAMASK) {
      const snap = await window?.ethereum?.request<
        Record<string, { id: string; version: string }>
      >({
        method: 'wallet_getSnaps',
      });
      console.log('🚀 ~ connectWallet ~ snap:', snap);
      const snapId = process.env.NEXT_PUBLIC_REQUIRED_SNAP_ID as string;
      const version = process.env.NEXT_PUBLIC_REQUIRED_SNAP_VERSION as string;

      if (
        !snap ||
        !snap.hasOwnProperty(snapId) ||
        !snap[snapId] ||
        snap[snapId]?.version !== version
      ) {
        await window.ethereum?.request({
          method: 'wallet_requestSnaps',
          params: {
            [snapId]: {
              version: `^${version}`,
            },
          },
        });
      }
      const accountInfo = await window.ethereum?.request<any>({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'mina_accountInfo',
            params: {},
          },
        },
      });
      if (!accountInfo) return '';
      return accountInfo.publicKey || '';
    }
    const [res, error] = await handleRequestWithError(
      window!!.mina!!.requestAccounts()
    );
    if (error) throw error;

    if (!res || res.length === 0 || typeof res[0] === undefined) {
      throw new Error('fail');
    }
    return res[0];
  }
  const wallet: WalletName = WalletName.METAMASK;

  async function Run() {
    const addr = await connectWallet(wallet);
    // const [res, error] = await handleRequest(
    //   exampleService.buildTX({
    //     fromAddr: addr,
    //   })
    // );
    const [res, error] = await handleRequest(
      exampleService.buildTXnoCb({
        fromAddr: addr,
      })
    );
    // const [res, error] = await handleRequest(import('@/configs/test.json'));
    if (error || !res) return;

    const txJSON = res.data.replace('\\', '');
    // const txJSON: any = res;

    // console.log('🚀 ~ Run ~ txJSON:', JSON.parse(txJSON));
    console.log('sending transaction...', getTime());
    Mina.setActiveInstance(
      Mina.Network({
        mina: 'https://proxy.berkeley.minaexplorer.com/graphql',
        // mina: 'https://api.minascan.io/node/berkeley/v1/graphql',
        archive: 'https://api.minascan.io/archive/berkeley/v1/graphql/',
      })
    );

    // const tx = Mina.Transaction.fromJSON(txJSON);
    const tx = Mina.Transaction.fromJSON(JSON.parse(txJSON));
    await tx.prove();
    console.log(tx.toPretty());

    if (wallet === WalletName.METAMASK) {
      const snapId = process.env.NEXT_PUBLIC_REQUIRED_SNAP_ID as string;
      const sendRes = await window.ethereum?.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: snapId,
          request: {
            method: 'mina_sendTransaction',
            params: {
              transaction: tx.toJSON(),
              feePayer: {
                fee: 0.1,
              },
            },
          },
        },
      });
      console.log(
        '🚀 ~ file: index.tsx:57 ~ callZKTransaction ~ res:',
        getTime(),
        sendRes
      );
      return;
    }
    const sendRes = await handleRequestWithError(
      window!!.mina!!.sendTransaction({
        transaction: tx.toJSON(),
      })
    );
    console.log(
      '🚀 ~ file: index.tsx:165 ~ callZKTransaction ~ res:',
      getTime(),
      sendRes
    );
  }

  return (
    <>
      <div className={styles.description}>
        <Link
          href={'/'}
          locale={props.lang && props.lang == LANG.VI ? LANG.EN : LANG.VI}
          shallow={false}
          style={{ fontSize: variables.baseSize }}
        >
          Change to {props.lang && props.lang == LANG.VI ? LANG.EN : LANG.VI}
        </Link>
        <Link href={'/about'}>to About</Link>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/pages/index.tsx</code>
        </p>
        <div>
          <a
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            By{' '}
            <Image
              src='/vercel.svg'
              alt='Vercel Logo'
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <button onClick={Run} style={{ color: 'white' }}>
        Test
      </button>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src='/next.svg'
          alt='Next.js Logo'
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image src='/thirteen.svg' alt='13' width={40} height={31} priority />
        </div>
      </div>

      <div className={styles.grid}>
        <a
          href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          className={styles.card}
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className={inter.className}>
            Docs <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Find in-depth information about Next.js features and&nbsp;API.
          </p>
        </a>

        <a
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          className={styles.card}
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className={inter.className}>
            Learn <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          className={styles.card}
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className={inter.className}>
            Templates <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href='https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          className={styles.card}
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className={inter.className}>
            Deploy <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Instantly deploy your Next.js site to a shareable URL
            with&nbsp;Vercel.
          </p>
        </a>
      </div>
    </>
  );
};

Home.layout = LAYOUTS.MAIN_LAYOUT;

export default Home;
