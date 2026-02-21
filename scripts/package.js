import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function exec(command: string): void {
  console.log(`Executing: ${command}`);
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

function packageApp() {
  console.log('Packaging provider-node...');

  const version = process.argv[2] || '1.0.0';
  const platform = process.argv[3] || process.platform;

  exec(`npm run build`);
  
  if (platform === 'darwin') {
    exec('npm run tauri build -- --bundles dmg');
  } else if (platform === 'win32') {
    exec('npm run tauri build -- --bundles nsis');
  } else {
    exec('npm run tauri build -- --bundles deb,AppImage');
  }

  console.log(`Packaged version ${version} for ${platform}`);
}

packageApp();
