let currentPage = 1;
let totalPages = 0;
const pokemonPerPage = 10;

const pokemonContainer = document.getElementById('pokemonContainer');
const btnPrevious = document.getElementById('btnPrevious');
const btnNext = document.getElementById('btnNext');
const btnPreviousBottom = document.getElementById('btnPreviousBottom');
const btnNextBottom = document.getElementById('btnNextBottom');
const pageInfo = document.getElementById('pageInfo');
const pageInfoBottom = document.getElementById('pageInfoBottom');

async function loadPokemons(offset = 0) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${pokemonPerPage}`);
        const data = await response.json();
        
        totalPages = Math.ceil(data.count / pokemonPerPage);
        currentPage = Math.floor(offset / pokemonPerPage) + 1;
        
        displayPokemons(data.results);
        updateNavigation();
        
    } catch (error) {
        console.error('Error:', error);
        pokemonContainer.innerHTML = '<div class="col-12"><p class="text-center">Error al cargar pokémones</p></div>';
    }
}

async function getPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function displayPokemons(pokemonList) {
    pokemonContainer.innerHTML = '';
    
    for (let pokemonData of pokemonList) {
        const pokemon = await getPokemonDetails(pokemonData.url);
        
        if (pokemon) {
            const pokemonCard = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="pokemon-card">
                        <img src="${pokemon.sprites.front_default || 'https://via.placeholder.com/96x96/f0f0f0/999?text=No+Image'}" alt="${pokemon.name}" class="pokemon-image">
                        <div class="pokemon-name">${pokemon.name}</div>
                        <div class="pokemon-id">#${pokemon.id}</div>
                    </div>
                </div>
            `;
            pokemonContainer.innerHTML += pokemonCard;
        }
    }
}

function updateNavigation() {
    const pageText = `Página ${currentPage} de ${totalPages}`;
    pageInfo.textContent = pageText;
    pageInfoBottom.textContent = pageText;
    
    btnPrevious.disabled = currentPage === 1;
    btnPreviousBottom.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
    btnNextBottom.disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        const offset = (currentPage - 2) * pokemonPerPage;
        loadPokemons(offset);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        const offset = currentPage * pokemonPerPage;
        loadPokemons(offset);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    btnPrevious.addEventListener('click', previousPage);
    btnNext.addEventListener('click', nextPage);
    btnPreviousBottom.addEventListener('click', previousPage);
    btnNextBottom.addEventListener('click', nextPage);
    loadPokemons();
});