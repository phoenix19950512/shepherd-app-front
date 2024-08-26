import { XCircleIcon } from '@heroicons/react/20/solid';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  Text,
  useDisclosure,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Spacer,
  HStack
} from '@chakra-ui/react';
import LinedListWelcome from './LinedListWelcome';
import useCompletedStore from '../state/useCompletedStore';
import { MdCancel } from 'react-icons/md';
import PlansModal from './PlansModal';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';

const defaultItems = [
  {
    id: 1,
    title: 'Welcome to Shepherd',
    content: [
      ` Hey Friend! <br /> <br />Welcome to Shepherd. We're really excited to have you with us. We built Shepherd because we want to make your studying
              more efficient and effective.  <br /><br /> As former students we wanted to build
              the tool we wish we had. Let's take a quick walk through some cool
              features that can make studying a breeze for you. <br /><br /> 
              <strong>Already convinced? Subscribe to unlock your AI study tools.</strong>`
    ],
    image: ['/images/welcome/welcome-minions.gif'],
    read: true
  },
  {
    id: 2,
    title: 'Taking Notes on Shepherd',
    content: [
      ` First up, note-taking. This is probably where you&apos;d be day to
      day. It&apos;s super easy and organized here. Think of it as your
      digital notebook that&apos;s always just a click away, ready to keep
      all your thoughts and study notes in one place. <br /> You can use
      Shepherd to converse with your notes or automatically generate
      flashcards`
    ],
    image: [`/images/welcome/chat-notes.gif`],
    read: false
  },
  {
    id: 3,
    title: 'Doc-Chat',
    content: [
      `Have a complex or really long document, and need to get smart about
           it really fast? Ever wished you could just ask your notes a
           question? With Doc-Chat, you kind of can. It&apos;s like having a
           chat with your documents to get summaries or clarify points. Pretty
           handy, right? Also you can share your chat with your friends!`
    ],
    image: ['/images/welcome/Docchat-2.gif'],
    read: false
  },
  {
    id: 4,
    title: 'Creating flashcards & Creating quizzes',
    content: [
      `Ok, this one is super cool. Flashcards can be a pain to make, but
             not here. Shepherd helps you whip them up in no time. You can
             generate flashcards from a topic, or from your own document with
             varying difficulties.
        
             What&apos;s also super cool is - You can also upload Anki flashcards
             (<em>wink</em> Med-students). We also use a pretty cool
             Spaced-repetition algorithm to prompt you to study (via email) so you
             never forget. You can also share these with your friends!`,
      `Here is my favorite, generating a quiz. You can generate a quiz from a topic or file in many different formats`
    ],

    image: [
      '/images/welcome/Generate-Flashcards.gif',
      '/images/welcome/Generate-Quizzes.gif'
    ],
    read: false
  },
  {
    id: 5,
    title: 'AI Tutor',
    content: [
      `
            If you hit a tough spot, our AI Tutor is here for you.<br/>

            We use the latest AI- models here and we are really prioritizing
            giving you clear explanations, so you can understand those tricky
            parts without any confusion
         `
    ],
    image: ['/images/welcome/AiTutor.gif'],
    read: false
  },
  {
    id: 6,
    title: 'Connecting with a human tutor',
    content: [
      ` Ok, here is where we really shine. If you need personalized
              guidance? You can connect with human tutors from some really cool
              universities.
              <br />
              They&apos;re super knowledgeable and friendly. They're here to offer
              you additional support and insight via text or video.
              <br />
              They are super affordable because we take
              <strong>
                50% less commission than competing tutor platforms.
              </strong>
              <br />
              We are always onboarding tutors. So if you want to share your
              knowledge? Sign up to become a tutor too!" `
    ],
    image: ['/images/welcome/Tutoring.gif'],
    read: false
  },
  {
    id: 7,
    title: 'Final note!',
    content: [
      `
            Ok! That&apos;s the quick tour! We are really excited about what
            we’ve built, but we would be even more stoked if you join us!
         <br /> <br />
         
           <strong>Quick parting notes </strong> 
            <ol>
              <li>
                    1. To get the most out of Shepherd, we suggest you <strong> try out our Premium tier </strong> because we
                really believe you&apos;d love it. It&apos;s easy to cancel if
                you don&apos;t.
              </li>
              <br /> 
              <li>
                    2. If you sign up for a premium account you get to support a low
                income student who can&apos;t afford Shepherd at the moment.
              </li>
            </ol>
            <br /> 
   
          <p className="text-lg my-3">
            We have more features coming out soon! We'd love to hear your
            thoughts and shape the way we all learn.
            <br />
            Ready to dive in?
          </p>`
    ],
    image: ['/images/welcome/Subscribe-min.gif'],
    read: false
  }
];

interface ToggleProps {
  setToggleOnboardModal: (state: boolean) => void;
  toggleOnboardModal: boolean;
}

export default function WelcomeWalkthrough({
  setToggleOnboardModal,
  toggleOnboardModal
}: ToggleProps) {
  const open = useCompletedStore((state) => state.open);
  const setOpen = useCompletedStore((state) => state.setOpen);
  const [currentIdx, setCurrentIdx] = React.useState(1);
  const [togglePlansModal, setTogglePlansModal] = React.useState(false);
  const { user, fetchUser }: any = userStore();

  const setStudentOnboardStatus = async (status: boolean, userId: string) => {
    await fetchUser();
    if (
      typeof user.onboardCompleted !== 'undefined' &&
      !user.onboardCompleted
    ) {
      try {
        const response = await ApiService.setStudentOnboardStatus(
          status,
          userId
        );
      } catch (error) {
        // console.log(error);
      }
    } else {
      return;
    }
  };

  const [items, setItems] = React.useState<
    Array<{
      title: string;
      content: any;
      image: any;
      read: boolean;
      id: number;
    }>
  >(defaultItems);

  const WelcomeDialogContent = ({ title, content, image, onClickContinue }) => (
    <Dialog.Content
      // onOpenAutoFocus={(event) => {
      //   event.preventDefault();
      // }}
      className="bg-white px-4 py-5 min-h-[50vh]  max-h-[80vh] overflow-scroll rounded-b-3xl rounded-r-3xl relative"
    >
      <Flex justifyContent={'center'} alignItems="center">
        <Dialog.Title className="whitespace-nowrap -mt-4 !text-xl">
          {title}
        </Dialog.Title>
        <Spacer />
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              variant="ghost"
              color="lightgrey"
              onClick={async () => {
                await setStudentOnboardStatus(true, user._id);
              }}
            >
              <MdCancel />
            </Button>
          </PopoverTrigger>
          <PopoverContent w="480px" bg={'#f0f0f0'} border="1px solid grey">
            <PopoverArrow />
            <PopoverBody p={4}>
              <Flex direction="column" gap={3}>
                <Text fontWeight="bold" fontSize="xl">
                  Are you sure?
                </Text>
                <Text fontSize="xl">
                  We’d really love to show you what we’ve built
                </Text>
                <HStack spacing={3} fontSize="md">
                  <Button
                    variant={'outline'}
                    borderColor="red"
                    color="red"
                    onClick={async () => {
                      await setStudentOnboardStatus(true, user._id);
                      setToggleOnboardModal(false);
                      setItems(defaultItems);
                      setCurrentIdx(1);
                      localStorage.setItem('completed', 'true');
                      setOpen(false);
                    }}
                  >
                    Let me explore myself
                  </Button>
                  <Button
                    onClick={async () => {
                      await setStudentOnboardStatus(true, user._id);
                      setToggleOnboardModal(false);
                      setTogglePlansModal(true);
                    }}
                  >
                    Already convinced, sign me up
                  </Button>
                </HStack>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <div className="overflow-y-auto max-h-[60vh] custom-scroll">
        {' '}
        {content.length > 0 && (
          <div
            className="text-lg my-3"
            dangerouslySetInnerHTML={{ __html: content[0] }}
          />
        )}
        {image.length > 0 && (
          <>
            {currentIdx !== 1 && currentIdx !== 7 && (
              <p className="font-semibold">See how it works</p>
            )}
            <img
              src={image[0]}
              alt={'onboard'}
              loading="eager"
              className="h-80 my-3 w-full border-solid border-2 border-blue-100 p-1 rounded-lg "
            />
          </>
        )}
        {content.length > 1 && (
          <div
            className="text-lg my-3"
            dangerouslySetInnerHTML={{ __html: content[1] }}
          />
        )}
        {image.length > 1 && (
          <img
            src={image[1]}
            alt={'onboard'}
            loading="eager"
            className="h-80 my-3 w-full"
          />
        )}
      </div>

      <div className="flex gap-3 items-center justify-end mt-4">
        {currentIdx !== 7 && (
          <Button
            onClick={onClickContinue}
            variant="outline"
            autoFocus={false}
            className="px-8 py-3 border border-input bg-transparent shadow-sm text-black h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Continue
          </Button>
        )}

        <Button
          onClick={async () => {
            await setStudentOnboardStatus(true, user._id);
            setToggleOnboardModal(false);
            setTogglePlansModal(true);
          }}
        >
          Subscribe
        </Button>
      </div>
    </Dialog.Content>
  );

  const handleContinue = (nextIdx) => {
    const updatedItems = items.map((item) =>
      item.id === nextIdx ? { ...item, read: true } : item
    );
    setItems(updatedItems);
    setCurrentIdx(nextIdx);
  };

  const render = React.useMemo(() => {
    const item = items.find((i) => i.id === currentIdx);

    if (!item) return null;

    return (
      <WelcomeDialogContent
        title={item.title}
        content={item.content}
        image={item.image}
        onClickContinue={() => handleContinue(currentIdx + 1)}
      />
    );
  }, [currentIdx, items]);

  return (
    <>
      <PlansModal
        message={
          user && !user.hadSubscription
            ? 'Subscribe to unlock your AI Study Tools! 🚀'
            : 'Pick a plan to access your AI Study Tools! 🚀'
        }
        subMessage="One-click Cancel at anytime."
        togglePlansModal={togglePlansModal}
        setTogglePlansModal={setTogglePlansModal}
      />
      <Dialog.Root open={toggleOnboardModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <Flex
            className=" border-none max-w-5xl overflow-scroll max-h-[90vh] no-scrollbar"
            position="fixed"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            zIndex="50"
            w="full"
            bg="transparent"
            justifyContent="center"
            overflowY="scroll"
          >
            <div className="model flex w-full max-w-6xl mx-auto">
              {' '}
              <Box
                className={
                  'left bg-white rounded-tl-2xl rounded-bl-2xl hidden md:flex  items-center gap-3 self-start'
                }
              >
                <Box
                  px="4"
                  py="6"
                  position={'relative'}
                  // rounded="lg"
                  borderRadius={'25px 0px 0px 25px'}
                  h="80"
                  border="none"
                  // zIndex="50"
                  bgGradient="linear(to-br, #eee3ff, #ebf2fe, #fbfcff, white,white)"
                  // className="inverted-border-radius"
                >
                  <LinedListWelcome
                    items={items}
                    clickHandler={(id) => {
                      const updatedItems = items.map((item) =>
                        item.id === id ? { ...item, read: true } : item
                      );
                      setItems(updatedItems);
                      setCurrentIdx(id);
                    }}
                  />
                </Box>
              </Box>
              <Box width={'750px'}> {render}</Box>
            </div>
          </Flex>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
