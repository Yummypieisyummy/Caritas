import { OrgProfile } from '../../hooks/useOrgProfile';

type OrgHeaderProps = {
  organization: OrgProfile;
};

const fallbackImage = new URL(
  '../../assets/Roofing_Shingles_Asphalt.jpg',
  import.meta.url,
).href;

const OrgHeader = ({ organization }: OrgHeaderProps) => {
  const bannerImage = organization.banner_url || fallbackImage;
  const profileImage = organization.pfp_url || fallbackImage;

  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-card-shadow">
      <div className="h-44 w-full bg-gray-100 sm:h-56">
        <img
          src={bannerImage}
          alt={`${organization.name} banner`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 px-5 pb-6 pt-0 sm:flex-row sm:items-end sm:px-8">
        <div className="-mt-12 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-card-shadow sm:h-32 sm:w-32">
          <img
            src={profileImage}
            alt={`${organization.name} logo`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 pb-1">
          <h1 className="break-words text-3xl font-semibold text-text-primary sm:text-4xl">
            {organization.name}
          </h1>
          {organization.verified && (
            <p className="mt-1 text-sm font-medium text-accent-green">
              Verified organization
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrgHeader;
