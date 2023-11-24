<template>
  <div class="champion-list-container">
    <h1>Campões League Of Legends</h1>
    <div class="search-input-container">
      <input v-model="searchTerm" placeholder="Procurar Campeão..." class="search-input" />
      <div class="search-icon">
        <i class="fas fa-search"></i>

      </div>
    </div>

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

    <!-- Adicione um scroll para o conteúdo do modal -->
    <div class="modal-content">
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
html{
background: rgb(3,7,51);
background: radial-gradient(circle, rgba(3,7,51,1) 0%, rgba(0,0,0,1) 100%);
color: white;
font-family: 'Roboto', sans-serif;


}


.champion-list-container {
  max-width: 100%; /* Ajuste a largura conforme necessário */
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.champion-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap; /* Garante que os itens possam envolver para a próxima linha se não houver espaço suficiente */
  justify-content: space-around; /* Distribui os itens uniformemente ao longo do contêiner */
}

.champion-item {
  flex: 0 0 200px; /* Largura fixa dos itens, ajuste conforme necessário */
  margin-bottom: 20px;
}

.champion-card {
  position: relative;
  cursor: pointer;
}

.champion-image {
  width: 100%;
  height: auto;
  
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

.ability-image {
  width: 50px;  /* ajuste o tamanho conforme necessário */
  height: 50px; /* ajuste o tamanho conforme necessário */
  margin-right: 10px;
}

.modal-content {
  max-height: 300px; /* Defina a altura máxima conforme necessário */
  overflow-y: auto; /* Habilita a barra de rolagem vertical quando necessário */
}

.modal-content::-webkit-scrollbar {
  width: 8px; /* Largura da barra de rolagem */
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #888888; /* Cor do botão de rolagem */
  border-radius: 4px; /* Borda arredondada do botão de rolagem */
}

.modal-content::-webkit-scrollbar-track {
  background-color: rgb(38, 19, 112)1)241); /* Cor da faixa de rolagem */
}


.modal {
  background: rgb(3,7,51);
background: radial-gradient(circle, rgba(3,7,51,1) 0%, rgba(0,0,0,1) 100%);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: relative;
  color:white;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
}

.search-input {
  
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 30%;
  height: 50px;
  outline: none;
  border: none;
  background: #1a1a1a; /* Cor de fundo escura */
  color: white;
  text-shadow: 0 0 10px #1a1a1a; /* Sombra do texto com a cor de fundo escura */
  padding: 0 80px 0 20px;
  border-radius: 30px;
  box-shadow: 0 0 25px 0 #1a1a1a, 0 20px 25px 0 rgba(0, 0, 0, 0.2);
  transition: all 1s;
  opacity: 1;
  z-index: 5;
  font-weight: bolder;
  letter-spacing: 0.1em;
  font-family: 'Inconsolata', monospace;
}

.search-input:hover {
  cursor: pointer;
}



.search-input::placeholder {
  color: white;
  opacity: 0.5;
  font-weight: bolder;
}





.tag-filters {
  margin-bottom: 10px;
  margin-top: 20px;
}

.tag-filters label {
  margin-right: 10px;
}

.champion-details {
  padding: 10px;
}

.champion-name {
  font-size: 1.2em;
}

.champion-title {
  color: #bdbdbd;
  margin-top: 5px;
}
</style>
