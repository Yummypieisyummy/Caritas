import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';

const CATEGORY_OPTIONS = [
  'Community Outreach',
  'Food Pantry',
  'Fundraising',
  'Tutoring / Mentoring',
  'Elder Care',
  'Donations',
];

const DAYS_NEEDED_OPTIONS = ['Weekdays', 'Weekends', 'Custom Date Range'];

const DISTANCE_OPTIONS = ['5 miles', '10 miles', '25 miles', 'Any Distance'];

const FOOD_TYPE_OPTIONS = [
  'Canned Goods',
  'Fresh Produce',
  'Non-perishables',
  'Packaged Meals',
  'Baked Goods',
];

const REQUIREMNETS_OPTIONS = [
  'Requires Credentials',
  'Orientation Needed',
  "Requires Driver's License",
  'Food Handling Certification',
];

const PHYSICAL_REQUIREMENTS_OPTIONS = [
  'Heavy Lifting',
  'Outdoor Work',
  'Standing for Long Periods',
];

const ORGANIZATION_TYPE_OPTIONS = [
  'Non-Profit',
  'Community Center',
  'Religious Organization',
];

const TIME_COMMITMENT_OPTIONS = [
  'One-time',
  '<2 hours',
  'Half day',
  'Full day',
  'Ongoing/weekly',
];

const SPECIAL_NEEDS_OPTIONS = [
  'Accessible for Wheelchairs',
  'Pet-Friendly',
  'Kid-Friendly',
];

const URGENCY_OPTIONS = ['Immediate', 'This Week', 'This month'];

const Filters = () => {
  return (
    <aside className="fixed h-[calc(100vh-5rem)] w-80 flex flex-col bg-filter-bg border-r border-filter-stroke">
      <header className="px-6 pt-6 pb-4">
        <h1 className="font-medium text-3xl">Filters</h1>
      </header>

      {/* Scrollable section */}
      <section className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-5 pr-1">
          {/* Categories - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">Category</h2>
            {CATEGORY_OPTIONS.map((cat) => (
              <Checkbox key={cat} option={cat} />
            ))}
          </div>
          {/* Distance - dropdown */}
          <div>
            <Select label="Distance" options={DISTANCE_OPTIONS} />
          </div>
          {/* Days needed - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">Days Needed</h2>
            {DAYS_NEEDED_OPTIONS.map((days) => (
              <Checkbox key={days} option={days} />
            ))}
          </div>
          {/* Food type - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">Food Type</h2>
            {FOOD_TYPE_OPTIONS.map((food) => (
              <Checkbox key={food} option={food} />
            ))}
          </div>
          {/* Skills/Certification requirements - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">
              Skills / Cert Requirements
            </h2>
            {REQUIREMNETS_OPTIONS.map((req) => (
              <Checkbox key={req} option={req} />
            ))}
          </div>
          {/* Physical requirements - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">
              Physical Requirements
            </h2>
            {PHYSICAL_REQUIREMENTS_OPTIONS.map((req) => (
              <Checkbox key={req} option={req} />
            ))}
          </div>
          {/* Org type - dropdown */}
          <div>
            <Select
              label="Organization Type"
              options={ORGANIZATION_TYPE_OPTIONS}
            />
          </div>
          {/* Time commitment - dropdown */}
          <div>
            <Select label="Time Commitment" options={TIME_COMMITMENT_OPTIONS} />
          </div>
          {/* Special needs - checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1">
              Special Needs / Restrictions
            </h2>
            {SPECIAL_NEEDS_OPTIONS.map((opt) => (
              <Checkbox key={opt} option={opt} />
            ))}
          </div>
          {/* Urgency / priority - dropdown */}
          <div>
            <Select label="Urgency / Priority" options={URGENCY_OPTIONS} />
          </div>
        </div>
      </section>

      <footer className="flex gap-4 justify-center px-6 py-4 border-t border-filter-stroke">
        <Button as="button" variant="secondary" size="sm">
          Clear Filters
        </Button>
        <Button as="button" variant="primary" size="md">
          Apply Filters
        </Button>
      </footer>
    </aside>
  );
};

export default Filters;
