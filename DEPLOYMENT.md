# 🚀 Netlify Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `hatwifhat-memecoin`
5. Description: `Hatwifhat memecoin website with space adventure game`
6. Make it **Public**
7. **Don't** initialize with README (we already have one)
8. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hatwifhat-memecoin.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your `hatwifhat-memecoin` repository
4. **Build settings:**
   - Build command: (leave empty)
   - Publish directory: (leave empty)
5. Click "Deploy site"

## Step 4: Configure Environment Variables (Optional)

If you want to use environment variables for Supabase:

1. In Netlify, go to Site Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Step 5: Custom Domain (Optional)

1. In Netlify, go to Site Settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## Deployment Complete! 🎉

Your Hatwifhat memecoin website will be live at:
- `https://your-site-name.netlify.app` (default)
- Or your custom domain if configured

## Important Notes

- **Supabase Setup**: Make sure you've created the database tables as described in README.md
- **Game Testing**: Test the game functionality after deployment
- **Countdown Management**: Use the refresh button to sync countdown from database
- **Mobile Testing**: Test responsiveness on different devices

## Troubleshooting

- **Build Errors**: Check that all files are committed to GitHub
- **Game Not Working**: Verify Supabase credentials and database setup
- **Styling Issues**: Clear browser cache and refresh
- **Countdown Issues**: Check Supabase connection and table structure
