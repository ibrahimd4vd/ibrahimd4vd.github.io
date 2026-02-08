let timeLeft = 10; 
let timerId = null;
let isWorking = true; // Şu an çalışıyor muyuz, mola mı veriyoruz?

const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label'); // HTML'deki başlık

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode(); // Süre bittiğinde modu değiştir
        }
    }, 1000);
}

function switchMode() {
    isWorking = !isWorking; // Modu tam tersine çevir
    
    if (isWorking) {
        timeLeft = 10; // Çalışma süresi
        statusLabel.textContent = "Odaklanma Zamanı";
        alert("Mola bitti, hadi iş başına!");
    } else {
        timeLeft = 5; // Mola süresi
        statusLabel.textContent = "Mola Zamanı";
        alert("Tebrikler, şimdi mola vakti!");
    }
    updateDisplay();
}

// Buton dinleyicilerini tekrar bağlayalım
document.getElementById('start-btn').addEventListener('click', startTimer);
document.getElementById('pause-btn').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});
document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    timeLeft = 25 * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});
