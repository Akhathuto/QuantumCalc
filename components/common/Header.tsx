
import React from 'react';
import {
  Calculator as CalculatorIcon,
  LineChart,
  Table,
  BarChart,
  FunctionSquare,
  Scale,
  Landmark,
  Percent,
  Binary,
  Banknote,
  Calendar,
  History,
  Info,
  Beaker,
  TestTube,
  HeartPulse
} from 'lucide-react';

import Logo from './Logo';
import Tab from './Tab';
import DropdownTab from './DropdownTab';
import { AppTab } from '../../types';

interface HeaderProps {
  activeTab: AppTab;
  onTabClick: (tabId: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabClick }) => {
  return (
    <header className="bg-brand-surface/70 backdrop-blur-sm p-4 rounded-b-xl shadow-lg sticky top-0 z-40 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div onClick={() => onTabClick('calculator')}>
          <Logo />
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          <Tab
            label="Calculator"
            Icon={CalculatorIcon}
            isActive={activeTab === 'calculator'}
            onClick={() => onTabClick('calculator')}
          />
          <Tab
            label="Graphing"
            Icon={LineChart}
            isActive={activeTab === 'graphing'}
            onClick={() => onTabClick('graphing')}
          />
          <DropdownTab
            label="Math Tools"
            Icon={Beaker}
            activeTab={activeTab}
            onTabClick={onTabClick}
            subTabs={[
              { id: 'matrix', label: 'Matrix Calculator', Icon: Table },
              { id: 'statistics', label: 'Statistics Calculator', Icon: BarChart },
              { id: 'equations', label: 'Equation Solver', Icon: FunctionSquare },
            ]}
          />
          <DropdownTab
            label="Converters"
            Icon={TestTube}
            activeTab={activeTab}
            onTabClick={onTabClick}
            subTabs={[
              { id: 'units', label: 'Unit Converter', Icon: Scale },
              { id: 'currency', label: 'Currency Converter', Icon: Banknote },
              { id: 'percentage', label: 'Percentage Calculator', Icon: Percent },
              { id: 'base', label: 'Base Converter', Icon: Binary },
            ]}
          />
          <Tab
            label="Financial"
            Icon={Landmark}
            isActive={activeTab === 'financial'}
            onClick={() => onTabClick('financial')}
          />
          <Tab
            label="Date"
            Icon={Calendar}
            isActive={activeTab === 'date'}
            onClick={() => onTabClick('date')}
          />
          <Tab
            label="Health"
            Icon={HeartPulse}
            isActive={activeTab === 'health'}
            onClick={() => onTabClick('health')}
          />
          <Tab
            label="History"
            Icon={History}
            isActive={activeTab === 'history'}
            onClick={() => onTabClick('history')}
          />
          <Tab
            label="About"
            Icon={Info}
            isActive={activeTab === 'about'}
            onClick={() => onTabClick('about')}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
