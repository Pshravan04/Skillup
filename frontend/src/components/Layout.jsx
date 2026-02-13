import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-brand-darker min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 mt-24 px-4 md:px-8 pb-8 md:ml-[300px] transition-all duration-500 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
