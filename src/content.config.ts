import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import yaml from "yaml";

const profile = defineCollection({
  loader: file("./src/data/profile.yaml", {
    parser: (text) => {
      const data = yaml.parse(text);
      return [{ id: "main", ...data }];
    },
  }),
  schema: z.object({
    name: z.string(),
    handle: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    links: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
        icon: z.string().optional(),
      })
    ),
  }),
});

export const collections = { profile };
