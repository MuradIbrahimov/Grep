import { Github, Heart } from 'lucide-react';

const Footer:React.FC<any> =  () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <img 
              src="/regex_icon.svg" 
              alt="RegexViz" 
              className="w-5 h-5"
            />
            <span className="font-medium text-white">RegexViz</span>
          </div>

          <div className="flex items-center space-x-1 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>© {currentYear}</span>
          </div>

          <button className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;