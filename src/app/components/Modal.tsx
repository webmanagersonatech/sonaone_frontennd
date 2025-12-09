"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
    open,
    onClose,
    size = "md",
    title,
    children,
    footer,
}: any) {

    const sizeClasses: any = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`bg-white rounded-xl shadow-xl w-[95%] p-8 relative ${sizeClasses[size]}`}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Title */}
                        {title && (
                            <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
                        )}

                        {/* Body - Scrollable */}
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="mt-6 flex justify-center gap-4">{footer}</div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
