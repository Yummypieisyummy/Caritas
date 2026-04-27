// import { useState } from 'react';
// import Filters from '../components/directory/Filters';
// import VolunteerCard from '../components/directory/VolunteerCard';
// import Button from '../components/ui/Button';
// import Spinner from '../components/ui/Spinner';
// import { usePublicPosts } from '../hooks/usePublicPosts';

// const DirectoryPage = () => {
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//   const { publicPosts: posts, status } = usePublicPosts();

//   return (
//     <main data-testid="directory-page-container" className="flex min-h-screen">
//       {/* Mobile filters panel */}
//       {isFiltersOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="md:hidden fixed inset-0 bg-black/50 z-40"
//             onClick={() => setIsFiltersOpen(false)}
//           />
//           {/* Filters panel sliding from right */}
//           <div className="md:hidden fixed top-20 right-0 bottom-0 w-80 max-w-full bg-white shadow-lg z-50 overflow-y-auto">
//             <Filters onClose={() => setIsFiltersOpen(false)} />
//           </div>
//         </>
//       )}

//       <div className="hidden md:flex fixed top-20 left-0 w-80 bottom-0 bg-gray-100">
//         <Filters />
//       </div>

//       {status === 'pending' ? (
//         <div className="flex justify-center items-center flex-1 md:ml-80 min-h-screen">
//           <Spinner />
//         </div>
//       ) : status === 'error' ? (
//         <div className="flex justify-center items-center flex-1 md:ml-80 min-h-screen text-red-500">
//           <p>Failed to load opportunities</p>
//         </div>
//       ) : (
//         <section className="md:ml-80 flex flex-col flex-1 p-6">
//           <header className="mb-6 flex items-center justify-between">
//             <h1 className="font-semibold text-3xl">Local Charity Posts</h1>

//             {/* Mobile filters button */}
//             <div className="md:hidden">
//               <Button
//                 as="button"
//                 variant="primary"
//                 size="md"
//                 onClick={() => setIsFiltersOpen((prev) => !prev)}
//                 className="px-4 py-2"
//               >
//                 {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
//               </Button>
//             </div>
//           </header>

//           <div className="flex flex-col gap-6">
//             {posts.map((post) => (
//               <VolunteerCard key={post.id} post={post} />
//             ))}

//             {posts.length === 0 && (
//               <p className="text-text-muted">
//                 No volunteer opportunities found.
//               </p>
//             )}
//           </div>
//         </section>
//       )}
//     </main>
//   );
// };

// export default DirectoryPage;

import { useState, useMemo } from 'react';
import Filters from '../components/directory/Filters';
import VolunteerCard from '../components/directory/VolunteerCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { usePublicPosts } from '../hooks/usePublicPosts';
import { useFilters } from '../contexts/FiltersContext';

const DirectoryPage = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { publicPosts: posts, status } = usePublicPosts();
  const { filters } = useFilters();

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter((post) => {
      // Use the corrected key mapping
      const searchableText = `${post.title} ${post.description} ${post.additional_details || ''}`.toLowerCase();

      // 1. Category Filter
      if (filters.category.length > 0) {
        const hasCategory = filters.category.some(cat => searchableText.includes(cat.toLowerCase()));
        if (!hasCategory) return false;
      }

      // 2. Advanced Days Needed Filter
      if (filters.daysNeeded.length > 0) {
        const postDays = [...(post.days_of_week || [])];

        // If it's a one time event, extract the specific day of the week it falls on
        if (post.event_type === 'one-time' && post.date_start) {
            const dateObj = new Date(post.date_start);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            postDays.push(dayName);
        }

        const needsWeekdays = filters.daysNeeded.includes('Weekdays');
        const needsWeekends = filters.daysNeeded.includes('Weekends');
        
        const hasWeekday = postDays.some(d => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(d));
        const hasWeekend = postDays.some(d => ['Saturday', 'Sunday'].includes(d));

        let matchesDay = false;

        if (needsWeekdays && hasWeekday) matchesDay = true;
        if (needsWeekends && hasWeekend) matchesDay = true;

        // Check explicit days (e.g. User checks 'Monday')
        const explicitDays = filters.daysNeeded.filter(d => d !== 'Weekdays' && d !== 'Weekends');
        if (explicitDays.length > 0) {
           const hasExplicitDay = explicitDays.some(d => postDays.includes(d));
           if (hasExplicitDay) matchesDay = true;
        }

        if (!matchesDay) return false;
      }

      // 3. Food Type Filter
      if (filters.foodType.length > 0) {
        const hasFood = filters.foodType.some(food => searchableText.includes(food.toLowerCase()));
        if (!hasFood) return false;
      }

      // 4. Skills / Cert Requirements Filter
      if (filters.requirements.length > 0) {
        const hasReq = filters.requirements.some(req => searchableText.includes(req.toLowerCase()));
        if (!hasReq) return false;
      }

      // 5. Physical Requirements Filter
      if (filters.physicalRequirements.length > 0) {
        const hasPhysReq = filters.physicalRequirements.some(req => searchableText.includes(req.toLowerCase()));
        if (!hasPhysReq) return false;
      }

      // 6. Organization Type Filter
      if (filters.orgType && filters.orgType !== '') {
        if (!searchableText.includes(filters.orgType.toLowerCase())) return false;
      }

      // 7. Time Commitment Filter
      if (filters.timeOption && filters.timeOption !== '') {
        if (!searchableText.includes(filters.timeOption.toLowerCase())) return false;
      }

      // 8. Special Needs / Restrictions Filter
      if (filters.specialOptions.length > 0) {
        const hasSpecial = filters.specialOptions.some(opt => searchableText.includes(opt.toLowerCase()));
        if (!hasSpecial) return false;
      }

      // 9. Urgency / Priority Filter
      if (filters.urgency && filters.urgency !== '') {
        if (!searchableText.includes(filters.urgency.toLowerCase())) return false;
      }

      return true;
    });
  }, [posts, filters]);

  return (
    <main data-testid="directory-page-container" className="flex min-h-screen">
      {isFiltersOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="md:hidden fixed top-20 right-0 bottom-0 w-80 max-w-full bg-white shadow-lg z-50 overflow-y-auto">
            <Filters onClose={() => setIsFiltersOpen(false)} />
          </div>
        </>
      )}

      <div className="hidden md:flex fixed top-20 left-0 w-80 bottom-0 bg-gray-100">
        <Filters />
      </div>

      {status === 'pending' ? (
        <div className="flex justify-center items-center flex-1 md:ml-80 min-h-screen">
          <Spinner />
        </div>
      ) : status === 'error' ? (
        <div className="flex justify-center items-center flex-1 md:ml-80 min-h-screen text-red-500">
          <p>Failed to load opportunities</p>
        </div>
      ) : (
        <section className="md:ml-80 flex flex-col flex-1 p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="font-semibold text-3xl">Local Charity Posts</h1>
            <div className="md:hidden">
              <Button
                as="button"
                variant="primary"
                size="md"
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                className="px-4 py-2"
              >
                {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            {filteredPosts.map((post) => (
              <VolunteerCard key={post.id} post={post} />
            ))}

            {filteredPosts.length === 0 && (
              <p className="text-text-muted">
                No volunteer opportunities found matching your filters.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default DirectoryPage;