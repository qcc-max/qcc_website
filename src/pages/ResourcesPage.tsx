import React from 'react';
import { Navbar } from '../components/Navbar';
import { ResourcesPage } from '../components/Resources';

export const Resources: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      {/* Simplified navbar wrapper - removed conflicting background */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1 w-full">
        <ResourcesPage />
      </main>
    </div>
  );
};