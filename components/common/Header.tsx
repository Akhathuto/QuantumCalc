import React from 'react';
import { AppTab } from '../../types';
import Logo from './Logo';
import Tab from './Tab';
import DropdownTab from './DropdownTab';
import {
    Calculator as CalculatorIcon,
    AreaChart,
    Table,
    BarChart,
    Sigma,
    Ratio,
    Binary,
    Landmark,
    Calendar,
    History as HistoryIcon,
    Info,
    MoveHorizontal,
    Sun,
    Moon,
    MoreVertical
} from 'lucide-react';

interface HeaderProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    theme: string;
    toggleTheme: () => void;
}

const NAV_STRUCTURE = [
  { id: AppTab.Calculator, label: 'Calculator', Icon: CalculatorIcon },
  { id: AppTab.Graph, label: 'Graphing', Icon: AreaChart },
  { 
    label: 'Math Tools', 
    Icon: Sigma, 
    subTabs: [
      { id: AppTab.Matrix, label: 'Matrix', Icon: Table },
      { id: AppTab.Statistics, label: 'Statistics', Icon: BarChart },
      { id: AppTab.EquationSolver, label: 'Equation Solver', Icon: Sigma },
    ] 
  },
  {
    label: 'Converters',
    Icon: MoveHorizontal,
    subTabs: [
      { id: AppTab.UnitConverter, label: 'Unit Converter', Icon: MoveHorizontal },
      { id: AppTab.PercentageCalculator, label: 'Percentage', Icon: Ratio },
      { id: AppTab.BaseConverter, label: 'Base Converter', Icon: Binary },
    ]
  },
  {
    label: 'Utilities',
    Icon: Landmark,
    subTabs: [
        { id: AppTab.Financial, label: 'Financial', Icon: Landmark },
        { id: AppTab.Date, label: 'Date', Icon: Calendar },
    ]
  }
];

const MORE_DROPDOWN_SUBTABS = [
    { id: AppTab.History, label: 'History', Icon: HistoryIcon },
    { id: AppTab.About, label: 'About', Icon: Info },
];

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
    return (
        <header className="bg-brand-surface/70 backdrop-blur-sm sticky top-0 z-40 border-b border-brand-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div onClick={() => setActiveTab(AppTab.Calculator)}>
                        <Logo />
                    </div>
                    
                    {/* Main Navigation for larger screens */}
                    <div className="hidden lg:flex items-center gap-2">
                        {NAV_STRUCTURE.map((item, index) => {
                            if ('subTabs' in item) {
                                return (
                                    <DropdownTab
                                        key={index}
                                        label={item.label}
                                        Icon={item.Icon}
                                        subTabs={item.subTabs}
                                        activeTab={activeTab}
                                        onTabClick={setActiveTab}
                                    />
                                );
                            }
                            return (
                                <Tab
                                    key={item.id}
                                    label={item.label}
                                    Icon={item.Icon}
                                    isActive={activeTab === item.id}
                                    onClick={() => setActiveTab(item.id)}
                                />
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                         <div className="hidden sm:flex">
                             <DropdownTab
                                label="More"
                                Icon={MoreVertical}
                                subTabs={MORE_DROPDOWN_SUBTABS}
                                activeTab={activeTab}
                                onTabClick={setActiveTab}
                             />
                         </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-brand-text-secondary hover:text-brand-text hover:bg-brand-surface focus:outline-none focus:ring-2 focus:ring-brand-primary" aria-label="Toggle theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </div>

                {/* Scrollable Navigation for smaller screens */}
                <div className="lg:hidden flex items-center overflow-x-auto -mb-px pb-1">
                     {NAV_STRUCTURE.map((item, index) => {
                            if ('subTabs' in item) {
                                return (
                                    <DropdownTab
                                        key={index}
                                        label={item.label}
                                        Icon={item.Icon}
                                        subTabs={item.subTabs}
                                        activeTab={activeTab}
                                        onTabClick={setActiveTab}
                                    />
                                );
                            }
                            return (
                                <Tab
                                    key={item.id}
                                    label={item.label}
                                    Icon={item.Icon}
                                    isActive={activeTab === item.id}
                                    onClick={() => setActiveTab(item.id)}
                                />
                            );
                        })}
                        {/* Add History/About for smallest screens */}
                        <div className="sm:hidden flex">
                            <Tab
                                key={AppTab.History}
                                label="History"
                                Icon={HistoryIcon}
                                isActive={activeTab === AppTab.History}
                                onClick={() => setActiveTab(AppTab.History)}
                            />
                            <Tab
                                key={AppTab.About}
                                label="About"
                                Icon={Info}
                                isActive={activeTab === AppTab.About}
                                onClick={() => setActiveTab(AppTab.About)}
                            />
                        </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
