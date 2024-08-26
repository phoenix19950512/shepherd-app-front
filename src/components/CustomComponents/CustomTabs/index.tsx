import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface ICustomTabs {
  tablists: any[];
  tabPanel: any[];
  refreshFunction?: () => void;
  isSideComponent?: boolean;
}

const CustomTabs = ({ tablists, tabPanel, isSideComponent }: ICustomTabs) => {
  return (
    <Tabs position="relative" variant="unstyled" isLazy>
      <TabList
        _focus={{ outline: 'none' }}
        borderBottom={!isSideComponent ? '1px solid #EBECF0' : ''}
        background={isSideComponent ? '#F8F9FD' : ''}
        borderRadius={isSideComponent ? '8px' : ''}
        padding="4px"
      >
        {tablists?.map((tabList: any) => (
          <Tab
            fontSize={isSideComponent ? '0.75rem' : '1rem'}
            color={isSideComponent ? '#585F68' : ''}
            width={isSideComponent ? '100%' : ''}
            gap="4px"
            _selected={{
              color: isSideComponent ? '#585F68' : '#207DF7',
              fontSize: isSideComponent ? '0.75rem' : '1rem',
              background: isSideComponent ? '#FFF' : '',
              width: isSideComponent ? '100%' : '',
              borderRadius: isSideComponent ? '6px' : '',
              boxShadow: isSideComponent ? '-1px 5px 11px 0px #2E303814' : ''
            }}
            key={tabList?.id}
          >
            {tabList?.icon}
            {tabList?.title}
          </Tab>
        ))}
      </TabList>
      {!isSideComponent && (
        <TabIndicator height="5px" bg="#207DF7" borderRadius="10px" left="0" />
      )}
      <TabPanels>
        {tabPanel?.map((tabPanel: any) => (
          <TabPanel padding={'0'} key={tabPanel?.id}>
            {tabPanel.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTabs;
