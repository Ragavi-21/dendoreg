import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, initializeDatabase } from './db.js';
import { uploadRiderFiles, uploadVendorFiles, filePath } from './upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins — works for every device/browser including mobile on other networks
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // Handle pre-flight for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Some devices send form data URL-encoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/status', async (req, res) => {
  try {
    const [riderCount, vendorCount] = await Promise.all([
      query('SELECT COUNT(*) FROM rider_registrations'),
      query('SELECT COUNT(*) FROM vendor_registrations'),
    ]);
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      counts: {
        riderRegistrations: parseInt(riderCount.rows[0].count),
        vendorRegistrations: parseInt(vendorCount.rows[0].count),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ── POST /api/rider-registrations ─────────────────────────────────────────────
app.post(
  '/api/rider-registrations',
  uploadRiderFiles.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'idProofFile', maxCount: 1 },
    { name: 'drivingLicenseFile', maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      firstName, lastName, mobileNumber, email, gender,
      state, city, fullAddress, latitude, longitude, locationAddress,
      vehicleType, idProofType, drivingLicenseNumber,
    } = req.body;

    const profilePicture     = req.files?.profilePicture?.[0];
    const idProofFile        = req.files?.idProofFile?.[0];
    const drivingLicenseFile = req.files?.drivingLicenseFile?.[0];

    if (
      !firstName || !lastName || !mobileNumber || !email || !gender ||
      !state || !city || !fullAddress || !latitude || !longitude ||
      !vehicleType || !idProofType || !drivingLicenseNumber ||
      !idProofFile || !drivingLicenseFile
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields and upload the required documents.',
      });
    }

    try {
      const result = await query(
        `INSERT INTO rider_registrations (
           first_name, last_name, mobile_number, email, gender,
           state, city, full_address, latitude, longitude, location_address,
           vehicle_type, id_proof_type, driving_license_number,
           profile_picture_path, id_proof_file_path, driving_license_file_path
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         RETURNING *`,
        [
          firstName, lastName, mobileNumber, email, gender,
          state, city, fullAddress, latitude, longitude, locationAddress || null,
          vehicleType, idProofType, drivingLicenseNumber,
          filePath(profilePicture), filePath(idProofFile), filePath(drivingLicenseFile),
        ],
      );
      res.status(201).json({ success: true, message: 'Rider registration submitted successfully!', data: result.rows[0] });
    } catch (error) {
      console.error('❌ rider-registrations POST:', error.message);
      res.status(500).json({ success: false, message: 'Server error. Failed to submit rider registration.', error: error.message });
    }
  },
);

// ── POST /api/vendor-registrations ───────────────────────────────────────────
app.post(
  '/api/vendor-registrations',
  uploadVendorFiles.fields([
    { name: 'shopLogo',          maxCount: 5 },
    { name: 'shopBanner',        maxCount: 5 },
    { name: 'menuFiles',         maxCount: 5 },
    { name: 'gstCertificate',    maxCount: 5 },
    { name: 'fssaiCertificate',  maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      shopName, ownerName, ownerMobile, shopMobile,
      state, city, shopAddress, latitude, longitude, locationAddress,
      deliveryTime, openingTime, closingTime,
      gstRegistration, fssaiNumber, fssaiExpiryDate,
    } = req.body;

    const shopLogo         = req.files?.shopLogo        || [];
    const shopBanner       = req.files?.shopBanner       || [];
    const menuFiles        = req.files?.menuFiles        || [];
    const gstCertificate   = req.files?.gstCertificate   || [];
    const fssaiCertificate = req.files?.fssaiCertificate?.[0];

    if (
      !shopName || !ownerName || !ownerMobile ||
      !state || !city || !shopAddress || !latitude || !longitude ||
      !deliveryTime || !openingTime || !closingTime ||
      !fssaiNumber || !fssaiExpiryDate ||
      menuFiles.length === 0 || !fssaiCertificate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields and upload the required documents.',
      });
    }

    try {
      const result = await query(
        `INSERT INTO vendor_registrations (
           shop_name, owner_name, owner_mobile, shop_mobile,
           state, city, shop_address, latitude, longitude, location_address,
           delivery_time, opening_time, closing_time,
           gst_registration, fssai_number, fssai_expiry_date,
           shop_logo_paths, shop_banner_paths, menu_file_paths,
           gst_certificate_paths, fssai_certificate_path
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         RETURNING *`,
        [
          shopName, ownerName, ownerMobile, shopMobile || null,
          state, city, shopAddress, latitude, longitude, locationAddress || null,
          deliveryTime, openingTime, closingTime,
          gstRegistration || null, fssaiNumber, fssaiExpiryDate,
          shopLogo.map(filePath),
          shopBanner.map(filePath),
          menuFiles.map(filePath),
          gstCertificate.map(filePath),
          filePath(fssaiCertificate),
        ],
      );
      res.status(201).json({ success: true, message: 'Vendor registration submitted successfully!', data: result.rows[0] });
    } catch (error) {
      console.error('❌ vendor-registrations POST:', error.message);
      res.status(500).json({ success: false, message: 'Server error. Failed to submit vendor registration.', error: error.message });
    }
  },
);

// ── Admin: GET + DELETE for both tables ───────────────────────────────────────
const ADMIN_ROUTES = {
  'rider-registrations':  'rider_registrations',
  'vendor-registrations': 'vendor_registrations',
};

Object.entries(ADMIN_ROUTES).forEach(([route, table]) => {
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const result = await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error(`❌ GET ${table}:`, error.message);
      res.status(500).json({ success: false, message: `Failed to fetch ${table}.`, error: error.message });
    }
  });

  app.delete(`/api/${route}/:id`, async (req, res) => {
    try {
      const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Record not found.' });
      }
      res.json({ success: true, message: 'Record deleted.', data: result.rows[0] });
    } catch (error) {
      console.error(`❌ DELETE ${table}:`, error.message);
      res.status(500).json({ success: false, message: `Failed to delete from ${table}.`, error: error.message });
    }
  });
});

// ── Multer error handler ──────────────────────────────────────────────────────
// Multer errors (LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, etc.) bypass the
// route try/catch and go straight to Express error middleware. Without this,
// all devices except the developer's own machine see a raw 500 with no JSON
// body — which is why "Something went wrong" appears on other devices.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error.';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `File is too large. Maximum allowed size is 10 MB.`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field: "${err.field}". Please refresh and try again.`;
    }
    console.error('❌ Multer error:', err.code, err.message);
    return res.status(400).json({ success: false, message });
  }
  // Generic server errors
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ── Serve the built frontend (same origin as the API) ────────────────────────
// In production the frontend's relative fetch('/api/...') calls (see
// dendoreg/frontend/src/api/registrations.js) only work if the frontend and
// backend share an origin — Vite's dev proxy (vite.config.js) doesn't exist
// once you `vite build`. Serving the built dist/ from this same Express
// process means dendoregister.in can host both with no separate API domain
// or CORS configuration needed.
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));
app.get(/^(?!\/api|\/uploads).*/, (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await initializeDatabase();
    let port = PORT;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const server = app.listen(port, () => {
            console.log(`🚀 DendoReg backend running on port ${port}`);
            resolve();
          });
          server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.warn(`⚠️  Port ${port} in use, trying ${port + 1}…`);
              server.close();
              reject(err);
            } else {
              reject(err);
            }
          });
        });
        break;
      } catch (err) {
        if (err.code === 'EADDRINUSE') { port++; continue; }
        throw err;
      }
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
