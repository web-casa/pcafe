# Photos

Optional Unsplash mood photos (cover, section and scene backgrounds). They are
not shipped with PCafe, because the Unsplash license does not allow
redistributing a collection. Download your own with your free API key:

```
UNSPLASH_ACCESS_KEY=your-key npx pcafe photos office:3 city:3
```

Files are named `photo-<category>-NN.webp` (1920x1080) and `credits.json`
records author and link for each one. Use them for atmosphere only, never as
"our customer / team / product / office", and credit them in the slide
`source` as `Photo: Unsplash / <author>`.
