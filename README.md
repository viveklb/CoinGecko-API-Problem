# CoinScope

A responsive React dashboard that fetches the ten largest cryptocurrency markets from CoinGecko when the page loads.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Vercel

Import this repository in Vercel and select the Vite framework preset. Use `npm run build` as the build command and `dist` as the output directory. No environment variables are required.

Alternatively, run `vercel --prod` from the project directory using the Vercel CLI.

## Deploy to GitHub Pages

Push this project to a GitHub repository on the `main` branch and enable GitHub Actions as the Pages publishing source in **Settings → Pages**. The included workflow builds the app with the correct repository path and deploys it automatically. Once the workflow completes, GitHub Pages shows the published URL in the repository settings.

CoinGecko's public API may rate-limit requests. If a request fails, the dashboard shows the error and allows the page to be reloaded.
