# Toekomstige Verbeteringen

## Supabase Realtime WebSocket

**Status:** Uitgesteld - polling als workaround actief

**Probleem:**
WebSocket connecties naar Supabase Realtime falen met timeout errors, ondanks:
- Pro plan actief
- Tabellen in `supabase_realtime` publication
- RLS policies correct geconfigureerd
- REPLICA IDENTITY FULL ingesteld

**Huidige Workaround:**
Polling elke 10 seconden in `app/src/hooks/useAIAgentsData.ts`

**Te Onderzoeken:**
1. Supabase Dashboard → Database → Replication settings checken
2. Supabase Dashboard → Project Settings → API → Realtime configuratie
3. Contact Supabase Support (Pro plan = support access)

**Bestanden:**
- `app/src/hooks/useAIAgentsData.ts` - polling implementatie
- `app/src/lib/ai-agents-service.ts` - `subscribeToRealtimeUpdates()` functie (niet in gebruik)
- `app/src/lib/supabase.ts` - Supabase client configuratie

**Notities:**
- Supabase AI heeft broadcast triggers opgezet, maar onze code gebruikt postgres_changes
- Policies waren voor `authenticated` role, app gebruikt `anon`
- WebSocket connectie faalt voordat subscription kan starten

---

## Andere Verbeteringen

- [ ] Supabase Realtime fixen voor instant updates
- [ ] Error handling verbeteren in Edge Functions
- [ ] Retry mechanisme voor gefaalde agents
- [ ] Logging/monitoring dashboard voor pipeline runs
