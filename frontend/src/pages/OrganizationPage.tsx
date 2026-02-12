import Filters from '../components/directory/Filters';
import MiniVolunteerCard from '../components/organization profile/MiniVolunteerCard.tsx';
import VolunteerCard from '../components/directory/VolunteerCard.tsx';
import orgData from '../components/directory/VolunteerCard.tsx';
import { useLocation, useParams } from 'react-router-dom';
import { CircleArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { XIcon } from 'lucide-react';

const OrganizationPage = () => {

  // Modal state for post details
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Sample banner and profile image

  const Sample_Img = new URL('../assets/Roofing_Shingles_Asphalt.jpg', import.meta.url).href;
  
  // Connecting to directory for back button
  const navLink = [
    { id: 'Directory', to: '/directory' },
  ];

  // Organization profile data
  const { id } = useParams();
  const location = useLocation();
  const org = location.state?.org || null;

  const website = org?.contact?.website;
  const websiteHref = website ? (website.startsWith('http') ? website : `https://${website}`) : null;
  const orgProfileData = {
    details: 'Habitat Restore accepts home goods, appliances, furniture, and building materials to support affordable housing projects in our community. Donations directly benefit local families in need of safe, decent housing.',
  };


  return (
    <main className="flex min-h-[calc(100vh-5rem)]">
      {/* Left sidebar filters */}
      <Filters />

      {/* Right content */}
      <section className="ml-80 flex flex-col flex-1 px-6 py-4">  
        <div className="m-4 p-6 flex flex-col rounded-xl drop-shadow-md bg-org-bg">
          <div className="flex items-center justify-left mb-4">
          
          {/* Back to directory button */}
          {navLink.map((link) => (
            <Button
              as="link"
              variant="icon"
              key={link.id}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'hover:bg-accent-green/10' : 'bg-tag-green'
              }
            >
              <CircleArrowLeft size={24} color='#4c8256'/>
              <span className="text-accent-green text-xl whitespace-pre">
                  {' Back to Directory'}
              </span>
            </Button>
          ))}
        </div>
          
          {/* Banner Image */}
          <section className='row-span-1 flex flex-row flex-1 justify-center'>
            <section className="w-50 h-50 sm:w-full sm:h-50 bg-gray-200 overflow-hidden">
              <img src={Sample_Img} alt="Organization" className="w-full h-full object-cover" />
            </section>
          </section>

          {/* Profile Image and Organization Name */}
          <section className="row-span-2 m-4 flex flex-row justify-left items-center">
            <section className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
              <img src={Sample_Img} alt="Organization" className="w-full h-full object-cover" />
            </section>
            <span className="font-medium text-5xl ml-6">{org?.name ?? id ?? 'Organization'}</span>
          </section>
          <div className="flex flex-row">
            <div className="w-4/9 flex flex-col">

            {/* Organization details section*/}
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

                {/* About blurb */}
                <header className="mb-2 font-medium text-2xl">About</header>
                <p className="font-small text-m mb-2"> {orgProfileData.details}  </p>
              </section>
            </div>
            <div className="flex flex-col">

              {/* Recent posts section */}
              <section className="bg-white rounded-xl drop-shadow-md row-span-1 flex flex-col flex-1 px-7 py-4">
                <header className="mb-2 font-medium text-2xl">Recent Posts</header>
                <div className="flex flex-col gap-6">
                  {Array.from({ length: 2 }, (_, i) => (
                      <MiniVolunteerCard key={i} onOpen={handleModalClick}/>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for full post details */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center backdrop-blur bg-opacity-60"
          onClick={handleModalClick}
        >
          <div
            className="bg-white rounded-lg w-11/12 max-w-3xl p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <Button 
                aria-label="Close" 
                onClick={handleModalClick} 
                variant="icon" 
                className="text-xl"
              >
                <XIcon/>
              </Button>
            </div>
            <VolunteerCard/>
          </div>
        </div>
          )}
    </main>
  );
};

export default OrganizationPage;
