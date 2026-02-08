// HTML Elemanlarını Seçme
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// Değişkenler
let timerId = null;
let isWorking = true;
let timeLeft = parseInt(workInput.value) * 60;

// Ekranı Güncelleme Fonksiyonu
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Zamanlayıcıyı Başlatma
function startTimer() {
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
}

// Mod Değiştirme (Çalışma <-> Mola)
function switchMode() {
    isWorking = !isWorking;
    
    if (isWorking) {
        timeLeft = parseInt(workInput.value) * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        alert("Mola bitti, odaklanma zamanı!");
    } else {
        timeLeft = parseInt(breakInput.value) * 60;
        statusLabel.textContent = "Mola Zamanı";
        alert("Çalışma bitti, mola vakti!");
    }
    updateDisplay();
}

// Olay Dinleyicileri (Butonlar)
startBtn.addEventListener('click', startTimer);

pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    timeLeft = parseInt(workInput.value) * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// Hazır Mod Butonları Mantığı
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        workInput.value = btn.getAttribute('data-work');
        breakInput.value = btn.getAttribute('data-break');
        isWorking = true;
        timeLeft = parseInt(workInput.value) * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        updateDisplay();
    });
});

// Kullanıcı kutucuğa sayı yazdığında saati anında güncelle
workInput.addEventListener('input', () => {
    if (isWorking && timerId === null) {
        timeLeft = parseInt(workInput.value) * 60;
        updateDisplay();
    }
});

// Sayfa ilk yüklendiğinde ekranı hazırla
updateDisplay();
