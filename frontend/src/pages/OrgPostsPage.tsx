import ManagePosts from '../components/organization/ManagePosts';
import Button from '../components/ui/Button';

const OrgPostsPage = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-nav-bg">
      <section className="flex items-center justify-between w-full border-b border-nav-stroke px-8 py-4">
        <p className="font-medium text-lg">Dashboard {'>'} My Post</p>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full w-10 h-10 shadow-md"></div>
          <Button as="button" size="lg" variant="primary">
            Create Post
          </Button>
        </div>
      </section>
      <ManagePosts />
    </main>
  );
};

export default OrgPostsPage;
