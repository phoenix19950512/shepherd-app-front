import React, { useState, useEffect } from 'react';
import ApiService from '../../../../services/ApiService';

const useStoreConversationIdToStudyPlan = (
  studyPlanId: string,
  topicId: string,
  conversationId: string,
  testDate: any
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Better to specify the type of error state

  useEffect(() => {
    const storeConversation = async () => {
      try {
        setLoading(true);
        await ApiService.storeConversationIdToStudyPlan({
          studyPlanId,
          metadata: { topicId, conversationId, testDate }
        });
        setLoading(false);
      } catch (error) {
        setError('An error occurred while storing conversation ID.'); // Handle error appropriately
        setLoading(false);
      }
    };

    if (conversationId) {
      storeConversation();
    }
  }, [studyPlanId, topicId, conversationId, testDate]); // Ensure all dependencies are included

  return { loading, error };
};

export default useStoreConversationIdToStudyPlan;
