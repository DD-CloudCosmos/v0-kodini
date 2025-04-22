-- Add summary column to guidance table if it doesn't exist
ALTER TABLE guidance ADD COLUMN IF NOT EXISTS summary TEXT;
