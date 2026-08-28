# Tasks — 016 Atribución de anuncios y Conversions API

Rama `016-atribucion-capi`. Agrupadas por historia; lo fundacional primero
porque sin esquema y sin bandera no hay nada que encender ni que probar.
`[P]` = paralelizable (archivos distintos, sin dependencia).

---

## Fase 1 — Fundacional (bloquea todo)

- [ ] **T001** `src/lib/db/schema.ts`: tablas `ad_attribution`,
      `conversion_event` y `capi_settings` con sus índices UNIQUE, tal como
      `data-model.md`.
- [ ] **T002** `src/lib/db/ids.ts`: prefijos `att`, `cve`, `capi`. [P]
- [ ] **T003** `pnpm db:generate` → `drizzle/0010_atribucion_capi.sql` (aditiva,
      re-ejecutable) y su entrada en el journal.
- [ ] **T004** `src/server/attribution/flag.ts`: `parseAtribucionFlag`,
      `atribucionEnabled`, `atribucionDisabledResponse` (404 sin cuerpo), con el
      porqué escrito — calco de `server/agenda/flag.ts`.
- [ ] **T005** `src/lib/env.ts`: `ATRIBUCION` opcional, documentada inline. [P]
- [ ] **T006** `tests/unit/atribucion-flag.test.ts`: valores encendidos,
      apagados y basura. [P]

## Fase 2 — US1: la bandera (P1)

- [ ] **T007** `src/app/(app)/settings/layout.tsx` + `components/settings/settings-nav.tsx`:
      pestaña "Anuncios" solo con la bandera encendida (patrón `agenda`).
- [ ] **T008** `src/app/(app)/settings/ads/page.tsx`: `notFound()` sin bandera.
- [ ] **T009** Guardia de bandera en las dos rutas de API (404 antes de auth).

## Fase 3 — US2: conectar el dataset (P1)

- [ ] **T010** `src/server/attribution/settings.ts`: `getCapiSettings` (descifra),
      `saveCapiSettings` (upsert cifrado), `deleteCapiSettings`,
      `getCapiSettingsView` (lo que ve el cliente: `last4`, nunca el token).
- [ ] **T011** `src/app/api/settings/capi/route.ts`: `GET` / `PUT` / `DELETE` con
      Zod; sin token reusa el de `metaCredentials` (`409 sin_whatsapp`);
      `qualifiedStageId` validado contra las etapas de la organización
      (`422 etapa_invalida`).
- [ ] **T012** `src/components/settings/ads-client.tsx`: formulario (dataset,
      token opcional con ayuda, selector de etapa), estado conectado con
      `last4`, botón desconectar.

## Fase 4 — US3: capturar el anuncio (P1)

- [ ] **T013** `src/server/inbox/webhook.ts`: tipo `WebhookReferral` y
      `referral?` en el mensaje entrante. [P]
- [ ] **T014** `src/server/attribution/store.ts`: `recordAttribution`
      (`ON CONFLICT DO NOTHING` por org+conversación) y
      `getAttributionForConversation`.
- [ ] **T015** `src/server/inbox/ingest.ts`: pasar el `referral` y capturarlo
      **antes** del dedup del mensaje, solo con la bandera encendida.
- [ ] **T016** Mock de inbound (`wa-mock/inbound` + `server/dev/wa-mock-inbound.ts`):
      campos `ctwaClid` / `adHeadline` / `adSourceId` para simular un anuncio.

## Fase 5 — US4/US5: reportar (P1)

- [ ] **T017** `src/lib/meta/capi.ts`: catálogo cerrado, `buildEventPayload`
      (`action_source`, `messaging_channel`, `user_data`, `custom_data`,
      `partner_agent: "vocero-crm"`), `sendBusinessMessagingEvent` con la regla
      `events_received >= 1`.
- [ ] **T018** `src/server/attribution/conversions.ts`: `emitConversion`
      (dedup por UNIQUE, `skipped` con motivo, `failed` con el error de Meta,
      `sent` con `fbtrace_id`), guardia `is_test`, best-effort absoluto.
- [ ] **T019** `purchaseCustomDataFromAmount` (centavos → unidades; sin monto,
      sin `value`) y la resolución del monto del lead. [P]
- [ ] **T020** `src/server/leads/stage-history.ts`: tras el commit, si la etapa
      destino es la calificada → `QualifiedLead`; si su `kind` es `won` →
      `Purchase`. Fuera de la transacción y envuelto.
- [ ] **T021** Mock de Graph: `POST {dataset}/events` — valida catálogo y
      `ctwa_clid`, responde `events_received`/`fbtrace_id`, y simula el 200
      mentiroso con datasets `-fail`.
- [ ] **T022** `tests/unit/capi-payload.test.ts`: forma exacta del payload,
      catálogo, merge de `custom_data`, y el rechazo por `events_received: 0`. [P]
- [ ] **T023** `tests/unit/conversions.test.ts`: centavos→unidades, sin monto,
      y la traducción de fila de actividad. [P]

## Fase 6 — US6: ver qué se reportó (P2)

- [ ] **T024** `listConversionActivity` con tope duro (25/50) + titular del
      anuncio por join.
- [ ] **T025** `src/app/api/settings/capi/events/route.ts`.
- [ ] **T026** Tabla de actividad en la pantalla: estado en palabras, motivo del
      fallo/omisión, `fbtrace_id` y refresco manual.

## Fase 7 — Cierre

- [ ] **T027** `tests/e2e/us-atribucion.md`: el guion de la historia.
- [ ] **T028** `scripts/e2e-selftest.mjs`: sección nueva — apagada (404 + sin
      captura) y encendida (configurar, capturar, calificar, ganar, dedup, sin
      anuncio, Meta rechazando).
- [ ] **T029** `docs/atribucion-capi.md`: guía del dueño — qué es el dataset, de
      dónde sale, los gotchas de Meta y la receta del espejo de venta para quien
      la necesite. [P]
- [ ] **T030** `README.md` + `.env.example` + `CLAUDE.md`: la feature opcional,
      la variable y la fila del mapa de código. [P]
- [ ] **T031** Gate técnico completo y arnés en las **dos** configuraciones.
