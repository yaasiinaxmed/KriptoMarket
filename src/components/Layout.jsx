import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl text-white font-bold">KriptoMarket</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 py-4 text-center text-white">
        <p>Created by Yasin Ahmed</p>
      </footer>
    </div>
  );
};

export default Layout;
