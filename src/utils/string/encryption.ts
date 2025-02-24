import fpe from 'node-fpe';

export enum EncryptionType {
  FPE = 'f',
  NONE = 'n',
}

const encryptionTypeAppend = (encryptionType: EncryptionType) =>
  encryptionType.toString();

const encryptionTypeRemove = (
  data: string,
  index: number = 1,
): {
  data: string;
  encryptionType: EncryptionType;
} => {
  const encryptionType = data.substring(data.length, data.length - index);
  if (encryptionType.startsWith('z')) {
    index++;
    return encryptionTypeRemove(data, index);
  }
  return {
    data: data.substring(0, data.length - index),
    encryptionType: encryptionType as EncryptionType,
  };
};

export const encrypt = (
  data: string,
  secret: string,
  encryptionType: EncryptionType,
) => {
  switch (encryptionType) {
    case EncryptionType.NONE:
      return data + 'n';
    case EncryptionType.FPE:
    default:
      const cipher = fpe({
        secret,
        domain: data
          .split('')
          .reduce((acc, char) => {
            if (!acc.includes(char)) {
              acc.push(char);
            }
            return acc;
          }, [] as string[])
          .sort((a, b) => a.localeCompare(b)),
      });
      return cipher.encrypt(data) + encryptionTypeAppend(encryptionType);
  }
};

export const decrypt = (data: string, secret: string) => {
  const encrypted = encryptionTypeRemove(data);
  switch (encrypted.encryptionType) {
    case EncryptionType.NONE:
      return encrypted.data;
    case EncryptionType.FPE:
    default:
      const cipher = fpe({
        secret,
        domain: encrypted.data
          .split('')
          .reduce((acc, char) => {
            if (!acc.includes(char)) {
              acc.push(char);
            }
            return acc;
          }, [] as string[])
          .sort((a, b) => a.localeCompare(b)),
      });
      return cipher.decrypt(encrypted.data);
  }
};
