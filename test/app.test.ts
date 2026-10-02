import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "../src/app.js";

let server: Server;
let base: string;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

test("GET /health returns ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("links can be created, fetched, filtered and deleted", async () => {
  const created = await fetch(`${base}/links`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/post", title: "A post", tags: ["Reading"] }),
  });
  assert.equal(created.status, 201);
  const link = await created.json();
  assert.deepEqual(link.tags, ["reading"]);

  const fetched = await fetch(`${base}/links/${link.id}`);
  assert.equal(fetched.status, 200);

  const filtered = await (await fetch(`${base}/links?tag=reading`)).json();
  assert.equal(filtered.length, 1);

  const deleted = await fetch(`${base}/links/${link.id}`, { method: "DELETE" });
  assert.equal(deleted.status, 204);

  const missing = await fetch(`${base}/links/${link.id}`);
  assert.equal(missing.status, 404);
});

test("POST /links rejects invalid URLs", async () => {
  const res = await fetch(`${base}/links`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: "not a url" }),
  });
  assert.equal(res.status, 400);
});
