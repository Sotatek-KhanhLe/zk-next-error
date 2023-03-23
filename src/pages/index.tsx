import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { NextPageWithLayout } from './_app';
import { LAYOUTS } from '@/components/layouts';
import { getExampleState, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { LANG } from '@/configs/langs';
import styles from '@/styles/home.module.scss';
import variables from '@/styles/_variables.module.scss';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  lang: string;
} & SSRConfig;

export const getStaticPath: GetStaticPaths = async (context) => {
  return {
    paths: Object.values(LANG).map((lang) => ({ params: {}, locale: lang })),
    fallback: false,
  };
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
  // const { setCookie } = useCookie();

  useEffect(() => {
    console.log('🚀 ~ file: index.tsx:15 ~ exampleState:', exampleState);
    console.log(t('common:page'));
    // setCookie('lang', 'vi', {
    //   expires: new Date(Date.now() + 86400e3),
    // });
  }, [props]);

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
