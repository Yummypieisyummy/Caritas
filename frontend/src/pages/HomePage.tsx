// Import Home components and files here
import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';
import SellingPoints from '../components/home/SellingPoints';
import FunctionCards from '../components/home/FunctionCards';

const SVC_Basilica = new URL('../assets/SVC_Basilica.jpg', import.meta.url).href;

const HomePage = () => {
  return (
  <main className="flex min-h-[calc(100vh-5rem)] mx-auto md:scale-80 lg:scale-90 lg:px-16">
    <div className="flex px-7">
      <div className="grid grid-rows-2 h-[calc(100vh-5rem)]">
          <section className="row-span-1 flex flex-row flex-1 py-4 justify-center">
            <img src={SVC_Basilica} alt="SVC Basilica" className="w-full h-auto object-cover rounded-xl drop-shadow-md" />
          </section>
            <section className="row-start-2 mt-6 flex flex-row flex-1 h-full">
            <SellingPoints />
            </section>
      </div>
    </div>
    <div className="flex mt-4 mr-4">
      <FunctionCards />
    </div>
  </main>
  )
};

export default HomePage;
