import DashboradSidebar from './DashboradSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <>
      <DashboradSidebar />
      <main className="app-scrollbar fixed bottom-0 left-0 right-0 top-40 overflow-y-auto bg-gray-50 md:left-80 md:top-0">
        <Outlet /> {/* Render children pages with nav*/}
      </main>
    </>
  );
};

export default DashboardLayout;
