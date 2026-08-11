# Raincoat

Статический сайт-портфолио. Без сборки и зависимостей: HTML + CSS + vanilla JS.

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
     "desc": "Одно предложение — о чём текст."
   }
   ```

   `slug` — имя файла без `.md`. Список сортируется по дате, новые сверху.
3. Закоммитьте и запушьте. Эссе появится на `blog.html`,
   прямая ссылка — `blog.html?post=my-essay`.

## Support

If this project was useful to you, feel free to support further development:

[![ETH](https://img.shields.io/badge/ETH-0x7777...88C4-blue?logo=ethereum&style=flat-square)](https://etherscan.io/address/0x77777da54702AC8789D53fc7cC6201C29a1A88C4)
[![Donate](https://img.shields.io/badge/donate-crypto-orange?style=flat-square)](https://etherscan.io/address/0x77777da54702AC8789D53fc7cC6201C29a1A88C4)
