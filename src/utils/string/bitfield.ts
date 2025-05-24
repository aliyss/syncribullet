import { BitField8 } from './bitfield8';

export class WatchedBitField {
  private bitfield: BitField8;
  private videoIds: string[];

  constructor(bitfield: BitField8, videoIds: string[]) {
    this.bitfield = bitfield;
    this.videoIds = videoIds;
  }

  static constructFromArray(
    arr: boolean[],
    videoIds: string[],
  ): WatchedBitField {
    const bitfield = new BitField8(videoIds.length);
    arr.forEach((v, i) => bitfield.set(i, v));
    return new WatchedBitField(bitfield, videoIds);
  }

  static constructAndResize(
    serialized: string,
    videoIds: string[],
  ): WatchedBitField {
    const components = serialized.split(':');
    if (components.length < 3) {
      throw new Error('Invalid serialized format');
    }

    const serializedBuf = components.pop() as string;
    const anchorLength = parseInt(components.pop() as string, 10);
    const anchorVideoId = components.join(':');
    const anchorVideoIdx = videoIds.indexOf(anchorVideoId);
    const offset = anchorLength - 1 - anchorVideoIdx;

    if (anchorVideoIdx === -1) {
      return new WatchedBitField(new BitField8(videoIds.length), videoIds);
    }

    if (offset !== 0) {
      const prevBuf = BitField8.fromPacked(atob(serializedBuf), anchorLength);
      const resizedBitfield = new BitField8(videoIds.length);

      for (let i = 0; i < videoIds.length; i++) {
        const idxInPrev = i + offset;
        if (idxInPrev >= 0 && idxInPrev < prevBuf.length) {
          resizedBitfield.set(i, prevBuf.get(idxInPrev));
        }
      }
      return new WatchedBitField(resizedBitfield, videoIds);
    }

    const buf = BitField8.fromPacked(atob(serializedBuf), videoIds.length);
    return new WatchedBitField(buf, videoIds);
  }

  get(index: number): boolean {
    return this.bitfield.get(index);
  }

  set(index: number, value: boolean): void {
    this.bitfield.set(index, value);
  }

  setVideo(videoId: string, value: boolean): void {
    const idx = this.videoIds.indexOf(videoId);
    if (idx !== -1) {
      this.bitfield.set(idx, value);
    }
  }

  getVideo(videoId: string): boolean {
    const idx = this.videoIds.indexOf(videoId);
    return idx !== -1 ? this.bitfield.get(idx) : false;
  }

  serialize(): string {
    const packed = this.bitfield.toPacked();
    const packedStr = String.fromCharCode(...packed);
    const lastIdx = Math.max(0, this.bitfield.lastIndexOf(true));
    return `${this.videoIds[lastIdx]}:${lastIdx + 1}:${btoa(packedStr)}`;
  }
}
