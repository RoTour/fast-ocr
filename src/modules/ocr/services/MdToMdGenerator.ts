import * as IFileGenerator from './IFileGenerator';

type MdToMdGenerator = {
	generateFile: IFileGenerator.GenerateFile;
};

export const MdToMdGenerator = (): MdToMdGenerator => {
  return {
    generateFile: async (data: string[]) => {
      // Ensure strings are normalized before joining
      const normalizedData = data.map(str => {
        // This helps normalize special characters
        return str.normalize('NFC');
      });
      
      const markdownString = normalizedData.join('\n');
      
      // Create buffer with explicit UTF-8 encoding
      const buffer = Buffer.from(markdownString, 'utf8');
      
      return {
        file: buffer,
        error: null
      };
    }
  };
};