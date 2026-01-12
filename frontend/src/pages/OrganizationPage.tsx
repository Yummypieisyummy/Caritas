import Filters from '../components/directory/Filters';
import MiniVolunteerCard from '../components/organization profile/MiniVolunteerCard.tsx';
import orgData from '../components/directory/VolunteerCard.tsx';
import { useLocation, useParams } from 'react-router-dom';

const OrganizationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const org = location.state?.org || null;

  const website = org?.contact?.website;
  const websiteHref = website ? (website.startsWith('http') ? website : `https://${website}`) : null;
  const orgProfileData = {
    details: 'Habitat Restore accepts home goods, appliances, furniture, and building materials to support affordable housing projects in our community. Donations directly benefit local families in need of safe, decent housing.',
  }
  return (
    <main className="flex min-h-[calc(100vh-5rem)]">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="ml-80 flex flex-col flex-1 px-6 py-4">
        <div className="m-4 p-6 flex flex-col rounded-xl drop-shadow-md bg-org-bg">
          <section className="row-span-1 flex flex-row flex-1 justify-center bg-gray-200">
            <span className="font-medium text-m m-5">Photo Banner</span>
          </section>
          <section className="row-span-2 m-4 flex flex-row justify-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
              <img src="/path/to/image.jpg" alt="Organization" className="w-full h-full object-cover" />
           </div>
            <span className="font-medium text-3xl ml-6 mt-4">{org?.name ?? id ?? 'Organization'}</span>
          </section>
          <div className="flex flex-row">
            <div className="w-4/9 flex flex-col">
              <section className="bg-white rounded-xl drop-shadow-md flex flex-col px-7 py-4 mr-6 mb-4">
                <header className="mb-2 font-medium text-2xl">Details</header>
                {/* Assuming organization information same as VolunteerCard site address */}
                <article className="font-small text-m mb-2">📍 {org?.address ?? id ?? 'Address'} </article>
                <article className="font-small text-m mb-2">🕰️ Hours </article>
                <article className="font-small text-m mb-2">📞 {org?.contact.phone ?? id ?? 'Phone Number'} </article>
                <article className="font-small text-m mb-2">📧 {org?.contact.email ?? id ?? 'Email'} </article>
                <article className="font-small text-m mb-2">
                  🔗{' '}
                  {websiteHref ? (
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noonpener noreferrer"
                      className="text-blue-600 hover:underline"
                      >
                        {org?.contact?.website}
                      </a>
                  ) : (
                    id ?? 'Website'
                  )} 
                </article>
              </section>
              <section className="bg-white rounded-xl drop-shadow-md row-span-1 flex flex-col flex-1 px-7 py-4 mr-6">
                <header className="mb-2 font-medium text-2xl">About</header>
                <p className="font-small text-m mb-2"> {orgProfileData.details}  </p>
              </section>
            </div>
            <div className="flex flex-col">
              <section className="bg-white rounded-xl drop-shadow-md row-span-1 flex flex-col flex-1 px-7 py-4">
                <header className="mb-2 font-medium text-2xl">Recent Posts</header>
                <div className="flex flex-col gap-6">
                  {Array.from({ length: 2 }, (_, i) => (
                      <MiniVolunteerCard key={i} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
};

export default OrganizationPage;
