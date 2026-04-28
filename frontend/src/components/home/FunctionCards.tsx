import { ArrowRight, Compass, HandHeart, SquarePen } from 'lucide-react';
import Button from '../ui/Button';

const cards = [
  {
    title: 'Post Offerings',
    description: 'Share resources, services, and volunteer needs with the community.',
    cta: 'Create a post',
    to: '/dashboard/posts/create',
    Icon: SquarePen,
  },
  {
    title: 'Discover Help',
    description: 'Browse verified local organizations and charitable opportunities.',
    cta: 'Browse directory',
    to: '/directory',
    Icon: Compass,
  },
  {
    title: 'Donate Service',
    description: 'Find places where your time and talents can support local needs.',
    cta: 'Find opportunities',
    to: '/directory',
    Icon: HandHeart,
  },
];

const FunctionCards = () => {
  return (
    <section
      aria-label="Primary actions"
      className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1"
    >
      {cards.map(({ title, description, cta, to, Icon }) => (
        <article
          key={title}
          className="flex h-full flex-col justify-between rounded-xl bg-white p-5 shadow-card-shadow transition-shadow hover:shadow-card-hover"
        >
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filter-bg text-text-green">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text-base">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {description}
              </p>
            </div>
          </div>

          <Button
            as="link"
            to={to}
            variant={title === 'Post Offerings' ? 'primary' : 'secondary'}
            size="md"
            className="mt-5 w-full gap-2"
          >
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </article>
      ))}
    </section>
  );
};

export default FunctionCards;
