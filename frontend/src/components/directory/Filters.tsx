import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import { useEffect } from 'react';
import { useFilters } from '../../contexts/FiltersContext';
import * as filterOptions from '../../config/filterOptions';
import { XIcon } from 'lucide-react';

const Filters = () => {
  const { filters, toggleOption, setSelect, clearFilters } = useFilters();

  useEffect(() => {
    console.log('filters:', filters);
  }, [filters]);

  return (
    <aside className="fixed top-20 bottom-0 w-80 flex flex-col bg-filter-bg border-r border-filter-stroke">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-filter-stroke/50">
        <h1 className="font-semibold text-2xl">Filters</h1>
        <Button as="button" variant="icon" size="sm" onClick={clearFilters}>
          <XIcon className="w-5 h-5" />
          {/* add label later, indicating clear filters */}
        </Button>
      </header>

      {/* Scrollable Filter Options */}
      <section className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">
          {/* Category */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Category</span>
            {filterOptions.CATEGORY_OPTIONS.map((cat) => (
              <Checkbox
                key={cat}
                option={cat}
                checked={filters.category.includes(cat)}
                onChange={() => toggleOption('category', cat)}
              />
            ))}
          </div>

          {/* Distance */}
          <Select
            label="Distance"
            options={filterOptions.DISTANCE_OPTIONS}
            value={filters.distance}
            onChange={(e) => setSelect('distance', e.target.value)}
          />

          {/* Days Needed */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Days Needed</span>
            {filterOptions.DAYS_NEEDED_OPTIONS.map((days) => (
              <Checkbox
                key={days}
                option={days}
                checked={filters.daysNeeded.includes(days)}
                onChange={() => toggleOption('daysNeeded', days)}
              />
            ))}
          </div>

          {/* Food Type */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Food Type</span>
            {filterOptions.FOOD_TYPE_OPTIONS.map((food) => (
              <Checkbox
                key={food}
                option={food}
                checked={filters.foodType.includes(food)}
                onChange={() => toggleOption('foodType', food)}
              />
            ))}
          </div>

          {/* Skills / Cert Requirements */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Skills / Cert Requirements</span>
            {filterOptions.REQUIREMENTS_OPTIONS.map((req) => (
              <Checkbox
                key={req}
                option={req}
                checked={filters.requirements.includes(req)}
                onChange={() => toggleOption('requirements', req)}
              />
            ))}
          </div>

          {/* Physical Requirements */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Physical Requirements</span>
            {filterOptions.PHYSICAL_REQUIREMENTS_OPTIONS.map((req) => (
              <Checkbox
                key={req}
                option={req}
                checked={filters.physicalRequirements.includes(req)}
                onChange={() => toggleOption('physicalRequirements', req)}
              />
            ))}
          </div>

          {/* Organization Type */}
          <Select
            label="Organization Type"
            options={filterOptions.ORGANIZATION_TYPE_OPTIONS}
            onChange={(e) => setSelect('orgType', e.target.value)}
          />

          {/* Time Commitment */}
          <Select
            label="Time Commitment"
            options={filterOptions.TIME_COMMITMENT_OPTIONS}
            onChange={(e) => setSelect('timeOption', e.target.value)}
          />

          {/* Special Needs / Restrictions */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Special Needs / Restrictions</span>
            {filterOptions.SPECIAL_NEEDS_OPTIONS.map((opt) => (
              <Checkbox
                key={opt}
                option={opt}
                checked={filters.specialOptions.includes(opt)}
                onChange={() => toggleOption('specialOptions', opt)}
              />
            ))}
          </div>

          {/* Urgency / Priority */}
          <Select
            label="Urgency / Priority"
            options={filterOptions.URGENCY_OPTIONS}
            onChange={(e) => setSelect('urgency', e.target.value)}
          />
        </div>
      </section>
    </aside>
  );
};

export default Filters;
