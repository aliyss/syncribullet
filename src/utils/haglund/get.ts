export const getHaglundIds = async (type: string, id: string) => {
  const data = await fetch(
    `https://arm.haglund.dev/api/v2/ids?source=${type}&id=${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return await data.json();
};

export interface CinemetaEpisode {
  id: string;
  name: string;
  season: number;
  episode: number;
  number: number;
  released: string;
}
