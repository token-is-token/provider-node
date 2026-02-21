import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function exec(command: string): void {
  console.log(`Executing: ${command}`);
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

function build() {
  console.log('Building provider-node...');

  if (!existsSync(join(rootDir, 'dist'))) {
    mkdirSync(join(rootDir, 'dist'));
  }

  exec('npx vite build');
  
  if (existsSync(join(rootDir, 'src-tauri'))) {
    exec('npm run tauri build');
  }

  console.log('Build completed!');
}

build();
