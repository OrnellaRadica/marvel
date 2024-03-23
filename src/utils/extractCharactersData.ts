import {
  Character,
  apiCharacterSchema,
  characterSchema,
} from "@/types/schemas";

export function extractCharactersData(data: unknown): Character[] {
  if (Array.isArray(data)) {
    const characters = data.map((c: unknown) => {
      const character = apiCharacterSchema.parse(c);

      const newUrl = character.urls?.find((item) => item.type === "detail");
      return characterSchema.parse({
        ...character,
        // This URL could return a 404.
        url: newUrl?.url,
      });
    });
    return characters;
  }
  return [];
}
