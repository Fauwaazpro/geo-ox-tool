# Deploying this project to GitHub + Vercel

Prerequisites
- Install Git and set `user.name`/`user.email`.
- Install GitHub CLI: https://cli.github.com/
- Install Vercel CLI: https://vercel.com/docs/cli

Quick automated flow (recommended if you have `gh` and `vercel`):

1. From the repo root run (PowerShell):

```
.\scripts\create_repo_and_deploy.ps1 -RepoName my-repo-name -Visibility public -VercelProjectName my-vercel-project
```

2. The script will:
   - Initialize git (if needed), commit current files, create the GitHub repo and push.
   - Trigger a production deployment to Vercel (after you authenticate with `vercel login`).

Manual alternative (web UIs):
1. Create a new repo on GitHub via https://github.com/new and push your local repo.
2. Go to https://vercel.com/import and import the GitHub repository.
3. In Vercel dashboard, set Environment Variables (e.g., `NEXT_PUBLIC_*`, `SUPABASE_*`) under Project Settings → Environment.

Notes
- If your project requires native binaries (e.g., `sharp`), Vercel will build in their environment; ensure `sharp` version is compatible. For large headless chrome usage (puppeteer/Chromium), consider using serverless functions or a separate worker.
- Use `vercel` or the dashboard to add custom domains and manage production branches.
