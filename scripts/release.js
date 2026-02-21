import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function exec(command: string): void {
  console.log(`Executing: ${command}`);
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

function release() {
  console.log('Creating release...');

  const version = process.argv[2];
  if (!version) {
    console.error('Please specify version: node scripts/release.js <version>');
    process.exit(1);
  }

  exec('npm run package');

  console.log(`Release ${version} created successfully!`);
}

release();
