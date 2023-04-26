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
import { handleRequest } from '@/helpers/handleAsync';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

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

const Home: NextPageWithLayout<Props> = (props) => {
  const exampleState = useAppSelector(getExampleState);
  const { t } = useTranslation();
  const params = useRouter();
  const { kbAccountId, sessionId } = params.query;

  // const { setCookie } = useCookie();
  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:15 ~ exampleState:', exampleState);
    console.log(t('common:page'));
    // setCookie('lang', 'vi', {
    //   expires: new Date(Date.now() + 86400e3),
    // });
  }, [props]);
  const kb_Account_Id = '9ec4531f-5b44-4969-b873-d33b730b74fc';

  //  demo run payment
  async function Run() {
    const [res, error] = await handleRequest(
      exampleService.getCheckoutSession({
        kbAccountId: kb_Account_Id,
        successUrl: `http://localhost:3001/?kbAccountId=${kb_Account_Id}&sessionId={CHECKOUT_SESSION_ID}`,
      })
    );
    if (error) return;
    console.log(res);
    const section_id_key_value = res.formFields.find(
      (item: any) => item && item.key === 'id'
    );
    const sessionId = section_id_key_value ? section_id_key_value.value : '';
    const [stripePromise, loadStripError] = await handleRequest(
      loadStripe(
        'pk_test_51N0F6RIorOjdgiplgPu9umOI5LZHaribNpt2BezH1LWXg5PNPZfeRNKcaybvsBBqpJrhoHUNAEDy2KyKatn6EWGt001VVNYnl5'
      )
    );
    if (loadStripError) return;

    stripePromise!.redirectToCheckout({
      sessionId,
    });
  }

  async function addPaymentMethod(account: string, session: string) {
    const [res, error] = await handleRequest(
      exampleService.addPaymentMethod({
        kbAccountId: account,
        sessionId: session,
      })
    );
  }

  async function createSubscription(account: string) {
    const [res, error] = await handleRequest(
      exampleService.createSubscription(
        {
          accountId: account,
          externalKey: account,
          productName: 'Sports',
          productCategory: 'BASE',
          billingPeriod: 'MONTHLY',
          priceList: 'DEFAULT',
        },
        {
          callCompletion: true,
          callTimeoutSec: 20,
        }
      )
    );
  }

  async function getAccountInvoices(account: string) {
    const [res, error] = await handleRequest(
      exampleService.getAccountInvoices({
        accountId: account,
      })
    );
    console.log(
      '🚀 ~ file: index.tsx:115 ~ getAccountInvoices ~ res, error:',
      res,
      error
    );
  }
  async function getAccount(account: string) {
    const [res, error] = await handleRequest(
      exampleService.getAccount({
        accountId: account,
        accountWithBalance: true,
        accountWithBalanceAndCBA: true,
      })
    );
    console.log(
      '🚀 ~ file: index.tsx:115 ~ getAccountInvoices ~ res, error:',
      res,
      error
    );
  }

  async function getCatalog() {
    const [res, error] = await handleRequest(exampleService.getCatalog());
  }

  useEffect(() => {
    getCatalog();
  }, []);

  useEffect(() => {
    // if (true) return;
    console.log(kbAccountId, sessionId);

    if (!!!kbAccountId || !!!sessionId) return;
    // addPaymentMethod(kbAccountId as string, sessionId as string);
    // createSubscription(kbAccountId as string);
    // getAccountInvoices(kbAccountId as string);
    // getAccount(kbAccountId as string);
  }, [kbAccountId, sessionId]);

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
      <button onClick={Run}>Pay</button>
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
