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
     "desc": "Одно предложение — о чём текст."
   }
   ```

   `slug` — имя файла без `.md`. Список сортируется по дате, новые сверху.
3. Закоммитьте и запушьте. Эссе появится на `blog.html`,
   прямая ссылка — `blog.html?post=my-essay`.
