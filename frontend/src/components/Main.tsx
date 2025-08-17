import { useDispatch, useSelector } from "react-redux";
import { addDocument } from "../redux/action/index";
import type {RootState} from "../redux/store"
const Main = () => {
const dispatch = useDispatch();
const documents = useSelector((state: RootState) => state.handleDocument);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      const id =  crypto.randomUUID(); // Generate a unique ID for the document
      reader.onload = (event) => {
                dispatch(addDocument({ id, name: file.name, content: event.target?.result as string }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Document</h2>
            
            <label 
              className="block mb-2 text-sm font-medium text-slate-300" 
              htmlFor="file_input"
            >
              Choose file
            </label>
            
            <input
              className="block w-full text-sm text-slate-300 border border-slate-700 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white file:hover:bg-blue-700 transition-colors"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            
            <p className="mt-1 text-sm text-slate-500">
              Upload text files for regex processing
            </p>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Document Content
              </label>
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={12}
                value={documents[documents.length - 1]?.content}
                readOnly
                placeholder="Document content will appear here..."
              />
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Regex Pattern</h2>
            
            <input
              type="text"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Enter regex pattern..."
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                Global
              </button>
              <button className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                Case Insensitive
              </button>
              <button className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                Multiline
              </button>
            </div>

            <button className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
              Test Pattern
            </button>
          </div>
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Matches Found</h3>
                <p className="text-slate-500">No matches yet</p>
              </div>
              
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Groups</h3>
                <p className="text-slate-500">No groups captured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;