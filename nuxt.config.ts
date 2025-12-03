import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ssr: true,
  // ✅ on utilise seulement ces 2 modules SEO
  modules: ["@nuxtjs/sitemap", "@nuxtjs/robots"],

  // ✅ URL de ton site, utilisée par le sitemap pour générer les URLs absolues
  site: {
    url: "https://jeu-de-la-complicite.vercel.app",
    name: "Le jeu de la complicité",
  },

  // ✅ Config minimale du sitemap (en vrai il pourrait fonctionner sans rien ici)
  sitemap: {
    autoLastmod: true,
    urls: ["/", "/game"], // optionnel, les pages seront déjà découvertes automatiquement
  },

  // ✅ robots.txt simple qui autorise tout + pointe vers ton sitemap
  robots: {
    // autorise tout pour tous les robots
    allow: ["/"],
    // indique où se trouve ton sitemap
    sitemap: ["https://jeu-de-la-complicite.vercel.app/sitemap.xml"],
  },
});



