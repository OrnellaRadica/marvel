import { generateMD5Hash } from "./generateMD5Hash";

describe("generateMD5Hash", () => {
  it("Should generate an MD5 hash of the input data", () => {
    const data = "1abcd1234"; // Example of the marvel API data provided
    const output = generateMD5Hash(data);
    expect(output).toEqual("ffd275c5130566a2916217b101f26150");
  });
});
