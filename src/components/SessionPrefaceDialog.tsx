import theme from '../theme';
import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash
} from 'react-icons/fa';
import styled from 'styled-components';

export interface SessionPrefaceDialogRef {
  open: (conferenceUrl: string) => void;
}

const Root = styled(Box)`
  #payment-form {
    width: 100%;
  }
`;

const VideoContainer = styled(Box)`
  height: 272px;
  position: relative;
  background: #0f0f10;
  border-radius: 6px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: rotateY(180deg);
    position: relative;
    z-index: 3;
  }
`;

const UserInitial = styled(Box)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 76px;
  height: 76px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #4caf50;
  border-radius: 100%;
  z-index: 2;
  text-transform: uppercase;

  font-weight: 600;
  font-size: 48px;
  line-height: 60px;
  letter-spacing: -0.03em;
  color: #ffffff;
`;

const VideoActions = styled(Box)`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: flex-end;
  padding-inline: 32px;
  padding-bottom: 24px;
  gap: 14px;
  z-index: 3;
`;

const VideoActionBtn = styled.button<{ $isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  background: ${(props) =>
    props.$isDisabled ? theme.colors.red[400] : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;

  &:hover {
    background: ${(props) =>
      props.$isDisabled ? theme.colors.red[500] : 'rgba(255, 255, 255, 0.4)'};
  }
`;

interface Props {
  title?: string;
  initial?: string;
}

const SessionPrefaceDialog = React.forwardRef<SessionPrefaceDialogRef, Props>(
  ({ title, initial }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const promiseResolve = useRef<(() => void) | null>(null);
    const promiseReject = useRef<(() => void) | null>(null);
    const [conferenceUrl, setConferenceUrl] = useState<string | null>(null);

    const [audioOff, setAudioOff] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const [videoRefSet, setVideoRefSet] = useState(false);

    React.useImperativeHandle(ref, () => {
      return {
        open: async (conferenceUrl) => {
          onOpen();
          setConferenceUrl(conferenceUrl);

          return new Promise((resolve, reject) => {
            promiseResolve.current = resolve;
            promiseReject.current = reject;
          });
        }
      };
    });

    const htmlVideoElementRef = useRef<HTMLVideoElement | null>(null);

    const startVideo = async (node: HTMLVideoElement) => {
      if (node) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          node.srcObject = stream;
        } catch (e) {
          // permission rejected
          // TODO: Show an alert asking them to enable audio & video cam permissions
        }
      }
    };

    const stopVideo = async (node: HTMLVideoElement) => {
      if (node) {
        const stream = node.srcObject;

        if (stream) {
          // @ts-ignore: A little concerned about this bit of ts-ignore
          const tracks = stream.getTracks();

          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            track.stop();
          }

          node.srcObject = null;
        }
      }
    };

    useLayoutEffect(() => {
      if (videoRefSet) {
        if (isOpen) startVideo(htmlVideoElementRef.current as HTMLVideoElement);
        else stopVideo(htmlVideoElementRef.current as HTMLVideoElement);
      }
    }, [isOpen, videoRefSet]);

    return (
      <Root>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody
              padding={0}
              paddingBottom={'0 !important'}
              flexDirection="column"
            >
              <Box w={'100%'} mt={5} textAlign="center">
                <Text className="sub3" color="text.200">
                  {title}
                </Text>
                <Divider mb={0} orientation="horizontal" />
              </Box>
              <Box w={'100%'} p={6} pb={'46px'}>
                <VideoContainer>
                  <video
                    hidden={videoOff}
                    muted
                    ref={(r) => {
                      htmlVideoElementRef.current = r;
                      setVideoRefSet(!!r);
                    }}
                    autoPlay
                  />
                  <UserInitial>{initial}</UserInitial>
                  <VideoActions>
                    <VideoActionBtn
                      onClick={() => setAudioOff((v) => !v)}
                      $isDisabled={audioOff}
                    >
                      {!audioOff ? <FaMicrophone /> : <FaMicrophoneSlash />}
                    </VideoActionBtn>
                    <VideoActionBtn
                      onClick={() => setVideoOff((v) => !v)}
                      $isDisabled={videoOff}
                    >
                      {!videoOff ? <FaVideo /> : <FaVideoSlash />}
                    </VideoActionBtn>
                  </VideoActions>
                </VideoContainer>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={!conferenceUrl}
                as={'a'}
                href={conferenceUrl as string}
              >
                Join Lesson
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Root>
    );
  }
);

export default SessionPrefaceDialog;
