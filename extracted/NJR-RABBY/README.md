# NJR RABBY — Premium 3D Website
Run locally: `npm install` then `npm run dev`. Build: `npm run build` (output in `dist/`).
## Deploy to Cloudflare Pages (free)
1. Push this folder to a GitHub repo (or use Direct Upload with the `dist` folder after `npm run build`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build` — Output directory: `dist` — then Save and Deploy.
`public/_redirects` already provides the SPA fallback.
## Needs real info / backend
Newsletter and contact forms are demos (validate only, nothing is sent). Social links, flavor descriptions and FAQ answers are placeholders to edit in `src/App.jsx`.
