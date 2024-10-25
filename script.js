const diceButton = document.getElementById('dice-button');
let adviceCache = {};

diceButton.addEventListener('click', debounce(fetchAdvice, 200)); 
async function fetchAdvice() {
    showLoading(); 

    const randomId = Math.floor(Math.random() * 200); 
    // Check if advice with this ID is already cached
    if (adviceCache[randomId]) {
        displayAdvice(adviceCache[randomId]);
        return;
    }

    try {
        const response = await fetch(`https://api.adviceslip.com/advice/${randomId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        adviceCache[randomId] = data.slip.advice; // Cache the fetched advice
        displayAdvice(data.slip.advice);
    } catch (error) {
        console.error("Failed to fetch advice:", error);
        document.getElementById('advice-text').textContent = "Sorry, we couldn't get advice right now. Please try again later.";
    } finally {
        diceButton.disabled = false; // Re-enable button after fetch completes
    }
}

function displayAdvice(advice) {
    document.getElementById("advice-text").textContent = advice;
}

function showLoading() {
    document.getElementById("advice-text").textContent = "Loading...";
}

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Load a random advice on initial load
fetchAdvice();
