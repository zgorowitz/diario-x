"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import Link from "next/link";
import styles from "./marketing-landing.module.css";

type PricingRow = {
  plan: string;
  modalidad: string;
  precio: string;
  detalle: string;
  etiqueta: string;
};

type MarketingLandingProperties = {
  pricingRows: PricingRow[];
};

export const MarketingLanding = ({ pricingRows }: MarketingLandingProperties) => (
  <main className={styles.page}>
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>
          Ohalei Jinuj - Escuela Primaria Jabad Lubavitch Argentina
        </span>
        <Button asChild className={styles.loginButton}>
          <Link href="/sign-in">Ingresar</Link>
        </Button>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>Informacion para madres, padres y tutores</p>
        <h1>Inscribi a tus hijos al comedor de Ohalei Jinuj en minutos</h1>
        <p className={styles.lead}>
          Elegi plan mensual o modalidad diaria, revisa tus pagos y segui el
          estado del comedor desde una experiencia simple y clara para familias.
        </p>
        <Button asChild className={styles.ctaButton}>
          <Link href="/sign-in">Ingresar como familia</Link>
        </Button>
      </section>

      <section className={styles.tabsSection}>
        <Tabs defaultValue="inscripcion">
          <TabsList className={styles.tabsList}>
            <TabsTrigger className={styles.tabTrigger} value="inscripcion">
              Inscripcion
            </TabsTrigger>
            <TabsTrigger className={styles.tabTrigger} value="planes">
              Planes
            </TabsTrigger>
            <TabsTrigger className={styles.tabTrigger} value="pagos">
              Pagos
            </TabsTrigger>
            <TabsTrigger className={styles.tabTrigger} value="acompanamiento">
              Acompanamiento
            </TabsTrigger>
          </TabsList>

          <TabsContent className={styles.tabPanel} value="inscripcion">
            <h2>Inscripcion de tus hijos</h2>
            <p>
              Registra a cada chico con sus datos de curso y selecciona la
              modalidad de comedor sin formularios en papel.
            </p>
          </TabsContent>

          <TabsContent className={styles.tabPanel} value="planes">
            <h2>Planes pensados para familias</h2>
            <p>
              Puedes elegir entre plan mensual o pago diario segun lo que mejor
              se ajuste a la rutina de tu familia.
            </p>
          </TabsContent>

          <TabsContent className={styles.tabPanel} value="pagos">
            <h2>Pagos y vencimientos</h2>
            <p>
              Consulta comprobantes, fechas y estado de cada pago para tener
              control total del comedor durante todo el mes.
            </p>
            <div className={styles.pricingTableWrap}>
              <table className={styles.pricingTable}>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Modalidad</th>
                    <th>Precio</th>
                    <th>Detalle</th>
                    <th>Etiqueta</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row) => (
                    <tr key={`${row.plan}-${row.modalidad}`}>
                      <td>{row.plan}</td>
                      <td>{row.modalidad}</td>
                      <td>{row.precio}</td>
                      <td>{row.detalle}</td>
                      <td>{row.etiqueta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent className={styles.tabPanel} value="acompanamiento">
            <h2>Comunicacion con la escuela</h2>
            <p>
              Recibe informacion clara sobre la gestion del comedor y manten un
              seguimiento ordenado de tus hijos en Ohalei Jinuj.
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  </main>
);
