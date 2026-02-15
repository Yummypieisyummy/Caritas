const ManageOrgProfilePage = () => {
  return (
    <main className="min-h-screen w-full flex p-6 flex-col justify-center items-center">
      <h1 className="font-semibold text-3xl mb-6">Edit Organization Profile</h1>
      <section className="grid grid-cols-2 gap-6 w-full max-w-4xl bg-white rounded-2xl my-8 p-6 shadow-card-shadow hover:shadow-card-hover transition-shadow duration-300 ease-in-out">
        <div className="border border-black">
          <h2 className="font-medium text-2xl">Branding</h2>
        </div>

        <div className="border border-black">
          <h2 className="font-medium text-2xl">Basic Info</h2>
        </div>
      </section>
    </main>
  );
};

export default ManageOrgProfilePage;
