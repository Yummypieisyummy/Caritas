import { SquarePen, Compass, HandHeart } from 'lucide-react';

const FunctionCards = () => {
    return (
        <main className="flex h-fit">
            <div className="grid grid-rows-3 bg-filter-bg rounded-xl">
                <section className="row-start-1 flex flex-row px-7 px-4 mt-4">
                    <article className="bg-white flex rounded-xl p-3 flex flex-row mb-6 drop-shadow-md">
                        <SquarePen className="h-30 w-30 text-text-green flex-shrink-0 mt-4 ml-4 mb-6 drop-shadow-md" />
                        <div className="flex-1 ml-10 mr-4 mb-8">
                            <p className="flex text-yellow-950 text-4xl mt-7 drop-shadow-sm"> Post Offerings </p>
                            <p className="flex text-yellow-950 text-3xl mt-4 drop-shadow-sm"> Share the resources and services you can provide. </p>
                        </div>
                    </article>
                </section>
                <section className="row-start-2 flex flex-row px-7 px-4">
                    <article className="bg-white row-start-2 rounded-xl p-3 flex flex-row mb-6 drop-shadow-md">
                        <Compass className="h-30 w-30 text-text-green flex-shrink-0 mt-4 ml-4 mb-6 drop-shadow-md" />
                        <div className="flex-1 ml-10 mr-4">
                            <p className="flex text-yellow-950 text-4xl mt-7 drop-shadow-sm"> Discover Help </p>
                            <p className="flex text-yellow-950 text-3xl mt-4 drop-shadow-sm"> Browse verified local organizations and posts. </p>
                        </div>
                    </article>
                </section>
                <section className="row-span-1 flex flex-row px-7 px-4">
                    <article className="bg-white row-start-3 rounded-xl p-3 flex flex-row mb-6 drop-shadow-md">
                        <HandHeart className="h-30 w-30 text-text-green flex-shrink-0 mt-4 ml-4 mb-6 drop-shadow-md" />
                        <div className="flex-1 ml-10 mr-4">
                            <p className="flex text-yellow-950 text-4xl mt-7 drop-shadow-sm"> Donate Service </p>
                            <p className="flex text-yellow-950 text-3xl mt-4 drop-shadow-sm"> Volunteer your time and talent to the community. </p>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
};

export default FunctionCards;