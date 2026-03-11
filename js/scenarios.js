// js/scenarios.js
const scenarios = {
    argus: {
        goals: ["Освящение центра", "Взгляд на f7", "ПОБЕДА ЭКЗОДАРА"],
        egoals: ["Осквернение e5", "Теневая связка", "Падение Пророка"],
        story: [
            { move: "e2e4", turn: 'white', title: "Свет Аргуса", text: "Воздаятель делает первый шаг, призывая энергию кристаллов.", icon: "✨", goal: 0 },
            { move: "e7e5", turn: 'black', title: "Ответ Изгнанника", text: "Темные дренеи выставляют свой заслон.", icon: "🟣", egoal: 0 },
            { move: "g1f3", turn: 'white', title: "Копыта Праведности", text: "Элезар устремляется вперед на своем Талбуке.", icon: "🐐" },
            { move: "d7d6", turn: 'black', title: "Щит Тенебра", text: "Отступники укрепляют свои ряды молитвой стойкости.", icon: "🛡️" },
            { move: "f1c4", turn: 'white', title: "Око Пророка", text: "Верховный Мудрец направляет посох в уязвимое место.", icon: "👁️", goal: 1 },
            { move: "c8g4", turn: 'black', title: "Шепот Бездны", text: "Темный Жнец накладывает проклятие страха.", icon: "⛓️", egoal: 1 },
            { move: "b1c3", turn: 'white', title: "Братство Света", text: "Второй всадник выходит из теней Экзодара.", icon: "🤺" },
            { move: "b8c6", turn: 'black', title: "Тень подкрадывается", text: "Армия Бездны призывает своих всадников.", icon: "🌀" },
            { move: "h2h3", turn: 'white', title: "Слово Очищения", text: "Воздаятель направляет искру Света.", icon: "☀️" },
            { move: "g4h5", turn: 'black', title: "Упрямство Падших", text: "Жнец отступает лишь на шаг.", icon: "🌑" },
            { move: "f3e5", turn: 'white', title: "Жертва Наару", text: "Элезар разрывает цепи и бросается в атаку!", icon: "⚡", capture: true },
            { move: "h5d1", turn: 'black', title: "Триумф Хаоса", text: "Жнец повергает лидера Света. Тьма ликует.", icon: "💀", egoal: 2, capture: true },
            { move: "c4f7", turn: 'white', title: "Удар Искупления", text: "Луч энергии в чело Темного Короля!", icon: "🔱", capture: true },
            { move: "e8e7", turn: 'black', title: "Позорное бегство", text: "Поверженный лидер Тьмы вынужден бежать.", icon: "😰" },
            { move: "c3d5", turn: 'white', title: "ПРИГОВОР СВЕТА", text: "Второй всадник настигает тирана.", icon: "👑", goal: 2 }
        ]
    },
    standard: {
        goals: ["Освящение рубежа", "Сокрушение преграды", "ПОБЕДА ОРДЕНА"],
        egoals: ["Ответная ярость", "Кровавая жатва", "Самопожертвование рабов"],
        story: [
            { move: "e2e4", turn: 'white', title: "Знамя Света", text: "Юный рыцарь вонзает штандарт в сухую землю.", icon: "🚩", goal: 0 },
            { move: "e7e5", turn: 'black', title: "Рог Войны", text: "Вождь кочевников принимает вызов.", icon: "🪓", egoal: 0 },
            { move: "g1f3", turn: 'white', title: "Клятва Всадника", text: "Рыцарь делает выпад в горло врагу.", icon: "🐎" },
            { move: "d7d6", turn: 'black', title: "Каменная Черепаха", text: "Кочевники смыкают щиты.", icon: "🐢" },
            { move: "f1c4", turn: 'white', title: "Око Юстициария", text: "Старый воевода выискивает щель в шлеме вождя.", icon: "👁️" },
            { move: "h7h6", turn: 'black', title: "Тень Сомнения", text: "Вождь приказывает поднять щиты выше.", icon: "☁️" },
            { move: "d2d4", turn: 'white', title: "Удар Молота", text: "Основные силы ордена идут на таран.", icon: "🔨", goal: 1 },
            { move: "e5d4", turn: 'black', title: "Кровавая Жатва", text: "Кочевники расступаются, заманивая в ловушку.", icon: "🩸", egoal: 1, capture: true },
            { move: "c2c3", turn: 'white', title: "Дар Мученика", text: "Паладины бросают щиты, чтобы быть быстрее.", icon: "🕊️" },
            { move: "d4c3", turn: 'black', title: "Пир Стервятника", text: "Кочевники вгрызаются в брешь.", icon: "🦅", capture: true },
            { move: "c4f7", turn: 'white', title: "Гнев Юстициария", text: "Клинок воеводы разрубает трон вождя!", icon: "⚔️", capture: true },
            { move: "e8f7", turn: 'black', title: "Ответная Ярость", text: "Вождь сносит голову воеводе.", icon: "👺", capture: true },
            { move: "f3e5", turn: 'white', title: "Приговор Небес", text: "Всадник влетает в самую гущу битвы.", icon: "⚡" },
            { move: "f7e8", turn: 'black', title: "Путь Труса", text: "Воитель бежит к своим шатрам.", icon: "🏃" },
            { move: "d1h5", turn: 'white', title: "Зов Искупительницы", text: "Свет испепеляет стражу вождя.", icon: "🔱" },
            { move: "g7g6", turn: 'black', title: "Последний Заслон", text: "Телохратели бросаются в пламя.", icon: "🔥", egoal: 2 },
            { move: "h5g6", turn: 'white', title: "Сияние", text: "Свет проходит сквозь плоть и кости.", icon: "🔆", capture: true },
            { move: "e8e7", turn: 'black', title: "Тень Агонии", text: "Вождь загнан к обрыву.", icon: "🌫️" },
            { move: "g6f7", turn: 'white', title: "ВЕЧНЫЙ ПОКОЙ", text: "Последний удар нанесен.", icon: "🏆", goal: 2 }
        ]
    },
    traxler: {
        goals: ["Захватить центр", "Штурм форпоста f7", "Свергнуть Монарха"],
        egoals: ["Сдержать натиск", "Ловушка Тракслера", "Казнь Короля"],
        story: [
            { move: "e2e4", turn: 'white', title: "Вторжение", text: "Белое Солнце выдвигает авангард.", icon: "⚔️", goal: 0 },
            { move: "e7e5", turn: 'black', title: "Ответ Луны", text: "Черный легион блокирует продвижение.", icon: "🛡️", egoal: 0 },
            { move: "g1f3", turn: 'white', title: "Конница", text: "Сир Фредерик выходит на фланг.", icon: "🐎" },
            { move: "b8c6", turn: 'black', title: "Перехват", text: "Черные всадники выходят навстречу.", icon: "♞" },
            { move: "f1c4", turn: 'white', title: "Высоты", text: "Инквизитор видит слабую стену.", icon: "⛪" },
            { move: "g8f6", turn: 'black', title: "Ловушка", text: "Враг выпускает рыцаря.", icon: "🌑" },
            { move: "f3g5", turn: 'white', title: "Штурм", text: "Копья направлены на f7.", icon: "🔥", goal: 1 },
            { move: "f8c5", turn: 'black', title: "Тракслер", text: "Гамбит безумия активирован!", icon: "⚠️", egoal: 1 },
            { move: "g5f7", turn: 'white', title: "Прорыв", text: "Рыцарь врывается в башню!", icon: "🍴", capture: true },
            { move: "c5f2", turn: 'black', title: "Взрыв", text: "Черный диверсант подрывает ворота!", icon: "💥", capture: true },
            { move: "e1f2", turn: 'white', title: "Казнь", text: "Монарх лично убивает диверсанта.", icon: "👑", capture: true },
            { move: "f6e4", turn: 'black', title: "Налет", text: "Черный Рыцарь в тронном зале!", icon: "🌩️", capture: true },
            { move: "f2g1", turn: 'white', title: "Тень", text: "Король прячется в углу.", icon: "🏃" },
            { move: "d8h4", turn: 'black', title: "Королева", text: "Черная Владычица обращает камень в пепел.", icon: "👸" },
            { move: "f7h8", turn: 'white', title: "Жадность", text: "Ваш Рыцарь грабит сокровищницу.", icon: "💎", capture: true },
            { move: "h4f2", turn: 'black', title: "Крах", text: "История Империи окончена.", icon: "💀", goal: 2, egoal: 2 }
        ]
    }

};
