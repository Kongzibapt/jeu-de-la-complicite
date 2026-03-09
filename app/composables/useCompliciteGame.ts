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
  totalRounds: number;
  maxRerollsPerRound: number;
  roundDurationMs: number;
  isSuddenDeath: boolean;
};

export const useCompliciteGame = () => {
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

  const totalRounds = useState<number>("totalRounds", () => 10);
  const maxRerollsPerRound = useState<number>("maxRerollsPerRound", () => 3);
  const roundDurationMs = useState<number>("roundDurationMs", () => 90 * 1000);
  const isSuddenDeath = useState<boolean>("isSuddenDeath", () => false);

  const rerollsLeft = useState<number>("rerollsLeft", () => maxRerollsPerRound.value);

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
      totalRounds: totalRounds.value,
      maxRerollsPerRound: maxRerollsPerRound.value,
      roundDurationMs: roundDurationMs.value,
      isSuddenDeath: isSuddenDeath.value,
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

    if (typeof state.totalRounds === "number" && state.totalRounds >= 1) {
      totalRounds.value = state.totalRounds;
    }

    if (typeof state.maxRerollsPerRound === "number" && state.maxRerollsPerRound >= 0) {
      maxRerollsPerRound.value = state.maxRerollsPerRound;
    }

    if (typeof state.roundDurationMs === "number" && state.roundDurationMs > 0) {
      roundDurationMs.value = state.roundDurationMs;
    }

    if (typeof state.isSuddenDeath === "boolean") {
      isSuddenDeath.value = state.isSuddenDeath;
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
      rerollsLeft.value = maxRerollsPerRound.value;
    }
  }

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
    isSuddenDeath.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound.value;
    secretWord.value = null;

    teams.value = teams.value.slice(0, nbTeams.value);
    teams.value.forEach((t) => {
      t.name = t.name.trim();
      t.score = 0;
    });

    writePersistedState(snapshotState());

    return true;
  }

  function resetGame() {
    gameStarted.value = false;
    gameOver.value = false;
    isSuddenDeath.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    secretWord.value = null;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound.value;

    teams.value = Array.from({ length: nbTeams.value }, () => ({
      name: "",
      score: 0,
    }));
  }

  function drawNewWord() {
    if (!gameStarted.value) return;
    if (rerollsLeft.value <= 0) return;

    rerollsLeft.value -= 1;
    drawWord(false);
  }

  function nextRound() {
    if (isSuddenDeath.value) {
      // Timeout during sudden death: rotate team and reset word, keep playing
      currentTeamIndex.value = (currentTeamIndex.value + 1) % nbTeams.value;
      secretWord.value = null;
      rerollsLeft.value = maxRerollsPerRound.value;
      return;
    }

    if (currentRound.value >= totalRounds.value) {
      gameOver.value = true;
      gameStarted.value = false;
      return;
    }

    currentRound.value += 1;
    currentTeamIndex.value = (currentTeamIndex.value + 1) % nbTeams.value;
    secretWord.value = null;
    rerollsLeft.value = maxRerollsPerRound.value;
  }

  function awardPoint(teamIndex: number) {
    if (!gameStarted.value) return;

    // @ts-ignore
    teams.value[teamIndex].score += 1;

    if (isSuddenDeath.value) {
      isSuddenDeath.value = false;
      gameOver.value = true;
      gameStarted.value = false;
      return;
    }

    nextRound();
  }

  function startSuddenDeath() {
    isSuddenDeath.value = true;
    gameOver.value = false;
    gameStarted.value = true;
    secretWord.value = null;
    rerollsLeft.value = maxRerollsPerRound.value;
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
    roundDurationMs,
    isSuddenDeath,
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
    nextRound,
    startRoundIfNeeded,
    startSuddenDeath,
  };
};
