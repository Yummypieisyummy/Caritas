import { SquarePen, Compass, HandHeart } from 'lucide-react';
import { useEffect, useState } from 'react';

const FunctionCards = () => {
    const [iconSize, setIconSize] = useState(64);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setIconSize(16);
            } else if (window.innerWidth < 768) {
                setIconSize(32);
            } else if (window.innerWidth < 1300) {
                setIconSize(64);
            } else {
                setIconSize(160);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col md:flex-col h-fit w-full">
            <div className="grid grid-cols-1 md:grid-rows-3 gap-4 md:gap-0 w-full">
                <section className="col-span-1 md:row-span-1 flex flex-row px-4 md:px-4 mt-1 md:mt-1">
                    <article className="bg-white flex flex-col lg:flex-row rounded-xl p-3 mb-2 md:mb-6 drop-shadow-md w-full gap-3">
                        <div className="flex flex-col items-center lg:items-start lg:hidden">
                            <SquarePen size={iconSize} className="text-text-green flex-shrink-0 drop-shadow-md mb-2" />
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm text-center lg:text-left"> Post Offerings </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm text-center lg:text-left"> Share the resources and services you can provide. </p>
                        </div>
                        
                        <SquarePen size={iconSize} className="hidden lg:block text-text-green flex-shrink-0 drop-shadow-md" />
                        <div className="hidden lg:flex flex-col w-full">
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm"> Post Offerings </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm"> Share the resources and services you can provide. </p>
                        </div>
                    </article>
                </section>
                <section className="col-span-1 md:row-start-2 flex flex-row px-4 md:px-4">
                    <article className="bg-white row-start-2 rounded-xl p-3 flex flex-col lg:flex-row mb-2 md:mb-6 drop-shadow-md w-full gap-3">
                        <div className="flex flex-col items-center lg:items-start lg:hidden">
                            <Compass size={iconSize} className="text-text-green flex-shrink-0 drop-shadow-md mb-2" />
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm text-center lg:text-left"> Discover Help </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm text-center lg:text-left"> Browse verified local organizations and posts. </p>
                        </div>
                        
                        <Compass size={iconSize} className="hidden lg:block text-text-green flex-shrink-0 drop-shadow-md" />
                        <div className="hidden lg:flex flex-col w-full">
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm"> Discover Help </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm"> Browse verified local organizations and posts. </p>
                        </div>
                    </article>
                </section>
                <section className="col-span-1 md:row-span-1 flex flex-row px-4 md:px-4">
                    <article className="bg-white row-start-3 rounded-xl p-3 flex flex-col lg:flex-row mb-2 md:mb-6 drop-shadow-md w-full gap-3">
                        <div className="flex flex-col items-center lg:items-start lg:hidden">
                            <HandHeart size={iconSize} className="text-text-green flex-shrink-0 drop-shadow-md mb-2" />
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm text-center lg:text-left"> Donate Service </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm text-center lg:text-left"> Volunteer your time and talent to the community. </p>
                        </div>
                        
                        <HandHeart size={iconSize} className="hidden lg:block text-text-green flex-shrink-0 drop-shadow-md" />
                        <div className="hidden lg:flex flex-col w-full">
                            <p className="text-yellow-950 text-lg md:text-3xl lg:text-5xl drop-shadow-sm"> Donate Service </p>
                            <p className="text-yellow-950 text-xs md:text-base lg:text-4xl mt-2 drop-shadow-sm"> Volunteer your time and talent to the community. </p>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
};

export default FunctionCards;