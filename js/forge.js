window.editorEngine = typeof Chess !== 'undefined' ? new Chess() : null;
window.editorSteps = [];
window.selectedSquare = null;
window.validMovesForSelected = [];
window.selectedEditorStepIndex = null;
window.editorFlipped = false;
window.pendingPromotionMove = null;

const availableIcons = [
    "‼️", "❗", "❓", "❓❗", "❓❓", "🚩", "🏳️", "🩸", "💀", "⛓️",
    "💔", "✨", "💥", "💎", "💘", "♥️", "🕸️", "☣️", "⚠️", "🔥",
    "🌀", "☀️", "⚡", "🔆", "🌫️", "☁️", "⛅", "❄️", "🌨️", "💧",
    "🌋", "⛰️", "🏝️", "🏰", "⛪", "🌍", "🌑", "🪨", "🪵", "💡",
    "🕯", "⚔️", "🛡️", "🪓", "🔨", "⛏️", "🔧", "⚙️", "🪚", "💣",
    "🔫", "🔪", "🗡️", "🏹", "🔱", "🤺", "🍴", "✏️", "✒️", "✂️",
    "🥇", "🏆", "💰", "💸", "🧩", "🔍", "⌛", "🪜", "⏱️", "🥁",
    "👑", "🎀", "👓", "👟", "🎓", "👽", "🧐", "😰", "😵", "🗿",
    "🏃", "👸", "👻", "👺", "😈", "🐐", "👁️", "🐎", "🐢", "🕊️",
    "🦅", "🧸", "♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛",
    "♜", "♝", "♞", "♟"
];

// Ровно 5 рядов по 5 иконок (Итого 25 на страницу)
const ICONS_PER_PAGE = 25; 
window.currentIconPage = 0;

window.initIcons = function() {
    const container = document.getElementById('icon-selector');
    const pagination = document.getElementById('icon-pagination');
    
    const start = window.currentIconPage * ICONS_PER_PAGE;
    const end = start + ICONS_PER_PAGE;
    const pageIcons = availableIcons.slice(start, end);

    container.innerHTML = pageIcons.map(icon => 
        `<button onclick="setEditIcon('${icon}')" class="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-base transition-transform hover:scale-110 cursor-pointer shadow-md flex items-center justify-center">
            <img src="Visualization/${icon}.png" class="w-8 h-8 object-contain" alt="${icon}" onerror="this.outerHTML='<span>${icon}</span>'">
        </button>`
    ).join('');

    let paginationHtml = '';
    if (window.currentIconPage > 0) {
        paginationHtml += `<button onclick="changeIconPage(-1)" class="flex-1 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors shadow flex justify-center items-center"><img src="Visualization/⬆️.png" class="w-5 h-5 object-contain" onerror="this.outerHTML='<span>⬆️</span>'"></button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-2 bg-slate-800 rounded-lg shadow opacity-50 cursor-not-allowed flex justify-center items-center"><img src="Visualization/⬆️.png" class="w-5 h-5 object-contain" onerror="this.outerHTML='<span>⬆️</span>'"></button>`;
    }
    if (end < availableIcons.length) {
        paginationHtml += `<button onclick="changeIconPage(1)" class="flex-1 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors shadow flex justify-center items-center"><img src="Visualization/⬇️.png" class="w-5 h-5 object-contain" onerror="this.outerHTML='<span>⬇️</span>'"></button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-2 bg-slate-800 rounded-lg shadow opacity-50 cursor-not-allowed flex justify-center items-center"><img src="Visualization/⬇️.png" class="w-5 h-5 object-contain" onerror="this.outerHTML='<span>⬇️</span>'"></button>`;
    }
    pagination.innerHTML = paginationHtml;
}

window.changeIconPage = function(direction) {
    window.currentIconPage += direction;
    window.initIcons();
}

window.openEditor = function() {
    document.getElementById('editor-modal').classList.remove('hidden');
    if(typeof Chess !== 'undefined') window.editorEngine = new Chess(); 
    window.editorSteps = []; 
    window.selectedSquare = null; 
    window.validMovesForSelected = [];
    window.selectedEditorStepIndex = null; 
    window.currentIconPage = 0;
    window.editorFlipped = false;
    
    document.getElementById('editor-steps-list').innerHTML = `<p class="text-slate-500 italic text-sm text-center w-full my-auto">${window.t('forge_empty')}</p>`;
    document.getElementById('editor-step-form').classList.add('hidden');
    
    if(document.getElementById('edit-scenario-name')) document.getElementById('edit-scenario-name').value = "";
    if(document.getElementById('edit-scenario-tags')) document.getElementById('edit-scenario-tags').value = "";
    if(document.getElementById('edit-scenario-goal')) document.getElementById('edit-scenario-goal').value = "";
    if(document.getElementById('edit-scenario-egoal')) document.getElementById('edit-scenario-egoal').value = "";
    
    window.initIcons(); 
    window.updateGoalDropdown();
    window.renderEditorBoard();
}

window.closeEditor = function() { document.getElementById('editor-modal').classList.add('hidden'); }

window.toggleEditorFlip = function() {
    window.editorFlipped = !window.editorFlipped;
    window.renderEditorBoard();
}

window.setEditIcon = function(val) {
    document.getElementById('edit-icon-input').value = val;
    window.updateCurrentStepData();
}

window.updateGoalDropdown = function() {
    const pGoal = document.getElementById('edit-scenario-goal').value.trim() || window.t('goal_mine');
    const eGoal = document.getElementById('edit-scenario-egoal').value.trim() || window.t('goal_enemy');
    
    const selectEl = document.getElementById('edit-step-goal-select');
    if(!selectEl) return;
    
    const currentVal = selectEl.value;
    selectEl.innerHTML = `
        <option value="none">${window.t('goal_none')}</option>
        <option value="player">✨ ${pGoal}</option>
        <option value="enemy">💀 ${eGoal}</option>
    `;
    selectEl.value = currentVal || 'none';
}

const pieceMap = { 'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen', 'k': 'king' };

window.renderEditorBoard = function() {
    const boardEl = document.getElementById('editor-board');
    if (!boardEl || !window.editorEngine) return;
    boardEl.innerHTML = '';
    const board = window.editorEngine.board();
    const highlightTargets = window.validMovesForSelected.map(m => m.to);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const r = window.editorFlipped ? 7 - row : row;
            const c = window.editorFlipped ? 7 - col : col;

            const squareEl = document.createElement('div');
            squareEl.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = String.fromCharCode(97 + c) + (8 - r);
            squareEl.dataset.coord = coord;

            if (window.selectedSquare === coord) squareEl.classList.add('editor-target');
            if (highlightTargets.includes(coord)) {
                const marker = document.createElement('div');
                marker.className = 'valid-move-marker';
                squareEl.appendChild(marker);
            }
            
            if (board[r][c]) {
                const cell = board[r][c];
                const img = document.createElement('img');
                img.src = `${window.figuresPath}${cell.color}_${pieceMap[cell.type]}.png`;
                img.className = 'piece-img';
                img.onerror = function() { this.style.display='none'; };
                squareEl.appendChild(img);
            }
            
            squareEl.onclick = () => window.handleEditorClick(coord);
            boardEl.appendChild(squareEl);
        }
    }
}

window.handleEditorClick = function(coord) {
    if (!window.selectedSquare || (window.editorEngine.get(coord) && window.editorEngine.get(coord).color === window.editorEngine.turn())) {
        const piece = window.editorEngine.get(coord);
        if (piece && piece.color === window.editorEngine.turn()) {
            window.selectedSquare = coord; 
            window.validMovesForSelected = window.editorEngine.moves({ square: coord, verbose: true });
            window.renderEditorBoard();
        } else if(window.selectedSquare) {
            window.selectedSquare = null; 
            window.validMovesForSelected = []; 
            window.renderEditorBoard();
        }
    } else {
        const matchingMoves = window.validMovesForSelected.filter(m => m.to === coord);
        if (matchingMoves.length > 0) {
            const isPromotion = matchingMoves.some(m => m.flags.includes('p') || m.promotion);
            if (isPromotion) {
                window.pendingPromotionMove = { from: window.selectedSquare, to: coord };
                window.showPromotionModal(window.editorEngine.turn());
                return;
            }
            window.executeForgeMove(window.selectedSquare, coord, 'q');
        }
        window.selectedSquare = null; 
        window.validMovesForSelected = []; 
        window.renderEditorBoard();
    }
}

window.showPromotionModal = function(color) {
    const modal = document.getElementById('promotion-modal');
    const container = document.getElementById('promotion-pieces');
    const prefix = color === 'w' ? 'w' : 'b';
    
    container.innerHTML = `
        <img src="${window.figuresPath}${prefix}_queen.png" onclick="confirmPromotion('q')" class="w-16 h-16 cursor-pointer hover:scale-125 transition-transform" title="Ферзь">
        <img src="${window.figuresPath}${prefix}_rook.png" onclick="confirmPromotion('r')" class="w-16 h-16 cursor-pointer hover:scale-125 transition-transform" title="Ладья">
        <img src="${window.figuresPath}${prefix}_bishop.png" onclick="confirmPromotion('b')" class="w-16 h-16 cursor-pointer hover:scale-125 transition-transform" title="Слон">
        <img src="${window.figuresPath}${prefix}_knight.png" onclick="confirmPromotion('n')" class="w-16 h-16 cursor-pointer hover:scale-125 transition-transform" title="Конь">
    `;
    modal.classList.remove('hidden');
}

window.confirmPromotion = function(pieceCode) {
    document.getElementById('promotion-modal').classList.add('hidden');
    if (window.pendingPromotionMove) {
        window.executeForgeMove(window.pendingPromotionMove.from, window.pendingPromotionMove.to, pieceCode);
        window.pendingPromotionMove = null;
    }
}

window.cancelPromotion = function() {
    document.getElementById('promotion-modal').classList.add('hidden');
    window.pendingPromotionMove = null;
    window.selectedSquare = null; 
    window.validMovesForSelected = []; 
    window.renderEditorBoard();
}

window.executeForgeMove = function(from, to, promotionPiece) {
    if (window.selectedEditorStepIndex !== null && window.selectedEditorStepIndex < window.editorSteps.length - 1) {
        window.editorSteps = window.editorSteps.slice(0, window.selectedEditorStepIndex + 1);
    }
    const move = window.editorEngine.move({ from: from, to: to, promotion: promotionPiece });
    if (move) {
        window.editorSteps.push({
            move: move.from + move.to + (move.promotion ? move.promotion : ''),
            turn: move.color === 'w' ? 'white' : 'black',
            san: move.san, title: "", text: "", icon: "⚔️", capture: move.captured ? true : false
        });
        window.selectEditorStep(window.editorSteps.length - 1);
        setTimeout(() => { 
            const listEl = document.getElementById('editor-steps-list'); 
            if(listEl) listEl.scrollLeft = listEl.scrollWidth; 
        }, 50);
    }
    window.selectedSquare = null; 
    window.validMovesForSelected = []; 
    window.renderEditorBoard();
}

window.undoEditorStep = function() {
    if (window.editorSteps.length === 0) return;
    window.editorSteps.pop();
    window.editorEngine = new Chess();
    for(let step of window.editorSteps) { 
        const promStr = step.move.length > 4 ? step.move[4] : 'q';
        window.editorEngine.move({from: step.move.substring(0,2), to: step.move.substring(2,4), promotion: promStr}); 
    }
    window.selectedSquare = null; window.validMovesForSelected = [];
    
    if(window.editorSteps.length > 0) { window.selectEditorStep(window.editorSteps.length - 1); } 
    else { window.selectedEditorStepIndex = null; document.getElementById('editor-step-form').classList.add('hidden'); window.renderEditorBoard(); window.renderEditorStepsList(); }
}

window.renderEditorStepsList = function() {
    const list = document.getElementById('editor-steps-list');
    if(window.editorSteps.length === 0) {
        list.innerHTML = `<p class="text-slate-500 italic text-sm text-center w-full my-auto">${window.t('forge_empty')}</p>`;
        document.getElementById('editor-step-form').classList.add('hidden');
        return;
    }
    
    const pGoal = document.getElementById('edit-scenario-goal').value.trim() || window.t('goal_mine');
    const eGoal = document.getElementById('edit-scenario-egoal').value.trim() || window.t('goal_enemy');

    list.innerHTML = window.editorSteps.map((s, i) => {
        const moveNum = Math.floor(i / 2) + 1;
        const turnName = s.turn === 'white' ? 'Белые' : 'Черные';
        
        const isActive = window.selectedEditorStepIndex === i ? 'border-amber-500 bg-amber-900/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700 bg-slate-800/80 hover:border-sky-500';
        
        let targetText = "";
        if (s.goal === 0) targetText += `<span class="text-sky-400 font-bold ml-1 text-[10px]">✓ Ц</span>`;
        if (s.egoal === 0) targetText += `<span class="text-red-500 font-bold ml-1 text-[10px]">✓ В</span>`;

        return `
        <div onclick="selectEditorStep(${i})" class="flex flex-col min-w-[140px] max-w-[140px] p-2 border-2 rounded-xl cursor-pointer transition-all ${isActive} shrink-0">
            <div class="flex justify-between items-center w-full mb-1">
                <span class="text-xs"><b class="text-amber-500">${moveNum}. ${s.san}</b></span>
                <img src="Visualization/${s.icon}.png" class="w-4 h-4 object-contain" onerror="this.outerHTML='<span>${s.icon}</span>'">
            </div>
            <div class="flex justify-between items-center w-full">
                <span class="text-[10px] text-slate-400 truncate w-[70%]">${s.title || '...'}</span>
                ${targetText}
            </div>
        </div>`;
    }).join(''); 
}

window.selectEditorStep = function(index) {
    window.selectedEditorStepIndex = index;
    const step = window.editorSteps[index];
    window.editorEngine = new Chess();
    for (let i = 0; i <= index; i++) { 
        const promStr = window.editorSteps[i].move.length > 4 ? window.editorSteps[i].move[4] : 'q';
        window.editorEngine.move({ from: window.editorSteps[i].move.substring(0, 2), to: window.editorSteps[i].move.substring(2, 4), promotion: promStr }); 
    }
    window.selectedSquare = null; window.validMovesForSelected = []; window.renderEditorBoard();

    document.getElementById('editor-step-form').classList.remove('hidden');
    document.getElementById('edit-title').value = step.title;
    document.getElementById('edit-text').value = step.text;
    document.getElementById('edit-icon-input').value = step.icon;
    
    const selectEl = document.getElementById('edit-step-goal-select');
    if (step.goal === 0) selectEl.value = 'player';
    else if (step.egoal === 0) selectEl.value = 'enemy';
    else selectEl.value = 'none';

    const moveNum = Math.floor(index / 2) + 1;
    const turnName = step.turn === 'white' ? 'Белые' : 'Черные';
    document.getElementById('editing-step-label').textContent = `Редактирование: ${moveNum}. ${step.san} (${turnName})`;

    window.updateGoalDropdown();
    window.renderEditorStepsList(); 
}

window.updateCurrentStepData = function() {
    if (window.selectedEditorStepIndex === null) return;
    
    let titleRaw = document.getElementById('edit-title').value;
    let title = titleRaw.replace(/^\s*\d+[\.\)]\s*/, '');
    
    let text = document.getElementById('edit-text').value;
    const icon = document.getElementById('edit-icon-input').value;
    const goalSelect = document.getElementById('edit-step-goal-select').value;

    if (window.AntiMat) {
        let cTitle = window.AntiMat.censor(title);
        let cText = window.AntiMat.censor(text);
        if (cTitle !== title || cText !== text) {
            window.showNotification(window.t('msg_inq'), "inq");
            title = cTitle;
            text = cText;
            document.getElementById('edit-title').value = title;
            document.getElementById('edit-text').value = text;
        }
    }

    window.editorSteps[window.selectedEditorStepIndex].title = title;
    window.editorSteps[window.selectedEditorStepIndex].text = text;
    window.editorSteps[window.selectedEditorStepIndex].icon = icon;
    
    delete window.editorSteps[window.selectedEditorStepIndex].goal;
    delete window.editorSteps[window.selectedEditorStepIndex].egoal;

    if (goalSelect === 'player') window.editorSteps[window.selectedEditorStepIndex].goal = 0;
    if (goalSelect === 'enemy') window.editorSteps[window.selectedEditorStepIndex].egoal = 0;

    window.renderEditorStepsList();
}

window.publishStory = async function() {
    let scenarioName = document.getElementById('edit-scenario-name').value;
    const rawTags = document.getElementById('edit-scenario-tags').value;
    
    if (window.AntiMat) {
        let cName = window.AntiMat.censor(scenarioName);
        let cTags = window.AntiMat.censor(rawTags);
        if (cName !== scenarioName || cTags !== rawTags) {
            window.showNotification(window.t('msg_inq'), "inq");
            scenarioName = cName;
            document.getElementById('edit-scenario-name').value = scenarioName;
            document.getElementById('edit-scenario-tags').value = cTags;
        }
    }
    
    const tagsArr = rawTags ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (!scenarioName) return window.showNotification(window.t('msg_title_empty'), "error");
    if (window.editorSteps.length < 1) return window.showNotification(window.t('msg_forge_empty'), "error");

    const newScenario = {
        title: scenarioName,
        author_id: window.myAuthorId, 
        author_name: window.myNickname || window.t('unknown'),
        tags: tagsArr,
        goals: [gGoal],
        egoals: [eGoal],
        story: window.editorSteps,
        likes: 0,
        dislikes: 0
    };

    let community = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    community = community.filter(c => c.title !== newScenario.title);
    community.push(newScenario);
    localStorage.setItem('chess_saga_custom', JSON.stringify(community));

    try {
        const response = await fetch(window.API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: newScenario })
        });
        if (response.ok && typeof showNotification === 'function') window.showNotification(window.t('msg_scroll_saved'), "success");
    } catch (e) { }
    
    setTimeout(() => {
        window.closeEditor();
        if(typeof window.renderGallery === 'function' && !document.getElementById('community-modal').classList.contains('hidden')) { window.renderGallery(); }
    }, 1000);
}

window.downloadCurrentEditorStory = function() {
    const scenarioName = document.getElementById('edit-scenario-name').value || "My_Chess_Saga";
    const rawTags = document.getElementById('edit-scenario-tags').value;
    const tagsArr = rawTags ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (window.editorSteps.length === 0) return window.showNotification(window.t('msg_forge_empty'), "error");

    const data = { 
        title: scenarioName, 
        author_name: window.myNickname || window.t('unknown'),
        tags: tagsArr,
        goals: [gGoal], 
        egoals: [eGoal], 
        story: window.editorSteps 
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", scenarioName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    if(typeof showNotification === 'function') window.showNotification(window.t('msg_scroll_downloaded'), "success");
}
