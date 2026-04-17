import DashboradSidebar from './DashboradSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <>
      <DashboradSidebar />
      <main className="fixed left-80 top-0 right-0 bottom-0 overflow-y-auto bg-gray-50">
        <Outlet /> {/* Render children pages with nav*/}
      </main>
    </>
  );
};

export default DashboardLayout;
