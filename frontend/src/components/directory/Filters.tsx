import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFilters } from '../../contexts/FiltersContext';
import { useUserLocation } from '../../hooks/useUserLocation';
import { REQUIREMENT_OPTIONS } from '../../config/filterOptions';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';

interface FiltersProps {
  onClose?: () => void;
}

const POST_TYPE_OPTIONS = [
  { label: 'Volunteer Request', value: 'volunteer_request' },
  { label: 'Volunteer Offer', value: 'volunteer_offer' },
  { label: 'Item Request', value: 'item_request' },
  { label: 'Item Offer', value: 'item_offer' },
];

const EVENT_TYPE_OPTIONS = [
  { label: 'One-time', value: 'one-time' },
  { label: 'Recurring', value: 'recurring' },
];

const DAYS_NEEDED_OPTIONS = ['Weekdays', 'Weekends'];

const DISTANCE_OPTIONS = [
  { label: 'Any Distance', value: '' },
  { label: '5 miles', value: '5' },
  { label: '10 miles', value: '10' },
  { label: '25 miles', value: '25' },
  { label: '50 miles', value: '50' },
];

const Filters = ({ onClose }: FiltersProps) => {
  const {
    filters,
    setSelect,
    toggleOption,
    setLocation,
    clearFilters,
  } = useFilters();
  const { latitude, longitude, error, isLoading } = useUserLocation();
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }

    setLocation(latitude, longitude);
    setLocationMessage('Location enabled for distance filtering.');
  }, [latitude, longitude, setLocation]);

  useEffect(() => {
    if (error) {
      setLocationMessage('Location access needed for distance filtering.');
    }
  }, [error]);

  return (
    <aside className="w-full h-full flex flex-col bg-filter-bg border-r border-filter-stroke">
      <header className="flex items-center justify-between px-6 py-4 border-b border-filter-stroke/50">
        <h1 className="font-semibold text-2xl">Filters</h1>
        {onClose && (
          <Button variant="icon" onClick={onClose}>
            <XIcon size={24} />
          </Button>
        )}
      </header>

      <section className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Post Type</span>
            {POST_TYPE_OPTIONS.map((option) => (
              <Checkbox
                key={option.value}
                option={option.label}
                checked={filters.post_type === option.value}
                onChange={() =>
                  setSelect(
                    'post_type',
                    filters.post_type === option.value ? '' : option.value,
                  )
                }
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Event Type</span>
            {EVENT_TYPE_OPTIONS.map((option) => (
              <Checkbox
                key={option.value}
                option={option.label}
                checked={filters.event_type === option.value}
                onChange={() =>
                  setSelect(
                    'event_type',
                    filters.event_type === option.value ? '' : option.value,
                  )
                }
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Days Needed</span>
            {DAYS_NEEDED_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                option={option}
                checked={filters.daysNeeded.includes(option)}
                onChange={() => toggleOption('daysNeeded', option)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Requirements</span>
            {REQUIREMENT_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                option={option}
                checked={filters.requirements.includes(option)}
                onChange={() => toggleOption('requirements', option)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <label className="w-full flex flex-col gap-2">
              <span className="font-semibold">Distance</span>
              <select
                value={filters.maxDistanceMiles}
                onChange={(e) =>
                  setSelect('maxDistanceMiles', e.target.value)
                }
                className="w-full bg-white border border-filter-stroke px-3 py-2 rounded-xl focus:outline-none hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 h-10 transition-all duration-200 text-text-muted"
              >
                {DISTANCE_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {isLoading && (
              <p className="text-sm text-text-muted">Finding Location...</p>
            )}

            {locationMessage && !isLoading && (
              <p className="text-sm text-text-muted">{locationMessage}</p>
            )}
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-center h-20 border-t border-filter-stroke/50 p-6">
        <Button
          as="button"
          variant="primary"
          size="sm"
          onClick={clearFilters}
          className="w-full flex gap-1 items-center"
        >
          <XIcon size={18} strokeWidth={3} />
          <p className="text-lg font-semibold">Clear All</p>
        </Button>
      </footer>
    </aside>
  );
};

export default Filters;
