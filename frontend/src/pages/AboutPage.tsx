import type { ReactNode } from 'react';
import {
  Building2,
  CircleAlert,
  HeartHandshake,
  Mail,
  Search,
  UsersRound,
} from 'lucide-react';

const InfoCard = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <article className={`rounded-xl bg-white p-5 shadow-card-shadow ${className}`}>
    <h2 className="text-xl font-semibold text-text-base">{title}</h2>
    <div className="mt-3 space-y-4 text-sm leading-6 text-text-muted sm:text-base">
      {children}
    </div>
  </article>
);

const audienceCards = [
  {
    title: 'Organizations',
    Icon: Building2,
    description:
      'Post the item donations, services, and other offerings your community organization provides. Sign up to make a customizable profile and start posting.',
  },
  {
    title: 'Recipients',
    Icon: Search,
    description:
      'Search and filter for charitable aide types based on your location. Caritas offers account-free browsing for single users, so no need to sign up.',
  },
  {
    title: 'Volunteers',
    Icon: UsersRound,
    description:
      'Search and filter for volunteer opportunities in your area. Caritas offers account-free browsing for single users, so no need to sign up.',
  },
];

const AboutPage = () => {
  return (
    <main
      data-testid="about-page-container"
      className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-card-shadow sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-text-green">
                About Caritas
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-text-base sm:text-4xl lg:text-5xl">
                A simpler path between community need and charitable action.
              </h1>
            </div>
            <div className="space-y-4 text-base leading-7 text-text-muted">
              <p>
                The Latin word “caritas” means{' '}
                <span className="italic">a selfless love for humankind</span> or{' '}
                <span className="italic">charity</span>.
              </p>
              <p>
                Caritas is a tool that thoughtfully infuses this definition into
                its design. Cutting through the confusion of other platforms,
                Caritas aims to provide a simple avenue for connecting community
                organizations with charity recipients.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <InfoCard title="Who is SVCare?">
            <p>
              Started as a capstone project for Saint Vincent College's
              computing department, we created Caritas to address needs in our
              community. Our team (SVCare) of five student developers remains
              dedicated to fostering genuine, charitable connection grounded in
              Benedictine values.
            </p>
          </InfoCard>

          <InfoCard title="Caritas' Mission" className="lg:col-span-2">
            <p>
              By consulting with local organizations and community members,
              Caritas prioritizes the charity-focused communication experience.
              We seek to offer an intuitive, tailored space that improves
              outreach and connection.
            </p>
          </InfoCard>
        </section>

        <section className="rounded-xl bg-filter-bg p-5 shadow-card-shadow sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <HeartHandshake
              className="h-7 w-7 text-text-green"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-text-base">
              How to Use
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {audienceCards.map(({ title, Icon, description }) => (
              <article key={title} className="rounded-xl bg-white p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-bg text-text-green">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-text-base">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <InfoCard title="Reporting">
            <div className="flex gap-3">
              <CircleAlert
                className="mt-1 h-5 w-5 flex-shrink-0 text-text-green"
                aria-hidden="true"
              />
              <div>
                <p>
                  Ensure the continued integrity of Caritas' postings by
                  submitting feedback.
                </p>
                <p className="mt-4">
                  NOTE: Caritas does not handle any monetary transactions or
                  fundraising in-platform.
                </p>
              </div>
            </div>
          </InfoCard>

          <article className="rounded-xl bg-tag-green p-5 shadow-card-shadow">
            <div className="flex h-full flex-col justify-center gap-3 text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <Mail className="h-7 w-7 text-text-green" aria-hidden="true" />
              </div>
              <p className="text-base font-medium text-text-base">
                Submit feedback, suggestions, or issues directly to our team:
              </p>
              <a
                href="mailto:email.address@email.com"
                className="break-words text-lg font-bold text-text-green hover:underline"
              >
                email.address@email.com
              </a>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
