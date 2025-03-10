import { useState, useEffect } from "react";

const useInstallmentLogic = () => {
  const [recommendedAmount, setRecommendedAmount] = useState(20000);
  const [installmentCount, setInstallmentCount] = useState(4);
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [dueDates, setDueDates] = useState({});
  const [mergedInstallments, setMergedInstallments] = useState({});
  const [splitInstallments, setSplitInstallments] = useState({});

  const installmentAmount = recommendedAmount / installmentCount;

  useEffect(() => {
    const newDueDates = {};
    for (let i = 1; i <= installmentCount; i++) {
      newDueDates[i] = "";
    }
    setDueDates(newDueDates);
  }, [installmentCount]);

  const handleInstallmentSelect = (installNo) => {
    setSelectedInstallments((prev) =>
      prev.includes(installNo)
        ? prev.filter((num) => num !== installNo)
        : [...prev, installNo]
    );
  };

  const handleDueDateChange = (installmentId, date) => {
    setDueDates((prev) => {
      const newDueDates = { ...prev };
      newDueDates[installmentId] = date;

      if (typeof installmentId === "number") {
        const currentInstallment = installmentId;
        const baseDate = new Date(date);

        for (let i = currentInstallment + 1; i <= installmentCount; i++) {
          const monthsToAdd = i - currentInstallment;
          const newDate = new Date(baseDate);
          newDate.setMonth(newDate.getMonth() + monthsToAdd);

          const year = newDate.getFullYear();
          const month = String(newDate.getMonth() + 1).padStart(2, "0");
          const day = String(newDate.getDate()).padStart(2, "0");
          const newDateStr = `${year}-${month}-${day}`;

          newDueDates[i] = newDateStr;
        }
      }

      return newDueDates;
    });
  };

  const handleMerge = () => {
    if (selectedInstallments.length < 2) return;

    const sortedSelection = [...selectedInstallments].sort((a, b) => a - b);
    const firstDueDate = dueDates[sortedSelection[0]];

    const mergedItem = {
      amount: sortedSelection.length * installmentAmount,
      dueDate: firstDueDate,
      included: sortedSelection,
      originalDueDates: sortedSelection.map((installNo) => dueDates[installNo]),
    };

    const updatedDueDates = { ...dueDates };
    sortedSelection.forEach((installNo, index) => {
      if (index === 0) {
        updatedDueDates[installNo] = mergedItem.dueDate;
      } else {
        delete updatedDueDates[installNo];
      }
    });

    setMergedInstallments((prev) => ({
      ...prev,
      [sortedSelection[0]]: mergedItem,
    }));

    setDueDates(updatedDueDates);
    setSelectedInstallments([]);
  };

  const handleSplit = () => {
    const selected = selectedInstallments[0];
    if (!selected || selectedInstallments.length !== 1) return;
    if (splitInstallments[selected] || mergedInstallments[selected]) return;

    const halfAmount = (installmentAmount / 2).toFixed(2);
    const splitId1 = `${selected}.1`;
    const splitId2 = `${selected}.2`;

    setSplitInstallments((prev) => ({
      ...prev,
      [selected]: [
        { id: splitId1, amount: halfAmount },
        { id: splitId2, amount: halfAmount }
      ]
    }));

    setDueDates((prev) => {
      const newDueDates = { ...prev };
      const originalDueDate = newDueDates[selected];
      delete newDueDates[selected];
      newDueDates[splitId1] = originalDueDate;
      newDueDates[splitId2] = originalDueDate;
      return newDueDates;
    });

    setSelectedInstallments([]);
  };

  const handleUndoMerge = (installNo) => {
    const merge = mergedInstallments[installNo];
    if (!merge) return;

    const updatedDueDates = { ...dueDates };
    merge.included.forEach((num, index) => {
      updatedDueDates[num] = merge.originalDueDates[index];
    });

    const newMergedInstallments = { ...mergedInstallments };
    delete newMergedInstallments[installNo];

    setMergedInstallments(newMergedInstallments);
    setDueDates(updatedDueDates);
  };

  const handleUndoSplit = (installNo) => {
    const splits = splitInstallments[installNo];
    if (!splits) return;

    const splitId1 = splits[0].id;
    const originalDueDate = dueDates[splitId1];

    setDueDates((prev) => {
      const newDueDates = { ...prev };
      newDueDates[installNo] = originalDueDate;
      delete newDueDates[splitId1];
      delete newDueDates[splits[1].id];
      return newDueDates;
    });

    setSplitInstallments((prev) => {
      const newSplitInstallments = { ...prev };
      delete newSplitInstallments[installNo];
      return newSplitInstallments;
    });
  };

  const handleMergedDueDateChange = (installNo, date) => {
    const mergedItem = mergedInstallments[installNo];
    if (!mergedItem) return;

    const updatedMergedInstallments = { ...mergedInstallments };
    updatedMergedInstallments[installNo].dueDate = date;

    const newDueDates = { ...dueDates };
    newDueDates[installNo] = date;

    const baseDate = new Date(date);
    for (let i = installNo + 1; i <= installmentCount; i++) {
      const monthsToAdd = i - installNo;
      const newDate = new Date(baseDate);
      newDate.setMonth(newDate.getMonth() + monthsToAdd);

      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      const newDateStr = `${year}-${month}-${day}`;

      newDueDates[i] = newDateStr;
    }

    setMergedInstallments(updatedMergedInstallments);
    setDueDates(newDueDates);
  };

  return {
    recommendedAmount,
    setRecommendedAmount,
    installmentCount,
    setInstallmentCount,
    selectedInstallments,
    setSelectedInstallments,
    dueDates,
    setDueDates,
    mergedInstallments,
    setMergedInstallments,
    splitInstallments,
    setSplitInstallments,
    installmentAmount,
    handleInstallmentSelect,
    handleDueDateChange,
    handleMerge,
    handleSplit,
    handleUndoMerge,
    handleUndoSplit,
    handleMergedDueDateChange,
  };
};

export default useInstallmentLogic;