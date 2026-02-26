import { Save, Camera, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ManageOrgProfilePage = () => {
  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Edit Organization Profile</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your organization's public profile and branding.
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-8 w-full max-w-5xl bg-white rounded-2xl p-8 shadow-card-shadow">
        {/* left column - Branding */}
        <section className="space-y-6">
          <div>
            <h2 className="font-medium text-xl">Branding</h2>
            <p className="text-sm text-text-muted mt-1">
              This will be displayed on your public profile.
            </p>
          </div>

          {/* Cover Image Upload */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="relative w-full h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-accent-green transition-colors flex flex-col items-center justify-center cursor-pointer group">
              <Upload
                className="text-text-muted/60 group-hover:text-accent-green mb-1"
                size={20}
              />
              <span className="text-xs text-text-muted font-medium">
                Upload Cover
              </span>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium">Logo</label>
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 hover:border-accent-green transition-colors flex items-center justify-center cursor-pointer group shrink-0">
                <Camera
                  className="text-text-muted/60 group-hover:text-accent-green"
                  size={24}
                />
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-text-muted mt-2">
                Recommended: 400x400px.
                <br />
                JPG or PNG.
              </p>
            </div>
          </div>
        </section>

        {/* right column - Basic Info Form */}
        <section className="space-y-6">
          <div>
            <h2 className="font-medium text-xl">Basic Info</h2>
            <p className="text-sm text-text-muted mt-1">
              Update your organization details and contact info.
            </p>
          </div>

          <form className="space-y-5">
            <Input
              id="orgName"
              label="Organization Name"
              placeholder="e.g. Habitat for Humanity"
              size="sm"
              variant="secondary"
            />
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="about" className="text-sm font-medium">
                About
              </label>
              <textarea
                id="about"
                rows={4}
                className="bg-gray-50 outline-none transition-all duration-200 placeholder:text-text-muted border border-filter-stroke rounded-xl hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 px-3 py-2 placeholder:text-sm text-sm resize-none"
                placeholder="Tell volunteers about your mission..."
              />
            </div>
            {/* Grid for smaller inputs */}
            <div className="grid grid-cols-2 gap-5">
              <Input
                id="location"
                placeholder="City, State"
                label="Location"
                size="sm"
                variant="secondary"
              />
              <Input
                id="website"
                placeholder="https://"
                label="Website"
                size="sm"
                variant="secondary"
              />
              <Input
                id="email"
                type="email"
                placeholder="contact@org.com"
                label="Contact Email"
                size="sm"
                variant="secondary"
              />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                label="Phone Number"
                size="sm"
                variant="secondary"
              />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ManageOrgProfilePage;
