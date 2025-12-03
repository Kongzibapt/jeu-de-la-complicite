<template>
  <div
    class="min-h-screen bg-linear-to-br from-pastelblue-500 via-pastelpink-500 to-pastelyellow-500 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-6"
    >
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800">
          Le jeu de la complicité
        </h1>
        <p class="text-slate-600">
          Configure les équipes avant de lancer la partie.
        </p>
      </header>

      <section class="bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
        <h2 class="font-semibold text-slate-800 text-lg">Création des équipes</h2>

        <div class="flex flex-col gap-3">
          <label class="text-sm text-slate-700">Nombre d'équipes</label>
          <div class="flex gap-3">
            <button
              class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
              :class="nbTeams === 2 ? 'bg-pastelgreen-500 border-pastelgreen-500 font-semibold' : 'bg-white border-slate-300'"
              @click="setNbTeams(2)"
            >
              2 équipes (4 joueurs)
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-xl border text-sm md:text-base"
              :class="nbTeams === 3 ? 'bg-pastelgreen-500 border-pastelgreen-500 font-semibold' : 'bg-white border-slate-300'"
              @click="setNbTeams(3)"
            >
              3 équipes (6 joueurs)
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <label class="text-sm text-slate-700">Nom des équipes</label>
          <div class="flex flex-col gap-2">
            <div
              v-for="(team, index) in teams"
              :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-slate-500 w-16">Équipe {{ index + 1 }}</span>
              <input
                :value="team.name"
                class="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                placeholder="Nom d'équipe"
                @input="(e: any) => updateTeamName(index, e.target.value)"
              />
            </div>
          </div>
        </div>

        <button
          class="mt-2 w-full px-4 py-3 rounded-xl text-white font-semibold text-sm md:text-base
                 bg-slate-800 hover:bg-slate-900"
          @click="goToGame"
        >
          Lancer la partie
        </button>
      </section>

      <p class="text-xs text-slate-500 text-center">
        Les mots à faire deviner viendront d’une grande banque de noms de pop culture récente.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const {
  nbTeams,
  teams,
  setNbTeams,
  updateTeamName,
  startGame,
} = useCompliciteGame();

function goToGame() {
  startGame();
  router.push("/game");
}
</script>
