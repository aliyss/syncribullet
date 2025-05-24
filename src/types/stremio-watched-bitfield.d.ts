declare module 'stremio-watched-bitfield' {
  interface WatchedBitField {
    getVideo(input: string): boolean;
  }

  function constructAndResize(
    cinemeta: string,
    episodeList: string[],
  ): WatchedBitField;

  export = {
    constructAndResize,
  };
}
