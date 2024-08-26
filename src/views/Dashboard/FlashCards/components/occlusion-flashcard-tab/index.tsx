import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import ApiService from '../../../../../services/ApiService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../../components/ui/table';
import StudySession from '../../forms/flashcard_setup/manual-occlusion-2/_components/study-session';
import OccResultsDialog from '../../forms/flashcard_setup/manual-occlusion-2/_components/study-session/_components/occlusion-result-dialog';

import { Button } from '../../../../../components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../../../../components/ui/pagination';
import { Input } from '../../../../../components/ui/input';
import { TrackNextIcon } from '@radix-ui/react-icons';
import DataRow from './_components/row';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../components/ui/dropdown-menu';
import { ArrowUpDownIcon } from '@chakra-ui/icons';
import { cn } from '../../../../../library/utils';
import { Checkbox } from '../../../../../components/ui/checkbox';

const LoadingRow = () => (
  <TableRow>
    {[...Array(7)].map((_, index) => (
      <TableCell key={index}>
        <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
      </TableCell>
    ))}
  </TableRow>
);

const initialState = {
  open: false,
  id: '',
  score: {
    right: 0,
    wrong: 0,
    notRemembered: 0
  },
  quizOver: false,
  showResults: false
};

const SortOptions = {
  DECKNAME: 'Deckname',
  CREATED_AT: 'Created At',
  LAST_ATTEMPT: 'Last Attempted'
};

function extractUniqueTags(dataList) {
  if (!dataList || !Array.isArray(dataList)) {
    // If dataList is undefined, null, or not an array, return an empty array
    return [];
  }

  const allTags = dataList.reduce((acc, obj) => {
    if (obj && Array.isArray(obj.tags)) {
      acc = [...new Set([...acc, ...obj.tags])];
    }
    return acc;
  }, []);

  return allTags.sort((a, b) => a - b); // Optional: return sorted tags
}

const OcclusionFlashcardTab = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState(initialState);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 20
  });
  const [paginationUserInput, setPaginationUserInput] = useState(
    pagination.page
  );
  const [filterBy, setFilterBy] = useState('');
  const [checkedRows, setCheckedRows] = useState([]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['image-occlusions', pagination.page, pagination.limit],
    queryFn: () =>
      ApiService.fetchOcclusionCards(pagination.page, pagination.limit).then(
        (res) => res.json()
      ),
    select: (data) => {
      if (data.message === 'Successfully retrieved occlusion cards') {
        return {
          list: data.data,
          meta: data.meta
        };
      } else {
        return {
          list: [],
          meta: {}
        };
      }
    },
    refetchOnWindowFocus: false
  });
  const [sortOption, setSortOption] = useState(SortOptions.CREATED_AT); // The selected sort option
  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      switch (sortOption) {
        case SortOptions.DECKNAME:
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case SortOptions.CREATED_AT:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case SortOptions.LAST_ATTEMPT:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      for (let i = 0; i < 5; i++) {
        const pageIndex = pagination.page + i;
        const queryKey = ['image-occlusions', pageIndex, pagination.limit];

        // Only prefetch if the data for this page is not already in the cache
        if (!queryClient.getQueryData(queryKey)) {
          queryClient.prefetchQuery({
            queryKey,
            queryFn: () =>
              ApiService.fetchOcclusionCards(pageIndex, pagination.limit).then(
                (res) => res.json()
              )
          });
        }
      }
    }
  }, [isSuccess, pagination.page, pagination.limit, queryClient]);

  const handleOpen = useCallback((id: string) => {
    setState((pS) => ({
      ...pS,
      open: true,
      id
    }));
  }, []);

  const handleClose = useCallback(() => {
    setState((pS) => ({
      ...pS,
      open: false
    }));
  }, []);

  const setQuizOver = useCallback((input: boolean) => {
    setState((pS) => ({
      ...pS,
      quizOver: input
    }));
  }, []);

  const showResults = useCallback((input: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showResults: input
    }));
  }, []);

  const setScore = useCallback((score) => {
    setState((prevState) => ({
      ...prevState,
      score
    }));
  }, []);

  const handleRestart = useCallback(() => {
    setState((pS) => ({
      ...pS,
      open: true,
      score: {
        notRemembered: 0,
        right: 0,
        wrong: 0
      },
      showResults: false,
      quizOver: false
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(initialState);
  }, []);

  function handleCloseResults() {
    setState((pS) => {
      return {
        ...pS,
        quizOver: false,
        showResults: false,
        score: {
          notRemembered: 0,
          right: 0,
          wrong: 0
        }
      };
    });
  }

  const handlePreviousClick = () => {
    if (pagination.page > 1) {
      setPagination((pS) => ({
        ...pS,
        page: pS.page - 1
      }));
      setPaginationUserInput(pagination.page - 1);
    }
  };

  const handleNextClick = () => {
    setPagination((pS) => ({
      ...pS,
      page: pS.page + 1
    }));
    setPaginationUserInput(pagination.page + 1);
  };

  // const renderPaginationItems = () => {
  //   const totalVisibleItems = window.innerWidth <= 768 ? 3 : pagination.limit; // Adjust based on screen width
  //   const halfVisibleItems = Math.floor(totalVisibleItems / 2);

  //   let start = pagination.page - halfVisibleItems;
  //   start = Math.max(start, 1); // Ensure the start is at least 1

  //   const end = start + totalVisibleItems;
  //   const items = [];

  //   for (let i = start; i < end; i++) {
  //     if (i > pagination.totalPage) break;

  //     items.push(
  //       <PaginationItem
  //         key={i}
  //         onClick={() => {
  //           setPagination((pS) => ({ ...pS, page: i }));
  //           setPaginationUserInput(i);
  //         }}
  //       >
  //         <PaginationLink href="#" isActive={i === pagination.page}>
  //           {i}
  //         </PaginationLink>
  //       </PaginationItem>
  //     );
  //   }

  //   return items;
  // };

  const renderPaginationItems = () => {
    const totalVisibleItems = windowWidth <= 768 ? 3 : pagination.limit; // Adjust based on screen width
    const halfVisibleItems = Math.floor(totalVisibleItems / 2);

    let start = pagination.page - halfVisibleItems;
    start = Math.max(start, 1); // Ensure the start is at least 1

    const end = start + totalVisibleItems;
    const items = [];

    for (let i = start; i < end; i++) {
      if (i > pagination?.limit) break; // Assuming totalPages is the maximum number of pages

      items.push(
        <PaginationItem
          key={i}
          onClick={() => {
            setPagination((pS) => ({ ...pS, page: i }));
            setPaginationUserInput(i);
          }}
        >
          <PaginationLink href="#" isActive={i === pagination.page}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const uniqueTags = extractUniqueTags(data ? data.list : undefined);

  return (
    <div className="w-full h-full pt-4">
      <div className="filter-section md:flex block justify-between px-4 gap-4">
        <div
          className={cn('md:flex block gap-4 items-center transition-opacity', {
            'opacity-0': !checkedRows.length,
            'pointer-events-none': !checkedRows.length
          })}
        >
          <Button className="bg-red-500">Delete Selected</Button>
          <Button>Add Tags</Button>
        </div>
        <div className="flex md:justify-end justify-center mb-[25px] md:mb-0 gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-white" variant="outline">
                Sort By
                <ArrowUpDownIcon className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {Object.values(SortOptions).map((item) => (
                <DropdownMenuItem
                  key={item}
                  className={cn('hover:bg-gray-100', {
                    'bg-gray-200': filterBy === item
                  })}
                  onClick={() => {
                    setSortOption(item);
                  }}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-white" variant="outline">
                {filterBy ? filterBy : 'Filter By Tag'}{' '}
                <ArrowUpDownIcon className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem
                className={cn('hover:bg-gray-100', {
                  'bg-gray-200': filterBy === ''
                })}
                onClick={() => {
                  setFilterBy('');
                }}
              >
                None
              </DropdownMenuItem>
              {uniqueTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  className={cn('hover:bg-gray-100', {
                    'bg-gray-200': filterBy === tag
                  })}
                  onClick={() => {
                    setFilterBy(tag);
                  }}
                >
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <div className="md:block hidden"> */}
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[50px] pl-5">
              <Checkbox
                checked={
                  data?.list?.length === checkedRows.length &&
                  data?.list?.length !== 0
                }
                onCheckedChange={(value) => {
                  if (value) {
                    setCheckedRows(data?.list?.map((row) => row._id));
                  } else {
                    setCheckedRows([]);
                  }
                }}
              />
            </TableHead> */}
            <TableHead className="w-[200px] text-center">Deckname</TableHead>
            <TableHead className="text-center">No. of Rectangles</TableHead>
            <TableHead className="text-center">Tags</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Last attempted</TableHead>
            <TableHead className="text-center">Last attempted score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [...Array(7)].map((_, index) => <LoadingRow key={index} />)
            : getSortedData(data?.list)
                .filter((row) => (filterBy ? row.tags.includes(filterBy) : row))
                .map((row) => (
                  <DataRow
                    checked={checkedRows.includes(row._id) ? true : false}
                    handleCheck={(value) => {
                      if (value) {
                        setCheckedRows((pS) => [...pS, row._id]);
                      } else {
                        setCheckedRows((pS) => {
                          return pS.filter((r) => r !== row._id);
                        });
                      }
                    }}
                    key={row._id}
                    row={row}
                    handleOpen={handleOpen}
                    page={pagination.page}
                    limit={pagination.limit}
                  />
                ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="hidden md:flex gap-2 border rounded p-1">
              <Input
                min={1}
                type="number"
                value={paginationUserInput === 0 ? 1 : paginationUserInput}
                className="max-w-12"
                onChange={(e) =>
                  setPaginationUserInput(
                    parseInt(e.target.value) === 0
                      ? 1
                      : parseInt(e.target.value)
                  )
                }
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setPagination((pS) => ({
                    ...pS,
                    page: paginationUserInput
                  }))
                }
              >
                <TrackNextIcon className="w-4 h-4" />
              </Button>
            </PaginationItem>
            <PaginationItem className="ml-25 mr-25">
              <PaginationPrevious
                href="#"
                onClick={handlePreviousClick}
                className={
                  pagination.page === 1
                    ? 'pointer-events-none text-stone-500'
                    : ''
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationNext href="#" onClick={handleNextClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <StudySession
        id={state.id}
        open={state.open}
        close={handleClose}
        quizOver={state.quizOver}
        setQuizOver={setQuizOver}
        score={state.score}
        setOpenResults={showResults}
        setScore={setScore}
        resetForm={handleReset}
      />
      <OccResultsDialog
        id={state.id}
        open={state.showResults}
        score={state.score}
        close={handleCloseResults}
        restartStudySession={handleRestart}
        handleEditImage={() => null}
        editImageDisabled={true}
      />
    </div>
  );
};

export default OcclusionFlashcardTab;
