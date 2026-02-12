import { useState } from 'react';

interface FileInputProps {
  id: string;
  label?: string;
  accept?: string;
  value?: File | null;
  error?: string;
  onChange?: () => void;
}

const FileInput = (props: FileInputProps) => {
  const { id, label, accept, error, onChange, ...rest } = props;

  const [fileName, setFileName] = useState('');

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      )}

      <input type="file" id={id} accept={accept} className="hidden" />
      <button
        type="button"
        className="bg-white border-2 border-nav-stroke rounded-full px-4 py-2.5 w-full outline-none transition-all duration-200 text-left hover:border-filter-stroke focus:border-accent-green focus:shadow-sm"
      >
        <span className="text-text-muted text-sm">Choose a file...</span>
      </button>
    </div>
  );
};

export default FileInput;
