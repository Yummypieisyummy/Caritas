// Import About components and files here

const AboutPage = () => {

  return (
    <main data-testid="about-page-container" className="flex justify-center w-screen overflow-hidden">
      <div className="grid grid-flow-row auto-rows-max">
        <div className="grid grid-cols-3">
          {/* First column */}
            <section className="col-span-1 flex flex-col flex-1 px-7 py-4 l:size-100">
              {/*Who is SVCare Box*/}
              <article className="bg-tag-green w-full rounded-xl mb-6 flex flex-col px-4">
                <h1 className="font-medium text-4xl mb-2 mt-2">Who is SVCare?</h1>
                <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-4">
                  <p className="text-2xl">
                    Started as a capstone project for Saint Vincent College’s computing department, we created Caritas to address needs in our community. Our team (SVCare) of five student developers remains dedicated to fostering genuine, charitable connection grounded in Benedictine values.
                  </p>
                </article>
              </article>

              {/*Reporting*/}
              <article className="bg-tag-green w-full rounded-xl mb-2 flex flex-col px-4">
                <h1 className="font-medium text-4xl mt-2 mb-2">Reporting</h1>
                <article className="bg-white rounded-xl p-3 flex flex-col mb-6">
                  <p className="text-2xl mb-4">
                    Ensure the continued integrity of Caritas' postings by submitting feedback.
                  </p>
                  <p className="text-2xl">
                    NOTE: Caritas does not handle any monetary transactions or fundraising in-platform.
                  </p>
                </article>
              </article>
              
          </section>

          {/* Second column */}
          <section className="col-start-2 flex flex-col flex-1 px-7 py-4 l:size-100">
            {/*Caritas' Mission*/}
            <article className="bg-tag-green w-full rounded-xl mb-2 flex flex-col px-4">
              <h1 className="font-medium text-4xl mt-2 mb-2">Caritas' Mission</h1>
              <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
                <p className="text-2xl mb-4">
                  The Latin word “caritas” means <span className="italic">a selfless love for humankind</span> or <span className="italic">charity</span>.
                </p>
                <p className="text-2xl mb-4">
                  Caritas is a tool that thoughtfully infuses this definition into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.
                </p>
                <p className="text-2xl">
                  By consulting with local organizations and community members, Caritas prioritizes the charity-focused communication experience. We seek to offer an intuitive, tailored space that improves outreach and connection.
                </p>
              </article>
            </article>
          </section>

          {/* Third column */}
          <section className="col-start-3 flex flex-col flex-1 px-7 py-4 l:size-100">
            {/*How to Use*/}
            <article className="bg-tag-green w-full rounded-xl mb-2 flex flex-col px-4">
              <h1 className="font-medium text-4xl mb-2 mt-2">How to Use</h1>
              <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
                <p className="text-2xl font-bold">
                  Organizations
                </p>
                <p className="text-2xl">
                  Post the item donations, services, and other offerings your community organization provides. Sign up to make a customizable profile and start posting.
                </p>
              </article>
              <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
                <p className="text-2xl font-bold">
                  Recipients
                </p>
                <p className="text-2xl">
                  Search and filter for charitable aide types based on your location. Caritas offers account-free browsing for single users, so no need to sign up.
                </p>
              </article>
              <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-6">
                <p className="text-2xl font-bold">
                  Volunteers
                </p>
                <p className="text-2xl">
                  Search and filter for volunteer opportunities in your area. Caritas offers account-free browsing for single users, so no need to sign up.
                </p>
              </article>
            </article>
          </section>
        </div>
        <div className="w-full overflow-hidden">
         <section className="justify-self-center w-full">
           <article className="bg-tag-green w-full h-50 rounded-xl flex flex-col px-4 py-4 shadow-lg">
             {/*<h1 className="font-medium text-4xl mt-0 mb-2 text-center">Contact Us</h1>*/}
             {/*<div className="bg-white w-full rounded-xl p-4">*/}
               <p className="text-2xl mt-10 text-center">
                 Submit feedback, suggestions, or issues directly to our team:
               </p>
               <span className="font-bold text-2xl mt-2 text-center">email.address@email.com</span>
             {/*</div>*/}
           </article>
         </section>
       </div>
      </div>
    </main>

  )
};

export default AboutPage;
