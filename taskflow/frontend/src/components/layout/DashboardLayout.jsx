// src/components/layout/DashboardLayout.jsx

import Sidebar from './Sidebar';
import Header from './Header';

/**
 * DashboardLayout Component
 * Main layout wrapper for dashboard pages
 */

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;