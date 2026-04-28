import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { OrgProfile } from '../../hooks/useOrgProfile';

type OrgAboutProps = {
  organization: OrgProfile;
};

const getWebsiteHref = (website?: string | null) => {
  if (!website) {
    return null;
  }

  return website.startsWith('http') ? website : `https://${website}`;
};

const OrgAbout = ({ organization }: OrgAboutProps) => {
  const contact = organization.contact_info;
  const email = contact?.email || organization.email;
  const websiteHref = getWebsiteHref(contact?.website);

  return (
    <aside className="flex flex-col gap-5">
      <section className="rounded-xl bg-white p-6 shadow-card-shadow">
        <h2 className="mb-3 text-2xl font-semibold">About</h2>
        <p className="text-text-muted">
          {organization.about?.trim() ||
            'This organization has not added an about section yet.'}
        </p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-card-shadow">
        <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
        <div className="flex flex-col gap-3 text-sm text-text-muted">
          {contact?.address && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
              <span>{contact.address}</span>
            </p>
          )}

          {contact?.hours && (
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
              <span>{contact.hours}</span>
            </p>
          )}

          {contact?.phone && (
            <p className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
              <span>{contact.phone}</span>
            </p>
          )}

          {email && (
            <p className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
              <span>{email}</span>
            </p>
          )}

          {websiteHref && contact?.website && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{contact.website}</span>
            </a>
          )}

          {!contact?.address &&
            !contact?.hours &&
            !contact?.phone &&
            !email &&
            !websiteHref && (
              <p>This organization has not added contact details yet.</p>
            )}
        </div>
      </section>
    </aside>
  );
};

export default OrgAbout;
