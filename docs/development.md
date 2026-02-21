# Development Guide

## Prerequisites

- Node.js 18+
- Rust 1.70+
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/main/` - Main process (Tauri backend)
- `src/renderer/` - Renderer process (React frontend)
- `src/core/` - Core business logic
- `src/utils/` - Utility functions
- `src-tauri/` - Tauri Rust code

## Building

### Web Only
```bash
npm run build
```

### Desktop App
```bash
npm run tauri build
```

## Testing

```bash
npm run test
```

## Linting

```bash
npm run lint
```
