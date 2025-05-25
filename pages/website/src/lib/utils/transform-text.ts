export const get2DigitName = (name?: string) => {
  if (!name) return 'DF';
  const splitName = name.toUpperCase().split('');
  return splitName[0] + '' + splitName[1];
};
