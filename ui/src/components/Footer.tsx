import { Github, Heart } from 'lucide-react';

const Footer:React.FC<any> =  () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center ">
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