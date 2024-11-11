// src/layouts/AuthenticatedLayout.tsx
import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';

export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-kemo-black">
      <main className="pt-16"> {/* Add padding to account for fixed navbar */}
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}