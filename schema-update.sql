-- Add rationale column to tasks table if it doesn't exist
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS rationale TEXT;
