const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
let baseMusicVolume = 0.5; // Значение ползунка по умолчанию (середина)
let voiceVolume = 0.5;     // Значение ползунка голоса по умолчанию (середина)
let isMainMenu = true;     // Флаг нахождения в главном меню

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Логика затихания: Музыка в меню тише в 2 раза
function applyMenuVolumeLogic() {
    if (isSpeaking) return; // Если говорит голос, работает другая логика в speak()
    
    // Умножаем на 0.3 как базовый максимальный лимит для комфортного звука.
    // Если игрок выкрутил на макс (1.0), то громкость будет 0.3. Если на 0.5, то 0.15.
    const actualVolume = baseMusicVolume * 0.3; 
    
    if (isMainMenu) {
        bgMusic.volume = actualVolume * 0.4; // В меню еще тише
    } else {
        bgMusic.volume = actualVolume; // В бою нормальная громкость
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
    
    const fileName = `${prefix}${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    
    // Громкость аудио от 0 до 1
    voiceAudio.volume = voiceVolume;

    voiceAudio.onplay = () => { bgMusic.volume = Math.min(baseMusicVolume * 0.3, 0.01); }; // Музыка стихает под голос
    voiceAudio.onended = () => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); 
        finalizeTurnLogic(); 
    };
    
    voiceAudio.onerror = () => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; 
        msg.onend = () => { 
            isSpeaking = false; 
            applyMenuVolumeLogic(); 
            finalizeTurnLogic(); 
        };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); 
        finalizeTurnLogic(); 
    });
}
