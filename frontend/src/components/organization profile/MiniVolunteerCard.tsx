import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Tag, { TagColor } from '../ui/Tag';

const VolunteerCard = () => {
  // Mockup data
  const orgData = {
    id: 'habitat-restore',
    title: 'Stocking, organizing, and sorting donations',
    name: 'Habitat Restore',
    proximity: '8.7 miles away',
    date: 'Saturdays, 10AM-2PM',
    description:
      'Help support Habitat for Humanity by keeping our ReStore organized and welcoming. Volunteers sort incoming donations, stock shelves, and prepare items for display. No experience needed—just a willingness to help and a positive attitude. Your time directly supports local affordable housing projects.',
    orgProfile: `/organization/${'habitat-restore'}`,
    interested: 5,
    address: '212 Outlet Way Greensburg, PA 15601',
    contact: {
      email: 'contact@contact.com',
      phone: '(814) 555-5555',
      website: 'https://cwhfh.org/restore/',
    },
    additonalDetails:
      'Volunteers will help sort, shelve, and organize incoming donations to support Habitat ReStore’s community shop. This includes lifting small boxes, tagging items, maintaining the storage area.',
    tags: [
      'Requires Credentials',
      'Heavy Lifting',
      'Clothing Drive',
      '18+',
      'Transportation Needed',
      'Evenings',
    ],
  };

  /*const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  }; // Toggle expanded state based on prev state*/

  const tagColors: TagColor[] = ['green', 'blue', 'orange', 'baise', 'purple'];

  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
      {/* Header content */}
      <header className="mb-3">
        <div className="flex justify-between items-start gap-4">
          <h2 className="font-semibold text-xl">{orgData.title}</h2>

          {/* Reusable tags */}
          <div className="flex gap-2">
            {orgData.tags.slice(0, 2).map((tag, index) => (
              <Tag key={tag} color={tagColors[index % tagColors.length]}>
                {tag}
              </Tag>
            ))}
            {orgData.tags.length > 2 && (
              <Tag color="baise">+{orgData.tags.length - 2}</Tag>
            )}
          </div>
        </div>

        <div className="mt-1 flex flex-col text-text-muted">
          <p>
            💒 {orgData.name} | {orgData.proximity}
          </p>
          <p>🕒 {orgData.date}</p>
        </div>
      </header>

      {/* Footer content */}
      <footer className="flex justify-between items-center mt-auto pt-2">
        {/* Bottom left content */}
        <div className="flex items-center gap-3">
          {/* Icon button */}
          <Button
            as="button"
            variant="primary"
            size="sm"
            aria-label="Volunteer Hand Raise"
            className="bg-sky-500"
          >
            🤚
          </Button>

          <span className="text-text-muted text-base">
            Interested: {orgData.interested} people
          </span>
        </div>
      </footer>
    </article>
  );
};

export default VolunteerCard;
