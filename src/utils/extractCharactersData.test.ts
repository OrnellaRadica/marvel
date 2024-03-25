import { extractCharactersData } from "./extractCharactersData";
import { ZodError } from "zod";
import data from "./__mocks__/api_response.json";

describe("extractCharactersData", () => {
  it("Should return the correct data", () => {
    const output = extractCharactersData([data]);
    expect(output).toMatchInlineSnapshot(`
[
  {
    "description": "",
    "id": 1011334,
    "name": "3-D Man",
    "thumbnail": {
      "extension": "jpg",
      "path": "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784",
    },
    "url": "http://marvel.com/characters/74/3-d_man?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
  },
]
`);
  });

  it("Should not return url if 'detail url' is not provided ", () => {
    const output = extractCharactersData([
      {
        ...data,
        urls: [
          {
            type: "wiki",
            url: "http://marvel.com/universe/3-D_Man_(Chandler)?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
          },
          {
            type: "comiclink",
            url: "http://marvel.com/comics/characters/1011334/3-d_man?utm_campaign=apiRef&utm_source=47152527ba510896e61f6b56a1a68bde",
          },
        ],
      },
    ]);
    expect(output).toMatchInlineSnapshot(`
[
  {
    "description": "",
    "id": 1011334,
    "name": "3-D Man",
    "thumbnail": {
      "extension": "jpg",
      "path": "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784",
    },
    "url": undefined,
  },
]
`);
  });

  it("Should return empty array if incorrect data is provided", () => {
    const output = extractCharactersData({});
    expect(output).toEqual([]);
  });

  it("Should return an error if schema doesn't match", () => {
    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["name"],
        message: "Required",
      },
    ]);

    expect(() =>
      extractCharactersData([
        {
          ...data,
          name: undefined, // <-- This should return an error, name should be a string.
        },
      ])
    ).toThrow(error);
  });
});
