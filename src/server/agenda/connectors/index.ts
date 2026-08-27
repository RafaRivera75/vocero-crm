import { type ConnectorId } from "@/lib/agenda-connectors";
import type { CalendarSettings } from "@/server/agenda/settings";
import {
  ConnectorError,
  type AgendaConnector,
  type MeetingRequest,
  type MeetingResult,
  type TestConnectionResult,
} from "@/server/agenda/connectors/types";
import { enlaceFijoConnector } from "@/server/agenda/connectors/enlace-fijo";

/**
 * 015 — El catálogo de conectores y la ÚNICA puerta por la que el motor habla
 * con un proveedor.
 *
 * El servicio de citas no conoce credenciales ni proveedores: pide "entrega
 * esta reunión" y aquí se resuelve con qué y con qué llaves. Por eso agregar un
 * conector en un fork no toca ni una línea del motor: se escribe su adaptador,
 * su tabla de credenciales y una rama de este `switch`.
 */

/** Un conector con sus credenciales ya resueltas: el genérico queda borrado. */
export type BoundConnector = {
  id: ConnectorId;
  createMeeting(req: MeetingRequest): Promise<MeetingResult>;
  updateMeeting(
    externalId: string,
    req: Pick<MeetingRequest, "startUtc" | "durationMinutes" | "timezone">
  ): Promise<void>;
  deleteMeeting(externalId: string): Promise<void>;
  testConnection(): Promise<TestConnectionResult>;
};

function bind<C>(conn: AgendaConnector<C>, creds: C): BoundConnector {
  return {
    id: conn.id,
    createMeeting: (req) => conn.createMeeting(creds, req),
    updateMeeting: (externalId, req) =>
      conn.updateMeeting(creds, externalId, req),
    deleteMeeting: (externalId) => conn.deleteMeeting(creds, externalId),
    testConnection: () => conn.testConnection(creds),
  };
}

/**
 * Resuelve el conector pedido con las credenciales de esta organización.
 *
 * Lanza `ConnectorError` si el conector no está disponible o le faltan
 * credenciales. El motor traduce esa excepción a "cita creada con enlace
 * pendiente", que es honesto — en vez de entregar en silencio el enlace de
 * otro conector.
 */
export async function bindConnector(
  organizationId: string,
  connectorId: ConnectorId,
  settings: CalendarSettings
): Promise<BoundConnector> {
  switch (connectorId) {
    case "enlace-fijo":
      return bind(enlaceFijoConnector, { meetingLink: settings.meetingLink });

    case "zoom":
    case "google":
      // Se registran en sus fases (US5 / US6).
      throw new ConnectorError(
        connectorId,
        `El conector ${connectorId} no está disponible en esta instalación`
      );
  }
}

/**
 * Marca la credencial del conector como rota tras un error de autenticación,
 * para que Ajustes muestre la tarjeta de reconexión. `enlace-fijo` no tiene
 * credenciales que marcar.
 *
 * Es lo que evita el fallo silencioso del fork, donde el estado `error` existe
 * como enum y nadie lo escribe: el dueño se entera de que su conexión murió
 * por el cliente que no recibió su enlace.
 */
export async function markConnectorAuthError(
  organizationId: string,
  connectorId: ConnectorId
): Promise<void> {
  switch (connectorId) {
    case "enlace-fijo":
      return;
    case "zoom":
    case "google":
      // Se implementa junto a su tabla de credenciales (US5 / US6).
      return;
  }
}
