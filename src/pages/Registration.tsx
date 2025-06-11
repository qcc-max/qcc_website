import React from 'react';
import { Navbar } from '../components/Navbar';
import { BookingPage } from '../components/BookingPage';

export const Registration: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      {/* Simplified navbar wrapper - removed conflicting background */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1 w-full">
        <BookingPage />
      </main>
    </div>
  );
};