import {
  ByteUnitEnum,
  orderedByteUnits,
  unitDescription as description,
} from "./unit-description";

export const normalizeBytes = (
  value: number,
  originalUnit: ByteUnitEnum,
  targetUnit: ByteUnitEnum
) => {
  const power =
    description[originalUnit].power10 - description[targetUnit].power10;
  return value * Math.pow(10, power);
};

export const preferredBytes = (
  value: number,
  originalUnit: ByteUnitEnum = ByteUnitEnum.B
): ByteUnitEnum => {
  const bytes = normalizeBytes(value, originalUnit, ByteUnitEnum.B);
  if (bytes === 0) {
    return orderedByteUnits[0];
  }
  const num = Math.max(Math.floor(Math.log(bytes) / Math.log(1000)), 0);
  return orderedByteUnits[num];
};

export const byteConverter = {
  normalizeBytes,
  preferredBytes,
};
