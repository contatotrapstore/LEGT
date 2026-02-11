import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/@/:region/:riotId",
        destination: "/player/:region/:riotId",
      },
      {
        source: "/@/:region/:riotId/match/:matchId",
        destination: "/player/:region/:riotId/match/:matchId",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
