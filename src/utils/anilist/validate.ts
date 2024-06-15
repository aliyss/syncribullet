export const validateAnilistUserConfig = (
  userConfig: Record<string, string> | undefined,
) => {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  return userConfig;
};
