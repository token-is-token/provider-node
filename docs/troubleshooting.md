# Troubleshooting

## Common Issues

### Port Already in Use

If you get "Port 8080 is already in use":
```bash
lsof -i :8080
kill <PID>
```

### Build Failures

1. Clean node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clean Tauri build:
   ```bash
   cd src-tauri
   cargo clean
   ```

### Node Connection Issues

1. Check firewall settings
2. Verify bootstrap nodes are reachable
3. Check logs for error messages

## Logs

- Application logs: `logs/provider-node.log`
- Tauri logs: Check system console output

## Getting Help

If you encounter issues not listed here, please open an issue on GitHub.
