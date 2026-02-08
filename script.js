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

// --- LOCALSTORAGE BAŞLANGIÇ DEĞERLERİ ---
let sessions = parseInt(localStorage.getItem('sessions')) || 0;
const sessionsDisplay = document.getElementById('sessions-completed');
if (sessionsDisplay) sessionsDisplay.textContent = sessions;

// Kayıtlı süreleri çek, yoksa varsayılan (25/5) yap
workInput.value = localStorage.getItem('workTime') || 25;
breakInput.value = localStorage.getItem('breakTime') || 5;

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
    if (!alertInterval) document.title = `(${timeString}) Pomodoro`;
}

// 3. SEKME BİLDİRİMİ
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

// 4. MOD DEĞİŞTİRME VE SEANS KAYDI
function switchMode(manualMode = null) {
    if (manualMode !== null) isWorking = manualMode;
    else isWorking = !isWorking;

    document.body.classList.remove('work-mode', 'break-mode');

    if (manualMode === null) {
        if (alarmSound) { alarmSound.currentTime = 0; alarmSound.play().catch(() => {}); }
        startTabAlert();
        
        // Çalışma bittiyse seansı artır ve KAYDET
        if (!isWorking) {
            sessions++;
            localStorage.setItem('sessions', sessions);
            if (sessionsDisplay) sessionsDisplay.textContent = sessions;
        }
    }

    timeLeft = (isWorking ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
    statusLabel.textContent = isWorking ? "Odaklanma Zamanı" : "Mola Zamanı";
    document.body.classList.add(isWorking ? 'work-mode' : 'break-mode');
    updateDisplay();
}

// 5.  ÖZEL BUTONLAR (Klasik, Focus, Exam)
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        stopTabAlert();
        
        const modeText = btn.textContent.trim().toLowerCase();
        
        // Görseldeki isimlere göre süre atamaları
        document.body.classList.remove('work-mode', 'break-mode');
        
        if (modeText === 'klasik') {
            workInput.value = 25;
            isWorking = true;
            statusLabel.textContent = "Klasik Mod";
            document.body.classList.add('work-mode');
        } else if (modeText === 'focus') {
            workInput.value = 50; 
            isWorking = true;
            statusLabel.textContent = "Derin Odaklanma";
            document.body.classList.add('work-mode');
        } else if (modeText === 'exam') {
            workInput.value = 75; 
            isWorking = true;
            statusLabel.textContent = "Sınav Modu!";
            document.body.classList.add('work-mode');
        }

        // Seçilen süreyi kaydet ve uygula
        localStorage.setItem('workTime', workInput.value);
        timeLeft = parseInt(workInput.value) * 60;
        
        document.body.classList.remove('work-mode', 'break-mode');
        document.body.classList.add(isWorking ? 'work-mode' : 'break-mode');
        updateDisplay();
    });
});

// 6. ANLIK SÜRE GÜNCELLEME VE KAYIT
function handleInputChange() {
    if (timerId === null) {
        timeLeft = (isWorking ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
        updateDisplay();
        // Süreleri hafızaya kaydet
        localStorage.setItem('workTime', workInput.value);
        localStorage.setItem('breakTime', breakInput.value);
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
    if(confirm("Tüm veriler (seanslar dahil) sıfırlansın mı?")) {
        clearInterval(timerId);
        timerId = null;
        sessions = 0;
        localStorage.setItem('sessions', 0);
        if (sessionsDisplay) sessionsDisplay.textContent = 0;
        isWorking = true;
        stopTabAlert();
        switchMode(true);
    }
});

// 8. TODO LİSTESİ KAYIT SİSTEMİ
function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        todos.push(li.innerText.replace('✕', '').trim());
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    savedTodos.forEach(text => addTodoToDOM(text));
}

function addTodoToDOM(text) {
    const li = document.createElement('li');
    li.innerHTML = `${text} <span style="cursor:pointer; color:red; font-weight:bold; margin-left:10px;" onclick="this.parentElement.remove(); saveTodos();">✕</span>`;
    todoList.appendChild(li);
}

if (todoInput) {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== "") {
            addTodoToDOM(todoInput.value);
            saveTodos();
            todoInput.value = "";
        }
    });
}

// 9. KARANLIK MOD (Hafıza zaten içindeydi)
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

// Başlangıç Yüklemesi
loadTodos();
updateDisplay();
