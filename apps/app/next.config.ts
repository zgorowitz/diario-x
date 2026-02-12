import { config, withAnalyzer } from "@repo/next-config";
import { env } from "@/env";

let nextConfig: Record<string, unknown> = config as Record<string, unknown>;

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
