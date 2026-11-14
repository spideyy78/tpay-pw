# Deploy on Vercel

## One-time login

```bash
npx vercel login
```

## Deploy (production)

```bash
cd tpay-local
npm run build:vercel
npx vercel deploy --prod
```

Or let Vercel run the build:

```bash
cd tpay-local
npx vercel deploy --prod
```

`vercel.json` sets `buildCommand` to `npm run build:vercel` and `outputDirectory` to `gateway`.

## After deploy

Open the production URL with the same query string as `LOCAL-URL.txt`, but replace the host:

`https://YOUR-PROJECT.vercel.app/?fbclid=...&utm_...`

Add `&fast=1` to skip the preparing loader.

## Import from Git (optional)

Vercel dashboard → Add project → root directory **`tpay-local`**.