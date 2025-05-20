import type { dynamicEnvValues } from './index.js';

interface ICebEnv {
  readonly CEB_EXAMPLE: string;
  readonly CEB_CONVEX_URL: string;
  readonly CEB_CONVEX_DEPLOYMENT: string;
  readonly CEB_DEV_LOCALE: string;
}

interface ICebCliEnv {
  readonly CLI_CEB_DEV: string;
  readonly CLI_CEB_FIREFOX: string;
}

export type IEnv = ICebEnv & ICebCliEnv & typeof dynamicEnvValues;
