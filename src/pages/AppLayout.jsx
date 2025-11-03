
import React, { useState } from 'react'; 
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboardComponents/Sidebar/Sidebar';
import Header from '../dashboardComponents/header/Header';
import { Toaster } from 'react-hot-toast';
import { TransactionProvider } from '../context/TransactionContext';

function AppLayout() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">

      
      <Toaster
        position="top-right" 
        toastOptions={{
          style: {
            background: '#333', 
            color: '#fff', 
          },
        }}
      />

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 w-full md:ml-[250px] flex flex-col">


        <TransactionProvider>
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}/>
          <Outlet />
        </TransactionProvider>

      </div>
    </div>
  );
}

export default AppLayout;