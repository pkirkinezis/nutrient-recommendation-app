import { collection, doc, getDoc, getDocs, setDoc, type Firestore } from "firebase/firestore";
import type { CloudProfile, CloudSettings, CloudStack, DailyLog, LabResult, LocalSyncMeta, TrackingData, UserProfile } from "../types";

const SCHEMA_VERSION = 1;

const normalizeLogs = (logs: DailyLog[]): DailyLog[] => {
  const seen = new Map<string, number>();
  return logs.map((log) => {
    if (log.id) return { ...log, updatedAt: log.updatedAt ?? 0 };
    const count = seen.get(log.date) ?? 0;
    seen.set(log.date, count + 1);
    const suffix = count > 0 ? `-${count}` : "";
    return {
      ...log,
      id: `log-${log.date}${suffix}`,
      updatedAt: log.updatedAt ?? 0,
    };
  });
};

const mergeLogs = (localLogs: DailyLog[], cloudLogs: DailyLog[]): DailyLog[] => {
  const normalizedLocal = normalizeLogs(localLogs);
  const normalizedCloud = normalizeLogs(cloudLogs);
  const merged = new Map<string, DailyLog>();
  const dateBuckets = new Map<string, DailyLog[]>();

  for (const log of [...normalizedLocal, ...normalizedCloud]) {
    const id = log.id ?? `${log.date}-${log.updatedAt ?? 0}`;
    const existing = merged.get(id);
    if (!existing || (log.updatedAt ?? 0) > (existing.updatedAt ?? 0)) {
      merged.set(id, log);
    }
  }

  for (const log of merged.values()) {
    const bucket = dateBuckets.get(log.date) ?? [];
    bucket.push(log);
    dateBuckets.set(log.date, bucket);
  }

  const resolved: DailyLog[] = [];
  for (const [_date, logs] of dateBuckets.entries()) {
    if (logs.length === 1) {
      resolved.push(logs[0]);
      continue;
    }
    const sortedByUpdated = [...logs].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    const primary = sortedByUpdated[0];
    const conflicts = sortedByUpdated.slice(1).filter((log) => JSON.stringify(log) !== JSON.stringify(primary));
    resolved.push(primary, ...conflicts);
  }

  return resolved.sort((a, b) => b.date.localeCompare(a.date));
};

export interface CloudSnapshot {
  profile: CloudProfile | null;
  settings: CloudSettings | null;
  stack: CloudStack | null;
  logs: DailyLog[];
}

export const fetchCloudSnapshot = async (db: Firestore, uid: string): Promise<CloudSnapshot> => {
  const profileRef = doc(db, "users", uid, "profile", "data");
  const settingsRef = doc(db, "users", uid, "settings", "data");
  const stackRef = doc(db, "users", uid, "stacks", "current");
  const logsRef = collection(db, "users", uid, "logs");

  const [profileSnap, settingsSnap, stackSnap, logsSnap] = await Promise.all([
    getDoc(profileRef),
    getDoc(settingsRef),
    getDoc(stackRef),
    getDocs(logsRef),
  ]);

  const profile = profileSnap.exists() ? (profileSnap.data() as CloudProfile) : null;
  const settings = settingsSnap.exists() ? (settingsSnap.data() as CloudSettings) : null;
  const stack = stackSnap.exists() ? (stackSnap.data() as CloudStack) : null;
  const logs: DailyLog[] = [];
  for (const docSnap of logsSnap.docs) {
    const data = docSnap.data() as { entries?: DailyLog[] } & DailyLog;
    if (Array.isArray(data.entries)) {
      for (const entry of data.entries) {
        logs.push(entry);
      }
    } else {
      logs.push(data as DailyLog);
    }
  }

  return { profile, settings, stack, logs };
};

export interface LocalSyncState {
  profile: UserProfile;
  tracking: TrackingData;
  selectedSupplementIds: string[];
  labs: LabResult[];
  meta: LocalSyncMeta;
}

export interface SyncMergeResult {
  profile: UserProfile;
  tracking: TrackingData;
  selectedSupplementIds: string[];
  labs: LabResult[];
  meta: LocalSyncMeta;
}

export const mergeCloudIntoLocal = (local: LocalSyncState, cloud: CloudSnapshot): SyncMergeResult => {
  const nextMeta: LocalSyncMeta = { ...local.meta };
  let profile = local.profile;
  if (cloud.profile && cloud.profile.updatedAt > local.meta.profileUpdatedAt) {
    profile = cloud.profile.profile ?? {};
    nextMeta.profileUpdatedAt = cloud.profile.updatedAt;
  }

  let selectedSupplementIds = local.selectedSupplementIds;
  if (cloud.stack && cloud.stack.updatedAt > local.meta.stackUpdatedAt) {
    selectedSupplementIds = cloud.stack.supplementIds ?? [];
    nextMeta.stackUpdatedAt = cloud.stack.updatedAt;
  }

  let tracking = local.tracking;
  let labs = local.labs;
  if (cloud.settings && cloud.settings.updatedAt > Math.max(local.meta.trackingUpdatedAt, local.meta.labsUpdatedAt)) {
    tracking = {
      ...tracking,
      startDate: cloud.settings.trackingStartDate ?? tracking.startDate,
      supplements: cloud.settings.trackingSupplements ?? tracking.supplements,
    };
    labs = cloud.settings.labs ?? labs;
    nextMeta.trackingUpdatedAt = cloud.settings.updatedAt;
    nextMeta.labsUpdatedAt = cloud.settings.updatedAt;
  }

  if (cloud.logs.length > 0) {
    const mergedLogs = mergeLogs(tracking.logs, cloud.logs);
    tracking = {
      ...tracking,
      logs: mergedLogs,
    };
  }

  return { profile, tracking, selectedSupplementIds, labs, meta: nextMeta };
};

export interface UploadPayload {
  profile: UserProfile;
  tracking: TrackingData;
  selectedSupplementIds: string[];
  labs: LabResult[];
}

export const uploadLocalSnapshot = async (db: Firestore, uid: string, payload: UploadPayload): Promise<void> => {
  const now = Date.now();
  const profileRef = doc(db, "users", uid, "profile", "data");
  const settingsRef = doc(db, "users", uid, "settings", "data");
  const stackRef = doc(db, "users", uid, "stacks", "current");

  const profileDoc: CloudProfile = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: now,
    profile: payload.profile,
  };
  const settingsDoc: CloudSettings = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: now,
    trackingStartDate: payload.tracking.startDate,
    trackingSupplements: payload.tracking.supplements,
    labs: payload.labs,
  };
  const stackDoc: CloudStack = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: now,
    supplementIds: payload.selectedSupplementIds,
  };

  await Promise.all([
    setDoc(profileRef, profileDoc, { merge: true }),
    setDoc(settingsRef, settingsDoc, { merge: true }),
    setDoc(stackRef, stackDoc, { merge: true }),
  ]);

  const logBuckets = new Map<string, DailyLog[]>();
  for (const log of payload.tracking.logs) {
    const existing = logBuckets.get(log.date) ?? [];
    existing.push({
      ...log,
      id: log.id ?? `log-${log.date}`,
      updatedAt: log.updatedAt ?? now,
    });
    logBuckets.set(log.date, existing);
  }

  const logWrites = Array.from(logBuckets.entries()).map(([date, entries]) => {
    const logRef = doc(db, "users", uid, "logs", date);
    const updatedAt = entries.reduce((max, entry) => Math.max(max, entry.updatedAt ?? 0), now);
    return setDoc(
      logRef,
      {
        schemaVersion: SCHEMA_VERSION,
        updatedAt,
        date,
        entries,
      },
      { merge: true }
    );
  });

  await Promise.all(logWrites);
};

export const buildLocalSyncMeta = (meta?: Partial<LocalSyncMeta>): LocalSyncMeta => ({
  profileUpdatedAt: meta?.profileUpdatedAt ?? 0,
  stackUpdatedAt: meta?.stackUpdatedAt ?? 0,
  trackingUpdatedAt: meta?.trackingUpdatedAt ?? 0,
  labsUpdatedAt: meta?.labsUpdatedAt ?? 0,
});
