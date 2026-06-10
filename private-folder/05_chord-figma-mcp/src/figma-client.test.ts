import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test, beforeEach, afterEach } from "node:test";
import { fileURLToPath } from "node:url";

type ResolveContext = { parentURL?: string };
type ResolveResult = { shortCircuit?: boolean; url: string };
type NextResolve = (specifier: string, context: ResolveContext) => ResolveResult;

const moduleApi = (await import("node:module")) as unknown as {
  registerHooks?: (hooks: {
    resolve: (specifier: string, context: ResolveContext, nextResolve: NextResolve) => ResolveResult;
  }) => void;
};

moduleApi.registerHooks?.({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL && specifier.startsWith(".") && specifier.endsWith(".js")) {
      const tsUrl = new URL(specifier.replace(/\.js$/, ".ts"), context.parentURL);
      if (existsSync(fileURLToPath(tsUrl))) {
        return { shortCircuit: true, url: tsUrl.href };
      }
    }

    return nextResolve(specifier, context);
  },
});

const [{ getNodes }, { FigmaAuthError, FigmaNotFoundError, FigmaRateLimitError }] =
  await Promise.all([import("./figma-client.js"), import("./errors.js")]);

const originalFetch = globalThis.fetch;
const originalToken = process.env.FIGMA_ACCESS_TOKEN;
const nodesUrl = "https://api.figma.com/v1/files/file-key/nodes?ids=1:2";

beforeEach(() => {
  process.env.FIGMA_ACCESS_TOKEN = "test-token";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) {
    delete process.env.FIGMA_ACCESS_TOKEN;
  } else {
    process.env.FIGMA_ACCESS_TOKEN = originalToken;
  }
});

function mockFetch(status: number, body: unknown, headers: Record<string, string> = {}): void {
  const bodyText = typeof body === "string" ? body : JSON.stringify(body);
  const normalizedHeaders = new Map(
    Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]),
  );

  globalThis.fetch = (async () =>
    ({
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get(name: string): string | null {
          return normalizedHeaders.get(name.toLowerCase()) ?? null;
        },
      },
      text: async () => bodyText,
      json: async () => body,
    }) as Response) as typeof fetch;
}

async function assertFigmaError(
  expectedName: string,
  isExpectedError: (error: unknown) => boolean,
  expectedStatus: number,
  expectedUrl?: string,
  expectedRetryAfter?: number,
): Promise<void> {
  await assert.rejects(
    () => getNodes("file-key", ["1:2"]),
    (error: unknown) => {
      assert(error instanceof Error);
      assert.equal(isExpectedError(error), true);
      assert.equal(error.name, expectedName);
      assert.equal((error as { status?: number }).status, expectedStatus);

      if (expectedUrl !== undefined) {
        assert.equal((error as { url?: string }).url, expectedUrl);
      }

      if (expectedRetryAfter !== undefined) {
        assert.equal((error as { retryAfter?: number }).retryAfter, expectedRetryAfter);
      }

      return true;
    },
  );
}

test("401 throws FigmaAuthError with status and URL", async () => {
  mockFetch(401, "unauthorized");

  await assertFigmaError(
    "FigmaAuthError",
    (error) => error instanceof FigmaAuthError,
    401,
    nodesUrl,
  );
});

test("403 throws FigmaAuthError with status", async () => {
  mockFetch(403, "forbidden");

  await assertFigmaError("FigmaAuthError", (error) => error instanceof FigmaAuthError, 403);
});

test("404 throws FigmaNotFoundError", async () => {
  mockFetch(404, "missing");

  await assertFigmaError(
    "FigmaNotFoundError",
    (error) => error instanceof FigmaNotFoundError,
    404,
  );
});

test("429 throws FigmaRateLimitError with Retry-After seconds", async () => {
  mockFetch(429, "rate limited", { "Retry-After": "30" });

  await assertFigmaError(
    "FigmaRateLimitError",
    (error) => error instanceof FigmaRateLimitError,
    429,
    undefined,
    30,
  );
});

test("500 keeps generic Error behavior", async () => {
  mockFetch(500, "server down");

  await assert.rejects(
    () => getNodes("file-key", ["1:2"]),
    (error: unknown) => {
      assert(error instanceof Error);
      assert.equal(error.name, "Error");
      assert.equal(error.message, "Figma API error 500: server down");
      assert.equal((error as { status?: number }).status, undefined);
      return true;
    },
  );
});

test("200 returns normal JSON from getNodes", async () => {
  const payload = { nodes: { "1:2": { document: { id: "1:2" } } } };
  mockFetch(200, payload);

  const result = await getNodes("file-key", ["1:2"]);

  assert.deepEqual(result, payload);
});
