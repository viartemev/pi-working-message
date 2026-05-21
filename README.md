# pi-working-message

[![Release](https://img.shields.io/github/v/release/viartemev/pi-working-message?style=flat-square)](https://github.com/viartemev/pi-working-message/releases)
[![License](https://img.shields.io/github/license/viartemev/pi-working-message?style=flat-square)](./LICENSE)
[![pi package](https://img.shields.io/badge/pi-package-blue?style=flat-square)](https://shittycodingagent.ai/packages)

A small, focused [pi](https://github.com/badlogic/pi-mono) package that customizes the **working message** shown while the agent is busy.

It changes **only** the working message and nothing else:
- no footer changes
- no title bar changes
- no thinking-label changes
- no extra UI widgets

For each request, `pi-working-message` shows exactly **one phrase**. The phrase does **not** rotate during the same response.

## Features

- JSON-based configuration
- global and project-level config support
- `random` and `round-robin` phrase selection
- safe defaults
- standard pi package layout

## Default behavior

By default, the package is:
- `enabled: true`
- `selection: "random"`

If you install it and do nothing else, it will work out of the box.

## Installation

### Install from npm

```bash
pi install npm:pi-working-message
```

To update later:

```bash
pi update npm:pi-working-message
```

### Install from GitHub

```bash
pi install https://github.com/viartemev/pi-working-message@v0.1.0
```

### Install from a local path

```bash
pi install /absolute/path/to/pi-working-message
```

If pi is already running, execute:

```bash
/reload
```

## Configuration

The package reads configuration in this order:

1. `~/.pi/agent/working-message.json`
2. `.pi/working-message.json`

If both files exist, the project-level config overrides the global one.
If neither exists, built-in defaults are used.

### Example config

```json
{
  "$schema": "https://raw.githubusercontent.com/viartemev/pi-working-message/main/schemas/working-message.schema.json",
  "enabled": true,
  "selection": "random",
  "phrases": [
    "Looking into it",
    "Working on it",
    "One moment"
  ]
}
```

### Config fields

- `enabled`: `true` or `false`
- `selection`: `"random"` or `"round-robin"`
- `phrases`: array of strings

## Commands

- `/working-message` — show current status and config source
- `/working-message preview` — preview the next phrase

## Notes

- one request = one phrase
- config is reloaded on every request
- if the JSON config is invalid, the package shows a warning and falls back to pi's default working-message behavior for that turn

## Package manifest

This repository is a standard pi package:

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
