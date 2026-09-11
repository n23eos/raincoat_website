# Showcase Card Covers

## Requirements

1. The section `#products` on the main page SHALL render a cover image for the `Kaidzen` card.
2. The section `#products` on the main page SHALL render a cover image for the `FlowSpeech` card.
3. Each cover image SHALL be loaded with `loading="lazy"` and explicit width/height attributes.
4. Rendering changes SHALL not alter existing RU/EN copy keys in `i18n.js` for `prod.kaidzen.*` and `prod.fs.*`.

## Scenarios

### Scenario: Card covers are shown in the product showcase

- **WHEN** a user opens `index.html` and scrolls to `#products`
- **THEN** the `Kaidzen` card SHALL include a `.shot` image wrapper with source in `assets/shots`.
- **AND** the `FlowSpeech` card SHALL include a `.shot` image wrapper with source in `assets/shots`.
