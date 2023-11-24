<template>
  <div class="champion-list-container">
    <h1>Campões League Of Legends</h1>
    <input v-model="searchTerm" placeholder="Procurar Campeão..." class="search-input" />
    
    <!-- Lista de checkboxes para as tags -->
    <div class="tag-filters">
      <label v-for="tag in uniqueTags" :key="tag">
        <input type="checkbox" v-model="selectedTags" :value="tag" />
        {{ tag }}
      </label>
    </div>

    <ul class="champion-list">
      <li v-for="champion in filteredChampions" :key="champion.id" class="champion-item">
        <div class="champion-card" @click="showModal(champion)">
          <img :src="getChampionImage(champion.id)" alt="Champion Image" class="champion-image" />
          <div class="champion-details">
            <strong class="champion-name">{{ champion.name }}</strong>
            <p class="champion-title">{{ champion.title }}</p>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="isModalVisible" class="modal-overlay" @click="hideModal">
      <div class="modal" @click.stop>
        <span class="close" @click="hideModal">&times;</span>
        <h2>{{ modalChampion.name }}</h2>
        <p>{{ modalChampion.title }}</p>
        <div v-if="modalChampionAbilities">
          <div v-for="(ability, index) in modalChampionAbilities" :key="index">
            <img :src="getAbilityImage(ability.id)" alt="Ability Image" class="ability-image" />
            <strong>{{ ability.name }}</strong> - <span v-html="formatAbilityDescription(ability.description)"></span>
          </div>
        </div>
        <p><strong>Descrição:</strong> {{ modalChampion.blurb }}</p>
        <p><strong>Tags:</strong> {{ modalChampion.tags.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      champions: [],
      searchTerm: "",
      isModalVisible: false,
      modalChampion: null,
      modalChampionAbilities: null,
      selectedTags: [], // Lista de tags selecionadas
    };
  },
  computed: {
    filteredChampions() {
      return this.champions.filter((champion) =>
        champion.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedTags.length === 0 || champion.tags.some(tag => this.selectedTags.includes(tag)))
      );
    },
    uniqueTags() {
      // Obtém uma lista de tags únicas de todos os campeões
      const tags = new Set();
      this.champions.forEach((champion) => {
        champion.tags.forEach((tag) => tags.add(tag));
      });
      return Array.from(tags);
    },
  },
  mounted() {
    this.fetchChampions();
  },
  methods: {
    async fetchChampions() {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/13.23.1/data/pt_BR/champion.json"
        );
        const data = await response.json();
        this.champions = Object.values(data.data);
      } catch (error) {
        console.error("Error fetching champions:", error);
      }
    },
    async fetchChampionAbilities(championId) {
      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/13.23.1/data/pt_BR/champion/${championId}.json`
        );
        const data = await response.json();
        const championData = Object.values(data.data)[0];
        this.modalChampionAbilities = championData.spells;
      } catch (error) {
        console.error(`Error fetching abilities for ${championId}:`, error);
      }
    },
    getChampionImage(championId) {
      return `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${championId}.png`;
    },
    getAbilityImage(abilityId) {
      return `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/${abilityId}.png`;
    },
    formatAbilityDescription(description) {
      // Adicione as mudanças de estilo necessárias ao texto da habilidade aqui
      // Por exemplo, trocar a cor do texto
      return `<span style="color: red;">${description}</span>`;
    },
    showModal(champion) {
      this.modalChampion = champion;
      this.fetchChampionAbilities(champion.id);
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
      this.modalChampion = null;
      this.modalChampionAbilities = null;
    },
  },
};
</script>

<style>
/* Estilos globais aqui */
.champion-list-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.champion-card {
  position: relative;
  cursor: pointer;
}

.ability-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.modal-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
}

.tag-filters {
  margin-bottom: 10px;
}

.tag-filters label {
  margin-right: 10px;
}

.champion-list {
  list-style: none;
  padding: 0;
}

.champion-item {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.champion-image {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ccc;
}

.champion-details {
  padding: 10px;
}

.champion-name {
  font-size: 1.2em;
}

.champion-title {
  color: #666;
  margin-top: 5px;
}
</style>
