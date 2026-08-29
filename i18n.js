/* ===================================================================
   i18n — переключение языка RU / EN для index.html и projects.html

   Как это работает:
     1. В HTML у элемента стоит метка: data-i18n="ключ".
     2. В словаре DICT ниже для этого ключа лежит текст на обоих языках.
     3. applyLang() проходит по всем меткам и подставляет нужный текст.

   Дополнительные атрибуты в HTML:
     data-i18n-attr="content"  — писать в указанный атрибут, а не в текст
     data-i18n-html            — значение содержит теги, вставлять как HTML

   Язык берётся из ?lang=en в адресе, иначе из localStorage, иначе русский.
   При смене языка на document летит событие "langchange" — на него
   подписаны canvas-анимации, которые рисуют текст сами.
   =================================================================== */
(function(){
  'use strict';

  var DEFAULT_LANG = 'ru';
  var STORAGE_KEY  = 'raincoat-lang';

  var DICT = {
    ru: {
    /* мета-теги */
    "meta.title": "Raincoat — Product Engineer",
    "meta.desc": "Product Engineer: превращаю идеи в работающие продукты — от первого прототипа до релиза. Web, AI-инструменты, desktop, автоматизация.",
    "meta.ogDesc": "Превращаю идеи в работающие продукты — от прототипа до релиза",

    /* навигация */
    "nav.about": "Обо мне",
    "nav.tools": "Инструменты",
    "nav.projects": "Проекты",
    "nav.products": "Продукты",
    "nav.experiments": "Эксперименты",
    "nav.hire": "Для команд",
    "nav.build": "Заказать MVP",
    "nav.blog": "Блог",
    "nav.contacts": "Контакты",

    /* первый экран */
    "hero.tagline": "Превращаю идеи в работающие продукты — от первого прототипа до релиза",
    "hero.sub": "Web-приложения, AI-инструменты, desktop-продукты и автоматизация. Самостоятельно закрываю продукт, интерфейс, разработку и запуск.",
    "hero.ctaProducts": "Работающие продукты",
    "hero.ctaHire": "Для команд",
    "hero.ctaBuild": "Обсудить MVP",
    "hero.cta": "Написать мне",
    "hero.scroll": "scroll",

    /* витрина продуктов */
    "products.label": "Продукты",
    "products.h2": "Работающие — можно потрогать",
    "badge.released": "Released",
    "badge.beta": "Beta",
    "badge.research": "Research",
    "link.try": "Потрогать",
    "link.store": "В каталоге",
    "link.code": "Код",
    "prod.agv.fact": "~3 000 установок · Obsidian community",
    "prod.agv.text": "Штатный граф Obsidian умирает на больших хранилищах. Собрал 3D-граф на WebGL и Web Workers: 10 000+ заметок, кластеры, семантические связи — без тормозов.",
    "prod.ce.fact": "400+ загрузок · v1.13",
    "prod.ce.text": "Навигация по vault через дерево — медленно. Сделал двухпанельный файл-менеджер в стиле Finder внутри Obsidian и довёл его через 13 публичных релизов.",
    "prod.pm.fact": "Desktop · локальные данные · MCP",
    "prod.pm.text": "Промпты расползаются по заметкам и чатам. Собрал desktop-менеджер промптов: всё хранится локально, а MCP-сервер отдаёт библиотеку прямо AI-агентам.",
    "prod.kaidzen.fact": "Multi-agent · research loop",
    "prod.kaidzen.text": "Сырая идея — ещё не продукт. Kaidzen полирует её фактами из веб-поиска через пайплайн агентов и эволюционирует собственные инструкции после каждого прогона.",
    "prod.iwh.fact": "Base mainnet · газ платит paymaster",
    "prod.iwh.text": "NFT-бейджи за посещение событий отпугивают: нужен кошелёк и ETH на газ. Сделал gasless-клейм: гость сканирует QR, входит по email и получает бейдж, не заплатив ни цента.",
    "prod.fs.fact": "macOS · Whisper on-device · приватно",
    "prod.fs.text": "Облачная диктовка платная и шлёт голос на сервер. Собрал локальную альтернативу: зажал клавишу — надиктовал — чистый текст у курсора. Whisper на устройстве + LLM-очистка.",
    "stats.plugins": "Obsidian-плагина в каталоге",
    "stats.downloads": "загрузок плагинов",
    "stats.repos": "открытых репозиториев",
    "stats.langs": "TypeScript / Python / Go / Solidity",

    /* эксперименты */
    "exp.label": "Лаборатория",
    "exp.h2": "Ещё эксперименты",
    "exp.iwashere": "Gasless NFT-бейджи в Base mainnet: QR → клейм, газ платит paymaster.",
    "exp.rabbitRun": "Эндлесс-раннер в Яндекс Играх: Three.js, 135 тестов. Ещё 8 игр на модерации.",
    "exp.floatplayer": "YouTube поверх всех окон: Chrome-расширение + свой лендинг.",
    "exp.flowspeech": "Локальная диктовка для macOS: Whisper на устройстве + LLM-очистка текста.",
    "exp.tgBridge": "Заметки в Obsidian прямо из Telegram. Ноль инфраструктуры.",
    "exp.sunburst": "Disk-usage диаграмма для vault: что раздувает хранилище.",
    "exp.vaultMirror": "16 отчётов-зеркал из твоих заметок. Просто промпты, agent-agnostic.",
    "exp.agentsBridge": "AI-агенты внутри Obsidian: мост между vault и LLM-воркфлоу.",
    "exp.web3tools": "Генератор vanity-адресов для EVM: CI, MIT, опубликованный пакет.",
    "exp.pmBtc": "Есть ли edge на 5-минутных ставках BTC? Честный ответ после walk-forward: нет. Деньги не потеряны.",
    "exp.pmWeather": "Ансамбль GFS против толпы на погодных рынках. Симуляция с тестами.",
    "exp.caspervpn": "DPI-устойчивый VPN: Go-монорепо из 6 сервисов, ядро sing-box, ADR-доки.",
    "exp.eyeRest": "Chrome-расширение: напоминания по правилу 20-20-20 для глаз.",
    "exp.ytOptimizer": "Пресеты ffmpeg + macOS droplet: сжатие видео перетаскиванием.",

    /* процесс */
    "process.label": "Процесс",
    "process.h2": "Как идея становится продуктом",
    "process.s1h": "Разбор задачи",
    "process.s1p": "Неясную идею превращаю в сценарии и продуктовую гипотезу. Фиксирую, что проверяем и что считается успехом.",
    "process.s2h": "Прототип",
    "process.s2p": "Кликабельный скелет за дни: UX, интерфейс, ключевой сценарий end-to-end. Смотрим на живое, а не на макет.",
    "process.s3h": "Итерации с тестами",
    "process.s3p": "Код, интеграции, AI — с тестами: 135 тестов в Rabbit Run, walk-forward валидация в торговых ботах.",
    "process.s4h": "Релиз",
    "process.s4p": "Публикация и передача: каталоги Obsidian и Chrome, Яндекс Игры, mainnet, docker compose одной командой.",

    /* два маршрута */
    "route.hireH": "Инженер в команду →",
    "route.hireP": "Ищете Product Engineer / Fullstack-разработчика, который самостоятельно доводит фичи до релиза? Опыт, стек и формат работы.",
    "route.hireA": "Для рекрутеров и команд",
    "route.buildH": "Заказать MVP →",
    "route.buildP": "Есть идея продукта? Соберу рабочий инструмент или сервис за 2–4 недели. Типы MVP, процесс и первый этап.",
    "route.buildA": "Для стартапов и бизнеса",

    /* архив (маркиза) */
    "archive.label": "Архив",
    "archive.h2": "И ещё 30+ проектов",

    /* страница /hire */
    "hire.meta.title": "Для команд — Raincoat, Product Engineer",
    "hire.meta.desc": "Product Engineer: опыт, стек и формат работы. Самостоятельно довожу продукты до релиза.",
    "hire.label": "Для рекрутеров и команд",
    "hire.h1": "Product Engineer, который доводит до релиза",
    "hire.lede": "Беру неструктурированную задачу и превращаю её в работающий релиз: уточняю сценарий, проектирую UX, пишу frontend и backend, добавляю тесты и выпускаю. Соло — без менеджера сверху.",
    "hire.whatH": "Что я закрываю",
    "hire.what1": "<strong>Продукт:</strong> гипотеза, сценарии, скоуп MVP, приоритеты.",
    "hire.what2": "<strong>Разработка:</strong> frontend, backend, базы данных, деплой.",
    "hire.what3": "<strong>AI-интеграции:</strong> LLM-пайплайны, агенты, RAG, MCP.",
    "hire.what4": "<strong>Выпуск:</strong> тесты, модерация в каталогах, релиз, поддержка.",
    "hire.stackH": "Стек",
    "hire.proofH": "Доказательства",
    "hire.proof1": "~3 000 установок, публичный каталог Obsidian",
    "hire.proof2": "13 публичных релизов одного продукта",
    "hire.proof3": "Игра в сторе: экономика, SDK, модерация, 135 тестов",
    "hire.proof4": "Контракт в Base mainnet, gasless UX",
    "hire.proof5": "18 открытых репозиториев, 4 языка",
    "hire.formatH": "Формат работы",
    "hire.format1": "Full-time / part-time, удалённо. Часовой пояс — GMT+4 (Тбилиси).",
    "hire.format2": "Языки: русский, английский.",
    "hire.format3": "Комфортнее всего там, где надо быстро проверять продуктовые гипотезы: стартапы, новые направления, внутренние инструменты.",
    "hire.ctaP": "Расскажите про команду и задачу — отвечу быстро.",

    /* страница /build */
    "build.meta.title": "Заказать MVP — Raincoat",
    "build.meta.desc": "Соберу рабочий AI-инструмент или сервис за 2–4 недели. Прототип за 5 дней. Процесс, типы MVP, первый этап.",
    "build.label": "Для стартапов и бизнеса",
    "build.h1": "Идея → работающий MVP",
    "build.lede": "Помогаю быстро проверять продуктовые идеи: собираю работающий инструмент, а не презентацию. Примеры того, что уже работает, — <a href=\"index.html#products\" style=\"color:var(--amber)\">на главной</a>.",
    "build.offersH": "Два формата",
    "build.offer1H": "Рабочий AI-инструмент или сервис",
    "build.offer1P": "Внутренний сервис, AI-ассистент, Telegram-бот, автоматизация процесса — до состояния, которым реально пользуются.",
    "build.offer1T": "Срок: 2–4 недели",
    "build.offer2H": "Интерактивный прототип",
    "build.offer2P": "Кликабельный прототип, который можно показать клиентам или инвесторам — до того, как вкладываться в большую разработку.",
    "build.offer2T": "Срок: 5 дней",
    "build.stageH": "Первый этап — отдельно",
    "build.stage1": "60–90 минут разбора задачи",
    "build.stage2": "Карта сценариев: что делает продукт и для кого",
    "build.stage3": "Интерактивный прототип ключевого сценария",
    "build.stage4": "Фиксированный план MVP",
    "build.stage5": "Оценка срока и стоимости",
    "build.stageP": "После первого этапа у вас есть план и прототип — даже если дальше строите с другой командой.",
    "build.typesH": "Что я собираю",
    "build.type1": "Web-приложения",
    "build.type2": "AI-инструменты и агенты",
    "build.type3": "Telegram-боты",
    "build.type4": "Desktop-утилиты",
    "build.type5": "Chrome-расширения",
    "build.type6": "Автоматизация процессов",
    "build.ctaP": "Опишите идею в двух абзацах — предложу формат и срок.",

    /* обо мне */
    "about.label": "Обо мне",
    "about.text": "Соло-предприниматель и инженер. Строю продукты на стыке <strong>видеопродакшна</strong>, <strong>ИИ-генерации контента</strong> и <strong>агентных систем</strong> — от плагинов Obsidian и десктоп-утилит до торговых ботов и контент-фабрик для YouTube. Принцип простой: идея не считается, пока не доехала до релиза — <strong>20+ проектов</strong> доведены до работающего состояния.",

    /* инструменты (в т.ч. подписи на зданиях в canvas) */
    "tools.label": "Инструменты",
    "tools.h2": "Город, в котором я работаю",
    "tools.cat.video": "ВИДЕО",
    "tools.cat.aicode": "AI-КОД",
    "tools.cat.aigen": "AI-ГЕН",
    "tools.cat.agents": "АГЕНТЫ/АВТО",

    /* проекты: заголовок и карточки маркизы */
    "projects.label": "Проекты",
    "projects.h2": "Отгружено и работает",
    "projects.cta": "Все кейсы: проблема → решение → стек → результат",
    "proj.iwashere": "Gasless proof-of-attendance NFT. Живёт в Base mainnet.",
    "proj.graphView": "Граф Obsidian: 10 000+ узлов при 50+ FPS.",
    "proj.receptionist": "AI-бот для бизнеса: RAG, заявки, handoff оператору.",
    "proj.mvm": "Audio-reactive визуализатор под управлением AI-агентов.",
    "proj.pmWeather": "Метеомодели против толпы на погодных рынках.",
    "proj.flowspeech": "Локальная диктовка для macOS: whisper + LLM-чистка текста.",
    "proj.timeslot": "Букинг-платформа внутри Telegram, без комиссий.",
    "proj.columnExplorer": "Файл-менеджер для Obsidian в стиле Finder.",
    "proj.wavHumanizer": "DSP-процессор: квантованное аудио звучит как живое.",
    "proj.ytPipeline": "Контент-фабрика: идеи → сценарии → промпты → метаданные.",
    "proj.soulos": "Изолированный AI-агент на каждого клиента бизнеса.",
    "proj.graphExplorer": "Заметки как галактика: игра, улучшающая реальный vault.",
    "proj.caspervpn": "DPI-устойчивый VPN: живучесть через разнообразие транспортов.",
    "proj.tgBridge": "Telegram → daily note Obsidian. Ноль инфраструктуры.",
    "proj.sunoHub": "Конструктор промптов для Suno с пакетной генерацией.",
    "proj.pmBtc": "Исследование edge на 5-минутных ставках BTC. Честный ответ: нет.",
    "proj.promptManager": "Менеджер промптов для macOS с MCP-сервером.",
    "proj.aiMusicChecker": "Детект AI-музыки прямо в браузере, без бэкенда.",
    "proj.vaultAgent": "LLM-воркфлоу в Obsidian с ревью каждого изменения.",
    "proj.vaultMirror": "16 отчётов-зеркал из твоих заметок. Просто промпты.",
    "proj.ytOptimizer": "Пресеты ffmpeg + macOS droplet для сжатия видео.",
    "proj.web3tools": "Генератор vanity-адресов для EVM-сетей.",
    "proj.hermesPack": "Каталог skill-паков для Hermes Agent.",
    "proj.thisSite": "Этот сайт: ноль зависимостей, два языка, canvas-сцены.",

    /* интересы и строки печатающегося терминала */
    "philo.label": "Интересы & философия",
    "philo.h2": "Чем живу вне кода",
    "philo.l1": "// stay calm. ship things.",
    "philo.l2": "// идея без релиза — просто мысль",
    "philo.l3": "// инструменты меняются, любопытство остаётся",
    "philo.l4": "// автоматизируй скучное — освободи время для странного",
    "philo.l5": "// меньше, но глубже",

    /* контакты и картинка с котом */
    "contacts.label": "Контакты",
    "contacts.h2": "Есть идея? Обсудим",
    "zen.alt": "Кот в дождевике медитирует под дождём",

    /* блог */
    "blog.meta.title": "Блог — Raincoat",
    "blog.meta.desc": "Эссе Raincoat: инструменты и агенты, созерцательная практика, проекты и релизы.",
    "blog.label": "Блог",
    "blog.h1": "Эссе",
    "blog.lede": "Тексты, которые пишутся медленно: инструменты и агенты, созерцательная практика, проекты и релизы.",
    "blog.backToList": "← ко всем эссе",
    "blog.empty": "// эссе скоро появятся",

    /* страница кейсов: обвязка */
    "projects.meta.title": "Проекты — Raincoat",
    "projects.meta.desc": "Кейсы Raincoat: проблема → решение → стек → результат. Продукты, плагины Obsidian, музыка и видео, трейдинг и web3.",
    "projects.back": "← на главную",
    "projects.backShort": "на главную",
    "projects.h1": "Кейсы",
    "projects.lede": "Каждый кейс — по одной схеме: <b>проблема → решение → стек → результат</b>. Всё собрано из реальных репозиториев, ничего выдуманного.",
    "filter.all": "Все",
    "filter.product": "Продукты",
    "filter.obsidian": "Obsidian",
    "filter.media": "Музыка и видео",
    "filter.trade": "Трейдинг и web3",
    "filter.tools": "Инструменты",
    "filter.statusAll": "все статусы",
    "status.live": "в проде",
    "status.wip": "в работе",
    "status.done": "готово",
    "projects.search": "Поиск: название, стек, описание…",
    "projects.shown": "Показано:",
    "projects.empty": "Ничего не найдено. Попробуй другой запрос или сбрось фильтры.",
    "stack.adrDocs": "ADR-документация",
    "stack.yamlConfigs": "YAML-конфиги",

    /* страница кейсов: сами кейсы */
    "case.iwashere.one": "Gasless proof-of-attendance NFT на Base — гость сканирует QR и получает бейдж, не платя за газ.",

    /* страница кейсов: общие подписи */
    "cell.problem": "Проблема",
    "case.iwashere.problem": "POAP-бейджи за посещение событий требуют от гостя кошелька с ETH и оплаты газа — 90% людей отваливаются на этом шаге.",
    "cell.solution": "Решение",
    "case.iwashere.solution": "ERC-1155 контракт + аккаунт-абстракция: гость входит по email (Base Account), подписывает клейм, а газ платит paymaster (ERC-4337 + EIP-5792). Бейджи накапливаются в уровни Bronze → Platinum.",
    "cell.result": "Результат",
    "case.iwashere.result": "<strong>Живёт в Base mainnet.</strong> Реальный бейдж заклеймлен end-to-end: пользователь заплатил 0 ETH, газ полностью спонсирован.",
    "case.pmBtc.one": "Исследовательский бот: есть ли edge против рынка на 5-минутных ставках BTC. Честный ответ: нет.",
    "case.pmBtc.problem": "Гипотеза: fair value по Binance-прокси опережает цены Polymarket на рынках «BTC вверх/вниз за 5 минут» — на этом можно зарабатывать.",
    "case.pmBtc.solution": "Shadow-бот: считает fair value, бумажно торгует с реалистичной моделью исполнения, логирует всё. Gated-система решений: momentum-фильтр, модель издержек, quality gates, walk-forward OOS. Деплой на VPS под systemd.",
    "case.pmBtc.result": "Исследование закрыто с доказательствами: <strong>у сигнала нет edge</strong> (Brier рынка 0.164 против 0.185 у модели; при расхождении рынок прав в 63.6%). Деньги не потеряны — бот не вышел из DRY_RUN.",
    "case.pmWeather.one": "Автономный бот на рынках дневной максимальной температуры: метеомодели против толпы.",
    "case.pmWeather.problem": "Погодные рынки Polymarket оценивает толпа «на глаз», а физическая величина предсказуема моделями — потенциальный source of edge.",
    "case.pmWeather.solution": "Две стратегии: (A) вероятности из 31-членного ансамбля GFS с поправкой на систематическую ошибку станции; (B) intraday-трекинг реального METAR-максимума — ставки на бакеты, исход которых уже почти определён.",
    "case.pmWeather.result": "Рабочий бот в режиме симуляции с тестами; live-торговля закрыта критериями приёмки и ручным флагом <strong>--live --confirm</strong>.",
    "case.web3tools.one": "Генератор EVM-кошельков и vanity-адресов: адрес, начинающийся с выбранного паттерна.",
    "case.web3tools.problem": "Красивый / узнаваемый адрес кошелька (0xCAFE…, 0xN23E…) нельзя выбрать — только перебрать миллионы ключей.",
    "case.web3tools.solution": "CLI-перебор с паттернами «начинается / заканчивается / содержит»; один адрес работает во всех EVM-сетях.",
    "case.web3tools.result": "Опубликованный пакет с CI-тестами на GitHub Actions, MIT.",
    "case.githubLink": "GitHub: открытый репозиторий",
    "case.pluginLink": "Obsidian: страница плагина",
    "case.siteLink": "Открыть проект",
    "case.receptionist.one": "AI-бот для малого бизнеса: отвечает клиентам по базе знаний, собирает заявки, передаёт оператору.",
    "case.receptionist.problem": "Малый бизнес теряет клиентов, потому что не успевает отвечать в мессенджерах: ночь, выходные, поток однотипных вопросов.",
    "case.receptionist.solution": "Бот в Telegram/WhatsApp с RAG по базе знаний бизнеса (pgvector), сбор заявок, запись на услуги и handoff сложных диалогов живому оператору. Дашборд для владельца.",
    "case.receptionist.result": "Этап 3 из ТЗ завершён: Telegram-бот работает — webhook, диалоги, автоответ по базе знаний, передача оператору. Разворачивается одной командой docker compose.",
    "case.timeslot.one": "Telegram-first букинг-платформа для нишевых сервисов: подписка, без комиссий.",
    "case.timeslot.problem": "Мастерам и небольшим студиям дорого жить на платформах с комиссией с каждой записи, а собственный сайт с записью — избыточен.",
    "case.timeslot.solution": "Вся запись — в Telegram: онбординг владельца через state machine, deep-link для клиентов, гонки за слот решает EXCLUDE-констрейнт в БД, надёжные уведомления — через transactional outbox, напоминания за 24 ч и 2 ч.",
    "case.timeslot.result": "Спринты 0–4 закрыты: онбординг, запись клиента, кабинет владельца с agenda и ручной записью, напоминания с ретраями и идемпотентностью.",
    "case.soulos.one": "AI-операционка для бизнеса: изолированный агент-инстанс на каждого клиента, управление из Telegram.",
    "case.soulos.problem": "Дать бизнесу AI-агента с доступом к его данным страшно: одна ошибка записи — и испорчена реальная база клиента.",
    "case.soulos.solution": "Форк Hermes Agent «тонким overlay»: весь код в своём пакете, правки ядра помечены. Пять инвариантов выживания, главный — write safety: запись только через dry-run → diff → бэкап → подтверждение. Business Brain знает архитектуру бизнеса клиента.",
    "case.soulos.result": "Рабочая архитектура, готовится distribution: .env.template для развёртывания клиентских инстансов.",
    "case.caspervpn.one": "VPN-сервис, устойчивый к DPI-блокировкам: живучесть через разнообразие транспортов, а не «шифрование посильнее».",
    "case.caspervpn.problem": "Одиночные VPN-протоколы блокируются DPI-системами класса ТСПУ целиком — нужна система, которая переключается, а не один «неубиваемый» туннель.",
    "case.caspervpn.solution": "Ядро sing-box на всех нодах, несколько транспортов одновременно (VLESS-REALITY / Hysteria2 / AmneziaWG), клиент переключается сам; свои приложения не пишем — внешние клиенты через per-user subscription URL. Архитектура задокументирована через ADR.",
    "case.caspervpn.result": "Go-монорепо из 6 сервисов с общими контрактами, сборка и тесты одной командой make.",
    "case.flowspeech.one": "Локальная альтернатива Wispr Flow для macOS: зажал клавишу — надиктовал — чистый текст у курсора.",
    "case.flowspeech.problem": "Диктовка быстрее набора, но облачные сервисы платные и шлют голос на сервер, а сырой транскрипт полон «эээ» и оговорок.",
    "case.flowspeech.solution": "Распознавание локально (faster-whisper, без интернета), чистка текста через LLM на выбор (Claude / OpenAI / DeepSeek / Ollama) прямо из menu bar. Live-волна на экране, личный словарь, статистика WPM по приложениям.",
    "case.flowspeech.result": "Настоящее FlowSpeech.app со своей иконкой и автозапуском; два режима — push-to-talk и toggle.",
    "case.floatplayer.one": "Мини-плеер YouTube поверх всех окон: смотришь видео и Shorts, пока работаешь в других приложениях.",
    "case.floatplayer.problem": "Нативный PiP Chrome — картинка без управления, а popup-расширения открывают второй плеер: воспроизведение сбрасывается, теряются аккаунт и качество.",
    "case.floatplayer.solution": "Document Picture-in-Picture (Manifest V3): в окно поверх всех окон переезжает настоящий плеер YouTube — без перезапуска, с историей, качеством и субтитрами. Свой интерфейс: скорость 0.25–3x, громкость до 300% (Web Audio), A-B-петля, таймер сна, комментарии и live-чат в боковой колонке, SponsorBlock, Shorts с автопереходом и поиском по ключевому слову.",
    "case.floatplayer.result": "<strong>Опубликовано в Chrome Web Store.</strong> Единственное из расширений с always-on-top окном, полным управлением и Shorts-режимом одновременно.",
    "case.storeLink": "Chrome Web Store: страница расширения",
    "case.graphView.one": "Граф Obsidian для больших vault (5–50 тыс. заметок): из «комка волос» — в инструмент анализа.",
    "case.graphView.problem": "Штатный граф Obsidian на большом vault превращается в бесполезный клубок: всё видно и ничего не понятно.",
    "case.graphView.solution": "WebGL-рендер на Pixi.js, физика в Web Worker. Любая метрика — в размер/цвет/свечение узла: PageRank, частота открытий, свежесть правок. Louvain-кластеры с автоименованием по TF-IDF, оверлеи сирот и битых ссылок, свои операторы поиска (opened:>10, links:0…).",
    "case.graphView.result": "<strong>10 000+ узлов при 50+ FPS.</strong> Работает на реальном vault в 9 тыс. заметок; демо-видео в репозитории.",
    "case.columnExplorer.one": "Файл-менеджер для Obsidian в стиле Finder: Miller columns, drag & drop, календарь заметок.",
    "case.columnExplorer.problem": "Стандартное дерево файлов Obsidian неудобно для глубоких структур: постоянное разворачивание-сворачивание, нет обзора пути.",
    "case.columnExplorer.solution": "Колонки как в Finder: клик по папке открывает содержимое справа. Полный файл-менеджер: создание, переименование, multi-select, контекстные меню, цвета папок; виртуальные ряды Recents, закладок и календарь с числом созданных заметок по дням.",
    "case.columnExplorer.result": "Полноценный плагин с документацией, скриншотами и тестовым покрытием.",
    "case.tgBridge.one": "Написал себе в Telegram — заметка сама появилась в daily note Obsidian. Без сервера.",
    "case.tgBridge.problem": "Мысли приходят на прогулке, а vault — на компьютере. Существующие мосты требуют VPS, Docker или платных сервисов.",
    "case.tgBridge.solution": "Плагин сам опрашивает Telegram-бота при открытии Obsidian: текст с форматированием приходит как Markdown, фото/голосовые/файлы сохраняются в attachments и встраиваются, хэштеги маршрутизируют по тематическим заметкам.",
    "case.tgBridge.result": "Ноль инфраструктуры: без сервера, VPS и Docker; работает на десктопе и мобильном.",
    "case.graphExplorer.one": "Граф заметок как галактика: летаешь на звездолёте, а каждая игровая награда реально улучшает vault.",
    "case.graphExplorer.problem": "Наводить порядок в заметках скучно: сироты копятся, старое знание не повторяется, ссылки не строятся.",
    "case.graphExplorer.solution": "Игра поверх реального графа: заметки — планеты, wikilinks — гиперворота. Экономика тянет игрока в «Туманность Сирот», повторение знаний — spaced repetition (SM-2) через «майнинг», постройка гиперворот физически вписывает ссылку в md-файл. Граф игры всегда равен реальному графу vault.",
    "case.graphExplorer.result": "Играбельный плагин: каждое игровое действие оставляет vault лучше, чем было.",
    "case.vaultAgent.one": "Агентские LLM-воркфлоу прямо внутри Obsidian: по расписанию, по событиям, с ревью каждого изменения.",
    "case.vaultAgent.problem": "Хочется, чтобы агент разбирал inbox и наводил порядок в волте сам — но без риска, что LLM молча перепишет заметки.",
    "case.vaultAgent.solution": "Воркфлоу описываются обычными markdown-заметками, запускаются по cron / событиям файлов / вручную. Всё через очередь ревью с diff-просмотром; три режима прав read-only → write-draft → auto-write. Полный трейс каждого запуска: что прочитал, какие инструменты, сколько токенов.",
    "case.vaultAgent.result": "Local-first: работает без сервера, LLM на выбор — Anthropic / OpenAI / Ollama (офлайн).",
    "case.vaultMirror.one": "Твои заметки уже знают, кто ты. Это заставляет их рассказать: 16 отчётов-зеркал из твоего vault.",
    "case.vaultMirror.problem": "Свои паттерны изнутри не видны, хотя годами лежат в заметках открытым текстом. Другу нужны годы, чтобы всё это прочитать.",
    "case.vaultMirror.solution": "Папка промптов рядом с заметками: любому агенту с доступом к файлам говоришь «читай 00-start.md и начинай» — и получаешь 16 отчётов с доказательствами: как думаешь, что ценишь vs что делаешь, почему умирают проекты, 30-дневный план под твои реальные паттерны срывов. Каждое утверждение подкреплено цитатой из заметки.",
    "case.vaultMirror.result": "Ноль кода, ноль зависимостей, ноль телеметрии — это просто промпты. Работает с Claude Code, Cursor, Codex.",
    "case.mvm.one": "Audio-reactive визуализатор, которым управляют AI-агенты: «сделай визуал под этот трек» → готовое видео.",
    "case.mvm.problem": "Визуал под музыку — это часы ручной работы в After Effects на каждый трек, а генераторы «one-click» не дают контроля.",
    "case.mvm.solution": "Пайплайн: аудио → per-frame фичи (свой FFT, стриминг) → 8 сцен на React/Three.js → рендер через Remotion с прозрачным фоном (ProRes 4444) для композитинга в Final Cut. Сегментированный резюмируемый рендер длинных треков, MCP-сервер — визуализатором управляет агент.",
    "case.mvm.result": "<strong>v1.0, все фазы 0–6 закрыты</strong>: тесты на детерминизм, golden frames, BPM и MCP-контракт.",
    "case.wavHumanizer.one": "DSP-процессор, который заставляет квантованное аудио звучать как живое исполнение.",
    "case.wavHumanizer.problem": "Сгенерированная и жёстко квантованная музыка звучит механически: идеальный ритм и одинаковая динамика выдают машину.",
    "case.wavHumanizer.solution": "Пайплайн Analyzer → HumanizationEngine → EffectsChain: детект темпа и фраз, transient-aware микросдвиги тайминга, контекстная вариация velocity, «усталость» к концу фразы, дрейф питча, аналоговое тепло. JSON-отчёт о каждом преобразовании.",
    "case.wavHumanizer.result": "CLI с батч-обработкой, 24-bit WAV на выходе, smoke-тесты.",
    "case.sunoHub.one": "Блочный конструктор промптов для Suno: собери стиль, крути слот-машину тегов, генерируй пачками.",
    "case.sunoHub.problem": "Хорошие промпты для Suno — это комбинаторика из десятков тегов; вручную перебирать варианты медленно и без системы.",
    "case.sunoHub.solution": "Блоки тем (жанр, атмосфера, ритм, приёмы…) с реролл/слот-машиной и локом блоков, пакетная генерация до 200 промптов, «эволюция» — скрещивание и мутация пресетов, коллекция карточек с редкостью common → legendary, улучшение через LLM.",
    "case.sunoHub.result": "Открыл index.html — работает: без сборки, зависимостей и сервера. 7 спринтов фич.",
    "case.ytPipeline.one": "Контент-фабрика для YouTube-каналов: идеи, сценарии, промпты для Suno/Midjourney/Runway, метаданные.",
    "case.ytPipeline.problem": "Несколько каналов = конвейер однотипной работы: придумать, расписать, сгенерировать ассеты, оформить метаданные — на каждое видео.",
    "case.ytPipeline.solution": "Пайплайн с профилями каналов в YAML: анализ ниши → идеи → сценарии → промпты для ИИ-генерации → метаданные и Shorts → редакторская оценка. Два режима оплаты: через подписку Claude (CLI) или API-ключ.",
    "case.ytPipeline.result": "Рабочее приложение + macOS .app, тесты, конфиги на 4 канала.",
    "case.aiMusicChecker.one": "Проверка mp3/wav на признаки AI-генерации — целиком в браузере, файлы никуда не уходят.",
    "case.aiMusicChecker.problem": "Нужно быстро понять, сгенерирован ли трек (Suno и т.п.), не отправляя аудио на чужие серверы.",
    "case.aiMusicChecker.solution": "Анализ через Web Audio API: следы в метаданных, crest factor и компрессия, стабильность спектрального центра, повторяемость секундных паттернов, стерео-корреляция.",
    "case.aiMusicChecker.result": "Один index.html: перетащил файл — получил вердикт. Ноль бэкенда.",
    "case.ytOptimizer.one": "Сжатие видео для загрузки на YouTube: пресеты ffmpeg + macOS droplet «перетащил — готово».",
    "case.ytOptimizer.problem": "Исходники видео весят гигабайты, а флаги ffmpeg каждый раз гуглятся заново.",
    "case.ytOptimizer.solution": "Тонкая обёртка над ffmpeg с выверенными пресетами (720/1080/480, CRF) + AppleScript-droplet: перетащил файл на иконку — получил сжатый. Внутри — Claude-skill для агентов.",
    "case.ytOptimizer.result": "Опубликован с лицензией и агент-гайдом; используется в собственном YouTube-пайплайне.",
    "case.promptManager.one": "Менеджер промптов для macOS: menu bar, Spotlight-палитра, шаблоны с переменными и MCP-сервер.",
    "case.promptManager.problem": "Рабочие промпты разбросаны по заметкам и чатам; ни быстрого доступа, ни переменных, ни доступа для агентов.",
    "case.promptManager.solution": "Приложение в menu bar со Spotlight-style палитрой, тегами, избранным и {{variable}}-шаблонами. Плюс MCP-сервер: Claude и другие агенты ищут и используют твои промпты напрямую.",
    "case.promptManager.result": "Собирается в standalone .app одним скриптом.",
    "case.hermesPack.one": "Коммерческий каталог outcome-ориентированных skill-паков для Hermes Agent: MVP с проверкой спроса.",
    "case.hermesPack.problem": "Отдельные SKILL.md-файлы никто не покупает; ценность — в протестированных воркфлоу с онбордингом, диагностикой и обновлениями совместимости.",
    "case.hermesPack.solution": "Evidence-driven MVP: сначала фаза 0 — валидация спроса, платный пак за гейтом. Бесплатные скиллы публикуются в отдельный публичный tap-репозиторий через allowlist-бандл; факты о Hermes пинятся к конкретной версии.",
    "case.hermesPack.result": "Инфраструктура каталога: сайт, формат пакетов, threat model, стратегия тестирования.",
    "case.liquidGlass.one": "Минималистичная glass-тема для Obsidian: одна сильная идея вместо тысяч строк CSS.",
    "case.liquidGlass.problem": "Популярные темы Obsidian разрастаются в тысячи строк переопределений: эффектно на скриншоте, но шумно после трёх часов письма и ломается с каждым обновлением приложения.",
    "case.liquidGlass.solution": "Форк Blue Topaz, переписанный от критерия успеха: всё на нативных CSS-переменных Obsidian, центр темы — контраст текста и спокойные поверхности, а не blur ради blur. Антицели прописаны в плане до первой строки кода.",
    "case.liquidGlass.result": "Тема + сниппеты и демо-vault (TIPS) для проверки на реальных заметках.",
    "case.prizeScout.one": "Автономный скаут акций и розыгрышей: собирает, отсеивает мусор через Claude и шлёт дайджест в Telegram.",
    "case.prizeScout.problem": "Конкурсы и акции разбросаны по сайтам, RSS и каналам; вручную это часы просмотра, а среди находок половина — скам или уже закончилось.",
    "case.prizeScout.solution": "Пайплайн fetch → dedupe → insert → score → finalize: источники настраиваются в конфиге, дубликаты отсекаются, Claude API оценивает релевантность и безопасность. SQLite на Railway-волюме, express-эндпоинт /digest, n8n превращает его в ежедневное сообщение в Telegram.",
    "case.prizeScout.result": "Репозиторий управляется агентом: <strong>npm run verify</strong> (doctor + тесты + offline-smoke) — один гейт, exit 0 значит «работает». Есть Hermes-скилл для операций и деплой на Railway.",
    "case.claudePrompts.one": "Система, которая промптит сама себя: библиотека, которая растёт от использования, а не пишется заново.",
    "case.claudePrompts.problem": "Каждый раз писать промпт с нуля — это терять и контекст, и удачные формулировки. Хорошие промпты оседают в чатах и больше не находятся.",
    "case.claudePrompts.solution": "Четыре части вместо ручного труда: CLAUDE.md как постоянный контекст папки, skill prompt-generator (собирает полный промпт по короткому описанию задачи), context/ со стабильными блоками под prompt cache и prompts/ — библиотека, куда сохраняется каждый удачный промпт.",
    "case.claudePrompts.result": "Подключается глобально копированием скилла в ~/.claude/skills — обратимо, без зависимостей.",
    "case.bunnyRunner.one": "Эндлесс-раннер для Яндекс Игр на Three.js: заяц, красный куб и полный чек-лист модерации.",
    "case.bunnyRunner.problem": "Игру на платформу мало написать — её заворачивают на модерации: SDK-вызовы без фолбэков, реклама не в тех местах, сейвы, которые ломаются при обновлении, отсутствие локализации.",
    "case.bunnyRunner.solution": "Чистый JS без фреймворков: Three.js на визуал, Howler на звук, мета-слой из монет, скинов, питомцев, миссий и daily-бонуса. Каждый вызов Yandex Games SDK — в try/catch с mock-режимом, так что игра целиком работает и без авторизации; версионированная схема сейвов, ru/en-словари проверяются тестом.",
    "case.bunnyRunner.result": "Собранные билды v1.0.0 и v1.0.1 под требования площадки (~1.6 МБ), <strong>135 тестов</strong> на vitest, чек-лист модерации закрыт по пунктам.",
    "case.socialDeduction.one": "Вертикальный портал по играм на социальную дедукцию: подбор под компанию, а не очередная база данных.",
    "case.socialDeduction.problem": "Выбор игры для конкретной компании (сколько людей, сколько времени, насколько злая механика) сводится к перебору обзоров — общие каталоги на этот вопрос не отвечают.",
    "case.socialDeduction.solution": "Static-first Next.js (App Router) + TypeScript: каталог, finder-рекомендатор на первом экране, SEO-гайды в MDX и страницы сравнений. Данные игр — типизированные JSON/YAML без базы и аккаунтов, все контент-файлы валидируются схемами Zod на этапе сборки, поэтому битую мету нельзя задеплоить.",
    "case.socialDeduction.result": "Проект ведётся агентом по CLAUDE_DESIGN.md как единому источнику правды; на момент последней сверки — Cycle 11, контент EN + RU.",
    "case.protocol.one": "Интерактивный стол для мафии: ведёт живую партию и тренирует дедукцию на задачах.",
    "case.protocol.problem": "За столом всё держится на памяти ведущего и игроков: кто как голосовал, кто кого проверял, какие связи всплывали. Тренироваться в дедукции между партиями вообще негде.",
    "case.protocol.solution": "Два режима в одном приложении: трекер живой партии (голоса, роли, проверки, связи, доверие, заметки и аргументы) и режим задач, где по готовому протоколу нужно вычислить трёх мафиози.",
    "case.protocol.result": "Работает без сборки и без сервера, данные остаются в браузере — открыл файл и играешь.",
    "case.procrastSim.one": "Браузерная игра про то, как не сделать задачу. Маленькая, законченная, выложенная.",
    "case.procrastSim.problem": "Большие проекты умирают на середине. Нужен формат, который проверяет идею целиком: от механики до релиза, но за считанные дни.",
    "case.procrastSim.solution": "Next.js 14 + Tailwind, вся игра — на клиенте, без бэкенда и аккаунтов. Тесты на vitest, деплой статикой.",
    "case.procrastSim.result": "Доведено до конца и опубликовано — редкий и потому ценный статус «готово».",
    "proj.floatPlayer": "FloatPlayer: YouTube в окне поверх всех окон (Manifest V3).",
    "proj.prizeScout": "Скаут акций и розыгрышей: Claude-скоринг, дайджест в Telegram.",
    "proj.bunnyRunner": "Эндлесс-раннер для Яндекс Игр: Three.js, 135 тестов.",
    "proj.claudePrompts": "Система, которая сама собирает промпты из шаблонов.",
    "proj.socialDeduction": "Портал по играм на социальную дедукцию: Next.js, Zod-валидация контента.",
    "proj.protocol": "«Протокол»: интерактивный стол для мафии + тренажёр дедукции.",
    "proj.liquidGlass": "Liquid Glass: минималистичная тема для Obsidian.",
    },

    /* ================= ENGLISH ================= */
    en: {
    /* мета-теги */
    "meta.title": "Raincoat — Product Engineer",
    "meta.desc": "Product Engineer: I turn ideas into shipped products — from first prototype to release. Web apps, AI tools, desktop, automation.",
    "meta.ogDesc": "I turn ideas into shipped products — from prototype to release",

    /* навигация */
    "nav.about": "About",
    "nav.tools": "Tools",
    "nav.projects": "Projects",
    "nav.products": "Products",
    "nav.experiments": "Experiments",
    "nav.hire": "For teams",
    "nav.build": "Build an MVP",
    "nav.blog": "Blog",
    "nav.contacts": "Contacts",

    /* первый экран */
    "hero.tagline": "I turn ideas into shipped products — from first prototype to release",
    "hero.sub": "Web apps, AI tools, desktop products and automation. I cover product, UX, engineering and launch on my own.",
    "hero.ctaProducts": "See working products",
    "hero.ctaHire": "For teams",
    "hero.ctaBuild": "Discuss an MVP",
    "hero.cta": "Get in touch",
    "hero.scroll": "scroll",

    /* витрина продуктов */
    "products.label": "Products",
    "products.h2": "Working — go try them",
    "badge.released": "Released",
    "badge.beta": "Beta",
    "badge.research": "Research",
    "link.try": "Try it",
    "link.store": "In catalog",
    "link.code": "Code",
    "prod.agv.fact": "~3,000 installs · Obsidian community",
    "prod.agv.text": "Obsidian's built-in graph dies on large vaults. I built a 3D graph on WebGL and Web Workers: 10,000+ notes, clusters, semantic links — no lag.",
    "prod.ce.fact": "400+ downloads · v1.13",
    "prod.ce.text": "Navigating a vault through a tree is slow. I made a Finder-style two-pane file manager inside Obsidian and shipped it through 13 public releases.",
    "prod.pm.fact": "Desktop · local data · MCP",
    "prod.pm.text": "Prompts scatter across notes and chats. I built a desktop prompt manager: everything stays local, and an MCP server feeds the library straight to AI agents.",
    "prod.kaidzen.fact": "Multi-agent · research loop",
    "prod.kaidzen.text": "A raw idea isn't a product yet. Kaidzen polishes it with facts from web search through an agent pipeline — and evolves its own instructions after every run.",
    "prod.iwh.fact": "Base mainnet · paymaster covers gas",
    "prod.iwh.text": "Event attendance NFTs scare people off: you need a wallet and ETH for gas. I built a gasless claim: a guest scans a QR, signs in with email and gets a badge without paying a cent.",
    "prod.fs.fact": "macOS · on-device Whisper · private",
    "prod.fs.text": "Cloud dictation costs money and sends your voice to a server. I built a local alternative: hold a key — dictate — clean text at your cursor. On-device Whisper + LLM cleanup.",
    "stats.plugins": "Obsidian plugins in catalog",
    "stats.downloads": "plugin downloads",
    "stats.repos": "public repositories",
    "stats.langs": "TypeScript / Python / Go / Solidity",

    /* эксперименты */
    "exp.label": "Lab",
    "exp.h2": "More experiments",
    "exp.iwashere": "Gasless NFT badges on Base mainnet: QR → claim, paymaster covers gas.",
    "exp.rabbitRun": "Endless runner on Yandex Games: Three.js, 135 tests. 8 more games in review.",
    "exp.floatplayer": "YouTube on top of every window: Chrome extension + its own landing page.",
    "exp.flowspeech": "Local dictation for macOS: on-device Whisper + LLM text cleanup.",
    "exp.tgBridge": "Obsidian notes straight from Telegram. Zero infrastructure.",
    "exp.sunburst": "Disk-usage sunburst for your vault: see what bloats it.",
    "exp.vaultMirror": "16 mirror reports from your notes. Just prompts, agent-agnostic.",
    "exp.agentsBridge": "AI agents inside Obsidian: a bridge between vault and LLM workflows.",
    "exp.web3tools": "Vanity address generator for EVM: CI, MIT, published package.",
    "exp.pmBtc": "Is there edge in 5-minute BTC bets? Honest answer after walk-forward: no. No money lost.",
    "exp.pmWeather": "GFS ensemble against the crowd on weather markets. Simulation with tests.",
    "exp.caspervpn": "DPI-resistant VPN: Go monorepo of 6 services, sing-box core, ADR docs.",
    "exp.eyeRest": "Chrome extension: 20-20-20 rule reminders for your eyes.",
    "exp.ytOptimizer": "ffmpeg presets + macOS droplet: compress video by drag-and-drop.",

    /* процесс */
    "process.label": "Process",
    "process.h2": "How an idea becomes a product",
    "process.s1h": "Framing",
    "process.s1p": "I turn a vague idea into scenarios and a product hypothesis. We fix what we're testing and what counts as success.",
    "process.s2h": "Prototype",
    "process.s2p": "A clickable skeleton in days: UX, interface, the key scenario end-to-end. We look at something live, not a mockup.",
    "process.s3h": "Iterations with tests",
    "process.s3p": "Code, integrations, AI — with tests: 135 tests in Rabbit Run, walk-forward validation in trading bots.",
    "process.s4h": "Release",
    "process.s4p": "Publish and hand over: Obsidian and Chrome catalogs, Yandex Games, mainnet, docker compose in one command.",

    /* два маршрута */
    "route.hireH": "An engineer for your team →",
    "route.hireP": "Looking for a Product Engineer / fullstack developer who ships features to release on his own? Experience, stack and work format.",
    "route.hireA": "For recruiters and teams",
    "route.buildH": "Build an MVP →",
    "route.buildP": "Have a product idea? I'll build a working tool or service in 2–4 weeks. MVP types, process and the first stage.",
    "route.buildA": "For startups and businesses",

    /* архив (маркиза) */
    "archive.label": "Archive",
    "archive.h2": "And 30+ more projects",

    /* страница /hire */
    "hire.meta.title": "For teams — Raincoat, Product Engineer",
    "hire.meta.desc": "Product Engineer: experience, stack and work format. I ship products to release on my own.",
    "hire.label": "For recruiters and teams",
    "hire.h1": "A Product Engineer who ships to release",
    "hire.lede": "I take an unstructured task and turn it into a working release: clarify the scenario, design the UX, write the frontend and backend, add tests and ship. Solo — no manager needed on top.",
    "hire.whatH": "What I cover",
    "hire.what1": "<strong>Product:</strong> hypothesis, scenarios, MVP scope, priorities.",
    "hire.what2": "<strong>Engineering:</strong> frontend, backend, databases, deployment.",
    "hire.what3": "<strong>AI integrations:</strong> LLM pipelines, agents, RAG, MCP.",
    "hire.what4": "<strong>Shipping:</strong> tests, catalog moderation, release, support.",
    "hire.stackH": "Stack",
    "hire.proofH": "Proof",
    "hire.proof1": "~3,000 installs, public Obsidian catalog",
    "hire.proof2": "13 public releases of a single product",
    "hire.proof3": "A game in the store: economy, SDK, moderation, 135 tests",
    "hire.proof4": "Contract on Base mainnet, gasless UX",
    "hire.proof5": "18 public repositories, 4 languages",
    "hire.formatH": "Work format",
    "hire.format1": "Full-time / part-time, remote. Time zone — GMT+4 (Tbilisi).",
    "hire.format2": "Languages: Russian, English.",
    "hire.format3": "I do my best work where product hypotheses need fast validation: startups, new directions, internal tools.",
    "hire.ctaP": "Tell me about the team and the task — I reply quickly.",

    /* страница /build */
    "build.meta.title": "Build an MVP — Raincoat",
    "build.meta.desc": "I'll build a working AI tool or service in 2–4 weeks. A prototype in 5 days. Process, MVP types, first stage.",
    "build.label": "For startups and businesses",
    "build.h1": "Idea → working MVP",
    "build.lede": "I help teams validate product ideas fast: I build a working tool, not a slide deck. Examples of what already works are <a href=\"index.html#products\" style=\"color:var(--amber)\">on the main page</a>.",
    "build.offersH": "Two formats",
    "build.offer1H": "A working AI tool or service",
    "build.offer1P": "An internal service, AI assistant, Telegram bot or process automation — to the point where people actually use it.",
    "build.offer1T": "Timeline: 2–4 weeks",
    "build.offer2H": "An interactive prototype",
    "build.offer2P": "A clickable prototype you can show to clients or investors — before committing to full development.",
    "build.offer2T": "Timeline: 5 days",
    "build.stageH": "The first stage — sold separately",
    "build.stage1": "A 60–90 minute working session",
    "build.stage2": "A scenario map: what the product does and for whom",
    "build.stage3": "An interactive prototype of the key scenario",
    "build.stage4": "A fixed MVP plan",
    "build.stage5": "A time and cost estimate",
    "build.stageP": "After the first stage you have a plan and a prototype — even if you build the rest with another team.",
    "build.typesH": "What I build",
    "build.type1": "Web apps",
    "build.type2": "AI tools and agents",
    "build.type3": "Telegram bots",
    "build.type4": "Desktop utilities",
    "build.type5": "Chrome extensions",
    "build.type6": "Process automation",
    "build.ctaP": "Describe your idea in two paragraphs — I'll suggest a format and a timeline.",

    /* обо мне */
    "about.label": "About",
    "about.text": "Solo entrepreneur and engineer. I build products at the intersection of <strong>video production</strong>, <strong>AI content generation</strong> and <strong>agentic systems</strong> — from Obsidian plugins and desktop utilities to trading bots and YouTube content factories. One simple rule: an idea doesn't count until it ships — <strong>20+ projects</strong> brought to a working state.",

    /* инструменты (в т.ч. подписи на зданиях в canvas) */
    "tools.label": "Tools",
    "tools.h2": "The city I work in",
    "tools.cat.video": "VIDEO",
    "tools.cat.aicode": "AI-CODE",
    "tools.cat.aigen": "AI-GEN",
    "tools.cat.agents": "AGENTS/AUTO",

    /* проекты: заголовок и карточки маркизы */
    "projects.label": "Projects",
    "projects.h2": "Shipped and running",
    "projects.cta": "All case studies: problem → solution → stack → result",
    "proj.iwashere": "Gasless proof-of-attendance NFT. Live on Base mainnet.",
    "proj.graphView": "Obsidian graph: 10,000+ nodes at 50+ FPS.",
    "proj.receptionist": "AI bot for business: RAG, lead capture, operator handoff.",
    "proj.mvm": "Audio-reactive visualizer driven by AI agents.",
    "proj.pmWeather": "Weather models against the crowd on prediction markets.",
    "proj.flowspeech": "Local dictation for macOS: whisper + LLM cleanup.",
    "proj.timeslot": "Booking platform inside Telegram, no fees.",
    "proj.columnExplorer": "Finder-style file manager for Obsidian.",
    "proj.wavHumanizer": "DSP processor: quantized audio sounds alive.",
    "proj.ytPipeline": "Content factory: ideas → scripts → prompts → metadata.",
    "proj.soulos": "An isolated AI agent per business client.",
    "proj.graphExplorer": "Notes as a galaxy: a game that improves the real vault.",
    "proj.caspervpn": "DPI-resistant VPN: survival through transport diversity.",
    "proj.tgBridge": "Telegram → Obsidian daily note. Zero infrastructure.",
    "proj.sunoHub": "Prompt builder for Suno with batch generation.",
    "proj.pmBtc": "Edge research on 5-minute BTC bets. Honest answer: no.",
    "proj.promptManager": "Prompt manager for macOS with an MCP server.",
    "proj.aiMusicChecker": "AI music detection right in the browser, no backend.",
    "proj.vaultAgent": "LLM workflows in Obsidian with review of every change.",
    "proj.vaultMirror": "16 mirror reports from your notes. Just prompts.",
    "proj.ytOptimizer": "ffmpeg presets + a macOS droplet for video compression.",
    "proj.web3tools": "Vanity address generator for EVM networks.",
    "proj.hermesPack": "A catalog of skill packs for Hermes Agent.",
    "proj.thisSite": "This site: zero dependencies, two languages, canvas scenes.",

    /* интересы и строки печатающегося терминала */
    "philo.label": "Interests & philosophy",
    "philo.h2": "Life beyond code",
    "philo.l1": "// stay calm. ship things.",
    "philo.l2": "// an idea without a release is just a thought",
    "philo.l3": "// tools change, curiosity stays",
    "philo.l4": "// automate the boring — free up time for the strange",
    "philo.l5": "// less, but deeper",

    /* контакты и картинка с котом */
    "contacts.label": "Contacts",
    "contacts.h2": "Got an idea? Let's talk",
    "zen.alt": "A cat in a raincoat meditating in the rain",

    /* блог */
    "blog.meta.title": "Blog — Raincoat",
    "blog.meta.desc": "Raincoat essays: tools and agents, contemplative practice, projects and releases.",
    "blog.label": "Blog",
    "blog.h1": "Essays",
    "blog.lede": "Texts that are written slowly: tools and agents, contemplative practice, projects and releases.",
    "blog.backToList": "← all essays",
    "blog.empty": "// essays coming soon",

    /* страница кейсов: обвязка */
    "projects.meta.title": "Projects — Raincoat",
    "projects.meta.desc": "Raincoat case studies: problem → solution → stack → result. Products, Obsidian plugins, music and video, trading and web3.",
    "projects.back": "← back home",
    "projects.backShort": "back home",
    "projects.h1": "Case studies",
    "projects.lede": "Every case follows the same scheme: <b>problem → solution → stack → result</b>. All of it comes from real repositories, nothing invented.",
    "filter.all": "All",
    "filter.product": "Products",
    "filter.obsidian": "Obsidian",
    "filter.media": "Music & video",
    "filter.trade": "Trading & web3",
    "filter.tools": "Tools",
    "filter.statusAll": "all statuses",
    "status.live": "live",
    "status.wip": "in progress",
    "status.done": "done",
    "projects.search": "Search: name, stack, description…",
    "projects.shown": "Shown:",
    "projects.empty": "Nothing found. Try another query or reset the filters.",
    "stack.adrDocs": "ADR docs",
    "stack.yamlConfigs": "YAML configs",

    /* страница кейсов: общие подписи */
    "cell.problem": "Problem",
    "cell.solution": "Solution",
    "cell.result": "Result",
    "case.githubLink": "GitHub: open repository",
    "case.pluginLink": "Obsidian: plugin page",
    "case.siteLink": "Open the project",

    /* страница кейсов: сами кейсы */
    "case.iwashere.one": "Gasless proof-of-attendance NFT on Base — a guest scans a QR code and gets a badge without paying gas.",
    "case.iwashere.problem": "POAP badges for event attendance require the guest to own a wallet with ETH and to pay gas — 90% of people drop off at that step.",
    "case.iwashere.solution": "ERC-1155 contract + account abstraction: the guest signs in with email (Base Account), signs the claim, and a paymaster covers the gas (ERC-4337 + EIP-5792). Badges stack up into Bronze → Platinum tiers.",
    "case.iwashere.result": "<strong>Live on Base mainnet.</strong> A real badge was claimed end-to-end: the user paid 0 ETH, gas fully sponsored.",
    "case.pmBtc.one": "A research bot: is there an edge against the market on 5-minute BTC bets? Honest answer: no.",
    "case.pmBtc.problem": "Hypothesis: fair value from a Binance proxy leads Polymarket prices on \"BTC up/down in 5 minutes\" markets — and that can be monetized.",
    "case.pmBtc.solution": "Shadow bot: computes fair value, paper-trades with a realistic execution model, logs everything. Gated decision system: momentum filter, cost model, quality gates, walk-forward OOS. Deployed on a VPS under systemd.",
    "case.pmBtc.result": "Research closed with evidence: <strong>the signal has no edge</strong> (market Brier 0.164 vs 0.185 for the model; when they disagree, the market is right 63.6% of the time). No money lost — the bot never left DRY_RUN.",
    "case.pmWeather.one": "An autonomous bot on daily maximum temperature markets: weather models against the crowd.",
    "case.pmWeather.problem": "Polymarket weather markets are priced by the crowd by eye, while the physical value is predictable by models — a potential source of edge.",
    "case.pmWeather.solution": "Two strategies: (A) probabilities from a 31-member GFS ensemble corrected for the station's systematic bias; (B) intraday tracking of the actual METAR maximum — betting on buckets whose outcome is already nearly settled.",
    "case.pmWeather.result": "A working bot in simulation mode with tests; live trading is gated behind acceptance criteria and a manual <strong>--live --confirm</strong> flag.",
    "case.web3tools.one": "EVM wallet and vanity address generator: an address that starts with the pattern you choose.",
    "case.web3tools.problem": "A pretty, recognizable wallet address (0xCAFE…, 0xN23E…) can't be picked — only brute-forced across millions of keys.",
    "case.web3tools.solution": "CLI brute force with \"starts with / ends with / contains\" patterns; one address works across every EVM network.",
    "case.web3tools.result": "Published package with CI tests on GitHub Actions, MIT.",
    "case.receptionist.one": "AI bot for small business: answers customers from a knowledge base, collects leads, hands off to a human.",
    "case.receptionist.problem": "Small businesses lose customers because they can't reply in messengers fast enough: nights, weekends, a stream of repetitive questions.",
    "case.receptionist.solution": "A Telegram/WhatsApp bot with RAG over the business knowledge base (pgvector), lead capture, service booking and handoff of hard conversations to a live operator. Dashboard for the owner.",
    "case.receptionist.result": "Stage 3 of the spec is done: the Telegram bot works — webhook, dialogues, auto-answers from the knowledge base, operator handoff. Deploys with a single docker compose command.",
    "case.timeslot.one": "Telegram-first booking platform for niche services: subscription, no per-booking fees.",
    "case.timeslot.problem": "Independent professionals and small studios cannot afford platforms that take a cut of every booking, while a full website with booking is overkill.",
    "case.timeslot.solution": "Everything happens inside Telegram: owner onboarding via a state machine, deep links for clients, races for a slot resolved by an EXCLUDE constraint in the database, reliable notifications through a transactional outbox, reminders 24 h and 2 h ahead.",
    "case.timeslot.result": "Sprints 0–4 closed: onboarding, client booking, owner dashboard with agenda and manual booking, reminders with retries and idempotency.",
    "case.soulos.one": "AI operating system for business: an isolated agent instance per client, managed from Telegram.",
    "case.soulos.problem": "Giving a business an AI agent with access to its data is scary: one bad write and the client's real database is ruined.",
    "case.soulos.solution": "A fork of Hermes Agent as a thin overlay: all code lives in its own package, core edits are marked. Five survival invariants, the main one being write safety: writes only via dry-run → diff → backup → confirmation. Business Brain knows the client's business architecture.",
    "case.soulos.result": "Working architecture, distribution in progress: .env.template for deploying client instances.",
    "case.caspervpn.one": "A VPN service resilient to DPI blocking: survivability through transport diversity, not \"stronger encryption\".",
    "case.caspervpn.problem": "Single VPN protocols get blocked wholesale by DPI systems like TSPU — you need a system that switches, not one \"unkillable\" tunnel.",
    "case.caspervpn.solution": "sing-box core on every node, several transports at once (VLESS-REALITY / Hysteria2 / AmneziaWG), the client switches on its own; no custom apps — external clients connect through a per-user subscription URL. Architecture documented with ADRs.",
    "case.caspervpn.result": "A Go monorepo of 6 services with shared contracts, build and tests with a single make command.",
    "case.flowspeech.one": "A local alternative to Wispr Flow for macOS: hold a key — dictate — clean text lands at your cursor.",
    "case.flowspeech.problem": "Dictation is faster than typing, but cloud services cost money and send your voice to a server, while a raw transcript is full of \"uhh\" and slips.",
    "case.flowspeech.solution": "Recognition runs locally (faster-whisper, no internet), text cleanup through an LLM of your choice (Claude / OpenAI / DeepSeek / Ollama) straight from the menu bar. Live waveform on screen, personal dictionary, WPM stats per app.",
    "case.flowspeech.result": "A real FlowSpeech.app with its own icon and launch at login; two modes — push-to-talk and toggle.",
    "case.floatplayer.one": "A YouTube mini-player that stays on top of every window: watch videos and Shorts while you work in other apps.",
    "case.floatplayer.problem": "Chrome's native PiP is a picture with no controls, and popup extensions open a second player — playback restarts and you lose your account, quality and captions.",
    "case.floatplayer.solution": "Document Picture-in-Picture (Manifest V3): the real YouTube player moves into an always-on-top window — no restart, keeping history, quality and captions. Its own UI: 0.25–3x speed, volume up to 300% (Web Audio), A-B loop, sleep timer, comments and live chat in a side column, SponsorBlock, Shorts with auto-advance and keyword search.",
    "case.floatplayer.result": "<strong>Published on the Chrome Web Store.</strong> The only extension combining an always-on-top window, full playback controls and a Shorts mode.",
    "case.storeLink": "Chrome Web Store: extension page",
    "case.graphView.one": "Obsidian graph for large vaults (5–50k notes): from a hairball into an analysis tool.",
    "case.graphView.problem": "The stock Obsidian graph on a large vault turns into a useless tangle: everything is visible and nothing is clear.",
    "case.graphView.solution": "WebGL rendering on Pixi.js, physics in a Web Worker. Any metric maps to node size/color/glow: PageRank, open frequency, edit recency. Louvain clusters auto-named by TF-IDF, overlays for orphans and broken links, custom search operators (opened:>10, links:0…).",
    "case.graphView.result": "<strong>10,000+ nodes at 50+ FPS.</strong> Runs on a real 9k-note vault; demo video in the repository.",
    "case.columnExplorer.one": "Finder-style file manager for Obsidian: Miller columns, drag & drop, note calendar.",
    "case.columnExplorer.problem": "Obsidian's default file tree is awkward for deep structures: constant expanding and collapsing, no overview of the path.",
    "case.columnExplorer.solution": "Columns like in Finder: clicking a folder opens its contents to the right. A full file manager: create, rename, multi-select, context menus, folder colors; virtual rows for Recents and bookmarks, plus a calendar with the number of notes created per day.",
    "case.columnExplorer.result": "A complete plugin with documentation, screenshots and test coverage.",
    "case.tgBridge.one": "Text yourself on Telegram — the note appears in your Obsidian daily note by itself. No server.",
    "case.tgBridge.problem": "Thoughts arrive on a walk, the vault sits on your computer. Existing bridges need a VPS, Docker or paid services.",
    "case.tgBridge.solution": "The plugin polls the Telegram bot itself when Obsidian opens: formatted text arrives as Markdown, photos/voice messages/files are saved to attachments and embedded, hashtags route messages into topic notes.",
    "case.tgBridge.result": "Zero infrastructure: no server, no VPS, no Docker; works on desktop and mobile.",
    "case.graphExplorer.one": "Your note graph as a galaxy: you fly a starship, and every in-game reward genuinely improves the vault.",
    "case.graphExplorer.problem": "Tidying notes is boring: orphans pile up, old knowledge is never reviewed, links never get built.",
    "case.graphExplorer.solution": "A game on top of the real graph: notes are planets, wikilinks are hypergates. The economy pulls the player into the \"Orphan Nebula\", reviewing knowledge is spaced repetition (SM-2) via mining, and building a hypergate physically writes the link into the md file. The game graph always equals the real vault graph.",
    "case.graphExplorer.result": "A playable plugin: every in-game action leaves the vault better than it was.",
    "case.vaultAgent.one": "Agentic LLM workflows right inside Obsidian: on a schedule, on events, with review of every change.",
    "case.vaultAgent.problem": "You want an agent to sort the inbox and tidy the vault on its own — without the risk of an LLM silently rewriting notes.",
    "case.vaultAgent.solution": "Workflows are described as ordinary markdown notes and run on cron / file events / manually. Everything goes through a review queue with diff view; three permission modes read-only → write-draft → auto-write. Full trace of every run: what it read, which tools it used, how many tokens it spent.",
    "case.vaultAgent.result": "Local-first: works without a server, LLM of your choice — Anthropic / OpenAI / Ollama (offline).",
    "case.vaultMirror.one": "Your notes already know who you are. This makes them talk: 16 mirror reports from your vault.",
    "case.vaultMirror.problem": "You can't see your own patterns from the inside, even though they have been sitting in your notes in plain text for years. A friend would need years to read all of it.",
    "case.vaultMirror.solution": "A folder of prompts next to your notes: you tell any agent with file access \"read 00-start.md and begin\" — and get 16 reports with evidence: how you think, what you value vs what you do, why projects die, a 30-day plan built around your real failure patterns. Every claim is backed by a quote from a note.",
    "case.vaultMirror.result": "Zero code, zero dependencies, zero telemetry — it's just prompts. Works with Claude Code, Cursor, Codex.",
    "case.mvm.one": "An audio-reactive visualizer driven by AI agents: \"make a visual for this track\" → finished video.",
    "case.mvm.problem": "A visual for music means hours of manual work in After Effects for every track, while one-click generators give you no control.",
    "case.mvm.solution": "Pipeline: audio → per-frame features (custom FFT, streaming) → 8 scenes in React/Three.js → render through Remotion with a transparent background (ProRes 4444) for compositing in Final Cut. Segmented resumable rendering of long tracks, MCP server — the visualizer is driven by an agent.",
    "case.mvm.result": "<strong>v1.0, all phases 0–6 closed</strong>: tests for determinism, golden frames, BPM and the MCP contract.",
    "case.wavHumanizer.one": "A DSP processor that makes quantized audio sound like a live performance.",
    "case.wavHumanizer.problem": "Generated and hard-quantized music sounds mechanical: perfect timing and identical dynamics give the machine away.",
    "case.wavHumanizer.solution": "Analyzer → HumanizationEngine → EffectsChain pipeline: tempo and phrase detection, transient-aware timing micro-shifts, contextual velocity variation, fatigue toward the end of a phrase, pitch drift, analog warmth. JSON report on every transformation.",
    "case.wavHumanizer.result": "CLI with batch processing, 24-bit WAV output, smoke tests.",
    "case.sunoHub.one": "Block-based prompt builder for Suno: assemble a style, spin the tag slot machine, generate in batches.",
    "case.sunoHub.problem": "Good Suno prompts are combinatorics over dozens of tags; going through variants by hand is slow and unsystematic.",
    "case.sunoHub.solution": "Topic blocks (genre, mood, rhythm, techniques…) with reroll / slot machine and block locking, batch generation of up to 200 prompts, evolution — crossover and mutation of presets, a card collection with rarity common → legendary, refinement through an LLM.",
    "case.sunoHub.result": "Open index.html and it works: no build, no dependencies, no server. 7 sprints of features.",
    "case.ytPipeline.one": "A content factory for YouTube channels: ideas, scripts, prompts for Suno/Midjourney/Runway, metadata.",
    "case.ytPipeline.problem": "Several channels = a conveyor of repetitive work: come up with the idea, write it out, generate assets, prepare metadata — for every single video.",
    "case.ytPipeline.solution": "A pipeline with channel profiles in YAML: niche analysis → ideas → scripts → prompts for AI generation → metadata and Shorts → editorial review. Two billing modes: through a Claude subscription (CLI) or an API key.",
    "case.ytPipeline.result": "Working app + a macOS .app, tests, configs for 4 channels.",
    "case.aiMusicChecker.one": "Check mp3/wav for signs of AI generation — entirely in the browser, files never leave your machine.",
    "case.aiMusicChecker.problem": "You need to tell quickly whether a track was generated (Suno and the like) without sending audio to someone else's servers.",
    "case.aiMusicChecker.solution": "Analysis through the Web Audio API: traces in metadata, crest factor and compression, spectral centroid stability, repetition of second-long patterns, stereo correlation.",
    "case.aiMusicChecker.result": "A single index.html: drop a file — get a verdict. Zero backend.",
    "case.ytOptimizer.one": "Video compression for YouTube uploads: ffmpeg presets + a macOS droplet — drag it in and it's done.",
    "case.ytOptimizer.problem": "Source videos weigh gigabytes, and the ffmpeg flags get googled from scratch every time.",
    "case.ytOptimizer.solution": "A thin wrapper over ffmpeg with tuned presets (720/1080/480, CRF) + an AppleScript droplet: drag a file onto the icon — get it compressed. Ships with a Claude skill for agents.",
    "case.ytOptimizer.result": "Published with a license and an agent guide; used in my own YouTube pipeline.",
    "case.promptManager.one": "Prompt manager for macOS: menu bar, Spotlight-style palette, templates with variables and an MCP server.",
    "case.promptManager.problem": "Working prompts are scattered across notes and chats; no quick access, no variables, no access for agents.",
    "case.promptManager.solution": "A menu bar app with a Spotlight-style palette, tags, favorites and {{variable}} templates. Plus an MCP server: Claude and other agents search and use your prompts directly.",
    "case.promptManager.result": "Builds into a standalone .app with one script.",
    "case.hermesPack.one": "A commercial catalog of outcome-oriented skill packs for Hermes Agent: an MVP with demand validation.",
    "case.hermesPack.problem": "Nobody buys standalone SKILL.md files; the value is in tested workflows with onboarding, diagnostics and compatibility updates.",
    "case.hermesPack.solution": "Evidence-driven MVP: phase 0 first — demand validation, the paid pack behind a gate. Free skills are published to a separate public tap repository through an allowlist bundle; Hermes facts are pinned to a specific version.",
    "case.hermesPack.result": "Catalog infrastructure: site, package format, threat model, testing strategy.",
    "case.liquidGlass.one": "A minimalist glass theme for Obsidian: one strong idea instead of thousands of lines of CSS.",
    "case.liquidGlass.problem": "Popular Obsidian themes grow into thousands of lines of overrides: striking in a screenshot, but noisy after three hours of writing, and broken by every app update.",
    "case.liquidGlass.solution": "A fork of Blue Topaz rewritten from the success criterion: everything on Obsidian's native CSS variables, with text contrast and calm surfaces at the center rather than blur for its own sake. Anti-goals were written down before the first line of code.",
    "case.liquidGlass.result": "The theme plus snippets and a demo vault (TIPS) to test it on real notes.",
    "case.prizeScout.one": "An autonomous scout for promos and giveaways: collects them, filters the junk with Claude and sends a digest to Telegram.",
    "case.prizeScout.problem": "Contests and promos are scattered across sites, RSS feeds and channels; going through them by hand takes hours, and half the finds are scams or already over.",
    "case.prizeScout.solution": "A fetch → dedupe → insert → score → finalize pipeline: sources are configured in a file, duplicates are dropped, and the Claude API scores relevance and safety. SQLite on a Railway volume, an express /digest endpoint, and n8n turns it into a daily Telegram message.",
    "case.prizeScout.result": "The repo is agent-operable: <strong>npm run verify</strong> (doctor + tests + offline smoke) is a single gate — exit 0 means it works. Ships with a Hermes skill for operations and a Railway deploy.",
    "case.claudePrompts.one": "A system that prompts itself: a library that grows through use instead of being rewritten every time.",
    "case.claudePrompts.problem": "Writing every prompt from scratch loses both the context and the phrasings that worked. Good prompts get buried in chats and are never found again.",
    "case.claudePrompts.solution": "Four parts instead of manual labour: CLAUDE.md as the folder's permanent context, a prompt-generator skill (assembles a full prompt from a short task description), context/ with stable blocks that hit the prompt cache, and prompts/ — a library where every prompt that worked is saved.",
    "case.claudePrompts.result": "Installs globally by copying the skill into ~/.claude/skills — reversible, no dependencies.",
    "case.bunnyRunner.one": "An endless runner for Yandex Games on Three.js: a rabbit, a red cube and a fully closed moderation checklist.",
    "case.bunnyRunner.problem": "Writing the game is the easy part — moderation rejects it for SDK calls without fallbacks, ads in the wrong places, saves that break on update, and missing localization.",
    "case.bunnyRunner.solution": "Plain JS, no frameworks: Three.js for visuals, Howler for sound, and a meta layer of coins, skins, pets, missions and a daily bonus. Every Yandex Games SDK call sits in a try/catch with a mock fallback, so the game works fully without sign-in; the save schema is versioned and the ru/en dictionaries are checked by a test.",
    "case.bunnyRunner.result": "Builds v1.0.0 and v1.0.1 packaged to the platform's requirements (~1.6 MB), <strong>135 tests</strong> on vitest, moderation checklist closed point by point.",
    "case.socialDeduction.one": "A vertical portal for social deduction games: finds the right game for your group, not another database.",
    "case.socialDeduction.problem": "Picking a game for a specific group (how many people, how much time, how cruel the mechanics) means digging through reviews — general catalogs don't answer that question.",
    "case.socialDeduction.solution": "Static-first Next.js (App Router) + TypeScript: a catalog, a recommendation finder on the first screen, SEO guides in MDX and comparison pages. Game data is typed JSON/YAML with no database and no accounts, and every content file is validated by Zod schemas at build time, so broken meta can't be deployed.",
    "case.socialDeduction.result": "Built by an agent against CLAUDE_DESIGN.md as the single source of truth; as of the last check — Cycle 11, content in EN and RU.",
    "case.protocol.one": "An interactive table for Mafia: tracks a live game and trains deduction on puzzles.",
    "case.protocol.problem": "At the table everything rests on the memory of the host and the players: who voted how, who checked whom, which connections surfaced. And there is nowhere to practice deduction between games.",
    "case.protocol.solution": "Two modes in one app: a live-game tracker (votes, roles, checks, connections, trust, notes and arguments) and a puzzle mode where you have to identify three mafiosi from a finished protocol.",
    "case.protocol.result": "Runs with no build step and no server, data stays in the browser — open the file and play.",
    "case.procrastSim.one": "A browser game about not doing the task. Small, finished, shipped.",
    "case.procrastSim.problem": "Big projects die halfway. What's needed is a format that tests an idea end to end — from mechanics to release — in a matter of days.",
    "case.procrastSim.solution": "Next.js 14 + Tailwind, the whole game on the client, no backend and no accounts. Tests on vitest, deployed as static files.",
    "case.procrastSim.result": "Taken to the end and published — the rare and therefore valuable status of \"done\".",
    "proj.floatPlayer": "FloatPlayer: YouTube in an always-on-top window (Manifest V3).",
    "proj.prizeScout": "A scout for promos and giveaways: Claude scoring, digest to Telegram.",
    "proj.bunnyRunner": "Endless runner for Yandex Games: Three.js, 135 tests.",
    "proj.claudePrompts": "A system that assembles prompts from templates by itself.",
    "proj.socialDeduction": "A portal for social deduction games: Next.js, Zod-validated content.",
    "proj.protocol": "\"Protocol\": an interactive Mafia table plus a deduction trainer.",
    "proj.liquidGlass": "Liquid Glass: a minimalist theme for Obsidian.",
    }
  };

  /* ---------- выбор языка ---------- */

  function isSupported(lang){
    return lang === 'ru' || lang === 'en';
  }

  function readInitialLang(){
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (isSupported(fromUrl)) return fromUrl;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (isSupported(saved)) return saved;
    } catch (e) {
      /* приватный режим — localStorage недоступен, это не ошибка */
    }
    return DEFAULT_LANG;
  }

  var currentLang = readInitialLang();

  /* Перевод по ключу. Нет перевода — отдаём русский, нет и его — сам ключ. */
  function t(key){
    var table = DICT[currentLang] || DICT[DEFAULT_LANG];
    if (key in table) return table[key];
    if (key in DICT[DEFAULT_LANG]) return DICT[DEFAULT_LANG][key];
    return key;
  }

  /* ---------- отрисовка ---------- */

  function paint(){
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var table = DICT[currentLang];
      if (!(key in table)) return;          /* перевода нет — оставляем как есть */
      var value = table[key];
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, value);
      else if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
      else el.textContent = value;
    });

    document.querySelectorAll('.lang-switch button').forEach(function(btn){
      var isActive = btn.dataset.lang === currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('langchange', {detail:{lang: currentLang}}));
  }

  function setLang(lang){
    if (!isSupported(lang) || lang === currentLang) return;
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    paint();
  }

  /* ---------- запуск ---------- */

  document.addEventListener('click', function(e){
    var btn = e.target.closest('.lang-switch button');
    if (btn) setLang(btn.dataset.lang);
  });

  window.i18n = {
    t: t,
    setLang: setLang,
    get lang(){ return currentLang; }
  };

  paint();
})();
