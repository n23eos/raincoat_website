# Site Foundation

## Purpose

Зафиксировать базовые свойства существующего Raincoat перед добавлением новых фич.
Источник: README.md и текущая структура сайта, проверенные 2026-09-10.
Это минимальная исходная спецификация, а не полный аудит поведения сайта.

## Requirements

### Requirement: Static site delivery
Сайт SHALL предоставлять страницы как статические HTML, CSS и JavaScript без обязательного этапа сборки.

#### Scenario: Local preview
- **WHEN** корень репозитория раздаётся HTTP-сервером
- **THEN** index.html доступен напрямую без компиляции приложения

### Requirement: File-based blog content
Блог SHALL получать список публикаций из posts/index.json, а текст публикации — из Markdown-файла в posts/.

#### Scenario: Open a publication
- **WHEN** пользователь открывает blog.html?post=<slug> для существующей публикации
- **THEN** блог загружает соответствующий Markdown-файл из posts/
