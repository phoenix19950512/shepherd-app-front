import CopyIcn from '../../../assets/copy.svg?react';
import DeleteIcn from '../../../assets/deleteIcn.svg?react';
import EditIcn from '../../../assets/editIcn.svg?react';
import GenerateIcn from '../../../assets/generateIcn.svg?react';
import SummaryIcn from '../../../assets/summaryIcn1.svg?react';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import { copierHandler } from '../../../helpers';
import ShepherdSpinner from '../components/shepherd-spinner';
import {
  DefaultSummaryContainer,
  EmptyStateContainer,
  IconContainer,
  PageCount,
  SummaryContainer2
} from './styles';
import { Box } from '@chakra-ui/react';
// import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useState, useCallback } from 'react';

const Summary = ({
  handleSummary,
  summaryLoading,
  summaryTexts,
  setSummaryText,
  handleDeleteSummary,
  handleUpdateSummary,
  loading,
  isUpdatedSummary
}: {
  handleSummary: () => void;
  summaryLoading?: boolean;
  summaryTexts?: string | undefined;
  setSummaryText?: any;
  handleDeleteSummary?: () => void;
  handleUpdateSummary?: () => void;
  loading?: boolean;
  isUpdatedSummary?: boolean;
}) => {
  const [isEdit, setEdit] = useState(true);
  const [copiedView, setCopiedView] = useState(false);

  const onEditToggle = useCallback(() => {
    setEdit((prevState) => !prevState);
  }, [setEdit]);

  React.useEffect(() => {
    if (isUpdatedSummary) {
      onEditToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatedSummary]);

  return (
    <section>
      {!!summaryTexts?.length && (
        <>
          <PageCount>
            {/* <ChevronLeftIcon />
            {`Page ${1}`}
            <ChevronRightIcon /> */}
          </PageCount>
          <IconContainer>
            {copiedView ? (
              <p style={{ fontSize: '.75rem', color: 'rgb(88, 95, 104)' }}>
                {'Copied!'}
              </p>
            ) : (
              <CopyIcn
                onClick={() => copierHandler(summaryTexts, setCopiedView)}
              />
            )}

            {!isEdit ? (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#FB8441',
                  cursor: 'pointer'
                }}
                onClick={handleUpdateSummary}
              >
                Save
              </p>
            ) : (
              <EditIcn onClick={onEditToggle} />
            )}
            <DeleteIcn onClick={handleDeleteSummary} />
          </IconContainer>
          {loading && (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
              }}
            >
              <ShepherdSpinner />
            </Box>
          )}
          {!loading && (
            <>
              {!isEdit ? (
                <SummaryContainer2
                  value={summaryTexts?.replace(/null/g, '')}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  onChange={(event) => setSummaryText(event.target.value!)}
                ></SummaryContainer2>
              ) : (
                <DefaultSummaryContainer>
                  <CustomMarkdownView source={summaryTexts} />
                </DefaultSummaryContainer>
              )}
            </>
          )}
        </>
      )}

      {!summaryTexts?.length && (
        <EmptyStateContainer>
          <div>
            <SummaryIcn />
            {/* <p>You’re yet to request for a summary</p> */}
          </div>
          <div>
            <CustomButton
              onClick={handleSummary}
              isPrimary
              type="button"
              title={
                summaryLoading ? 'Generating Summary...' : 'Generate Summary'
              }
              icon={<GenerateIcn />}
            />
          </div>
        </EmptyStateContainer>
      )}
    </section>
  );
};

export default Summary;
