const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
let baseMusicVolume = 0.15; // Громкость, установленная в настройках
let voiceVolume = 1.0; 
let isMainMenu = true; // Флаг нахождения в главном меню

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

// Логика затихания: в меню музыка в 2.5 раза тише
function applyMenuVolumeLogic() {
    if (isSpeaking) return; // Если говорит голос, громкость регулируется в speak()
    if (isMainMenu) {
        bgMusic.volume = baseMusicVolume * 0.4;
    } else {
        bgMusic.volume = baseMusicVolume;
    }
}

function updateVolume(val) {
    baseMusicVolume = parseFloat(val) * 0.2; 
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
    voiceAudio.volume = voiceVolume;

    voiceAudio.onplay = () => { bgMusic.volume = Math.min(baseMusicVolume, 0.01); }; // Музыка стихает под голос
    voiceAudio.onended = () => { 
        isSpeaking = false; 
        applyMenuVolumeLogic(); // Возвращаем громкость
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
