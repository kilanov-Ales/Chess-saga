window.figuresPath = "Figures/";

window.selectedScenarioKey = 'argus';
window.currentStep = 0;
window.maxReachedStep = 0; 
window.boardState = [];
window.historyStates = []; 

window.finalizeTurnLogic = function() {
    const sc = window.scenarios[window.selectedScenarioKey];
    if (sc && window.currentStep < sc.story.length && sc.story[window.currentStep].turn === 'black' && window.currentStep === window.maxReachedStep) {
        setTimeout(window.processMove, 600); 
    }
}

window.initBoard = function() {
    window.boardState = [
        ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook'],
        ['b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn'],
        ['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],
        ['w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn'],
        ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']
    ];
    window.historyStates = [JSON.parse(JSON.stringify(window.boardState))];
}

window.selectScenario = function(key) {
    window.selectedScenarioKey = key;
    document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');
}

window.startGame = function() {
    // Включаем флаги для звука
    if(typeof window.isMainMenu !== 'undefined') window.isMainMenu = false; 
    if(typeof resumeAudio === 'function') resumeAudio();
    if(typeof applyMenuVolumeLogic === 'function') applyMenuVolumeLogic();
    
    if (!window.scenarios[window.selectedScenarioKey]) {
        window.selectedScenarioKey = 'argus';
    }
    
    const sc = window.scenarios[window.selectedScenarioKey];
    
    window.currentStep = 0; window.maxReachedStep = 0; 
    if(typeof window.isSpeaking !== 'undefined') window.isSpeaking = false;

    const goalsHeader = document.querySelector('.right-panel h3.text-sky-400');
    const egoalsHeader = document.querySelector('.right-panel h3.text-red-500');
    if (goalsHeader) goalsHeader.textContent = window.t('tasks_title');
    if (egoalsHeader) egoalsHeader.textContent = window.t('enemy_title');

    document.getElementById('goals-list').innerHTML = (sc.goals || []).map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = (sc.egoals || []).map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    
    document.getElementById('chronicle-list').innerHTML = '';
    document.getElementById('move-counter').textContent = `ХОД: 1`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;

    document.getElementById('visual-stage').innerHTML = `<img src="Visualization/🏰.png" style="width: 80px; height: 80px;" onerror="this.outerHTML='<span style=\\'font-size: 4rem;\\'>🏰</span>'">`;
    document.getElementById('scene-title').textContent = sc.title || window.t('calm_title');
    document.getElementById('scene-desc').textContent = window.t('calm_desc');

    document.getElementById('main-menu').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('main-app').classList.add('app-visible');
        window.initBoard(); window.renderBoard();
    }, 800);
}

window.playCustomScenario = function(index) {
    window.selectedScenarioKey = 'custom_' + index;
    if(typeof closeCommunityModal === 'function') closeCommunityModal();
    window.startGame();
}

window.downloadFromGallery = function(index) {
    const p = window.scenarios['custom_' + index];
    if(!p) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", p.title + ".json");
    document.body.appendChild(dl); dl.click(); dl.remove();
    if(typeof showNotification === 'function') showNotification(window.t('msg_scroll_downloaded'), "success");
}

window.renderBoard = function() {
    const boardEl = document.getElementById('board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    
    const sc = window.scenarios[window.selectedScenarioKey];
    const next = sc.story[window.currentStep];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = `${String.fromCharCode(97 + c)}${8 - r}`;
            
            if (!window.isSpeaking && window.currentStep === window.maxReachedStep && next && next.turn === 'white' && coord === next.move.substring(2, 4)) {
                sq.classList.add('active-target'); 
                sq.onclick = window.processMove;
            }
            
            if (window.boardState[r] && window.boardState[r][c]) {
                const img = document.createElement('img');
                img.src = `${window.figuresPath}${window.boardState[r][c]}.png`;
                img.className = 'piece-img'; 
                img.onerror = function() { this.style.display='none'; };
                sq.appendChild(img);
            }
            boardEl.appendChild(sq);
        }
    }
}

window.processMove = function() {
    if (window.isSpeaking) return;
    const sc = window.scenarios[window.selectedScenarioKey];
    if (window.currentStep >= sc.story.length) return;
    
    const data = sc.story[window.currentStep];
    const moveClean = data.move.replace(/[!+#]/g, '');
    const from = [8 - parseInt(moveClean[1]), moveClean.charCodeAt(0) - 97];
    const to = [8 - parseInt(moveClean[3]), moveClean.charCodeAt(2) - 97];
    
    window.boardState[to[0]][to[1]] = window.boardState[from[0]][from[1]];
    window.boardState[from[0]][from[1]] = '';
    window.historyStates.push(JSON.parse(JSON.stringify(window.boardState)));

    window.updateVisuals(data, true); 

    const stepForAudio = window.currentStep;
    window.currentStep++; window.maxReachedStep = window.currentStep; 
    
    window.renderBoard(); window.updateStats(data); 
    if(typeof speak === 'function') speak(data.text, data.turn, stepForAudio);
}

window.jumpToStep = function(stepIndex) {
    if (window.isSpeaking) return;
    const sc = window.scenarios[window.selectedScenarioKey];
    if (stepIndex < 0 || stepIndex > window.maxReachedStep) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    window.currentStep = stepIndex;
    window.boardState = JSON.parse(JSON.stringify(window.historyStates[window.currentStep]));

    if (window.currentStep > 0) {
        const data = sc.story[window.currentStep - 1];
        window.updateVisuals(data, false);
        let displayMove = Math.floor((window.currentStep - 1) / 2) + 1;
        document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${window.currentStep % 2 === 0 ? 'БЕЛЫЕ' : 'ЧЕРНЫЕ'}`;
    } else {
        document.getElementById('visual-stage').innerHTML = `<img src="Visualization/🏰.png" style="width: 80px; height: 80px;" onerror="this.outerHTML='<span style=\\'font-size: 4rem;\\'>🏰</span>'">`;
        document.getElementById('scene-title').textContent = sc.title || window.t('calm_title');
        document.getElementById('scene-desc').textContent = window.t('calm_desc');
        document.getElementById('move-counter').textContent = `ХОД: 1`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;
    }
    
    window.renderBoard();
    if (window.currentStep === window.maxReachedStep && sc.story[window.currentStep] && sc.story[window.currentStep].turn === 'black') {
        window.finalizeTurnLogic();
    }
}

window.updateStats = function(data) {
    let displayMove = Math.floor((window.currentStep - 1) / 2) + 1;
    document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${data.turn === 'white' ? 'ЧЕРНЫЕ' : 'БЕЛЫЕ'}`;
}

window.updateVisuals = function(data, createLog) {
    if (data.capture) {
        document.getElementById('flash').classList.add('flash-active');
        setTimeout(() => document.getElementById('flash').classList.remove('flash-active'), 400);
        document.querySelector('.chess-board-outer').classList.add('shake-anim');
        setTimeout(() => document.querySelector('.chess-board-outer').classList.remove('shake-anim'), 300);
    }
    
    const stage = document.getElementById('visual-stage');
    stage.innerHTML = `<img src="Visualization/${data.icon}.png" onerror="this.outerHTML='<span style=\\'font-size: 4rem;\\'>${data.icon}</span>'">`;

    document.getElementById('scene-title').textContent = data.title;
    document.getElementById('scene-desc').textContent = data.text;

    if (createLog) {
        const logIndex = window.currentStep;
        const log = document.createElement('div');
        log.className = `log-entry text-sm border-l-4 pl-4 py-3 cursor-pointer transition-colors hover:bg-white/5 ${data.turn === 'black' ? 'border-slate-700 text-slate-400' : 'border-amber-500 text-slate-200 bg-amber-500/5'}`;
        log.onclick = () => window.jumpToStep(logIndex + 1);
        log.innerHTML = `<span class="uppercase font-bold text-xs block mb-1">${data.turn === 'white' ? '⚪ Игрок' : '⚫ Соперник'}</span>${data.text}`;
        document.getElementById('chronicle-list').appendChild(log);
        const box = document.getElementById('narrative-box'); box.scrollTop = box.scrollHeight;
    }

    if (data.goal !== undefined) {
        const g = document.getElementById(`g${data.goal}`);
        if(g) { 
            g.className = "text-green-500 font-bold transition-all"; 
            g.innerHTML = `<img src="Visualization/g✔️.png" class="inline-block w-5 h-5 mr-1" onerror="this.outerHTML='<span>✔️</span>'"> ` + g.innerText.replace('• ', '').replace('✔ ', '');
            g.style.textDecoration = "line-through";
        }
    }
    if (data.egoal !== undefined) {
        const eg = document.getElementById(`eg${data.egoal}`);
        if(eg) { 
            eg.className = "text-red-500 font-bold transition-all"; 
            eg.innerHTML = `<img src="Visualization/r✔️.png" class="inline-block w-5 h-5 mr-1" onerror="this.outerHTML='<span>✔️</span>'"> ` + eg.innerText.replace('• ', '').replace('✔ ', '');
            eg.style.textDecoration = "line-through";
        }
    }
}

window.exitToMenu = function() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if(typeof window.isMainMenu !== 'undefined') window.isMainMenu = true;
    if(typeof applyMenuVolumeLogic === 'function') applyMenuVolumeLogic();
    location.reload(); 
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('main-app').classList.contains('app-visible')) {
        if (e.key === "ArrowLeft") window.jumpToStep(window.currentStep - 1);
        if (e.key === "ArrowRight") window.jumpToStep(window.currentStep + 1);
    }
});
