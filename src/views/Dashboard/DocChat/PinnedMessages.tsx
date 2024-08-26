import CopyIcn from '../../../assets/copy.svg?react';
import DeleteIcn from '../../../assets/deleteIcn.svg?react';
import EditIcn from '../../../assets/editIcn.svg?react';
import SummaryIcn from '../../../assets/summaryIcn1.svg?react';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
// import { copierHandler } from '../../../helpers';
import { IconContainer, IconContainer2, SummaryContainer } from './styles';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BsSearch } from 'react-icons/bs';

const PinnedMessages = ({
  messages,
  scrollToMessage,
  onPinnedMessages
}: {
  messages: any[];
  scrollToMessage: any;
  onPinnedMessages?: any;
}) => {
  const [pinnedSearches, setPinnedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [copiedView, setCopiedView] = useState<any>();

  const filteredMessages = useMemo(() => {
    const uniqueMessages = new Map();
    messages?.forEach((message) => {
      if (message.isPinned === true) {
        uniqueMessages.set(message.chatId, message);
      }
    });
    return Array.from(uniqueMessages.values());
  }, [messages]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPinnedSearch(value);

    // If the search input is empty, display all texts
    if (!value.trim()) {
      setSearchResults(filteredMessages);
      return;
    }

    const lowercasedValue = value.toLowerCase();
    const results = filteredMessages?.filter((text) =>
      text.text.toLowerCase().includes(lowercasedValue)
    );
    setSearchResults(results);
  };

  const copierHandler = useCallback((copiedText = '', chatId = 0) => {
    navigator.clipboard.writeText(copiedText);

    setCopiedView((prev) => ({ ...prev, [chatId]: true }));

    setTimeout(() => {
      setCopiedView((prev) => ({ ...prev, [chatId]: false }));
    }, 2000);
  }, []);

  // Set initial search results
  useEffect(() => {
    setSearchResults(filteredMessages);
  }, [filteredMessages]);

  return (
    <div
      style={{
        marginTop: '40px'
      }}
    >
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#585F68',
          background: '#fff',
          borderRadius: '6px',
          boxShadow: '-1px 5px 11px 0px #2E303814',
          margin: '0px 22px',
          padding: '10px'
        }}
      >
        Pinned Messages
      </p>
      <Flex margin="30px 22px" alignItems="center">
        <InputGroup
          size="sm"
          borderRadius="6px"
          width={{ base: '100%', md: '100%' }}
          height="32px"
        >
          <InputLeftElement marginRight={'10px'} pointerEvents="none">
            <BsSearch color="#5E6164" size="14px" />
          </InputLeftElement>
          <Input
            type="text"
            variant="outline"
            onChange={handleSearch}
            size="sm"
            placeholder="Search"
            borderRadius="6px"
            value={pinnedSearches}
          />
        </InputGroup>
      </Flex>
      <div style={{ marginTop: '60px' }}>
        {!!searchResults?.length && (
          <>
            {searchResults.map((text: any) => (
              <SummaryContainer
                key={text}
                onClick={() => {
                  scrollToMessage(text?.chatId);
                  onPinnedMessages();
                }}
              >
                <IconContainer2>
                  {copiedView?.[text?.chatId] ? (
                    <p
                      style={{ fontSize: '.75rem', color: 'rgb(88, 95, 104)' }}
                    >
                      {'Copied!'}
                    </p>
                  ) : (
                    <CopyIcn
                      onClick={(event) => {
                        event.stopPropagation();
                        copierHandler(text?.text, text?.chatId);
                      }}
                    />
                  )}

                  {/* <DeleteIcn /> */}
                </IconContainer2>
                <CustomMarkdownView source={text.text} />
              </SummaryContainer>
            ))}
          </>
        )}

        {!searchResults?.length && (
          <div>
            <p
              style={{
                fontWeight: '400',
                fontSize: '1rem',
                textAlign: 'center'
              }}
            >
              There are no pinned messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedMessages;
