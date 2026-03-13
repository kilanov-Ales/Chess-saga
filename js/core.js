const API_URL = 'https://chess-api.kilanov.workers.dev/';

// ====== СЛОВАРЬ (Мультиязычность) ======
const dict = {
    ru: {
        checking_archives: "Проверка архивов...", name_yourself: "Назови себя, Лорд", name_desc: "Имя будет высечено в камне навечно и сохранено в облаке. Его нельзя изменить. Одинаковых имен не бывает.",
        enter_chronicles: "Войти в летопись", choose_chapter: "Выберите главу истории", argus_title: "Свет Аргуса", argus_desc: "Поучительная история о самопожертвовании.",
        standard_title: "Знамя Света", standard_desc: "Орден Юстициария против Клана Кровавого Тотема.", traxler_title: "Судьба Тракслера", traxler_desc: "Безумный гамбит и падение Белого Солнца.",
        btn_start: "НАЧАТЬ БИТВУ", btn_forge: "КУЗНИЦА", btn_scrolls: "ЗАЛ СВИТКОВ", raven_mail: "Воронья Почта", chat_loading: "Вороны летят с письмами...",
        chat_send: "Отправить", settings_title: "Тайные Руны", music_vol: "Музыка Битвы", voice_vol: "Голос Летописца", current_lord: "Текущий Лорд:",
        scrolls_title: "Свитки других Лордов", calm_title: "Затишье", calm_desc: "Армии ждут...", tasks_title: "Задачи", enemy_title: "Враг", chronicle_title: "Хроника",
        forge_title: "Кузница Сценариев", make_moves: "Творите историю на поле брани", forge_publish: "Высечь в Свитках", forge_download: "Скачать Архив",
        forge_empty: "Кузница пуста. Скуйте первый ход...", forge_undo: "Предать ход забвению",
        msg_spam: "Вороны устали! Подождите 5 секунд.", msg_inq: "Инквизиция отвергла эти слова!", msg_taken: "Имя уже занято другим Лордом!",
        msg_short: "Имя не достойно Лорда! (Минимум 3 буквы)", msg_welcome: "С возвращением, Лорд ", msg_forge_empty: "Кузница пуста! Скуйте хотя бы один ход!",
        msg_title_empty: "Нареките свою Летопись именем!", msg_scroll_saved: "Ваша летопись навеки запечатлена в Зале Свитков!", msg_scroll_downloaded: "Свиток перенесен в ваши личные архивы!",
        msg_scroll_burned: "Свиток предан огню и стерт из памяти веков!", read: "Читать", unknown: "Неизвестный", goals: "Цели",
        
        forge_settings: "Магия Свитка", forge_goals_title: "Судьбоносные Замыслы", lang_select: "Язык Летописи",
        forge_name_ph: "Заголовок Летописи (Имя)", forge_tags_ph: "Руны Поиска (Теги, через запятую)", forge_goal_ph: "Ваш Замысел (Глобальная цель)", forge_egoal_ph: "Коварство Врага (Его цель)",
        forge_step_title_ph: "Имя Маневра (Ход)", forge_step_text_ph: "Слова или деяния героев...", chat_ph: "Ваше послание...",
        search_ph: "Поиск по имени Лорда или названию Свитка...", 
        
        guide_btn_title: "Мудрость Предков", guide_title: "Том Мудрости", guide_intro: "Приветствуем, Лорд! Этот фолиант поможет вам освоить искусство Летописца.",
        guide_forge: "Кузница Сценариев", guide_forge_desc: "Здесь вы создаете свои истории. Задайте имя летописи, теги и цели. Делая ходы на доске, вы создаете шаги. Каждому шагу можно дать имя, описание (повествование или диалог) и выбрать руну-эмодзи. Выбирайте в списке, какую именно цель выполняет ход.",
        guide_scrolls: "Зал Свитков", guide_scrolls_desc: "Облачная библиотека, где хранятся творения других Лордов. Вы можете читать их истории, ставить лайки или дизлайки, а также скачивать их себе.",
        guide_mail: "Воронья Почта", guide_mail_desc: "Чат правителей. Общайтесь с другими создателями. Сообщения удаляются со временем, а сквернословие строго карается Инквизицией.",
        guide_battle: "Начало Битвы", guide_battle_desc: "Выберите историю в главном меню и нажмите 'Начать битву', чтобы насладиться партией с озвучкой и визуализацией.",
        goal_none: "Не выполняет цель", goal_mine: "Выполняет Вашу цель", goal_enemy: "Выполняет Цель Врага"
    },
    en: {
        checking_archives: "Checking archives...", name_yourself: "Name yourself, Lord", name_desc: "Your name will be carved in stone forever and saved in the cloud. Cannot be changed. No duplicates allowed.",
        enter_chronicles: "Enter Chronicles", choose_chapter: "Choose a chapter of history", argus_title: "Light of Argus", argus_desc: "A cautionary tale of self-sacrifice.",
        standard_title: "Banner of Light", standard_desc: "Order of Justiciar vs. Blood Totem Clan.", traxler_title: "Traxler's Fate", traxler_desc: "A mad gambit and the fall of the White Sun.",
        btn_start: "START BATTLE", btn_forge: "THE FORGE", btn_scrolls: "HALL OF SCROLLS", raven_mail: "Raven Mail", chat_loading: "Ravens are flying with letters...",
        chat_send: "Send", settings_title: "Secret Runes", music_vol: "Battle Music", voice_vol: "Chronicler's Voice", current_lord: "Current Lord:",
        scrolls_title: "Scrolls of other Lords", calm_title: "Calm", calm_desc: "Armies are waiting...", tasks_title: "Tasks", enemy_title: "Enemy", chronicle_title: "Chronicle",
        forge_title: "Scenario Forge", make_moves: "Forge history on the battlefield", forge_publish: "Carve into Scrolls", forge_download: "Download Archive",
        forge_empty: "The forge is empty. Forge the first move...", forge_undo: "Cast move into oblivion",
        msg_spam: "Ravens are tired! Wait 5 seconds.", msg_inq: "The Inquisition rejected these words!", msg_taken: "Name is already taken by another Lord!",
        msg_short: "Name unworthy of a Lord! (Min 3 letters)", msg_welcome: "Welcome back, Lord ", msg_forge_empty: "Forge is empty! Forge at least one move!",
        msg_title_empty: "Name your Chronicle!", msg_scroll_saved: "Your chronicle is forever carved in the Hall of Scrolls!", msg_scroll_downloaded: "Scroll transferred to your personal archives!",
        msg_scroll_burned: "Scroll burned and erased from the memory of ages!", read: "Read", unknown: "Unknown", goals: "Goals",
        
        forge_settings: "Scroll Magic", forge_goals_title: "Fateful Designs", lang_select: "Chronicle Language",
        forge_name_ph: "Scroll Name (Entire Chronicle)", forge_tags_ph: "Search Runes (tags, comma separated)", forge_goal_ph: "Your Design (Global Goal)", forge_egoal_ph: "Enemy's Malice (Enemy Goal)",
        forge_step_title_ph: "Maneuver Name", forge_step_text_ph: "Narrative or speeches...", chat_ph: "Your message...",
        search_ph: "Search by Lord's name or Scroll title...", 
        
        guide_btn_title: "Wisdom of Ancestors", guide_title: "Tome of Wisdom", guide_intro: "Welcome, Lord! This folio will help you master the Chronicler's art.",
        guide_forge: "Scenario Forge", guide_forge_desc: "Here you forge your stories. Set the chronicle's name, tags, and goals. Making moves on the board creates steps. Give each step a title, description (narrative or dialogue), and a rune emoji. Use the dropdown to mark if a move completes a goal.",
        guide_scrolls: "Hall of Scrolls", guide_scrolls_desc: "A cloud library containing the creations of other Lords. Read their stories, leave likes or dislikes, and download them to your archive.",
        guide_mail: "Raven Mail", guide_mail_desc: "The rulers' chat. Speak with other creators. Old messages vanish, and foul language is punished by the Inquisition.",
        guide_battle: "Starting a Battle", guide_battle_desc: "Select a story in the main menu and press 'Start Battle' to enjoy a fully voiced and visual game.",
        goal_none: "Completes no goal", goal_mine: "Completes Your goal", goal_enemy: "Completes Enemy goal"
    },
    uk: {
        checking_archives: "Перевірка архівів...", name_yourself: "Назви себе, Лорде", name_desc: "Ім'я буде викарбувано в камені навічно і збережено в хмарі. Його не можна змінити. Однакових імен не буває.",
        enter_chronicles: "Увійти в літопис", choose_chapter: "Оберіть главу історії", argus_title: "Світло Аргуса", argus_desc: "Повчальна історія про самопожертву.",
        standard_title: "Прапор Світла", standard_desc: "Орден Юстиціарія проти Клану Кривавого Тотема.", traxler_title: "Доля Тракслера", traxler_desc: "Божевільний гамбіт і падіння Білого Сонця.",
        btn_start: "ПОЧАТИ БИТВУ", btn_forge: "КУЗНЯ", btn_scrolls: "ЗАЛА СУВОЇВ", raven_mail: "Вороняча Пошта", chat_loading: "Ворони летять із листами...",
        chat_send: "Відправити", settings_title: "Таємні Руни", music_vol: "Музика Битви", voice_vol: "Голос Літописця", current_lord: "Поточний Лорд:",
        scrolls_title: "Сувої інших Лордів", calm_title: "Затишшя", calm_desc: "Армії чекають...", tasks_title: "Завдання", enemy_title: "Ворог", chronicle_title: "Літопис",
        forge_title: "Кузня Сценаріїв", make_moves: "Творіть історію на полі битви", forge_publish: "Викарбувати в Сувоях", forge_download: "Завантажити Архів",
        forge_empty: "Кузня порожня. Викуйте перший хід...", forge_undo: "Віддати хід забуттю",
        msg_spam: "Ворони втомилися! Зачекайте 5 секунд.", msg_inq: "Інквізиція відкинула ці слова!", msg_taken: "Ім'я вже зайняте іншим Лордом!",
        msg_short: "Ім'я не гідне Лорда! (Мінімум 3 літери)", msg_welcome: "З поверненням, Лорде ", msg_forge_empty: "Кузня порожня! Викуйте хоча б один хід!",
        msg_title_empty: "Назвіть свій Літопис!", msg_scroll_saved: "Ваш літопис навіки збережено в Залі Сувоїв!", msg_scroll_downloaded: "Сувій перенесено до ваших особистих архівів!",
        msg_scroll_burned: "Сувій спалено і стерто з пам'яті віків!", read: "Читати", unknown: "Невідомий", goals: "Цілі",
        
        forge_settings: "Магія Сувою", forge_goals_title: "Доленосні Задуми", lang_select: "Мова Літопису",
        forge_name_ph: "Ім'я Сувою (Весь Літопис)", forge_tags_ph: "Руни пошуку (теги через кому)", forge_goal_ph: "Задум (Ваша Ціль)", forge_egoal_ph: "Підступність (Ціль Ворога)",
        forge_step_title_ph: "Ім'я Маневру (Хід)", forge_step_text_ph: "Оповідь або промови...", chat_ph: "Ваше послання...",
        search_ph: "Пошук за іменем Лорда або назвою Сувою...", 
        
        guide_btn_title: "Мудрість Предків", guide_title: "Том Мудрості", guide_intro: "Вітаємо, Лорде! Цей фоліант допоможе вам опанувати мистецтво Літописця.",
        guide_forge: "Кузня Сценаріїв", guide_forge_desc: "Тут ви створюєте свої історії. Задайте ім'я літопису, теги та цілі. Роблячи ходи на дошці, ви створюєте кроки. Кожному кроку можна дати ім'я, опис (оповідь або діалог) та вибрати руну-емодзі. Обирайте в списку, яку саме ціль виконує хід.",
        guide_scrolls: "Зала Сувоїв", guide_scrolls_desc: "Хмарна бібліотека з творіннями інших Лордів. Читайте їхні історії, ставте вподобайки або дизлайки, а також завантажуйте їх собі.",
        guide_mail: "Вороняча Пошта", guide_mail_desc: "Чат правителів. Спілкуйтеся з іншими творцями. Повідомлення видаляються з часом, а лихослів'я карається Інквізицією.",
        guide_battle: "Початок Битви", guide_battle_desc: "Виберіть історію в головному меню і натисніть 'Почати битву', щоб насолодитися партією з озвучкою та візуалізацією.",
        goal_none: "Не виконує ціль", goal_mine: "Виконує Вашу ціль", goal_enemy: "Виконує Ціль Ворога"
    }
};

let currentLang = localStorage.getItem('chess_saga_lang') || 'ru';
document.getElementById('lang-selector').value = currentLang;

function updateScenariosLanguage() {
    if (typeof defaultScenarios !== 'undefined') {
        scenarios = JSON.parse(JSON.stringify(defaultScenarios[currentLang] || defaultScenarios['ru']));
    }
    let localParties = JSON.parse(localStorage.getItem('chess_saga_custom') || '[]');
    localParties.forEach((p, i) => scenarios['custom_' + i] = p);
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('chess_saga_lang', lang);
    applyTranslations();
    updateScenariosLanguage();
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

function t(key) { return dict[currentLang][key] || key; }

function updateNicknameDisplay() {
    if (myNickname) {
        const d = document.getElementById('settings-nickname-display');
        if(d) d.textContent = myNickname;
    }
}

// ====== ЛОГИКА АВТОРИЗАЦИИ ======
let myAuthorId = localStorage.getItem('chess_saga_author_id');
let myNickname = localStorage.getItem('chess_saga_nickname');

window.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    updateScenariosLanguage();
    
    if (!myAuthorId) {
        myAuthorId = 'lord_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('chess_saga_author_id', myAuthorId);
    }
    
    if (!myNickname) {
        document.getElementById('nickname-modal').classList.remove('hidden');
    } else {
        updateNicknameDisplay();
        let guideShown = localStorage.getItem('chess_saga_guide_shown');
        if (!guideShown) {
            localStorage.setItem('chess_saga_guide_shown', 'true');
            setTimeout(openGuide, 500);
        }
    }
});

async function saveNickname() {
    const input = document.getElementById('nickname-input').value.trim();
    if (input.length < 3) return showNotification(t('msg_short'), "error");
    if (window.AntiMate && AntiMate.check(input)) return showNotification(t('msg_inq'), "error");
    
    // Сначала надежно сохраняем локально, чтобы акк никогда не сбрасывался!
    myNickname = input;
    localStorage.setItem('chess_saga_nickname', myNickname);
    
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
                localStorage.removeItem('chess_saga_nickname'); // Откатываем если занято
                myNickname = null;
                document.getElementById('nick-loader').style.display = 'none';
                return showNotification(t('msg_taken'), "error");
            }
        }
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ data: { type: 'profile', author_id: myAuthorId, nickname: input } }) });
    } catch(e) {}
    
    document.getElementById('nick-loader').style.display = 'none';
    document.getElementById('nickname-modal').classList.add('hidden');
    updateNicknameDisplay();
    showNotification(t('msg_welcome') + myNickname + "!", "success");

    let guideShown = localStorage.getItem('chess_saga_guide_shown');
    if (!guideShown) {
        localStorage.setItem('chess_saga_guide_shown', 'true');
        setTimeout(openGuide, 1000);
    }
}

function openSettings() { updateNicknameDisplay(); document.getElementById('settings-modal').classList.remove('hidden'); }
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
    
    input.value = "";
    renderSingleMessage(msgObj, true);
    lastChatTime = Date.now();

    try { await fetch(API_URL, { method: 'POST', body: JSON.stringify({ data: msgObj }) }); } catch(e) {}
}

async function loadChat() {
    try {
        const resp = await fetch(API_URL);
        if (resp.ok) {
            const data = await resp.json();
            const rows = Array.isArray(data) ? data : (data.data || data.result || []);
            let messages = rows.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || r))
                               .filter(p => p.type === 'chat_msg')
                               .sort((a,b) => a.time - b.time).slice(-50); 
            
            const container = document.getElementById('chat-messages');
            container.innerHTML = "";
            if (messages.length === 0) container.innerHTML = `<p class="text-center text-slate-500 italic mt-10">${t('chat_loading')}</p>`;
            else messages.forEach(m => renderSingleMessage(m, false));
        }
    } catch(e) {}
}

function renderSingleMessage(msg, scrollToBottom) {
    const container = document.getElementById('chat-messages');
    const isMe = msg.author === myNickname;
    const div = document.createElement('div');
    div.className = `chat-msg flex flex-col ${isMe ? 'items-end' : 'items-start'}`;
    div.innerHTML = `
        <span class="text-xs text-slate-500 uppercase tracking-widest mb-1 mx-1">${msg.author}</span>
        <div class="px-5 py-3 rounded-2xl max-w-[80%] text-base ${isMe ? 'bg-amber-600/20 border border-amber-600/50 text-amber-100 rounded-tr-sm' : 'bg-slate-700/50 border border-slate-600 text-slate-200 rounded-tl-sm'}">
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
    toast.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-full font-bold text-base tracking-widest z-[9999] transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] translate-y-0 opacity-100';
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

// ====== ГАЛЕРЕЯ ======
let gallerySearchTerm = "";
let userLikes = JSON.parse(localStorage.getItem('chess_saga_likes') || '{}');

function updateGallerySearch() { gallerySearchTerm = document.getElementById('community-search').value.toLowerCase(); renderGallery(); }
function openCommunityModal() { document.getElementById('community-modal').classList.remove('hidden'); renderGallery(); }
function closeCommunityModal() { document.getElementById('community-modal').classList.add('hidden'); }

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
    p.likes = (p.likes || 0) + diffLike; p.dislikes = (p.dislikes || 0) + diffDislike;
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
                pd.db_id = row.id || pd.id; return pd;
            });
        }
    } catch (e) {}

    let allParties = [...dbParties].filter(p => p.type !== 'profile' && p.type !== 'chat_msg');
    localParties.forEach(lp => { if (!allParties.some(p => p.title === lp.title)) allParties.push(lp); });

    const filteredParties = allParties.filter(p => 
        (p.title && p.title.toLowerCase().includes(gallerySearchTerm)) || 
        (p.author_name && p.author_name.toLowerCase().includes(gallerySearchTerm))
    );

    if (filteredParties.length === 0) {
        gallery.innerHTML = `<p class="col-span-full text-center text-slate-600 italic text-xl">Свитки не найдены...</p>`;
        return;
    }

    gallery.innerHTML = filteredParties.map((p, originalIndex) => {
        if(!p || !p.story) return '';
        scenarios['custom_' + originalIndex] = p; 
        const canDelete = p.author_id === myAuthorId;
        const uId = p.db_id || p.title;
        let tagsHtml = p.tags && p.tags.length > 0 ? `<div class="flex flex-wrap gap-1 mt-2 mb-2">` + p.tags.map(t => `<span class="bg-sky-900/40 text-sky-300 text-[11px] px-2 py-1 rounded-full uppercase tracking-wider">${t}</span>`).join('') + `</div>` : '';

        return `
        <div class="scenario-card border-purple-900 bg-slate-900/80 p-6 rounded-3xl flex flex-col justify-between hover:scale-105 transition-transform h-full relative">
            <div class="mb-4 pr-6">
                <h3 class="text-purple-400 font-bold truncate text-2xl" title="${p.title}">${p.title}</h3>
                ${tagsHtml}
                <p class="text-sm text-slate-400 mt-2 uppercase">Ходов: ${p.story.length}</p>
            </div>
            ${canDelete ? `<button onclick="deleteFromGallery(${originalIndex})" class="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors text-2xl" title="Сжечь свиток">🗑️</button>` : ''}
            <div class="flex justify-between items-center mb-5">
                <span class="text-sm text-amber-500 font-bold truncate pr-2">Лорд: ${p.author_name || t('unknown')}</span>
                <div class="flex gap-4 text-base">
                    <button onclick="toggleReaction(${originalIndex}, 'like')" class="${userLikes[uId] === 1 ? 'text-green-500' : 'text-slate-500'} hover:text-green-400 transition-colors">♥️ ${p.likes || 0}</button>
                    <button onclick="toggleReaction(${originalIndex}, 'dislike')" class="${userLikes[uId] === -1 ? 'text-red-500' : 'text-slate-500'} hover:text-red-400 transition-colors">💔 ${p.dislikes || 0}</button>
                </div>
            </div>
            <div class="flex gap-4">
                <button onclick="if(typeof playCustomScenario === 'function') playCustomScenario(${originalIndex})" class="flex-1 bg-sky-600 hover:bg-sky-500 py-3 rounded-xl text-base font-bold uppercase transition-colors text-white flex items-center justify-center gap-2 shadow-lg">
                    <img src="Visualization/👁️.png" class="w-6 h-6" onerror="this.outerHTML='<span>👁️</span>'"> ${t('read')}
                </button>
                <button onclick="if(typeof downloadFromGallery === 'function') downloadFromGallery(${originalIndex})" class="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-xl transition-colors text-white shadow-lg" title="Забрать в архив">💾</button>
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