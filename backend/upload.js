import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // mirrors FileUploadField's default maxSizeMB on the frontend

function sanitizeOriginalName(originalName) {
  return originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

function createUploader(subfolder) {
  const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads', subfolder),
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${sanitizeOriginalName(file.originalname)}`);
    },
  });

  return multer({ storage, limits: { fileSize: MAX_FILE_SIZE_BYTES } });
}

export const uploadRiderFiles = createUploader('riders');
export const uploadVendorFiles = createUploader('vendors');

export function filePath(file) {
  return file ? `uploads/${path.basename(path.dirname(file.path))}/${file.filename}` : null;
}
