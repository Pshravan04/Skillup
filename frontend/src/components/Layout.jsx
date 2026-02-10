import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="bg-discord-dark min-h-screen text-discord-text flex font-sans">
            <Sidebar />
            <div className="flex-1 ml-16 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
