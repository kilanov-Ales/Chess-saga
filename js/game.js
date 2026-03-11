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
if (bgMusic) bgMusic.volume = 0.05; 

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic && bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    if (bgMusic) bgMusic.volume = val * 0.2; 
    document.querySelectorAll('.volume-slider').forEach(s => s.value = val);
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fileName = `${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;
    const voiceAudio = new Audio(audioPath);

    voiceAudio.onplay = () => { if(bgMusic) bgMusic.volume = 0.01; };

    const endSpeech = () => {
        if(bgMusic) bgMusic.volume = 0.05;
        isSpeaking = false; 
        renderBoard(); // Перерисовываем, чтобы появились кнопки хода
        finalizeTurnLogic();
    };

    voiceAudio.onended = endSpeech;
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = endSpeech;
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => {
        // Если аудиофайл не найден, используем синтез речи
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = endSpeech;
        window.speechSynthesis.speak(msg);
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

// ИСПРАВЛЕНО: добавлена проверка на наличие event
function selectScenario(key, event) {
    selectedScenarioKey = key;
    document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        const card = document.querySelector(`[onclick*="${key}"]`);
        if (card) card.classList.add('active');
    }
}

function startGame() {
    resumeAudio();
    const menuVol = document.getElementById('menu-vol');
    if (menuVol) menuVol.style.display = 'none';
    
    const sc = scenarios[selectedScenarioKey];
    currentStep = 0; 
    maxReachedStep = 0; 
    isSpeaking = false;

    document.getElementById('goals-list').innerHTML = sc.goals.map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = sc.egoals.map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    document.getElementById('chronicle-list').innerHTML = '';
    
    document.getElementById('main-menu').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('main-app').classList.add('app-visible');
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
            
            // Клетка подсвечивается только если сейчас ход игрока и никто не говорит
            if (!isSpeaking && next && next.turn === 'white' && coord === next.move.substring(2, 4)) {
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

function updateStats(data) {
    let displayMove = Math.floor((currentStep - 1) / 2) + 1;
    document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${data.turn === 'white' ? 'ЧЕРНЫЕ' : 'БЕЛЫЕ'}`;
}

function updateVisuals(data, createLog) {
    const stage = document.getElementById('visual-stage');
    if (stage) stage.innerHTML = `<img src="${visualizationPath}${data.icon}.png" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4080/4080933.png'">`;
    
    document.getElementById('scene-title').textContent = data.title;
    document.getElementById('scene-desc').textContent = data.text;

    if (createLog) {
        const log = document.createElement('div');
        log.className = `log-entry text-xs border-l-2 pl-3 py-2 mb-2 ${data.turn === 'black' ? 'border-slate-700 text-slate-400' : 'border-amber-500 text-slate-200 bg-amber-500/5'}`;
        log.innerHTML = `<span class="uppercase font-bold text-[9px] block mb-1">${data.turn === 'white' ? '⚪ Игрок' : '⚫ Соперник'}</span>${data.text}`;
        document.getElementById('chronicle-list').appendChild(log);
        const box = document.getElementById('narrative-box'); 
        if(box) box.scrollTop = box.scrollHeight;
    }
}
