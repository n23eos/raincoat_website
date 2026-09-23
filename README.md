# Raincoat

**Raincoat is a static portfolio and blog site with no build step and no dependencies, written in HTML, CSS and vanilla JavaScript.** Essays are Markdown files in posts/ listed by posts/index.json, parsed and rendered in the browser, and each one is reachable at blog.html?post=slug. Posts carry a Russian and an English version with an in-page language switch. It is served from GitHub Pages on the custom domain raincoat.cc.

<div align="center">

[![Star on GitHub](https://img.shields.io/github/stars/n23eos/raincoat_website?style=for-the-badge&logo=github&label=Star%20this%20repo&color=FFD700&labelColor=1a1a1a)](https://github.com/n23eos/raincoat_website)

</div>

## Как добавить эссе в блог

1. Создайте Markdown-файл в `posts/`, например `posts/my-essay.md`.
   Поддерживается: `#`/`##`/`###` заголовки, **жирный**, *курсив*, `код`,
   блоки ```` ``` ````, списки, цитаты `>`, ссылки, картинки, `---`.
2. Добавьте запись в начало `posts/index.json`:

   ```json
   {
     "slug": "my-essay",
     "date": "2026-08-15",
     "title": "Название эссе",
     "desc": "Одно предложение - о чём текст."
   }
   ```

   `slug` - имя файла без `.md`. Список сортируется по дате, новые сверху.
3. Запустите `python3 scripts/generate-article-pages.py`, чтобы обновить статические
   страницы с индивидуальными метатегами и превью. Прямые ссылки:
   `articles/my-essay/` и `articles/my-essay/en/` при наличии перевода.
   Старый адрес `blog.html?post=my-essay` продолжает работать.
4. Проверьте результат локально перед публикацией.

## Разработка новых фич через OpenSpec

OpenSpec **1.13.0** подключён для Codex: навыки находятся в `.agents/skills/`,
контекст проекта - в `openspec/config.yaml`, исходные требования - в `openspec/specs/`.
CLI запускается через `npx`; требуется Node.js 20.19+ и npm. На работу сайта это не влияет.

1. В новой сессии Codex вызовите `$openspec-propose "описание фичи"`.
   Навык создаст proposal, specs, design и tasks в `openspec/changes/<name>/`.
2. Проверьте объём и критерии готовности, затем вызовите `$openspec-apply-change <name>`.
   Прогресс реализации и проверок ведётся в `tasks.md` этого изменения.
3. Проверьте затронутые сценарии. Для UI запустите `python3 -m http.server 8000`
   и откройте `http://localhost:8000`; проверьте RU/EN, узкий экран и ошибки браузера.
4. Проверьте спецификации:
   ```sh
   npx --yes @fission-ai/openspec@1.13.0 validate --all --strict --no-interactive
   ```
5. После завершения и проверок вызовите `$openspec-archive-change <name>`:
   итоговые требования синхронизируются с `openspec/specs/`, изменение попадёт в архив.

Список изменений: `npx --yes @fission-ai/openspec@1.13.0 list`.
Если навыки не появились в текущей сессии Codex, начните новую сессию в этом репозитории.
Существующий сайт не требует миграции; подробные спецификации дополняются по мере новых фич.

## Портфолио и проверки

Главная представляет AI Engineer и ведёт прямо к сайтам продуктов и GitHub.
FloatPlayer и I Was Here входят в основную подборку. RU/EN PDF находятся
в `assets/resume/`; старые разборы сохранены по прежнему адресу.
Видео обложки загружается только по нажатию на широком экране; reduced motion
и мобильная версия используют статичное изображение.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --test tests/*.test.cjs
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py' -v
python3 scripts/generate-article-pages.py --check
```

После изменения шаблона `blog.html`, индекса или текста статей повторно запустите
генератор страниц. Для сайта не нужны зависимости или сборка.

Необязательная пересборка PDF: `python3 scripts/generate-resume.py`. Для неё отдельно
нужен Python-пакет `reportlab` и шрифты Noto Sans Regular/Bold в `/Library/Fonts/`
(пути заданы в начале скрипта). Готовые PDF уже находятся в репозитории.
