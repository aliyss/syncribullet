export const getCinemetaMeta = async (type: string, id: string) => {
  const data = await fetch(
    `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return await data.json();
};
