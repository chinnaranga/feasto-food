import { useState, useCallback } from 'react';

export const useComponentExamples = () => {
  const [variantIndex, setVariantIndex] = useState<Record<string, number>>({});

  const getActiveIndex = useCallback((componentId: string) => {
    return variantIndex[componentId] || 0;
  }, [variantIndex]);

  const selectVariant = useCallback((componentId: string, index: number) => {
    setVariantIndex((prev) => ({
      ...prev,
      [componentId]: index,
    }));
  }, []);

  return {
    getActiveIndex,
    selectVariant,
  };
};
export default useComponentExamples;
