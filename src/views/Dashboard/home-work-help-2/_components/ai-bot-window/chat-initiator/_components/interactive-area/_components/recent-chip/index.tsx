const RecentItemChip = ({ title }: { title?: string }) => {
  return (
    <div className="p-4 h-[50px] bg-white rounded-full shadow-sm flex justify-center items-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
      <span className="text-[#6E7682] text-sm font-normal truncate text-ellipsis max-w-[200px]">
        {title}
      </span>
    </div>
  );
};
export default RecentItemChip;
