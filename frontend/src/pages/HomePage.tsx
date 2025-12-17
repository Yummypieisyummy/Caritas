// Import Home components and files here
import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';
import SellingPoints from '../components/home/SellingPoints';
import FunctionCards from '../components/home/FunctionCards';

const HomePage = () => {
  return (
  <main className="flex min-h-[calc(100vh-5rem)]">
    <div className="w-2/5">
      <div className="grid grid-rows-2">
          <section className="row-span-1 flex flex-row flex-1 px-7 py-4 justify-center">
            <p> Picture </p>
          </section>
          <section className="row-start-2 flex flex-row flex-1 px-7 py-4">
            <SellingPoints />
          </section>
      </div>
    </div>
    <div className="w-3/5 mt-4 mr-4">
      <FunctionCards />
    </div>
  </main>
  )
};

export default HomePage;
