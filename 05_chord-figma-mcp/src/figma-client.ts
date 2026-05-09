const BASE_URL = "https://api.figma.com/v1";

function getToken(): string {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) throw new Error("FIGMA_ACCESS_TOKEN is not set");
  return token;
}

async function figmaGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Figma-Token": getToken() },
  });
  if (!res.ok) {
    const body = await res.text();
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
