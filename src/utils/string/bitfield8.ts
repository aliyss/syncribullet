import pako from 'pako';

export class BitField8 {
  private values: Uint8Array;
  public length: number;

  constructor(size: number) {
    this.length = size;
    const byteLength = Math.ceil(size / 8);
    this.values = new Uint8Array(byteLength);
  }

  static fromPacked(compressed: string, length?: number): BitField8 {
    const inflated = pako.inflate(compressed as any);
    const bf = new BitField8(0);
    bf.values = inflated;
    bf.length = typeof length === 'number' ? length : inflated.length * 8;

    const requiredBytes = Math.ceil(bf.length / 8);
    if (requiredBytes > inflated.length) {
      const newValues = new Uint8Array(requiredBytes);
      for (let i = 0; i < inflated.length; i++) {
        newValues[i] = inflated[i];
      }
      bf.values = newValues;
    }

    return bf;
  }

  get(index: number): boolean {
    if (index < 0 || index >= this.length)
      throw new RangeError('Index out of bounds');
    const byteIndex = index >> 3; // same as Math.floor(index / 8)
    const bit = index % 8;
    return (this.values[byteIndex] & (1 << bit)) !== 0;
  }

  set(index: number, value: boolean): void {
    if (index < 0 || index >= this.length)
      throw new RangeError('Index out of bounds');
    const byteIndex = index >> 3;
    const bit = index % 8;
    const mask = 1 << bit;
    if (value) {
      this.values[byteIndex] |= mask;
    } else {
      this.values[byteIndex] &= ~mask;
    }
  }

  lastIndexOf(value: boolean): number {
    for (let i = this.length - 1; i >= 0; i--) {
      if (this.get(i) === value) {
        return i;
      }
    }
    return -1;
  }

  toPacked(): Uint8Array {
    return pako.deflate(this.values);
  }
}
