-- Batch 1 (authentication security): columns behind the server-side OTP and passcode lockouts.
--
-- dev  (ddl-auto: update)   -> Hibernate adds these automatically; nothing to run.
-- uat / prod (ddl-auto: validate) -> run this BEFORE deploying, otherwise schema validation fails
--                                    and the application will not start.
-- The Flyway folder (db/migration) is empty in this repository, so this is not applied
-- automatically. Run the block for your database.

-- =============================== MySQL ========================================================
ALTER TABLE otps
    ADD COLUMN failed_attempts    INT         NULL,
    ADD COLUMN last_failed_at     DATETIME(6) NULL,
    ADD COLUMN locked_until       DATETIME(6) NULL,
    ADD COLUMN last_sent_at       DATETIME(6) NULL,
    ADD COLUMN send_window_start  DATETIME(6) NULL,
    ADD COLUMN send_count         INT         NULL;

-- One OTP row per number is now enforced. Keep only the newest row per number first.
DELETE o FROM otps o
    JOIN otps newer ON newer.mobile_number = o.mobile_number AND newer.id > o.id;
ALTER TABLE otps ADD CONSTRAINT uk_otps_mobile_number UNIQUE (mobile_number);

ALTER TABLE customers
    ADD COLUMN failed_login_attempts INT         NULL,
    ADD COLUMN last_failed_login_at  DATETIME(6) NULL,
    ADD COLUMN login_locked_until    DATETIME(6) NULL;

-- =============================== PostgreSQL ===================================================
-- ALTER TABLE otps
--     ADD COLUMN failed_attempts    INTEGER                  NULL,
--     ADD COLUMN last_failed_at     TIMESTAMP WITH TIME ZONE NULL,
--     ADD COLUMN locked_until       TIMESTAMP WITH TIME ZONE NULL,
--     ADD COLUMN last_sent_at       TIMESTAMP WITH TIME ZONE NULL,
--     ADD COLUMN send_window_start  TIMESTAMP WITH TIME ZONE NULL,
--     ADD COLUMN send_count         INTEGER                  NULL;
--
-- DELETE FROM otps o USING otps newer
--     WHERE newer.mobile_number = o.mobile_number AND newer.id > o.id;
-- ALTER TABLE otps ADD CONSTRAINT uk_otps_mobile_number UNIQUE (mobile_number);
--
-- ALTER TABLE customers
--     ADD COLUMN failed_login_attempts INTEGER                  NULL,
--     ADD COLUMN last_failed_login_at  TIMESTAMP WITH TIME ZONE NULL,
--     ADD COLUMN login_locked_until    TIMESTAMP WITH TIME ZONE NULL;

-- ==============================================================================================
-- Batch 2.1 (server-side OTP proof for registration): new table, required by /otp/verify and
-- /customer/register. Same rule as above: dev creates it automatically; uat/prod (validate) need it first.
-- Only a SHA-256 hash of the proof token is stored.
-- ==============================================================================================

-- ---- MySQL ----
CREATE TABLE registration_proofs (
    id            BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15)  NOT NULL,
    purpose       VARCHAR(40)  NOT NULL,
    token_hash    VARCHAR(64)  NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    expires_at    DATETIME(6)  NOT NULL,
    consumed_at   DATETIME(6)  NULL,
    CONSTRAINT uk_registration_proofs_token_hash UNIQUE (token_hash)
);
CREATE INDEX idx_registration_proofs_mobile ON registration_proofs (mobile_number);

-- ---- PostgreSQL ----
-- CREATE TABLE registration_proofs (
--     id            BIGSERIAL PRIMARY KEY,
--     mobile_number VARCHAR(15) NOT NULL,
--     purpose       VARCHAR(40) NOT NULL,
--     token_hash    VARCHAR(64) NOT NULL,
--     created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
--     expires_at    TIMESTAMP WITH TIME ZONE NOT NULL,
--     consumed_at   TIMESTAMP WITH TIME ZONE NULL,
--     CONSTRAINT uk_registration_proofs_token_hash UNIQUE (token_hash)
-- );
-- CREATE INDEX idx_registration_proofs_mobile ON registration_proofs (mobile_number);
