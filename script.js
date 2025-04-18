// Éléments du DOM
const countriesContainer = document.getElementById("countriesContainer");
const countryCount = document.getElementById("countryCount");
const countValue = document.getElementById("countValue");

// Récupère l'ID de la barre de recherche
const searchInput = document.getElementById("searchInput");

// Variables globales
//allCountries Stockera tous les pays récupérés de l'API
var allcountries = [];

//displayLimit  Nombre de pays à afficher initialement
var displayLimit = 12;

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

// Fonction de recherche
function searchCountries() {
  const searchTerm = searchInput.value.toLowerCase(); // j'utilise la fonction toLowerCase() pour tout mettre en minuscule pour comparer

  // filtrer les pays selon le texte tapé
  const filteredCountries = allcountries.filter((country) => {
    const countryName = country.translations.fra.common.toLowerCase();
    return countryName.includes(searchTerm);
  });

  // Afficher les pays filtrés
  displayCountries(filteredCountries);
}

//Variable pour traduire la région
const regionTranslations = {
  Africa: "Afrique",
  Americas: "Amériques",
  Asia: "Asie",
  Europe: "Europe",
  Oceania: "Océanie",
  Antarctic: "Antarctique",
};

// Fonction pour afficher les pays
function displayCountries(countries = allcountries) {
  // ÉTAPE 1: Videz le conteneur countriesContainer avant d'ajouter de nouveaux pays
  countriesContainer.innerHTML = "";

  // ÉTAPE 2: Limitez le nombre de pays à afficher avec slice
  let limitedCountries = [...allcountries];

  limitedCountries = countries.slice(0, displayLimit);

  // ÉTAPE 3: Pour chaque (foreach) pays dans limitedCountries, créez une carte
  limitedCountries.map((country) => {
    const drapeau = country.flags?.png || "";
    const nomPays =
      country.translations?.fra?.common || country.name?.common || "Inconnu";
    const nbPopulation = country.population || 0;
    const capitale = country.capital ? country.capital[0] : "Capitale inconnue";
    const region = regionTranslations[country.region] || "Région inconnue";

    // ÉTAPE 4: Ajoutez le HTML interne de la carte avec les informations du pays
    // Utilisez les propriétés de l'objet country:
    // - country.flags.png pour l'URL du drapeau
    // - country.name.common pour le nom du pays
    // - country.capital[0] pour la capitale (attention, vérifiez si elle existe)
    // - country.population pour la population (utilisez formatNumber)
    // - country.region pour la région/continent
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

    // ÉTAPE 5: Ajoutez la carte countryCard au innerhtml du conteneur
    countriesContainer.innerHTML += countryCard;

    // ÉTAPE 6 : Fin du foreach
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
