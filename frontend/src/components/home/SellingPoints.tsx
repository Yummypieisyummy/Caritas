import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';

const SellingPoints = () => {
    return (
        <article className="flex flex-col bg-filter-bg w-full rounded-xl mb-2">
            <header className="mb-8 ml-4"/>
            <p className="mb-6 ml-4 flex flex-row items-center">
              <UserRoundCheck className="h-10 w-10 text-text-green mr-4 flex-shrink-0" />
              <span className="text-text-green text-lg sm:text-2xl md:text-3xl lg:text-4xl"> Verified organizations </span>
            </p>
            <p className="mb-6 ml-4 flex flex-row items-center">
              <Ban className="h-10 w-10 text-text-green mr-4 flex-shrink-0" />
              <span className="text-text-green text-lg sm:text-2xl md:text-3xl lg:text-4xl"> No advertisements </span>
            </p>
            <p className="mb-6 ml-4 flex flex-row items-center">
              <MessageSquareWarning className="h-10 w-10 text-text-green mr-4 flex-shrink-0" />
              <span className="text-text-green text-lg sm:text-2xl md:text-3xl lg:text-4xl"> Safe, anonymous reporting </span>
            </p>
            <p className="mb-12 ml-4 flex flex-row items-center">
              <HeartHandshake className="h-10 w-10 text-text-green mr-4 flex-shrink-0" />
              <span className="text-text-green text-lg sm:text-2xl md:text-3xl lg:text-4xl"> 100% charity-focused </span>
            </p>
        </article>
    );
};

export default SellingPoints;