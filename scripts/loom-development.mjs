import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv[2] || 'status';
const marker = join(root, '.cache', 'aar-loom-local.json');
const npmCli = process.env.npm_execpath;
const run = (args, cwd = root) => {
  if (!npmCli) throw new Error('Use an npm run loom:* command.');
  execFileSync(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit' });
};
const tracked = ['package.json', 'package-lock.json'];
const before = await Promise.all(tracked.map(name => readFile(join(root, name))));
const verifyTracked = async () => {
  for (let index = 0; index < tracked.length; index++) {
    if (!before[index].equals(await readFile(join(root, tracked[index])))) {
      throw new Error(`${tracked[index]} changed unexpectedly. Inspect git diff before continuing.`);
    }
  }
};
if (mode === 'local') {
  const source = resolve(root, process.argv[3] || '../techaaroorian-ui');
  const sourcePackage = JSON.parse(await readFile(join(source, 'packages/aar-loom/package.json'), 'utf8'));
  if (sourcePackage.name !== '@techaaroorian-ui/aar-loom') throw new Error('Source is not the Aar Loom workspace.');
  run(['run', 'dev:pack:loom'], source);
  const pack = JSON.parse(await readFile(join(source, '.cache/aar-loom-local/latest.json'), 'utf8'));
  const digest = createHash('sha256').update(await readFile(pack.tarball)).digest('hex');
  if (pack.name !== sourcePackage.name || digest !== pack.sha256) throw new Error('Local pack metadata does not match its tarball.');
  const staging = join(root, '.cache', 'aar-loom-install');
  await mkdir(staging, { recursive: true });
  await writeFile(join(staging, 'package.json'), JSON.stringify({ private: true, name: 'yuwbrndr-local-loom-preview' }) + '\n');
  await writeFile(marker, JSON.stringify({ ...pack, source, mode: 'local', status: 'installing' }, null, 2) + '\n');
  // Install in isolation so npm cannot re-resolve Yuwbrndr's unrelated dependencies.
  run(['install', '--prefix', staging, '--no-save', '--package-lock=false', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', join(root, '.cache/npm'), pack.tarball]);
  await cp(join(staging, 'node_modules/@techaaroorian-ui/aar-loom'), join(root, 'node_modules/@techaaroorian-ui/aar-loom'), { recursive: true, force: true });
  await verifyTracked();
  await mkdir(join(root, '.cache'), { recursive: true });
  await writeFile(marker, JSON.stringify({ ...pack, source, mode: 'local', status: 'ready' }, null, 2) + '\n');
  console.log('Local packed Aar Loom is installed. package.json and package-lock.json are unchanged. Restart Vite after updating the pack.');
} else if (mode === 'published') {
  run(['ci', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', join(root, '.cache/npm')]);
  await verifyTracked();
  try { await unlink(marker); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  console.log('Restored registry dependencies from the project lockfile. New framework APIs require a published version containing them.');
} else if (mode === 'check') {
  try { const local = JSON.parse(await readFile(marker, 'utf8')); if (local.status === 'installing') throw new Error('Aar Loom installation is in progress; wait before building.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const installed = JSON.parse(await readFile(join(root, 'node_modules/@techaaroorian-ui/aar-loom/package.json'), 'utf8'));
  if (!installed.exports?.['./button-groups.css']) throw new Error('Installed Aar Loom lacks button groups. Run npm run loom:local for development, or pin the next published alpha before release.');
  await readFile(join(root, 'node_modules/@techaaroorian-ui/aar-loom', installed.exports['./button-groups.css']));
  console.log(`Aar Loom ${installed.version}: required public button-group module is available.`);
} else if (mode === 'status') {
  try { const local = JSON.parse(await readFile(marker, 'utf8')); console.log(`Local preview selected: ${local.source}\nStatus: ${local.status || 'ready'}\nBase version: ${local.version}\nPacked SHA256: ${local.sha256}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; console.log('Published dependency mode; versions come from package.json and package-lock.json.'); }
} else throw new Error(`Unknown mode: ${mode}`);
