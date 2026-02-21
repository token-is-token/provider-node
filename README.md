# Provider Node

LLM Share Network Provider Node - Share your API quota and earn rewards

## Features

- **LLM Integration**: Support for Anthropic, OpenAI, and Seedance providers
- **P2P Network**: Distributed peer-to-peer network using libp2p
- **Blockchain**: Ethereum-based staking and reward system
- **Local Proxy**: HTTP proxy for request forwarding
- **Desktop App**: Cross-platform desktop application built with Tauri

## System Requirements

- Node.js 18+
- Rust 1.70+
- 4GB RAM minimum
- 10GB disk space

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Building

### Web Build
```bash
npm run build
```

### Desktop App
```bash
npm run tauri build
```

## Usage

1. Configure your LLM provider API key in Settings
2. Set your preferred models and quota
3. Start the node
4. Start earning SHARE tokens

## Configuration

Configuration is stored in `config.json` and encrypted.

## License

MIT
