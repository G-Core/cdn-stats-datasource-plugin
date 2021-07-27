export enum ByteUnitEnum {
  B = "B",
  KB = "KB",
  MB = "MB",
  GB = "GB",
  TB = "TB",
  PB = "PB",
  EB = "EB",
  ZB = "ZB",
  YB = "YB",
}

export const orderedByteUnits = [
  ByteUnitEnum.B,
  ByteUnitEnum.KB,
  ByteUnitEnum.MB,
  ByteUnitEnum.GB,
  ByteUnitEnum.TB,
  ByteUnitEnum.PB,
  ByteUnitEnum.EB,
  ByteUnitEnum.ZB,
  ByteUnitEnum.YB,
];

export const unitDescription = {
  [ByteUnitEnum.B]: {
    description: "Byte",
    power10: 3,
    power2: 0,
  },
  [ByteUnitEnum.KB]: {
    description: "KiloByte",
    power10: 6,
    power2: 10,
  },
  [ByteUnitEnum.MB]: {
    description: "MegaByte",
    power10: 9,
    power2: 20,
  },
  [ByteUnitEnum.GB]: {
    description: "GigaByte",
    power10: 12,
    power2: 30,
  },
  [ByteUnitEnum.TB]: {
    description: "TeraByte",
    power10: 15,
    power2: 40,
  },
  [ByteUnitEnum.PB]: {
    description: "PetaByte",
    power10: 18,
    power2: 50,
  },
  [ByteUnitEnum.EB]: {
    description: "ExaByte",
    power10: 21,
    power2: 60,
  },
  [ByteUnitEnum.ZB]: {
    description: "ZettaByte",
    power10: 24,
    power2: 70,
  },
  [ByteUnitEnum.YB]: {
    description: "YottaByte",
    power10: 24,
    power2: 80,
  },
};
