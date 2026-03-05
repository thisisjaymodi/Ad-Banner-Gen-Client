# Ad Banner Generator Client

A React + Vite web app for creating restaurant-style promotional posters/banners from a visual editor.

## What this project does

This app lets you design a marketing poster in real time by filling out form fields and uploading assets, then export the final design as a PNG.

In the editor, you can:
- Upload a brand logo/icon
- Upload a hero/restaurant image (click or drag and drop)
- Enter business details (name, address, phone)
- Add offer headline and description
- Add validity dates/times
- Upload a QR code image
- Switch between preset color themes
- Download the rendered poster as a PNG using `html2canvas`

The left panel is the control form, and the right panel is a live poster preview.

## Tech stack

- React 19
- TypeScript
- Vite

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- Poster export loads `html2canvas` from CDN at download time if it is not already available on `window`.
- The current UI/content is tailored to restaurant promotion use cases.
