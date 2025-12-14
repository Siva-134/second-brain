import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from './Button';
import api from '../api';

// Local Input component just for modal/dark theme if needed, or reuse but pass className
// I will just use standard input styles here to match dark mode cleanly
const DarkInput = ({ label, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-300 ml-1">{label}</label>
        <input
            className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            {...props}
        />
    </div>
);

export const CreateContentModal = ({ open, onClose, onContentAdded }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        type: 'video', // default
        tags: '',
        description: ''
    });

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Process tags from comma separated string
            const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

            const payload = {
                title: formData.title,
                link: formData.link,
                type: formData.type,
                tags: tagsArray,
                description: formData.description
            };

            const response = await api.post('/add-content', payload);

            if (response.status === 201) {
                onContentAdded();
                onClose();
                // Reset form
                setFormData({
                    title: '',
                    link: '',
                    type: 'video',
                    tags: '',
                    description: ''
                });
            }
        } catch (error) {
            console.error("Error adding content:", error);
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please login again.");
                navigate('/');
            } else {
                alert("Failed to add content. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
                    <h2 className="text-xl font-semibold text-gray-100">Add New Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <DarkInput
                        label="Title"
                        placeholder="e.g. How to Build a Second Brain"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <DarkInput
                        label="Link"
                        placeholder="https://..."
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-300 ml-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                            >
                                <option value="video">Video</option>
                                <option value="article">Article</option>
                                <option value="audio">Audio</option>
                                <option value="image">Image</option>
                            </select>
                        </div>

                        <DarkInput
                            label="Tags"
                            placeholder="tech, productivity (comma sorted)"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-300 ml-1">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none"
                            placeholder="Add some notes about this content..."
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            startIcon={<Plus className="w-4 h-4" />}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                            Add Content
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
