import sharp from "sharp";
import { readdir, mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
const source = process.argv[2] || "C:/Users/muril/Pictures/imagens do site";
const files = (await readdir(source)).filter((f) =>
  /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f),
);
const inventory = [];
for (const file of files) {
  const m = await sharp(path.join(source, file)).metadata();
  inventory.push({ file, width: m.width, height: m.height, format: m.format });
}
await mkdir("public/photos", { recursive: true });
await mkdir("src/data", { recursive: true });
const selected = [
  "10.jpeg",
  "6.jpeg",
  "9.jpeg",
  "12.jpeg",
  "11.jpeg",
  "WhatsApp Image 2026-09-14 at 09.12.55.jpeg",
  "14.jpeg",
  "WhatsApp Image 2026-09-14 at 09.12.58.jpeg",
  "8.jpeg",
  "1.jpeg",
];
const photos = [];
for (const [i, file] of selected.entries()) {
  const base = `memory-${i + 1}`;
  let metadata;
  for (const width of [480, 960, 1440]) {
    metadata = await sharp(path.join(source, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(`public/photos/${base}-${width}.webp`);
  }
  photos.push({
    id: i,
    src: `photos/${base}-1440.webp`,
    srcSet: [480, 960, 1440]
      .map((w) => `photos/${base}-${w}.webp ${w}w`)
      .join(", "),
    width: metadata.width,
    height: metadata.height,
    alt: `Fotografia da coleção de memórias, ${i + 1}`,
  });
}
await writeFile("src/data/photos.json", JSON.stringify(photos, null, 2));
await writeFile("photo-inventory.json", JSON.stringify(inventory, null, 2));
const music = (await readdir(source)).find((f) =>
  /\.(mp3|m4a|ogg|wav)$/i.test(f),
);
if (music)
  await copyFile(
    path.join(source, music),
    `public/music${path.extname(music)}`,
  );
console.log(
  `${files.length} imagens analisadas; ${photos.length} memórias otimizadas. Originais preservados.`,
);
