import React from 'react';
import { useRouter } from 'next/navigation';

interface TabsHeaderProps {
  activeTab: 'profile' | 'learn' | 'taxprep';
  setActiveTab: (tab: 'profile' | 'learn' | 'taxprep') => void;
  showDeviceSwitch?: boolean;
  device: 'mobile' | 'desktop';
  setDevice: (device: 'mobile' | 'desktop') => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ activeTab, setActiveTab, showDeviceSwitch, device, setDevice }) => {
  const router = useRouter();
  return (
    <header className="w-full flex flex-col items-center bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <nav className="flex gap-4 py-3 w-full max-w-2xl justify-center">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-150 ${activeTab === 'profile' ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
          onClick={() => {
            setActiveTab('profile');
            router.push('/main/profile');
          }}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-150 ${activeTab === 'learn' ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
          onClick={() => {
            setActiveTab('learn');
            router.push('/main/learn');
          }}
        >
          Learn
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-150 ${activeTab === 'taxprep' ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
          onClick={() => {
            setActiveTab('taxprep');
            router.push('/main/2024');
          }}
        >
          Tax Preparation
        </button>
      </nav>
      {showDeviceSwitch && (
        <div className="flex gap-2 pb-2 mt-1">
          <button
            className={`px-4 py-1 rounded-full font-semibold shadow transition-all duration-150 border ${device === 'mobile' ? 'bg-yellow-400 text-yellow-900 border-yellow-500 scale-105' : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'}`}
            onClick={() => setDevice('mobile')}
            aria-label="Switch to mobile view"
          >
            <span className="inline-block align-middle mr-1">📱</span>Mobile
          </button>
          <button
            className={`px-4 py-1 rounded-full font-semibold shadow transition-all duration-150 border ${device === 'desktop' ? 'bg-yellow-400 text-yellow-900 border-yellow-500 scale-105' : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'}`}
            onClick={() => setDevice('desktop')}
            aria-label="Switch to desktop view"
          >
            <span className="inline-block align-middle mr-1">🖥️</span>Desktop
          </button>
        </div>
      )}
    </header>
  );
};

export default TabsHeader;
