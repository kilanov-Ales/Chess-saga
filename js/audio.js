const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
let baseMusicVolume = 0.5; // Значение ползунка по умолчанию
let voiceVolume = 0.5;     // Значение ползунка голоса по умолчанию
let isMainMenu = true;     // Флаг нахождения в главном меню

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Музыка в меню тише в 2 раза
function applyMenuVolumeLogic() {
    if (isSpeaking) return; 
    
    const actualVolume = baseMusicVolume * 0.3; // 0.3 это предел, чтобы не оглохнуть
    
    if (isMainMenu) {
        bgMusic.volume = actualVolume * 0.4; // В меню утихает
    } else {
        bgMusic.volume = actualVolume; // Во время боя норм громкость
    }
}

function updateVolume(val) {
    baseMusicVolume = parseFloat(val); 
    document.querySelectorAll('.volume-slider, .menu-volume-slider').forEach(s => s.value = val);
    applyMenuVolumeLogic();
}

function updateVoiceVolume(val) {
    voiceVolume = parseFloat(val);
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const lang = localStorage.getItem('chess_saga_lang') || 'ru';
    const prefix = lang === 'en' ? 'E_' : lang === 'uk' ? 'U_' : '';
    
    const fileName = `${prefix}${window.selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    voiceAudio.volume = voiceVolume;

    // Приглушаем музыку, пока идет речь
    voiceAudio.onplay = () => { bgMusic.volume = Math.min(baseMusicVolume * 0.3, 0.01); }; 
    voiceAudio.onended = () => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); 
        if(typeof finalizeTurnLogic === 'function') finalizeTurnLogic(); 
    };
    
    // Фолбек на встроенный голос, если файла нет
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; 
        msg.onend = () => { 
            isSpeaking = false; 
            applyMenuVolumeLogic(); 
            if(typeof finalizeTurnLogic === 'function') finalizeTurnLogic(); 
        };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); 
        if(typeof finalizeTurnLogic === 'function') finalizeTurnLogic(); 
    });
}
