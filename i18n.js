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
    "meta.title": "Raincoat — креатив и код",
    "meta.desc": "Raincoat: превращаю идеи в работающие проекты. Креатив, код, эксперименты.",
    "meta.ogDesc": "Креатив и код",

    /* навигация */
    "nav.about": "Обо мне",
    "nav.tools": "Инструменты",
    "nav.projects": "Проекты",
    "nav.blog": "Блог",
    "nav.contacts": "Контакты",

    /* первый экран */
    "hero.tagline": "Креатив × код: превращаю идеи в работающие проекты",
    "hero.cta": "Написать мне",
    "hero.scroll": "scroll",

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
    },

    /* ================= ENGLISH ================= */
    en: {
    /* мета-теги */
    "meta.title": "Raincoat — creative & code",
    "meta.desc": "Raincoat: I turn ideas into working projects. Creative, code, experiments.",
    "meta.ogDesc": "Creative & code",

    /* навигация */
    "nav.about": "About",
    "nav.tools": "Tools",
    "nav.projects": "Projects",
    "nav.blog": "Blog",
    "nav.contacts": "Contacts",

    /* первый экран */
    "hero.tagline": "Creative × code: turning ideas into working projects",
    "hero.cta": "Get in touch",
    "hero.scroll": "scroll",

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
    "stack.adrDocs": "ADR docs",
    "stack.yamlConfigs": "YAML configs",

    /* страница кейсов: общие подписи */
    "cell.problem": "Problem",
    "cell.solution": "Solution",
    "cell.result": "Result",
    "case.githubLink": "GitHub: open repository",

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
