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

- works as soon as the extension is installed
- random phrase selection
- safe defaults
- standard pi package layout

## Default behavior

If the extension is installed, it is enabled. No config file is needed.

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

## Commands

- `/working-message` — show current status
- `/working-message preview` — preview the next phrase

## Notes

- one request = one phrase
- phrases are built into the extension
- uninstall or disable the extension to stop changing the working message

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
