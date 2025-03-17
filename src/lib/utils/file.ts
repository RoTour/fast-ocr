export const bufferToFile = (buffer: Buffer, filename: string, mimeType: string): File => {
  const content = buffer.toString('utf8');
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};