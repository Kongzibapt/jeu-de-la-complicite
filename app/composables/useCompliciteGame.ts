// composables/useCompliciteGame.ts
import names from "@/data/names";
import { computed, watch } from "vue";

const STORAGE_KEY = "complicite-game-state";

export interface Team {
  name: string;
  score: number;
}

type PersistedGameState = {
  nbTeams: 2 | 3;
  teams: Team[];
  currentRound: number;
  currentTeamIndex: number;
  secretWord: string | null;
  usedIndices: number[];
  gameStarted: boolean;
  gameOver: boolean;
  rerollsLeft: number;
};

export const useCompliciteGame = () => {
  const totalRounds = 10;

  const nbTeams = useState<2 | 3>("nbTeams", () => 2);
  const teams = useState<Team[]>("teams", () => [
    { name: "", score: 0 },
    { name: "", score: 0 },
  ]);

  const currentRound = useState<number>("currentRound", () => 1);
  const currentTeamIndex = useState<number>("currentTeamIndex", () => 0);
  const secretWord = useState<string | null>("secretWord", () => null);
  const usedIndices = useState<number[]>("usedIndices", () => []);
  const gameStarted = useState<boolean>("gameStarted", () => false);
  const gameOver = useState<boolean>("gameOver", () => false);
  const storageHydrated = useState<boolean>("complicite:storage-hydrated", () => false);

  const maxRerollsPerRound = 3;
  const rerollsLeft = useState<number>("rerollsLeft", () => maxRerollsPerRound);

  function readPersistedState(): Partial<PersistedGameState> | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<PersistedGameState>;
    } catch {
      return null;
    }
  }

  function writePersistedState(state: PersistedGameState) {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota/security errors silently
    }
  }

  function snapshotState(): PersistedGameState {
    return {
      nbTeams: nbTeams.value,
      teams: teams.value.map((team) => ({ ...team })),
      currentRound: currentRound.value,
      currentTeamIndex: currentTeamIndex.value,
      secretWord: secretWord.value,
      usedIndices: [...usedIndices.value],
      gameStarted: gameStarted.value,
      gameOver: gameOver.value,
      rerollsLeft: rerollsLeft.value,
    };
  }

  function ensureTeamSlots(targetLength: number = nbTeams.value) {
    if (teams.value.length < targetLength) {
      const missing = targetLength - teams.value.length;
      for (let i = 0; i < missing; i++) {
        teams.value.push({ name: "", score: 0 });
      }
    } else if (teams.value.length > targetLength) {
      teams.value = teams.value.slice(0, targetLength);
    }
  }

  function applyPersistedState(state: Partial<PersistedGameState>) {
    if (!state) return;
    if (state.nbTeams === 2 || state.nbTeams === 3) {
      nbTeams.value = state.nbTeams;
    }

    if (Array.isArray(state.teams) && state.teams.length) {
      const normalized = state.teams
        .slice(0, 3)
        .map((team) => ({
          name: typeof team?.name === "string" ? team.name : "",
          score: typeof team?.score === "number" ? team.score : 0,
        }));

      teams.value = normalized;
    }
    ensureTeamSlots();

    if (typeof state.currentRound === "number" && state.currentRound >= 1) {
      currentRound.value = state.currentRound;
    }

    if (typeof state.currentTeamIndex === "number") {
      currentTeamIndex.value = state.currentTeamIndex;
    }

    if (
      typeof state.secretWord === "string" ||
      state.secretWord === null
    ) {
      secretWord.value = state.secretWord ?? null;
    }

    if (Array.isArray(state.usedIndices)) {
      usedIndices.value = state.usedIndices.map((idx) => Number(idx) || 0);
    }

    if (typeof state.gameStarted === "boolean") {
      gameStarted.value = state.gameStarted;
    }

    if (typeof state.gameOver === "boolean") {
      gameOver.value = state.gameOver;
    }

    if (typeof state.rerollsLeft === "number") {
      rerollsLeft.value = state.rerollsLeft;
    }
  }

  if (import.meta.client && !storageHydrated.value) {
    const savedState = readPersistedState();
    if (savedState) {
      applyPersistedState(savedState);
    }
    ensureTeamSlots();
    storageHydrated.value = true;
  }

  if (import.meta.client) {
    watch(
      () => snapshotState(),
      (state) => {
        writePersistedState(state);
      },
      { deep: true }
    );
  }
  

  const currentTeam = computed(() => teams.value[currentTeamIndex.value] || null);

  const otherTeams = computed(() =>
    teams.value
      .map((team, index) => ({ team, index }))
      .filter(({ index }) => index !== currentTeamIndex.value)
  );

  const winners = computed(() => {
    const maxScore = Math.max(...teams.value.map((t) => t.score));
    return teams.value.filter((t) => t.score === maxScore);
  });

  const canStartGame = computed(() =>
    teams.value
      .slice(0, nbTeams.value)
      .every((team) => team.name.trim().length > 0)
  );

  function setNbTeams(n: 2 | 3) {
    nbTeams.value = n;
    if (teams.value.length > n) {
      teams.value = teams.value.slice(0, n);
    } else if (teams.value.length < n) {
      for (let i = teams.value.length; i < n; i++) {
        teams.value.push({ name: "", score: 0 });
      }
    }
  }

  function updateTeamName(index: number, name: string) {
    const team = teams.value[index];
    if (!team) return;
    team.name = name;
  }

  function getRandomIndex(): number {
    if (!names.length) return 0;

    const usedSet = new Set(usedIndices.value);

    // Si on a presque tout utilisé, on repart à zéro pour éviter le blocage
    if (usedSet.size >= names.length - 1) {
      usedSet.clear();
    }

    let index = Math.floor(Math.random() * names.length);
    while (usedSet.has(index)) {
      index = Math.floor(Math.random() * names.length);
    }

    usedSet.add(index);
    usedIndices.value = Array.from(usedSet);

    return index;
  }

  function drawWord(resetRerolls: boolean = false) {
    if (!names.length) {
      secretWord.value = "Aucun nom disponible 😅 (complète data/names.ts)";
      return;
    }

    const index = getRandomIndex();
    // @ts-ignore
    secretWord.value = names[index];

    if (resetRerolls) {
      rerollsLeft.value = maxRerollsPerRound;
    }
  }

  /**
   * Tirer le premier mot de la manche :
   * - ne consomme pas de reroll
   * - n’affecte pas rerollsLeft (qui doit déjà être à 3)
   */
  function startRoundIfNeeded() {
    if (!secretWord.value) {
      drawWord(false);
    }
  }

  function startGame(): boolean {
    if (!canStartGame.value) {
      return false;
    }

    gameStarted.value = true;
    gameOver.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound;
    secretWord.value = null;

    teams.value = teams.value.slice(0, nbTeams.value);
    teams.value.forEach((t) => {
      t.name = t.name.trim();
      t.score = 0;
    });

    writePersistedState(snapshotState());

    // On attend maintenant le clic sur "Prêt" pour tirer le premier mot
    return true;
  }

  function resetGame() {
    gameStarted.value = false;
    gameOver.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    secretWord.value = null;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound;

    teams.value = Array.from({ length: nbTeams.value }, () => ({
      name: "",
      score: 0,
    }));
  }

  /**
   * Tirage d’un nouveau mot pendant la manche (consomme 1 reroll)
   */
  function drawNewWord() {
    if (!gameStarted.value) return;
    if (rerollsLeft.value <= 0) return;

    rerollsLeft.value -= 1;
    drawWord(false);
  }

  function nextRound() {
    if (currentRound.value >= totalRounds) {
      gameOver.value = true;
      gameStarted.value = false;
      return;
    }

    currentRound.value += 1;
    currentTeamIndex.value = (currentTeamIndex.value + 1) % nbTeams.value;

    // On prépare la manche suivante sans tirer le mot
    secretWord.value = null;
    rerollsLeft.value = maxRerollsPerRound;
  }

  function awardPoint(teamIndex: number) {
    if (!gameStarted.value) return;

    // @ts-ignore
    teams.value[teamIndex].score += 1;
    nextRound();
  }

  return {
    totalRounds,
    nbTeams,
    teams,
    currentRound,
    currentTeamIndex,
    secretWord,
    gameStarted,
    gameOver,
    rerollsLeft,
    maxRerollsPerRound,
    currentTeam,
    otherTeams,
    winners,
    canStartGame,
    storageHydrated,

    setNbTeams,
    updateTeamName,
    startGame,
    resetGame,
    drawNewWord,
    awardPoint,
    startRoundIfNeeded,
  };
};
