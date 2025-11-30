import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const VolunteerCard = () => {
  // Mockup data
  const orgData = {
    title: 'Stocking, organizing, and sorting donations',
    name: 'Habitat Restore',
    proximity: '8.7 miles away',
    date: 'Saturdays, 10AM-2PM',
    description:
      'Help support Habitat for Humanity by keeping our ReStore organized and welcoming. Volunteers sort incoming donations, stock shelves, and prepare items for display. No experience needed—just a willingness to help and a positive attitude. Your time directly supports local affordable housing projects.',
    orgProfile: '/something',
    interested: 5,
  };

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev); // Toggle expanded state based on prev state
  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col">
      {/* Header content */}
      <header className="mb-3">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-xl ">{orgData.title}</h2>
          {/* tags placeholdr */}
          <div className="flex gap-2">
            <span className="bg-tag-blue px-3 py-1 rounded-2xl text-sm">
              Tag
            </span>
            <span className="bg-tag-green px-3 py-1 rounded-2xl text-sm">
              Tag
            </span>
            <span className="bg-tag-orange px-3 py-1 rounded-2xl text-sm">
              Tag
            </span>
          </div>
        </div>

        <div className="mt-1 flex flex-col text-text-muted">
          <span>
            💒 {orgData.name} | {orgData.proximity}
          </span>
          <span>🕒 {orgData.date}</span>
        </div>
      </header>

      {/* Body content */}
      <section className="mb-3">
        <p>{orgData.description}</p>
        {/* expanded details here */}
      </section>

      {/* Footer content */}
      <footer className="flex justify-between items-center mt-auto pt-2">
        {/* Bottom left content */}
        <div className="flex items-center gap-3">
          {/* Make reusable button later */}
          <button className="bg-accent-green text-white px-3 py-1 rounded-lg hover:opacity-90">
            View Organization
          </button>
          <button className="bg-sky-500 px-2.5 py-1 rounded-lg hover:opacity-90">
            🤚
          </button>
          <span className="text-text-muted">
            Interested: {orgData.interested} people
          </span>
        </div>

        {/* Bottom right content */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm hover:opacity-80"
            onClick={handleToggle}
          >
            {expanded ? 'Show Less' : 'Show More'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </footer>
    </article>
  );
};

export default VolunteerCard;
