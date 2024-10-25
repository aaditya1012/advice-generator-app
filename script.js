const diceButton = document.getElementById('dice-button');
diceButton.addEventListener('click', debounce(fetchAdvice, 500)); // Debounce with 500ms delay

async function fetchAdvice() {
    const timeout = 5000; // 5 seconds timeout
    diceButton.disabled = true; // Disable button during fetch

    try {
        const response = await Promise.race([
            fetch('https://api.adviceslip.com/advice'),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        document.getElementById('advice-id').textContent = data.slip.id;
        document.getElementById('advice-text').textContent = `"${data.slip.advice}"`;
    } catch (error) {
        console.error('Failed to fetch advice:', error);
        document.getElementById('advice-text').textContent = "Sorry, we couldn't get advice right now. Please try again later.";
    } finally {
        diceButton.disabled = false; // Re-enable button after fetch completes
    }
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
