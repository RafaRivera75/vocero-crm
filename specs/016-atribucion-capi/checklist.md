# Checklist de calidad — 016 Atribución y Conversions API

Se marca contra el código, no contra la intención.

## La bandera (ADR-001)

- [ ] Sin `ATRIBUCION`: pantalla y rutas en **404** (no 403, no 401).
- [ ] Sin la bandera, la ingesta **no** guarda atribución aunque llegue referral.
- [ ] Sin la bandera, la pestaña de Ajustes no se pinta.
- [ ] La migración se aplica igual en ambos casos.
- [ ] El prompt del agente no cambia con la bandera.

## Seguridad

- [ ] El token del dataset se guarda cifrado con `lib/crypto` (no en claro, no
      con un segundo mecanismo).
- [ ] Hacia el cliente solo viajan `last4` y estado.
- [ ] Hacia Meta no viaja teléfono, nombre ni texto del contacto: solo el
      `ctwa_clid` y el id del WABA.
- [ ] Ningún token aparece en logs ni en mensajes de error.

## Corrección del reporte

- [ ] `events_received < 1` ⇒ `failed`, nunca `sent`.
- [ ] Nombre fuera del catálogo ⇒ error con motivo legible antes de salir.
- [ ] `custom_data.lead_stage` viaja en los dos eventos.
- [ ] `value` en unidades de la moneda, nunca centavos; sin monto, sin `value`.
- [ ] Dedup por UNIQUE en base (no un `select` previo).
- [ ] Conversaciones `is_test` no emiten.

## Robustez

- [ ] Un fallo de Meta no impide mover el lead (probado en el arnés).
- [ ] La llamada a Meta ocurre **fuera** de la transacción de etapas.
- [ ] Sin dataset configurado, la fila queda `skipped` con motivo.
- [ ] Reintento del webhook no duplica atribución.

## Multi-tenancy

- [ ] Toda query pasa por `scoped()`.
- [ ] `qualifiedStageId` se valida contra las etapas de la propia organización.

## Verificación

- [ ] `pnpm typecheck && pnpm lint && pnpm build && pnpm test` en verde.
- [ ] Arnés E2E en verde **encendida** y **apagada**.
- [ ] `docs/atribucion-capi.md` explica los gotchas de Meta que costaron días.
