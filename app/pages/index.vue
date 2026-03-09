<template>
  <div
    class="min-h-screen bg-linear-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 flex items-center justify-center p-4"
    role="main"
    aria-labelledby="index-title"
  >
    <div class="w-full max-w-3xl">
      <div class="bg-linear-to-br from-pastelblue-500 to-pastelpink-500 p-1 rounded-4xl shadow-2xl">
        
        <div
          class="bg-white/85 backdrop-blur-xl rounded-[28px] p-6 md:p-8 flex flex-col gap-6"
        >
          <header class="flex flex-col gap-4 text-center md:text-left">
            <p class="text-xs uppercase tracking-[0.3em] text-pastelblue-500 font-semibold">
              🌈 Mode complicité
            </p>
            <div class="flex items-center justify-center md:justify-start gap-3">
              
              <h1 id="index-title" class="text-3xl md:text-4xl font-bold text-slate-800">
                Jeu de la complicité
              </h1>
            </div>
            <p class="text-slate-600">
              Choisis les équipes, donne-leur un nom et démarre une partie en quelques secondes ✨
            </p>
          </header>

          <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 border border-pastelblue-500/30">
            <h2 class="font-semibold text-slate-800 text-lg flex items-center gap-2">
              🌟 Former les équipes
            </h2>

        <div class="flex flex-col gap-3">
            <label class="text-sm text-slate-700 flex items-center gap-2" id="teams-count-label">
              <span class="inline-flex w-2 h-2 rounded-full bg-pastelblue-500 animate-pulse"></span>
              Nombre d'équipes
            </label>
            <div class="flex gap-3" role="group" aria-labelledby="teams-count-label">
              <button
                class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
                :aria-pressed="nbTeams === 2"
                :class="nbTeams === 2 ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300'"
                @click="setNbTeams(2)"
              >
                2 équipes
                <br class="sm:hidden" />
                <span class="text-xs">(4 joueurs)</span>
              </button>
              <button
                class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
                :aria-pressed="nbTeams === 3"
                :class="nbTeams === 3 ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300'"
                @click="setNbTeams(3)"
              >
                3 équipes
                <br class="sm:hidden" />
                <span class="text-xs">(6 joueurs)</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-sm text-slate-700 flex items-center gap-2" id="teams-name-label">
                <span class="inline-flex w-2 h-2 rounded-full bg-pastelblue-500 animate-pulse"></span>
                Nom des équipes
            </label>
            <div class="flex flex-col gap-2">
              <div
                v-for="(team, index) in teams"
              :key="index"
              class="flex items-center gap-2"
            >
                <span class="text-xs text-slate-500 w-16">Équipe {{ index + 1 }}</span>
                <input
                  :value="team.name"
                  :aria-describedby="'teams-name-label'"
                  class="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-pastelblue-500 focus:ring-1 focus:ring-pastelblue-500 transition"
                  :placeholder="'Équipe ' + (index + 1)"
                  @input="(e: any) => updateTeamName(index, e.target.value)"
                />
              </div>
            </div>
          </div>

          <button
            class="mt-2 w-full px-4 py-3 rounded-xl text-white font-semibold text-sm md:text-base
                 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-500 disabled:hover:bg-slate-500 disabled:opacity-60 flex items-center justify-center gap-2"
            @click="goToGame"
            :disabled="!canStartGame"
          >
            🚀 Lancer la partie
          </button>

          <button
            class="text-xs text-slate-500 underline underline-offset-2 self-center mt-1"
            @click="showSettings = true"
          >
            ⚙️ Paramètres de jeu
          </button>
        </section>

        <img
          src="/logo.webp"
          alt=""
          role="presentation"
          class="w-12 h-12 mx-auto"
        />

        <p class="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
          Une grande banque de références est prête pour le Jeu de la complicité. (+de 600 mots)
        </p>
        
      </div>
    </div>
  </div>
  </div>

  <!-- Modal paramètres de jeu -->
  <div
    v-if="showSettings"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click="showSettings = false"
  >
    <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative" @click.stop>
      <button
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
        aria-label="Fermer"
        @click="showSettings = false"
      >
        <span aria-hidden="true">✕</span>
      </button>
      <h2 class="text-xl font-bold text-slate-800 mb-5">⚙️ Paramètres de jeu</h2>
      <div class="flex flex-col gap-5">

        <!-- Nombre de manches -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700">Nombre de manches</label>
          <div class="flex gap-2" role="group" aria-label="Nombre de manches">
            <button
              v-for="n in [5, 8, 10, 15, 20]"
              :key="n"
              class="flex-1 px-2 py-2 rounded-xl border text-sm font-medium"
              :class="totalRounds === n ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300 text-slate-600'"
              :aria-pressed="totalRounds === n"
              @click="totalRounds = n"
            >{{ n }}</button>
          </div>
        </div>

        <!-- Durée du tour -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700">Durée du tour</label>
          <div class="flex gap-2" role="group" aria-label="Durée du tour">
            <button
              v-for="opt in durationOptions"
              :key="opt.ms"
              class="flex-1 px-2 py-2 rounded-xl border text-sm font-medium"
              :class="roundDurationMs === opt.ms ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300 text-slate-600'"
              :aria-pressed="roundDurationMs === opt.ms"
              @click="roundDurationMs = opt.ms"
            >{{ opt.label }}</button>
          </div>
        </div>

        <!-- Rerolls par manche -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700">Tirages par manche</label>
          <div class="flex gap-2" role="group" aria-label="Tirages par manche">
            <button
              v-for="n in [0, 1, 2, 3]"
              :key="n"
              class="flex-1 px-2 py-2 rounded-xl border text-sm font-medium"
              :class="maxRerollsPerRound === n ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300 text-slate-600'"
              :aria-pressed="maxRerollsPerRound === n"
              @click="maxRerollsPerRound = n"
            >{{ n === 0 ? 'Aucun' : n }}</button>
          </div>
          <p class="text-xs text-slate-400">Nombre de fois qu'une équipe peut changer de mot par manche.</p>
        </div>

      </div>
      <button
        class="mt-6 w-full px-4 py-2 rounded-full text-sm font-semibold bg-pastelgreen-500 text-slate-900 hover:bg-pastelgreen-500/80"
        @click="showSettings = false"
      >
        Valider
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const siteName = "Jeu de la complicité";
const canonicalUrl = "https://jeu-de-la-complicite.fr/";
const pageTitle = "Jeu de la complicité | Jeu coopératif en ligne";
const pageDescription =
  "Prépare ton Jeu de la complicité : configure les équipes, personnalise leurs noms et lance un party game moderne 100% en ligne.";
const keywords = [
  "Jeu de la complicité",
  "jeu complicité",
  "party game en ligne",
  "jeu coopératif",
  "jeu pop culture",
].join(", ");

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: canonicalUrl,
  description: pageDescription,
  applicationCategory: "GameApplication",
  inLanguage: "fr",
  operatingSystem: "Web",
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Joueurs en équipe",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogSiteName: siteName,
  ogType: "website",
  ogImage: "https://jeu-de-la-complicite.fr/og-image.webp",
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: "https://jeu-de-la-complicite.fr/og-image.webp",
});

useHead({
  meta: [
    {
      name: "keywords",
      content: keywords,
    },
  ],
  link: [
    {
      rel: "canonical",
      href: canonicalUrl,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(structuredData),
    },
  ],
});

const {
  nbTeams,
  teams,
  setNbTeams,
  updateTeamName,
  startGame,
  canStartGame,
  totalRounds,
  maxRerollsPerRound,
  roundDurationMs,
} = useCompliciteGame();

const showSettings = ref(false);

const durationOptions = [
  { ms: 60 * 1000, label: '1 min' },
  { ms: 90 * 1000, label: '1 min 30' },
  { ms: 2 * 60 * 1000, label: '2 min' },
  { ms: 3 * 60 * 1000, label: '3 min' },
];

function goToGame() {
  if (!startGame()) {
    return;
  }
  router.push("/game");
}
</script>
