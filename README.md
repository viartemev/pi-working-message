# pi-working-message

Configurable working-message phrases for [pi](https://github.com/badlogic/pi-mono) via JSON.

This package changes only pi's **working message** while the agent is busy.
It does **not** change the footer, title bar, thinking label, or any other UI element.

For each request, pi-working-message shows exactly **one phrase**. The phrase does not rotate during the same response.

Defaults:
- `enabled: true`
- `selection: "random"`

## Install

### From GitHub

```bash
pi install https://github.com/viartemev/pi-working-message
```

### From a local path

```bash
pi install /absolute/path/to/pi-working-message
```

Then run `/reload` in pi if it is already open.

## Configuration

The package looks for JSON config files in this order:

1. `~/.pi/agent/working-message.json`
2. `.pi/working-message.json` in the current project

If both exist, the project config overrides the global config.
If neither exists, built-in defaults are used.

### Example config

```json
{
  "$schema": "https://raw.githubusercontent.com/viartemev/pi-working-message/main/schemas/working-message.schema.json",
  "enabled": true,
  "selection": "random",
  "phrases": [
    "Обкашляю вопросик",
    "Решаю вопросик",
    "Сейчас подскочу"
  ]
}
```

### Options

- `enabled`: `true` or `false`
- `selection`: `"random"` or `"round-robin"`
- `phrases`: array of phrases to use

## Commands

- `/working-message` — show current status and config source
- `/working-message preview` — preview the next phrase

## Notes

- one request = one phrase
- the config is re-read on every request
- invalid JSON shows a warning and falls back to the default working message behavior for that turn

## Development

This is a standard pi package:

```json
{
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"]
  }
}
```

## License

MIT
