// 1. Değişkenleri Tanımlama
let timeLeft = 25 * 60; // Toplam saniye (25 dakika)
let timerId = null;

// HTML elemanlarına ulaşalım
const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// 2. Ekranı Güncelleyen Fonksiyon
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    
    // Saniye tek haneliyse başına 0 ekle (Örn: 05)
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 3. Başlat Butonu Fonksiyonu
startBtn.addEventListener('click', () => {
    // Eğer zamanlayıcı zaten çalışıyorsa tekrar başlatma
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--; // Her saniye 1 azalt
        updateDisplay(); // Yeni süreyi ekrana yaz
        
        // Süre bittiğinde durdur
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert("Süre doldu! Mola vakti.");
        }
    }, 1000); // 1000 milisaniye = 1 saniye
});

// 4. Duraklat Butonu Fonksiyonu
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

// 5. Sıfırla Butonu Fonksiyonu
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60; // Süreyi başa sar
    updateDisplay();
});
