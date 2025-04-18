// Éléments du DOM
const countriesContainer = document.getElementById("countriesContainer");
const countryCount = document.getElementById("countryCount");
const countValue = document.getElementById("countValue");

// Récupère l'ID de la barre de recherche
const searchInput = document.getElementById("searchInput");

// Récupère l'ID du bouton sort pour le tri alphabétique
const btnSortNameAsc = document.getElementById("sortNameAsc");
const btnSortNameDesc = document.getElementById("sortNameDesc");
const btnSortPopAsc = document.getElementById("sortPopAsc");
const btnSortPopDesc = document.getElementById("sortPopDesc");

// Récupère l'ID du select pour la région
const regionFilter = document.getElementById("regionFilter");

// Variables globales
//allCountries Stockera tous les pays récupérés de l'API
var allcountries = [];
var displayLimit = 12;
var sortMethod = "";

// Variable pour stocker la région choisie
var selectedRegion = "";

// Variable pour stocker le nom d'un pays qu'on aura rechercher
var searchTerm = "";

// Fonction pour récupérer les données de l'API
async function fetchCountries() {
  try {
    // ÉTAPE 1: Utilisez fetch pour récupérer les données depuis l'API
    // URL: https://restcountries.com/v3.1/all
    // N'oubliez pas d'utiliser await car c'est une opération asynchrone
    const response = await fetch("https://restcountries.com/v3.1/all");

    // ÉTAPE 2: Vérifiez si la réponse est OK (statut 200)
    // Si la réponse n'est pas OK, lancez une erreur
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }

    // ÉTAPE 3: Convertissez la réponse en JSON (c'est aussi une opération asynchrone)
    const data = await response.json();
    console.log("Data country :", data);

    // ÉTAPE 4: Assignez les données à la variable allCountries
    allcountries = data;

    // ÉTAPE 5: Appelez la fonction pour afficher les pays (on oublie les parenthèses)
    displayCountries();
  } catch (error) {
    // Gérez les erreurs potentielles
    console.error("Erreur:", error);
    countriesContainer.innerHTML =
      '<p class="error">Impossible de charger les données. Veuillez réessayer plus tard.</p>';
  }
}

// Fonction pour formater un nombre avec des séparateurs de milliers
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Fonction pour rechercher un pays
function searchCountries() {
  searchTerm = searchInput.value.toLowerCase();
  displayCountries();
}

// Fonction pour afficher les pays
function displayCountries() {
  // Vider le conteneur countriesContainer avant de réafficher
  countriesContainer.innerHTML = "";

  // Limitez le nombre de pays à afficher avec slice
  let filteredCountries = [...allcountries];

  // Filtrer par texte rechercher
  if (searchTerm !== "") {
    filteredCountries = filteredCountries.filter((country) => {
      const countryName = country.translations.fra.common.toLowerCase();
      return countryName.includes(searchTerm);
    });
  }

  // Filtrer par région
  if (selectedRegion !== "") {
    filteredCountries = filteredCountries.filter((country) => {
      return country.region == selectedRegion;
    });
  }

  // Tri en fonction de sortMethod
  if (sortMethod == "az") {
    filteredCountries.sort((a, b) => {
      return a.translations.fra.common.localeCompare(b.translations.fra.common);
    });
  } else if (sortMethod == "za") {
    filteredCountries.sort((a, b) => {
      return b.translations.fra.common.localeCompare(a.translations.fra.common);
    });
  } else if (sortMethod == "popAsc") {
    filteredCountries.sort((a, b) => {
      return a.population - b.population;
    });
  } else if (sortMethod == "popDesc") {
    filteredCountries.sort((a, b) => {
      return b.population - a.population;
    });
  }

  // Limiter le nombre de pays à afficher (slice)
  const limitedCountries = filteredCountries.slice(0, displayLimit);

  // Afficher les cartes
  limitedCountries.map((country) => {
    const drapeau = country.flags.png;
    const nomPays = country.translations.fra.common;
    const nbPopulation = country.population;
    const capitale = country.capital ? country.capital[0] : "Capitale inconnue";
    const region = country.region;

    const countryCard = `
      <div class="country-card">
        <div class="flag-container">
          <img src="${drapeau}" alt="Drapeau de ${nomPays}">
        </div>
        <div class="country-info">
          <h2>${nomPays}</h2>
          <p><strong>Capitale:</strong> ${capitale}</p>
          <p><strong>Population:</strong> ${formatNumber(nbPopulation)}</p>
          <p><strong>Région:</strong> ${region}</p>
        </div>
      </div>
    `;

    // Ajouter la carte countryCard au innerHTML du conteneur
    countriesContainer.innerHTML += countryCard;
  });
}

// ÉTAPE 7: Ajoutez un écouteur d'événement au curseur pour changer le nombre de pays affiché
// addEventListener
// Mettez à jour la valeur affichée
countryCount.addEventListener("input", () => {
  displayLimit = parseInt(countryCount.value);
  countValue.textContent = displayLimit;
  displayCountries();
});

// Réaffichez les pays avec la nouvelle limite

// ÉTAPE 8: Appelez la fonction pour récupérer les pays lorsque la page est chargée
fetchCountries();

// Ajout des événements

///////////////////
// Pour rechercher un pays
//////////////////
searchInput?.addEventListener("input", searchCountries);

/////////////////
// Pour le tri alphabétique  (A-Z et Z-A)
////////////////
btnSortNameAsc.addEventListener("click", () => {
  sortMethod = "az";
  displayCountries();
});

btnSortNameDesc.addEventListener("click", () => {
  sortMethod = "za";
  displayCountries();
});

btnSortPopAsc.addEventListener("click", () => {
  sortMethod = "popAsc";
  displayCountries();
});

btnSortPopDesc.addEventListener("click", () => {
  sortMethod = "popDesc";
  displayCountries();
});

//////////////////
// Pour le choix de la région choisie
/////////////////
regionFilter.addEventListener("change", () => {
  selectedRegion = regionFilter.value;
  displayCountries();
});
