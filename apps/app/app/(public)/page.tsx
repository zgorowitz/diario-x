import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarketingLanding } from "./marketing-landing";

type PricingRow = {
  plan: string;
  modalidad: string;
  precio: string;
  detalle: string;
  etiqueta: string;
};

const fallbackPricing: PricingRow[] = [
  {
    plan: "Plan mensual completo",
    modalidad: "Lunes a viernes",
    precio: "$58.000 / mes",
    detalle: "Incluye seguimiento diario y ajustes por grado.",
    etiqueta: "Mas elegido",
  },
  {
    plan: "Plan semanal flexible",
    modalidad: "Hasta 3 dias por semana",
    precio: "$37.500 / mes",
    detalle: "Pensado para asistencia variable durante el mes.",
    etiqueta: "Flexible",
  },
  {
    plan: "Comida diaria",
    modalidad: "Pago por dia",
    precio: "$2.800 / dia",
    detalle: "Ideal para familias que necesitan resolver dia a dia.",
    etiqueta: "Diario",
  },
];

async function getPricingRows() {
  try {
    return await database.$queryRaw<PricingRow[]>`
      SELECT plan, modalidad, precio, detalle, etiqueta
      FROM (
        VALUES
          ('Plan mensual completo', 'Lunes a viernes', '$58.000 / mes', 'Incluye seguimiento diario y ajustes por grado.', 'Mas elegido'),
          ('Plan semanal flexible', 'Hasta 3 dias por semana', '$37.500 / mes', 'Pensado para asistencia variable durante el mes.', 'Flexible'),
          ('Comida diaria', 'Pago por dia', '$2.800 / dia', 'Ideal para familias que necesitan resolver dia a dia.', 'Diario')
      ) AS tabla_precios(plan, modalidad, precio, detalle, etiqueta)
    `;
  } catch {
    return fallbackPricing;
  }
}

export const metadata: Metadata = {
  title: "Ohalei Jinuj - Escuela Primaria Jabad Lubavitch Argentina",
  description:
    "Inscripcion y seguimiento del comedor escolar para madres, padres y tutores.",
};

const MarketingPage = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  const pricingRows = await getPricingRows();

  return <MarketingLanding pricingRows={pricingRows} />;
};

export default MarketingPage;
