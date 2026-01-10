# 🚀 Foodies Chat Widget - Deployment Guide

## How to Connect the Chat Widget to Your Website

There are **3 methods** to integrate the chat widget into your website:

---

## Method 1: Build and Embed (Recommended)

This method creates a standalone JavaScript file you can add to any website.

### Step 1: Build the Widget

```bash
npm run build
```

This creates a `dist/` folder with compiled files.

### Step 2: Upload Files to Your Server

Upload these files from the `dist/` folder to your website:
- `assets/index-[hash].js`
- `assets/index-[hash].css`

### Step 3: Add to Your Website

Add this code to your website's HTML (before closing `</body>` tag):

```html
<!-- Add the chat widget CSS -->
<link rel="stylesheet" href="/path/to/assets/index-[hash].css">

<!-- Add the chat widget container -->
<div id="foodies-chat-root"></div>

<!-- Add the chat widget script -->
<script type="module" src="/path/to/assets/index-[hash].js"></script>
```

---

## Method 2: CDN Hosting (Easiest)

### Step 1: Build the Widget
```bash
npm run build
```

### Step 2: Host on CDN
Upload the `dist/` folder to a CDN like:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Step 3: Add to Any Website

```html
<!-- Add before </body> -->
<div id="root"></div>
<script type="module" crossorigin src="https://your-cdn.com/assets/index-[hash].js"></script>
<link rel="stylesheet" href="https://your-cdn.com/assets/index-[hash].css">
```

---

## Method 3: iframe Embed (Isolated)

Host the chat widget as a separate page and embed it.

### Step 1: Deploy as Standalone App

Deploy the entire app to:
- Netlify: `npm run build` → drag `dist/` folder
- Vercel: Connect GitHub repo
- Your own server

### Step 2: Embed with iframe

```html
<!-- Add to your website -->
<iframe 
  src="https://your-chat-widget.com" 
  style="position: fixed; bottom: 20px; right: 20px; width: 450px; height: 600px; border: none; z-index: 9999;"
  title="Foodies Chat"
></iframe>
```

---

## Quick Deploy Options

### Option A: Netlify (Free & Fast)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Go to Netlify:**
   - Visit https://app.netlify.com/drop
   - Drag the `dist/` folder
   - Get your URL: `https://your-site.netlify.app`

3. **Add to your website:**
   ```html
   <iframe src="https://your-site.netlify.app" 
           style="position: fixed; bottom: 20px; right: 20px; width: 450px; height: 600px; border: none; z-index: 9999;">
   </iframe>
   ```

### Option B: Vercel (Free & Fast)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Get your URL and embed:**
   ```html
   <iframe src="https://your-project.vercel.app" 
           style="position: fixed; bottom: 20px; right: 20px; width: 450px; height: 600px; border: none; z-index: 9999;">
   </iframe>
   ```

---

## Configuration Before Deployment

### 1. Update API Endpoint

In `src/FoodiesChatWidget.jsx`, change:

```javascript
// FROM:
const response = await fetch('http://localhost:5000/api/chat', {

// TO:
const response = await fetch('https://your-backend.com/api/chat', {
```

### 2. Enable CORS on Backend

Your backend must allow requests from your website:

```python
# Python Flask example
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://your-website.com'])
```

### 3. Build for Production

```bash
npm run build
```

---

## Testing Before Deployment

### Test Locally:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:5173

3. **Test all features:**
   - ✅ Chat opens/closes
   - ✅ Messages send/receive
   - ✅ Quick reply buttons work
   - ✅ Session timeout works
   - ✅ Auto-close works

### Test Production Build:

```bash
npm run build
npm run preview
```

Open: http://localhost:4173

---

## Customization for Your Website

### Change Position

```html
<!-- Bottom Right (default) -->
<style>
  #foodies-chat-root {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
</style>

<!-- Bottom Left -->
<style>
  #foodies-chat-root {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9999;
  }
</style>
```

### Mobile Responsive

The widget is already responsive, but you can hide it on mobile:

```html
<style>
  @media (max-width: 768px) {
    #foodies-chat-root {
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
    }
  }
</style>
```

---

## File Structure After Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      ← Main JavaScript
│   ├── index-[hash].css     ← Styles
│   └── [other assets]
└── vite.svg
```

---

## Environment Variables (Optional)

Create `.env` file:

```env
VITE_API_URL=https://your-backend.com/api
VITE_SESSION_TIMEOUT=7200000
```

Use in code:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## Troubleshooting

### Issue: Chat doesn't appear

**Solution:** Check browser console for errors. Ensure:
- JavaScript file loaded correctly
- CSS file loaded correctly
- No CORS errors

### Issue: API calls fail

**Solution:** 
- Check backend URL is correct
- Enable CORS on backend
- Check network tab in browser DevTools

### Issue: Styles look broken

**Solution:**
- Ensure CSS file is loaded
- Check for CSS conflicts with main website
- Use iframe method for complete isolation

---

## Production Checklist

Before deploying:

- [ ] Update API endpoint to production URL
- [ ] Test all features work
- [ ] Enable CORS on backend
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Upload to hosting service
- [ ] Test on actual website
- [ ] Test on mobile devices
- [ ] Monitor for errors

---

## Support

If you need help:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify backend is running and accessible
4. Test widget in isolation first

---

## Quick Start (Fastest Way)

```bash
# 1. Build
npm run build

# 2. Deploy to Netlify
# Go to https://app.netlify.com/drop
# Drag the 'dist' folder

# 3. Add to your website
<iframe src="https://your-netlify-url.netlify.app" 
        style="position: fixed; bottom: 20px; right: 20px; width: 450px; height: 600px; border: none; z-index: 9999;">
</iframe>
```

Done! Your chat widget is live! 🎉
