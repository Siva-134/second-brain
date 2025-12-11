import { LayoutDashboard, Youtube, Twitter, Facebook, Grid, FileText, Video, Mic, Image as ImageIcon } from "lucide-react";

export const Sidebar = ({ activeTab, onTabChange }) => {

    const menuItems = [
        { id: 'all', label: 'All Notes', icon: <Grid className="w-5 h-5" /> },
        { id: 'youtube', label: 'Youtube', icon: <Youtube className="w-5 h-5 text-red-500" /> },
        { id: 'twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5 text-blue-400" /> },
    ];

    const typeItems = [
        { id: 'video', label: 'Videos', icon: <Video className="w-5 h-5" /> },
        { id: 'article', label: 'Articles', icon: <FileText className="w-5 h-5" /> },
        { id: 'audio', label: 'Audio', icon: <Mic className="w-5 h-5" /> },
        { id: 'image', label: 'Images', icon: <ImageIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 border-r border-gray-800 fixed left-0 top-0 pt-20 pb-6 px-4 flex flex-col z-40">
            <div className="flex flex-col gap-1 mb-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sources</p>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                            ${activeTab === item.id
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                        `}
                    >
                        <span className={`transition-colors ${activeTab === item.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Types</p>
                {typeItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                            ${activeTab === item.id
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                        `}
                    >
                        <span className={`transition-colors ${activeTab === item.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto px-3">
                {/* Bottom content if needed */}
            </div>
        </div>
    );
};
