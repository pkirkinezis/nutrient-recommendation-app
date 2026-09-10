import { rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const entryPath = path.join(scriptDir, `.tmp.checkStorage.${process.pid}.ts`);
const bundlePath = path.join(scriptDir, `.tmp.checkStorage.${process.pid}.mjs`);

const source = `
export {
  isStoredLabResults,
  isStoredStringArray,
  isStoredSyncMeta,
  isStoredTrackingData,
  isStoredUserProfile,
} from '../src/utils/browserStorage.ts';
`;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

try {
  writeFileSync(entryPath, source, 'utf8');
  await build({
    entryPoints: [entryPath],
    outfile: bundlePath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: ['node20'],
    logLevel: 'silent',
  });
  const validators = await import(`${pathToFileURL(bundlePath).href}?v=${Date.now()}`);

  assert(validators.isStoredStringArray(['magnesium']), 'Expected string arrays to be accepted.');
  assert(!validators.isStoredStringArray(['magnesium', 4]), 'Expected mixed arrays to be rejected.');
  assert(validators.isStoredUserProfile({ diet: 'vegan', weightKg: 70 }), 'Expected a valid profile to pass.');
  assert(!validators.isStoredUserProfile({ diet: 'invalid' }), 'Expected invalid profile enums to be rejected.');
  assert(!validators.isStoredUserProfile({ medications: 'warfarin' }), 'Expected malformed medication lists to be rejected.');

  const tracking = {
    startDate: '2026-09-09',
    supplements: ['magnesium'],
    logs: [{
      date: '2026-09-09',
      sleepQuality: 4,
      energyLevel: 3,
      mood: 4,
      focus: 3,
      recovery: 4,
      supplementsTaken: ['magnesium'],
    }],
  };
  assert(validators.isStoredTrackingData(tracking), 'Expected valid tracking data to pass.');
  assert(!validators.isStoredTrackingData({ ...tracking, logs: [{ ...tracking.logs[0], mood: 9 }] }), 'Expected invalid ratings to be rejected.');
  assert(validators.isStoredLabResults([{ id: 'lab-1', name: 'Vitamin D', value: 30, unit: 'ng/mL' }]), 'Expected valid labs to pass.');
  assert(!validators.isStoredLabResults([{ id: 'lab-1', name: 'Vitamin D', value: '30', unit: 'ng/mL' }]), 'Expected non-numeric lab values to be rejected.');
  assert(validators.isStoredSyncMeta({ profileUpdatedAt: 0, stackUpdatedAt: 0, trackingUpdatedAt: 0, labsUpdatedAt: 0 }), 'Expected valid sync metadata to pass.');

  console.log('Browser storage validation checks passed.');
} finally {
  rmSync(entryPath, { force: true });
  rmSync(bundlePath, { force: true });
}
