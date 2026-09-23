# article-sharing Specification

## Purpose

Предоставить индивидуальные превью эссе при пересылке ссылки, сохранив Markdown-источник и существующие адреса читателя блога.

## Requirements

### Requirement: Static per article metadata
Для каждой текущей статьи сайт SHALL предоставлять статический адрес с индивидуальными title, description, og:title, og:description, og:url и абсолютным og:image. Новые адреса SHALL открывать соответствующую статью в существующем оформлении.

#### Scenario: Share an essay
- **WHEN** клиент без JavaScript запрашивает новый адрес статьи
- **THEN** исходный HTML содержит метаданные этой статьи и корректные абсолютные URL

### Requirement: Legacy reader compatibility
Адрес blog.html?post=slug SHALL продолжать открывать соответствующую статью; переключение RU/EN SHALL сохраняться. Иллюстрации известных статей SHALL резервировать место до загрузки.

#### Scenario: Existing link and language switch
- **WHEN** посетитель открывает старую ссылку и переключает RU/EN
- **THEN** отображаются нужная статья и перевод при наличии, ссылки и иллюстрации разрешаются корректно
