import { HomeIcon, TrendingUpIcon, SearchIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import AssetDetail from "./pages/AssetDetail.jsx";
import DEXScreener from "./pages/DEXScreener.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Asset Detail",
    to: "/asset/:id",
    icon: <TrendingUpIcon className="h-4 w-4" />,
    page: <AssetDetail />,
  },
  {
    title: "DEX Screener",
    to: "/dex-screener",
    icon: <SearchIcon className="h-4 w-4" />,
    page: <DEXScreener />,
  },
];
