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
import { useFilters } from '../../contexts/FiltersContext';

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

function calculateDistanceMiles(from: Coordinates, to: Coordinates) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const latDistance = toRadians(to.lat - from.lat);
  const lonDistance = toRadians(to.lon - from.lon);
  const startLat = toRadians(from.lat);
  const endLat = toRadians(to.lat);

  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(startLat) *
      Math.cos(endLat) *
      Math.sin(lonDistance / 2) ** 2;

  return earthRadiusMiles * 2 * Math.asin(Math.sqrt(a));
}

function toFiniteNumber(value: unknown) {
  if (value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const VolunteerCard = ({ post }: Props) => {
  const { filters } = useFilters();
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

  const postRequirements = post.requirements ?? [];
  const dynamicTags = postRequirements.length
    ? postRequirements
    : [
        post.post_type.replace('_', ' ').toUpperCase(),
        post.event_type.toUpperCase(),
      ];

  const maxVisibleTags = isSmallScreen && !tagsExpanded ? 1 : dynamicTags.length;
  const visibleTags = dynamicTags.slice(0, maxVisibleTags);
  const hiddenTagCount = Math.max(0, dynamicTags.length - maxVisibleTags);

  const postLatitude = toFiniteNumber(post.latitude);
  const postLongitude = toFiniteNumber(post.longitude);
  const userLatitude = toFiniteNumber(filters.userLat);
  const userLongitude = toFiniteNumber(filters.userLng);
  const hasUserLocation = userLatitude != null && userLongitude != null;
  const coordinates: Coordinates | null =
    postLatitude != null && postLongitude != null
      ? { lat: postLatitude, lon: postLongitude }
      : null;
  const backendDistanceMiles = toFiniteNumber(post.distance_miles);
  const fallbackDistanceMiles =
    backendDistanceMiles == null &&
    coordinates &&
    hasUserLocation
      ? calculateDistanceMiles(
          { lat: userLatitude, lon: userLongitude },
          coordinates,
        )
      : null;
  const distanceMiles = hasUserLocation
    ? backendDistanceMiles ?? fallbackDistanceMiles
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
  };

  const tagColors: TagColor[] = ['green', 'blue', 'orange', 'baise', 'purple'];

  // Smart Date Formatting
  const scheduleDisplay = 
    post.event_type === 'recurring' && post.days_of_week && post.days_of_week.length > 0
      ? `Recurring: ${post.days_of_week.join(', ')}`
      : `Date: ${formatUIDate(post.date_start)}${post.date_end ? ` - ${formatUIDate(post.date_end)}` : ''}`;

  return (
    <article className="bg-white shadow-card-shadow w-full rounded-2xl p-6 flex flex-col hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
      <header className="mb-3">
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-semibold text-xl">{post.title}</h2>

          <div className="flex flex-wrap gap-2 items-center">
            {visibleTags.map((tag, index) => (
              <Tag key={tag} color={tagColors[index % tagColors.length]}>
                {tag}
              </Tag>
            ))}

            {hiddenTagCount > 0 && !tagsExpanded && (
              <button
                onClick={() => setTagsExpanded(true)}
                className="text-sm font-medium text-accent-green hover:text-accent-green-dark transition-colors px-2 py-1 whitespace-nowrap"
              >
                +{hiddenTagCount} more
              </button>
            )}

            {tagsExpanded && hiddenTagCount > 0 && (
              <button
                onClick={() => setTagsExpanded(false)}
                className="text-sm font-medium text-accent-green hover:text-accent-green-dark transition-colors px-2 py-1 whitespace-nowrap"
              >
                Show less
              </button>
            )}
          </div>
        </div>

        <div className="mt-1 flex flex-col text-text-muted">
          <p>💒 {post.org_name}</p>
          <p>🕒 {scheduleDisplay}</p>
          {distanceMiles != null && Number.isFinite(distanceMiles) && (
            <p>📍 {distanceMiles.toFixed(1)} miles away</p>
          )}
        </div>
      </header>

      <section className="mb-3">
        <p>{post.description}</p>

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
              
              {/* Conditionally render additional details */}
              {post.additional_details && post.additional_details.trim() !== '' && (
                <>
                  <p className="font-medium">Additional details:</p>
                  <p>{post.additional_details}</p>
                </>
              )}
            </div>

            <div className="w-full lg:w-[34rem] xl:w-[42rem] flex flex-col gap-2">
              <div className="w-full h-72 md:h-80 rounded-xl overflow-hidden border border-nav-stroke bg-gray-100 flex items-center justify-center">
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
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

      <footer className="flex justify-between items-center mt-auto pt-2">
        <div className="flex items-center gap-3">
          <Link
            to={`/organization/${post.org_id}`}
            className="block"
          >
            <article className="rounded-xl bg-accent-green text-white hover:opacity-90">
              <h3 className="px-2.5 py-1.5">View Organization</h3>
            </article>
          </Link>

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
            Interested: {post.interested || 0} people
          </span>
        </div>

        <Button
          as="button"
          variant="textOnly"
          size="sm"
          className="text-text-muted flex items-center gap-1"
          onClick={handleToggle}
        >
          {expanded ? 'Show Less' : 'Show More'}
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </footer>
    </article>
  );
};

export default VolunteerCard;
