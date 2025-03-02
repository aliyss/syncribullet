import lzString from 'lz-string';

export enum CompressionType {
  LZ = 'l',
  NONE = 'n',
  MAPPING = 'm',
}

const compressionTypeAppend = (compressionType: CompressionType) =>
  compressionType.toString();

const compressionTypeRemove = (
  data: string,
  index: number = 1,
): {
  data: string;
  compressionType: CompressionType;
} => {
  const compressionType = data.substring(data.length, data.length - index);
  if (compressionType.startsWith('z')) {
    index++;
    return compressionTypeRemove(data, index);
  }
  return {
    data: data.substring(0, data.length - index),
    compressionType: compressionType as CompressionType,
  };
};

const compressionMapping: Record<string, string> = {
  '"simkl":{': '~rs~',
  '"anilist":{': '~ra~',
  '"kitsu":{': '~rk~',
  '"a":{': '~sa~',
  '"client_id":"': '~sac~',
  '"access_token":"': '~saa~',
  '"c":"': '~sc~',
  '"l":"': '~sl~',
};

export const compress = (data: string, encryptionType: CompressionType) => {
  switch (encryptionType) {
    case CompressionType.MAPPING:
      let cM = data;

      for (const key in compressionMapping) {
        if (!Object.prototype.hasOwnProperty.call(compressionMapping, key)) {
          continue;
        }

        cM = cM.replace(new RegExp(key, 'g'), compressionMapping[key]);
      }
      return cM + compressionTypeAppend(encryptionType);
    case CompressionType.LZ:
    default:
      const cL = lzString.compressToEncodedURIComponent(data);
      if (cL.length > data.length) {
        return encodeURI(data) + 'n';
      }
      return cL + compressionTypeAppend(encryptionType);
  }
};

export const decompress = (data: string) => {
  const encrypted = compressionTypeRemove(data);
  switch (encrypted.compressionType) {
    case CompressionType.NONE:
      return decodeURI(encrypted.data);
    case CompressionType.MAPPING:
      let dM = encrypted.data;
      for (const key in compressionMapping) {
        if (!Object.prototype.hasOwnProperty.call(compressionMapping, key)) {
          continue;
        }

        dM = dM.replaceAll(compressionMapping[key], key.replace('\\', ''));
      }
      return dM;
    case CompressionType.LZ:
    default:
      return lzString.decompressFromEncodedURIComponent(encrypted.data);
  }
};
