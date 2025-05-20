export const IS_DEV = process.env['CLI_CEB_DEV'] === 'true';
export const IS_PROD = !IS_DEV;
export const IS_FIREFOX = process.env['CLI_CEB_FIREFOX'] === 'true';
export const IS_CI = process.env['CEB_CI'] === 'true';
export const CONVEX_URL = process.env['CEB_CONVEX_URL'];
export const CONVEX_DEPLOYMENT = process.env['CEB_CONVEX_DEPLOYMENT'];
