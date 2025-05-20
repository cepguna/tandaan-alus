import { config } from '@dotenvx/dotenvx';

export const baseEnv =
  config({
    path: `${import.meta.dirname}/../../../../.env`,
  }).parsed ?? {};

export const dynamicEnvValues = {
  CEB_NODE_ENV: baseEnv.CEB_DEV === 'true' ? 'development' : 'production',
  CEB_DEV_LOCALE: baseEnv.CEB_DEV_LOCALE,
  CEB_EXAMPLE: baseEnv.CEB_EXAMPLE,
  CEB_CONVEX_URL: baseEnv.CEB_CONVEX_URL,
  CEB_CONVEX_DEPLOYMENT: baseEnv.CEB_CONVEX_DEPLOYMENT,
} as const;
