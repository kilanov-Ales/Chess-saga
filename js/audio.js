const audioFolderPath = "audio/"; 
window.isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');

// Подгружаем сохраненный звук или ставим 0.5 (середину)
let baseMusicVolume = localStorage.getItem('chess_saga_music_vol') !== null ? parseFloat(localStorage.getItem('chess_saga_music_vol')) : 0.5; 
let voiceVolume = localStorage.getItem('chess_saga_voice_vol') !== null ? parseFloat(localStorage.getItem('chess_saga_voice_vol')) : 0.5;     
window.isMainMenu = true;     

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.resumeAudio = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Новая безупречная логика громкости
window.applyMenuVolumeLogic = function() {
    if (window.isSpeaking) return; 
    
    // В бою играет на все 100% (но 0.3 это предел браузера, чтобы не порвать динамик)
    const actualVolume = baseMusicVolume * 0.3; 
    
    if (window.isMainMenu) {
        bgMusic.volume = actualVolume * 0.25; // В меню утихает
    } else {
        bgMusic.volume = actualVolume; // В бою - максимум
    }
}

window.updateVolume = function(val) {
    baseMusicVolume = parseFloat(val); 
    localStorage.setItem('chess_saga_music_vol', val);
    document.querySelectorAll('.volume-slider, .menu-volume-slider').forEach(s => s.value = val);
    window.applyMenuVolumeLogic();
}

window.updateVoiceVolume = function(val) {
    voiceVolume = parseFloat(val);
    localStorage.setItem('chess_saga_voice_vol', val);
}

// Применяем громкость сразу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.volume-slider, .menu-volume-slider').forEach(s => s.value = baseMusicVolume);
    document.querySelectorAll('input[oninput="updateVoiceVolume(this.value)"]').forEach(s => s.value = voiceVolume);
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

    // Глушим музыку почти в ноль (10%), пока говорит диктор
    voiceAudio.onplay = () => { bgMusic.volume = baseMusicVolume * 0.03; }; 
    voiceAudio.onended = () => { 
        window.isSpeaking = false; 
        window.applyMenuVolumeLogic(); // Возвращаем музыку
        if(typeof window.finalizeTurnLogic === 'function') window.finalizeTurnLogic(); 
    };
    
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; 
        msg.onstart = () => { bgMusic.volume = baseMusicVolume * 0.03; }; 
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
