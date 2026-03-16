import { LoaderCircle } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoaderCircle className="animate-spin h-12 w-12 text-accent-green" />
    </div>
  );
};

export default Spinner;
