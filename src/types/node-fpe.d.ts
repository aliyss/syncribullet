declare module 'node-fpe' {
  interface FPECipher {
    encrypt(input: string): string;
    decrypt(input: string): string;
  }

  interface FPEOptions {
    secret: string;
    domain?: string[];
  }

  function fpe(options: FPEOptions): FPECipher;

  export = fpe;
}
