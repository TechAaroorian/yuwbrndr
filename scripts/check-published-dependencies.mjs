import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
  for (const [name, spec] of Object.entries(pkg[section] || {})) {
    if (/^(?:file:|link:|workspace:|\.\.?[\\/]|[A-Za-z]:[\\/])/.test(spec)) throw new Error(`Local dependency cannot ship: ${name} = ${spec}`);
    if (!name.startsWith('@techaaroorian-ui/')) continue;
    if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(spec)) throw new Error(`Pin ${name} to an exact published version.`);
    const entry = lock.packages?.[`node_modules/${name}`];
    if (lock.packages?.['']?.[section]?.[name] !== spec || entry?.version !== spec || !entry?.resolved?.startsWith('https://registry.npmjs.org/') || !entry.integrity || entry.link) {
      throw new Error(`Lockfile must resolve ${name}@${spec} from npm.`);
    }
  }
}
let local;
try { local = await readFile(join(root, '.cache/aar-loom-local.json')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (local) throw new Error('Local Aar Loom preview is active. Publish the framework changes, pin that version, then run npm run loom:published before release checks.');
console.log('Dependency manifests use registry versions; no local preview is active.');
