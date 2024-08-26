function ConversationHistorySkeleton() {
  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="search-bar w-full">
        <div className="w-full h-[30px] flex gap-2 my-4 items-center">
          <div className="h-full w-full bg-gray-200 rounded-full animate-pulse"></div>
          <div className="p-0 w-20 h-[30px] bg-gray-200 rounded-full animate-pulse delay-100"></div>
        </div>
      </div>
      {/* List items */}
      <div className="w-full h-full overflow-y-hidden flex-col gap-2 over no-scrollbar relative">
        <Group />
        <Group />
        <Group />
      </div>
    </div>
  );
}

const Group = () => {
  return (
    <div className="w-full">
      <div className="w-full flex gap-2 flex-col my-2">
        <p className="text-[10px] text-[#585F68] font-normal pl-5">
          <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </p>
        <div className="group-items flex flex-col gap-2">
          {[1, 2, 3, 4].map((conversation) => (
            <div
              key={conversation}
              className="flex p-2 w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none"
            >
              <div className="flex-1 h-full bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-[5%] h-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationHistorySkeleton;
