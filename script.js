// 1. DEĞİŞKENLER VE ELEMENTLER
const alarmSound = document.getElementById('alarm-sound');
const display = document.getElementById('timer-display');
const statusLabel = document.getElementById('status-label');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// Fonksiyonel Özellik Değişkenleri
let sessions = 0;
const sessionsDisplay = document.getElementById('sessions-completed');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let timerId = null;
let isWorking = true;
let timeLeft = parseInt(workInput.value) * 60;
let alertInterval = null;

// 2. GÖRÜNTÜLEME FONKSİYONU
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
function switchMode(manualMode = null) {
    // Eğer butonla tıklandıysa o modu seç, yoksa otomatik değiştir
    if (manualMode !== null) {
        isWorking = manualMode;
    } else {
        isWorking = !isWorking;
    }

    // Renkleri değiştirirken Karanlık Modu korumak için sadece mod sınıflarını yönetiyoruz
    document.body.classList.remove('work-mode', 'break-mode');

    if (alarmSound && manualMode === null) { // Sadece otomatik geçişte ses çal
        alarmSound.currentTime = 0;
        alarmSound.play().catch(() => {});
        startTabAlert();
    }

    if (manualMode === null && !isWorking) {
        sessions++;
        if (sessionsDisplay) sessionsDisplay.textContent = sessions;
    }

    timeLeft = (isWorking ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
    statusLabel.textContent = isWorking ? "Odaklanma Zamanı" : "Mola Zamanı";
    document.body.classList.add(isWorking ? 'work-mode' : 'break-mode');
    updateDisplay();
}

// 5. MOD BUTONLARI DİNLEYİCİSİ (EKSİK OLAN KISIM BURASIYDI)
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        const modeText = btn.textContent.toLowerCase();
        if (modeText.includes('focus')) {
            switchMode(true);
        } else {
            switchMode(false);
        }
    });
});

// 6. ANLIK SÜRE GÜNCELLEME
function handleInputChange() {
    if (timerId === null) {
        timeLeft = (isWorking ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
        updateDisplay();
    }
}

workInput.addEventListener('input', handleInputChange);
breakInput.addEventListener('input', handleInputChange);

// 7. ANA KONTROLLER
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
    switchMode(true);
});

// 8. TODO VE KARANLIK MOD
if (todoInput) {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== "") {
            const li = document.createElement('li');
            li.innerHTML = `${todoInput.value} <span style="cursor:pointer; color:red; font-weight:bold; margin-left:10px;" onclick="this.parentElement.remove()">✕</span>`;
            todoList.appendChild(li);
            todoInput.value = "";
        }
    });
}

const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-theme');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// İlk çalışma
updateDisplay();
