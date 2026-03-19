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
            @click="() => { showSettings = true; trackEvent('settings_open'); }"
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
          Une grande banque de références est prête pour le Jeu de la complicité. (+de 700 mots)
        </p>
        
      </div>
    </div>
  </div>
  </div>

  <!-- Contenu statique SEO -->
  <section
    aria-label="À propos du Jeu de la complicité"
    class="w-full max-w-3xl mx-auto px-4 pt-8 pb-16 flex flex-col gap-10 text-slate-700"
  >
    <div>
      <h2 class="text-2xl font-bold text-slate-800 mb-3">C'est quoi le Jeu de la complicité ?</h2>
      <p class="text-sm leading-relaxed">
        Le <strong>Jeu de la complicité</strong> est un <strong>party game gratuit en ligne</strong> pour 4 à 6 joueurs répartis en 2 ou 3 équipes.
        Le principe : une personne tire secrètement un mot au hasard et doit le faire deviner à son équipe grâce à des indices codés — références communes, allusions discrètes, complicité pure —
        sans que les équipes adverses ne comprennent de quoi il s'agit.
        La première équipe à trouver le mot marque un point. Mais attention aux vols !
      </p>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-slate-800 mb-3">Comment jouer ?</h2>
      <ol class="list-decimal list-inside space-y-2 text-sm leading-relaxed">
        <li>Formez <strong>2 ou 3 équipes</strong> de 2 joueurs minimum.</li>
        <li>Une personne de l'équipe active tire <strong>secrètement un mot</strong> sur l'écran.</li>
        <li>Elle fait deviner ce mot à son équipe par tous les moyens : indices, gestes, références partagées…</li>
        <li>Les équipes adverses peuvent <strong>voler le point</strong> en criant le mot à tout moment !</li>
        <li>Si le chrono expire sans que personne ne trouve, <strong>personne ne marque</strong> — manche nulle.</li>
        <li>La partie dure le nombre de manches choisi. <strong>L'équipe avec le plus de points gagne.</strong></li>
        <li>En cas d'égalité, une <strong>mort subite</strong> départage les équipes à égalité.</li>
      </ol>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-slate-800 mb-3">Les mots du Jeu de la complicité</h2>
      <p class="text-sm leading-relaxed mb-4">
        La banque contient <strong>plus de 700 mots</strong> répartis en <strong>15 catégories</strong> pour varier les plaisirs à chaque partie.
        Les mots sont tirés aléatoirement — impossible de tous les connaître à l'avance !
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="cat in categories" :key="cat.name" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-xs font-medium text-slate-700">
          <span aria-hidden="true">{{ cat.emoji }}</span>{{ cat.name }}
        </span>
      </div>
      <p class="text-xs text-slate-500 italic">
        Exemples parmi les mots : Harry Potter, Dark Vador, Minecraft, la Tour Eiffel, Beyoncé, Gojo Satoru, MrBeast, Titanic, Spotify, Napoléon Bonaparte, Kylian Mbappé...
      </p>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-slate-800 mb-5">Questions fréquentes</h2>
      <dl class="flex flex-col gap-5">
        <div>
          <dt class="font-semibold text-slate-800 mb-1">Le Jeu de la complicité est-il gratuit ?</dt>
          <dd class="text-sm leading-relaxed">Oui, entièrement gratuit, sans inscription et sans publicité. Il se joue directement dans le navigateur sur mobile, tablette ou ordinateur.</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-800 mb-1">Combien de joueurs pour y jouer ?</dt>
          <dd class="text-sm leading-relaxed">Il faut au minimum 4 joueurs (2 équipes de 2). Vous pouvez jouer à 6 en formant 3 équipes de 2.</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-800 mb-1">Faut-il télécharger une application ?</dt>
          <dd class="text-sm leading-relaxed">Non. Le jeu se joue entièrement en ligne, sans installation ni téléchargement, sur tous les appareils.</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-800 mb-1">Comment fonctionne le vol de mot ?</dt>
          <dd class="text-sm leading-relaxed">N'importe quelle équipe adverse peut crier le mot à tout moment pour le voler et marquer le point à la place. Pas de règle spécifique : tout est permis !</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-800 mb-1">Quels types de mots y a-t-il ?</dt>
          <dd class="text-sm leading-relaxed">La banque contient plus de 700 références : célébrités, personnages, lieux, films, séries… Idéal pour tester la complicité de votre groupe.</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- Modal paramètres de jeu -->
  <div
    v-if="showSettings"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click="showSettings = false"
  >
    <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative overflow-y-auto max-h-[85vh]" @click.stop>
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

        <!-- Catégories -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-slate-700">Catégories</label>
            <button
              class="text-xs text-pastelblue-500 underline underline-offset-2"
              @click="toggleAllCategories"
            >
              {{ allCategoriesSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.name"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition"
              :class="selectedCategories.includes(cat.name) ? 'bg-pastelblue-500 border-pastelblue-500 text-slate-800' : 'bg-white border-slate-300 text-slate-500'"
              :aria-pressed="selectedCategories.includes(cat.name)"
              @click="toggleCategory(cat.name)"
            >
              <span aria-hidden="true">{{ cat.emoji }}</span> {{ cat.name }}
            </button>
          </div>
          <p v-if="selectedCategories.length === 1" class="text-xs text-amber-600">Au moins une catégorie doit rester sélectionnée.</p>
          <p v-else class="text-xs text-slate-400">{{ selectedCategories.length }} / {{ categories.length }} catégories sélectionnées</p>
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
const pageTitle = "Jeu de la complicité | Party game gratuit 4 à 6 joueurs";
const pageDescription =
  "Jouez au Jeu de la complicité : faites deviner des mots à votre équipe avant vos adversaires ! Party game gratuit, sans inscription, pour 4 à 6 joueurs.";
const ogImageUrl = "https://jeu-de-la-complicite.fr/og-image.png";
const keywords = [
  "Jeu de la complicité",
  "jeu complicité",
  "party game en ligne",
  "jeu de société en ligne gratuit",
  "jeu coopératif",
  "jeu pop culture",
  "jeu ambiance",
].join(", ");

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: canonicalUrl,
  description: pageDescription,
  image: ogImageUrl,
  applicationCategory: "GameApplication",
  inLanguage: "fr",
  operatingSystem: "Web",
  numberOfPlayers: "4-6",
  featureList: [
    "Banque de plus de 700 mots en 15 catégories",
    "2 ou 3 équipes",
    "Chronomètre intégré",
    "Vol de mot entre équipes",
    "Mort subite en cas d'égalité",
    "Gratuit et sans inscription",
  ],
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

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Le Jeu de la complicité est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, entièrement gratuit, sans inscription et sans publicité. Il se joue directement dans le navigateur sur mobile, tablette ou ordinateur.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de joueurs pour jouer au Jeu de la complicité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il faut au minimum 4 joueurs répartis en 2 équipes de 2. Vous pouvez jouer jusqu'à 6 joueurs en formant 3 équipes.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il télécharger une application pour jouer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le Jeu de la complicité se joue entièrement en ligne, directement dans le navigateur, sans installation ni téléchargement.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le vol de mot ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "N'importe quelle équipe adverse peut crier le mot à tout moment pour le voler et marquer le point à la place de l'équipe active. Pas de règle spécifique : tout est permis pour déstabiliser !",
      },
    },
  ],
};

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogSiteName: siteName,
  ogType: "website",
  ogImage: ogImageUrl,
  ogLocale: "fr_FR",
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: ogImageUrl,
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
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(faqStructuredData),
    },
  ],
});

import { categories } from '@/data/names';

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
  selectedCategories,
} = useCompliciteGame();

const showSettings = ref(false);
const { trackEvent } = useAnalytics();

const allCategoriesSelected = computed(() => selectedCategories.value.length === categories.length);

function toggleCategory(name: string) {
  const idx = selectedCategories.value.indexOf(name);
  if (idx === -1) {
    selectedCategories.value = [...selectedCategories.value, name];
  } else if (selectedCategories.value.length > 1) {
    selectedCategories.value = selectedCategories.value.filter((n) => n !== name);
  }
}

function toggleAllCategories() {
  if (allCategoriesSelected.value) {
    selectedCategories.value = [categories[0]!.name];
  } else {
    selectedCategories.value = categories.map((c) => c.name);
  }
}

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
  trackEvent('game_start', {
    nb_teams: nbTeams.value,
    total_rounds: totalRounds.value,
    round_duration_s: Math.round(roundDurationMs.value / 1000),
    max_rerolls: maxRerollsPerRound.value,
  });
  router.push("/game");
}
</script>
