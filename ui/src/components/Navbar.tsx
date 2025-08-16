import React, { useState } from 'react';
import { Menu, X, Code, Search, BookOpen, Github, Settings } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentSection = 'visualizer' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'visualizer', label: 'Visualizer', icon: Search },
    { id: 'patterns', label: 'Patterns', icon: Code },
    { id: 'docs', label: 'Docs', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (section: string) => {
    onNavigate?.(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0 flex justify-between items-center space-x-2 h-16">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center space-x-2">
                <img 
                  src="/regex_icon.svg" 
                  alt="RegexLab Logo" 
                  className="w-full h-full object-contain"
                />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RegexLab
              </span>
              </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-slate-700 text-blue-400 border border-slate-600'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side stuff */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="text-slate-300 hover:text-white transition-colors duration-200"
              title="View source on GitHub"
            >
              <Github className="w-5 h-5" />
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      currentSection === item.id
                        ? 'bg-slate-700 text-blue-400 border border-slate-600'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-2 border-t border-slate-700 mt-2">
                <button 
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  title="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;