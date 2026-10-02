import express from "express";
import { LinkStore } from "./store.js";

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function createApp(store = new LinkStore()) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/links", (req, res) => {
    const tag = typeof req.query.tag === "string" ? req.query.tag.toLowerCase() : undefined;
    res.json(store.list(tag));
  });

  app.post("/links", (req, res) => {
    const { url, title, tags } = req.body ?? {};

    if (typeof url !== "string" || !isHttpUrl(url)) {
      res.status(400).json({ error: "url must be a valid http or https URL" });
      return;
    }
    if (title !== undefined && typeof title !== "string") {
      res.status(400).json({ error: "title must be a string" });
      return;
    }
    if (tags !== undefined && (!Array.isArray(tags) || !tags.every((t) => typeof t === "string"))) {
      res.status(400).json({ error: "tags must be an array of strings" });
      return;
    }

    res.status(201).json(store.create({ url, title, tags }));
  });

  app.get("/links/:id", (req, res) => {
    const link = store.get(req.params.id);
    if (!link) {
      res.status(404).json({ error: "link not found" });
      return;
    }
    res.json(link);
  });

  app.delete("/links/:id", (req, res) => {
    if (!store.delete(req.params.id)) {
      res.status(404).json({ error: "link not found" });
      return;
    }
    res.status(204).end();
  });

  return app;
}
