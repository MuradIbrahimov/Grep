import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Code, Search, BookOpen, Github, Settings, Check } from 'lucide-react';



const Navbar:React.FC<any> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Matcher', icon: Check, isActive: true },
    { path: '/visualizer', label: 'Visualizer', icon: Search, isActive: false },
    { path: '/patterns', label: 'Patterns', icon: Code, isActive: false },
    { path: '/docs', label: 'Docs', icon: BookOpen, isActive: false },
    { path: '/settings', label: 'Settings', icon: Settings, isActive: false }
  ];

  const handleMobileNavClick = () => {
    setIsMenuOpen(false); 
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <img 
                src="/regex_icon.svg" 
                alt="RegexLab Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RegexLab
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = !item.isActive; 
              return (
                <NavLink
                  key={item.path}
                  to={item.path}

                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-slate-700 text-blue-400 border border-slate-600'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${isDisabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="flex items-center">
            <button 
              className="hidden md:block text-slate-300 hover:text-white transition-colors duration-200"
              title="View source on GitHub"
            >
              <Github className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
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
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleMobileNavClick}
                    className={({ isActive }) =>
                      `w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        isActive
                          ? 'bg-slate-700 text-blue-400 border border-slate-600'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
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