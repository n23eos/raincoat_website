'use strict';

function evaluateGate(input) {
  var objectiveRegression = ((input.baselineObjective - input.candidateObjective) / input.baselineObjective) * 100;
  var tokenRatio = input.candidateTokens / input.baselineTokens;
  var reasons = [];

  if (input.candidateWinRate < 0.55) reasons.push('win_rate');
  if (objectiveRegression > 10) reasons.push('objective_regression');
  if (tokenRatio > 1.5) reasons.push('token_cost');

  return {
    accepted: reasons.length === 0,
    reasons: reasons,
    objectiveRegression: objectiveRegression,
    tokenRatio: tokenRatio
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateGate: evaluateGate };
}

if (typeof document !== 'undefined') {
  (function () {
    var CASE_DICT = {
      ru: {
        'meta.title': 'Инженерные кейсы - Raincoat',
        'meta.description': 'Три инженерных кейса: FlowSpeech, Advanced Graph View и Kaidzen. Задачи, решения, проверки, исходники и ограничения.',
        'nav.aria': 'Основная навигация',
        'nav.menu': 'Меню',
        'nav.cases': 'Проекты',
        'nav.team': 'Для команд',
        'nav.blog': 'Блог',
        'nav.contacts': 'Контакты',
        'hero.eyebrow': 'Избранные инженерные кейсы',
        'hero.title': 'Как устроена работа внутри',
        'hero.lede': 'Три проекта с разными задачами: desktop-инструмент, большой интерактивный граф и система оценки AI-изменений. Здесь есть архитектурные решения, проверяемые источники и границы выводов.',
        'hero.source': 'Срезы публичного кода зафиксированы коммитами и датой 19.09.2026. Ссылки на проверки ведут к тестовым сценариям в исходниках.',
        'jumps.aria': 'Кейсы',
        'shared.role': 'Роль: проектная самостоятельная разработка',
        'shared.task': 'Задача',
        'shared.implementation': 'Реализация',
        'shared.decisions': 'Инженерные решения',
        'shared.verification': 'Примеры проверки в исходнике',
        'shared.limitations': 'Ограничения',
        'shared.snapshot': 'Срез источника',
        'shared.code': 'Код на GitHub',
        'flow.intro': 'macOS-приложение для диктовки: запись по горячей клавише, распознавание речи и опциональная очистка текста перед вставкой в активное приложение.',
        'flow.task': 'Сократить путь от речи до пригодного текста и при этом оставить пользователю выбор между локальной обработкой и облачными сервисами.',
        'flow.pipelineAria': 'Пайплайн FlowSpeech',
        'flow.step1h': 'Захват',
        'flow.step1p': 'Горячая клавиша управляет записью, а короткие фрагменты получают тишину по краям, чтобы модель не теряла границы речи.',
        'flow.step2h': 'Распознавание',
        'flow.step2p': 'faster-whisper работает локально. Groq ASR доступен как отдельный облачный вариант, а не как условие работы приложения.',
        'flow.step3h': 'Очистка',
        'flow.step3p': 'Пользователь выбирает Claude, OpenAI, DeepSeek, Ollama или режим без LLM-очистки.',
        'flow.step4h': 'Вставка',
        'flow.step4p': 'Результат возвращается в активное приложение; сбой форматтера не должен уничтожить исходный транскрипт.',
        'flow.decision1': 'Локальное ASR отделено от LLM-очистки: приватный путь остаётся доступным без облачного форматтера.',
        'flow.decision2': 'Ошибки постобработки деградируют к исходному тексту вместо потери диктовки.',
        'flow.decision3': 'Форматтеру запрещено отвечать на продиктованный вопрос: его задача только редактировать текст.',
        'flow.verify1': 'Formatter: ошибка возвращает исходный текст',
        'flow.verify2': 'Formatter: защита от ответа на вопрос',
        'flow.verify3': 'Transcriber: padding тишины и фильтрация артефактов',
        'flow.limits': 'Полностью офлайн-режим требует заранее загруженную модель faster-whisper, отключённый cloud ASR и локальную очистку через Ollama либо режим без очистки.',
        'graph.intro': 'Экспериментальный desktop-плагин для исследования больших графов заметок в Obsidian с WebGL-рендером и вынесенными из UI-потока вычислениями.',
        'graph.task': 'Сохранить отзывчивые pan и zoom на графе из тысяч заметок, не блокируя интерфейс раскладкой и аналитикой.',
        'graph.archAria': 'Архитектура Advanced Graph View',
        'graph.arch1': 'Камера, узлы, взаимодействие',
        'graph.arch2': 'Физика и позиции',
        'graph.arch3': 'Метрики и структура',
        'graph.arch4': 'Пакетный рендер связей',
        'graph.decision1': 'Pixi.js и WebGL берут на себя отрисовку вместо большого числа DOM-элементов.',
        'graph.decision2': 'Layout Worker и Analysis Worker разделяют длительные вычисления и интерфейс.',
        'graph.decision3': 'Связи собираются в GPU edge mesh, чтобы уменьшить накладные расходы на отдельные объекты.',
        'graph.verify': 'bench/bench.ts описывает прогон на 10 000 узлов и 30 000 рёбер, собирает median FPS и p95 времени pan/zoom. Значение 50 FPS в файле является порогом, а не опубликованным результатом.',
        'graph.benchLink': 'Открыть benchmark source',
        'graph.limits': 'Desktop beta. Производительность проверяется локальным benchmark; сохранённого результата для конкретного устройства в репозитории нет.',
        'kaidzen.intro': 'Python-пайплайн, который развивает кандидатное решение по стадиям и пропускает изменение только после сравнения с измеримой базой.',
        'kaidzen.task': 'Отделить убедительный отчёт от улучшения, которое действительно проходит набор продуктовых и ресурсных ограничений.',
        'kaidzen.stage1': 'разбирает исходное состояние',
        'kaidzen.stage2': 'собирает основания',
        'kaidzen.stage3': 'готовит кандидата',
        'kaidzen.stage4': 'сравнивает с базой',
        'kaidzen.decision1': 'Gate задаёт минимальный win rate 0,55, допускает не более 10% регрессии целевой метрики и не более 1,5x токенов.',
        'kaidzen.decision2': 'Кандидат должен пройти все ограничения одновременно: сильная одна метрика не перекрывает провал другой.',
        'kaidzen.decision3': 'Тесты покрывают правдоподобные обходы: красивый отчёт с худшим closed rate, выигрыш за счёт уменьшения registry и качество, купленное тройной стоимостью.',
        'kaidzen.verify1': 'Худший closed rate отклоняет красивый отчёт',
        'kaidzen.verify2': 'Сужение registry не считается честным выигрышем',
        'kaidzen.verify3': 'Тройная стоимость отклоняет кандидата',
        'kaidzen.limits': 'Интерактив выше повторяет только три числовых порога из gate.py и не воспроизводит полный пайплайн, registry или реальные запуски моделей.',
        'demo.label': 'Локальный пример решения',
        'demo.title': 'Пропустить кандидата через gate',
        'demo.badge': 'Только в браузере',
        'demo.note': 'Упрощённая учебная иллюстрация на фиксированных данных. Она не запускает Kaidzen, не вызывает AI и ничего не отправляет в сеть.',
        'demo.legend': 'Выберите кандидата',
        'demo.balancedH': 'Сбалансированный',
        'demo.balancedP': 'Умеренный выигрыш без выхода за лимиты',
        'demo.regressedH': 'Красивый отчёт',
        'demo.regressedP': 'Win rate вырос, целевая метрика просела',
        'demo.expensiveH': 'Дорогой выигрыш',
        'demo.expensiveP': 'Метрики выросли ценой тройных токенов',
        'demo.metric': 'Метрика',
        'demo.baseline': 'База',
        'demo.candidate': 'Кандидат',
        'demo.threshold': 'Порог gate',
        'demo.tableAria': 'Таблица сравнения метрик; прокручивается по горизонтали',
        'demo.winRate': 'Win rate',
        'demo.objective': 'Целевая метрика',
        'demo.tokens': 'Токены',
        'demo.winThreshold': '≥ 0,55',
        'demo.regressionThreshold': 'регрессия ≤ 10%',
        'demo.costThreshold': '≤ 1,5x',
        'demo.accept': 'Принять',
        'demo.reject': 'Отклонить',
        'demo.acceptReason': 'Все три ограничения соблюдены: win rate {win}; регрессия {regression}%; стоимость {cost}x.',
        'demo.rejectRegression': 'Кандидат отклонён: регрессия целевой метрики {regression}% превышает лимит 10%.',
        'demo.rejectCost': 'Кандидат отклонён: стоимость {cost}x превышает лимит 1,5x.',
        'demo.rejectWin': 'Кандидат отклонён: win rate {win} ниже минимума 0,55.',
        'cta.eyebrow': 'Следующий шаг',
        'cta.title': 'Нужны детали по коду или решениям?',
        'cta.text': 'Можно открыть зафиксированные исходники или написать напрямую. Я отвечу, что делал сам, что проверено и где остаются ограничения.',
        'cta.email': 'Написать по email',
        'cta.team': 'Формат работы'
      },
      en: {
        'meta.title': 'Engineering case studies - Raincoat',
        'meta.description': 'Three engineering case studies: FlowSpeech, Advanced Graph View and Kaidzen. Problems, decisions, verification, source code and limitations.',
        'nav.aria': 'Main navigation',
        'nav.menu': 'Menu',
        'nav.cases': 'Projects',
        'nav.team': 'For teams',
        'nav.blog': 'Blog',
        'nav.contacts': 'Contact',
        'hero.eyebrow': 'Selected engineering case studies',
        'hero.title': 'How the work is built',
        'hero.lede': 'Three projects with different constraints: a desktop tool, a large interactive graph and a system for evaluating AI changes. This page covers architecture decisions, verifiable sources and the limits of each conclusion.',
        'hero.source': 'Public source snapshots are pinned by commit and date, 19 Sep 2026. Verification links point to test scenarios in the source.',
        'jumps.aria': 'Case studies',
        'shared.role': 'Role: project-based independent development',
        'shared.task': 'Problem',
        'shared.implementation': 'Implementation',
        'shared.decisions': 'Engineering decisions',
        'shared.verification': 'Verification examples in source',
        'shared.limitations': 'Limitations',
        'shared.snapshot': 'Source snapshot',
        'shared.code': 'Code on GitHub',
        'flow.intro': 'A macOS dictation app: hotkey recording, speech recognition and optional text cleanup before insertion into the active app.',
        'flow.task': 'Shorten the path from speech to usable text while keeping a clear choice between local processing and cloud services.',
        'flow.pipelineAria': 'FlowSpeech pipeline',
        'flow.step1h': 'Capture',
        'flow.step1p': 'A hotkey controls recording, while short clips receive silence padding so the model keeps the boundaries of speech.',
        'flow.step2h': 'Transcribe',
        'flow.step2p': 'faster-whisper runs locally. Groq ASR is a separate cloud option, rather than a requirement for the app.',
        'flow.step3h': 'Clean up',
        'flow.step3p': 'The user can choose Claude, OpenAI, DeepSeek, Ollama or no LLM cleanup.',
        'flow.step4h': 'Insert',
        'flow.step4p': 'The result returns to the active app; a formatter failure must not destroy the original transcript.',
        'flow.decision1': 'Local ASR is separate from LLM cleanup, so a private path remains available without a cloud formatter.',
        'flow.decision2': 'Post-processing failures fall back to the original text instead of losing the dictation.',
        'flow.decision3': 'The formatter is guarded against answering a dictated question; its job is limited to editing the text.',
        'flow.verify1': 'Formatter: an error returns the original text',
        'flow.verify2': 'Formatter: guard against answering a question',
        'flow.verify3': 'Transcriber: silence padding and artifact filtering',
        'flow.limits': 'A fully offline path requires a previously downloaded faster-whisper model, cloud ASR disabled and either local cleanup through Ollama or no cleanup.',
        'graph.intro': 'An experimental desktop plugin for exploring large Obsidian note graphs with WebGL rendering and computation moved away from the UI thread.',
        'graph.task': 'Keep pan and zoom responsive on a graph of thousands of notes without blocking the interface with layout and analysis work.',
        'graph.archAria': 'Advanced Graph View architecture',
        'graph.arch1': 'Camera, nodes, interaction',
        'graph.arch2': 'Physics and positions',
        'graph.arch3': 'Metrics and structure',
        'graph.arch4': 'Batched edge rendering',
        'graph.decision1': 'Pixi.js and WebGL handle drawing instead of a large number of DOM elements.',
        'graph.decision2': 'A Layout Worker and an Analysis Worker separate long computations from the interface.',
        'graph.decision3': 'Edges are combined into a GPU mesh to reduce per-object overhead.',
        'graph.verify': 'bench/bench.ts defines a run with 10,000 nodes and 30,000 edges and collects median FPS and p95 pan/zoom time. The 50 FPS value in that file is a threshold, not a published result.',
        'graph.benchLink': 'Open benchmark source',
        'graph.limits': 'Desktop beta. Performance is checked with a local benchmark; the repository has no saved result for a specific device.',
        'kaidzen.intro': 'A Python pipeline that develops a candidate solution through several stages and accepts a change only after comparison with a measurable baseline.',
        'kaidzen.task': 'Separate a persuasive report from an improvement that actually passes product and resource constraints.',
        'kaidzen.stage1': 'examines the starting state',
        'kaidzen.stage2': 'collects supporting evidence',
        'kaidzen.stage3': 'prepares the candidate',
        'kaidzen.stage4': 'compares it with baseline',
        'kaidzen.decision1': 'The gate requires a minimum 0.55 win rate, allows at most 10% objective regression and at most 1.5x token cost.',
        'kaidzen.decision2': 'A candidate must pass every constraint at once; one strong metric cannot cancel a failure elsewhere.',
        'kaidzen.decision3': 'Tests cover plausible shortcuts: a polished report with a worse closed rate, a gain created by shrinking the registry and quality bought at triple the cost.',
        'kaidzen.verify1': 'A worse closed rate rejects a polished report',
        'kaidzen.verify2': 'Shrinking the registry is not a fair win',
        'kaidzen.verify3': 'Triple cost rejects a candidate',
        'kaidzen.limits': 'The example above repeats only three numeric thresholds from gate.py. It does not reproduce the full pipeline, registry or live model runs.',
        'demo.label': 'Local decision example',
        'demo.title': 'Run a candidate through the gate',
        'demo.badge': 'Browser only',
        'demo.note': 'A simplified educational illustration using fixed data. It does not run Kaidzen, call AI or send anything over the network.',
        'demo.legend': 'Choose a candidate',
        'demo.balancedH': 'Balanced',
        'demo.balancedP': 'A moderate gain within every limit',
        'demo.regressedH': 'Polished report',
        'demo.regressedP': 'Win rate rises while the objective drops',
        'demo.expensiveH': 'Expensive win',
        'demo.expensiveP': 'Metrics improve at triple the token cost',
        'demo.metric': 'Metric',
        'demo.baseline': 'Baseline',
        'demo.candidate': 'Candidate',
        'demo.threshold': 'Gate threshold',
        'demo.tableAria': 'Metric comparison table; scrolls horizontally',
        'demo.winRate': 'Win rate',
        'demo.objective': 'Objective metric',
        'demo.tokens': 'Tokens',
        'demo.winThreshold': '≥ 0.55',
        'demo.regressionThreshold': 'regression ≤ 10%',
        'demo.costThreshold': '≤ 1.5x',
        'demo.accept': 'Accept',
        'demo.reject': 'Reject',
        'demo.acceptReason': 'All three constraints pass: win rate {win}; regression {regression}%; cost {cost}x.',
        'demo.rejectRegression': 'Candidate rejected: objective regression of {regression}% exceeds the 10% limit.',
        'demo.rejectCost': 'Candidate rejected: cost of {cost}x exceeds the 1.5x limit.',
        'demo.rejectWin': 'Candidate rejected: win rate {win} is below the 0.55 minimum.',
        'cta.eyebrow': 'Next step',
        'cta.title': 'Need details about the code or decisions?',
        'cta.text': 'Open the pinned source or email me directly. I can explain what I built, what was verified and where the limits remain.',
        'cta.email': 'Email me',
        'cta.team': 'Working format'
      }
    };

    var CANDIDATES = {
      balanced: { baselineWinRate: 0.55, baselineObjective: 80, baselineTokens: 10000, candidateWinRate: 0.61, candidateObjective: 77, candidateTokens: 12000 },
      regressed: { baselineWinRate: 0.55, baselineObjective: 80, baselineTokens: 10000, candidateWinRate: 0.66, candidateObjective: 68, candidateTokens: 11000 },
      expensive: { baselineWinRate: 0.55, baselineObjective: 80, baselineTokens: 10000, candidateWinRate: 0.72, candidateObjective: 80, candidateTokens: 30000 }
    };

    var resultEl = document.getElementById('gate-result');
    var statusEl = document.getElementById('gate-status');
    var explanationEl = document.getElementById('gate-explanation');

    function language() {
      return window.i18n && (window.i18n.lang === 'en' || window.i18n.lang === 'ru') ? window.i18n.lang : 'ru';
    }

    function text(key) {
      return CASE_DICT[language()][key] || CASE_DICT.ru[key] || key;
    }

    function decimal(value, digits) {
      return value.toLocaleString(language() === 'ru' ? 'ru-RU' : 'en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    }

    function integer(value) {
      return value.toLocaleString(language() === 'ru' ? 'ru-RU' : 'en-US');
    }

    function fill(template, values) {
      return Object.keys(values).reduce(function (output, key) {
        return output.replace('{' + key + '}', values[key]);
      }, template);
    }

    function selectedCandidate() {
      var checked = document.querySelector('input[name="candidate"]:checked');
      return CANDIDATES[checked ? checked.value : 'balanced'];
    }

    function renderGate() {
      if (!resultEl) return;

      var candidate = selectedCandidate();
      var result = evaluateGate(candidate);
      var win = decimal(candidate.candidateWinRate, 2);
      var regression = decimal(result.objectiveRegression, 1);
      var cost = decimal(result.tokenRatio, 1);

      document.getElementById('baseline-win').textContent = decimal(candidate.baselineWinRate, 2);
      document.getElementById('candidate-win').textContent = win;
      document.getElementById('baseline-objective').textContent = integer(candidate.baselineObjective) + '%';
      document.getElementById('candidate-objective').textContent = integer(candidate.candidateObjective) + '%';
      document.getElementById('baseline-tokens').textContent = integer(candidate.baselineTokens);
      document.getElementById('candidate-tokens').textContent = integer(candidate.candidateTokens);

      resultEl.classList.toggle('accepted', result.accepted);
      resultEl.classList.toggle('rejected', !result.accepted);
      statusEl.textContent = text(result.accepted ? 'demo.accept' : 'demo.reject');

      var reasonKey = 'demo.acceptReason';
      if (result.reasons.indexOf('win_rate') !== -1) reasonKey = 'demo.rejectWin';
      else if (result.reasons.indexOf('objective_regression') !== -1) reasonKey = 'demo.rejectRegression';
      else if (result.reasons.indexOf('token_cost') !== -1) reasonKey = 'demo.rejectCost';

      explanationEl.textContent = fill(text(reasonKey), { win: win, regression: regression, cost: cost });
    }

    function applyCaseLanguage() {
      var dictionary = CASE_DICT[language()];
      document.querySelectorAll('[data-case-i18n]').forEach(function (element) {
        var key = element.getAttribute('data-case-i18n');
        if (!(key in dictionary)) return;
        var attribute = element.getAttribute('data-case-i18n-attr');
        if (attribute) element.setAttribute(attribute, dictionary[key]);
        else element.textContent = dictionary[key];
      });
      renderGate();
    }

    document.addEventListener('change', function (event) {
      if (event.target && event.target.matches('input[name="candidate"]')) renderGate();
    });
    document.addEventListener('langchange', applyCaseLanguage);
    applyCaseLanguage();
  })();
}
