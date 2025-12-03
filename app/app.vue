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
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX",
    }
  ]
});

useHead({
  script: [
    {
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
