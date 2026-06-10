import { describe, expect, it } from "vitest";
import { formatNumberLine, formatSalaryIQD } from "./types";

describe("number formatting", () => {
  it("uses regular commas on the line", () => {
    expect(formatNumberLine(1500000)).toBe("1,500,000");
    expect(formatSalaryIQD(1500000)).toBe("1,500,000 د.ع");
  });
});
