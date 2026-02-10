---
description: Update repository and deploy to Vercel with auto-version increment (User command: sube)
---

This workflow updates the git repository with all changes, increments the version, and deploys to Vercel in production mode.

1. Automatically increment version
   - Command: `node update-version.js`
2. Add all changes to git (including version updates)
// turbo
3. Commit changes with a default message "Update"
// turbo
4. Push changes to remote origin master
// turbo
5. Deploy to Vercel in production
   - Command: `vercel --prod`
