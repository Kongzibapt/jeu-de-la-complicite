<template>
  <div
    class="min-h-screen bg-linear-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-3xl">
      <div class="bg-linear-to-br from-pastelblue-500 to-pastelpink-500 p-1 rounded-4xl shadow-2xl">
        <div
          class="bg-white/85 backdrop-blur-xl rounded-[28px] p-6 md:p-10 flex flex-col gap-6"
        >
          <header class="flex flex-col gap-2 text-center md:text-left">
            <p class="text-xs uppercase tracking-[0.3em] text-pastelblue-500 font-semibold">
              🌈 Mode complicité
            </p>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-800">
              Jeu de la complicité
            </h1>
            <p class="text-slate-600">
              Choisis les équipes, donne-leur un nom et démarre une partie complice en quelques secondes ✨
            </p>
          </header>

          <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 border border-pastelblue-500/30">
            <h2 class="font-semibold text-slate-800 text-lg flex items-center gap-2">
              🌟 Former les équipes
            </h2>

        <div class="flex flex-col gap-3">
            <label class="text-sm text-slate-700 flex items-center gap-2">
              <span class="inline-flex w-2 h-2 rounded-full bg-pastelblue-500 animate-pulse"></span>
              Nombre d'équipes
            </label>
            <div class="flex gap-3">
              <button
                class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
                :class="nbTeams === 2 ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300'"
                @click="setNbTeams(2)"
              >
                2 équipes
                <br class="sm:hidden" />
                <span class="text-xs text-slate-600">👫 (4 joueurs)</span>
              </button>
              <button
                class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
                :class="nbTeams === 3 ? 'bg-pastelblue-500 border-pastelblue-500 font-semibold' : 'bg-white border-slate-300'"
                @click="setNbTeams(3)"
              >
                3 équipes
                <br class="sm:hidden" />
                <span class="text-xs text-slate-600">👬 (6 joueurs)</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-sm text-slate-700 flex items-center gap-2">
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
        </section>

        <p class="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
          Une grande banque de références pop est prête pour le Jeu de la complicité.
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const siteName = "Jeu de la complicité";
const canonicalUrl = "https://jeu-complicite.app/";
const pageTitle = "Jeu de la complicité | Jeu coopératif pastel en ligne";
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

definePageMeta({
  title: pageTitle,
});

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogSiteName: siteName,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
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
} = useCompliciteGame();

function goToGame() {
  if (!startGame()) {
    return;
  }
  router.push("/game");
}

definePageMeta({
  title: "Le Jeu de la Complicité - Jeu d'ambiance gratuit en ligne",
  meta: [
    {
      name: "description",
      content:
        "Découvrez le Jeu de la Complicité, un jeu d’ambiance gratuit en ligne inspiré de la pop culture. Faites deviner un mot à votre équipe avant les autres. Simple, fun et idéal entre amis.",
    },
    {
      name: "keywords",
      content:
        "jeu de la complicité, jeu ambiance en ligne, jeu gratuit, pop culture, devinettes, jeu entre amis, jeu de soirée, jeu collaboratif, jeu équipe",
    },
    {
      property: "og:title",
      content: "Le Jeu de la Complicité - Jeu d'ambiance gratuit en ligne",
    },
    {
      property: "og:description",
      content:
        "Un jeu d’ambiance gratuit où vous devez faire deviner un mot à votre équipe sans que les adversaires ne comprennent. Pop culture, fun et complicité !",
    },
    {
      property: "og:image",
      content: "/cover.jpg",
    },
  ],
});

</script>
