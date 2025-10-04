import pdf from "pdf-parse";
import axios from "axios";

export async function extractTextFromPDF(fileUrl) {
  const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
  const data = await pdf(res.data);
  return data.text;
}
