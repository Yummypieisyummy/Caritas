// Import Home components and files here
import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';
import SellingPoints from '../components/home/SellingPoints';
import FunctionCards from '../components/home/FunctionCards';

const SVC_Basilica = new URL('../assets/SVC_Basilica.jpg', import.meta.url).href;

const HomePage = () => {
  return (
    <main className="flex min-h-[calc(100vh-7rem)] mx-auto md:scale-80 lg:min-h-0 lg:scale-100 lg:px-16">
      <div className="relative grid grid-cols-2 lg:grid-cols-[1.45fr_1fr] w-full items-start gap-2 lg:gap-3">
        <div className="relative flex w-full pr-1 md:pr-2 lg:pr-2">
          <div className="relative flex w-full flex-col">
            <section className="row-span-1 flex w-full mt-3 mb-3 py-1 lg:mt-4 lg:py-0">
              <img
                src={SVC_Basilica}
                alt="SVC Basilica"
                className="w-full h-[clamp(14rem,34vh,22rem)] md:h-[clamp(16rem,38vh,24rem)] lg:h-[clamp(18rem,40vh,26rem)] object-cover rounded-xl drop-shadow-md"
              />
            </section>
            <section className="mt-2 flex w-full">
              <SellingPoints />
            </section>
          </div>
        </div>
        <div className="relative flex mt-4 mr-4">
          <FunctionCards />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
