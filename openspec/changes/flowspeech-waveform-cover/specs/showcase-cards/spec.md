# FlowSpeech waveform showcase

## Requirements

1. The `FlowSpeech` card in `#products` SHALL display an image whose visual content explicitly represents an audio waveform.
2. The displayed image SHALL be loaded from `assets/shots/flowspeech-waveform.svg`.
3. The `FlowSpeech` card layout and RU/EN text keys (`prod.fs.*`, links, badge) SHALL remain unchanged.

## Scenarios

### Scenario: Product card signals audio nature

- **WHEN** a user views the `#products` section on the main page
- **THEN** FlowSpeech card SHALL include a shot image using `assets/shots/flowspeech-waveform.svg` with a visible waveform style.
