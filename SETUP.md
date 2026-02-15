# Journey Tracker - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create React App
Open your terminal and run:

```bash
npx create-react-app journey-tracker
cd journey-tracker
```

**What this does**: Creates a new React project with all necessary build tools configured.

---

### Step 2: Install Dependencies

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

**Packages installed**:
- `lucide-react`: Icon library for UI elements
- `tailwindcss`: CSS framework for styling
- `postcss`, `autoprefixer`: Required for Tailwind

---

### Step 3: Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

**What this does**: Creates configuration files for Tailwind CSS.

---

### Step 4: Configure Tailwind

Open `tailwind.config.js` and replace its content with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**What this does**: Tells Tailwind where to look for class names in your files.

---

### Step 5: Add Tailwind to CSS

Open `src/index.css` and replace its content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**What this does**: Imports Tailwind styles and adds basic CSS reset.

---

### Step 6: Replace App.js

Open `src/App.js` and replace its entire content with the code from `journey-tracker.jsx`.

**Important**: Make sure to keep this line at the top:
```javascript
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Flag, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
```

---

### Step 7: Run the Application

```bash
npm start
```

**What happens**:
- Development server starts
- Browser opens automatically at `http://localhost:3000`
- You'll see the Journey Tracker app running
- Changes you make will auto-reload

---

## 📁 Final Project Structure

```
journey-tracker/
├── node_modules/          (installed packages)
├── public/
│   ├── index.html         (HTML template)
│   └── ...
├── src/
│   ├── App.js            ← Your journey tracker code goes here
│   ├── index.css         ← Tailwind imports
│   ├── index.js          (React entry point)
│   └── ...
├── package.json          (project dependencies)
├── tailwind.config.js    (Tailwind configuration)
└── README.md
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] App opens in browser at localhost:3000
- [ ] You see "Journey Tracker" header with blue gradient background
- [ ] "Add Journey" button is visible
- [ ] Statistics show "0" for Planning, Ongoing, Completed
- [ ] No errors in browser console (F12)

---

## 🔧 Troubleshooting

### Issue: "Command not found: npx"
**Solution**: Install or update Node.js from https://nodejs.org/

### Issue: Port 3000 already in use
**Solution**: Kill the process using port 3000 or run on different port:
```bash
PORT=3001 npm start
```

### Issue: Module not found errors
**Solution**: Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind styles not applying
**Solution**: 
1. Check `tailwind.config.js` content paths
2. Restart dev server (Ctrl+C, then `npm start`)
3. Clear browser cache

### Issue: Icons not showing
**Solution**: Verify lucide-react is installed:
```bash
npm list lucide-react
```
If missing, install again: `npm install lucide-react`

---

## 🎨 Customization Tips

### Change Color Scheme
In the code, find these classes and modify:
- `bg-indigo-600` → change to `bg-blue-600`, `bg-purple-600`, etc.
- `text-indigo-600` → match the background color

### Modify Form Fields
Add new fields by:
1. Adding property to `formData` state
2. Adding input in form JSX
3. Including in journey object when saving

### Add Validation
Add validation in `handleSubmit`:
```javascript
if (!formData.title.trim()) {
  alert('Title is required');
  return;
}
```

---

## 📱 Making it Mobile-Friendly

The app is already responsive! Test by:
1. Opening browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select different device sizes

---

## 💾 Building for Production

When ready to deploy:

```bash
npm run build
```

This creates optimized files in the `build/` folder that you can deploy to any web host.

**Popular hosting options**:
- Netlify (free, easy drag-and-drop)
- Vercel (free, excellent for React)
- GitHub Pages (free, requires some setup)
- Firebase Hosting (free tier available)

---

## 🔄 Next Steps

1. **Test the app**: Add a few journeys to see how it works
2. **Read the code**: Open App.js and read through the comments
3. **Customize**: Change colors, add features, make it your own
4. **Study the docs**: Check DOCUMENTATION.md for deep explanations

---

## 💡 Quick Reference - Common npm Commands

```bash
npm start          # Run development server
npm run build      # Build for production
npm test           # Run tests
npm install <pkg>  # Install new package
npm uninstall <pkg> # Remove package
```

---

## 🎓 Learning Path

If you're new to React:
1. Understand how useState works (state management)
2. Learn useEffect (side effects and lifecycle)
3. Practice with array methods (map, filter)
4. Explore React DevTools browser extension

---

## 📞 Need Help?

- Check DOCUMENTATION.md for detailed explanations
- Read code comments - every section is explained
- Use browser console (F12) to see errors
- React docs: https://react.dev

---

## ✨ You're All Set!

Your Journey Tracker is ready to use. Start adding your adventures! 🗺️
