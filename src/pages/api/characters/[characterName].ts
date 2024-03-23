import { PRIVATE_KEY, PUBLIC_KEY } from "@/config";
import { extractCharactersData } from "@/utils/extractCharactersData";
import { generateMD5Hash } from "@/utils/generateMD5Hash";
import { randomUUID } from "crypto";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const getCharacterByName = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const time = randomUUID();
    const hash = generateMD5Hash(time + PRIVATE_KEY + PUBLIC_KEY);
    const characterName = req.query.characterName;

    const url = new URL("http://gateway.marvel.com/v1/public/characters");
    url.searchParams.set("ts", time);
    url.searchParams.set("apikey", PUBLIC_KEY);
    url.searchParams.set("hash", hash);

    if (characterName && typeof characterName === "string") {
      url.searchParams.set("name", characterName);
    }

    const response = await fetch(url);
    const data = await response.json();
    const characterData = extractCharactersData(data.data.results);

    res.status(200).json(characterData[0] || null);
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
      return getCharacterByName(req, res);
    default:
      return res.status(404).end();
  }
};

export default handler;
