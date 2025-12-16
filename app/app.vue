<script setup lang="ts">
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "8wBBZjp7946Sw8-oH7UhKG6jsU4jI6jQB-AIxMGqDig"
    },
    { property: "og:image", content: "https://jeu-de-la-complicite.fr/og-image.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:type", content: "website" },
  ],
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "192x192", href: "/favicon-192.png" },
    { rel: "manifest", href: "/manifest.json" }
  ],
});

useHead({
  script: [
    {
      defer: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-J2XSQ7WFF1",
    },
    {
      defer: true,
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-J2XSQ7WFF1');
      `
    }
  ]
});
</script>


<template>
  <NuxtPage />
</template>
