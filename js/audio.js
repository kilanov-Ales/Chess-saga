const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
bgMusic.volume = 0.05; 
let voiceVolume = 1.0; // Новая переменная для громкости голоса

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    bgMusic.volume = val * 0.2; 
    document.querySelectorAll('.volume-slider').forEach(s => s.value = val);
}

function updateVoiceVolume(val) {
    voiceVolume = parseFloat(val);
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fileName = `${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    voiceAudio.volume = voiceVolume; // Применяем громкость

    const originalBgVolume = bgMusic.volume;

    voiceAudio.onplay = () => { bgMusic.volume = Math.min(originalBgVolume, 0.01); };
    voiceAudio.onended = () => { bgMusic.volume = originalBgVolume; isSpeaking = false; finalizeTurnLogic(); };
    voiceAudio.onerror = () => {
        bgMusic.volume = originalBgVolume;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = currentLang === 'en' ? 'en-US' : currentLang === 'uk' ? 'uk-UA' : 'ru-RU';
        msg.volume = voiceVolume; // Громкость синтезатора
        msg.onend = () => { isSpeaking = false; finalizeTurnLogic(); };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => { isSpeaking = false; finalizeTurnLogic(); });
}
