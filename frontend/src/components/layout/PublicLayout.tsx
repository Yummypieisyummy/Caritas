import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Outlet /> {/* Render children pages with nav*/}
      </main>
    </>
  );
};

export default PublicLayout;
