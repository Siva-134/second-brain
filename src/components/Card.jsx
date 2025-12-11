import { useState } from 'react';
import { Share2, Trash2, Youtube, Twitter, FileText, Video, Mic, Image as ImageIcon, ExternalLink } from "lucide-react";

export const Card = ({ title, type, link, tags, onDelete, thumbnail }) => {
    const [imageError, setImageError] = useState(false);

    const getIcon = () => {
        if (type === "youtube" || (link && link.includes("youtube.com"))) return <Youtube className="w-5 h-5 text-red-500" />;
        if (type === "twitter" || (link && (link.includes("twitter.com") || link.includes("x.com")))) return <Twitter className="w-5 h-5 text-blue-400" />;

        switch (type) {
            case "video": return <Video className="w-5 h-5 text-indigo-400" />;
            case "audio": return <Mic className="w-5 h-5 text-emerald-400" />;
            case "image": return <ImageIcon className="w-5 h-5 text-pink-400" />;
            case "article":
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    const getTypeLabel = () => {
        if (link && link.includes("youtube.com")) return "YouTube";
        if (link && (link.includes("twitter.com") || link.includes("x.com"))) return "Twitter";
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    return (
        <div className="group bg-gray-900 rounded-2xl border border-gray-800/50 shadow-sm hover:shadow-xl hover:border-gray-700/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Thumbnail Header */}
            <div className="h-40 bg-gray-950/50 flex items-center justify-center relative border-b border-gray-800/50 overflow-hidden">
                {/* Main Icon Centered if no thumbnail, or actual thumbnail */}
                {!imageError && thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="bg-gray-800 p-3 rounded-full shadow-inner ring-1 ring-gray-700">
                        {getIcon()}
                    </div>
                )}

                {/* Top Right Type Badge */}
                <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-300 ring-1 ring-gray-800 shadow-sm flex items-center gap-1">
                    {getIcon()}
                    <span>{getTypeLabel()}</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-200 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            {title}
                        </a>
                    </h3>
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-wide uppercase border border-indigo-500/20"
                            >
                                #{tag.title || tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Spacer to push actions to bottom */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-800">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Open Link
                    </a>

                    <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
