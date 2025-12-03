<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-6 pb-24"
    >
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-slate-800">
            Le jeu de la complicité
          </h1>
          <p class="text-slate-600 mt-1">
            Manche {{ currentRound }} / {{ totalRounds }} — Au tour de :
            <span class="font-bold">
              {{ currentTeam?.name || "—" }}
            </span>
          </p>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            to="/"
            class="text-sm md:text-base px-4 py-2 rounded-full border border-slate-300 bg-white/70 hover:bg-white transition"
          >
            Modifier les équipes
          </NuxtLink>
          <button
            class="text-sm md:text-base px-4 py-2 rounded-full border border-slate-300 bg-white/70 hover:bg-white transition"
            @click="showRules = true"
          >
            Règles du jeu
          </button>
        </div>
      </header>

      <!-- SECTION 1 : manche + mot -->
      <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">
              Manche
            </p>
            <p class="text-2xl font-bold text-slate-800">
              {{ currentRound }} / {{ totalRounds }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs uppercase tracking-wide text-slate-500">
              Au tour de
            </p>
            <p class="text-lg font-semibold text-slate-800">
              {{ currentTeam?.name || "—" }}
            </p>
          </div>

          <!-- Timer -->
          <div
            v-if="gameStarted && roundReady"
            class="text-right"
          >
            <p class="text-xs uppercase tracking-wide text-slate-500">
              Temps restant
            </p>
            <p
              class="text-lg font-mono font-semibold"
              :class="timeLeft === 0 ? 'text-red-500' : 'text-slate-800'"
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
          class="mt-2 border border-dashed border-pastelblue-500 rounded-2xl p-6 bg-pastelblue-500/10 flex flex-col items-center gap-4"
        >
          <p class="text-sm text-slate-700 text-center">
            <span class="font-semibold">{{ currentTeam?.name || 'Une équipe' }}</span>, cliquez sur
            <span class="font-semibold">"Prêt"</span> quand vous êtes prêts à commencer la manche.
          </p>
          <button
            class="px-6 py-3 rounded-full text-sm md:text-base font-semibold bg-pastelgreen-500 hover:bg-pastelgreen-500/80"
            @click="handleReady"
          >
            Prêt
          </button>
        </div>

        <!-- Mot à faire deviner + rerolls + timer (une fois "Prêt") -->
        <div
          v-else
          class="mt-2 border border-dashed border-pastelblue-500 rounded-2xl p-4 bg-pastelblue-500/10 flex flex-col items-center gap-3"
        >
          <p class="text-sm text-slate-700 text-center">
            La personne qui fait deviner lit le mot ci-dessous. Les autres regardent ailleurs 😉
          </p>

          <div class="text-center min-h-[3rem] flex items-center justify-center">
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
              class="px-4 py-2 rounded-full text-sm font-semibold bg-pastelblue-500 hover:bg-pastelblue-500/80 disabled:opacity-50"
              :disabled="!gameStarted || !roundReady || rerollsLeft === 0"
              @click="drawNewWord"
            >
              Tirer un nouveau mot
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
      <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
        <h2 class="font-semibold text-slate-800 text-lg">
          Résultat de la manche
        </h2>

        <p class="text-sm text-slate-600">
          Quand un mot est trouvé, appuyez sur le bouton correspondant à l’équipe qui a trouvé le mot en premier.
        </p>

        <div class="flex flex-col gap-3">
          <!-- Mot trouvé par l'équipe active -->
          <button
            v-if="currentTeam"
            class="w-full px-4 py-3 rounded-xl text-sm md:text-base font-semibold
                   bg-pastelgreen-500 hover:bg-pastelgreen-500/80 disabled:opacity-50"
            :disabled="!gameStarted || !roundReady"
            @click="handleAwardPoint(currentTeamIndex)"
          >
            Mot trouvé par {{ currentTeam.name }}
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
                Mot volé par {{ item.team.name }}
              </button>
            </template>
          </div>
        </div>

        <div
          v-if="gameOver"
          class="mt-3 p-3 rounded-xl bg-pastelyellow-500/60 text-sm text-slate-800"
        >
          <p class="font-semibold">Partie terminée 🎉</p>
          <p v-if="winners.length === 1">
            Victoire de <span class="font-bold">{{ winners[0]?.name }}</span>
            avec {{ winners[0]?.score }} points !
          </p>
          <p v-else>
            Égalité entre
            <span class="font-bold">
              {{ winners.map((w) => w.name).join(", ") }}
            </span>
            avec {{ winners[0]?.score }} points.
          </p>
          <button
            class="mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900"
            @click="handleReset"
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

    <!-- Scores en bas, centrés -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
      <div class="rounded-3xl p-0.5 bg-pastelblue-500 shadow-2xl">
        <div
          class="bg-white/95 backdrop-blur-md rounded-[calc(1.5rem-2px)] px-4 py-3 flex flex-col items-center justify-between gap-3"
        >
          <p class="text-xs uppercase tracking-wide text-pastelblue-500 font-extrabold flex items-center gap-2">
            Scores
          </p>
          <div class="flex flex-wrap justify-center gap-3 w-full">
            <div
              v-for="(team, index) in teams"
              :key="team.name + index"
              class="px-3 py-2 rounded-xl flex items-center gap-2 transition-colors"
              :class="index === currentTeamIndex ? 'bg-pastelgreen-500/70 text-slate-900' : 'bg-slate-100 text-slate-700'"
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
          class="text-sm text-slate-700 flex flex-col gap-2 max-h-80 overflow-y-auto pr-1"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
} = useCompliciteGame();

const showRules = ref(false);

/**
 * État : manche en cours ou en attente du bouton "Prêt"
 */
const roundReady = ref(false);

/**
 * Timer de manche : 3 minutes (180 secondes)
 */
const ROUND_DURATION = 3 * 60; // 180s
const timeLeft = ref(ROUND_DURATION);
const timerRunning = ref(false);
let timerId: ReturnType<typeof setInterval> | null = null;

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  const minStr = minutes.toString().padStart(1, "0");
  const secStr = seconds.toString().padStart(2, "0");
  return `${minStr}:${secStr}`;
});

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  timerRunning.value = false;
}

function startTimer() {
  stopTimer();
  timeLeft.value = ROUND_DURATION;
  timerRunning.value = true;

  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      timeLeft.value = 0;
      stopTimer();
    }
  }, 1000);
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
  timeLeft.value = ROUND_DURATION;
  resetGame();
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
    }
  }
);

onBeforeUnmount(() => {
  stopTimer();
});
</script>
