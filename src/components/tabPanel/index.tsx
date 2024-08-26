import {
  Button,
  Flex,
  Checkbox,
  useMultiStyleConfig,
  useTab
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Ref, forwardRef } from 'react';

interface CustomTabProps {
  children: any;
  isChecked?: boolean;
  onCheck?: (isChecked: boolean) => void;
}

const CustomTabPanel = forwardRef(
  (props: CustomTabProps, ref: Ref<HTMLButtonElement>) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = Boolean(tabProps['aria-selected']);

    const styles = useMultiStyleConfig('Tabs', tabProps);

    const slideInVariants = {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    };

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Flex justifyContent={'center'} alignItems="center">
          <motion.div
            style={{ display: 'flex' }}
            initial="hidden"
            animate={isSelected ? 'visible' : 'hidden'}
            variants={slideInVariants}
          ></motion.div>
          {tabProps.children}
        </Flex>
      </Button>
    );
  }
);

export default CustomTabPanel;
