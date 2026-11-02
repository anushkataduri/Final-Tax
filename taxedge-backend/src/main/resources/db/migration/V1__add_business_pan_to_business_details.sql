-- Add business_pan column to business_details.
-- Nullable to preserve backward compatibility with existing records created before this field.
ALTER TABLE business_details ADD COLUMN IF NOT EXISTS business_pan VARCHAR(10);
