const audioFolderPath = "audio/"; 
window.isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
// Значения ползунков изначально стоят ровно по середине
let baseMusicVolume = 0.5; 
let voiceVolume = 0.5;     
window.isMainMenu = true;     

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.resumeAudio = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Логика адаптивной громкости музыки
window.applyMenuVolumeLogic = function() {
    if (window.isSpeaking) return; 
    
    // Максимальный порог музыки (0.2), чтобы даже на 100% она не оглушала.
    const actualVolume = baseMusicVolume * 0.2; 
    
    if (window.isMainMenu) {
        // В меню музыка играет еще тише (25% от основной громкости)
        bgMusic.volume = actualVolume * 0.25; 
    } else {
        // В бою музыка играет на полную установленную громкость
        bgMusic.volume = actualVolume; 
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
        msg.onstart = () => { bgMusic.volume = baseMusicVolume * 0.02; }; // Глушим музыку для синтезатора
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
