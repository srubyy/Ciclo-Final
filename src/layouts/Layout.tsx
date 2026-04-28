import React from 'react';
import Navbar from '../components/Navbar';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
    return (
        <div className="min-h-screen print:min-h-0 bg-[#0a120d] text-white print:bg-white print:text-black">
            <Navbar />
            <main className="md:ml-56 print:ml-0 min-h-screen print:min-h-0 pb-20 md:pb-0 print:pb-0">
                {(title || subtitle) && (
                    <div className="px-6 print:px-0 pt-8 print:pt-2 pb-6 print:pb-2 border-b border-white/5 print:border-gray-200">
                        {title && <h1 className="text-2xl print:text-xl font-bold text-white print:text-black">{title}</h1>}
                        {subtitle && <p className="text-gray-400 print:text-gray-600 text-sm print:text-xs mt-1">{subtitle}</p>}
                    </div>
                )}
                <div className="p-6 print:p-0 print:pt-2">{children}</div>
            </main>
        </div>
    );
}
