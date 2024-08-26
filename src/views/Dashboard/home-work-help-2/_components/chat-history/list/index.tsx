import React, { useState } from 'react';
import SearchBar from '../search-bar';
import ListGroup from './_components/list-group';
import { format, isToday, isYesterday } from 'date-fns';
import { ConversationHistory } from '../../../../../../types';

type Conversation = ConversationHistory;

interface GroupedConversations {
  [date: string]: Conversation[];
}

interface Filter {
  keyword: string;
  subject: string;
}

function ChatList({ conversations = [] }: { conversations: Conversation[] }) {
  const [filter, setFilter] = useState<Filter>({ keyword: '', subject: '' });

  const handleFilterChange = (key: keyof Filter) => (value: string) => {
    setFilter({
      ...filter,
      [key]: value
    });
  };

  const filteredConversations = filterConversations(conversations, filter);
  const groupedConversations = groupConversationsByDate(filteredConversations);

  return (
    <React.Fragment>
      <div className="search-bar w-full">
        <SearchBar
          conversations={conversations}
          handleSubjectFilter={handleFilterChange('subject')}
          handleKeywordFilter={handleFilterChange('keyword')}
        />
      </div>
      <div className="w-full h-full overflow-y-scroll flex flex-col gap-2 over no-scrollbar relative pb-20">
        {Object.keys(groupedConversations).map((date) => (
          <ListGroup
            key={date}
            date={date}
            groupItems={groupedConversations[date]}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function filterConversations(
  conversations: Conversation[],
  { keyword, subject }: Filter
) {
  return conversations?.filter((conversation) => {
    return (
      conversation?.subject?.toLowerCase().includes(subject.toLowerCase()) &&
      conversation?.title?.toLowerCase().includes(keyword.toLowerCase())
    );
  });
}

function groupConversationsByDate(
  conversations: Conversation[]
): GroupedConversations {
  return conversations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .reduce((acc: GroupedConversations, conversation) => {
      const date = new Date(conversation.createdAt);
      let key = '';

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'dd MMMM yyyy');
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(conversation);

      return acc;
    }, {});
}

export default ChatList;
