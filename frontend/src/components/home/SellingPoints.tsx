import {
  Ban,
  HeartHandshake,
  MessageSquareWarning,
  UserRoundCheck,
} from 'lucide-react';

const points = [
  { label: 'Verified organizations', Icon: UserRoundCheck },
  { label: 'No advertisements', Icon: Ban },
  { label: 'Safe, anonymous reporting', Icon: MessageSquareWarning },
  { label: '100% charity-focused', Icon: HeartHandshake },
];

const SellingPoints = () => {
  return (
    <section
      aria-label="Caritas principles"
      className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {points.map(({ label, Icon }) => (
        <article
          key={label}
          className="flex items-center gap-3 rounded-xl bg-filter-bg p-4 text-text-green shadow-card-shadow"
        >
          <Icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold sm:text-base">{label}</span>
        </article>
      ))}
    </section>
  );
};

export default SellingPoints;
