import { useState, useEffect } from 'react';
import { Share2, Trash2, Youtube, Twitter, FileText, Video, Mic, Image as ImageIcon, ExternalLink, Play, X, Check } from "lucide-react";

// Card component for displaying content
export const Card = ({ title, type, link, tags, onDelete, thumbnail, contentId, onShare }) => {
    const [imageError, setImageError] = useState(false);
    const [showEmbed, setShowEmbed] = useState(false);

    const getYouTubeThumbnail = (url, quality = 'maxresdefault') => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://img.youtube.com/vi/${match[2]}/${quality}.jpg`
            : null;
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Initialize with MaxRes
    const [currentThumbnail, setCurrentThumbnail] = useState(thumbnail || getYouTubeThumbnail(link, 'maxresdefault'));

    const handleImageError = () => {
        if (currentThumbnail && currentThumbnail.includes('maxresdefault')) {
            // If HD fails, try HQ
            setCurrentThumbnail(getYouTubeThumbnail(link, 'hqdefault'));
        } else {
            // If HQ fails, show placeholder
            setImageError(true);
        }
    };

    // Update thumbnail if link changes
    useEffect(() => {
        setCurrentThumbnail(thumbnail || getYouTubeThumbnail(link, 'maxresdefault'));
    }, [link, thumbnail]);

    const displayThumbnail = currentThumbnail;

    const getIcon = () => {
        if (type === "youtube" || (link && link.includes("youtube.com"))) return <Youtube className="w-5 h-5 text-red-500" />;
        if (type === "twitter" || (link && (link.includes("twitter.com") || link.includes("x.com"))) && !link.includes("youtube")) return <Twitter className="w-5 h-5 text-blue-400" />;

        switch (type) {
            case "video": return <Video className="w-5 h-5 text-indigo-400" />;
            case "audio": return <Mic className="w-5 h-5 text-emerald-400" />;
            case "image": return <ImageIcon className="w-5 h-5 text-pink-400" />;
            case "article":
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    const isYouTube = link && (link.includes("youtube.com") || link.includes("youtu.be"));
    const youTubeId = isYouTube ? getYouTubeId(link) : null;

    const handlePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isYouTube && youTubeId) {
            setShowEmbed(true);
        } else {
            window.open(link, '_blank');
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onShare) {
            onShare({ title, link, contentId });
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1b2e] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md flex flex-col h-full relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

            {/* Thumbnail / Embed Area */}
            <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden">
                {showEmbed && youTubeId ? (
                    <div className="w-full h-full bg-black relative animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEmbed(false);
                            }}
                            className="absolute top-2 right-2 z-30 p-1 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                ) : (
                    <>
                        {/* Main Icon Centered if no thumbnail, or actual thumbnail */}
                        {!imageError && displayThumbnail ? (
                            <div className="w-full h-full relative group/image cursor-pointer transform-gpu" onClick={handlePlay}>
                                <img
                                    src={displayThumbnail}
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                                    onError={handleImageError}
                                    loading="eager"
                                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                                />
                                {isYouTube && (
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg ring-1 ring-white/50">
                                            <Play className="w-6 h-6 text-gray-900 ml-1 fill-gray-900" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#111218] cursor-pointer group/icon" onClick={handlePlay}>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 relative z-10">
                                    {getIcon()}
                                </div>
                            </div>
                        )}

                        {/* Top Right Type Badge */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 z-10 border border-white/10 shadow-lg">
                            {type === "youtube" || (link && link.includes("youtube.com")) ? (
                                <Youtube className="w-4 h-4 text-[#FF0000] fill-current" />
                            ) : (
                                getIcon()
                            )}
                            <span className="text-white text-xs font-bold tracking-wide">YouTube</span>
                        </div>
                    </>
                )}
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col bg-white dark:bg-[#0f1016]">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[16px] leading-snug line-clamp-2" title={title}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            {title}
                        </a>
                    </h3>
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 rounded-full bg-[#1e293b] text-blue-400 text-[11px] font-bold tracking-wide border border-blue-500/20 shadow-sm"
                            >
                                #{tag.title || tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Spacer to push actions to bottom */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors group/link"
                    >
                        <ExternalLink className="w-3.5 h-3.5 group-hover/link:scale-110 transition-transform" />
                        Open Link
                    </a>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleShare}
                            className={`p-2 rounded-lg transition-colors text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300`}
                            title="Share"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
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
