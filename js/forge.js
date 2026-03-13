let editorEngine = new Chess();
let editorSteps = [];
let selectedSquare = null;
let validMovesForSelected = [];
let selectedEditorStepIndex = null;

const availableIcons = [
    ‼️, ❗, ❓,
    ✨,🚩,🌑,🏰,⚔️,🔥,👑,💀,🛡️,🐐,👁️,⛓️,🤺,🌀,
    ☀️,⚡,🔱,😰,🪓,🐎,🐢,☁️,🔨,🩸,🕊️,🦅,👺,🏃,
    🔆,🌫️,🏆,⛪,⚠️,🍴,💥,👸,💎,😵,😈,💔,
    🗿,🧐,👽,🎀,👓,👟,🎓,🥇,🧩,♥️,🥁,⛏️,🔧,
    🪨,🪵,⚙️,🪚,💣,🔫,🔪,🔍,💡,🕯,💰,💸,✏️,✒️,
    ⏱️,✂️,⌛,🌍,🏳️,💘,☣️,
    ♔,♕,♖,♗,♘,♙,♚,♛,♜,♝,♞,♟
];

const ICONS_PER_PAGE = 21; 
let currentIconPage = 0;

function initIcons() {
    const container = document.getElementById('icon-selector');
    const pagination = document.getElementById('icon-pagination');
    
    const start = currentIconPage  ICONS_PER_PAGE;
    const end = start + ICONS_PER_PAGE;
    const pageIcons = availableIcons.slice(start, end);

    container.innerHTML = pageIcons.map(icon = 
        `button onclick=setEditIcon('${icon}') class=p-2 bg-slate-800 rounded hoverbg-slate-700 text-base transition-transform hoverscale-110 cursor-pointer shadow-md flex items-center justify-center
            img src=Visualization${icon}.png class=w-8 h-8 object-contain alt=${icon} onerror=this.outerHTML='span${icon}span'
        button`
    ).join('');

    let paginationHtml = '';
    if (currentIconPage  0) {
        paginationHtml += `button onclick=changeIconPage(-1) class=flex-1 p-2 bg-slate-700 hoverbg-slate-600 rounded-xl text-base font-bold text-white transition-colors shadow⬆️button`;
    } else {
        paginationHtml += `button disabled class=flex-1 p-2 bg-slate-800 rounded-xl text-base text-slate-600 shadow opacity-50 cursor-not-allowed⬆️button`;
    }
    if (end  availableIcons.length) {
        paginationHtml += `button onclick=changeIconPage(1) class=flex-1 p-2 bg-slate-700 hoverbg-slate-600 rounded-xl text-base font-bold text-white transition-colors shadow⬇️button`;
    } else {
        paginationHtml += `button disabled class=flex-1 p-2 bg-slate-800 rounded-xl text-base text-slate-600 shadow opacity-50 cursor-not-allowed⬇️button`;
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
    document.getElementById('editor-steps-list').innerHTML = `p class=text-slate-500 italic text-lg text-center mt-12${t('forge_empty')}p`;
    document.getElementById('editor-step-form').classList.add('hidden');
    
    document.getElementById('edit-scenario-name').value = ;
    document.getElementById('edit-scenario-tags').value = ;
    document.getElementById('edit-scenario-goal').value = ;
    document.getElementById('edit-scenario-egoal').value = ;
    
    initIcons(); renderEditorBoard();
}

function closeEditor() { document.getElementById('editor-modal').classList.add('hidden'); }

function setEditIcon(val) {
    document.getElementById('edit-icon-input').value = val;
    updateCurrentStepData();
}

const pieceMap = { 'p' 'pawn', 'n' 'knight', 'b' 'bishop', 'r' 'rook', 'q' 'queen', 'k' 'king' };

function renderEditorBoard() {
    const boardEl = document.getElementById('editor-board');
    boardEl.innerHTML = '';
    const board = editorEngine.board();
    const highlightTargets = validMovesForSelected.map(m = m.to);

    for (let r = 0; r  8; r++) {
        for (let c = 0; c  8; c++) {
            const squareEl = document.createElement('div');
            squareEl.className = `square ${(r + c) % 2 === 0  'light'  'dark'}`;
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
            
            squareEl.onclick = () = handleEditorClick(coord);
            boardEl.appendChild(squareEl);
        }
    }
}

function handleEditorClick(coord) {
    if (!selectedSquare  (editorEngine.get(coord) && editorEngine.get(coord).color === editorEngine.turn())) {
        const piece = editorEngine.get(coord);
        if (piece && piece.color === editorEngine.turn()) {
            selectedSquare = coord; validMovesForSelected = editorEngine.moves({ square coord, verbose true });
            renderEditorBoard();
        } else if(selectedSquare) {
            selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
        }
    } else {
        const moveObj = validMovesForSelected.find(m = m.to === coord);
        if (moveObj) {
            if (selectedEditorStepIndex !== null && selectedEditorStepIndex  editorSteps.length - 1) {
                editorSteps = editorSteps.slice(0, selectedEditorStepIndex + 1);
            }
            const move = editorEngine.move({ from selectedSquare, to coord, promotion 'q' });
            if (move) {
                editorSteps.push({
                    move move.from + move.to, turn move.color === 'w'  'white'  'black',
                    san move.san, title , text , icon ⚔️, capture move.captured  true  false
                });
                selectEditorStep(editorSteps.length - 1);
                setTimeout(() = { const listEl = document.getElementById('editor-steps-list'); listEl.scrollTop = listEl.scrollHeight; }, 50);
            }
        }
        selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
    }
}

function undoEditorStep() {
    if (editorSteps.length === 0) return;
    editorSteps.pop();
    editorEngine = new Chess();
    for(let step of editorSteps) { editorEngine.move({from step.move.substring(0,2), to step.move.substring(2,4), promotion 'q'}); }
    selectedSquare = null; validMovesForSelected = [];
    
    if(editorSteps.length  0) { selectEditorStep(editorSteps.length - 1); } 
    else { selectedEditorStepIndex = null; document.getElementById('editor-step-form').classList.add('hidden'); renderEditorBoard(); renderEditorStepsList(); }
}

function renderEditorStepsList() {
    const list = document.getElementById('editor-steps-list');
    if(editorSteps.length === 0) {
        list.innerHTML = `p class=text-slate-500 italic text-lg text-center mt-12${t('forge_empty')}p`;
        document.getElementById('editor-step-form').classList.add('hidden');
        return;
    }
    list.innerHTML = editorSteps.map((s, i) = {
        const moveNum = Math.floor(i  2) + 1;
        const turnName = s.turn === 'white'  'Белые'  'Черные';
        const isActive = selectedEditorStepIndex === i  'border-sky-500 bg-slate-800 shadow-md'  'border-slate-700 bg-slate-90050';
        
        let targetText = ;
        if (s.goal === 0) targetText += 'span class=text-sky-400 font-bold ml-2 text-xs✓ Цspan';
        if (s.egoal === 0) targetText += 'span class=text-red-500 font-bold ml-2 text-xs✓ Вspan';

        return `
        div onclick=selectEditorStep(${i}) class=p-4 border rounded-xl cursor-pointer hoverborder-amber-500 transition-colors ${isActive} flex justify-between items-center text-slate-300 shrink-0
            span class=text-smb class=text-amber-500${moveNum}. ${s.san}b span class=text-xs(${turnName})span ${targetText}span
            span class=text-xs truncate ml-3 flex-1 text-right italic text-slate-400${s.title  'Без названия'}span
            span class=ml-3 text-baseimg src=Visualization${s.icon}.png class=w-7 h-7 inline object-contain onerror=this.outerHTML='span${s.icon}span'span
        div`;
    }).join(''); 
}

function selectEditorStep(index) {
    selectedEditorStepIndex = index;
    const step = editorSteps[index];
    editorEngine = new Chess();
    for (let i = 0; i = index; i++) { editorEngine.move({ from editorSteps[i].move.substring(0, 2), to editorSteps[i].move.substring(2, 4), promotion 'q' }); }
    selectedSquare = null; validMovesForSelected = []; renderEditorBoard();

    document.getElementById('editor-step-form').classList.remove('hidden');
    document.getElementById('edit-title').value = step.title;
    document.getElementById('edit-text').value = step.text;
    document.getElementById('edit-icon-input').value = step.icon;
    
    const selectEl = document.getElementById('edit-step-goal-select');
    if (step.goal === 0) selectEl.value = 'player';
    else if (step.egoal === 0) selectEl.value = 'enemy';
    else selectEl.value = 'none';

    const moveNum = Math.floor(index  2) + 1;
    const turnName = step.turn === 'white'  'Белые'  'Черные';
    document.getElementById('editing-step-label').textContent = `Редактирование ${moveNum}. ${step.san} (${turnName})`;

    renderEditorStepsList(); 
}

function updateCurrentStepData() {
    if (selectedEditorStepIndex === null) return;
    const title = document.getElementById('edit-title').value;
    const text = document.getElementById('edit-text').value;
    const icon = document.getElementById('edit-icon-input').value;
    const goalSelect = document.getElementById('edit-step-goal-select').value;

    if (window.AntiMate && (AntiMate.check(text)  AntiMate.check(title))) {
        return showNotification(t('msg_inq'), error);
    }

    editorSteps[selectedEditorStepIndex].title = title;
    editorSteps[selectedEditorStepIndex].text = text;
    editorSteps[selectedEditorStepIndex].icon = icon;
    
    delete editorSteps[selectedEditorStepIndex].goal;
    delete editorSteps[selectedEditorStepIndex].egoal;

    if (goalSelect === 'player') editorSteps[selectedEditorStepIndex].goal = 0;
    if (goalSelect === 'enemy') editorSteps[selectedEditorStepIndex].egoal = 0;

    renderEditorStepsList();
}

async function publishStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value;
    const rawTags = document.getElementById('edit-scenario-tags').value;
    const tagsArr = rawTags  rawTags.split(',').map(t = t.trim()).filter(t = t)  [];
    
    const gGoal = document.getElementById('edit-scenario-goal').value  Победить;
    const eGoal = document.getElementById('edit-scenario-egoal').value  Уничтожить врага;

    if (!scenarioName) return showNotification(t('msg_title_empty'), error);
    if (editorSteps.length  1) return showNotification(t('msg_forge_empty'), error);

    if (window.AntiMate && AntiMate.check(scenarioName)) {
        return showNotification(t('msg_inq'), error);
    }
    
    const newScenario = {
        title scenarioName,
        author_id myAuthorId, 
        author_name myNickname  t('unknown'),
        tags tagsArr,
        goals [gGoal],
        egoals [eGoal],
        story editorSteps,
        likes 0,
        dislikes 0
    };

    let community = JSON.parse(localStorage.getItem('chess_saga_custom')  '[]');
    community = community.filter(c = c.title !== newScenario.title);
    community.push(newScenario);
    localStorage.setItem('chess_saga_custom', JSON.stringify(community));

    try {
        const response = await fetch(API_URL, {
            method 'POST',
            mode 'cors',
            headers { 'Content-Type' 'applicationjson' },
            body JSON.stringify({ data newScenario })
        });
        if (response.ok) showNotification(t('msg_scroll_saved'), success);
    } catch (e) { }
    
    setTimeout(() = {
        closeEditor();
        if(typeof renderGallery === 'function' && !document.getElementById('community-modal').classList.contains('hidden')) { renderGallery(); }
    }, 1000);
}

function downloadCurrentEditorStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value  My_Chess_Saga;
    const rawTags = document.getElementById('edit-scenario-tags').value;
    const tagsArr = rawTags  rawTags.split(',').map(t = t.trim()).filter(t = t)  [];
    
    const gGoal = document.getElementById('edit-scenario-goal').value  Победить;
    const eGoal = document.getElementById('edit-scenario-egoal').value  Уничтожить врага;

    if (editorSteps.length === 0) return showNotification(t('msg_forge_empty'), error);

    const data = { 
        title scenarioName, 
        author_name myNickname  t('unknown'),
        tags tagsArr,
        goals [gGoal], 
        egoals [eGoal], 
        story editorSteps 
    };
    
    const dataStr = datatextjson;charset=utf-8, + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute(href, dataStr);
    downloadAnchorNode.setAttribute(download, scenarioName + .json);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification(t('msg_scroll_downloaded'), success);
}