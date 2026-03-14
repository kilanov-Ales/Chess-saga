const audioFolderPath = "audio/"; 
window.isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
let baseMusicVolume = 0.5; 
let voiceVolume = 0.5;     
window.isMainMenu = true;     

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.resumeAudio = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Новая безупречная логика громкости
window.applyMenuVolumeLogic = function() {
    if (window.isSpeaking) return; 
    
    // Максимальный порог музыки, чтобы даже на 1.0 она не рвала уши.
    const actualVolume = baseMusicVolume * 0.25; 
    
    if (window.isMainMenu) {
        bgMusic.volume = actualVolume * 0.3; // В меню музыка играет тихо (фоново)
    } else {
        bgMusic.volume = actualVolume; // В бою музыка играет на полную мощь ползунка
    }
}

window.updateVolume = function(val) {
    baseMusicVolume = parseFloat(val); 
    document.querySelectorAll('.volume-slider, .menu-volume-slider').forEach(s => s.value = val);
    window.applyMenuVolumeLogic();
}

window.updateVoiceVolume = function(val) {
    voiceVolume = parseFloat(val);
}

// Применяем громкость сразу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.applyMenuVolumeLogic();
});

window.speak = function(text, turn, stepAtMoment) {
    window.isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const lang = localStorage.getItem('chess_saga_lang') || 'ru';
    const prefix = lang === 'en' ? 'E_' : lang === 'uk' ? 'U_' : '';
    
    const fileName = `${prefix}${window.selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    voiceAudio.volume = voiceVolume;

    // Глушим музыку почти в ноль, пока говорит диктор
    voiceAudio.onplay = () => { bgMusic.volume = baseMusicVolume * 0.02; }; 
    voiceAudio.onended = () => { 
        window.isSpeaking = false; 
        window.applyMenuVolumeLogic(); 
        if(typeof window.finalizeTurnLogic === 'function') window.finalizeTurnLogic(); 
    };
    
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; 
        msg.onstart = () => { bgMusic.volume = baseMusicVolume * 0.02; }; 
        msg.onend = () => { 
            window.isSpeaking = false; 
            window.applyMenuVolumeLogic(); 
            if(typeof window.finalizeTurnLogic === 'function') window.finalizeTurnLogic(); 
        };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => { 
        window.isSpeaking = false; 
        window.applyMenuVolumeLogic(); 
        if(typeof window.finalizeTurnLogic === 'function') window.finalizeTurnLogic(); 
    });
}
