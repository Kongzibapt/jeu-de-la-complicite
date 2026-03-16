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

declare function gtag(...args: unknown[]): void;

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof gtag !== 'undefined') {
    gtag('event', name, params ?? {});
  }
}

const fabOpen = ref(false);
const showSuggestionForm = ref(false);
const suggestionText = ref('');

function toggleFab() {
  fabOpen.value = !fabOpen.value;
  if (fabOpen.value) {
    trackEvent('fab_open');
  } else {
    showSuggestionForm.value = false;
    suggestionText.value = '';
  }
}

function openSuggestionForm() {
  showSuggestionForm.value = true;
  trackEvent('fab_suggestion_open');
}

function sendSuggestion() {
  trackEvent('fab_suggestion_sent');
  const subject = encodeURIComponent('Suggestion — Jeu de la complicité');
  const body = encodeURIComponent(suggestionText.value.trim());
  window.open(`mailto:baptiste1296@gmail.com?subject=${subject}&body=${body}`, '_self');
  fabOpen.value = false;
  showSuggestionForm.value = false;
  suggestionText.value = '';
}

function trackDonation() {
  trackEvent('fab_donation_click');
}
</script>

<template>
  <NuxtPage />

  <!-- FAB suggestions / don -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">

    <!-- Popover ouvert -->
    <Transition name="fab-popover">
      <div
        v-if="fabOpen"
        class="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-3 w-64"
        role="dialog"
        aria-label="Actions rapides"
      >
        <!-- Menu principal -->
        <div v-if="!showSuggestionForm" class="flex flex-col gap-2">
          <button
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastelblue-500/20 transition text-left w-full"
            @click="openSuggestionForm"
          >
            <span class="text-xl" aria-hidden="true">💡</span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Suggérer une amélioration</p>
              <p class="text-xs text-slate-500">Donne ton avis ou propose une idée</p>
            </div>
          </button>
          <a
            href="https://pay.lydia.me/l?t=baptistem1ak5"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastelyellow-500/40 transition text-left w-full"
            @click="trackDonation"
          >
            <span class="text-xl" aria-hidden="true">☕</span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Offrir un café</p>
              <p class="text-xs text-slate-500">Soutenir le projet via Lydia</p>
            </div>
          </a>
        </div>

        <!-- Formulaire de suggestion -->
        <div v-else class="flex flex-col gap-3">
          <button
            class="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            @click="showSuggestionForm = false"
          >
            <span aria-hidden="true">←</span> Retour
          </button>
          <p class="text-sm font-semibold text-slate-800">Ton idée ou retour</p>
          <textarea
            v-model="suggestionText"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none focus:border-pastelblue-500 focus:ring-1 focus:ring-pastelblue-500"
            rows="4"
            placeholder="Ex : j'aimerais pouvoir choisir la catégorie des mots…"
            aria-label="Ton message"
          />
          <button
            class="w-full px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
            :disabled="!suggestionText.trim()"
            @click="sendSuggestion"
          >
            Envoyer par mail
          </button>
        </div>
      </div>
    </Transition>

    <!-- Bouton principal -->
    <button
      class="w-12 h-12 rounded-full bg-white shadow-xl border border-slate-200 flex items-center justify-center text-xl hover:scale-110 transition-transform"
      :aria-label="fabOpen ? 'Fermer le menu' : 'Suggestions et soutien'"
      :aria-expanded="fabOpen"
      @click="toggleFab"
    >
      {{ fabOpen ? '✕' : '💬' }}
    </button>
  </div>
</template>

<style>
.fab-popover-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fab-popover-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.fab-popover-enter-from,
.fab-popover-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}
</style>
