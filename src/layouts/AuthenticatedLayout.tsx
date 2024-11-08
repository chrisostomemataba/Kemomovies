// src/layouts/AuthenticatedLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-kemo-black">
      <main className="pt-16"> {/* Add padding to account for fixed navbar */}
        <Outlet />
      </main>
    </div>
  );
}