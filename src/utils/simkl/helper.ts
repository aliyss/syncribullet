export function createSimklHeaders(accessToken: string, id: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "simkl-api-key": id,
  };
}
