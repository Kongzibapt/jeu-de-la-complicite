<template>
  <div
    class="min-h-screen bg-linear-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 flex items-center justify-center p-4"
    role="main"
    aria-labelledby="game-title"
  >
    <div class="w-full max-w-5xl">
      <div class="bg-linear-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 p-1 rounded-[36px] shadow-2xl mb-20">
        <div
          class="w-full bg-white/90 backdrop-blur-xl rounded-4xl p-6 md:p-10 flex flex-col gap-6"
        >
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-pastelblue-500 font-semibold">
            🌈 Mode complicité
          </p>
          <h1 id="game-title" class="text-3xl md:text-4xl font-bold text-slate-800">
            Jeu de la complicité
          </h1>
        </div>
          <div class="flex gap-2" role="group" aria-label="Actions principales">
            <button
              class="text-sm md:text-base px-4 py-2 rounded-full border border-pastelblue-500/60 bg-white/80 hover:bg-white transition flex items-center gap-2"
              @click="openTeamsModal"
          >
            Modifier les équipes
          </button>
          <button
            class="text-sm md:text-base px-4 py-2 rounded-full border border-pastelpink-500/70 bg-white/80 hover:bg-white transition flex items-center gap-2"
            @click="showRules = true"
          >
            Règles du jeu
          </button>
        </div>
      </header>

      <!-- SECTION 1 : manche + mot -->
      <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 border border-pastelblue-500/30" aria-labelledby="round-section-title">
        <div class="flex flex-row justify-between gap-4" role="group" aria-label="Informations de manche">
          <div class="flex-1">
            <p id="round-section-title" class="text-xs uppercase tracking-wide text-slate-500">
              🎯 Manche
            </p>
            <p class="text-lg font-bold text-slate-800">
              {{ currentRound }} / {{ totalRounds }}
            </p>
          </div>

          <!-- Timer -->
          <div class="text-right flex-1">
            <p class="text-xs uppercase text-slate-500">
              ⏱ Temps
            </p>
            <p
              class="text-lg font-mono font-semibold transition-all duration-150 ease-out origin-center"
              :class="[
                isTimeOver ? 'text-red-500' : isTimeEnding ? 'text-orange-500' : 'text-slate-800',
                tickPulse ? 'scale-105' : 'scale-100'
              ]"
              aria-live="polite"
            >
              {{ formattedTimeLeft }}
            </p>
          </div>
        </div>

        <!-- Barre de progression -->
        <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-pastelblue-500 transition-all"
            :style="{ width: (currentRound / totalRounds * 100) + '%' }"
          />
        </div>

        <!-- ÉTAT : En attente du bouton "Prêt" -->
        <div
          v-if="gameStarted && !roundReady && !gameOver"
          class="mt-2 border border-dashed border-pastelblue-500 rounded-2xl p-3 bg-pastelblue-500/10 flex flex-col items-center gap-3"
        >
          <p class="text-sm text-slate-700 text-center">
            ⚡ <span class="font-semibold">{{ currentTeam?.name || 'Une équipe' }}</span><br />
            Appuyez sur <span class="font-semibold">"Prêt"</span> pour lancer le mot surprise.
          </p>
          <button
            class="px-6 py-3 rounded-full text-sm md:text-base font-semibold bg-pastelblue-500 hover:bg-pastelblue-500/80 flex items-center gap-2"
            @click="handleReady"
          >
            Prêt
          </button>
        </div>

        <!-- Mot à faire deviner + rerolls + timer (une fois "Prêt") -->
        <div
          v-else
          class="mt-2 border border-dashed border-pastelblue-500 rounded-2xl p-4 bg-pastelblue-500/10 flex flex-col items-center gap-2"
        >
          <div class="text-center flex items-center justify-center">
            <p
              v-if="secretWord"
              class="text-2xl md:text-3xl font-bold text-slate-900 tracking-wide select-none"
            >
              {{ secretWord }}
            </p>
            <p v-else class="text-sm text-slate-500 italic">
              En attente de lancement de partie…
            </p>
          </div>

          <div class="flex flex-col items-center gap-2 mt-2">
            <button
              class="px-4 py-2 rounded-full text-sm font-semibold bg-pastelblue-500 hover:bg-pastelblue-500/80 disabled:opacity-50 flex items-center gap-2"
              :disabled="!gameStarted || !roundReady || rerollsLeft === 0"
              @click="drawNewWord"
            >
              🎲 Tirer un nouveau mot
            </button>
            <p class="text-xs text-slate-600">
              Nouveaux tirages restants :
              <span class="font-semibold">
                {{ rerollsLeft }} / {{ maxRerollsPerRound }}
              </span>
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 2 : actions de manche -->
      <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 border border-pastelgreen-500/30">
        <h2 class="font-semibold text-slate-800 text-lg flex items-center gap-2">
          🏆 Résultat de la manche
        </h2>

        <p class="text-sm text-slate-600">
          Cliquez sur le bouton correspondant :
        </p>

        <div class="flex flex-col gap-3" role="group" aria-label="Actions de manche">
          <!-- Mot trouvé par l'équipe active -->
          <button
            v-if="currentTeam"
            class="w-full px-4 py-3 rounded-xl text-sm md:text-base font-semibold
                   bg-pastelgreen-500 hover:bg-pastelgreen-500/80 disabled:opacity-50"
            :disabled="!gameStarted || !roundReady"
            @click="handleAwardPoint(currentTeamIndex)"
          >
            🎉 Mot trouvé par {{ currentTeam.name }}
          </button>

          <!-- Mot volé par une autre équipe -->
          <div class="flex flex-col gap-3">
            <template v-for="(item, idx) in otherTeams" :key="item.team.name + idx">
              <button
                class="px-4 py-3 rounded-xl text-sm md:text-base font-semibold
                       bg-pastelpink-500 hover:bg-pastelpink-500/80 disabled:opacity-50"
                :disabled="!gameStarted || !roundReady"
                @click="handleAwardPoint(item.index)"
              >
                🥷 Mot volé par {{ item.team.name }}
              </button>
            </template>
          </div>
        </div>

        <div v-if="gameOver" class="flex flex-col gap-2">
          <button
            class="px-4 py-2 rounded-full text-sm font-semibold bg-pastelblue-500/80 text-slate-900 hover:bg-pastelblue-500 transition"
            @click="showResultModal = true"
          >
            Voir le résultat final 🎉
          </button>
          <button
            class="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900"
            @click="showReplayModal = true"
          >
            Rejouer une partie
          </button>
        </div>

        <button
          v-else
          class="mt-2 text-xs text-slate-500 underline underline-offset-2 self-start"
          @click="handleReset"
        >
          Réinitialiser la partie
        </button>
      </section>
        </div>
      </div>
    </div>

    <!-- Scores en bas, centrés -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
      <div class="rounded-3xl p-0.5 bg-linear-to-r from-pastelblue-500 via-pastelgreen-500 to-pastelpink-500 shadow-2xl">
        <div
          class="bg-white/95 backdrop-blur-md rounded-[calc(1.5rem-2px)] px-4 py-3 flex flex-col items-center justify-between gap-3"
        >
          <div class="flex flex-wrap justify-center gap-3 w-full">
            <div
              v-for="(team, index) in teams"
              :key="team.name + index"
              class="px-3 py-2 rounded-xl flex items-center gap-2 transition-colors border"
              :class="index === currentTeamIndex ? 'bg-pastelgreen-500/70 text-slate-900 border-pastelgreen-500/60' : 'bg-slate-100 text-slate-700 border-slate-200'"
            >
              <span class="text-xs font-semibold">
                {{ team.name }}
              </span>
              <span class="font-bold text-lg">
                {{ team.score }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal temps écoulé -->
    <div
      v-if="showTimeUpModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative text-center">
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
          @click="handleCloseTimeUpModal"
        >
          ✕
        </button>
        <div class="flex flex-col items-center gap-3">
          <div class="text-5xl animate-pulse">⏰</div>
          <h2 class="text-2xl font-bold text-slate-800">
            Temps écoulé
          </h2>
          <p class="text-sm text-slate-700">
            Manche perdue pour
            <span class="font-semibold text-pastelpink-800">
              {{ timeoutContext?.loser || "l'équipe active" }}
            </span>.
            Le point revient à
            <span class="font-semibold text-pastelgreen-800">
              {{ timeoutContext?.winner || "l'autre équipe" }}
            </span>.
          </p>
          <button
            class="mt-2 px-4 py-2 rounded-full text-sm font-semibold bg-pastelblue-500 text-slate-900 hover:bg-pastelblue-500/80"
            @click="handleCloseTimeUpModal"
          >
            Passer au tour suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal règles -->
    <div
      v-if="showRules"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full mx-4 p-6 shadow-xl relative">
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
          @click="showRules = false"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold text-slate-800 mb-3">
          Règles du jeu
        </h2>
        <div
          class="text-sm text-slate-700 flex flex-col gap-2 max-h-90 overflow-y-auto pr-1"
        >
          <p><strong>Nombre de joueurs :</strong> 4 ou 6 joueurs.</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Formez au minimum deux groupes de deux personnes.</li>
            <li>Un premier groupe commence.</li>
            <li>Une personne de ce groupe tire secrètement un mot au hasard.</li>
            <li>Cette personne essaie de faire deviner le mot par tous les moyens possibles à son groupe.</li>
            <li>Son groupe doit trouver le mot avant qu'un autre groupe ne le trouve !</li>
          </ul>
          <p class="mt-2">
            Utilisez la complicité de votre groupe pour faire deviner votre mot
            sans que vos adversaires ne sachent vraiment de quoi vous parlez.
          </p>
          <p class="mt-2 text-slate-600 italic">
            Exemple : "Tu te souviens hier midi je t'ai parlé de quelqu'un
            et bien c'est le même prénom de la célébrité que je dois te faire deviner."
          </p>
          <p class="mt-4">
            <strong>Score :</strong> chaque mot trouvé rapporte <strong>1 point</strong> à l’équipe qui
            trouve en premier. La partie dure <strong>10 manches</strong>. L’équipe avec le plus de points
            gagne.
          </p>
          <div class="flex justify-center mt-4">
            <img
              src="/logo.webp"
              alt=""
              role="presentation"
              class="w-8 h-8"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal résultat -->
    <div
      v-if="showResultModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative text-center">
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
          @click="showResultModal = false"
        >
          ✕
        </button>
        <div class="flex flex-col items-center gap-3">
          <div class="text-5xl animate-bounce">🏆</div>
          <h2 class="text-2xl font-bold text-slate-800">
            Partie terminée
          </h2>
          <p v-if="winners.length === 1" class="text-slate-700">
            Victoire de <span class="font-bold text-pastelblue-500">{{ winners[0]?.name }}</span>
            avec {{ winners[0]?.score }} points !
          </p>
          <p v-else class="text-slate-700">
            Égalité entre
            <span class="font-bold text-pastelblue-500">
              {{ winners.map((w) => w.name).join(", ") }}
            </span>
            avec {{ winners[0]?.score }} points.
          </p>
          <button
            class="mt-2 px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900"
            @click="showReplayModal = true"
          >
            Rejouer une partie
          </button>
        </div>
      </div>
    </div>

    <!-- Modal modification équipes -->
    <div
      v-if="showTeamsModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative">
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
          @click="showTeamsModal = false"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold text-slate-800 mb-2 text-center">
          Modifier les équipes
        </h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="(name, index) in tempTeamNames"
            :key="`edit-team-${index}`"
            class="flex flex-col gap-1"
          >
            <label class="text-xs uppercase tracking-wide text-slate-500">
              Équipe {{ index + 1 }}
            </label>
            <input
              v-model="tempTeamNames[index]"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-pastelblue-500 focus:ring-1 focus:ring-pastelblue-500"
              :placeholder="`Nom de l'équipe ${index + 1}`"
            />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            class="flex-1 px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            @click="showTeamsModal = false"
          >
            Annuler
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-full text-sm font-semibold bg-pastelgreen-500 text-slate-900 hover:bg-pastelgreen-500/80"
            @click="saveTeamNames"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal rejouer -->
    <div
      v-if="showReplayModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-md w-full mx-4 p-6 shadow-2xl relative">
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
          @click="showReplayModal = false"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold text-slate-800 mb-2 text-center">
          Nouvelle partie ?
        </h2>
        <p class="text-sm text-slate-600 text-center mb-4">
          Choisis si tu gardes les mêmes équipes ou si tu en crées de nouvelles.
        </p>
        <div class="flex flex-col gap-3">
          <button
            class="px-4 py-3 rounded-xl text-sm font-semibold bg-pastelgreen-500 text-slate-900 hover:bg-pastelgreen-500/80"
            @click="handleReplaySameTeams"
          >
            🎯 Même équipes
          </button>
          <button
            class="px-4 py-3 rounded-xl text-sm font-semibold bg-pastelpink-500 text-slate-900 hover:bg-pastelpink-500/80"
            @click="handleReplayNewTeams"
          >
            ✏️ Nouvelles équipes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const siteName = "Jeu de la complicité";
const canonicalUrl = "https://jeu-de-la-complicite.fr/game";
const pageTitle = "Jeu de la complicité | Partie en cours";
const pageDescription =
  "Suivez la manche en cours du Jeu de la complicité : scores, équipes et mot secret pour ce jeu gratuit.";
const keywords = [
  "Jeu de la complicité",
  "partie en cours",
  "jeu d'équipe",
  "jeu ambiance",
  "jeu pop culture",
].join(", ");

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: pageTitle,
  url: canonicalUrl,
  description: pageDescription,
  inLanguage: "fr",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
};

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
  totalRounds,
  nbTeams,
  teams,
  currentRound,
  currentTeamIndex,
  secretWord,
  gameStarted,
  gameOver,
  rerollsLeft,
  currentTeam,
  otherTeams,
  winners,
  maxRerollsPerRound,
  drawNewWord,
  awardPoint,
  resetGame,
  startRoundIfNeeded,
  storageHydrated,
  startGame,
  updateTeamName,
} = useCompliciteGame();

const showRules = ref(false);
const showResultModal = ref(false);
const showReplayModal = ref(false);
const showTeamsModal = ref(false);
const tempTeamNames = ref<string[]>([]);
const router = useRouter();

/**
 * État : manche en cours ou en attente du bouton "Prêt"
 */
const roundReady = ref(false);

/**
 * Timer de manche : 3 minutes (180 secondes)
 */
const ROUND_DURATION_MS = 3 * 60 * 1000; // 180s
const timeLeftMs = ref(ROUND_DURATION_MS);
const timerRunning = ref(false);
let timerId: ReturnType<typeof setInterval> | null = null;
let roundEndTime = 0;
const showTimeUpModal = ref(false);
const timeoutContext = ref<{ loser: string; winner: string } | null>(null);
const tickPulse = ref(false);

const hasNamedTeams = computed(() =>
  teams.value
    .slice(0, nbTeams.value)
    .every((team) => (team?.name ?? "").trim().length > 0)
);

if (import.meta.client) {
  watch(
    () => storageHydrated.value,
    (hydrated) => {
      if (!hydrated) return;
      if (!hasNamedTeams.value) {
        router.replace("/");
      }
    },
    { immediate: true, flush: "post" }
  );
}


const formattedTimeLeft = computed(() => {
  const ms = Math.max(0, timeLeftMs.value);
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const minStr = minutes.toString().padStart(1, "0");
  const secStr = seconds.toString().padStart(2, "0");

  if (ms <= 10000) {
    const milliStr = Math.floor(ms % 1000)
      .toString()
      .padStart(3, "0");
    return `${minStr}:${secStr}.${milliStr}`;
  }

  return `${minStr}:${secStr}`;
});

const isTimeEnding = computed(
  () => timeLeftMs.value <= 10000 && timeLeftMs.value > 0
);
const isTimeOver = computed(() => timeLeftMs.value <= 0);

const remainingSecondsCeil = computed(() =>
  Math.ceil(timeLeftMs.value / 1000)
);

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  timerRunning.value = false;
}

function startTimer() {
  stopTimer();
  timeLeftMs.value = ROUND_DURATION_MS;
  roundEndTime = Date.now() + ROUND_DURATION_MS;
  timerRunning.value = true;
  showTimeUpModal.value = false;
  timeoutContext.value = null;

  timerId = setInterval(() => {
    const remaining = roundEndTime - Date.now();
    if (remaining > 0) {
      timeLeftMs.value = remaining;
    } else {
      stopTimer();
      timeLeftMs.value = 0;
      handleTimeExpired();
    }
  }, 50);
}

function triggerTickPulse() {
  tickPulse.value = true;
  setTimeout(() => {
    tickPulse.value = false;
  }, 150);
}

/**
 * Clic sur "Prêt" :
 * - tire le premier mot de la manche (si besoin)
 * - lance le chrono
 */
function handleReady() {
  if (!gameStarted.value || gameOver.value) return;
  roundReady.value = true;
  startRoundIfNeeded();
  startTimer();
}

/**
 * Attribution de point :
 * - stoppe le chrono
 * - passe à la manche suivante
 * - repasse en mode "Prêt"
 */
function handleAwardPoint(teamIndex: number) {
  if (!gameStarted.value || !roundReady.value) return;
  stopTimer();
  awardPoint(teamIndex); // gère currentRound + gameOver
  roundReady.value = false;
}

/**
 * Reset / nouvelle partie
 */
function handleReset() {
  stopTimer();
  roundReady.value = false;
  timeLeftMs.value = ROUND_DURATION_MS;
  showTimeUpModal.value = false;
  timeoutContext.value = null;
  resetGame();
  showResultModal.value = false;
  showReplayModal.value = false;
  router.push("/");
}

function handleReplaySameTeams() {
  stopTimer();
  roundReady.value = false;
  timeLeftMs.value = ROUND_DURATION_MS;
  showTimeUpModal.value = false;
  timeoutContext.value = null;
  showReplayModal.value = false;
  showResultModal.value = false;
  const restarted = startGame();
  if (!restarted) {
    router.push("/");
  }
}

function handleReplayNewTeams() {
  showReplayModal.value = false;
  showResultModal.value = false;
  handleReset();
}

function openTeamsModal() {
  tempTeamNames.value = teams.value
    .slice(0, nbTeams.value)
    .map((team) => team.name);
  showTeamsModal.value = true;
}

function saveTeamNames() {
  tempTeamNames.value.forEach((name, index) => {
    updateTeamName(index, name);
  });
  showTeamsModal.value = false;
}

function handleTimeExpired() {
  if (showTimeUpModal.value) return;
  const losingName = currentTeam.value?.name || "équipe active";
  const receiverIndex =
    nbTeams.value > 1
      ? (currentTeamIndex.value + 1) % nbTeams.value
      : currentTeamIndex.value;
  const receiverName = teams.value[receiverIndex]?.name || "autre équipe";

  timeoutContext.value = {
    loser: losingName,
    winner: receiverName,
  };

  roundReady.value = false;
  showTimeUpModal.value = true;
  awardPoint(receiverIndex);
}

function handleCloseTimeUpModal() {
  showTimeUpModal.value = false;
  timeLeftMs.value = ROUND_DURATION_MS;
}

/**
 * Si la partie se termine, on coupe le timer
 */
watch(
  () => gameOver.value,
  (val) => {
    if (val) {
      stopTimer();
      roundReady.value = false;
      showResultModal.value = true;
    } else {
      showResultModal.value = false;
    }
  }
);

watch(
  () => remainingSecondsCeil.value,
  (newVal, oldVal) => {
    if (
      newVal <= 10 &&
      newVal >= 0 &&
      newVal !== oldVal &&
      timeLeftMs.value > 0
    ) {
      triggerTickPulse();
    }
  }
);

onBeforeUnmount(() => {
  stopTimer();
});

</script>
