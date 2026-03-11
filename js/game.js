const visualizationPath = "Visualization/";
const figuresPath = "Figures/";
const audioFolderPath = "audio/"; 

let selectedScenarioKey = 'argus';
let currentStep = 0;
let maxReachedStep = 0; 
let boardState = [];
let historyStates = []; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
bgMusic.volume = 0.05; 

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    bgMusic.volume = val * 0.2; 
    document.querySelectorAll('.volume-slider').forEach(s => s.value = val);
}

// --- НОВАЯ СИСТЕМА МАСШТАБИРОВАНИЯ ---
function adaptLayout() {
    const app = document.getElementById('main-app');
    if (!app.classList.contains('app-visible')) return;

    const targetWidth = 1200;
    const targetHeight = 700;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Считаем коэффициент, чтобы вписать игру в экран
    const scale = Math.min(windowWidth / targetWidth, windowHeight / targetHeight);
    app.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', adaptLayout);

// --- ЗАПУСК ИГРЫ (FULLSCREEN + LANDSCAPE) ---
async function startGame() {
    resumeAudio();
    const mainApp = document.getElementById('main-app');
    const mainMenu = document.getElementById('main-menu');
    const doc = document.documentElement;

    // 1. Попытка входа в полноэкранный режим
    try {
        if (doc.requestFullscreen) {
            await doc.requestFullscreen();
        } else if (doc.webkitRequestFullscreen) {
            await doc.webkitRequestFullscreen();
        }
    } catch (err) {
        console.warn("Fullscreen denied");
    }

    // 2. Блокировка ориентации (только в Fullscreen)
    if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {
            console.log("Orientation lock requires manual rotation on some devices");
        });
    }

    // 3. Настройка интерфейса
    document.getElementById('menu-vol').style.display = 'none';
    mainMenu.style.display = 'none';
    mainApp.classList.add('app-visible');
    
    // Применяем масштаб сразу после показа
    setTimeout(adaptLayout, 100);

    const sc = scenarios[selectedScenarioKey];
    currentStep = 0; maxReachedStep = 0; isSpeaking = false;

    // Очистка данных
    document.getElementById('goals-list').innerHTML = sc.goals.map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = sc.egoals.map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    document.getElementById('chronicle-list').innerHTML = '';
    
    updateVisuals({icon: '🏰', title: 'Затишье', text: 'Армии ждут...'}, false);

    initBoard();
    renderBoard();
}

// --- ОСТАЛЬНАЯ ЛОГИКА БЕЗ ИЗМЕНЕНИЙ ---

function initBoard() {
    boardState = [
        ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook'],
        ['b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn'],
        ['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],
        ['w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn'],
        ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']
    ];
    historyStates = [JSON.parse(JSON.stringify(boardState))];
}

function selectScenario(key) {
    selectedScenarioKey = key;
    document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
    if (event.currentTarget) event.currentTarget.classList.add('active');
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    const sc = scenarios[selectedScenarioKey];
    const next = sc.story[currentStep];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = `${String.fromCharCode(97 + c)}${8 - r}`;
            
            if (!isSpeaking && currentStep === maxReachedStep && next && next.turn === 'white' && coord === next.move.substring(2, 4)) {
                sq.classList.add('active-target'); 
                sq.onclick = processMove;
            }
            
            if (boardState[r][c]) {
                const img = document.createElement('img');
                img.src = `${figuresPath}${boardState[r][c]}.png`;
                img.className = 'piece-img'; 
                sq.appendChild(img);
            }
            boardEl.appendChild(sq);
        }
    }
}

function processMove() {
    if (isSpeaking) return;
    const sc = scenarios[selectedScenarioKey];
    const data = sc.story[currentStep];
    const moveClean = data.move.replace(/[!+#]/g, '');
    const from = [8 - parseInt(moveClean[1]), moveClean.charCodeAt(0) - 97];
    const to = [8 - parseInt(moveClean[3]), moveClean.charCodeAt(2) - 97];
    
    boardState[to[0]][to[1]] = boardState[from[0]][from[1]];
    boardState[from[0]][from[1]] = '';
    historyStates.push(JSON.parse(JSON.stringify(boardState)));

    updateVisuals(data, true); 
    const stepForAudio = currentStep;
    currentStep++; maxReachedStep = currentStep; 
    
    renderBoard();
    updateStats(data);
    speak(data.text, data.turn, stepForAudio);
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const fileName = `${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const voiceAudio = new Audio(`${audioFolderPath}${fileName}`);
    const originalBgVolume = bgMusic.volume;

    voiceAudio.onplay = () => { bgMusic.volume = Math.min(originalBgVolume, 0.02); };
    voiceAudio.onended = () => { bgMusic.volume = originalBgVolume; isSpeaking = false; finalizeTurnLogic(); };
    voiceAudio.onerror = () => {
        bgMusic.volume = originalBgVolume;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = () => { isSpeaking = false; finalizeTurnLogic(); };
        window.speechSynthesis.speak(msg);
    };
    voiceAudio.play().catch(() => { isSpeaking = false; finalizeTurnLogic(); });
}

function finalizeTurnLogic() {
    const sc = scenarios[selectedScenarioKey];
    if (currentStep < sc.story.length && sc.story[currentStep].turn === 'black' && currentStep === maxReachedStep) {
        setTimeout(processMove, 600); 
    }
}

function updateStats(data) {
    let displayMove = Math.floor((currentStep - 1) / 2) + 1;
    document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${data.turn === 'white' ? 'ЧЕРНЫЕ' : 'БЕЛЫЕ'}`;
}

function updateVisuals(data, createLog) {
    if (data.capture) {
        document.getElementById('flash').classList.add('flash-active');
        setTimeout(() => document.getElementById('flash').classList.remove('flash-active'), 400);
    }
    
    document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}${data.icon}.png">`;
    document.getElementById('scene-title').textContent = data.title;
    document.getElementById('scene-desc').textContent = data.text;

    if (createLog) {
        const logIndex = currentStep;
        const log = document.createElement('div');
        log.className = `log-entry text-xs border-l-2 pl-3 py-2 cursor-pointer transition-colors hover:bg-white/5 ${data.turn === 'black' ? 'border-slate-700 text-slate-400' : 'border-amber-500 text-slate-200 bg-amber-500/5'}`;
        log.onclick = () => jumpToStep(logIndex + 1);
        log.innerHTML = `<span class="uppercase font-bold text-[9px] block mb-1">${data.turn === 'white' ? '⚪ Игрок' : '⚫ Соперник'}</span>${data.text}`;
        document.getElementById('chronicle-list').appendChild(log);
        const box = document.getElementById('narrative-box'); box.scrollTop = box.scrollHeight;
    }

    if (data.goal !== undefined) {
        const g = document.getElementById(`g${data.goal}`);
        if(g) { g.className = "text-green-500 font-bold line-through"; g.innerHTML = `✔ ` + g.innerText.replace('• ', ''); }
    }
    if (data.egoal !== undefined) {
        const eg = document.getElementById(`eg${data.egoal}`);
        if(eg) { eg.className = "text-red-500 font-bold line-through"; eg.innerHTML = `✔ ` + eg.innerText.replace('• ', ''); }
    }
}

function jumpToStep(stepIndex) {
    if (isSpeaking) return;
    const sc = scenarios[selectedScenarioKey];
    if (stepIndex < 0 || stepIndex > maxReachedStep) return;
    currentStep = stepIndex;
    boardState = JSON.parse(JSON.stringify(historyStates[currentStep]));
    renderBoard();
}

function exitToMenu() {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    location.reload(); 
}
