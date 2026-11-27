// Maakt public/og-default.jpg (1200×630) uit het logo. Eenmalig draaien: node scripts/og-image.mjs
import sharp from "sharp";

const d = "M26.474 0c9.219 0 15.863 6.739 15.863 18.731V43.11H28.95V19.622c0-4.756-2.28-7.432-7.038-7.432-5.355 0-8.527 2.973-8.527 8.325v22.594H0V.893h13.386l-.298 6.936C15.666 2.775 20.624 0 26.474 0zm41.935 0c15.17 0 23.4 11.298 22.408 26.065H58.792c1.288 4.358 4.858 6.837 10.907 6.837 4.858 0 8.526-1.882 10.607-3.369l7.637 8.224C83.876 41.325 78.72 44 69.896 44c-15.07 0-24.786-9.118-24.786-22.098C45.11 9.118 55.32 0 68.41 0zm.098 10.902c-5.253 0-8.824 2.379-9.913 7.432h18.74c-.598-4.657-3.57-7.432-8.827-7.432zM115.798 0C128.886 0 139 9.217 139 22.1c0 12.782-10.114 21.9-23.202 21.9-13.088 0-23.3-9.118-23.3-21.9 0-12.883 10.212-22.1 23.3-22.1zm-9.616 22.1c0 6.243 3.668 10.604 9.616 10.604 5.949 0 9.518-4.361 9.518-10.604 0-6.343-3.57-10.605-9.518-10.605s-9.616 4.262-9.616 10.605z";
const colors = ["#6ec3cc", "#596b86", "#874e46", "#f29e83", "#a0bba2"];
const band = colors.map((c, i) => `<rect x="${i * 240}" y="560" width="240" height="70" fill="${c}"/>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0" stop-color="#6ec3cc"/><stop offset="0.55" stop-color="#f29e83"/><stop offset="1" stop-color="#c8e6d4"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="#FAF9F6"/>${band}
  <g transform="translate(322 160) scale(4)"><path d="${d}" fill="url(#g)" fill-rule="evenodd"/></g>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(new URL("../public/og-default.jpg", import.meta.url).pathname);
console.log("public/og-default.jpg");
