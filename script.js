const alarmSound = document.getElementById('alarm-sound');
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

let timerId = null;
let isWorking = true;
let timeLeft = parseInt(workInput.value) * 60;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// SÜRE DEĞİŞTİRME - Hem mobil hem masaüstünde anında güncellenmesi için:
const handleInputChange = () => {
    if (timerId === null) { // Sadece sayaç dururken kutudaki sayıya göre ekran değişsin
        if (isWorking) {
            timeLeft = (parseInt(workInput.value) || 0) * 60;
        } else {
            timeLeft = (parseInt(breakInput.value) || 0) * 60;
        }
        updateDisplay();
    }
};

// Hem yazarken hem kutudan çıkınca çalışması için iki event:
workInput.addEventListener('input', handleInputChange);
workInput.addEventListener('change', handleInputChange);
breakInput.addEventListener('input', handleInputChange);
breakInput.addEventListener('change', handleInputChange);

function switchMode() {
    isWorking = !isWorking;
    document.body.classList.remove('work-mode', 'break-mode');

    if (alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.play().catch(() => console.log("Ses için ekrana dokunmalısın!"));
    }
    
    if (isWorking) {
        timeLeft = parseInt(workInput.value) * 60;
        statusLabel.textContent = "Odaklanma Zamanı";
        document.body.classList.add('work-mode');
    } else {
        timeLeft = parseInt(breakInput.value) * 60;
        statusLabel.textContent = "Mola Zamanı";
        document.body.classList.add('break-mode');
    }
    updateDisplay();
}

// BAŞLAT
startBtn.addEventListener('click', () => {
    if (timerId !== null) return;
    
    // Mobilde klavyeyi kapatmak için (ekranın kaymasını önler)
    workInput.blur();
    breakInput.blur();

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
    document.body.classList.remove('work-mode', 'break-mode');
    timeLeft = parseInt(workInput.value) * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// MOD BUTONLARI
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

updateDisplay();
