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

function resumeAudio() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    bgMusic.volume = val * 0.2; 
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const voiceAudio = new Audio(`${audioFolderPath}${selectedScenarioKey}_${stepAtMoment}.mp3`);
    voiceAudio.onended = () => { isSpeaking = false; finalizeTurn(); };
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = () => { isSpeaking = false; finalizeTurn(); };
        window.speechSynthesis.speak(msg);
    };
    voiceAudio.play().catch(() => { isSpeaking = false; finalizeTurn(); });
}

function finalizeTurn() {
    const sc = scenarios[selectedScenarioKey];
    if (currentStep < sc.story.length && sc.story[currentStep].turn === 'black' && currentStep === maxReachedStep) {
        setTimeout(processMove, 1000);
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
    event.currentTarget.classList.add('active');
}

function startGame() {
    const sc = scenarios[selectedScenarioKey];
    document.getElementById('goals-list').innerHTML = sc.goals.map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = sc.egoals.map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('main-app').classList.add('app-visible');
    initBoard();
    renderBoard();
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    const next = scenarios[selectedScenarioKey].story[currentStep];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = `${String.fromCharCode(97 + c)}${8 - r}`;
            
            if (!isSpeaking && currentStep === maxReachedStep && next && next.turn === 'white' && coord === next.move.substring(2, 4)) {
                sq.style.boxShadow = "inset 0 0 15px #f59e0b";
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
    const sc = scenarios[selectedScenarioKey];
    const data = sc.story[currentStep];
    const move = data.move;
    const from = [8 - parseInt(move[1]), move.charCodeAt(0) - 97];
    const to = [8 - parseInt(move[3]), move.charCodeAt(2) - 97];
    
    boardState[to[0]][to[1]] = boardState[from[0]][from[1]];
    boardState[from[0]][from[1]] = '';
    historyStates.push(JSON.parse(JSON.stringify(boardState)));

    updateVisuals(data);
    const stepIdx = currentStep;
    currentStep++; maxReachedStep = currentStep;
    renderBoard();
    speak(data.text, data.turn, stepIdx);
}

function updateVisuals(data) {
    if (data.capture) {
        document.getElementById('flash').classList.add('flash-active');
        setTimeout(() => document.getElementById('flash').classList.remove('flash-active'), 400);
    }
    document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}${data.icon}.png">`;
    document.getElementById('scene-title').textContent = data.title;
    document.getElementById('scene-desc').textContent = data.text;
    
    const log = document.createElement('div');
    log.className = "text-[11px] p-2 bg-slate-800 rounded";
    log.textContent = data.text;
    document.getElementById('chronicle-list').appendChild(log);
}

function exitToMenu() { location.reload(); }
