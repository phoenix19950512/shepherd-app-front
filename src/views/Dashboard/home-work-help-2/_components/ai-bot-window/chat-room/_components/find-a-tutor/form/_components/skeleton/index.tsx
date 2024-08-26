function Skeleton() {
  return (
    <div className="w-full flex flex-col gap-3 p-5 ">
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      </div>
      <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      <div className="w-full h-32 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
        <div className="w-full h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      </div>
      <div className="w-full h-28 flex items-end justify-end gap-3">
        <div className="w-16 h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
        <div className="w-16 h-8 rounded-md flex items-stretch bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
}

export default Skeleton;
