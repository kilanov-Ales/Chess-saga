const API_URL = 'https://chess-api.kilanov.workers.dev/';

// ====== СЛОВАРЬ (Мультиязычность) ======
const dict = {
    ru: {
        checking_archives: "Проверка архивов...", name_yourself: "Назови себя, Лорд", name_desc: "Имя будет высечено в камне навечно и сохранено в облаке. Его нельзя изменить. Одинаковых имен не бывает.",
        enter_chronicles: "Войти в летопись", choose_chapter: "Выберите главу истории", argus_title: "Свет Аргуса", argus_desc: "Поучительная история о самопожертвовании.",
        standard_title: "Знамя Света", standard_desc: "Орден Юстициария против Клана Кровавого Тотема.", traxler_title: "Судьба Тракслера", traxler_desc: "Безумный гамбит и падение Белого Солнца.",
        btn_start: "НАЧАТЬ БИТВУ", btn_forge: "КУЗНИЦА", btn_scrolls: "ЗАЛ СВИТКОВ", raven_mail: "Воронья Почта", chat_loading: "Вороны летят с письмами...",
        chat_send: "Отправить", settings_title: "Тайные Руны (Настройки)", music_vol: "Музыка Битвы", voice_vol: "Голос Летописца", current_lord: "Текущий Лорд:",
        scrolls_title: "Свитки других Лордов", calm_title: "Затишье", calm_desc: "Армии ждут...", tasks_title: "Задачи", enemy_title: "Враг", chronicle_title: "Хроника",
        forge_title: "Кузница Сценариев", make_moves: "Делайте ходы на доске", forge_publish: "Высечь в Свитках", forge_download: "Забрать в Архив (Скачать)",
        forge_empty: "Кузница пуста. Скуйте первый ход...", forge_undo: "Предать ход забвению (Удалить)",
        msg_spam: "Вороны устали! Подождите 5 секунд.", msg_inq: "Инквизиция отвергла эти слова!", msg_taken: "Имя уже занято другим Лордом!",
        msg_short: "Имя не достойно Лорда! (Минимум 3 буквы)", msg_welcome: "С возвращением, Лорд ", msg_forge_empty: "Кузница пуста! Скуйте хотя бы один ход!",
        msg_title_empty: "Нареките свою Летопись именем!", msg_scroll_saved: "Ваша летопись навеки запечатлена в Зале Свитков!", msg_scroll_downloaded: "Свиток перенесен в ваши личные архивы!",
        msg_scroll_burned: "Свиток предан огню и стерт из памяти веков!", read: "Читать", unknown: "Неизвестный", goals: "Цели",
        forge_name_ph: "Название вашей главы (всей партии)", forge_goal_ph: "Ваша Цель (напр. Захватить центр)", forge_egoal_ph: "Цель Врага (напр. Казнь короля)",
        forge_step_title_ph: "Название текущего хода (напр. Прорыв)", forge_step_text_ph: "Текст истории или реплика для этого хода...", chat_ph: "Ваше послание...",
        search_ph: "Поиск по имени Лорда или названию Свитка...", hint_forge_name: "Нареките свою историю, чтобы она вошла в века.",
        hint_forge_goals: "Укажите, к чему стремится ваше войско и армия врага.", hint_forge_step: "Опишите маневр, добавьте реплики героев и выберите подходящую руну.",
        guide_btn_title: "Мудрость Предков (Гайд)", guide_title: "Том Мудрости", guide_intro: "Приветствуем, Лорд! Этот фолиант поможет вам освоить искусство Летописца.",
        guide_forge: "🔨 Кузница Сценариев", guide_forge_desc: "Здесь вы создаете свои истории. Задайте имя летописи и глобальные цели сторон. Делая ходы на доске, вы создаете шаги. Каждому шагу можно дать имя, описание (повествование или диалог) и выбрать эмодзи. Если ход выполняет цель, поставьте галочку.",
        guide_scrolls: "📜 Зал Свитков", guide_scrolls_desc: "Облачная библиотека, где хранятся творения других Лордов. Вы можете читать их истории, ставить лайки (♥️) или дизлайки (💔), а также скачивать их себе.",
        guide_mail: "🐦‍⬛ Воронья Почта", guide_mail_desc: "Чат правителей. Общайтесь с другими создателями. Сообщения удаляются со временем, а сквернословие строго карается Инквизицией.",
        guide_battle: "⚔️ Начало Битвы", guide_battle_desc: "Выберите историю в главном меню и нажмите 'Начать битву', чтобы насладиться партией с озвучкой и визуализацией.",
        forge_check_goal: "Выполняет вашу цель", forge_check_egoal: "Выполняет цель врага"
    },
    en: {
        checking_archives: "Checking archives...", name_yourself: "Name yourself, Lord", name_desc: "Your name will be carved in stone forever and saved in the cloud. Cannot be changed. No duplicates allowed.",
        enter_chronicles: "Enter Chronicles", choose_chapter: "Choose a chapter of history", argus_title: "Light of Argus", argus_desc: "A cautionary tale of self-sacrifice.",
        standard_title: "Banner of Light", standard_desc: "Order of Justiciar vs. Blood Totem Clan.", traxler_title: "Traxler's Fate", traxler_desc: "A mad gambit and the fall of the White Sun.",
        btn_start: "START BATTLE", btn_forge: "THE FORGE", btn_scrolls: "HALL OF SCROLLS", raven_mail: "Raven Mail", chat_loading: "Ravens are flying with letters...",
        chat_send: "Send", settings_title: "Secret Runes (Settings)", music_vol: "Battle Music", voice_vol: "Chronicler's Voice", current_lord: "Current Lord:",
        scrolls_title: "Scrolls of other Lords", calm_title: "Calm", calm_desc: "Armies are waiting...", tasks_title: "Tasks", enemy_title: "Enemy", chronicle_title: "Chronicle",
        forge_title: "Scenario Forge", make_moves: "Make moves on the board", forge_publish: "Carve into Scrolls", forge_download: "Take to Archive (Download)",
        forge_empty: "The forge is empty. Forge the first move...", forge_undo: "Cast move into oblivion (Undo)",
        msg_spam: "Ravens are tired! Wait 5 seconds.", msg_inq: "The Inquisition rejected these words!", msg_taken: "Name is already taken by another Lord!",
        msg_short: "Name unworthy of a Lord! (Min 3 letters)", msg_welcome: "Welcome back, Lord ", msg_forge_empty: "Forge is empty! Forge at least one move!",
        msg_title_empty: "Name your Chronicle!", msg_scroll_saved: "Your chronicle is forever carved in the Hall of Scrolls!", msg_scroll_downloaded: "Scroll transferred to your personal archives!",
        msg_scroll_burned: "Scroll burned and erased from the memory of ages!", read: "Read", unknown: "Unknown", goals: "Goals",
        forge_name_ph: "Name of your chapter (entire game)", forge_goal_ph: "Your Goal (e.g. Capture center)", forge_egoal_ph: "Enemy Goal (e.g. Execute king)",
        forge_step_title_ph: "Current move title (e.g. Breakthrough)", forge_step_text_ph: "Story text or character dialogue for this move...", chat_ph: "Your message...",
        search_ph: "Search by Lord's name or Scroll title...", hint_forge_name: "Name your story so it goes down in history.",
        hint_forge_goals: "Define what your army and the enemy strive for.", hint_forge_step: "Describe the maneuver, add dialogue, and select a rune (icon).",
        guide_btn_title: "Tome of Wisdom (Guide)", guide_title: "Tome of Wisdom", guide_intro: "Welcome, Lord! This folio will help you master the Chronicler's art.",
        guide_forge: "🔨 Scenario Forge", guide_forge_desc: "Here you forge your stories. Set the chronicle's name and global goals. Making moves on the board creates steps. Give each step a title, description (narrative or dialogue), and an emoji. If a move completes a goal, check the box.",
        guide_scrolls: "📜 Hall of Scrolls", guide_scrolls_desc: "A cloud library containing the creations of other Lords. Read their stories, leave likes (♥️) or dislikes (💔), and download them to your archive.",
        guide_mail: "🐦‍⬛ Raven Mail", guide_mail_desc: "The rulers' chat. Speak with other creators. Old messages vanish, and foul language is punished by the Inquisition.",
        guide_battle: "⚔️ Starting a Battle", guide_battle_desc: "Select a story in the main menu and press 'Start Battle' to enjoy a fully voiced and visual game.",
        forge_check_goal: "Completes your goal", forge_check_egoal: "Completes enemy goal"
    },
    uk: {
        checking_archives: "Перевірка архівів...", name_yourself: "Назви себе, Лорде", name_desc: "Ім'я буде викарбувано в камені навічно і збережено в хмарі. Його не можна змінити. Однакових імен не буває.",
        enter_chronicles: "Увійти в літопис", choose_chapter: "Оберіть главу історії", argus_title: "Світло Аргуса", argus_desc: "Повчальна історія про самопожертву.",
        standard_title: "Прапор Світла", standard_desc: "Орден Юстиціарія проти Клану Кривавого Тотема.", traxler_title: "Доля Тракслера", traxler_desc: "Божевільний гамбіт і падіння Білого Сонця.",
        btn_start: "ПОЧАТИ БИТВУ", btn_forge: "КУЗНЯ", btn_scrolls: "ЗАЛА СУВОЇВ", raven_mail: "Вороняча Пошта", chat_loading: "Ворони летять із листами...",
        chat_send: "Відправити", settings_title: "Таємні Руни (Налаштування)", music_vol: "Музика Битви", voice_vol: "Голос Літописця", current_lord: "Поточний Лорд:",
        scrolls_title: "Сувої інших Лордів", calm_title: "Затишшя", calm_desc: "Армії чекають...", tasks_title: "Завдання", enemy_title: "Ворог", chronicle_title: "Літопис",
        forge_title: "Кузня Сценаріїв", make_moves: "Робіть ходи на дошці", forge_publish: "Викарбувати в Сувоях", forge_download: "Забрати в Архів (Завантажити)",
        forge_empty: "Кузня порожня. Викуйте перший хід...", forge_undo: "Віддати хід забуттю (Видалити)",
        msg_spam: "Ворони втомилися! Зачекайте 5 секунд.", msg_inq: "Інквізиція відкинула ці слова!", msg_taken: "Ім'я вже зайняте іншим Лордом!",
        msg_short: "Ім'я не гідне Лорда! (Мінімум 3 літери)", msg_welcome: "З поверненням, Лорде ", msg_forge_empty: "Кузня порожня! Викуйте хоча б один хід!",
        msg_title_empty: "Назвіть свій Літопис!", msg_scroll_saved: "Ваш літопис навіки збережено в Залі Сувоїв!", msg_scroll_downloaded: "Сувій перенесено до ваших особистих архівів!",
        msg_scroll_burned: "Сувій спалено і стерто з пам'яті віків!", read: "Читати", unknown: "Невідомий", goals: "Цілі",
        forge_name_ph: "Назва вашої глави (всієї партії)", forge_goal_ph: "Ваша Ціль (напр. Захопити центр)", forge_egoal_ph: "Ціль Ворога (напр. Страта короля)",
        forge_step_title_ph: "Назва поточного ходу (напр. Прорив)", forge_step_text_ph: "Текст історії або репліка для цього ходу...", chat_ph: "Ваше послання...",
        search_ph: "Пошук за іменем Лорда або назвою Сувою...", hint_forge_name: "Назвіть свою історію, щоб вона увійшла у віки.",
        hint_forge_goals: "Вкажіть, до чого прагне ваше військо та армія ворога.", hint_forge_step: "Опишіть маневр, додайте репліки героїв і виберіть руну (іконку).",
        guide_btn_title: "Том Мудрості (Гайд)", guide_title: "Том Мудрості", guide_intro: "Вітаємо, Лорде! Цей фоліант допоможе вам опанувати мистецтво Літописця.",
        guide_forge: "🔨 Кузня Сценаріїв", guide_forge_desc: "Тут ви створюєте свої історії. Задайте ім'я літопису та глобальні цілі. Роблячи ходи на дошці, ви створюєте кроки. Кожному кроку можна дати ім'я, опис (оповідь або діалог) та вибрати емодзі. Якщо хід виконує ціль, поставте галочку.",
        guide_scrolls: "📜 Зала Сувоїв", guide_scrolls_desc: "Хмарна бібліотека з творіннями інших Лордів. Читайте їхні історії, ставте вподобайки (♥️) або навпаки (💔), а також завантажуйте їх собі.",
        guide_mail: "🐦‍⬛ Вороняча Пошта", guide_mail_desc: "Чат правителів. Спілкуйтеся з іншими творцями. Повідомлення видаляються з часом, а лихослів'я карається Інквізицією.",
        guide_battle: "⚔️ Початок Битви", guide_battle_desc: "Виберіть історію в головному меню і натисніть 'Почати битву', щоб насолодитися партією з озвучкою та візуалізацією.",
        forge_check_goal: "Виконує вашу ціль", forge_check_egoal: "Виконує ціль ворога"
    }
};

let currentLang = localStorage.getItem('chess_saga_lang') || 'ru';
document.getElementById('lang-selector').value = currentLang;

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('chess_saga_lang', lang);
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[currentLang] && dict[currentLang][key]) el.innerHTML = dict[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[currentLang] && dict[currentLang][key]) el.placeholder = dict[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[currentLang] && dict[currentLang][key]) el.title = dict[currentLang][key];
    });
}
window.addEventListener('DOMContentLoaded', applyTranslations);

function t(key) { return dict[currentLang][key] || key; }

// ====== ЛОГИКА АВТОРИЗАЦИИ (Уникальное Имя Лорда) ======
let myAuthorId = localStorage.getItem('chess_saga_author_id');
if (!myAuthorId) {
    myAuthorId = 'lord_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chess_saga_author_id', myAuthorId);
}

let myNickname = localStorage.getItem('chess_saga_nickname');

window.addEventListener('DOMContentLoaded', () => {
    if (!myNickname) {
        document.getElementById('nickname-modal').classList.remove('hidden');
    } else {
        document.getElementById('settings-nickname-display').textContent = myNickname;
    }
});

async function saveNickname() {
    const input = document.getElementById('nickname-input').value.trim();
    if (input.length < 3) return showNotification(t('msg_short'), "error");
    if (window.AntiMate && AntiMate.check(input)) return showNotification(t('msg_inq'), "error");
    
    document.getElementById('nick-loader').style.display = 'flex';
    
    try {
        const resp = await fetch(API_URL);
        if (resp.ok) {
            const data = await resp.json();
            const rows = Array.isArray(data) ? data : (data.data || data.result || []);
            const isTaken = rows.some(r => {
                let p = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || r);
                return p.type === 'profile' && p.nickname.toLowerCase() === input.toLowerCase() && p.author_id !== myAuthorId;
            });

            if (isTaken) {
                document.getElementById('nick-loader').style.display = 'none';
                return showNotification(t('msg_taken'), "error");
            }
        }
        // Сохраняем профиль
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ data: { type: 'profile', author_id: myAuthorId, nickname: input } }) });
    } catch(e) { console.log("Связь с облаком нарушена, сохраняем локально."); }
    
    myNickname = input;
    localStorage.setItem('chess_saga_nickname', myNickname);
    document.getElementById('nick-loader').style.display = 'none';
    document.getElementById('nickname-modal').classList.add('hidden');
    document.getElementById('settings-nickname-display').textContent = myNickname;
    showNotification(t('msg_welcome') + myNickname + "!", "success");
}

function openSettings() { document.getElementById('settings-modal').classList.remove('hidden'); }
function closeSettings() { document.getElementById('settings-modal').classList.add('hidden'); }
function openGuide() { document.getElementById('guide-modal').classList.remove('hidden'); }
function closeGuide() { document.getElementById('guide-modal').classList.add('hidden'); }

// ====== ВОРОНЬЯ ПОЧТА (Чат) ======
let chatPollInterval;
let lastChatTime = 0;

function openChat() {
    document.getElementById('chat-modal').classList.remove('hidden');
    loadChat();
    chatPollInterval = setInterval(loadChat, 5000);
}

function closeChat() {
    document.getElementById('chat-modal').classList.add('hidden');
    clearInterval(chatPollInterval);
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    if (Date.now() - lastChatTime < 5000) return showNotification(t('msg_spam'), "error");
    if (window.AntiMate && AntiMate.check(text)) return showNotification(t('msg_inq'), "error");

    const msgObj = { type: 'chat_msg', author: myNickname || t('unknown'), text: text, time: Date.now() };
    
    // Оптимистичный UI
    input.value = "";
    renderSingleMessage(msgObj, true);
    lastChatTime = Date.now();

    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ data: msgObj }) });
    } catch(e) { showNotification("Ворон сбился с пути...", "error"); }
}

async function loadChat() {
    try {
        const resp = await fetch(API_URL);
        if (resp.ok) {
            const data = await resp.json();
            const rows = Array.isArray(data) ? data : (data.data || data.result || []);
            let messages = rows.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || r))
                               .filter(p => p.type === 'chat_msg')
                               .sort((a,b) => a.time - b.time)
                               .slice(-50); // Храним только 50 последних
            
            const container = document.getElementById('chat-messages');
            container.innerHTML = "";
            if (messages.length === 0) container.innerHTML = `<p class="text-center text-slate-500 italic text-sm mt-10">${t('chat_loading')}</p>`;
            else messages.forEach(m => renderSingleMessage(m, false));
        }
    } catch(e) { }
}

function renderSingleMessage(msg, scrollToBottom) {
    const container = document.getElementById('chat-messages');
    const isMe = msg.author === myNickname;
    const div = document.createElement('div');
    div.className = `chat-msg flex flex-col ${isMe ? 'items-end' : 'items-start'}`;
    div.innerHTML = `
        <span class="text-[9px] text-slate-500 uppercase tracking-widest mb-1 mx-1">${msg.author}</span>
        <div class="px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-amber-600/20 border border-amber-600/50 text-amber-100 rounded-tr-sm' : 'bg-slate-700/50 border border-slate-600 text-slate-200 rounded-tl-sm'}">
            ${msg.text}
        </div>
    `;
    container.appendChild(div);
    if (scrollToBottom || isMe) container.scrollTop = container.scrollHeight;
}

function showNotification(text, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    document.getElementById('toast-text').textContent = text;
    toast.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full font-bold text-sm tracking-widest z-[9999] transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] translate-y-0 opacity-100';

    if (type === 'success') { toast.classList.add('bg-amber-500', 'text-slate-900'); icon.textContent = '✨'; } 
    else if (type === 'error') { toast.classList.add('bg-red-600', 'text-white'); icon.textContent = '‼️'; } 
    else { toast.classList.add('bg-sky-600', 'text-white'); icon.textContent = '🕊️'; }

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-10', 'opacity-0');
    }, 3500);
}

window.AntiMate = { 
    check: (text) => { 
        if (!text) return false;
        const badWords = ['бля', 'хуй', 'сука', 'пизд', 'ебан', 'ебат', 'шлюх', 'мудак', 'гандон', 'хер', 'пидор']; 
        const lowerText = text.toLowerCase();
        return badWords.some(w => lowerText.includes(w)); 
    }
};

// ====== ГАЛЕРЕЯ И ЛАЙКИ (♥️ и 💔) ======
let gallerySearchTerm = "";
let userLikes = JSON.parse(localStorage.getItem('chess_saga_likes') || '{}');

function updateGallerySearch() {
    gallerySearchTerm = document.getElementById('community-search').value.toLowerCase();
    renderGallery();
}

function openCommunityModal() {
    document.getElementById('community-modal').classList.remove('hidden');
    renderGallery();
}
function closeCommunityModal() {
    document.getElementById('community-modal').classList.add('hidden');
}

window.toggleReaction = function(index, type) {
    const p = scenarios['custom_' + index];
    const id = p.db_id || p.title; 
    let current = userLikes[id] || 0;
    
    let diffLike = 0, diffDislike = 0;

    if (type === 'like') {
        if (current === 1) { userLikes[id] = 0; diffLike = -1; }
        else { userLikes[id] = 1; diffLike = 1; if (current === -1) diffDislike = -1; }
    } else {
        if (current === -1) { userLikes[id] = 0; diffDislike = -1; }
        else { userLikes[id] = -1; diffDislike = 1; if (current === 1) diffLike = -1; }
    }

    localStorage.setItem('chess_saga_likes', JSON.stringify(userLikes));
    p.likes = (p.likes || 0) + diffLike;
    p.dislikes = (p.dislikes || 0) + diffDislike;
    renderGallery();
}

async function renderGallery() {
    const gallery = document.getElementById('community-gallery');
    
    let localParties = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    let dbParties = [];

    try {
        const response = await fetch(API_URL, { mode: 'cors' });
        if (response.ok) {
            const data = await response.json();
            let rows = Array.isArray(data) ? data : (data.data || data.result || []);
            dbParties = rows.map(row => {
                let pd = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || row);
                pd.db_id = row.id || pd.id; 
                return pd;
            });
        }
    } catch (e) { console.log("Связь нарушена, грузим локальные:", e); }

    let allParties = [...dbParties].filter(p => p.type !== 'profile' && p.type !== 'chat_msg');
    localParties.forEach(lp => {
        if (!allParties.some(p => p.title === lp.title)) {
            allParties.push(lp);
        }
    });

    const filteredParties = allParties.filter(p => 
        (p.title && p.title.toLowerCase().includes(gallerySearchTerm)) || 
        (p.author_name && p.author_name.toLowerCase().includes(gallerySearchTerm))
    );

    if (filteredParties.length === 0) {
        gallery.innerHTML = `<p class="col-span-full text-center text-slate-600 italic">Свитки не найдены...</p>`;
        return;
    }

    gallery.innerHTML = filteredParties.map((p, originalIndex) => {
        if(!p || !p.story) return '';
        const localIndex = originalIndex; 
        scenarios['custom_' + localIndex] = p; 
        
        const canDelete = p.author_id === myAuthorId;
        const uId = p.db_id || p.title;

        return `
        <div class="scenario-card border-purple-900 bg-slate-900/80 p-4 rounded-xl flex flex-col justify-between hover:scale-105 transition-transform h-full relative">
            <div class="mb-4 pr-6">
                <h3 class="text-purple-400 font-bold truncate text-lg" title="${p.title}">${p.title}</h3>
                <p class="text-[10px] text-slate-400 mt-1 uppercase">Ходов: ${p.story.length}</p>
            </div>
            
            ${canDelete ? `<button onclick="deleteFromGallery(${localIndex})" class="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors" title="Сжечь свиток">🗑️</button>` : ''}

            <div class="flex justify-between items-center mb-3">
                <span class="text-[11px] text-amber-500 font-bold truncate pr-2">Лорд: ${p.author_name || t('unknown')}</span>
                <div class="flex gap-2 text-xs">
                    <button onclick="toggleReaction(${localIndex}, 'like')" class="${userLikes[uId] === 1 ? 'text-green-500' : 'text-slate-500'} hover:text-green-400 transition-colors">♥️ ${p.likes || 0}</button>
                    <button onclick="toggleReaction(${localIndex}, 'dislike')" class="${userLikes[uId] === -1 ? 'text-red-500' : 'text-slate-500'} hover:text-red-400 transition-colors">💔 ${p.dislikes || 0}</button>
                </div>
            </div>

            <div class="flex gap-2">
                <button onclick="playCustomScenario(${localIndex})" class="flex-1 bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-xs font-bold uppercase transition-colors text-white flex items-center justify-center gap-1">
                    <img src="Visualization/👁️.png" class="w-4 h-4" onerror="this.outerHTML='<span>👁️</span>'"> ${t('read')}
                </button>
                <button onclick="downloadFromGallery(${localIndex})" class="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition-colors text-white" title="Забрать в архив">💾</button>
            </div>
        </div>`;
    }).join('');
}

async function deleteFromGallery(index) {
    const p = scenarios['custom_' + index];
    if(!confirm(`Вы точно хотите предать огню свиток "${p.title}"?`)) return;

    let customParties = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    customParties = customParties.filter(cp => cp.title !== p.title);
    localStorage.setItem('chess_saga_custom', JSON.stringify(customParties));

    if (p.db_id) {
        try {
            const endpoint = API_URL.endsWith('/') ? `${API_URL}${p.db_id}` : `${API_URL}/${p.db_id}`;
            const response = await fetch(endpoint, { method: 'DELETE', mode: 'cors' });
            if (response.ok) showNotification(t('msg_scroll_burned'), "success");
        } catch (error) { }
    } else {
        showNotification(t('msg_scroll_burned'), "success");
    }
    renderGallery();
}

function playCustomScenario(index) {
    selectedScenarioKey = 'custom_' + index;
    closeCommunityModal();
    startGame();
}

function downloadFromGallery(index) {
    const p = scenarios['custom_' + index];
    if(!p) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", p.title + ".json");
    document.body.appendChild(dl); dl.click(); dl.remove();
    showNotification(t('msg_scroll_downloaded'), "success");
}

const figuresPath = "Figures/";

let selectedScenarioKey = 'argus';
let currentStep = 0;
let maxReachedStep = 0; 
let boardState = [];
let historyStates = []; 

function finalizeTurnLogic() {
    const sc = scenarios[selectedScenarioKey];
    if (sc && currentStep < sc.story.length && sc.story[currentStep].turn === 'black' && currentStep === maxReachedStep) {
        setTimeout(processMove, 600); 
    }
}

function initBoard() {
    boardState = [
        ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook'],
        ['b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn', 'b_pawn'],
        ['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],
        ['w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn', 'w_pawn'],
        ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook']
    ];
    historyStates = [JSON.parse(JSON.stringify(boardState))];
}

function selectScenario(key) {
    selectedScenarioKey = key;
    document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');
}

function startGame() {
    resumeAudio();
    document.getElementById('menu-vol').style.display = 'none';
    
    if (!scenarios[selectedScenarioKey]) {
        selectedScenarioKey = 'argus';
    }
    
    const sc = scenarios[selectedScenarioKey];
    
    currentStep = 0; maxReachedStep = 0; isSpeaking = false;

    const goalsHeader = document.querySelector('.right-panel h3.text-sky-400');
    const egoalsHeader = document.querySelector('.right-panel h3.text-red-500');
    if (goalsHeader) goalsHeader.textContent = t('tasks_title');
    if (egoalsHeader) egoalsHeader.textContent = t('enemy_title');

    document.getElementById('goals-list').innerHTML = (sc.goals || []).map((g, i) => `<li id="g${i}">• ${g}</li>`).join('');
    document.getElementById('enemy-goals').innerHTML = (sc.egoals || []).map((g, i) => `<li id="eg${i}">• ${g}</li>`).join('');
    
    document.getElementById('chronicle-list').innerHTML = '';
    document.getElementById('move-counter').textContent = `ХОД: 1`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;

    document.getElementById('visual-stage').innerHTML = `<img src="Visualization/🏰.png" style="width: 80px; height: 80px;" onerror="this.outerHTML='<span style=\\'font-size: 4rem;\\'>🏰</span>'">`;
    document.getElementById('scene-title').textContent = sc.title || t('calm_title');
    document.getElementById('scene-desc').textContent = t('calm_desc');

    document.getElementById('main-menu').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('main-app').classList.add('app-visible');
        initBoard(); renderBoard();
    }, 800);
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    
    const sc = scenarios[selectedScenarioKey];
    const next = sc.story[currentStep];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = `${String.fromCharCode(97 + c)}${8 - r}`;
            
            if (!isSpeaking && currentStep === maxReachedStep && next && next.turn === 'white' && coord === next.move.substring(2, 4)) {
                sq.classList.add('active-target'); 
                sq.onclick = processMove;
            }
            
            if (boardState[r] && boardState[r][c]) {
                const img = document.createElement('img');
                img.src = `${figuresPath}${boardState[r][c]}.png`;
                img.className = 'piece-img'; 
                img.onerror = function() { this.style.display='none'; };
                sq.appendChild(img);
            }
            boardEl.appendChild(sq);
        }
    }
}

function processMove() {
    if (isSpeaking) return;
    const sc = scenarios[selectedScenarioKey];
    if (currentStep >= sc.story.length) return;
    
    const data = sc.story[currentStep];
    const moveClean = data.move.replace(/[!+#]/g, '');
    const from = [8 - parseInt(moveClean[1]), moveClean.charCodeAt(0) - 97];
    const to = [8 - parseInt(moveClean[3]), moveClean.charCodeAt(2) - 97];
    
    boardState[to[0]][to[1]] = boardState[from[0]][from[1]];
    boardState[from[0]][from[1]] = '';
    historyStates.push(JSON.parse(JSON.stringify(boardState)));

    updateVisuals(data, true); 

    const stepForAudio = currentStep;
    currentStep++; maxReachedStep = currentStep; 
    
    renderBoard(); updateStats(data); speak(data.text, data.turn, stepForAudio);
}

function jumpToStep(stepIndex) {
    if (isSpeaking) return;
    const sc = scenarios[selectedScenarioKey];
    if (stepIndex < 0 || stepIndex > maxReachedStep) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    currentStep = stepIndex;
    boardState = JSON.parse(JSON.stringify(historyStates[currentStep]));

    if (currentStep > 0) {
        const data = sc.story[currentStep - 1];
        updateVisuals(data, false);
        let displayMove = Math.floor((currentStep - 1) / 2) + 1;
        document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${currentStep % 2 === 0 ? 'БЕЛЫЕ' : 'ЧЕРНЫЕ'}`;
    } else {
        document.getElementById('visual-stage').innerHTML = `<img src="Visualization/🏰.png" style="width: 80px; height: 80px;" onerror="this.outerHTML='<span style=\\'font-size: 4rem;\\'>🏰</span>'">`;
        document.getElementById('scene-title').textContent = sc.title || t('calm_title');
        document.getElementById('scene-desc').textContent = t('calm_desc');
        document.getElementById('move-counter').textContent = `ХОД: 1`;
        document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: БЕЛЫЕ`;
    }
    
    renderBoard();
    if (currentStep === maxReachedStep && sc.story[currentStep] && sc.story[currentStep].turn === 'black') {
        finalizeTurnLogic();
    }
}

function updateStats(data) {
    let displayMove = Math.floor((currentStep - 1) / 2) + 1;
    document.getElementById('move-counter').textContent = `ХОД: ${displayMove}`;
    document.getElementById('player-turn').textContent = `ОЧЕРЕДЬ: ${data.turn === 'white' ? 'ЧЕРНЫЕ' : 'БЕЛЫЕ'}`;
}

function updateVisuals(data, createLog) {
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
        const logIndex = currentStep;
        const log = document.createElement('div');
        log.className = `log-entry text-xs border-l-2 pl-3 py-2 cursor-pointer transition-colors hover:bg-white/5 ${data.turn === 'black' ? 'border-slate-700 text-slate-400' : 'border-amber-500 text-slate-200 bg-amber-500/5'}`;
        log.onclick = () => jumpToStep(logIndex + 1);
        log.innerHTML = `<span class="uppercase font-bold text-[9px] block mb-1">${data.turn === 'white' ? '⚪ Игрок' : '⚫ Соперник'}</span>${data.text}`;
        document.getElementById('chronicle-list').appendChild(log);
        const box = document.getElementById('narrative-box'); box.scrollTop = box.scrollHeight;
    }

    if (data.goal !== undefined) {
        const g = document.getElementById(`g${data.goal}`);
        if(g) { 
            g.className = "text-green-500 font-bold transition-all"; 
            g.innerHTML = `<img src="Visualization/g✔️.png" class="inline-block w-4 h-4 mr-1" onerror="this.outerHTML='<span>✔️</span>'"> ` + g.innerText.replace('• ', '').replace('✔ ', '');
            g.style.textDecoration = "line-through";
        }
    }
    if (data.egoal !== undefined) {
        const eg = document.getElementById(`eg${data.egoal}`);
        if(eg) { 
            eg.className = "text-red-500 font-bold transition-all"; 
            eg.innerHTML = `<img src="Visualization/r✔️.png" class="inline-block w-4 h-4 mr-1" onerror="this.outerHTML='<span>✔️</span>'"> ` + eg.innerText.replace('• ', '').replace('✔ ', '');
            eg.style.textDecoration = "line-through";
        }
    }
}

function exitToMenu() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    location.reload(); 
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('main-app').classList.contains('app-visible')) {
        if (e.key === "ArrowLeft") jumpToStep(currentStep - 1);
        if (e.key === "ArrowRight") jumpToStep(currentStep + 1);
    }
});

// ====== КУЗНИЦА ======
let editorEngine = new Chess();
let editorSteps = [];
let selectedSquare = null;
let validMovesForSelected = [];
let selectedEditorStepIndex = null;

const availableIcons = [
    "‼️", "❗", "❓",
    "✨","🚩","🌑","🏰","⚔️","🔥","👑","💀","🛡️","🐐","👁️","⛓️","🤺","🌀",
    "☀️","⚡","🔱","😰","🪓","🐎","🐢","☁️","🔨","🩸","🕊️","🦅","👺","🏃",
    "🔆","🌫️","🏆","⛪","⚠️","🍴","💥","👸","💎","😵","😈","💔",
    "🗿","🧐","👽","🎀","👓","👟","🎓","🥇","🧩","♥️","🥁","⛏️","🔧",
    "🪨","🪵","⚙️","🪚","💣","🔫","🔪","🔍","💡","🕯","💰","💸","✏️","✒️",
    "⏱️","✂️","⌛","🌍","🏳️","💘","☣️",
    "♔","♕","♖","♗","♘","♙","♚","♛","♜","♝","♞","♟"
];

const ICONS_PER_PAGE = 21; 
let currentIconPage = 0;

function initIcons() {
    const container = document.getElementById('icon-selector');
    const pagination = document.getElementById('icon-pagination');
    
    const start = currentIconPage * ICONS_PER_PAGE;
    const end = start + ICONS_PER_PAGE;
    const pageIcons = availableIcons.slice(start, end);

    container.innerHTML = pageIcons.map(icon => 
        `<button onclick="setEditIcon('${icon}')" class="p-1 bg-slate-800 rounded hover:bg-slate-700 text-base transition-transform hover:scale-110 cursor-pointer shadow-md flex items-center justify-center">
            <img src="Visualization/${icon}.png" class="w-6 h-6 object-contain" alt="${icon}" onerror="this.outerHTML='<span>${icon}</span>'">
        </button>`
    ).join('');

    let paginationHtml = '';
    if (currentIconPage > 0) {
        paginationHtml += `<button onclick="changeIconPage(-1)" class="flex-1 p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition-colors shadow">⬆️</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-1 bg-slate-800 rounded text-xs text-slate-600 shadow opacity-50 cursor-not-allowed">⬆️</button>`;
    }
    if (end < availableIcons.length) {
        paginationHtml += `<button onclick="changeIconPage(1)" class="flex-1 p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition-colors shadow">⬇️</button>`;
    } else {
        paginationHtml += `<button disabled class="flex-1 p-1 bg-slate-800 rounded text-xs text-slate-600 shadow opacity-50 cursor-not-allowed">⬇️</button>`;
    }
    pagination.innerHTML = paginationHtml;
}

function changeIconPage(direction) {
    currentIconPage += direction;
    initIcons();
}

function openEditor() {
    document.getElementById('editor-modal').classList.remove('hidden');
    editorEngine = new Chess(); editorSteps = []; selectedSquare = null; validMovesForSelected = [];
    selectedEditorStepIndex = null; currentIconPage = 0;
    document.getElementById('editor-steps-list').innerHTML = `<p class="text-slate-500 italic text-sm text-center mt-4">${t('forge_empty')}</p>`;
    document.getElementById('editor-step-form').classList.add('hidden');
    
    document.getElementById('edit-scenario-goal').value = "";
    document.getElementById('edit-scenario-egoal').value = "";
    
    initIcons(); renderEditorBoard();
}

function closeEditor() { document.getElementById('editor-modal').classList.add('hidden'); }

function setEditIcon(val) {
    document.getElementById('edit-icon-input').value = val;
    updateCurrentStepData();
}

const pieceMap = { 'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen', 'k': 'king' };

function renderEditorBoard() {
    const boardEl = document.getElementById('editor-board');
    boardEl.innerHTML = '';
    const board = editorEngine.board();
    const highlightTargets = validMovesForSelected.map(m => m.to);

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const squareEl = document.createElement('div');
            squareEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            const coord = String.fromCharCode(97 + c) + (8 - r);
            squareEl.dataset.coord = coord;

            if (selectedSquare === coord) squareEl.classList.add('editor-target');
            if (highlightTargets.includes(coord)) {
                const marker = document.createElement('div');
                marker.className = 'valid-move-marker';
                squareEl.appendChild(marker);
            }
            
            if (board[r][c]) {
                const cell = board[r][c];
                const img = document.createElement('img');
                img.src = `${figuresPath}${cell.color}_${pieceMap[cell.type]}.png`;
                img.className = 'piece-img';
                img.onerror = function() { this.style.display='none'; };
                squareEl.appendChild(img);
            }
            
            squareEl.onclick = () => handleEditorClick(coord);
            boardEl.appendChild(squareEl);
        }
    }
}

function handleEditorClick(coord) {
    if (!selectedSquare || (editorEngine.get(coord) && editorEngine.get(coord).color === editorEngine.turn())) {
        const piece = editorEngine.get(coord);
        if (piece && piece.color === editorEngine.turn()) {
            selectedSquare = coord; validMovesForSelected = editorEngine.moves({ square: coord, verbose: true });
            renderEditorBoard();
        } else if(selectedSquare) {
            selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
        }
    } else {
        const moveObj = validMovesForSelected.find(m => m.to === coord);
        if (moveObj) {
            if (selectedEditorStepIndex !== null && selectedEditorStepIndex < editorSteps.length - 1) {
                editorSteps = editorSteps.slice(0, selectedEditorStepIndex + 1);
            }
            const move = editorEngine.move({ from: selectedSquare, to: coord, promotion: 'q' });
            if (move) {
                editorSteps.push({
                    move: move.from + move.to, turn: move.color === 'w' ? 'white' : 'black',
                    san: move.san, title: "", text: "", icon: "⚔️", capture: move.captured ? true : false
                });
                selectEditorStep(editorSteps.length - 1);
                setTimeout(() => { const listEl = document.getElementById('editor-steps-list'); listEl.scrollTop = listEl.scrollHeight; }, 50);
            }
        }
        selectedSquare = null; validMovesForSelected = []; renderEditorBoard();
    }
}

function undoEditorStep() {
    if (editorSteps.length === 0) return;
    editorSteps.pop();
    editorEngine = new Chess();
    for(let step of editorSteps) { editorEngine.move({from: step.move.substring(0,2), to: step.move.substring(2,4), promotion: 'q'}); }
    selectedSquare = null; validMovesForSelected = [];
    
    if(editorSteps.length > 0) { selectEditorStep(editorSteps.length - 1); } 
    else { selectedEditorStepIndex = null; document.getElementById('editor-step-form').classList.add('hidden'); renderEditorBoard(); renderEditorStepsList(); }
}

function renderEditorStepsList() {
    const list = document.getElementById('editor-steps-list');
    if(editorSteps.length === 0) {
        list.innerHTML = `<p class="text-slate-500 italic text-sm text-center mt-4">${t('forge_empty')}</p>`;
        document.getElementById('editor-step-form').classList.add('hidden');
        return;
    }
    list.innerHTML = editorSteps.map((s, i) => {
        const moveNum = Math.floor(i / 2) + 1;
        const turnName = s.turn === 'white' ? 'Белые' : 'Черные';
        const isActive = selectedEditorStepIndex === i ? 'border-sky-500 bg-slate-800 shadow-md' : 'border-slate-700 bg-slate-900/50';
        
        let targetText = "";
        if (s.goal === 0) targetText += '<span class="text-sky-400 font-bold ml-1">✓ Ц</span>';
        if (s.egoal === 0) targetText += '<span class="text-red-500 font-bold ml-1">✓ В</span>';

        return `
        <div onclick="selectEditorStep(${i})" class="p-2 border rounded-lg cursor-pointer hover:border-amber-500 transition-colors ${isActive} flex justify-between items-center text-slate-300 shrink-0">
            <span class="text-xs"><b class="text-amber-500">${moveNum}. ${s.san}</b> (${turnName}) ${targetText}</span>
            <span class="text-[10px] truncate ml-3 flex-1 text-right italic text-slate-400">${s.title || 'Без названия'}</span>
            <span class="ml-2 text-base"><img src="Visualization/${s.icon}.png" class="w-5 h-5 inline object-contain" onerror="this.outerHTML='<span>${s.icon}</span>'"></span>
        </div>`;
    }).join(''); 
}

function selectEditorStep(index) {
    selectedEditorStepIndex = index;
    const step = editorSteps[index];
    editorEngine = new Chess();
    for (let i = 0; i <= index; i++) { editorEngine.move({ from: editorSteps[i].move.substring(0, 2), to: editorSteps[i].move.substring(2, 4), promotion: 'q' }); }
    selectedSquare = null; validMovesForSelected = []; renderEditorBoard();

    document.getElementById('editor-step-form').classList.remove('hidden');
    document.getElementById('edit-title').value = step.title;
    document.getElementById('edit-text').value = step.text;
    document.getElementById('edit-icon-input').value = step.icon;
    
    document.getElementById('edit-goal-check').checked = step.goal === 0;
    document.getElementById('edit-egoal-check').checked = step.egoal === 0;

    const moveNum = Math.floor(index / 2) + 1;
    const turnName = step.turn === 'white' ? 'Белые' : 'Черные';
    document.getElementById('editing-step-label').textContent = `Редактирование: ${moveNum}. ${step.san} (${turnName})`;

    renderEditorStepsList(); 
}

function updateCurrentStepData() {
    if (selectedEditorStepIndex === null) return;
    const title = document.getElementById('edit-title').value;
    const text = document.getElementById('edit-text').value;
    const icon = document.getElementById('edit-icon-input').value;
    const goalChecked = document.getElementById('edit-goal-check').checked;
    const egoalChecked = document.getElementById('edit-egoal-check').checked;

    if (window.AntiMate && (AntiMate.check(text) || AntiMate.check(title))) {
        return showNotification(t('msg_inq'), "error");
    }

    editorSteps[selectedEditorStepIndex].title = title;
    editorSteps[selectedEditorStepIndex].text = text;
    editorSteps[selectedEditorStepIndex].icon = icon;
    
    if (goalChecked) editorSteps[selectedEditorStepIndex].goal = 0; else delete editorSteps[selectedEditorStepIndex].goal;
    if (egoalChecked) editorSteps[selectedEditorStepIndex].egoal = 0; else delete editorSteps[selectedEditorStepIndex].egoal;

    renderEditorStepsList();
}

async function publishStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value;
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (!scenarioName) return showNotification(t('msg_title_empty'), "error");
    if (editorSteps.length < 1) return showNotification(t('msg_forge_empty'), "error");

    if (window.AntiMate && AntiMate.check(scenarioName)) {
        return showNotification(t('msg_inq'), "error");
    }
    
    const newScenario = {
        title: scenarioName,
        author_id: myAuthorId, 
        author_name: myNickname || t('unknown'),
        goals: [gGoal],
        egoals: [eGoal],
        story: editorSteps,
        likes: 0,
        dislikes: 0
    };

    let community = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    community = community.filter(c => c.title !== newScenario.title);
    community.push(newScenario);
    localStorage.setItem('chess_saga_custom', JSON.stringify(community));

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: newScenario })
        });
        if (response.ok) showNotification(t('msg_scroll_saved'), "success");
    } catch (e) { }
    
    setTimeout(() => {
        closeEditor();
        if(!document.getElementById('community-modal').classList.contains('hidden')) { renderGallery(); }
    }, 1000);
}

function downloadCurrentEditorStory() {
    const scenarioName = document.getElementById('edit-scenario-name').value || "My_Chess_Saga";
    const gGoal = document.getElementById('edit-scenario-goal').value || "Победить";
    const eGoal = document.getElementById('edit-scenario-egoal').value || "Уничтожить врага";

    if (editorSteps.length === 0) return showNotification(t('msg_forge_empty'), "error");

    const data = { 
        title: scenarioName, 
        author_name: myNickname || t('unknown'),
        goals: [gGoal], 
        egoals: [eGoal], 
        story: editorSteps 
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", scenarioName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification(t('msg_scroll_downloaded'), "success");
}
