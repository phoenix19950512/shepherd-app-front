import { ConversationHistory } from '../../../../../../../../types';
import ListItem from '../list-item';

function ListGroup({
  date,
  groupItems
}: {
  date: string;
  groupItems: ConversationHistory[];
}) {
  return (
    <div className="w-full flex gap-2 flex-col my-2">
      <p className="text-[10px] text-[#585F68] font-normal pl-5">{date}</p>
      <div className="group-items flex flex-col gap-2">
        {groupItems.map((conversation) => (
          <ListItem
            subject={conversation.subject}
            topic={conversation.topic}
            id={conversation.id}
            title={conversation.title}
            key={conversation.id}
            level={conversation.level}
          />
        ))}
      </div>
    </div>
  );
}

export default ListGroup;
