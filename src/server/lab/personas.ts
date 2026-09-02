/**
 * Las 6 personas GUIONADAS del Laboratorio (FR-030). El cliente simulado no
 * usa LLM: son secuencias fijas — determinismo total del lado del cliente.
 * El agente que responde es el REAL (mismo pipeline de US3).
 *
 * 2026-09-01 (fork RafaRivera75 / piloto CreceConIA): guiones adaptados de
 * ferretería a CLÍNICA DENTAL para validar el Laboratorio en otro rubro.
 * Los arquetipos (comprador decidido, pregunton, enojado, fuera de KB,
 * pide humano, modismos) se mantienen igual.
 */

export type Persona = {
  key: string;
  label: string;
  description: string;
  /** Teléfono sintético estable (jamás un número real). */
  phone: string;
  contactName: string;
  script: string[];
};

export const PERSONAS: Persona[] = [
  {
    key: "comprador_decidido",
    label: "Comprador decidido",
    description: "Sabe lo que quiere y va directo a agendar.",
    phone: "5210000000001",
    contactName: "[Prueba] Comprador decidido",
    script: [
      "Hola, buenas tardes",
      "Quiero una limpieza dental, ¿cuánto cuesta?",
      "Perfecto, ¿qué horarios tienen esta semana?",
      "Me sirve, agéndame. Mi nombre es Camila Rodríguez",
    ],
  },
  {
    key: "pregunton_precios",
    label: "Preguntón de precios",
    description: "Pregunta precio tras precio sin decidirse.",
    phone: "5210000000002",
    contactName: "[Prueba] Preguntón de precios",
    script: [
      "Hola, ¿cuánto cuesta la valoración?",
      "¿Y la limpieza dental?",
      "¿Cuánto el blanqueamiento?",
      "¿Hay descuento si llevo a mi familia?",
      "Ok, lo voy a pensar",
    ],
  },
  {
    key: "cliente_enojado",
    label: "Cliente enojado",
    description: "Llega molesto por un problema con su tratamiento.",
    phone: "5210000000003",
    contactName: "[Prueba] Cliente enojado",
    script: [
      "Oigan, esto es el colmo",
      "Me hicieron una limpieza la semana pasada y me quedó hipersensible, es una porquería",
      "¿Me van a responder o qué? Quiero una solución YA",
      "Pues espero que sí porque no pienso perder mi dinero",
    ],
  },
  {
    key: "fuera_de_kb",
    label: "Pregunta fuera del conocimiento",
    description: "Pregunta algo que el knowledge base no cubre (fuera_de_kb).",
    phone: "5210000000004",
    contactName: "[Prueba] Fuera del conocimiento",
    script: [
      "Hola, una pregunta",
      "¿Cuál es su política de garantías y devoluciones?",
      "¿Y si el tratamiento falla a los dos meses lo repiten gratis?",
      "¿Dónde reclamo la garantía?",
    ],
  },
  {
    key: "pide_humano",
    label: "Pide un humano",
    description: "Quiere ser atendido por una persona (debe escalar).",
    phone: "5210000000005",
    contactName: "[Prueba] Pide humano",
    script: [
      "Hola",
      "Tengo un asunto delicado con mi factura",
      "Prefiero que me atienda una persona, quiero hablar con un humano",
      "Gracias",
    ],
  },
  {
    key: "errores_modismos",
    label: "Errores y modismos",
    description: "Escribe con faltas de ortografía y modismos colombianos.",
    phone: "5210000000006",
    contactName: "[Prueba] Errores y modismos",
    script: [
      "ke onda, si azen limpiezas dentales?",
      "oiga y no le sabe cuanto x el blanqueamiento",
      "cuanto x la valoracion d primera vez",
      "listo, entonces mañana llamo pa agendar, gracias",
    ],
  },
];

export const PERSONA_LABELS: Record<string, string> = Object.fromEntries(
  PERSONAS.map((p) => [p.key, p.label])
);
