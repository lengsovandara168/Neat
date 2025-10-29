# 🎂 Birthday Page Customization Guide

## Quick Start

Your birthday page is now organized into **easy-to-use components**! Everything you need to customize is in one place.

## 📝 How to Customize

### 1. Change the Name and Message
Open `src/app/page.tsx` and find this section at the top:

```typescript
const BIRTHDAY_PERSON = {
  name: "Mok Chanmonineath",  // ← Change this
  photo: "/photos/moni-hero.svg",  // ← Update with your photo path
  message: "Wishing you a day filled with...",  // ← Write your custom message
};
```

### 2. Replace Photos
You have **7 placeholder images** ready to replace:

**Hero Photo (main portrait):**
- Location: `public/photos/moni-hero.svg`
- Size: 600×600 pixels (square)
- Used in: Hero section (the big circular photo)

**Gallery Photos:**
- Location: `public/photos/moni-1.svg` through `moni-6.svg`
- Size: 600×750 pixels (4:5 aspect ratio)
- Used in: Memories section (photo grid)

**To replace:**
1. Save your photos with the same filenames (or any name you want)
2. Update the paths in `src/app/page.tsx`:

```typescript
const PHOTOS = [
  { src: "/photos/moni-1.svg", alt: "Monineath smiling outdoors" },  // ← Change path and description
  { src: "/photos/moni-2.svg", alt: "Travel moment" },
  // ... add or remove photos as needed
];
```

### 3. Add or Remove Photos
In `src/app/page.tsx`, just add/remove items from the `PHOTOS` array:

```typescript
const PHOTOS = [
  { src: "/photos/photo1.jpg", alt: "Description 1" },
  { src: "/photos/photo2.jpg", alt: "Description 2" },
  { src: "/photos/photo3.jpg", alt: "Description 3" },
  // Add as many as you want!
];
```

## 🎨 Component Structure

Your page is now split into **6 reusable components**:

1. **BirthdayHeader** (`src/components/BirthdayHeader.tsx`)
   - Navigation bar with theme toggle
   - Sticky header that follows on scroll

2. **HeroSection** (`src/components/HeroSection.tsx`)
   - Main greeting with name, photo, and message
   - Customizable via props: `name`, `photoSrc`, `message`

3. **MemoriesSection** (`src/components/MemoriesSection.tsx`)
   - Photo gallery grid
   - Customizable via `photos` prop

4. **CelebrationSection** (`src/components/CelebrationSection.tsx`)
   - Celebration message section
   - Static content with decorative icons

5. **FutureSection** (`src/components/FutureSection.tsx`)
   - Future wishes section
   - Static content with animated icons

6. **BirthdayFooter** (`src/components/BirthdayFooter.tsx`)
   - Footer with copyright
   - Automatically updates year

## ⚙️ Custom Hooks

All effects are organized in `src/hooks/useBirthdayEffects.ts`:

- **useConfetti()** - Confetti animation + burst button
- **useScrollAnimations()** - Fade-in effects when scrolling
- **useThemeToggle()** - Dark/light mode toggle

## 🚀 Run Your Site

**Development mode:**
```bash
npm run dev
```
Open http://localhost:3000

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 💡 Tips

✅ **Supported image formats:** JPG, PNG, SVG, WebP, GIF  
✅ **Recommended photo sizes:**
- Hero: 600×600px (1:1 ratio)
- Gallery: 600×750px (4:5 ratio) or any consistent aspect ratio

✅ **To change colors:** Edit the Tailwind classes in each component  
✅ **To change animations:** Modify the keyframes in `src/app/globals.css`

## 🎉 That's It!

Your birthday page is now **modular**, **customizable**, and **easy to maintain**!

Have fun personalizing it! 🎂✨
