## Technical Approach

- Use an inline SVG asset for the waveform to avoid external dependencies.
- Replace only the `img src` inside the existing FlowSpeech card.
- Keep the card markup and copy keys intact to avoid translation regressions.

## Files

- `index.html` — update FlowSpeech card cover image source and alt text.
- `assets/shots/flowspeech-waveform.svg` — new cover asset.

## Constraints

- No dependency changes.
- No JavaScript changes.
- Preserve RU/EN locale behavior.
