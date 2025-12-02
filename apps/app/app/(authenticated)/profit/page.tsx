import { auth } from "@repo/auth/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../components/header";
import { supabase } from "../../../lib/supabase";

export const metadata: Metadata = {
  title: "Profit by Product (Daily)",
  description: "View daily profit metrics by product",
};

type ProfitByProductDay = {
  order_date: string;
  asin: string;
  seller_sku: string;
  title: string;
  total_orders: number;
  units_ordered: number;
  units_shipped: number;
  gross_revenue: number;
  unit_cogs: number;
  total_cogs: number;
  total_fees: number;
  total_refunds: number;
  net_profit: number;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProfitPage = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  const { data, error } = await supabase
    .from("profit_by_product_day")
    .select("*")
    .order("order_date", { ascending: false });

  if (error) {
    console.error("Error fetching profit data:", error);
  }

  const products = (data as ProfitByProductDay[]) || [];

  return (
    <>
      <Header page="Profit by Product (Daily)" pages={["Analytics"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>ASIN</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Units Ordered</TableHead>
              <TableHead className="text-right">Units Shipped</TableHead>
              <TableHead className="text-right">Gross Revenue</TableHead>
              <TableHead className="text-right">Unit COGS</TableHead>
              <TableHead className="text-right">Total COGS</TableHead>
              <TableHead className="text-right">Fees</TableHead>
              <TableHead className="text-right">Refunds</TableHead>
              <TableHead className="text-right">Net Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={`${product.order_date}-${product.asin}-${product.seller_sku}`}>
                <TableCell>{formatDate(product.order_date)}</TableCell>
                <TableCell className="font-medium">{product.asin}</TableCell>
                <TableCell>{product.seller_sku}</TableCell>
                <TableCell className="max-w-[200px] truncate">{product.title}</TableCell>
                <TableCell className="text-right">{product.total_orders}</TableCell>
                <TableCell className="text-right">{product.units_ordered}</TableCell>
                <TableCell className="text-right">{product.units_shipped}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.gross_revenue)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.unit_cogs)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.total_cogs)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.total_fees)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.total_refunds)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(product.net_profit)}
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground">
                  No profit data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProfitPage;
