const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let timerId = null;
let isWorking = true;
let timeLeft = workInput.value * 60;

// EKRANI GÜNCELLEME (Dakika ve Saniye hesaplama)
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
// Kullanıcı kutucuktaki sayıyı değiştirdiği an saat de değişsin:
workInput.addEventListener('input', () => {
    if (isWorking && timerId === null) {
        timeLeft = workInput.value * 60;
        updateDisplay();
    }
    });

function switchMode() {
    isWorking = !isWorking;
    
    if (isWorking) {
        timeLeft = workInput.value * 60; // Sabit sayı yerine input değeri!
        statusLabel.textContent = "Odaklanma Zamanı";
    } else {
        timeLeft = breakInput.value * 60; // Sabit sayı yerine input değeri!
        statusLabel.textContent = "Mola Zamanı";
    }
    updateDisplay();
}
});

breakInput.addEventListener('input', () => {
    if (!isWorking && timerId === null) {
        timeLeft = breakInput.value * 60;
        updateDisplay();
    }
});

// BAŞLAT
startBtn.addEventListener('click', () => {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
        }
    }, 1000);
});

// MOD DEĞİŞTİRME
function switchMode() {
    isWorking = !isWorking;
    if (isWorking) {
        timeLeft = workInput.value * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        alert("Çalışma zamanı!");
    } else {
        timeLeft = breakInput.value * 60;
        statusLabel.textContent = "Mola Zamanı";
        alert("Mola zamanı!");
    }
    updateDisplay();
}

// DURAKLAT
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

// SIFIRLA
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    timeLeft = workInput.value * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// Sayfa ilk açıldığında hazırla
updateDisplay();
