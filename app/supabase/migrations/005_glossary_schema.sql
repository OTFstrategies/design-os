-- ============================================================================
-- Glossary Schema - Standaardzinnen & Schrijfstandaard
-- NOTE: This schema uses existing table names (not glossary_ prefix)
-- Tables already exist in Supabase, this file is for documentation
-- ============================================================================

-- Standaardzin tables:
-- - standaardzin_categorieen (code, naam, beschrijving)
-- - standaardzin_tags (id, prefix, waarde, categorie, kleur)
-- - standaardzin_placeholders (naam, format, toegestane_waarden)
-- - standaardzinnen (id, code, tekst, categorie_code, tags, placeholders)
-- - atomaire_sequenties (id, code, naam, volgorde_verplicht)
-- - sequentie_stappen (id, sequentie_id, standaardzin_code, volgorde)
-- - standaardzin_document_links (standaardzin_id, document_id)
-- - sequentie_document_links (sequentie_id, document_id)

-- Schrijfstandaard tables:
-- - terminologie_categorieen (code, naam)
-- - terminologie (id, voorkeursterm, verboden_synoniemen, definitie, context, voorbeelden, categorie_code)
-- - stijlregel_categorieen (id, code, naam, beschrijving, icoon)
-- - stijlregels (id, categorie_id, titel, beschrijving, voorbeeld_goed, voorbeeld_fout, toelichting)
-- - document_niveaus (id, code, naam, beschrijving, doelgroep, voorbeelden, template_secties, kleur, sort_order)
-- - document_types (id, code, naam, niveau_code, beschrijving, structuur_vereisten)
-- - schrijfstandaard_rollen (id, code, naam, beschrijving)
-- - document_type_raci (document_type_code, rol_code, raci_waarde)
-- - codering_formaat (id, patroon, voorbeeld, is_active)
-- - codering_segmenten (id, formaat_id, naam, beschrijving, voorbeelden, sort_order)

-- All tables have RLS enabled with public read access
