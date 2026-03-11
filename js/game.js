// js/game.js
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

async function requestFullscreenAndLandscape() {
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
        try { await root.requestFullscreen(); } catch (_) {}
    }

    if (screen.orientation && screen.orientation.lock) {
        try { await screen.orientation.lock('landscape'); } catch (_) {}
    }
}

function refreshOrientationOverlay() {
    const overlay = document.getElementById('orientation-lock');
    const appVisible = document.getElementById('main-app')?.classList.contains('app-visible');
    if (!overlay) return;

    const isMobileLike = window.matchMedia('(max-width: 900px)').matches;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    overlay.classList.toggle('visible', Boolean(appVisible) && isMobileLike && isPortrait);
}

function forceImmersiveMode(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    resumeAudio();
    requestFullscreenAndLandscape();
}

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    bgMusic.volume = val * 0.2;
    document.querySelectorAll('.volume-slider').forEach(s => s.value = val);
}

// --- СИСТЕМА ОЗВУЧКИ ---
function speak(text, turn, stepAtMoment) {
    isSpeaking = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fileName = `${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    const originalBgVolume = bgMusic.volume;

    voiceAudio.onplay = () => {
        bgMusic.volume = Math.min(originalBgVolume, 0.02);
    };

    voiceAudio.onended = () => {
        bgMusic.volume = originalBgVolume;
        isSpeaking = false;
        finalizeTurnLogic();
    };

    voiceAudio.onerror = () => {
        bgMusic.volume = originalBgVolume;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = () => {
            isSpeaking = false;
            finalizeTurnLogic();
        };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => {
        isSpeaking = false;
        finalizeTurnLogic();
    });
}

function finalizeTurnLogic() {
    const sc = scenarios[selectedScenarioKey];
    if (currentStep < sc.story.length && sc.story[currentStep].turn === 'black' && currentStep === maxReachedStep) {
        setTimeout(processMove, 600);
    }
}

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
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

function startGame() {
    forceImmersiveMode();
    const menuVol = document.getElementById('menu-vol');
    if (menuVol) menuVol.style.display = 'none';
    
    const sc = scenarios[selectedScenarioKey];
    currentStep = 0;
    maxReachedStep = 0;
    isSpeaking = false;

    const goalsHeader = document.querySelector('.right-panel h3.text-sky-400');
    const egoalsHeader = document.querySelector('.right-panel h3.text-red-500');
    if (goalsHeader) goalsHeader.textContent = "ПЛАНЫ КОМПАНИИ";
    if (egoalsHeader) egoalsHeader.textContent = "ЗАДУМЫ СОПЕРНИКА";

    document.getElementById('goals-list').innerHTML = sc.goals.map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = sc.egoals.map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    
    document.getElementById('chronicle-list').innerHTML = '';
    document.getElementById('move-counter').textContent = `ХОД: 1`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;

    document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}🏰.png" style="width: 80px; height: 80px;">`;
    document.getElementById('scene-title').textContent = "Ваша история начинается";
    document.getElementById('scene-desc').textContent = "Сделайте первый ход, чтобы запустить летопись.";

    document.getElementById('main-menu').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('main-app').classList.add('app-visible');
        refreshOrientationOverlay();
        initBoard();
        renderBoard();
    }, 800);
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
            
            if (boardState[r] && boardState[r][c]) {
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
    if (currentStep >= sc.story.length) return;
    
    const data = sc.story[currentStep];
    const moveClean = data.move.replace(/[!+#]/g, '');
    const from = [8 - parseInt(moveClean[1]), moveClean.charCodeAt(0) - 97];
    const to = [8 - parseInt(moveClean[3]), moveClean.charCodeAt(2) - 97];
    
    boardState[to[0]][to[1]] = boardState[from[0]][from[1]];
    boardState[from[0]][from[1]] = '';
    historyStates.push(JSON.parse(JSON.stringify(boardState)));

    updateVisuals(data, true);

    const stepForAudio = currentStep;
    currentStep++;
    maxReachedStep = currentStep;
    
    renderBoard();
    updateStats(data);
    speak(data.text, data.turn, stepForAudio);
}

function jumpToStep(stepIndex) {
    if (isSpeaking) return;
    const sc = scenarios[selectedScenarioKey];
    
    if (stepIndex < 0 || stepIndex > maxReachedStep) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    currentStep = stepIndex;
    boardState = JSON.parse(JSON.stringify(historyStates[currentStep]));

    if (currentStep > 0) {
        const data = sc.story[currentStep - 1];
        updateVisuals(data, false);
        
        let displayMove = Math.floor((currentStep - 1) / 2) + 1;
        document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${currentStep % 2 === 0 ? 'БЕЛЫЕ' : 'ЧЕРНЫЕ'}`;
    } else {
        document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}🏰.png" style="width: 80px; height: 80px;">`;
        document.getElementById('scene-title').textContent = "Ваша история начинается";
        document.getElementById('scene-desc').textContent = "Сделайте первый ход...";
        document.getElementById('move-counter').textContent = `ХОД: 1`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;
    }
    
    renderBoard();

    if (currentStep === maxReachedStep && sc.story[currentStep] && sc.story[currentStep].turn === 'black') {
        finalizeTurnLogic();
    }
}

function updateStats(data) {
    let displayMove = Math.floor((currentStep - 1) / 2) + 1;
    document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${data.turn === 'white' ? 'ЧЕРНЫЕ' : 'БЕЛЫЕ'}`;
}

function updateVisuals(data, createLog) {
    if (data.capture) {
        const flash = document.getElementById('flash');
        if (flash) {
            flash.classList.add('flash-active');
            setTimeout(() => flash.classList.remove('flash-active'), 400);
        }
        const boardOuter = document.querySelector('.chess-board-outer');
        if (boardOuter) {
            boardOuter.classList.add('shake-anim');
            setTimeout(() => boardOuter.classList.remove('shake-anim'), 300);
        }
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
        const box = document.getElementById('narrative-box');
        box.scrollTop = box.scrollHeight;
    }

    if (data.goal !== undefined) {
        const g = document.getElementById(`g${data.goal}`);
        if(g) {
            g.className = "text-green-500 font-bold transition-all";
            g.innerHTML = `<img src="${visualizationPath}g✔️.png" class="inline-block w-4 h-4 mr-1"> ` + g.innerText.replace('• ', '').replace('✔ ', '');
            g.style.textDecoration = "line-through";
        }
    }
    if (data.egoal !== undefined) {
        const eg = document.getElementById(`eg${data.egoal}`);
        if(eg) {
            eg.className = "text-red-500 font-bold transition-all";
            eg.innerHTML = `<img src="${visualizationPath}r✔️.png" class="inline-block w-4 h-4 mr-1"> ` + eg.innerText.replace('• ', '').replace('✔ ', '');
            eg.style.textDecoration = "line-through";
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('main-app').classList.contains('app-visible')) {
        if (e.key === "ArrowLeft") jumpToStep(currentStep - 1);
        if (e.key === "ArrowRight") jumpToStep(currentStep + 1);
    }
});

window.addEventListener('resize', refreshOrientationOverlay);
window.addEventListener('orientationchange', refreshOrientationOverlay);

document.addEventListener('click', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp && mainApp.classList.contains('app-visible')) requestFullscreenAndLandscape();
}, { passive: true });
