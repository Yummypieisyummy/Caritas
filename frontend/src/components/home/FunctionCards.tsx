import { SquarePen, Compass, HandHeart } from 'lucide-react';

const FunctionCards = () => {
    return (
        <div className="flex min-h-[calc(100vh-5rem)] grid grid-rows-3 mr-10 ml-10">
            <article className="bg-white row-span-1 rounded-xl p-3 flex flex-row mb-6 mt-3 drop-shadow-md">
                <SquarePen className="h-45 w-45 text-text-green mr-4 flex-shrink-0 mb-4 mt-4 drop-shadow-md" />
                <div className="flex-1">
                    <p className="flex text-yellow-950 text-5xl mt-7 ml-2 drop-shadow-sm"> Post Offerings </p>
                    <p className="flex text-yellow-950 text-4xl mt-4 ml-2 drop-shadow-sm"> Share the resources and services you can provide. </p>
                </div>
            </article>
            <article className="bg-white row-start-2 rounded-xl p-3 flex flex-row mb-6 mt-3 drop-shadow-md">
                <Compass className="h-45 w-45 text-text-green mr-4 flex-shrink-0 mb-4 mt-4 drop-shadow-md" />
                <div className="flex-1">
                    <p className="flex text-yellow-950 text-5xl mt-7 ml-2 drop-shadow-sm"> Discover Help </p>
                    <p className="flex text-yellow-950 text-4xl mt-4 ml-2 drop-shadow-sm"> Browse verified local organizations and posts. </p>
                </div>
            </article>
            <article className="bg-white row-start-3 rounded-xl p-3 flex flex-row mb-6 mt-3 drop-shadow-md">
                <HandHeart className="h-45 w-45 text-text-green mr-4 flex-shrink-0 mb-4 mt-4 drop-shadow-md" />
                <div className="flex-1">
                    <p className="text-yellow-950 text-5xl mt-7 ml-2 drop-shadow-sm"> Donate Service </p>
                    <p className="text-yellow-950 text-4xl mt-4 ml-2 drop-shadow-sm"> Volunteer your time and talent to the community. </p>
                </div>
            </article>
        </div>
    );
};

export default FunctionCards;