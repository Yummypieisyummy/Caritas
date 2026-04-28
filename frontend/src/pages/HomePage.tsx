// Import Home components and files here
import FunctionCards from '../components/home/FunctionCards';
import SellingPoints from '../components/home/SellingPoints';
import Button from '../components/ui/Button';

const SVC_Basilica = new URL('../assets/SVC_Basilica.jpg', import.meta.url)
  .href;

const HomePage = () => {
  return (
    <main
      data-testid="home-page-container"
      className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:items-stretch">
          <article className="overflow-hidden rounded-xl bg-white shadow-card-shadow">
            <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-text-green">
                  Community care, made easier
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-text-base sm:text-4xl lg:text-5xl">
                  Connect local needs with organizations ready to help.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
                  Caritas helps community members find verified charitable
                  resources while giving organizations a simple place to post
                  services, item donations, and volunteer opportunities.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    as="link"
                    to="/directory"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Browse Help
                  </Button>
                  <Button
                    as="link"
                    to="/signup"
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Register Organization
                  </Button>
                </div>
              </div>

              <img
                src={SVC_Basilica}
                alt="Saint Vincent Basilica"
                className="h-64 w-full object-cover sm:h-80 lg:h-full"
              />
            </div>
          </article>

          <div className="flex">
            <FunctionCards />
          </div>
        </section>

        <SellingPoints />
      </div>
    </main>
  );
};

export default HomePage;
