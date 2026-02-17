#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { getPositionIdFromExternalName } = require("../src/data/positionSourceMap.ts");

const USAGE = `
Usage:
  node scripts/importPositionData.mjs --input <file-or-url> [options]

Options:
  --output <file>         Output JSON file. Default: src/data/importedPositionData.json
  --source-name <value>   Default source name fallback for rows.
  --source-url <value>    Default source URL fallback for rows.
  --license <value>       Default license fallback for rows.
  --attribution <value>   Default attribution fallback for rows.
  --strict-mapping        Reject rows that cannot be mapped to internal position IDs.
  --help                  Show this help text.
`;

const parseArgs = (argv) => {
  const options = {
    input: "",
    output: path.resolve(process.cwd(), "src/data/importedPositionData.json"),
    sourceName: "",
    sourceUrl: "",
    license: "",
    attribution: "",
    strictMapping: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--strict-mapping") {
      options.strictMapping = true;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }

    if (arg === "--input") options.input = next.trim();
    else if (arg === "--output") options.output = path.resolve(process.cwd(), next);
    else if (arg === "--source-name") options.sourceName = next.trim();
    else if (arg === "--source-url") options.sourceUrl = next.trim();
    else if (arg === "--license") options.license = next.trim();
    else if (arg === "--attribution") options.attribution = next.trim();
    else throw new Error(`Unknown option: ${arg}`);

    index += 1;
  }

  return options;
};

const asNonEmptyString = (value) => (typeof value === "string" && value.trim() ? value.trim() : "");

const isHttpUrl = (value) => /^https?:\/\/\S+/i.test(value);

const readPath = (obj, pathExpression) =>
  pathExpression.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return acc[key];
  }, obj);

const pickString = (obj, pathExpressions) => {
  for (const pathExpression of pathExpressions) {
    const value = asNonEmptyString(readPath(obj, pathExpression));
    if (value) return value;
  }
  return "";
};

const pickStringArray = (obj, pathExpressions) => {
  for (const pathExpression of pathExpressions) {
    const value = readPath(obj, pathExpression);
    if (Array.isArray(value)) {
      return value.map((item) => asNonEmptyString(item)).filter(Boolean);
    }
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const unique = (values) => Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const normalizeText = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const containsAny = (text, terms) => terms.some((term) => text.includes(term));

const mapByKeywords = (combinedText) => {
  const text = normalizeText(combinedText);
  if (!text) return null;

  const has = (...terms) => containsAny(text, terms.map((term) => normalizeText(term)));

  if (has("reverse cowgirl")) return "top-facing-backward-supported";
  if (has("cowgirl", "woman on top", "girl on top")) {
    if (has("sideways", "side way", "sideway")) return "top-sideways-supported";
    return "top-facing-forward-supported";
  }

  if (has("missionary")) {
    if (has("low back", "low extension", "paced")) return "missionary-low-extension-b";
    return "missionary-supported-pelvis-elevated";
  }

  if (has("coital alignment technique", "cat position", "coital alignment")) {
    return "coital-alignment-technique-supported";
  }

  if (has("spooning", "spoon")) {
    if (has("face to face")) return "side-lying-face-to-face-variation";
    return "side-lying-support";
  }

  if (has("side lying", "side-lying", "side by side")) {
    if (has("face to face")) return "side-lying-face-to-face-variation";
    if (has("knee support", "knee supported")) return "knee-supported-side-angle";
    return "side-lying-support";
  }

  if (has("doggy style", "all fours", "rear entry")) {
    if (has("elevated", "counter", "wedge")) return "quadruped-supported-b";
    return "quadruped-supported-a";
  }

  if (has("lotus")) {
    if (has("reclined", "semi reclined")) return "semi-reclined-lotus-support";
    return "seated-face-to-face";
  }

  if (has("edge of bed", "bed edge")) return "edge-of-bed-assisted";
  if (has("chair")) return "chair-supported-neutral";
  if (has("bridge")) return "hip-neutral-pillow-bridge";
  if (has("counter")) return "counter-height-forearm-supported";
  if (has("standing", "wall")) return "supported-standing-wall-shift";
  if (has("standing")) return "supported-standing-wall-shift";
  if (has("seated", "facing away", "reverse seated")) return "reverse-facing-seated-support";
  if (has("seated", "face to face")) return "seated-face-to-face";
  if (has("reclined", "pillows", "pillow supported")) return "reclined-pillows";
  if (has("aftercare", "recovery", "cuddle")) return "intimacy-rest-reset";

  return null;
};

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.positions,
    payload.data,
    payload.items,
    payload.results,
    payload.entries,
    payload.export,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const extractPayloadDefaults = (payload) => ({
  sourceName: pickString(payload, ["sourceName", "source.name", "meta.sourceName", "metadata.sourceName"]),
  sourceUrl: pickString(payload, ["sourceUrl", "source.url", "meta.sourceUrl", "metadata.sourceUrl"]),
  license: pickString(payload, ["license", "meta.license", "metadata.license"]),
  attribution: pickString(payload, [
    "attribution",
    "source.attribution",
    "meta.attribution",
    "metadata.attribution",
  ]),
});

const toImportRecord = (row, index, defaults, options) => {
  const externalName = pickString(row, ["name", "title", "position", "positionName"]);
  const aliases = unique(
    pickStringArray(row, ["aliases", "alias", "aka", "alternateNames", "tags", "keywords"]),
  );
  const imageAlt = pickString(row, ["imageAlt", "alt", "description", "summary"]);
  const keywordMappedId = mapByKeywords([externalName, imageAlt, ...aliases].filter(Boolean).join(" "));

  const mappedDirect = externalName ? getPositionIdFromExternalName(externalName) : null;
  const mappedByAlias = aliases.find((alias) => getPositionIdFromExternalName(alias)) ?? "";
  const mappedByAliasId = mappedByAlias ? getPositionIdFromExternalName(mappedByAlias) : null;
  const mappedPositionId = mappedDirect ?? mappedByAliasId ?? keywordMappedId ?? null;

  const mappingConfidence = mappedDirect
    ? "exact"
    : mappedByAliasId
      ? "alias"
      : keywordMappedId
        ? "keyword"
        : "unmapped";

  const sourceName =
    pickString(row, ["sourceName", "source.name", "provider.name"]) ||
    options.sourceName ||
    defaults.sourceName;
  const sourceUrl =
    pickString(row, ["sourceUrl", "source.url", "provider.url"]) || options.sourceUrl || defaults.sourceUrl;
  const license = pickString(row, ["license", "source.license"]) || options.license || defaults.license;
  const attribution =
    pickString(row, ["attribution", "source.attribution"]) ||
    options.attribution ||
    defaults.attribution;

  return {
    externalId:
      pickString(row, ["id", "externalId", "slug"]) || `import-row-${String(index + 1).padStart(3, "0")}`,
    externalName,
    aliases,
    mappedPositionId,
    mappingConfidence,
    description: pickString(row, ["description", "summary", "notes", "imageAlt"]) || undefined,
    imageUrl:
      pickString(row, [
        "image",
        "imageUrl",
        "thumbnail",
        "thumbnailUrl",
        "url",
        "originalSrc",
        "src",
      ]) || undefined,
    imageAlt: imageAlt || undefined,
    source: {
      sourceName,
      sourceUrl,
      license,
      attribution,
    },
  };
};

const validateRecord = (record, index, strictMapping) => {
  const issues = [];
  const label = record.externalName || record.externalId;

  if (!record.externalName) issues.push(`Row ${index + 1} (${label}): missing position name.`);
  if (!record.source.sourceName) issues.push(`Row ${index + 1} (${label}): missing sourceName.`);
  if (!record.source.sourceUrl) issues.push(`Row ${index + 1} (${label}): missing sourceUrl.`);
  if (!record.source.license) issues.push(`Row ${index + 1} (${label}): missing license.`);
  if (!record.source.attribution) issues.push(`Row ${index + 1} (${label}): missing attribution.`);

  if (record.source.sourceUrl && !/^https?:\/\/\S+/i.test(record.source.sourceUrl)) {
    issues.push(`Row ${index + 1} (${label}): sourceUrl must be an absolute http(s) URL.`);
  }

  if (strictMapping && !record.mappedPositionId) {
    issues.push(`Row ${index + 1} (${label}): unmapped external name.`);
  }

  return issues;
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || !options.input) {
    console.log(USAGE.trim());
    process.exit(options.help ? 0 : 1);
  }

  const inputReference = options.input;
  const inputIsUrl = isHttpUrl(inputReference);
  const inputFile = inputIsUrl ? inputReference : path.resolve(process.cwd(), inputReference);
  let raw = "";

  if (inputIsUrl) {
    const response = await fetch(inputReference);
    if (!response.ok) {
      throw new Error(`Failed to fetch input URL: ${inputReference} (${response.status})`);
    }
    raw = await response.text();
  } else {
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    raw = fs.readFileSync(inputFile, "utf8");
  }

  const payload = JSON.parse(raw);
  const rows = extractRows(payload);
  if (rows.length === 0) {
    throw new Error("No position rows found. Expected an array or {positions|data|items|results} array.");
  }

  const defaults = extractPayloadDefaults(payload);
  const records = rows.map((row, index) => toImportRecord(row, index, defaults, options));

  const issues = records.flatMap((record, index) =>
    validateRecord(record, index, options.strictMapping),
  );
  if (issues.length > 0) {
    const detail = issues.map((issue) => `- ${issue}`).join("\n");
    throw new Error(`Import validation failed:\n${detail}`);
  }

  const mapped = records.filter((record) => Boolean(record.mappedPositionId)).length;
  const unmapped = records.filter((record) => !record.mappedPositionId).map((record) => record.externalName);

  const outputPayload = {
    generatedAt: new Date().toISOString(),
    inputFile,
    totalRows: records.length,
    mappedRows: mapped,
    unmappedRows: records.length - mapped,
    rows: records,
  };

  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(outputPayload, null, 2)}\n`, "utf8");

  console.log(`Imported ${records.length} rows.`);
  console.log(`Mapped ${mapped} rows to internal position IDs.`);
  console.log(`Wrote output to ${options.output}`);

  if (unmapped.length > 0) {
    const preview = unmapped.slice(0, 10).join(", ");
    console.log(`Unmapped names (${unmapped.length}): ${preview}`);
    if (unmapped.length > 10) console.log("Use --strict-mapping to reject unmapped rows.");
  }
};

try {
  await run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
