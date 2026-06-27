import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // mirrors FileUploadField's default maxSizeMB on the frontend

function sanitizeOriginalName(originalName) {
  return originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

// Allowed MIME types for document/image uploads.
// NOTE: Android and some browsers send images as 'application/octet-stream'
// instead of 'image/jpeg' / 'image/png'. We therefore accept octet-stream as
// a fallback so uploads work on ALL devices, not just the developer's machine.
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/heic', 'image/heif',          // iOS HEIC photos
  'application/pdf',
  'application/octet-stream',           // Android fallback — validated by extension below
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.pdf',
]);

function fileFilter(_req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);
  const extOk  = ALLOWED_EXTENSIONS.has(ext);

  if (mimeOk || extOk) {
    callback(null, true);
  } else {
    callback(
      new Error(`File type not allowed: ${file.mimetype} (${ext}). Please upload an image or PDF.`),
      false,
    );
  }
}

function createUploader(subfolder) {
  const dest = path.join(__dirname, 'uploads', subfolder);

  const storage = multer.diskStorage({
    destination(req, file, callback) {
      // Auto-create the folder on any server so uploads never crash with ENOENT
      fs.mkdirSync(dest, { recursive: true });
      callback(null, dest);
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${sanitizeOriginalName(file.originalname)}`);
    },
  });

  return multer({ storage, limits: { fileSize: MAX_FILE_SIZE_BYTES }, fileFilter });
}

export const uploadRiderFiles = createUploader('riders');
export const uploadVendorFiles = createUploader('vendors');

export function filePath(file) {
  return file ? `uploads/${path.basename(path.dirname(file.path))}/${file.filename}` : null;
}

