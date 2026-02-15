import DashboradSidebar from './DashboradSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <>
      <DashboradSidebar />
      <main className="ml-80 bg-nav-bg">
        <Outlet /> {/* Render children pages with nav*/}
      </main>
    </>
  );
};

export default DashboardLayout;
