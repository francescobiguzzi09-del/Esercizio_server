const COLLECTION_NAME = "weather_history";

let isLoggedIn = false;

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const historyBox = document.getElementById("search-history-box");
const historyList = document.getElementById("search-history-list");

// 1. All'avvio della pagina controlla se l'utente è loggato
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/v1/auth/me");

        if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
        }

        const user = await response.json();

        if (!user.authenticated) {
        return;
        }
        isLoggedIn = true;
        if (isLoggedIn) {
            historyBox.style.display = "block";
            await loadSearchHistory();
        }
    } catch (error) {
        console.error("Errore durante il controllo dell'autenticazione:", error);
    }
});



// 2. Recupera la cronologia tramite gateway (searchData)
async function loadSearchHistory() {
    try {
        const res = await fetch(`/api/v1/data/search-data/${COLLECTION_NAME}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (!res.ok) return;

        const searches = await res.json();
        renderSearchHistory(searches);
    } catch (error) {
        console.error("Errore caricamento cronologia:", error);
    }
}

// 3. Salva una nuova città tramite gateway (saveData)
async function saveSearchCity(cityName) {
    if (!isLoggedIn) return;

    try {
        const res = await fetch(`/api/v1/data/save-data/${COLLECTION_NAME}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ city: cityName })
        });

        if (res.ok) {
            await loadSearchHistory();
        }
    } catch (error) {
        console.error("Errore salvataggio ricerca:", error);
    }
}

// 4. Costruisce la lista nel DOM
function renderSearchHistory(searches) {
    historyList.innerHTML = "";

    if (!searches || searches.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "Nessuna ricerca recente.";
        historyList.appendChild(emptyItem);
        return;
    }

    // Ordina dalla più recente alla più vecchia e mostra le ultime 10
    const recentSearches = [...searches]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    recentSearches.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.city;
        li.style.cursor = "pointer";
        li.title = "Clicca per cercare di nuovo";

        li.addEventListener("click", () => {
            cityInput.value = item.city;
            weatherForm.requestSubmit();
        });

        historyList.appendChild(li);
    });
}

// 5. Gestione invio form meteo
weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) return;

    const res = await fetch(`/api/v1/weather`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ city })
    });

    const data = await res.json();

    if (!res.ok) {
        weatherResult.innerHTML = `<p>Errore: ${data.error || "Città non trovata"}</p>`;
        weatherResult.style.display = "block";
        return;
    }

    weatherResult.innerHTML = `
        <div class="weather-response-box">
            <p>${data.city}</p>
            <p>${data.description}</p>
            <p>Temperatura: ${data.temperature} °C</p>
            <p>Umidità: ${data.humidity} %</p>
            <img src="https://openweathermap.org/img/wn/${data.icon}.png" alt="Weather Icon" class="weather-icon">
        </div>
    `;
    weatherResult.style.display = "block";

    await saveSearchCity(data.city || city);
});