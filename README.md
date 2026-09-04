# Pulse — Real Daily News

This is a small static website plus one Vercel serverless function. It fetches fresh headlines from Google News RSS on the server, so visitors do not need an API key.

## Deploy on Vercel
1. Create a free account at https://vercel.com/
2. Install Node.js if using the command line.
3. From this folder run:
   `npx vercel`
4. Follow the prompts and deploy.
5. Every visitor gets fresh headlines; the browser also refreshes every 10 minutes.

You can also upload the project to GitHub and import the repository into Vercel.

## Important
The site links users to the original publisher through the Google News RSS result. It does not copy full articles.
For a production news brand, check the terms/licensing of the feeds and publishers you use.

## Local test
`npx vercel dev`
Then open the local URL Vercel gives you. Opening index.html directly will not run `/api/news`.
