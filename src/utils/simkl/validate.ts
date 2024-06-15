export const validateSimklUserConfig = (
  userConfig: Record<string, string> | undefined,
) => {
  if (!userConfig || !userConfig.accesstoken || !userConfig.clientid) {
    return;
  }
  return userConfig;
};
