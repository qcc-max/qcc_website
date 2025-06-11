import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroCard } from '../components/HeroCard';
import StatsCard from '../components/StatsCard';
import { AboutCard } from '../components/AboutCard';
import { ServicesCard }  from '../components/ServicesCard';
import TestimonialsCard   from '../components/TestimonialsCard';
import { ContactCard } from '../components/ContactCard';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      <Navbar />
      <main className="relative">
        <HeroCard />
        <StatsCard/>
        <AboutCard />
        <ServicesCard />
        <TestimonialsCard />
        <ContactCard />
      </main>
    </div>
  );
};