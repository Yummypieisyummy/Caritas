import Button from '../ui/Button';

const DashboradSidebar = () => {
  return (
    <aside className="fixed h-screen w-80 flex flex-col bg-text-logo p-6 justify-between">
      <h2 className="text-4xl font-semibold text-white">Caritas</h2>

      <section className="flex flex-col gap-6">
        <Button
          as="link"
          to="/dashboard/overview"
          variant="textOnly"
          className="text-white text-xl font-medium hover:opacity-100 hover:bg-white/10 py-4"
        >
          Overview
        </Button>
        <Button
          as="link"
          to="/dashboard/posts"
          variant="textOnly"
          className="text-white text-xl font-medium hover:opacity-100 hover:bg-white/10 py-4"
        >
          My Posts
        </Button>
        <Button
          as="link"
          to="/organization/myposts"
          variant="textOnly"
          className="text-white text-xl font-medium hover:opacity-100 hover:bg-white/10 py-4"
        >
          Org Profile
        </Button>
        <Button
          as="link"
          to="/dashboard/team"
          variant="textOnly"
          className="text-white text-xl font-medium hover:opacity-100 hover:bg-white/10 py-4"
        >
          Team Access
        </Button>
        <Button
          as="link"
          to="/overview"
          variant="textOnly"
          className="text-white text-xl font-medium hover:opacity-100 hover:bg-white/10 py-4"
        >
          Settings
        </Button>
      </section>

      <footer className="flex flex-col gap-4">
        <Button
          as="link"
          to="/organization/:id"
          variant="textOnly"
          className="text-white font-medium"
        >
          View Public page
        </Button>
        <Button
          as="link"
          to="/organization/:id"
          variant="textOnly"
          className="text-white font-medium"
        >
          Logout
        </Button>
      </footer>
    </aside>
  );
};

export default DashboradSidebar;
