// console.log('User Config', JSON.stringify(userConfig).length);
// console.log('compress-json', JSON.stringify(compressJson(userConfig)).length);
// console.log(
//   'lz-string',
//   compressToEncodedURIComponent(JSON.stringify(userConfig)).length,
// );
// const cipher = fpe({
//   secret: 'my-secret',
//   domain: JSON.stringify(userConfig)
//     .split('')
//     .reduce((acc, char) => {
//       if (!acc.includes(char)) {
//         acc.push(char);
//       }
//       return acc;
//     }, [] as string[]),
// });
// console.log('fpe', cipher.encrypt(JSON.stringify(userConfig)).length);
// const x = compressToEncodedURIComponent(
//   cipher.encrypt(JSON.stringify(userConfig)),
// );
// console.log('lz-string', x.length);
// console.log(cipher.decrypt(decompressFromEncodedURIComponent(x)));
import fpe from 'node-fpe';

export enum EncryptionType {
  FPE = 'f',
  NONE = 'n',
}

const encryptionTypeAppend = (encryptionType: EncryptionType) =>
  encryptionType.toString() + encryptionType.length;

const encryptionTypeRemove = (data: string) => {
  const encryptionTypeStringInt = data.substring(data.length, data.length - 1);
  const encryptionTypeInt = parseInt(encryptionTypeStringInt);
  if (isNaN(encryptionTypeInt)) {
    return {
      data: data.substring(0, data.length - 1),
      compressionType: EncryptionType.NONE,
    };
  }
  return {
    data: data.substring(0, data.length - (1 + encryptionTypeInt)),
    encryptionType: data.substring(
      data.length - 1,
      data.length - (1 + encryptionTypeInt),
    ),
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
