import { z } from "zod";

const Thumbnail = z.object({
  path: z.string(),
  extension: z.string(),
});

const UrlsEntity = z.object({
  type: z.string(),
  url: z.string(),
});

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  thumbnail: Thumbnail,
  urls: z.array(UrlsEntity).nullable(),
});

export type Character = z.infer<typeof characterSchema>;
