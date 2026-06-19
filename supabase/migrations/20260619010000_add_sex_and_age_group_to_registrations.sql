-- ============================================================
-- Migration: 20260619010000_add_sex_and_age_group_to_registrations.sql
-- Add sex and age group fields to workshop registrations table
-- ============================================================

ALTER TABLE workshop_registrations 
  ADD COLUMN IF NOT EXISTS sex text,
  ADD COLUMN IF NOT EXISTS age_group text;
