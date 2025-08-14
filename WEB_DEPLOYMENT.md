# Udyami Web Deployment Guide

This guide will help you deploy your Udyami React Native/Expo app as a web application that can be shared via a link.

## About Udyami

Udyami is a marketplace app that connects skilled workers (sellers) with customers (buyers) for various services including:
- 🎨 Painting
- 🔨 Carpentry  
- 🚿 Plumbing
- 🧺 Bamboo Work
- 💡 Electrical
- 🧱 Masonry
- 🧵 Tailoring
- 🌿 Gardening
- ⚒️ Welding
- 🏠 Roofing
- 🪵 Flooring
- 🪟 Glass Work
- 🔧 Appliance Repair
- 🧶 Handicrafts
- 🌳 Landscaping
- 🛋️ Interior Design

## Quick Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the web version:**
   ```bash
   npm run build:web:static
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts** - Vercel will give you a public URL like `https://your-app.vercel.app`

### Option 2: Netlify (Free & Easy)

1. **Build the web version:**
   ```bash
   npm run build:web:static
   ```

2. **Drag and drop** the `web-build` folder to [Netlify Drop](https://app.netlify.com/drop)

3. **Get your URL** - Netlify will provide a public URL

### Option 3: GitHub Pages

1. **Create a GitHub repository** and push your code

2. **Build the web version:**
   ```bash
   npm run build:web:static
   ```

3. **Enable GitHub Pages** in your repository settings

4. **Deploy** using GitHub Actions or manual upload

## Local Testing

Before deploying, test your web build locally:

```bash
# Build the web version
npm run build:web:static

# Serve locally
npm run serve:web
```

Visit `http://localhost:3000` to see your app.

## Features for Recruiters

When recruiters visit your deployed link, they'll see:

1. **Professional Landing Page** - Clean, modern UI with your app's branding
2. **Multi-language Support** - English, Hindi, and Kannada
3. **Role-based Navigation** - Buyer and Seller interfaces
4. **Responsive Design** - Works on desktop, tablet, and mobile
5. **Interactive Elements** - Working forms, navigation, and UI components
6. **Modern Tech Stack** - React Native, Expo, TypeScript, i18n

## Customization

### Update App Information

Edit `app.json` to customize:
- App name and description
- Colors and branding
- Meta tags for SEO

### Add Your Information

Consider adding a portfolio section or about page to showcase:
- Your role in the project
- Technologies used
- Development process
- Key features implemented

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure all dependencies are installed
   ```bash
   npm install
   ```

2. **Images not loading**: Check that all image paths are correct

3. **Styling issues**: Some React Native styles may need web-specific adjustments

### Performance Optimization

For better performance:
- Optimize images
- Enable compression on your hosting platform
- Consider using a CDN

## Next Steps

1. **Deploy** using one of the options above
2. **Test** the deployed version thoroughly
3. **Add the link** to your resume
4. **Monitor** analytics if available
5. **Update** as needed

## Support

If you encounter issues:
- Check the Expo documentation for web deployment
- Review the hosting platform's documentation
- Ensure all dependencies are compatible with web

---

**Good luck with your deployment!** 🚀
