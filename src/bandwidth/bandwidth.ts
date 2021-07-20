/* eslint-disable no-magic-numbers */
import { BandwidthEnum } from "./bandwidth-description";

export const preferredBandwidth = (
  bytes: number,
  periodInSeconds = 1
): BandwidthEnum => {
  const bits = (bytes * 8) / periodInSeconds;

  if (bits > 1000000000000) {
    return BandwidthEnum.TBits;
  } else if (bits > 1000000000) {
    return BandwidthEnum.GBits;
  } else if (bits > 1000000) {
    return BandwidthEnum.MBits;
  } else if (bits > 1000) {
    return BandwidthEnum.KBits;
  } else {
    return BandwidthEnum.Bits;
  }
};

export const normalizedBandwidth = (
  bytes: number,
  periodInSeconds: number,
  unit: BandwidthEnum,
  precision = 2
): number => {
  const bits = (bytes * 8) / periodInSeconds;

  switch (unit) {
    case BandwidthEnum.Bits:
      return Number(bits.toFixed(precision));
    case BandwidthEnum.KBits:
      return Number((bits / 1000).toFixed(precision));
    case BandwidthEnum.MBits:
      return Number((bits / 1000000).toFixed(precision));
    case BandwidthEnum.GBits:
      return Number((bits / 1000000000).toFixed(precision));
    case BandwidthEnum.TBits:
      return Number((bits / 1000000000000).toFixed(precision));
  }
};
