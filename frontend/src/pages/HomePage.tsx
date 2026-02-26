// Import Home components and files here
import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';
import SellingPoints from '../components/home/SellingPoints';
import FunctionCards from '../components/home/FunctionCards';

const SVC_Basilica = new URL('../assets/SVC_Basilica.jpg', import.meta.url).href;

const HomePage = () => {
  return (
  <main className="flex">
    <div className="w-1/2 flex px-7">
      <div className="grid grid-flow-row auto-row-max justify-between">
        <article className="bg-tag-green w-full h-fit rounded-xl mb-2 flex flex-col px-10 mt-4">
          <section className="row-start-1 flex flex-row flex-1 py-4 justify-center">
            <p className="font-normal text-2xl mt-2 text-center">Caritas is a tool that thoughtfully infuses love for humankind into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.</p>
          </section>
        </article>
        <section className="row-start-2 flex flex-row flex-1">
          <img src={SVC_Basilica} alt="SVC Basilica" className="w-full h-auto object-cover rounded-xl drop-shadow-md" />
        </section>
        {/*<section className="row-start-3 mt-3 mb-6 flex flex-row flex-1 items-center">
          <SellingPoints />
        </section>*/}
      </div>
    </div>
    <div className="w-1/2 flex mt-4 mr-4">
      <FunctionCards />
    </div>
  </main>
  )
};

export default HomePage;
