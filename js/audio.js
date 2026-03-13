const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
let baseMusicVolume = 0.5; // Значение ползунка (от 0 до 1)
let voiceVolume = 0.5;     // Значение ползунка голоса
let isMainMenu = true;     

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Новая безупречная логика громкости
function applyMenuVolumeLogic() {
    if (isSpeaking) return; 
    
    if (isMainMenu) {
        // В меню музыка играет на 30% от заданного ползунка
        bgMusic.volume = baseMusicVolume * 0.3; 
    } else {
        // В бою музыка играет на 100% от заданного ползунка
        bgMusic.volume = baseMusicVolume; 
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

    // Глушим музыку почти в ноль, пока говорит диктор
    voiceAudio.onplay = () => { bgMusic.volume = baseMusicVolume * 0.1; }; 
    voiceAudio.onended = () => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); // Возвращаем нормальную громкость
        if(typeof finalizeTurnLogic === 'function') finalizeTurnLogic(); 
    };
    
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; 
        msg.onstart = () => { bgMusic.volume = baseMusicVolume * 0.1; }; // Глушим для синтезатора
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
