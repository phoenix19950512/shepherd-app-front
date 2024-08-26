import { Box, Flex, Grid } from '@chakra-ui/react';

function DashboardLayoutSkeleton() {
  return (
    <div className="bg-white w-screen h-screen flex">
      <div className="sidebar w-56 border-r">
        <div className="logo w-full mt-5 flex justify-start pl-5 pr-5">
          <img
            src="/images/logo-blue.svg"
            alt="shepherd-logo"
            className="w-[50%]"
          />
        </div>
        {/* Nav Items */}
        <div className="nav-items-skeleton mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className="nav-item flex justify-start pl-5 pr-5 py-4"
            >
              <div className="icon w-8 h-8 bg-gray-200 rounded-md mr-4 animate-pulse delay-75"></div>
              <div className="text flex-1 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      <header className="bg-white shadow h-20 flex items-center px-4 flex-1 justify-between">
        <div className="left flex justify-center gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse delay-75"></div>
          <div className="w-28 h-9 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="right flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className='w-24 h-12 rounded-full bg-gray-200 animate-pulse"'></div>
        </div>
      </header>
    </div>
  );
}

export default DashboardLayoutSkeleton;
