import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import sampleMap from '../../assets/sampleMap.png';

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
    address: '212 Outlet Way Greensburg, PA 15601',
    contact: {
      email: 'contact@contact.com',
      phone: '(814) 555-5555',
    },
    additonalDetails:
      'Volunteers will help sort, shelve, and organize incoming donations to support Habitat ReStore’s community shop. This includes lifting small boxes, tagging items, maintaining the storage area.',
  };

  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => setExpanded((prev) => !prev); // Toggle expanded state based on prev state

  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col">
      {/* Header content */}
      <header className="mb-3">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-xl">{orgData.title}</h2>

          {/* tags - replace with reusable tag later */}
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
          <p>
            💒 {orgData.name} | {orgData.proximity}
          </p>
          <p>🕒 {orgData.date}</p>
        </div>
      </header>

      {/* Body content */}
      <section className="mb-3">
        <p>{orgData.description}</p>

        {expanded && (
          <div className="flex gap-6 mt-4">
            {/* Left expanded content */}
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

            {/* Right map */}
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
                className="self-start text-text-muted hover:underline hover:text-text-green font-medium px-2 py-1"
              >
                🗺️ View full map
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Footer content */}
      <footer className="flex justify-between items-center mt-auto pt-2">
        {/* Bottom left content */}
        <div className="flex items-center gap-3">
          {/* Make reusable button later */}
          <button className="bg-accent-green text-white px-3 py-1 rounded-lg hover:opacity-90 cursor-pointer">
            View Organization
          </button>
          <button className="bg-sky-500 px-2.5 py-1 rounded-lg hover:opacity-90 cursor-pointer">
            🤚
          </button>
          <span className="text-text-muted">
            Interested: {orgData.interested} people
          </span>
        </div>

        {/* Bottom right content */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm hover:opacity-80 cursor-pointer"
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
