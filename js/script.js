// Генерация или получение секретного ID пользователя (чтобы защитить удаление)
let myAuthorId = localStorage.getItem('chess_saga_author_id');
if (!myAuthorId) {
    myAuthorId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chess_saga_author_id', myAuthorId);
}

const API_URL = 'https://chess-api.kilanov.workers.dev/';

function showNotification(text, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    document.getElementById('toast-text').textContent = text;
    toast.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-bold text-sm tracking-widest z-[9999] transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] translate-y-0 opacity-100';

    if (type === 'success') { toast.classList.add('bg-amber-500', 'text-slate-900'); icon.textContent = '✨'; } 
    else if (type === 'error') { toast.classList.add('bg-red-600', 'text-white'); icon.textContent = '‼️'; } 
    else { toast.classList.add('bg-sky-600', 'text-white'); icon.textContent = '🕊️'; }

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-10', 'opacity-0');
    }, 3500);
}

window.AntiMate = { 
    check: (text) => { 
        if (!text) return false;
        const badWords = ['бля', 'хуй', 'сука', 'пизд', 'ебан', 'ебат', 'шлюх', 'мудак', 'гандон', 'хер', 'пидор']; 
        const lowerText = text.toLowerCase();
        return badWords.some(w => lowerText.includes(w)); 
    }
};

function openCommunityModal() {
    document.getElementById('community-modal').classList.remove('hidden');
    renderGallery();
}
function closeCommunityModal() {
    document.getElementById('community-modal').classList.add('hidden');
}

async function renderGallery() {
    const gallery = document.getElementById('community-gallery');
    gallery.innerHTML = '<p class="col-span-full text-center text-amber-500 italic animate-pulse">Ищем свитки в облачных архивах...</p>';
    
    let localParties = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    let dbParties = [];

    try {
        const response = await fetch(API_URL, { mode: 'cors' });
        if (response.ok) {
            const data = await response.json();
            let rows = Array.isArray(data) ? data : (data.data || data.result || []);
            dbParties = rows.map(row => {
                let pd = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || row);
                pd.db_id = row.id || pd.id; 
                return pd;
            });
        }
    } catch (e) { console.log("Ошибка загрузки с облака, используем локальные:", e); }

    let allParties = [...dbParties];
    localParties.forEach(lp => {
        if (!allParties.some(p => p.title === lp.title)) {
            allParties.push(lp);
        }
    });

    if (allParties.length === 0) {
        gallery.innerHTML = '<p class="col-span-full text-center text-slate-600 italic">Здесь пока пусто... Создайте первую историю в Кузнице!</p>';
        return;
    }

    gallery.innerHTML = allParties.map((p, index) => {
        if(!p || !p.story) return '';
        scenarios['custom_' + index] = p; 
        
        const canDelete = p.author_id === myAuthorId;

        return `
        <div class="scenario-card border-purple-900 bg-slate-900/80 p-4 rounded-xl flex flex-col justify-between hover:scale-105 transition-transform h-full relative">
            <div class="mb-4 pr-6">
                <h3 class="text-purple-400 font-bold truncate text-lg" title="${p.title}">${p.title}</h3>
                <p class="text-[10px] text-slate-400 mt-1 uppercase">Ходов: ${p.story.length}</p>
            </div>
            
            ${canDelete ? `<button onclick="deleteFromGallery(${index})" class="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors" title="Удалить партию">🗑️</button>` : ''}

            <div class="flex gap-2">
                <button onclick="playCustomScenario(${index})" class="flex-1 bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-xs font-bold uppercase transition-colors text-white flex items-center justify-center gap-1">
                    <img src="${visualizationPath}👁️.png" class="w-4 h-4" onerror="this.style.display='none'"> Смотреть
                </button>
                <button onclick="downloadFromGallery(${index})" class="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition-colors text-white" title="Скачать">💾</button>
            </div>
        </div>`;
    }).join('');
}

async function deleteFromGallery(index) {
    const p = scenarios['custom_' + index];
    if(!confirm(`Вы точно хотите удалить партию "${p.title}" из Свитков?`)) return;

    let customParties = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    customParties = customParties.filter(cp => cp.title !== p.title);
    localStorage.setItem('chess_saga_custom', JSON.stringify(customParties));

    if (p.db_id) {
        showNotification("Сжигаем свиток в архиве...", "info");
        try {
            const endpoint = API_URL.endsWith('/') ? `${API_URL}${p.db_id}` : `${API_URL}/${p.db_id}`;
            const response = await fetch(endpoint, { method: 'DELETE', mode: 'cors' });
            if (response.ok) showNotification("Партия успешно удалена из всех баз!", "success");
            else showNotification("Ошибка удаления на сервере", "error");
        } catch (error) { showNotification("Ошибка сети при удалении", "error"); }
    } else {
        showNotification("Локальная партия удалена!", "success");
    }
    renderGallery();
}

function playCustomScenario(index) {
    selectedScenarioKey = 'custom_' + index;
    closeCommunityModal();
    startGame();
}

function downloadFromGallery(index) {
    const p = scenarios['custom_' + index];
    if(!p) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", p.title + ".json");
    document.body.appendChild(dl); dl.click(); dl.remove();
}

const visualizationPath = "Visualization/";
const figuresPath = "Figures/";

let selectedScenarioKey = 'argus';
let currentStep = 0;
let maxReachedStep = 0; 
let boardState = [];
let historyStates = []; 

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
    if (event) event.currentTarget.classList.add('active');
}

function startGame() {
    resumeAudio();
    document.getElementById('menu-vol').style.display = 'none';
    const sc = scenarios[selectedScenarioKey];
    
    currentStep = 0; maxReachedStep = 0; isSpeaking = false;

    const goalsHeader = document.querySelector('.right-panel h3.text-sky-400');
    const egoalsHeader = document.querySelector('.right-panel h3.text-red-500');
    if (goalsHeader) goalsHeader.textContent = "ПЛАНЫ КОМПАНИИ";
    if (egoalsHeader) egoalsHeader.textContent = "ЗАДУМЫ СОПЕРНИКА";

    document.getElementById('goals-list').innerHTML = (sc.goals || []).map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = (sc.egoals || []).map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    
    document.getElementById('chronicle-list').innerHTML = '';
    document.getElementById('move-counter').textContent = `ХОД: 1`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;

    document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}🏰.png" style="width: 80px; height: 80px;" onerror="this.style.display='none'">`;
    document.getElementById('scene-title').textContent = sc.title || "Ваша история начинается";
    document.getElementById('scene-desc').textContent = "Сделайте первый ход, чтобы запустить летопись.";

    document.getElementById('main-menu').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('main-app').classList.add('app-visible');
        initBoard(); renderBoard();
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
                img.onerror = function() { this.style.display='none'; };
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
    currentStep++; maxReachedStep = currentStep; 
    
    renderBoard(); updateStats(data); speak(data.text, data.turn, stepForAudio);
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
        document.getElementById('visual-stage').innerHTML = `<img src="${visualizationPath}🏰.png" style="width: 80px; height: 80px;" onerror="this.style.display='none'">`;
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
        document.getElementById('flash').classList.add('flash-active');
        setTimeout(() => document.getElementById('flash').classList.remove('flash-active'), 400);
        document.querySelector('.chess-board-outer').classList.add('shake-anim');
        setTimeout(() => document.querySelector('.chess-board-outer').classList.remove('shake-anim'), 300);
    }
    
    const stage = document.getElementById('visual-stage');
    if (data.icon && !data.icon.includes('.png') && [...data.icon].length <= 2) {
        stage.innerHTML = `<span style="font-size: 4rem;">${data.icon}</span>`;
    } else {
        let iconSrc = data.icon.includes('.png') ? data.icon : `${data.icon}.png`;
        stage.innerHTML = `<img src="${visualizationPath}${iconSrc}" onerror="this.style.display='none'">`;
    }

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
        if(g) { 
            g.className = "text-green-500 font-bold transition-all"; 
            g.innerHTML = `<img src="${visualizationPath}g✔️.png" class="inline-block w-4 h-4 mr-1" onerror="this.style.display='none'"> ` + g.innerText.replace('• ', '').replace('✔ ', '');
            g.style.textDecoration = "line-through";
        }
    }
    if (data.egoal !== undefined) {
        const eg = document.getElementById(`eg${data.egoal}`);
        if(eg) { 
            eg.className = "text-red-500 font-bold transition-all"; 
            eg.innerHTML = `<img src="${visualizationPath}r✔️.png" class="inline-block w-4 h-4 mr-1" onerror="this.style.display='none'"> ` + eg.innerText.replace('• ', '').replace('✔ ', '');
            eg.style.textDecoration = "line-through";
        }
    }
}

function exitToMenu() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    location.reload(); 
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('main-app').classList.contains('app-visible')) {
        if (e.key === "ArrowLeft") jumpToStep(currentStep - 1);
        if (e.key === "ArrowRight") jumpToStep(currentStep + 1);
    }
});

let editorEngine = new Chess();
let editorSteps = [];
let selectedSquare = null;
let validMovesForSelected = [];
let selectedEditorStepIndex = null;

// Обновленный массив иконок: "!!", "!", "?", затем старые, затем шахматные символы
const availableIcons = [
    "!!", "!", "?",
    "✨","🚩","🌑","🏰","⚔️","🔥","👑","💀","🛡️","🐐","👁️","⛓️","🤺","🌀",
    "☀️","⚡","🔱","😰","🪓","🐎","🐢","☁️","🔨","🩸","🕊️","🦅","👺","🏃",
    "🔆","🌫️","🏆","⛪","⚠️","🍴","💥","👸","💎","😵","😈","💔",
    "🗿","🧐","👽","🎀","👓","👟","🎓","🥇","🧩","♥️","🥁","⛏️","🔧",
    "🪨","🪵","⚙️","🪚","💣","🔫","🔪","🔍","💡","🕯","💰","💸","✏️","✒️",
    "⏱️","✂️","⌛","🌍","🏳️","💘","☣️",
    "♔","♕","♖","♗","♘","♙","♚","♛","♜","♝","♞","♟"
];

const ICONS_PER_PAGE = 21; 
let currentIconPage = 0;

function initIcons() {
    const container = document.getElementById('icon-selector');
    const pagination = document.getElementById('icon-pagination');
    
    const start = currentIconPage * ICONS_PER_PAGE;
    const end = start + ICONS_PER_PAGE;
    const pageIcons = availableIcons.slice(start, end);

    container.innerHTML = pageIcons.map(icon => 
        `<button onclick="setEditIcon('${icon}')" class="p-1 bg-slate-800 rounded hover:bg-slate-700 text-base transition-transform hover:scale-110 cursor-pointer shadow-md flex items-center justify-center">${icon}</button>`
    ).join('');

    let paginationHtml = '';
    if (currentIconPage > 0) {
        paginationHtml += `<button onclick="changeIconPage(-1)" class="flex-1 p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition-colors shadow">⬆️ Вверх</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-1 bg-slate-800 rounded text-xs text-slate-600 shadow opacity-50 cursor-not-allowed">⬆️ Вверх</button>`;
    }
    if (end < availableIcons.length) {
        paginationHtml += `<button onclick="changeIconPage(1)" class="flex-1 p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition-colors shadow">⬇️ Вниз</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-1 bg-slate-800 rounded text-xs text-slate-600 shadow opacity-50 cursor-not-allowed">⬇️ Вниз</button>`;
    }
    pagination.innerHTML = paginationHtml;
}

function changeIconPage(direction) {
    currentIconPage += direction;
    initIcons();
}

function openEditor() {
    document.getElementById('editor-modal').classList.remove('hidden');
    editorEngine = new Chess(); editorSteps = []; selectedSquare = null; validMovesForSelected = [];
    selectedEditorStepIndex = null; currentIconPage = 0;
    document.getElementById('editor-steps-list').innerHTML = '<p class="text-slate-500 italic text-sm text-center mt-4">Сделайте первый ход на доске...</p>';
    document.getElementById('editor-step-form').classList.add('hidden');
    initIcons(); renderEditorBoard();
}

function closeEditor() { document.getElementById('editor-modal').classList.add('hidden'); }

function setEditIcon(val) {
    document.getElementById('edit-icon-input').value = val;
    updateCurrentStepData();
}

const pieceMap = { 'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen', 'k': 'king' };

function renderEditorBoard() {
    const boardEl = document.getElementById('editor-board');
    boardEl.innerHTML = '';
    const board = editorEngine.board();
    const highlightTargets = validMovesForSelected.map(m => m.to);

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const squareEl = document.createElement('div');
            squareEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = String.fromCharCode(97 + c) + (8 - r);
            squareEl.dataset.coord = coord;

            if (selectedSquare === coord) squareEl.classList.add('editor-target');
            if (highlightTargets.includes(coord)) {
                const marker = document.createElement('div');
                marker.className = 'valid-move-marker';
                squareEl.appendChild(marker);
            }
            
            if (board[r][c]) {
                const cell = board[r][c];
                const img = document.createElement('img');
                img.src = `${figuresPath}${cell.color}_${pieceMap[cell.type]}.png`;
                img.className = 'piece-img';
                img.onerror = function() { this.style.display='none'; };
                squareEl.appendChild(img);
            }
            
            squareEl.onclick = () => handleEditorClick(coord);
            boardEl.appendChild(squareEl);
        }
    }
}

function handleEditorClick(coord) {
    if (!selectedSquare || (editorEngine.get(coord) && editorEngine.get(coord).color === editorEngine.turn())) {
        const piece = editorEngine.get(coord);
        if (piece && piece.color === editorEngine.turn()) {
            selectedSquare = coord; validMovesForSelected = editorEngine.moves({ square: coord, verbose: true });
            renderEditorBoard();
        } else if(selectedSquare) {
            selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
        }
    } else {
        const moveObj = validMovesForSelected.find(m => m.to === coord);
        if (moveObj) {
            if (selectedEditorStepIndex !== null && selectedEditorStepIndex < editorSteps.length - 1) {
                editorSteps = editorSteps.slice(0, selectedEditorStepIndex + 1);
            }
            const move = editorEngine.move({ from: selectedSquare, to: coord, promotion: 'q' });
            if (move) {
                editorSteps.push({
                    move: move.from + move.to, turn: move.color === 'w' ? 'white' : 'black',
                    san: move.san, title: "", text: "", icon: "⚔️", capture: move.captured ? true : false
                });
                selectEditorStep(editorSteps.length - 1);
                setTimeout(() => { const listEl = document.getElementById('editor-steps-list'); listEl.scrollTop = listEl.scrollHeight; }, 50);
            }
        }
        selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
    }
}

function undoEditorStep() {
    if (editorSteps.length === 0) return showNotification("Нет ходов для отмены!", "error");
    editorSteps.pop();
    editorEngine = new Chess();
    for(let step of editorSteps) { editorEngine.move({from: step.move.substring(0,2), to: step.move.substring(2,4), promotion: 'q'}); }
    selectedSquare = null; validMovesForSelected = [];
    
    if(editorSteps.length > 0) { selectEditorStep(editorSteps.length - 1); } 
    else { selectedEditorStepIndex = null; document.getElementById('editor-step-form').classList.add('hidden'); renderEditorBoard(); renderEditorStepsList(); }
}

function renderEditorStepsList() {
    const list = document.getElementById('editor-steps-list');
    if(editorSteps.length === 0) {
        list.innerHTML = '<p class="text-slate-500 italic text-sm text-center mt-4">Сделайте первый ход на доске...</p>';
        document.getElementById('editor-step-form').classList.add('hidden');
        return;
    }
    list.innerHTML = editorSteps.map((s, i) => {
        const moveNum = Math.floor(i / 2) + 1;
        const turnName = s.turn === 'white' ? 'Белые' : 'Черные';
        const isActive = selectedEditorStepIndex === i ? 'border-sky-500 bg-slate-800 shadow-md' : 'border-slate-700 bg-slate-900/50';
        
        return `
        <div onclick="selectEditorStep(${i})" class="p-2 border rounded-lg cursor-pointer hover:border-amber-500 transition-colors ${isActive} flex justify-between items-center text-slate-300 shrink-0">
            <span class="text-xs"><b class="text-amber-500">${moveNum}. ${s.san}</b> (${turnName})</span>
            <span class="text-[10px] truncate ml-3 flex-1 text-right italic text-slate-400">${s.title || 'Без названия'}</span>
            <span class="ml-2 text-base">${s.icon}</span>
        </div>`;
    }).join(''); 
}

function selectEditorStep(index) {
    selectedEditorStepIndex = index;
    const step = editorSteps[index];
    editorEngine = new Chess();
    for (let i = 0; i <= index; i++) { editorEngine.move({ from: editorSteps[i].move.substring(0, 2), to: editorSteps[i].move.substring(2, 4), promotion: 'q' }); }
    selectedSquare = null; validMovesForSelected = []; renderEditorBoard();

    document.getElementById('editor-step-form').classList.remove('hidden');
    document.getElementById('edit-title').value = step.title;
    document.getElementById('edit-text').value = step.text;
    document.getElementById('edit-icon-input').value = step.icon;
    
    const moveNum = Math.floor(index / 2) + 1;
    const turnName = step.turn === 'white' ? 'Белые' : 'Черные';
    document.getElementById('editing-step-label').textContent = `Редактирование: ${moveNum}. ${step.san} (${turnName})`;

    renderEditorStepsList(); 
}

function updateCurrentStepData() {
    if (selectedEditorStepIndex === null) return;
    const title = document.getElementById('edit-title').value;
    const text = document.getElementById('edit-text').value;
    const icon = document.getElementById('edit-icon-input').value;

    if (window.AntiMate && (AntiMate.check(text) || AntiMate.check(title))) {
        return showNotification("Обнаружена темная магия (нецензурная лексика)!", "error");
    }

    editorSteps[selectedEditorStepIndex].title = title;
    editorSteps[selectedEditorStepIndex].text = text;
    editorSteps[selectedEditorStepIndex].icon = icon;
    renderEditorStepsList();
}

async function publishStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value;
    if (!scenarioName) return showNotification("Дайте название вашей Главе!", "error");
    if (editorSteps.length < 1) return showNotification("Сделайте хотя бы один ход!", "error");

    if (window.AntiMate && AntiMate.check(scenarioName)) {
        return showNotification("Нецензурная лексика в названии!", "error");
    }
    
    const newScenario = {
        title: scenarioName,
        author_id: myAuthorId, 
        goals: ["Завершить партию", "Войти в историю"],
        egoals: ["Не проиграть"],
        story: editorSteps
    };

    let community = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    community = community.filter(c => c.title !== newScenario.title);
    community.push(newScenario);
    localStorage.setItem('chess_saga_custom', JSON.stringify(community));

    showNotification("Отправка ворона с партией...", "info");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: newScenario })
        });

        if (response.ok) showNotification("Партия выложена в общие Свитки!", "success");
        else showNotification("Ошибка сервера. Сохранено локально.", "error");
    } catch (e) { showNotification("Нет сети. Сохранено локально.", "error"); }
    
    setTimeout(() => {
        closeEditor();
        if(!document.getElementById('community-modal').classList.contains('hidden')) { renderGallery(); }
    }, 1000);
}

function downloadCurrentEditorStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value || "My_Chess_Saga";
    if (editorSteps.length === 0) return showNotification("Сначала создайте ходы в Кузнице!", "error");

    const data = { title: scenarioName, goals: ["Победить врага"], egoals: ["Разрушить ваши планы"], story: editorSteps };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", scenarioName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Скачивание началось!", "success");
}
