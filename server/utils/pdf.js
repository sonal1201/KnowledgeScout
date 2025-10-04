import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  // Simple split by page (pdf-parse returns all text; can split if needed)
  const pages = data.text.split(/\f/); 
  return pages;
}
