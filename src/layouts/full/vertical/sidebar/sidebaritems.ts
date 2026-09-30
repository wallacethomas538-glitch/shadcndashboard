import { uniqueId } from "lodash";
import {
Bot, Boxes, BrainCircuit, ChartNoAxesCombined, FlaskConical, Gauge, MessageSquare, Image,
  GitBranch, KeyRound, LineChart, Package, PanelsTopLeft, Search, Settings,
  ShieldCheck, ShoppingCart, Store, TrendingUp, WalletCards, Workflow, Zap
} from "lucide-react";

export interface ChildItem {
  id?: number | string; name: string; icon?: any; items?: ChildItem[]; url?: string;
  disabled?: boolean; subtitle?: string; badge?: boolean; badgeType?: string;
  badgeContent?: string; isActive?: boolean; external?: boolean; isPro?: boolean; color?: string;
}
export interface MenuItem {
  heading?: string; name?: string; icon?: any; id?: number | string; to?: string;
  item?: MenuItem[]; items?: ChildItem[]; url?: string;
}
const item = (name: string, url: string, icon: any): ChildItem => ({ id: uniqueId(), name, url, icon });

const SidebarContent: MenuItem[] = [
  { heading: "VektorFlow", items: [
    item("Command Center", "/", Gauge), item("Agents", "/vektorflow/agents", Bot),
    item("Hermes", "/vektorflow/hermes", Zap), item("LLM Studio", "/vektorflow/llm", MessageSquare), item("Models", "/vektorflow/models", BrainCircuit), item("Ad Studio", "/vektorflow/ads", Image),
  ]},
  { heading: "Commerce", items: [
    item("Products", "/vektorflow/products", Package), item("Inventory", "/vektorflow/inventory", Boxes),
    item("Sales", "/vektorflow/sales", ShoppingCart), item("Stores", "/vektorflow/stores", Store),
    item("Marketing", "/vektorflow/marketing", TrendingUp), item("Content", "/vektorflow/content", PanelsTopLeft),
    item("Trends", "/vektorflow/trends", LineChart), item("Competition", "/vektorflow/competition", Search),
    item("Profit & Finance", "/vektorflow/finance", WalletCards),
  ]},
  { heading: "Intelligence & Control", items: [
    item("Experiments", "/vektorflow/experiments", FlaskConical),
    item("Knowledge & Memory", "/vektorflow/knowledge", BrainCircuit),
    item("Security", "/vektorflow/security", ShieldCheck),
    item("Governance", "/vektorflow/governance", GitBranch),
    item("Oracle", "/vektorflow/oracle", ChartNoAxesCombined),
  ]},
  { heading: "System", items: [
    item("Integrations", "/vektorflow/integrations", Workflow),
    item("Settings", "/vektorflow/settings", Settings),
    item("API / Access", "/pages/tables", KeyRound),
  ]},
];
export default SidebarContent;
