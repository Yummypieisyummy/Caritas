import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import sampleMap from '../../assets/sampleMap.png';
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
      'Evenings',
    ],
  };

  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  }; // Toggle expanded state based on prev state

  const tagColors: TagColor[] = ['green', 'blue', 'orange', 'baise', 'purple'];

  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
      {/* Header content */}
      <header className="mb-3">
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-semibold text-xl">{orgData.title}</h2>

          {/* Reusable tags */}
          <div className="flex gap-2">
            {orgData.tags.map((tag, index) => (
              <Tag key={tag} color={tagColors[index % tagColors.length]}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <div className="mt-1 flex flex-col text-text-muted">
          <p>
            💒 {orgData.name} | {orgData.proximity}
          </p>
          <p>🕒 {orgData.date}</p>
        </div>
      </header>

      {/* Body content */}
      <section className="mb-3">
        <p>{orgData.description}</p>

        {/* expanded content */}
        {expanded && (
          <div className="flex gap-6 mt-4">
            <div className="flex-1 flex flex-col gap-2">
              <p>
                <span className="font-medium">📍 Address: </span>
                {orgData.address}
              </p>

              <p className="mb-4">
                <span className="font-medium">✉️ Contact: </span>
                {orgData.contact.email} | {orgData.contact.phone}
              </p>
              <p className="font-medium">Additional details:</p>
              <p>{orgData.additonalDetails}</p>
            </div>

            {/* Map */}
            <div className="w-100 flex flex-col gap-2">
              <img
                src={sampleMap}
                alt="inline map"
                className="w-full rounded-lg"
              />
              <Link
                to="https://maps.google.com/?q=212+Outlet+Way+Greensburg+PA+15601"
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security and performance improvements for links
                className="self-start text-text-muted text-sm hover:underline hover:text-text-green font-medium px-2 py-1"
              >
                🗺️ View full map
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Footer content */}
      <footer className="flex justify-between items-center mt-auto pt-2">
        <div className="flex items-center gap-3">
          {/* Link instead of button to pass state data */}
          <Link
            to={orgData.orgProfile}
            state={{ org: orgData }}
            className="block"
          >
            <article className="rounded-xl bg-accent-green text-white hover:opacity-90">
              <h3 className="px-2.5 py-1.5">View Organization</h3>
            </article>
          </Link>

          {/* <Button
            as="link"
            variant="primary"
            size="sm"
            state={{ org: orgData }}
            className="block"
          >
            View Organization
          </Button> */}

          <Button
            as="button"
            variant="icon"
            size="sm"
            aria-label="Volunteer Hand Raise"
            className="bg-sky-500"
          >
            🤚
          </Button>

          <span className="text-text-muted">
            Interested: {orgData.interested} people
          </span>
        </div>

        <div>
          <Button
            as="button"
            variant="textOnly"
            size="sm"
            className="gap-1 text-sm"
            onClick={handleToggle}
          >
            {expanded ? 'Show Less' : 'Show More'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </footer>
    </article>
  );
};

export default VolunteerCard;
