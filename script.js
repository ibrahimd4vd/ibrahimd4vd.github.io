// 1. Elementleri Seçme
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// 2. Değişkenler
let timerId = null;
let isWorking = true;
let timeLeft = parseInt(workInput.value) * 60;

// 3. Ekranı Güncelleme
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 4. Mod Değiştirme ve Renk Ayarı
function switchMode() {
    isWorking = !isWorking;
    
    // Sayfa renklerini temizle ve yeni modu ekle
    document.body.classList.remove('work-mode', 'break-mode');

    if (isWorking) {
        timeLeft = parseInt(workInput.value) * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        document.body.classList.add('work-mode'); // Kırmızı tema
    } else {
        timeLeft = parseInt(breakInput.value) * 60;
        statusLabel.textContent = "Mola Zamanı";
        document.body.classList.add('break-mode'); // Yeşil tema
    }
    updateDisplay();
}

// 5. BAŞLAT BUTONU
startBtn.addEventListener('click', () => {
    if (timerId !== null) return; // Zaten çalışıyorsa bir daha başlatma
    
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

// 6. DURAKLAT BUTONU
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

// 7. SIFIRLA BUTONU
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    document.body.classList.remove('work-mode', 'break-mode');
    timeLeft = parseInt(workInput.value) * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// 8. HAZIR MOD BUTONLARI (Klasik, Focus, Exam)
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        workInput.value = btn.getAttribute('data-work');
        breakInput.value = btn.getAttribute('data-break');
        isWorking = true;
        document.body.classList.remove('work-mode', 'break-mode');
        timeLeft = parseInt(workInput.value) * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        updateDisplay();
    });
});

// 9. Kutucuk değişince saati güncelle
workInput.addEventListener('input', () => {
    if (isWorking && timerId === null) {
        timeLeft = parseInt(workInput.value) * 60;
        updateDisplay();
    }
});

// Başlangıç ayarı
updateDisplay();
