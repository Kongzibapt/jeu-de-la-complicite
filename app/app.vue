<script setup lang="ts">
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "8wBBZjp7946Sw8-oH7UhKG6jsU4jI6jQB-AIxMGqDig"
    }
  ]
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
