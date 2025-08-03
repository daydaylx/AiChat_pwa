/**
 * Fügt die empfangenen Text-Chunks zu einem vollständigen Text zusammen.
 * Kann z. B. am Ende des Streamings genutzt werden, um finalen Text zu speichern.
 */
export async function collectStream(
  stream: AsyncGenerator<string, void, undefined>
): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    result += chunk;
  }
  return result;
}
