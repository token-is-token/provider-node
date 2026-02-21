# Deployment Guide

## Production Build

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Platform-specific build tools

### Build Commands

```bash
npm run package
```

### Output

Built packages will be in:
- macOS: `src-tauri/target/release/bundle/dmg/`
- Windows: `src-tauri/target/release/bundle/nsis/`
- Linux: `src-tauri/target/release/bundle/deb/`

## Docker

Build Docker image:
```bash
docker build -t provider-node .
```

Run container:
```bash
docker run -d -p 8080:8080 provider-node
```

## Environment Variables

- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `NODE_ENV` - Environment (development, production)
