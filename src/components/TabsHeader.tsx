import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiUserCircle, HiBookOpen, HiDocumentText, HiCollection, HiSupport, HiDeviceMobile, HiDesktopComputer } from "react-icons/hi";

type Tab = "profile" | "learn" | "taxprep" | "resources" | "support";
type Device = "mobile" | "desktop";

interface TabsHeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  device: Device;
  setDevice: (device: Device) => void;
  showDeviceSwitch?: boolean;
}

const tabs: { key: Tab; label: string; icon: JSX.Element; href: string }[] = [
  {
    key: "learn",
    label: "Learn",
    icon: <HiBookOpen className="inline-block mr-1 mb-1 text-lg" />,
    href: "/main/learn",
  },
  {
    key: "taxprep",
    label: "TaxPrep",
    icon: <HiDocumentText className="inline-block mr-1 mb-1 text-lg" />,
    href: "/main/2024",
  },
  {
    key: "resources",
    label: "Resources",
    icon: <HiCollection className="inline-block mr-1 mb-1 text-lg" />,
    href: "/main/resources",
  },
  {
    key: "support",
    label: "Support",
    icon: <HiSupport className="inline-block mr-1 mb-1 text-lg" />,
    href: "/main/support",
  },
];

const TabsHeader: FC<TabsHeaderProps> = ({
  activeTab,
  setActiveTab,
  device,
  setDevice,
  showDeviceSwitch = true,
}) => {
  return (
    <header className="w-full bg-gradient-to-r from-[#8000FF] via-[#6a00cc] to-[#FFC107] shadow-lg px-2 md:px-8 py-3 flex items-center justify-between mb-6 sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center group">
        <span className="text-white font-extrabold text-2xl tracking-tight drop-shadow-lg font-poppins group-hover:scale-105 transition-transform duration-200">
          TaxNavo
        </span>
      </Link>

      {/* Center: Tabs */}
      <nav className="flex-1 flex justify-center gap-1 md:gap-3">
        {tabs.map((tab) => (
          <motion.div
            key={tab.key}
            whileHover={{ scale: 1.07, y: -2, boxShadow: "0 4px 16px #8000FF22" }}
            whileTap={{ scale: 0.97 }}
            className="flex"
          >
            <Link
              href={tab.href}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-full font-semibold text-base md:text-lg transition-all duration-200
                ${
                  activeTab === tab.key
                    ? "bg-white text-[#8000FF] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/40"
                }
              `}
              style={{ minWidth: 110 }}
            >
              {tab.icon}
              {tab.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Right: Device Switcher & Profile */}
      <div className="flex items-center gap-2 ml-2">
        {showDeviceSwitch && (
          <div className="flex gap-1 bg-white/20 rounded-full px-2 py-1 shadow-inner">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Switch to mobile view"
              className={`p-2 rounded-full transition-colors duration-150 ${
                device === "mobile"
                  ? "bg-[#FFC107] text-[#8000FF] shadow"
                  : "bg-transparent text-white hover:bg-white/30"
              }`}
              onClick={() => setDevice("mobile")}
            >
              <HiDeviceMobile className="text-xl" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Switch to desktop view"
              className={`p-2 rounded-full transition-colors duration-150 ${
                device === "desktop"
                  ? "bg-[#FFC107] text-[#8000FF] shadow"
                  : "bg-transparent text-white hover:bg-white/30"
              }`}
              onClick={() => setDevice("desktop")}
            >
              <HiDesktopComputer className="text-xl" />
            </motion.button>
          </div>
        )}
        {/* Profile Avatar Button */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/main/profile"
            onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-full transition-all duration-200 border-2 ${
              activeTab === "profile"
                ? "bg-white text-[#8000FF] border-[#8000FF] shadow-lg"
                : "bg-white/20 text-white border-transparent hover:bg-white/40"
            }`}
            aria-label="Profile"
          >
            <HiUserCircle className="text-2xl md:text-3xl" />
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default TabsHeader;
