import { UploadedDocInfo } from "@/modules/gst/validation/complianceSchema";

export interface ResolvedDocType {
  isImage: boolean;
  isPdf: boolean;
  isSpreadsheet: boolean;
  resolvedMime: string;
  uti: string;
  typeLabel: string;
}

export type DocTypeInput = Partial<UploadedDocInfo> & {
  type?: string;
  fileTypeLabel?: string;
};

export function extractExtension(raw?: string): string {
  if (!raw) return "";
  const cleaned = raw.split("?")[0].split("#")[0];
  const lastSlash = Math.max(cleaned.lastIndexOf("/"), cleaned.lastIndexOf("\\"));
  const basename = lastSlash !== -1 ? cleaned.slice(lastSlash + 1) : cleaned;
  const dot = basename.lastIndexOf(".");
  return dot !== -1 ? basename.slice(dot).toLowerCase() : "";
}

export function getDocExtension(name?: string, uri?: string): string {
  const nameExt = extractExtension(name);
  if (nameExt) return nameExt;
  return extractExtension(uri);
}

export function resolveDocType(
  doc?: DocTypeInput | null
): ResolvedDocType {
  const ext = getDocExtension(doc?.name, doc?.uri);
  const mime = (doc?.mimeType || "").toLowerCase();
  const label = (doc?.fileTypeLabel || "").toLowerCase();
  const rawType = (doc?.type || "").toLowerCase();

  const isImage =
    mime.startsWith("image/") ||
    rawType.startsWith("image") ||
    label === "image" ||
    label === "jpg" ||
    label === "jpeg" ||
    label === "png" ||
    label === "webp" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png" ||
    ext === ".webp" ||
    ext === ".gif" ||
    ext === ".bmp";

  const isPdf =
    mime === "application/pdf" ||
    ext === ".pdf" ||
    label === "pdf" ||
    label.includes("pdf");

  const isSpreadsheet =
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    mime === "text/csv" ||
    label.includes("excel") ||
    label.includes("spreadsheet") ||
    label.includes("csv") ||
    label === "xls" ||
    label === "xlsx" ||
    ext === ".xlsx" ||
    ext === ".xls" ||
    ext === ".csv";

  let resolvedMime = mime || "application/octet-stream";
  let uti = "public.data";
  let typeLabel = "Document";

  if (isPdf) {
    resolvedMime = "application/pdf";
    uti = "com.adobe.pdf";
    typeLabel = "PDF Document";
  } else if (isImage) {
    if (ext === ".png" || mime === "image/png") {
      resolvedMime = "image/png";
      uti = "public.png";
      typeLabel = "PNG Image";
    } else if (ext === ".webp" || mime === "image/webp") {
      resolvedMime = "image/webp";
      uti = "org.webmproject.webp";
      typeLabel = "WebP Image";
    } else {
      resolvedMime = "image/jpeg";
      uti = "public.jpeg";
      typeLabel = "JPEG Image";
    }
  } else if (
    ext === ".xlsx" ||
    mime.includes("openxmlformats") ||
    label.includes("xlsx")
  ) {
    resolvedMime =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    uti = "org.openxmlformats.spreadsheetml.sheet";
    typeLabel = "Excel Spreadsheet (.xlsx)";
  } else if (ext === ".xls" || mime.includes("ms-excel") || label.includes("xls")) {
    resolvedMime = "application/vnd.ms-excel";
    uti = "com.microsoft.excel.xls";
    typeLabel = "Excel Spreadsheet (.xls)";
  } else if (ext === ".csv" || mime === "text/csv" || label.includes("csv")) {
    resolvedMime = "text/csv";
    uti = "public.comma-separated-values-text";
    typeLabel = "CSV Spreadsheet";
  }

  return { isImage, isPdf, isSpreadsheet, resolvedMime, uti, typeLabel };
}

