export async function getSimklItem(
  cinemetaInfo: any,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  return cinemetaInfo.meta;
}
