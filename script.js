// 1. Elementleri Tanımlama (HTML'deki kutucuklara ve butonlara ulaşıyoruz)
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// 2. Değişkenler
let timerId = null;
let isWorking = true; // Başlangıçta "Çalışma" modundayız
let timeLeft = workInput.value * 60; // Başlangıç süresini kutucuktaki sayıdan al

// 3. Ekranı Güncelleme Fonksiyonu
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 4. Mod Değiştirme Fonksiyonu (Çalışma -> Mola veya Mola -> Çalışma)
function switchMode() {
    isWorking = !isWorking; // Modu tersine çevir
    
    if (isWorking) {
        timeLeft = workInput.value * 60; // Yeni süreyi inputtan çek
        statusLabel.textContent = "Odaklanma Zamanı";
        alert("Mola bitti, odaklanma zamanı!");
    } else {
        timeLeft = breakInput.value * 60; // Mola süresini inputtan çek
        statusLabel.textContent = "Mola Zamanı";
        alert("Çalışma bitti, mola vakti!");
    }
    updateDisplay();
}

// 5. Başlat Butonu
startBtn.addEventListener('click', () => {
    if (timerId !== null) return; // Zaten çalışıyorsa durdurma
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode(); // Süre bittiğinde diğer moda geç
        }
    }, 1000);
});

// 6. Duraklat Butonu
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

// 7. Sıfırla Butonu
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true; // Her zaman çalışma moduna geri dön
    timeLeft = workInput.value * 60; // Güncel input değerini al
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// Sayfa ilk açıldığında ekranı düzgün göster
updateDisplay();
