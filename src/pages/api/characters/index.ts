import { PRIVATE_KEY, PUBLIC_KEY } from "@/config";
import { apiResponseSchema } from "@/types/schemas";
import { extractCharactersData } from "@/utils/extractCharactersData";
import { generateMD5Hash } from "@/utils/generateMD5Hash";
import { randomUUID } from "crypto";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const getCharacters = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const time = randomUUID();
    const hash = generateMD5Hash(time + PRIVATE_KEY + PUBLIC_KEY);
    const limit = "6";
    const offset = req.query.offset;
    if (offset && typeof offset !== "string") {
      throw new Error("offset must be a string");
    }

    const url = new URL("http://gateway.marvel.com/v1/public/characters");
    url.searchParams.set("ts", time);
    url.searchParams.set("apikey", PUBLIC_KEY);
    url.searchParams.set("hash", hash);
    url.searchParams.set("limit", limit);
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const response = await fetch(url);
    const data = await response.json();
    const parsedData = apiResponseSchema.parse(data);

    const characters = extractCharactersData(parsedData.data.results);

    return res
      .status(200)
      .json({ characters, totalCharacters: parsedData.data.total });

  } catch (error) {
    res.status(500).json({
      error: JSON.stringify(error),
    });
    return;
  }
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getCharacters(req, res);
    default:
      return res.status(404).end();
  }
};

export default handler;
