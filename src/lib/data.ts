import { Home, LineChart, LucideIcon, Settings, Shapes } from "lucide-react";

export const API_URL = "";

interface sidebarItem {
  title: string;
  icon: LucideIcon;
  link: string;
}

export const sidebarItems: sidebarItem[] = [
  {
    title: "Overview",
    icon: Home,
    link: "/",
  },
  {
    title: "Compare",
    icon: Shapes,
    link: "/compare",
  },
  {
    title: "Readings",
    icon: LineChart,
    link: "/readings",
  },
  {
    title: "Settings",
    icon: Settings,
    link: "/settings",
  },
];

interface overviewItem {
  title: string;
  dataKey: string;
}

export const overviewItems: overviewItem[] = [
  {
    title: "Highest PM10",
    dataKey: "p10",
  },
  {
    title: "Highest PM2.5",
    dataKey: "p25",
  },
  {
    title: "Highest PM1",
    dataKey: "p1",
  },
  {
    title: "Windiest Time",
    dataKey: "w",
  },
];

export interface ISettings {
  title: string;
  enabled: boolean;
}

export const settingsItems: ISettings[] = [
  {
    title: "Switch to dark mode",
    enabled: false,
  },
];

export interface IReading {
  device: string;
  h?: string;
  p1?: number;
  p10?: number;
  p25?: number;
  t?: string;
  w?: number;
}
