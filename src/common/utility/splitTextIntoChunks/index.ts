export const MAX_LENGTH = 256000; // Maximum characters allowed per request

// Function to split large text into chunks
export function splitTextIntoChunks(text, maxLength) {
  const chunks = [];
  while (text.length > 0) {
    let chunkSize = text.length > maxLength ? maxLength : text.length;
    let chunk = text.substring(0, chunkSize);
    chunks.push(chunk);
    text = text.substring(chunkSize);
  }
  return chunks;
}
