import { LANG } from '@/configs/langs';
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

export type GetStaticLocalePathArg<P = ParsedUrlQuery> = {
  params?: P;
  fallback: boolean | 'blocking';
};

export function getStaticLocalePath<P>({
  // context,
  params,
  fallback,
}: GetStaticLocalePathArg<P>): GetStaticPathsResult {
  return {
    paths: Object.values(LANG).map((lang) => ({
      params: params ? params : {},
      locale: lang,
    })),
    fallback: fallback,
  };
}
