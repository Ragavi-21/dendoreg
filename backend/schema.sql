-- DendoReg database schema
-- Two tables: rider_registrations and vendor_registrations

CREATE TABLE IF NOT EXISTS rider_registrations (
  id                        SERIAL PRIMARY KEY,
  first_name                VARCHAR(100) NOT NULL,
  last_name                 VARCHAR(100) NOT NULL,
  mobile_number             VARCHAR(50)  NOT NULL,
  email                     VARCHAR(255) NOT NULL,
  gender                    VARCHAR(50)  NOT NULL,
  state                     VARCHAR(100) NOT NULL,
  city                      VARCHAR(100) NOT NULL,
  full_address              TEXT         NOT NULL,
  latitude                  NUMERIC(10, 6) NOT NULL,
  longitude                 NUMERIC(10, 6) NOT NULL,
  location_address          TEXT,
  vehicle_type              VARCHAR(100) NOT NULL,
  id_proof_type             VARCHAR(100) NOT NULL,
  driving_license_number    VARCHAR(100) NOT NULL,
  profile_picture_path      TEXT,
  id_proof_file_path        TEXT         NOT NULL,
  driving_license_file_path TEXT         NOT NULL,
  created_at                TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_registrations (
  id                     SERIAL PRIMARY KEY,
  shop_name              VARCHAR(255) NOT NULL,
  owner_name             VARCHAR(100) NOT NULL,
  owner_mobile           VARCHAR(50)  NOT NULL,
  shop_mobile            VARCHAR(50),
  state                  VARCHAR(100) NOT NULL,
  city                   VARCHAR(100) NOT NULL,
  shop_address           TEXT         NOT NULL,
  latitude               NUMERIC(10, 6) NOT NULL,
  longitude              NUMERIC(10, 6) NOT NULL,
  location_address       TEXT,
  delivery_time          VARCHAR(100) NOT NULL,
  opening_time           VARCHAR(20)  NOT NULL,
  closing_time           VARCHAR(20)  NOT NULL,
  gst_registration       VARCHAR(10),
  fssai_number           VARCHAR(100) NOT NULL,
  fssai_expiry_date      DATE         NOT NULL,
  shop_logo_paths        TEXT[],
  shop_banner_paths      TEXT[],
  menu_file_paths        TEXT[]       NOT NULL,
  gst_certificate_paths  TEXT[],
  fssai_certificate_path TEXT         NOT NULL,
  created_at             TIMESTAMP DEFAULT NOW()
);
