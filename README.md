# linkstash

A tiny HTTP API for saving links and organizing them with tags. Data is kept in memory, so it's handy for prototypes, demos and local tooling.

## Requirements

- Node.js 20 or later

## Getting started

```bash
npm install
npm run dev
```

The server listens on `http://localhost:3000` by default. Set `PORT` to change it.

## Endpoints

| Method | Path          | Description                                  |
| ------ | ------------- | -------------------------------------------- |
| GET    | `/health`     | Liveness check                               |
| GET    | `/links`      | List saved links, newest first. `?tag=` filters by tag |
| POST   | `/links`      | Save a link: `{ "url": "...", "title": "...", "tags": ["..."] }` |
| GET    | `/links/:id`  | Fetch one link                               |
| DELETE | `/links/:id`  | Remove a link                                |

Example:

```bash
curl -X POST http://localhost:3000/links \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","tags":["reading"]}'
```

## Scripts

- `npm run dev` – start with reload on change
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled server
- `npm test` – run the test suite

## License

MIT
