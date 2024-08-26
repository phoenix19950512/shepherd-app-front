import { Link } from 'react-router-dom';
import useRecentConversations from '../../hooks/use-recent-conversations';
import RecentItemChip from '../recent-chip';

function RecentConversations() {
  const { data, isLoading } = useRecentConversations();
  return (
    <div className="w-full absolute max-h-[200px] top-[150%]">
      <p className="text-[#585F68] font-normal text-xs mb-4">RECENTS</p>
      <div className="grid grid-cols-2 gap-5">
        {data.map((item) => (
          <Link to={`/dashboard/ace-homework/${item.id}`} key={item.id}>
            <RecentItemChip key={item.id} title={item.title} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentConversations;
