import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, initializeDatabase } from './db.js';
import { uploadRiderFiles, uploadVendorFiles, filePath } from './upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Diagnostic Health Check Route
app.get('/api/status', async (req, res) => {
  try {
    const zoneCount = await query('SELECT COUNT(*) FROM zone_requests');
    const contactCount = await query('SELECT COUNT(*) FROM contact_messages');
    const driverCount = await query('SELECT COUNT(*) FROM driver_applications');
    const vendorCount = await query('SELECT COUNT(*) FROM vendor_applications');
    const riderRegCount = await query('SELECT COUNT(*) FROM rider_registrations');
    const vendorRegCount = await query('SELECT COUNT(*) FROM vendor_registrations');

    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      counts: {
        zoneRequests: parseInt(zoneCount.rows[0].count),
        contactMessages: parseInt(contactCount.rows[0].count),
        driverApplications: parseInt(driverCount.rows[0].count),
        vendorApplications: parseInt(vendorCount.rows[0].count),
        riderRegistrations: parseInt(riderRegCount.rows[0].count),
        vendorRegistrations: parseInt(vendorRegCount.rows[0].count),
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// 1. Submit Zone Request
app.post('/api/zone-requests', async (req, res) => {
  const { state, district, area, message } = req.body;

  if (!state || !district || !area) {
    return res.status(400).json({
      success: false,
      message: 'State, District, and Area/Locality are required fields.'
    });
  }

  try {
    const result = await query(
      `INSERT INTO zone_requests (state, district, area, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [state, district, area, message || '']
    );

    res.status(201).json({
      success: true,
      message: 'Zone request submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving zone request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to submit zone request.',
      error: error.message
    });
  }
});

// 2. Submit Contact Message
app.post('/api/contact-messages', async (req, res) => {
  const { firstName, email, mobileNumber, queryType, message } = req.body;

  if (!firstName || !email || !mobileNumber || !queryType || !message) {
    return res.status(400).json({
      success: false,
      message: 'First Name, Email, Mobile Number, Query Type, and Message are required fields.'
    });
  }

  try {
    const result = await query(
      `INSERT INTO contact_messages (first_name, email, mobile_number, query_type, message) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [firstName, email, mobileNumber, queryType, message]
    );

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to send contact message.',
      error: error.message
    });
  }
});

// 3. Submit Driver Application
app.post('/api/driver-applications', async (req, res) => {
  const { name, phone, state, district, area, dob } = req.body;

  if (!name || !phone || !state || !district || !area || !dob) {
    return res.status(400).json({
      success: false,
      message: 'Name, Phone, State, District, Area, and Date of Birth are all required fields.'
    });
  }

  try {
    const result = await query(
      `INSERT INTO driver_applications (name, phone, state, district, area, dob) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, phone, state, district, area, dob]
    );

    res.status(201).json({
      success: true,
      message: 'Driver application submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving driver application:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to submit driver application.',
      error: error.message
    });
  }
});

// 4. Submit Vendor Application
app.post('/api/vendor-applications', async (req, res) => {
  const { ownerName, phone, shopName, shopNumber, state, district, city } = req.body;

  if (!ownerName || !phone || !shopName || !state || !district || !city) {
    return res.status(400).json({
      success: false,
      message: 'Owner Name, Phone Number, Shop Name, State, District, and City are required fields.'
    });
  }

  try {
    const result = await query(
      `INSERT INTO vendor_applications (owner_name, phone, shop_name, shop_number, state, district, city) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [ownerName, phone, shopName, shopNumber || null, state, district, city]
    );

    res.status(201).json({
      success: true,
      message: 'Vendor application submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving vendor application:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to submit vendor application.',
      error: error.message
    });
  }
});

// 5. Submit Rider Registration (DendoReg rider wizard)
app.post('/api/rider-registrations', uploadRiderFiles.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'idProofFile', maxCount: 1 },
  { name: 'drivingLicenseFile', maxCount: 1 },
]), async (req, res) => {
  const {
    firstName, lastName, mobileNumber, email, gender,
    state, city, fullAddress, latitude, longitude, locationAddress,
    vehicleType, idProofType, drivingLicenseNumber,
  } = req.body;

  const profilePicture = req.files?.profilePicture?.[0];
  const idProofFile = req.files?.idProofFile?.[0];
  const drivingLicenseFile = req.files?.drivingLicenseFile?.[0];

  if (
    !firstName || !lastName || !mobileNumber || !email || !gender ||
    !state || !city || !fullAddress || !latitude || !longitude ||
    !vehicleType || !idProofType || !drivingLicenseNumber ||
    !idProofFile || !drivingLicenseFile
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields and upload the required documents.'
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
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Rider registration submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving rider registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to submit rider registration.',
      error: error.message
    });
  }
});

// 6. Submit Vendor Registration (DendoReg vendor wizard)
app.post('/api/vendor-registrations', uploadVendorFiles.fields([
  { name: 'shopLogo', maxCount: 5 },
  { name: 'shopBanner', maxCount: 5 },
  { name: 'menuFiles', maxCount: 5 },
  { name: 'gstCertificate', maxCount: 5 },
  { name: 'fssaiCertificate', maxCount: 1 },
]), async (req, res) => {
  const {
    shopName, ownerName, ownerMobile, shopMobile,
    state, city, shopAddress, latitude, longitude, locationAddress,
    deliveryTime, openingTime, closingTime, gstRegistration,
    fssaiNumber, fssaiExpiryDate,
  } = req.body;

  const shopLogo = req.files?.shopLogo || [];
  const shopBanner = req.files?.shopBanner || [];
  const menuFiles = req.files?.menuFiles || [];
  const gstCertificate = req.files?.gstCertificate || [];
  const fssaiCertificate = req.files?.fssaiCertificate?.[0];

  if (
    !shopName || !ownerName || !ownerMobile || !state || !city ||
    !shopAddress || !latitude || !longitude || !deliveryTime ||
    !openingTime || !closingTime || !fssaiNumber || !fssaiExpiryDate ||
    menuFiles.length === 0 || !fssaiCertificate
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields and upload the required documents.'
    });
  }

  try {
    const result = await query(
      `INSERT INTO vendor_registrations (
         shop_name, owner_name, owner_mobile, shop_mobile,
         state, city, shop_address, latitude, longitude, location_address,
         delivery_time, opening_time, closing_time, gst_registration,
         fssai_number, fssai_expiry_date,
         shop_logo_paths, shop_banner_paths, menu_file_paths, gst_certificate_paths, fssai_certificate_path
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       RETURNING *`,
      [
        shopName, ownerName, ownerMobile, shopMobile || null,
        state, city, shopAddress, latitude, longitude, locationAddress || null,
        deliveryTime, openingTime, closingTime, gstRegistration || null,
        fssaiNumber, fssaiExpiryDate,
        shopLogo.map(filePath), shopBanner.map(filePath), menuFiles.map(filePath),
        gstCertificate.map(filePath), filePath(fssaiCertificate),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving vendor registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: Failed to submit vendor registration.',
      error: error.message
    });
  }
});

// Admin Panel: list + delete routes -----------------------------------------
const ADMIN_TABLES = {
  'zone-requests': 'zone_requests',
  'contact-messages': 'contact_messages',
  'driver-applications': 'driver_applications',
  'vendor-applications': 'vendor_applications',
  'rider-registrations': 'rider_registrations',
  'vendor-registrations': 'vendor_registrations',
};

Object.entries(ADMIN_TABLES).forEach(([route, table]) => {
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const result = await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error(`❌ Error fetching ${table}:`, error.message);
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
      console.error(`❌ Error deleting from ${table}:`, error.message);
      res.status(500).json({ success: false, message: `Failed to delete from ${table}.`, error: error.message });
    }
  });
});

// Start Backend Server
async function startServer() {
  try {
    await initializeDatabase();
    let port = PORT;
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const server = app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            resolve();
          });
          server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.warn(`⚠️ Port ${port} in use, trying next port...`);
              server.close();
              reject(err);
            } else {
              reject(err);
            }
          });
        });
        // If we reach here, server started successfully
        break;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          port++;
          continue;
        }
        throw err;
      }
    }
  } catch (error) {
    console.error('❌ Failed to start backend server:', error.message);
    process.exit(1);
  }
}

startServer();
