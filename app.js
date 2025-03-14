class Pokemon {
    constructor(name, url, image) {
      this.name = name;
      this.url = url;
      this.image = image;
    }
  
    getDisplayName() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
  }
  
  const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=150';
  let pokemonList = [];
  
  const searchInput = document.getElementById('search');
  const totalElement = document.getElementById('total');
  const pokemonListElement = document.getElementById('pokemon-list');
  
  const renderList = (list) => {
    pokemonListElement.innerHTML = '';
    list.forEach(pokemon => {
      const listItem = document.createElement('li');
      
      const image = document.createElement('img');
      image.src = pokemon.image;
      image.alt = pokemon.name;
      image.width = 80;
      image.height = 80;
      
      const name = document.createElement('span');
      name.textContent = pokemon.getDisplayName();
      
      listItem.appendChild(image);
      listItem.appendChild(name);
      pokemonListElement.appendChild(listItem);
    });
  };
  
  async function fetchPokemonData() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const totalPokemons = data?.count ?? 0;
      totalElement.textContent = `Total de Pokémon: ${totalPokemons}`;
  
      const promises = data.results.map(async ({ name, url }) => {
        const detailsResponse = await fetch(url);
        const detailsData = await detailsResponse.json();
        return new Pokemon(name, url, detailsData.sprites.front_default);
      });
  
      pokemonList = await Promise.all(promises);
      renderList(pokemonList);
    } catch (error) {
      console.error('Error al obtener los datos de Pokémon:', error);
    }
  }
  
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredList = pokemonList.filter(pokemon => pokemon.name.includes(searchTerm));
    renderList(filteredList);
  });
  
  // Iniciar la carga de datos
  fetchPokemonData();