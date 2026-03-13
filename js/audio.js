const audioFolderPath = "audio/"; 
let isSpeaking = false; 

const bgMusic = document.getElementById('audio-bg');
bgMusic.volume = 0.05; 
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function updateVolume(val) {
    bgMusic.volume = val * 0.2; 
    document.querySelectorAll('.volume-slider').forEach(s => s.value = val);
}

function speak(text, turn, stepAtMoment) {
    isSpeaking = true; 
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const fileName = `${selectedScenarioKey}_${stepAtMoment}.mp3`;
    const audioPath = `${audioFolderPath}${fileName}`;

    const voiceAudio = new Audio(audioPath);
    const originalBgVolume = bgMusic.volume;

    voiceAudio.onplay = () => { bgMusic.volume = Math.min(originalBgVolume, 0.02); };
    voiceAudio.onended = () => { bgMusic.volume = originalBgVolume; isSpeaking = false; finalizeTurnLogic(); };
    voiceAudio.onerror = () => {
        bgMusic.volume = originalBgVolume;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ru-RU';
        msg.onend = () => { isSpeaking = false; finalizeTurnLogic(); };
        window.speechSynthesis.speak(msg);
    };

    voiceAudio.play().catch(() => { isSpeaking = false; finalizeTurnLogic(); });
}