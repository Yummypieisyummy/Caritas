import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="app-scrollbar fixed top-20 left-0 right-0 bottom-0 overflow-y-auto">
        <Outlet /> {/* Render children pages with nav*/}
      </main>
    </>
  );
};

export default PublicLayout;
