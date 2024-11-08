import { Header } from '../components/header/Header';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-kemo-black">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}