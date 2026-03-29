/**
 * Auto-add Swagger parameters/requestBody to route files.
 *
 * Heuristics (safe/minimal):
 * - Query params: detects `searchParams.get("...")` and adds them to GET if missing parameters.
 * - JSON body params: detects `const { a, b } = await req.json()` style and adds requestBody to POST/PUT/PATCH if missing requestBody.
 * - FormData params: detects `await req.formData()` + `formData.get("...")` and adds multipart/form-data requestBody if missing.
 *
 * This is best-effort documentation; it won't perfectly infer required/optional.
 */
const fs = require("fs");
const path = require("path");
const glob = require("glob");

function uniq(arr) {
  return [...new Set(arr)].filter(Boolean);
}

function findAll(re, s) {
  const out = [];
  let m;
  while ((m = re.exec(s)) !== null) out.push(m);
  return out;
}

function inferQueryParams(content) {
  const matches = findAll(/searchParams\.get\(\s*["'`]([^"'`]+)["'`]\s*\)/g, content);
  return uniq(matches.map((m) => m[1]));
}

function inferFormDataKeys(content) {
  // If formData.get is used, assume multipart/form-data. Ignore array-ish keys like documents[0] by keeping as-is.
  const matches = findAll(/formData\.get\(\s*["'`]([^"'`]+)["'`]\s*\)/g, content);
  return uniq(matches.map((m) => m[1]));
}

function inferJsonBodyKeys(content) {
  // Try to capture destructuring: const { a, b } = await req.json();
  // Works for `req` or `request`
  const m = content.match(/const\s*\{\s*([^}]+)\s*}\s*=\s*await\s*(?:req|request)\.json\(\s*\)\s*;/);
  if (!m) return [];
  const inside = m[1];
  return uniq(
    inside
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => x.split(":")[0].trim()) // handle renames: a: alias
      .map((x) => x.replace(/\s*=.*$/, "")) // default values
  );
}

function swaggerBlockFor(method, { queryParams, jsonKeys, formKeys }) {
  const m = method.toLowerCase();
  const lines = [];

  if (m === "get" && queryParams.length) {
    lines.push(" *     parameters:");
    for (const p of queryParams) {
      lines.push(" *       - in: query");
      lines.push(` *         name: ${p}`);
      lines.push(" *         schema:");
      lines.push(" *           type: string");
      lines.push(" *         description: Paramètre de requête");
    }
  }

  if ((m === "post" || m === "put" || m === "patch") && (jsonKeys.length || formKeys.length)) {
    lines.push(" *     requestBody:");
    lines.push(" *       required: true");
    lines.push(" *       content:");
    if (formKeys.length) {
      lines.push(" *         multipart/form-data:");
      lines.push(" *           schema:");
      lines.push(" *             type: object");
      if (formKeys.length) {
        lines.push(" *             properties:");
        for (const k of formKeys) {
          // Heuristic: if key suggests file -> binary
          const isFile = /(photo|file|document|documents|image|avatar|piece|license|id_)/i.test(k);
          lines.push(` *               ${k}:`);
          lines.push(" *                 type: string");
          if (isFile) lines.push(" *                 format: binary");
        }
      }
    } else {
      lines.push(" *         application/json:");
      lines.push(" *           schema:");
      lines.push(" *             type: object");
      if (jsonKeys.length) {
        lines.push(" *             properties:");
        for (const k of jsonKeys) {
          lines.push(` *               ${k}:`);
          lines.push(" *                 type: string");
        }
      }
    }
  }

  return lines;
}

function enhanceSwaggerComment(content) {
  // Only operate on files that already have @swagger.
  if (!content.includes("@swagger")) return { content, changed: false };

  const queryParams = inferQueryParams(content);
  const formKeys = inferFormDataKeys(content);
  const jsonKeys = inferJsonBodyKeys(content);

  // Find swagger blocks (/** ... */) that contain @swagger
  const re = /\/\*\*[\s\S]*?\*\//g;
  const blocks = findAll(re, content);
  if (!blocks.length) return { content, changed: false };

  let changed = false;
  let newContent = content;

  for (const b of blocks.reverse()) {
    const block = b[0];
    if (!block.includes("@swagger")) continue;

    // If the block already contains parameters/requestBody, skip to avoid duplicating.
    // We'll still add for methods that have no params; but to keep safe, skip if any exists.
    const hasParameters = /\n\s*\*\s+parameters:\s*\n/.test(block);
    const hasRequestBody = /\n\s*\*\s+requestBody:\s*\n/.test(block);

    // Detect which methods are declared in the swagger block
    const methods = uniq(
      findAll(/\n\s*\*\s+(get|post|put|patch|delete)\s*:\s*\n/gi, block).map((m) => m[1].toLowerCase())
    );
    if (!methods.length) continue;

    // For each method, if params/body missing globally in block, add minimal inferred.
    // Insert right after the method line (and after summary/description/tags/security if present).
    let updatedBlock = block;
    for (const method of methods) {
      const methodRe = new RegExp(`\\n\\s*\\*\\s+${method}\\s*:\\\n`, "i");
      const methodMatch = updatedBlock.match(methodRe);
      if (!methodMatch) continue;

      const needsParams = method === "get" && queryParams.length && !hasParameters;
      const needsBody =
        (method === "post" || method === "put" || method === "patch") &&
        (jsonKeys.length || formKeys.length) &&
        !hasRequestBody;
      if (!needsParams && !needsBody) continue;

      const insertion = swaggerBlockFor(method, { queryParams, jsonKeys, formKeys });
      if (!insertion.length) continue;

      // Insert before responses if present, else near end of method section.
      // Simple approach: place after `security` block if present for this method; otherwise after method header.
      // We'll insert after the first occurrence of the method header line.
      const idx = updatedBlock.search(methodRe);
      if (idx === -1) continue;

      // Find insertion point: after method header line and any immediate summary/description/tags/security blocks.
      const afterHeaderIdx = idx + updatedBlock.slice(idx).match(methodRe)[0].length;
      const tail = updatedBlock.slice(afterHeaderIdx);

      // Scan lines until we hit another method at same indentation or path end or responses.
      const lines = tail.split("\n");
      let offsetLines = 0;
      for (; offsetLines < lines.length; offsetLines++) {
        const line = lines[offsetLines];
        if (/^\s*\*\s+(get|post|put|patch|delete)\s*:\s*$/.test(line)) break;
        if (/^\s*\*\s+responses\s*:\s*$/.test(line)) break;
      }
      const insertPos = afterHeaderIdx + lines.slice(0, offsetLines).join("\n").length + (offsetLines > 0 ? 1 : 0);

      updatedBlock =
        updatedBlock.slice(0, insertPos) +
        "\n" +
        insertion.join("\n") +
        updatedBlock.slice(insertPos);

      changed = true;
    }

    if (updatedBlock !== block) {
      newContent =
        newContent.slice(0, b.index) +
        updatedBlock +
        newContent.slice(b.index + block.length);
    }
  }

  return { content: newContent, changed };
}

function main() {
  const root = process.cwd();
  const files = glob.sync("app/api/**/route.ts", { nodir: true });
  let changedCount = 0;

  for (const file of files) {
    const abs = path.join(root, file);
    const orig = fs.readFileSync(abs, "utf8");
    const { content: next, changed } = enhanceSwaggerComment(orig);
    if (changed) {
      fs.writeFileSync(abs, next, "utf8");
      changedCount++;
    }
  }

  console.log(`swagger-autoparams: updated ${changedCount}/${files.length} files`);
}

if (require.main === module) {
  main();
}














