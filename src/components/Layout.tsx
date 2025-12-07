import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-card border-t border-border py-6 mt-auto transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} SnapShare. Secure cross-device file sharing.
                </div>
            </footer>
        </div>
    );
};
