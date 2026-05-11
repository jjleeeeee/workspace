import { FigmaAuthError, FigmaNotFoundError, FigmaRateLimitError } from "./errors.js";

const BASE_URL = "https://api.figma.com/v1";

function getToken(): string {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) throw new Error("FIGMA_ACCESS_TOKEN is not set");
  return token;
}

async function figmaGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": getToken() },
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401 || res.status === 403) {
      throw new FigmaAuthError(`Figma API error ${res.status}: ${body}`, {
        status: res.status,
        url,
        body,
      });
    }

    if (res.status === 404) {
      throw new FigmaNotFoundError(`Figma API error ${res.status}: ${body}`, {
        status: res.status,
        url,
        body,
      });
    }

    if (res.status === 429) {
      const retryAfterHeader = res.headers.get("Retry-After");
      const retryAfter =
        retryAfterHeader === null ? undefined : Number.parseInt(retryAfterHeader, 10);

      throw new FigmaRateLimitError(`Figma API error ${res.status}: ${body}`, {
        status: res.status,
        url,
        body,
        retryAfter: Number.isNaN(retryAfter) ? undefined : retryAfter,
      });
    }

    throw new Error(`Figma API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function getNodes(fileKey: string, nodeIds: string[]): Promise<unknown> {
  return figmaGet(`/files/${fileKey}/nodes?ids=${nodeIds.join(",")}`);
}

export async function getLocalVariables(fileKey: string): Promise<unknown> {
  return figmaGet(`/files/${fileKey}/variables/local`);
}

export async function getImageUrl(fileKey: string, nodeId: string, scale = 3): Promise<unknown> {
  return figmaGet(`/images/${fileKey}?ids=${nodeId}&format=png&scale=${scale}`);
}

export async function getComponentMeta(componentKey: string): Promise<unknown> {
  return figmaGet(`/components/${componentKey}`);
}
