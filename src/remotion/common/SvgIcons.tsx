// SVG 아이콘 라이브러리 - 퍼플 네온 테마
import React from "react";
import { T } from "./theme";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const d = { size: 80, color: T.accentBright, strokeWidth: 1.8 };

const Brain: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 .6-.1 1.1-.4 1.6A5 5 0 0 1 18 12a5 5 0 0 1-2.8 4.5c.2.5.3 1 .3 1.5a4 4 0 0 1-7 2.6A4 4 0 0 1 5 18c0-.5.1-1 .3-1.5A5 5 0 0 1 2.5 12a5 5 0 0 1 2.4-4.4A4 4 0 0 1 8 2a4 4 0 0 1 4 4" /><path d="M12 2v20" /><path d="M8 6h.01M16 6h.01M8 18h.01M16 18h.01" /></svg>);
};
const Sparkles: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" /><path d="M5 17l.7 2.1L8 20l-2.3.9L5 23l-.7-2.1L2 20l2.3-.9L5 17z" /></svg>);
};
const BookOpen: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>);
};
const Search: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
};
const Rocket: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>);
};
const ChefHat: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z" /><line x1="6" y1="17" x2="18" y2="17" /></svg>);
};
const AlertTriangle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
};
const MessageCircle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
};
const Refrigerator: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="4" y1="10" x2="20" y2="10" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="9" y1="14" x2="9" y2="14.01" /></svg>);
};
const CheckCircle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
};
const HelpCircle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
};
const MessageSquare: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
};
const Quote: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" /></svg>);
};
const ArrowRight: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
};
const FileText: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);
};
const Clock: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
};

const Database: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>);
};
const Shield: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
};
const Zap: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>);
};
const Target: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
};
const Layers: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>);
};
const Globe: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
};
const Code: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
};
const TrendingUp: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>);
};
const Users: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
};
const Lightbulb: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>);
};
const Star: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
};
const Settings: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
};
const Lock: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
};
const Cloud: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>);
};
const Play: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>);
};

const Smartphone: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>);
};
const Monitor: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);
};
const Terminal: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
};
const User: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
};
const UserCircle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><circle cx="12" cy="12" r="10" /></svg>);
};
const Folder: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>);
};
const FolderOpen: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><polyline points="2 10 12 10 22 10" /></svg>);
};
const Download: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
};
const Upload: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>);
};
const Wifi: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>);
};
const Battery: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2" /><line x1="23" y1="13" x2="23" y2="11" /></svg>);
};
const Camera: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>);
};
const Music: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>);
};
const Video: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>);
};
const Image: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>);
};
const Edit: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
};
const Trash: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>);
};
const Refresh: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>);
};
const Share: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>);
};
const Heart: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
};
const Award: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>);
};
const Compass: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>);
};
const Cpu: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>);
};
const GitBranch: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>);
};
const Link: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>);
};
const Mail: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>);
};
const Mic: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>);
};
const Phone: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.84-.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
};
const Power: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>);
};
const Send: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
};
const Server: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>);
};
const ThumbsUp: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>);
};
const Tool: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>);
};
const XCircle: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
};
const PieChart: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>);
};
const BarChart: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>);
};
const Activity: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>);
};
const DollarSign: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
};
const Percent: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>);
};
const Hash: React.FC<IconProps> = (p) => {
  const { size, color, strokeWidth: sw } = { ...d, ...p };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>);
};

const iconMap: Record<string, React.FC<IconProps>> = {
  brain: Brain, sparkles: Sparkles, "book-open": BookOpen, search: Search,
  rocket: Rocket, "chef-hat": ChefHat, "alert-triangle": AlertTriangle,
  "message-circle": MessageCircle, refrigerator: Refrigerator,
  "check-circle": CheckCircle, "help-circle": HelpCircle,
  "message-square": MessageSquare, quote: Quote, "arrow-right": ArrowRight,
  "file-text": FileText, clock: Clock,
  database: Database, shield: Shield, zap: Zap, target: Target,
  layers: Layers, globe: Globe, code: Code, "trending-up": TrendingUp,
  users: Users, lightbulb: Lightbulb, star: Star, settings: Settings,
  lock: Lock, cloud: Cloud, play: Play,
  smartphone: Smartphone, monitor: Monitor, terminal: Terminal,
  user: User, "user-circle": UserCircle,
  folder: Folder, "folder-open": FolderOpen,
  download: Download, upload: Upload,
  wifi: Wifi, battery: Battery, camera: Camera,
  music: Music, video: Video, image: Image,
  edit: Edit, trash: Trash, refresh: Refresh, share: Share,
  heart: Heart, award: Award, compass: Compass,
  cpu: Cpu, "git-branch": GitBranch, link: Link,
  mail: Mail, mic: Mic, phone: Phone, power: Power,
  send: Send, server: Server, "thumbs-up": ThumbsUp,
  tool: Tool, "x-circle": XCircle,
  "pie-chart": PieChart, "bar-chart": BarChart,
  activity: Activity, "dollar-sign": DollarSign,
  percent: Percent, hash: Hash,
};

const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

export const SvgIcon: React.FC<IconProps & { name: string }> = ({ name, ...props }) => {
  // 이모지가 name으로 들어온 경우 SVG가 아닌 span으로 렌더링
  if (EMOJI_REGEX.test(name)) {
    const { size = 80 } = props;
    return (
      <span style={{
        fontSize: size * 0.85,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      }}>
        {name}
      </span>
    );
  }

  const Icon = iconMap[name];
  if (!Icon) {
    const { size = 80, color = T.accentBright } = props;
    return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill={color} stroke="none" fontFamily="Inter" fontWeight="700">{name.charAt(0).toUpperCase()}</text></svg>);
  }
  return <Icon {...props} />;
};

export const IconCircle: React.FC<{
  name: string; size?: number; iconSize?: number;
  bgColor?: string; borderColor?: string;
}> = ({ name, size = 100, iconSize = 48, bgColor = T.accentTint, borderColor = T.accent }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    backgroundColor: bgColor, border: `2px solid ${borderColor}`,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <SvgIcon name={name} size={iconSize} />
  </div>
);
