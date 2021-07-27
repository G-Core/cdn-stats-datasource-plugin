/* eslint-disable no-magic-numbers */
import { byteConverter } from "./byte-converter";
import { ByteUnitEnum } from "./unit-description";

describe("byte-converter", () => {
  describe("Unit Converter base 10", () => {
    it("Should return 1000 B. Initial value: 1 KB", () => {
      const result = byteConverter.normalizeBytes(
        1,
        ByteUnitEnum.KB,
        ByteUnitEnum.B
      );
      expect(result).toEqual(1000);
    });

    it("Should return 0.001 MB. Initial value: 1 KB", () => {
      const result = byteConverter.normalizeBytes(
        1,
        ByteUnitEnum.KB,
        ByteUnitEnum.MB
      );
      expect(result).toEqual(0.001);
    });

    it("Should return 1 000 000 KB. Initial value: 1 GB", () => {
      const result = byteConverter.normalizeBytes(
        1,
        ByteUnitEnum.GB,
        ByteUnitEnum.KB
      );
      expect(result).toEqual(1000000);
    });

    it("Should return 1000 B. Initial value: 1 KB", () => {
      const result = byteConverter.normalizeBytes(
        1,
        ByteUnitEnum.KB,
        ByteUnitEnum.MB
      );
      expect(result).toEqual(0.001);
    });

    it("Should return 1000 B. Initial value: 1 KB", () => {
      const result = byteConverter.normalizeBytes(
        1,
        ByteUnitEnum.KB,
        ByteUnitEnum.B
      );
      expect(result).toEqual(1000);
    });

    it("Should return 25000 MB. Initial value: 25 GB", () => {
      const result = byteConverter.normalizeBytes(
        25,
        ByteUnitEnum.GB,
        ByteUnitEnum.MB
      );
      expect(result).toEqual(25000);
    });

    it("Should return 1.5 GB. Initial value: 1500 MB", () => {
      const result = byteConverter.normalizeBytes(
        1500,
        ByteUnitEnum.MB,
        ByteUnitEnum.GB
      );
      expect(result).toEqual(1.5);
    });

    it("Should return 1.5 GB. Initial value: 1500 MB", () => {
      const result = byteConverter.normalizeBytes(
        -1500,
        ByteUnitEnum.MB,
        ByteUnitEnum.GB
      );
      expect(result).toEqual(-1.5);
    });
  });

  describe("sizeToLargest", () => {
    it("Should return 2 KB", () => {
      const unit = byteConverter.preferredBytes(2000, ByteUnitEnum.B);
      expect(unit).toEqual(ByteUnitEnum.KB);
    });

    it("Should return 2 MB", () => {
      const unit = byteConverter.preferredBytes(2000, ByteUnitEnum.KB);
      expect(unit).toEqual(ByteUnitEnum.MB);
    });
  });
});
