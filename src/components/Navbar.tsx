import React from 'react';
import { Share2, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
    return (
        <nav className="bg-card border-b border-border transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Share2 className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">SnapShare</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};
