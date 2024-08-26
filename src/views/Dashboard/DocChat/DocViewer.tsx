import AskIcon from '../../../assets/avatar-male.svg';
import { SelectedNoteModal } from '../../../components';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import { snip } from '../../../helpers/file.helpers';
import {
  getPDFHighlight,
  postPDFHighlight,
  generateComment
} from '../../../services/AI';
import userStore from '../../../state/userStore';
import { Button, Text, Image, Flex, Spacer } from '@chakra-ui/react';
import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  Position,
  PrimaryButton,
  Tooltip,
  Icon,
  MinimalButton
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightTargetProps,
  RenderHighlightsProps
} from '@react-pdf-viewer/highlight';
// Import styles
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
// Import styles
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import {
  NextIcon,
  PreviousIcon,
  RenderSearchProps,
  searchPlugin
} from '@react-pdf-viewer/search';
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot
} from '@react-pdf-viewer/toolbar';
import {
  RenderCurrentScaleProps,
  RenderZoomInProps,
  RenderZoomOutProps,
  zoomPlugin
} from '@react-pdf-viewer/zoom';
import clsx from 'clsx';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { CiSaveDown2 } from 'react-icons/ci';
import { HiOutlineSave } from 'react-icons/hi';
import { PiMinusThin, PiPlusThin } from 'react-icons/pi';
import { TbMessage2Plus } from 'react-icons/tb';
import Typewriter from 'typewriter-effect';

interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
}

function DocViewer(props) {
  const {
    pdfLink,
    pdfName,
    documentId,
    setLoading,
    hightlightedText,
    setHightlightedText,
    selectedHighlightArea,
    setSelectedHighlightArea
  } = props;
  const [popUpNotesModal, setPopUpNotesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userStore();
  const [readyToSearch, setReadyToSearch] = useState(false);
  const [displayTypewriter, setDisplayTypewriter] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState(0);
  const [notes, setNotes] = useState<Note[]>([
    // {
    //   id: 1,
    //   content:
    //     'A note that has been truncated well and true. lorem ipsiuw black cat fox ran out for toy car',
    //   highlightAreas: [
    //     {
    //       height: 1.6497396504614115,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 7.007269165334845,
    //       width: 38.16954520597886
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: -0.26395834407382585,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 9.13955766355622,
    //       width: 35.0832915603354
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 1.847708408516781,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 12.129710780017529,
    //       width: 26.390961082756107
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 35.909588042289464,
    //       pageIndex: 2,
    //       top: 12.129710780017529,
    //       width: 0.5614290922347794
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 36.29894276339774,
    //       pageIndex: 2,
    //       top: 12.129710780017529,
    //       width: 12.233412322274882
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 3.9593751611073875,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 14.169201422900448,
    //       width: 39.26681553044112
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 6.071041913697995,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 16.159199876269525,
    //       width: 38.64085854903391
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 8.182708666288601,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 18.15950920245399,
    //       width: 38.328973751367116
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 10.294375418879207,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 20.149507655823065,
    //       width: 38.58069403937295
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 12.406042171469815,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 22.149816982007525,
    //       width: 38.81539372949326
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 14.517708924060422,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 24.14909522091045,
    //       width: 26.510116660590594
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 16.62937567665103,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 27.139248337371757,
    //       width: 10.334220060153116
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 19.858549033904485,
    //       pageIndex: 2,
    //       top: 27.139248337371757,
    //       width: 0.5614290922347794
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 20.24936201239519,
    //       pageIndex: 2,
    //       top: 27.139248337371757,
    //       width: 26.843863926358
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 18.741042429241634,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 29.169459194720833,
    //       width: 35.64992708713088
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 20.852709181832243,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 31.169768520905293,
    //       width: 36.937386073641996
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 22.96437593442285,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 33.16904675980822,
    //       width: 38.59462723295662
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 25.076042687013455,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 35.15904521317729,
    //       width: 18.988721290557784
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 27.187709439604063,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 38.1491983296386,
    //       width: 26.342485417426175
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 35.86875683558148,
    //       pageIndex: 2,
    //       top: 38.1491983296386,
    //       width: 0.5614290922347794
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 36.24936201239519,
    //       pageIndex: 2,
    //       top: 38.1491983296386,
    //       width: 11.94532674079475
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 29.299376192194668,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 40.189720059803065,
    //       width: 34.894458621946775
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 31.411042944785276,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 42.18899829870598,
    //       width: 37.42541241341597
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 2,
    //       top: 33.52270969737588,
    //       width: 0
    //     },
    //     {
    //       height: 1.6497396504614115,
    //       left: 9.519504192489974,
    //       pageIndex: 2,
    //       top: 44.04701758003815,
    //       width: 26.252745625227853
    //     }
    //   ],
    //   quote:
    //     "Paralinx about camera integration; Amazon,  Google and IBM about cloud computing.  WWDC and Silicon Valley:  We were very  pleasantly surprised to be invited by Apple to  their World Wide Developers Conference in  San Jose in June, despite not having applied.  It's a valuable chance to learn and make new  connections. We’re also setting aside time to  meet other potential partners.  Cine Gear:  We have decided not to attend  the Cine Gear expo in L.A. this year, since  feedback from many users about the show  were mixed, and our planned beta version of  3.0 is slightly delayed.  Development and launch:  Development  is around one month behind our original  schedule. We expect the delay to decrease,  with new developers on board"
    // },
    // {
    //   id: 2,
    //   content: 'Andreas and Audun',
    //   highlightAreas: [
    //     {
    //       height: 1.6497396504614115,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 46.997989379801,
    //       width: 5.0808535362741525
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 56.088953700328105,
    //       pageIndex: 1,
    //       top: 47.12996855183791,
    //       width: 0.5614290922347794
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 56.47976667881881,
    //       pageIndex: 1,
    //       top: 47.12996855183791,
    //       width: 30.947571090047393
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 105.31937928545652,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 49.16945919472084,
    //       width: 32.40459806780897
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 107.43104603804711,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 51.16976852090529,
    //       width: 34.80559606270507
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 109.54271279063772,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 53.15976697427437,
    //       width: 36.281090503098795
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 111.65437954322833,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 55.15904521317729,
    //       width: 34.53379055778345
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 113.76604629581894,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 57.149043666546376,
    //       width: 32.70012304046664
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 115.87771304840955,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 59.14935299273083,
    //       width: 37.42799854174262
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 117.98937980100015,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 61.139351446099916,
    //       width: 36.22507291286912
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 120.10104655359076,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 63.13966077228437,
    //       width: 35.44982683193584
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 122.21271330618137,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 65.12965922565346,
    //       width: 30.776886620488515
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 124.32438005877198,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 67.12996855183792,
    //       width: 36.420559150565076
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 126.43604681136259,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 69.12924679074084,
    //       width: 32.92017180094787
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 128.54771356395318,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 54.029894276339775,
    //       pageIndex: 1,
    //       top: 71.11924524410992,
    //       width: 28.756003919066714
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 130.6593803165438,
    //       width: 0
    //     },
    //     {
    //       height: 1.4249626230860442,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 73.11955457029437,
    //       width: 39.099298213634704
    //     },
    //     {
    //       height: 2.573593854719802,
    //       left: 0,
    //       pageIndex: 1,
    //       top: 132.7710470691344,
    //       width: 0
    //     },
    //     {
    //       height: 1.6497396504614115,
    //       left: 51.00984323733139,
    //       pageIndex: 1,
    //       top: 74.97757385162654,
    //       width: 26.67405668975574
    //     }
    //   ],
    //   quote:
    //     "NAB:  Andreas and Audun travelled to the  National Association of Broadcasters  convention (NAB) in Las Vegas for three  hectic days in April. NAB gathers 100,000  participants from film and TV. It's a very  efficient way of meeting people in the  business, and getting an updated picture of  the business landscape. The most exciting  meeting was with PIX System, one of our  most important competitors. It was  interesting to note that they regarded the  indie market as bigger than their own.  Andreas was able to secure us an  invitation to the DIT-WIT party, with some of  the world's leading DITs in atte"
    // }
  ]);
  // let noteId = notes.length;
  const typewriterRef = useRef(null);

  const toast = useCustomToast();

  const handleHighlight = useCallback(
    async (message, selectedText, position, cancel) => {
      setIsLoading(true);
      // const note: Note = {
      //   id: ++noteId,
      //   content: message,
      //   highlightAreas: props.highlightAreas,
      //   quote: props.selectedText
      // };
      // setNotes(notes.concat([note]));
      // props.cancel();

      try {
        const response = await postPDFHighlight({
          studentId: user.student._id,
          documentId: documentId,
          highlight: { name: selectedText, position: position },
          content: message
        });

        if ([200].includes(response.status)) {
          toast({
            title: 'Highlighted words saved successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });

          const getHighlight = async () => {
            setLoading(true);
            const response = await getPDFHighlight({ documentId });
            setHightlightedText(response);
            setLoading(false);
          };
          getHighlight();
          setIsLoading(false);
          cancel();
        } else {
          toast({
            title: 'Unable to process this request.Please try again later',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
          setIsLoading(false);
        }
      } catch (error) {
        // toast({
        //   title: 'Unable to process this request.Please try again later',
        //   position: 'top-right',
        //   status: 'error',
        //   isClosable: true
        // });
      }
    },
    [documentId, hightlightedText]
  );

  const handleGenerateComment = async (selectedText) => {
    setDisplayTypewriter(true);

    try {
      const response = await generateComment({
        documentId: documentId,
        highlightText: selectedText,
        studentId: user._id
      });

      if (response) {
        if (typewriterRef.current) {
          typewriterRef.current
            .typeString(` ${response.comment.replace(/\n/g, '')}`)
            .start()
            .callFunction(() => {
              setMessage(response.comment.replace(/\n/g, ''));
              setDisplayTypewriter(false);
            });
        }
        // setDisplayTypewriter(false);
      } else {
        toast({
          title: 'Unable to process this request.Please try again later',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: `${error}`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    ZoomIn: () => (
      <>
        {' '}
        <ZoomIn>
          {(props: RenderZoomInProps) => (
            <PiPlusThin
              color="#606264"
              onClick={props.onClick}
              size={15}
              cursor="pointer"
            />
          )}
        </ZoomIn>
      </>
    ),
    ZoomOut: () => (
      <>
        {' '}
        <ZoomOut>
          {(props: RenderZoomOutProps) => (
            <PiMinusThin
              color="#606264"
              onClick={props.onClick}
              size={15}
              cursor="pointer"
            />
          )}
        </ZoomOut>
      </>
    ),

    Zoom: () => (
      <>
        {/* {(props: RenderCurrentScaleProps) => (
          <>{`${Math.round(props.scale * 100)}%`}</>
        )} */}
        {/* <div style={{ padding: '0px 2px' }}>
          <CurrentScale>
            {(props: RenderCurrentScaleProps) => (
              <>{`${Math.round(props.scale * 100)}`}</>
            )}
          </CurrentScale>
        </div> */}
      </>
    ),

    Download: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>
  });

  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement
  ) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
        borderRadius: 8
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            bgColor={'transparent'}
            _hover={{ bgColor: '#EDF2F7' }}
            borderRadius={8}
            onClick={() => {
              setMessage('');
              props.toggle();
            }}
          >
            <TbMessage2Plus color="#6E7682" />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            bgColor={'transparent'}
            _hover={{ bgColor: '#EDF2F7' }}
            borderRadius={8}
            onClick={() =>
              handleHighlight(
                'no comment...',
                props.selectedText,
                props.highlightAreas,
                props.cancel
              )
            }
          >
            <HiOutlineSave color="#6E7682" />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Save Highlight</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    // Calculate the height of the viewport or the container where the modal should be displayed
    const viewportHeight = window.innerHeight;

    // Calculate the available space below the selected text
    const availableSpace =
      viewportHeight - (props.selectionRegion.top / 100) * viewportHeight;

    // Set the top position of the modal to be just below the selected text
    // const topPosition = `${
    //   props.selectionRegion.top - props.selectionRegion.height
    // }px`;
    const topPosition = `${props.selectionRegion.top - availableSpace - 10}%`;

    // Calculate the maximum height for the modal to fit within the available space
    const maxHeight = Math.min(availableSpace - 20, 400); // Subtracting 20 for padding and margins

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0, 0, 0, .3)',
          borderRadius: 8,
          padding: '8px',
          position: 'absolute',
          left: `${
            props.selectionRegion.left <= 50
              ? props.selectionRegion.left
              : props.selectionRegion.left - 40
          }%`,
          top: `${
            props.selectionRegion.top <= 80
              ? props.selectionRegion.top + props.selectionRegion.height
              : props.selectionRegion.top - props.selectionRegion.height - 30
          }%`,
          zIndex: 1,
          width: '250px'
        }}
      >
        <div
          style={{ overflowY: 'scroll', maxHeight: '200px' }}
          className="custom-scroll"
        >
          {displayTypewriter ? (
            <Typewriter
              options={{
                delay: 10,
                autoStart: true, // Set to false to control it manually
                loop: false,
                skipAddStyles: true,
                wrapperClassName: 'text-sm font-light '
              }}
              onInit={(typewriter) => {
                typewriterRef.current = typewriter; // Store the typewriter instance in a ref
              }}
            />
          ) : (
            <textarea
              rows={3}
              value={message}
              style={{
                border: '1px solid rgba(0, 0, 0, .3)'
              }}
              onChange={(e) => {
                e.preventDefault();
                setMessage(e.target.value);
              }}
            ></textarea>
          )}
        </div>
        <Flex height={45}>
          <Flex
            alignItems={'center'}
            bgColor={'transparent'}
            color="text.400"
            borderRadius={'40px'}
            fontSize="12px"
            p="4px 12px"
            _hover={{
              cursor: 'pointer',
              bgColor: '#EDF2F7',
              transform: 'translateY(-2px)'
            }}
            position="sticky"
            onClick={() => handleGenerateComment(props.selectedText)}
          >
            {' '}
            <AskIcon />
            <Text fontSize={12} color="text.400">
              {' '}
              Ask Shep?
            </Text>
          </Flex>{' '}
          <Spacer />
          <Button
            isDisabled={!message}
            isLoading={isLoading}
            onClick={() =>
              handleHighlight(
                message,
                props.selectedText,
                props.highlightAreas,
                props.cancel
              )
            }
          >
            Save
          </Button>
          {/* <Button onClick={props.cancel}>Ask Shepherd</Button> */}
        </Flex>
      </div>
    );
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {hightlightedText.map((note) => (
        <React.Fragment key={note.id}>
          {note?.highlight?.position
            // Filter all highlights on the current page
            ?.filter((area) => area.pageIndex === props.pageIndex)
            ?.map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: 'orange',
                    opacity: 0.4
                  },
                  props.getCssProperties(area, props.rotation)
                )}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: (defaultTabs) => [
      // Remove the attachments tab (\`defaultTabs[2]\`)
      defaultTabs[0] // Bookmarks tab
      // defaultTabs[1] // Thumbnails tab
    ]
  });
  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights
  });
  const { jumpToHighlightArea } = highlightPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance;
  const searchPluginInstance = searchPlugin();
  const { Search } = searchPluginInstance;
  const highlightPosition = sessionStorage.getItem('goTo');
  const goToHighlight = async () => {
    jumpToHighlightArea(selectedHighlightArea);
    setSelectedHighlightArea({});
  };
  if (Object.keys(selectedHighlightArea).length > 0) {
    goToHighlight();
  }

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div
          // style={{ display: 'flex', position: 'fixed' }}
          className={clsx('lg:col-span-6 flex-auto h-full flex', {
            fixed: false,
            'w-1/2': false
          })}
        >
          <div style={{ height: '100vh', width: '90%', position: 'relative' }}>
            <div
              className="absolute z-2 font-bold max-h-max max-w-max text-sm right-20 top-0 p-2 bg-green-100 rounded-xl m-1 hover:text-blue-600 hover:cursor-pointer hover:bg-yellow-100"
              onClick={() => setPopUpNotesModal(true)}
              style={{ zIndex: '1000' }}
            >
              {snip(pdfName, 40)}
            </div>

            <Viewer
              fileUrl={pdfLink}
              plugins={[
                defaultLayoutPluginInstance,
                highlightPluginInstance,
                searchPluginInstance,
                zoomPluginInstance,
                pageNavigationPluginInstance
              ]}
            />
          </div>
        </div>
      </Worker>
      {popUpNotesModal && (
        <SelectedNoteModal
          show={popUpNotesModal}
          setShow={setPopUpNotesModal}
          setShowHelp={() => null}
        />
      )}
    </>
  );
}

export default DocViewer;
