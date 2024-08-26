import { useCustomToast as useToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../../services/ApiService';
import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';

interface IMnemonic {
  prompt: string;
  answer: string;
  explanation: string;
}

interface IMnemonicSetupContextProps {
  mnemonics: IMnemonic[];
  isLoading: boolean;
  setMnemonics: Dispatch<SetStateAction<IMnemonic[]>>;
  addMnemonic: (mnemonic: IMnemonic) => void;
  updateMnemonic: (index: number, updatedMnemonic: IMnemonic) => void;
  deleteMnemonic: (index: number) => void;
  generateMneomics: () => void;
  saveMneomics: () => Promise<void>;
}

const MnemonicSetupContext = createContext<
  IMnemonicSetupContextProps | undefined
>(undefined);

export const useMnemonicSetupState = () => {
  const context = useContext(MnemonicSetupContext);
  if (!context) {
    throw new Error(
      'useMnemonicSetupState must be used within a MnemonicSetupProvider'
    );
  }
  return context;
};

const formatPairing = (pairings: { [key: string]: any }) => {
  const pairingText = Object.entries(pairings)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
  return pairingText;
};

const MnemonicSetupProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [mnemonics, setMnemonics] = useState<IMnemonic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const addMnemonic = (mnemonic: IMnemonic) => {
    setMnemonics([...mnemonics, mnemonic]);
  };

  const generateMneomics = async () => {
    const mnemonicsToUpdate = mnemonics
      .filter((m) => !m.answer)
      .map((mnemonic) => {
        const index = mnemonics.findIndex((m) => m.prompt === mnemonic.prompt);
        return { prompt: mnemonic.prompt, index };
      });

    const errorBatch: number[] = [];

    for (let i = 0; i < mnemonicsToUpdate.length; i++) {
      setIsLoading(true);
      const mnemonic = mnemonicsToUpdate[i];
      const { index } = mnemonic;
      try {
        const response = await ApiService.generateMneomics(mnemonic.prompt);
        const data = await response.json();

        if (data.status === '200') {
          setMnemonics((prev) => {
            const updatedMnemonics = [...prev];
            updatedMnemonics[index] = {
              ...updatedMnemonics[index],
              explanation: data?.explainer?.context,
              answer: data?.explainer.answer
            };
            return updatedMnemonics;
          });
        } else {
          errorBatch.push(index + 1);
        }
      } catch (error) {
        toast({
          title: 'Failed to create Mneomic',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }

      if (errorBatch.length) {
        toast({
          title: `Failed to create Mneomic for prompt(s) ${errorBatch.join(
            ','
          )}`,
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    }
  };

  const saveMneomics = async () => {
    try {
      setIsLoading(true);
      const submitableMnomonics = mnemonics.filter(
        (m) => m.answer && m.explanation
      );
      const response = await ApiService.createMneomics(submitableMnomonics);
      if (response.ok) {
        toast({
          title: `Mneomics Saved`,
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: `Failed to failed to save Mneomic`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMnemonic = (index: number, updatedMnemonic: IMnemonic) => {
    setMnemonics(
      mnemonics.map((mnemonic, i) => (i === index ? updatedMnemonic : mnemonic))
    );
  };

  const deleteMnemonic = (index: number) => {
    setMnemonics(mnemonics.filter((_, i) => i !== index));
  };

  return (
    <MnemonicSetupContext.Provider
      value={{
        mnemonics,
        isLoading,
        setMnemonics,
        addMnemonic,
        updateMnemonic,
        deleteMnemonic,
        generateMneomics,
        saveMneomics
      }}
    >
      {children}
    </MnemonicSetupContext.Provider>
  );
};

export default MnemonicSetupProvider;
