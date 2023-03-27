/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare namespace NodeJS {
  export interface ProcessEnv {
    // env variables
    // example
    readonly ENV_VARIABLE: string;
    readonly NEXT_PUBLIC_ENV_VARIABLE: string;

    // env.local variables
    // example
    readonly ENV_LOCAL_VARIABLE?: string;
    readonly NEXT_PUBLIC_ENV_LOCAL_VARIABLE?: string;

    // env.development variables
    // example
    readonly DEVELOPMENT_ENV_VARIABLE?: string;
    readonly NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE?: string;

    // env.production variables
    // example
    readonly PRODUCTION_ENV_VARIABLE?: string;
    readonly NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE?: string;
  }
}
