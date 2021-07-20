/* eslint-disable no-magic-numbers */
import { preferredBandwidth } from "./bandwidth";
import { BandwidthEnum } from "./bandwidth-description";

describe("function bandwidth", () => {
  it("Should return 8 bit/s", () => {
    expect(preferredBandwidth(1)).toEqual(BandwidthEnum.Bits);
  });

  it("Should return 0 bit/s", () => {
    expect(preferredBandwidth(0)).toEqual(BandwidthEnum.Bits);
  });

  it("Should return 4 Gbit/s", () => {
    expect(preferredBandwidth(500000000)).toEqual(BandwidthEnum.GBits);
  });
});
