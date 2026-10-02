import { randomUUID } from "node:crypto";

export interface Link {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export interface NewLink {
  url: string;
  title?: string;
  tags?: string[];
}

export class LinkStore {
  private links = new Map<string, Link>();

  list(tag?: string): Link[] {
    const all = [...this.links.values()];
    const filtered = tag ? all.filter((link) => link.tags.includes(tag)) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(id: string): Link | undefined {
    return this.links.get(id);
  }

  create(input: NewLink): Link {
    const link: Link = {
      id: randomUUID(),
      url: input.url,
      title: input.title?.trim() || input.url,
      tags: [...new Set((input.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean))],
      createdAt: new Date().toISOString(),
    };
    this.links.set(link.id, link);
    return link;
  }

  delete(id: string): boolean {
    return this.links.delete(id);
  }
}
