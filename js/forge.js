window.editorEngine = typeof Chess !== 'undefined' ? new Chess() : null;
window.editorSteps = [];
window.selectedSquare = null;
window.validMovesForSelected = [];
window.selectedEditorStepIndex = null;

const availableIcons = [
    "‼️", "❗", "❓",
    "✨","🚩","🌑","🏰","⚔️","🔥","👑","💀","🛡️","🐐","👁️","⛓️","🤺","🌀",
    "☀️","⚡","🔱","😰","🪓","🐎","🐢","☁️","🔨","🩸","🕊️","🦅","👺","🏃",
    "🔆","🌫️","🏆","⛪","⚠️","🍴","💥","👸","💎","😵","😈","💔",
    "🗿","🧐","👽","🎀","👓","👟","🎓","🥇","🧩","♥️","🥁","⛏️","🔧",
    "🪨","🪵","⚙️","🪚","💣","🔫","🔪","🔍","💡","🕯","💰","💸","✏️","✒️",
    "⏱️","✂️","⌛","🌍","🏳️","💘","☣️",
    "♔","♕","♖","♗","♘","♙","♚","♛","♜","♝","♞","♟"
];

const ICONS_PER_PAGE = 21; 
window.currentIconPage = 0;

window.initIcons = function() {
    const container = document.getElementById('icon-selector');
    const pagination = document.getElementById('icon-pagination');
    
    const start = window.currentIconPage * ICONS_PER_PAGE;
    const end = start + ICONS_PER_PAGE;
    const pageIcons = availableIcons.slice(start, end);

    container.innerHTML = pageIcons.map(icon => 
        `<button onclick="setEditIcon('${icon}')" class="p-2 bg-slate-800 rounded hover:bg-slate-700 text-base transition-transform hover:scale-110 cursor-pointer shadow-md flex items-center justify-center">
            <img src="Visualization/${icon}.png" class="w-8 h-8 object-contain" alt="${icon}" onerror="this.outerHTML='<span>${icon}</span>'">
        </button>`
    ).join('');

    let paginationHtml = '';
    if (window.currentIconPage > 0) {
        paginationHtml += `<button onclick="changeIconPage(-1)" class="flex-1 p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-base font-bold text-white transition-colors shadow">⬆️</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-2 bg-slate-800 rounded-xl text-base text-slate-600 shadow opacity-50 cursor-not-allowed">⬆️</button>`;
    }
    if (end < availableIcons.length) {
        paginationHtml += `<button onclick="changeIconPage(1)" class="flex-1 p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-base font-bold text-white transition-colors shadow">⬇️</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-2 bg-slate-800 rounded-xl text-base text-slate-600 shadow opacity-50 cursor-not-allowed">⬇️</button>`;
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
    
    document.getElementById('editor-steps-list').innerHTML = `<p class="text-slate-500 italic text-lg text-center mt-12">${window.t('forge_empty')}</p>`;
    document.getElementById('editor-step-form').classList.add('hidden');
    
    if(document.getElementById('edit-scenario-name')) document.getElementById('edit-scenario-name').value = "";
    if(document.getElementById('edit-scenario-tags')) document.getElementById('edit-scenario-tags').value = "";
    if(document.getElementById('edit-scenario-goal')) document.getElementById('edit-scenario-goal').value = "";
    if(document.getElementById('edit-scenario-egoal')) document.getElementById('edit-scenario-egoal').value = "";
    
    window.initIcons(); 
    window.renderEditorBoard();
}

window.closeEditor = function() { document.getElementById('editor-modal').classList.add('hidden'); }

window.setEditIcon = function(val) {
    document.getElementById('edit-icon-input').value = val;
    window.updateCurrentStepData();
}

const pieceMap = { 'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen', 'k': 'king' };

window.renderEditorBoard = function() {
    const boardEl = document.getElementById('editor-board');
    if (!boardEl || !window.editorEngine) return;
    boardEl.innerHTML = '';
    const board = window.editorEngine.board();
    const highlightTargets = window.validMovesForSelected.map(m => m.to);

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const squareEl = document.createElement('div');
            squareEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
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
        const moveObj = window.validMovesForSelected.find(m => m.to === coord);
        if (moveObj) {
            if (window.selectedEditorStepIndex !== null && window.selectedEditorStepIndex < window.editorSteps.length - 1) {
                window.editorSteps = window.editorSteps.slice(0, window.selectedEditorStepIndex + 1);
            }
            const move = window.editorEngine.move({ from: window.selectedSquare, to: coord, promotion: 'q' });
            if (move) {
                window.editorSteps.push({
                    move: move.from + move.to, turn: move.color === 'w' ? 'white' : 'black',
                    san: move.san, title: "", text: "", icon: "⚔️", capture: move.captured ? true : false
                });
                window.selectEditorStep(window.editorSteps.length - 1);
                setTimeout(() => { const listEl = document.getElementById('editor-steps-list'); if(listEl) listEl.scrollTop = listEl.scrollHeight; }, 50);
            }
        }
        window.selectedSquare = null; 
        window.validMovesForSelected = []; 
        window.renderEditorBoard();
    }
}

window.undoEditorStep = function() {
    if (window.editorSteps.length === 0) return;
    window.editorSteps.pop();
    window.editorEngine = new Chess();
    for(let step of window.editorSteps) { window.editorEngine.move({from: step.move.substring(0,2), to: step.move.substring(2,4), promotion: 'q'}); }
    window.selectedSquare = null; window.validMovesForSelected = [];
    
    if(window.editorSteps.length > 0) { window.selectEditorStep(window.editorSteps.length - 1); } 
    else { window.selectedEditorStepIndex = null; document.getElementById('editor-step-form').classList.add('hidden'); window.renderEditorBoard(); window.renderEditorStepsList(); }
}

window.renderEditorStepsList = function() {
    const list = document.getElementById('editor-steps-list');
    if(window.editorSteps.length === 0) {
        list.innerHTML = `<p class="text-slate-500 italic text-lg text-center mt-12">${window.t('forge_empty')}</p>`;
        document.getElementById('editor-step-form').classList.add('hidden');
        return;
    }
    list.innerHTML = window.editorSteps.map((s, i) => {
        const moveNum = Math.floor(i / 2) + 1;
        const turnName = s.turn === 'white' ? 'Белые' : 'Черные';
        const isActive = window.selectedEditorStepIndex === i ? 'border-sky-500 bg-slate-800 shadow-md' : 'border-slate-700 bg-slate-900/50';
        
        let targetText = "";
        if (s.goal === 0) targetText += '<span class="text-sky-400 font-bold ml-2 text-xs">✓ Ц</span>';
        if (s.egoal === 0) targetText += '<span class="text-red-500 font-bold ml-2 text-xs">✓ В</span>';

        return `
        <div onclick="selectEditorStep(${i})" class="p-4 border rounded-xl cursor-pointer hover:border-amber-500 transition-colors ${isActive} flex justify-between items-center text-slate-300 shrink-0">
            <span class="text-sm"><b class="text-amber-500">${moveNum}. ${s.san}</b> <span class="text-xs">(${turnName})</span> ${targetText}</span>
            <span class="text-xs truncate ml-3 flex-1 text-right italic text-slate-400">${s.title || 'Без названия'}</span>
            <span class="ml-3 text-base"><img src="Visualization/${s.icon}.png" class="w-7 h-7 inline object-contain" onerror="this.outerHTML='<span>${s.icon}</span>'"></span>
        </div>`;
    }).join(''); 
}

window.selectEditorStep = function(index) {
    window.selectedEditorStepIndex = index;
    const step = window.editorSteps[index];
    window.editorEngine = new Chess();
    for (let i = 0; i <= index; i++) { window.editorEngine.move({ from: window.editorSteps[i].move.substring(0, 2), to: window.editorSteps[i].move.substring(2, 4), promotion: 'q' }); }
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

    window.renderEditorStepsList(); 
}

window.updateCurrentStepData = function() {
    if (window.selectedEditorStepIndex === null) return;
    const title = document.getElementById('edit-title').value;
    const text = document.getElementById('edit-text').value;
    const icon = document.getElementById('edit-icon-input').value;
    const goalSelect = document.getElementById('edit-step-goal-select').value;

    if (window.AntiMate && (window.AntiMate.check(text) || window.AntiMate.check(title))) {
        if(typeof showNotification === 'function') showNotification(window.t('msg_inq'), "error");
        return;
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
    const scenarioName = document.getElementById('edit-scenario-name').value;
    const rawTags = document.getElementById('edit-scenario-tags').value;
    const tagsArr = rawTags ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (!scenarioName) return showNotification(window.t('msg_title_empty'), "error");
    if (window.editorSteps.length < 1) return showNotification(window.t('msg_forge_empty'), "error");

    if (window.AntiMate && window.AntiMate.check(scenarioName)) {
        return showNotification(window.t('msg_inq'), "error");
    }
    
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
        if (response.ok && typeof showNotification === 'function') showNotification(window.t('msg_scroll_saved'), "success");
    } catch (e) { }
    
    setTimeout(() => {
        window.closeEditor();
        if(typeof renderGallery === 'function' && !document.getElementById('community-modal').classList.contains('hidden')) { window.renderGallery(); }
    }, 1000);
}

window.downloadCurrentEditorStory = function() {
    const scenarioName = document.getElementById('edit-scenario-name').value || "My_Chess_Saga";
    const rawTags = document.getElementById('edit-scenario-tags').value;
    const tagsArr = rawTags ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (window.editorSteps.length === 0) return showNotification(window.t('msg_forge_empty'), "error");

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
    if(typeof showNotification === 'function') showNotification(window.t('msg_scroll_downloaded'), "success");
}
