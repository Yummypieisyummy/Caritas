// Import About components and files here

import { useState } from "react";

const AboutPage = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const DropdownArticle = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections[id];

    return (
      <article className="bg-tag-green w-full rounded-xl mb-2 flex flex-col px-4 lg:mb-6">
        <button
          onClick={() => toggleSection(id)}
          className="font-medium text-4xl mt-2 mb-2 text-left flex items-center justify-between py-2 cursor-pointer lg:cursor-auto hover:opacity-80 lg:hover:opacity-100 transition"
        >
          {title}
          <span className="lg:hidden text-2xl">{isExpanded ? '-' : '+'}</span>
        </button>
        {isExpanded && (
          <article className="bg-white w-full rounded-xl p-3 flex flex-col mb-4 lg:mb-6">
            <div className="text-2xl">
              {children}
            </div>
          </article>
        )}
        {!isExpanded && (
          <article className="hidden lg:flex bg-white w-full rounded-xl p-3 flex-col mb-4 lg:mb-6">
            <div className="text-2xl">
              {children}
            </div>
          </article>
        )}
      </article>
    );
  };

  return (
    <main data-testid="about-page-container" className="flex justify-center w-screen overflow-hidden">
      <div className="grid grid-flow-row auto-rows-max w-full">
        <div className="lg:grid grid-cols-3">
          {/* First column */}
            <section className="col-span-1 flex flex-col flex-1 px-7 pt-4 lg:py-4 l:size-100">
              {/*Who is SVCare Box*/}
              <DropdownArticle id="who-is-svcare" title="Who is SVCare?">
                <p className="text-2xl">
                  Started as a capstone project for Saint Vincent College's computing department, we created Caritas to address needs in our community. Our team (SVCare) of five student developers remains dedicated to fostering genuine, charitable connection grounded in Benedictine values.
                </p>
              </DropdownArticle>
              {/*Reporting*/}
              <DropdownArticle id="reporting" title="Reporting">
                <p className="text-2xl">
                  Ensure the continued integrity of Caritas' postings by submitting feedback.
                </p>
                <p className="text-2xl mt-4">
                  NOTE: Caritas does not handle any monetary transactions or fundraising in-platform.
                </p>
              </DropdownArticle>
              
          </section>

          {/* Second column */}
          <section className="col-start-2 flex flex-col flex-1 px-7 lg:py-4 l:size-100">
            {/*Caritas' Mission*/}
            <DropdownArticle id="caritas-mission" title="Caritas' Mission">
              <p className="text-2xl mb-4">
                The Latin word “caritas” means <span className="italic">a selfless love for humankind</span> or <span className="italic">charity</span>.
              </p>
              <p className="text-2xl mb-4">
                Caritas is a tool that thoughtfully infuses this definition into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.
              </p>
              <p className="text-2xl">
                By consulting with local organizations and community members, Caritas prioritizes the charity-focused communication experience. We seek to offer an intuitive, tailored space that improves outreach and connection.
              </p>
            </DropdownArticle>
          </section>

          {/* Third column */}
          <section className="col-start-3 flex flex-col flex-1 px-7 lg:py-4 l:size-100">
            {/*How to Use*/}
            <DropdownArticle id="how-to-use" title="How to Use">
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
            </DropdownArticle>
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
