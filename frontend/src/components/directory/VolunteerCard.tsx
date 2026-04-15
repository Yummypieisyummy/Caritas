import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PostResponse } from '../../types/posts';
import { formatUIDate } from '../../utils/formatDate';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import Button from '../ui/Button';
import Tag, { TagColor } from '../ui/Tag';

type Props = { post: PostResponse };

type Coordinates = {
  lat: number;
  lon: number;
};

const FALLBACK_MAP_CENTER: Coordinates = {
  lat: 40.4406,
  lon: -79.9959,
};

const mapPinIcon = new Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const VolunteerCard = ({ post }: Props) => {
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
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate visible tags based on screen size
  const maxVisibleTags = isSmallScreen && !tagsExpanded ? 3 : orgData.tags.length;
  const visibleTags = orgData.tags.slice(0, maxVisibleTags);
  const hiddenTagCount = Math.max(0, orgData.tags.length - maxVisibleTags);

  const coordinates: Coordinates | null =
    post.latitude != null && post.longitude != null
      ? { lat: post.latitude, lon: post.longitude }
      : null;

  const mapsUrl = useMemo(
    () =>
      coordinates
        ? `https://maps.google.com/?q=${coordinates.lat},${coordinates.lon}`
        : `https://maps.google.com/?q=${encodeURIComponent(post.location)}`,
    [coordinates, post.location],
  );

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  }; // Toggle expanded state based on prev state

  const tagColors: TagColor[] = ['green', 'blue', 'orange', 'baise', 'purple'];

  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
      {/* Header content */}
      <header className="mb-3">
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-semibold text-xl">{post.title}</h2>

          {/* Reusable tags with responsive collapse */}
          <div className="flex flex-wrap gap-2 items-center">
            {visibleTags.map((tag, index) => (
              <Tag key={tag} color={tagColors[index % tagColors.length]}>
                {tag}
              </Tag>
            ))}

            {/* "+X more" indicator */}
            {hiddenTagCount > 0 && !tagsExpanded && (
              <button
                onClick={() => setTagsExpanded(true)}
                className="text-sm font-medium text-accent-green hover:text-accent-green-dark transition-colors px-2 py-1 whitespace-nowrap"
                aria-label={`Show ${hiddenTagCount} more tags`}
              >
                +{hiddenTagCount} more
              </button>
            )}

            {/* Collapse button when expanded */}
            {tagsExpanded && hiddenTagCount > 0 && (
              <button
                onClick={() => setTagsExpanded(false)}
                className="text-sm font-medium text-accent-green hover:text-accent-green-dark transition-colors px-2 py-1 whitespace-nowrap"
                aria-label="Show fewer tags"
              >
                Show less
              </button>
            )}
          </div>
        </div>

        <div className="mt-1 flex flex-col text-text-muted">
          <p>
            💒 {orgData.name} | {orgData.proximity}
          </p>
          <p>🕒 {formatUIDate(post.date_start)}</p>
        </div>
      </header>

      {/* Body content */}
      <section className="mb-3">
        <p>{post.description}</p>

        {/* expanded content */}
        {expanded && (
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1 flex flex-col gap-2">
              <p>
                <span className="font-medium">📍 Address: </span>
                {post.location}
              </p>

              <p className="mb-4">
                <span className="font-medium">✉️ Contact: </span>
                {post.contact_email} | {post.contact_phone}
              </p>
              <p className="font-medium">Additional details:</p>
              <p>{post.additionalDetails}</p>
            </div>

            {/* Map */}
            <div className="w-full md:w-96 flex flex-col gap-2">
              <div className="w-full h-56 rounded-lg overflow-hidden border border-nav-stroke">
                <MapContainer
                  center={
                    coordinates
                      ? [coordinates.lat, coordinates.lon]
                      : [FALLBACK_MAP_CENTER.lat, FALLBACK_MAP_CENTER.lon]
                  }
                  zoom={coordinates ? 14 : 10}
                  className="w-full h-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {coordinates && (
                    <Marker
                      position={[coordinates.lat, coordinates.lon]}
                      icon={mapPinIcon}
                    >
                      <Popup>{post.location}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {!coordinates && (
                <p className="text-sm text-text-muted px-1">
                  Location preview unavailable for this post.
                </p>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-text-muted text-sm hover:underline hover:text-text-green font-medium px-2 py-1"
              >
                🗺️ View full map
              </a>
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
            Interested: {post.interested} people
          </span>
        </div>

        <Button
          as="button"
          variant="textOnly"
          size="sm"
          className="text-text-muted"
          onClick={handleToggle}
        >
          {expanded ? 'Show Less' : 'Show More'}
          {expanded ? (
            <ChevronUp className="w-5 h-5 ml-1" />
          ) : (
            <ChevronDown className="w-5 h-5 ml-1" />
          )}
        </Button>
      </footer>
    </article>
  );
};

export default VolunteerCard;
