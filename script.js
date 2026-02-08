// 1. DEĞİŞKENLER
const alarmSound = document.getElementById('alarm-sound');
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// Yeni Eklenen Fonksiyonel Değişkenler
let sessions = 0;
const sessionsDisplay = document.getElementById('sessions-completed');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let timerId = null;
let isWorking = true;
let timeLeft = parseInt(workInput.value) * 60;
let alertInterval = null;

// 2. GÖRÜNTÜ GÜNCELLEME
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (display) display.textContent = timeString;
    
    if (!alertInterval) {
        document.title = `(${timeString}) Pomodoro`;
    }
}

// 3. SEKME BİLDİRİMİ (YANIP SÖNME)
function startTabAlert() {
    if (alertInterval) return;
    let isAlertMsg = true;
    alertInterval = setInterval(() => {
        document.title = isAlertMsg ? "!!! SÜRE BİTTİ !!!" : "⏰ Pomodoro";
        isAlertMsg = !isAlertMsg;
    }, 600);
}

function stopTabAlert() {
    clearInterval(alertInterval);
    alertInterval = null;
    updateDisplay();
}

// 4. MOD DEĞİŞTİRME VE SEANS SAYACI
function switchMode() {
    isWorking = !isWorking;
    document.body.classList.remove('work-mode', 'break-mode');

    if (alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.play().catch(() => {});
    }

    // Seans Sayacı: Çalışma bittiğinde artır
    if (!isWorking) {
        sessions++;
        if (sessionsDisplay) sessionsDisplay.textContent = sessions;
    }

    startTabAlert();

    timeLeft = (isWorking ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
    statusLabel.textContent = isWorking ? "Odaklanma Zamanı" : "Mola Zamanı";
    document.body.classList.add(isWorking ? 'work-mode' : 'break-mode');
    updateDisplay();
}

// 5. EVENT LISTENERS (DİNLEYİCİLER)
startBtn.addEventListener('click', () => {
    if (timerId !== null) return;
    stopTabAlert();
    
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

pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    stopTabAlert();
    document.body.classList.remove('work-mode', 'break-mode');
    timeLeft = parseInt(workInput.value) * 60;
    statusLabel.textContent = "Odaklanma Zamanı";
    updateDisplay();
});

// To-Do List Ekleme
if (todoInput) {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== "") {
            const li = document.createElement('li');
            li.innerHTML = `${todoInput.value} <span style="cursor:pointer; color:red; margin-left:10px;" onclick="this.parentElement.remove()">✕</span>`;
            todoList.appendChild(li);
            todoInput.value = "";
        }
    });
}

// İlk açılışta süreyi göster
updateDisplay();
