import { UserRoundCheck, Ban, MessageSquareWarning, HeartHandshake } from 'lucide-react';

const SellingPoints = () => {
    return (
        <article className="flex flex-col bg-filter-bg w-full h-full rounded-xl mb-2 items-center">
            <header className="mb-8 ml-4"/>
            <p className="text-2xl font-normal mb-6 ml-4 flex flex-row items-center">
              <UserRoundCheck className="h-7 w-7 mr-4 flex-shrink-0" />
              <span className="text-2xl"> Verified organizations </span>
              <Ban className="ml-4 h-7 w-7 mr-4 flex-shrink-0" />
              <span className="text-2xl"> No advertisements </span>
            </p>
            {/*<p className="text-2xl mb-6 ml-4 flex flex-row items-center">
              
            </p>*/}
            <p className="text-2xl mb-6 ml-4 flex flex-row items-center">
              <MessageSquareWarning className="h-7 w-7 mr-4 flex-shrink-0" />
              <span className="text-2xl"> Safe, anonymous reporting </span>
              <HeartHandshake className="ml-4 h-7 w-7 mr-4 flex-shrink-0" />
              <span className="text-2xl"> 100% charity-focused </span>
            </p>
            {/*<p className="text-2xl mb-12 ml-4 flex flex-row items-center">
            </p>*/}
        </article>
    );
};

export default SellingPoints;