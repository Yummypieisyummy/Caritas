const Toggle = () => {
  return (
    <label className="relative inline-block w-13 h-7">
      <input type="checkbox" className="peer sr-only" />
      <span className="absolute inset-0 cursor-pointer bg-gray-300 rounded-full duration-300 peer-checked:bg-accent-green before:content-[''] before:absolute before:w-5 before:h-5 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-6" />
    </label>
  );
};

export default Toggle;
