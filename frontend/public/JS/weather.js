document.getElementById("weather-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = document.getElementById("city-input").value;
    
    const res = await fetch("/weather" , { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ city })
    });

    const data = await res.text();

    document.getElementById("weather-result").innerHTML = `
          <div class="weather-response-box">
                <p>${data}</p>
          </div>`;
 
    document.getElementById("weather-result").style.display = "block";
});
