import { Loader2 } from "lucide-react";

export const Button = ({
    variant = "primary",
    size = "md",
    loading = false,
    startIcon,
    endIcon,
    className = "",
    children,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    // Updated for Dark Mode compatibility
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 focus:ring-indigo-500",
        secondary: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 focus:ring-indigo-500",
        outline: "border-2 border-gray-700 hover:bg-gray-800 text-gray-300 focus:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-200 focus:ring-gray-500",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 focus:ring-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
};
