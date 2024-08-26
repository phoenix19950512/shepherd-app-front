function Skeleton() {
  return (
    <div className="w-full h-[475px] relative">
      <div className="w-[200px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[10%] left-[10%]"></div>
      <div className="w-[200px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[10%] right-[10%]"></div>
      <div className="w-[100px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[30%] left-[25%]"></div>
      <div className="w-[100px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[30%] right-[25%]"></div>
      <div className="w-[200px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[62%] right-[65%]"></div>
      <div className="w-[200px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[62%] left-[65%]"></div>
      <div className="w-[100px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[90%] left-[25%]"></div>
      <div className="w-[100px] h-[40px] bg-gray-200 animate-pulse rounded absolute top-[90%] right-[25%]"></div>
      {/* Circle */}
      <div className="w-[100px] h-[100px] bg-gray-200 animate-pulse rounded-full absolute top-[30%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"></div>
      <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-full absolute top-[60%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"></div>
    </div>
  );
}

export default Skeleton;
