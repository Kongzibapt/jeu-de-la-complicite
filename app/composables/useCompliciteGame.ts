// composables/useCompliciteGame.ts
import names from "@/data/names";
import { computed } from "vue";

export interface Team {
  name: string;
  score: number;
}

export const useCompliciteGame = () => {
  const totalRounds = 10;

  const nbTeams = useState<2 | 3>("nbTeams", () => 2);
  const teams = useState<Team[]>("teams", () => [
    { name: "Équipe 1", score: 0 },
    { name: "Équipe 2", score: 0 },
  ]);

  const currentRound = useState<number>("currentRound", () => 1);
  const currentTeamIndex = useState<number>("currentTeamIndex", () => 0);
  const secretWord = useState<string | null>("secretWord", () => null);
  const usedIndices = useState<number[]>("usedIndices", () => []);
  const gameStarted = useState<boolean>("gameStarted", () => false);
  const gameOver = useState<boolean>("gameOver", () => false);

  const maxRerollsPerRound = 3;
  const rerollsLeft = useState<number>("rerollsLeft", () => maxRerollsPerRound);

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

  function setNbTeams(n: 2 | 3) {
    nbTeams.value = n;
    if (teams.value.length > n) {
      teams.value = teams.value.slice(0, n);
    } else if (teams.value.length < n) {
      for (let i = teams.value.length; i < n; i++) {
        teams.value.push({ name: `Équipe ${i + 1}`, score: 0 });
      }
    }
  }

  function updateTeamName(index: number, name: string) {
    if (teams.value[index]) {
      teams.value[index].name = name || `Équipe ${index + 1}`;
    }
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

  function startGame() {
    gameStarted.value = true;
    gameOver.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound;
    secretWord.value = null;

    teams.value = teams.value.slice(0, nbTeams.value);
    teams.value.forEach((t, i) => {
      if (!t.name) t.name = `Équipe ${i + 1}`;
      t.score = 0;
    });

    // On attend maintenant le clic sur "Prêt" pour tirer le premier mot
  }

  function resetGame() {
    gameStarted.value = false;
    gameOver.value = false;
    currentRound.value = 1;
    currentTeamIndex.value = 0;
    secretWord.value = null;
    usedIndices.value = [];
    rerollsLeft.value = maxRerollsPerRound;

    teams.value = Array.from({ length: nbTeams.value }, (_, i) => ({
      name: `Équipe ${i + 1}`,
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

    setNbTeams,
    updateTeamName,
    startGame,
    resetGame,
    drawNewWord,
    awardPoint,
    startRoundIfNeeded,
  };
};
