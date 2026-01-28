// Import About components and files here

const AboutPage = () => {
  return (
    <main data-testid="about-page-container" className="flex min-h-[calc(100vh-5rem)]">
      <div className="grid grid-cols-3">
        {/* First column */}
          <section className=" col-span-1 flex flex-col flex-1 px-7 py-4">
            {/*Who is SVCare Box*/}
            <header className="mb-2 ">
              <h1 className="font-medium text-4xl">Who is SVCare?</h1>
            </header>
            <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
              <p className="text-2xl">
                Started as a capstone project for Saint Vincent College’s computing department, we created Caritas to address needs in our community. Our team (SVCare) of five student developers remains dedicated to fostering genuine, charitable connection grounded in Benedictine values.
              </p>
            </article>

            {/*Contact Us Box*/}
            <header className="mb-2 ">
              <h1 className="font-medium text-4xl">Contact Us</h1>
            </header>
          <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
              <p className="text-2xl">
                Submit feedback, suggestions, or issues directly to our team:
              </p>
              <span className="font-bold text-2xl">email.address@email.com</span>
            </article>
        </section>

        {/* Second column */}
        <section className="col-start-2 flex flex-col flex-1 px-7 py-4">
          {/*Caritas' Mission*/}
          <header className="mb-2 ">
            <h1 className="font-medium text-4xl">Caritas' Mission</h1>
          </header>
          <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
            <p className="text-2xl mb-4">
              The Latin word “caritas” means <span className="italic"> a selfless love for humankind </span> or <span className="italic"> charity</span>.
            </p>
            <p className="text-2xl mb-4">
              Caritas is a tool that thoughtfully infuses this definition into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.
            </p>
            <p className="text-2xl">
              By consulting with local organizations and community members, Caritas prioritizes the charity-focused communication experience. We seek to offer an intuitive, tailored space that improves outreach and connection.
            </p>
          </article>
        </section>

        {/* Third column */}
        <section className="col-start-3 flex flex-col flex-1 px-7 py-4">
          {/*How to Use*/}
          <header className="mb-2 ">
            <h1 className="font-medium text-4xl">How to Use</h1>
          </header>
          <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
            <p className="text-2xl font-bold">
              Organizations
            </p>
            <p className="text-2xl mb-4">
              Post the item donations, services, and other offerings your community organization provides. Sign up to make a customizable profile and start posting.
            </p>
            <p className="text-2xl font-bold">
              Recipients
            </p>
            <p className="text-2xl mb-4">
              Search and filter for charitable aide types based on your location. Caritas offers account-free browsing for single users, so no need to sign up.
            </p>
            <p className="text-2xl font-bold">
              Volunteers
            </p>
            <p className="text-2xl mb-4">
              Search and filter for volunteer opportunities in your area. Caritas offers account-free browsing for single users, so no need to sign up.
            </p>
            <p className="text-2xl font-bold">
              Reporting
            </p>
            <p className="text-2xl mb-4">
              Ensure the continued integrity of Caritas' postings by submitting feedback.
            </p>
            <p className="text-2xl">
              NOTE: Caritas does not handle any monetary transactions or fundraising in-platform.
            </p>
          </article>
        </section>

      </div>
    </main>

  )
};

export default AboutPage;
