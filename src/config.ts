import { z } from "zod";

const envSchema = z.object({
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
});

export const { PUBLIC_KEY, PRIVATE_KEY } = envSchema.parse({
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
});
