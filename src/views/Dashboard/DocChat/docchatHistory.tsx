import DeleteIcn from '../../../assets/deleteIcn.svg?react';
import EditIcn from '../../../assets/editIcn.svg?react';
import HistoryIcn from '../../../assets/historyIcon.svg?react';
import { encodeQueryParams, getDateString } from '../../../helpers';
import { getDocchatHistory } from '../../../services/AI';
import userStore from '../../../state/userStore';
import noteStore from '../../../state/noteStore';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryDate,
  ChatHistoryHeader,
  HomeWorkHelpChatContainer2
} from './styles';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface IDocchatHistory {
  studentId: string;
  setIsChatHistory?: (value: boolean) => void;
  noteId?: string;
}

const Clock = styled.div`
  width: 20px;
  height: 20px;
  padding: 5px;
  margin: 5px;
  margin-top: 0;
`;

type Chat = {
  createdAt: string;
  documentId: string;
  documentURL: string;
  id: number;
  keywords: string[];
  reference: string;
  referenceId: string;
  title: string;
  updatedAt: string;
  type: 'note' | 'file';
  createdDated: string;
  noteId?: string;
  note?: string;
};

type GroupedChat = {
  date: string;
  messages: Chat[];
};

const DocchatHistory = ({
  studentId,
  setIsChatHistory,
  noteId
}: IDocchatHistory) => {
  const { user, userDocuments, fetchUserDocuments } = userStore();
  const { fetchNotes } = noteStore();
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [groupChatsByDateArr, setGroupChatsByDateArr] = useState<GroupedChat[]>(
    []
  );
  const [updateChatHistory, setUpdateChatHistory] = useState({});
  const [updatedChat, setUpdatedChat] = useState('');
  const [toggleHistoryBox, setToggleHistoryBox] = useState({});
  const showSearchRef = useRef(null) as any;
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (
      showSearchRef.current &&
      !showSearchRef.current.contains(event.target as Node)
    ) {
      setToggleHistoryBox({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchRef]);

  async function retrieveChatHistory(
    studentIdParam: string,
    noteText?: string
  ) {
    const docHistories = await getDocchatHistory({ studentIdParam, noteText });

    const filteredHistories = docHistories
      ?.map((docHistory) => ({
        ...docHistory,
        createdAt: new Date(docHistory.createdAt),
        title: docHistory.title,
        createdDated: getDateString(new Date(docHistory.createdAt))
      }))
      ?.sort((a, b) => b.createdAt - a.createdAt)
      .reduce((unique, item) => {
        if (!unique.some((obj) => obj.title === item.title)) {
          unique.push(item);
        }
        return unique;
      }, []);
    setChatHistory(filteredHistories);
  }

  function groupChatsByDate(chatHistory: Chat[]): GroupedChat[] {
    return chatHistory?.reduce((groupedChats, chat) => {
      const currentGroup = groupedChats?.find(
        (group) => group.date === chat.createdDated
      );
      if (currentGroup) {
        currentGroup?.messages.push(chat);
      } else {
        groupedChats?.push({ date: chat.createdDated, messages: [chat] });
      }
      return groupedChats;
    }, [] as GroupedChat[]);
  }

  const goToDocChat = async (
    documentUrl,
    docTitle,
    documentId,
    docKeywords,
    studentId
  ) => {
    const query = encodeQueryParams({
      documentUrl,
      docTitle,
      documentId,
      docKeywords,
      sid: user._id
    });
    navigate(`/dashboard/docchat${query}`);
    if (setIsChatHistory) {
      setIsChatHistory(false);
    }

    user && fetchUserDocuments(user._id);
  };

  const goToNoteChat = async (noteId: string) => {
    user && fetchNotes();
    const query = encodeQueryParams({
      noteId,
      sid: user._id
    });
    navigate(`/dashboard/docchat${query}`);
    if (setIsChatHistory) {
      setIsChatHistory(false);
    }
  };

  useEffect(() => {
    if (user) {
      const id = user?._id;
      retrieveChatHistory(id, noteId);
    }
  }, [user, noteId]);

  useEffect(() => {
    const groupedChats = groupChatsByDate(chatHistory);

    setGroupChatsByDateArr(groupedChats ?? []);
  }, [chatHistory]);

  return (
    <section className="">
      <div
        style={{
          marginTop: '2.6rem'
        }}
      >
        <ChatHistoryHeader docchat={true}>
          <p>Chat history</p>
          <p>Clear history</p>
        </ChatHistoryHeader>
      </div>

      <div
        style={{
          overflowY: 'scroll',
          height: '80vh'
        }}
      >
        {groupChatsByDateArr.length > 0 &&
          groupChatsByDateArr?.map((history, index) => (
            <ChatHistoryBlock key={index}>
              <ChatHistoryDate>{history.date}</ChatHistoryDate>
              {history.messages.map((message, index) => (
                <>
                  {!toggleHistoryBox[message.id] ? (
                    <ChatHistoryBody key={message.id}>
                      <Clock>
                        <HistoryIcn />
                      </Clock>
                      {toggleHistoryBox[message.id] ? (
                        <HomeWorkHelpChatContainer2
                          value={updateChatHistory[message.id]}
                          onChange={(event) => {
                            setUpdatedChat(event.target.value);
                            setUpdateChatHistory((prevChatHistory) => ({
                              ...prevChatHistory,
                              [message.id]: event.target.value
                            }));
                          }}
                        ></HomeWorkHelpChatContainer2>
                      ) : (
                        <p
                          onClick={() => {
                            if (message.type === 'file') {
                              goToDocChat(
                                message.documentURL,
                                message.title,
                                message.documentId,
                                message.keywords,
                                user?._id
                              );
                            } else {
                              goToNoteChat(message.note);
                            }
                          }}
                        >
                          {message.title}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'inherit'
                        }}
                      >
                        {toggleHistoryBox[message.id] ? (
                          // <EditIcn onClick={handleUpdateConversation} />
                          <p
                            onClick={() => {
                              // console.log('save');
                            }}
                          >
                            Save
                          </p>
                        ) : (
                          //   <EditIcn
                          //     onClick={() => {
                          //       //   setEditConversationId(message.id);
                          //       //   toggleMessage(message.id);
                          //       console.log('edit');
                          //     }}
                          //   />
                          <></>
                        )}
                        {/* <EditIcn onClick={handleUpdateConversation} /> */}
                        <DeleteIcn
                          onClick={() => {
                            // setDeleteConservationModal(
                            //   (prevState) => !prevState
                            // );
                            // setConversationId(message.id);
                            // setRemoveIndex(index);
                          }}
                        />
                      </div>
                    </ChatHistoryBody>
                  ) : (
                    <ChatHistoryBody key={message.id} ref={showSearchRef}>
                      <Clock>
                        <HistoryIcn />
                      </Clock>
                      <HomeWorkHelpChatContainer2
                        value={updateChatHistory[message.id]}
                        onChange={(event) => {
                          setUpdatedChat(event.target.value);
                          setUpdateChatHistory((prevChatHistory) => ({
                            ...prevChatHistory,
                            [message.id]: event.target.value
                          }));
                        }}
                      ></HomeWorkHelpChatContainer2>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'inherit'
                        }}
                      >
                        <p>Save</p>

                        {/* <EditIcn onClick={handleUpdateConversation} /> */}
                        <DeleteIcn
                          onClick={() => {
                            // setDeleteConservationModal(
                            //   (prevState) => !prevState
                            // );
                            // setConversationId(message.id);
                            // setRemoveIndex(index);
                          }}
                        />
                      </div>
                    </ChatHistoryBody>
                  )}
                </>
              ))}
            </ChatHistoryBlock>
          ))}
      </div>
    </section>
  );
};

export default DocchatHistory;
