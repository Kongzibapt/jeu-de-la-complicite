<script setup lang="ts">
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "WWLIZWTCy3f53NixEvyp15MsSg4v_fVpob4GH8eZ7mY"
    }
  ]
});

useHead({
  script: [
    {
      defer: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX",
    },
    {
      defer: true,
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7VFCVYWWEN');
      `
    }
  ]
});

</script>


<template>
  <NuxtPage />
</template>
