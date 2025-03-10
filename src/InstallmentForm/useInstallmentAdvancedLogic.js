const useInstallmentAdvancedLogic = (installments, setInstallments) => {
  const mergeInstallments = () => {
    const selected = installments.filter((inst) => inst.checked);
    if (selected.length < 2) return;

    const sortedSelected = selected.sort(
      (a, b) => Number(a.insNumber) - Number(b.insNumber)
    );
    const firstSelectedId = sortedSelected[0].id;

    const mergedAmount = sortedSelected
      .reduce((sum, inst) => sum + parseFloat(inst.amount), 0)
      .toFixed(2);
    const mergedDueDate = sortedSelected[0].dueDate;

    const newInstallments = installments.map((inst) => {
      if (sortedSelected.some((sel) => sel.insNumber === inst.insNumber)) {
        return { ...inst, show: false, checked: false };
      }
      return inst;
    });

    const mergedInstallment = {
      id: firstSelectedId,
      insNumber: `merged-${sortedSelected
        .map((inst) => inst.insNumber)
        .join("+")}`,
      checked: false,
      amount: mergedAmount,
      dueDate: mergedDueDate,
      show: true,
      isMerged: true,
    };

    const insertPosition = newInstallments.findIndex(
      (inst) => inst.id === firstSelectedId
    );

    newInstallments.splice(insertPosition, 0, mergedInstallment);

    setInstallments(newInstallments);
    console.log("After Merge:", newInstallments);
  };

  const splitInstallment = () => {
    const selected = installments.find((inst) => inst.checked);
    if (!selected) return;

    const splitAmount = (parseFloat(selected.amount) / 2).toFixed(2);
    const splitDueDate = selected.dueDate;

    const newInstallments = installments.map((inst) => {
      if (inst.insNumber === selected.insNumber) {
        return { ...inst, show: false };
      }
      return inst;
    });

    const insertPosition = newInstallments.findIndex(
      (inst) => inst.insNumber === selected.insNumber
    );

    const newId1 = Date.now() + Math.floor(Math.random() * 1000);
    const newId2 = Date.now() + Math.floor(Math.random() * 1000) + 1;

    const splitInstallments = [
      {
        id: newId1,
        insNumber: `${selected.insNumber}.1`,
        checked: false,
        amount: splitAmount,
        dueDate: splitDueDate,
        show: true,
        isSplited: true,
      },
      {
        id: newId2,
        insNumber: `${selected.insNumber}.2`,
        checked: false,
        amount: splitAmount,
        dueDate: splitDueDate,
        show: true,
        isSplited: true,
      },
    ];

    newInstallments.splice(insertPosition, 0, ...splitInstallments);

    setInstallments(newInstallments);
    console.log("After Split:", newInstallments);
  };

  const handleUndo = (installment) => {
    let newInstallments = [];

    if (installment.isMerged) {
      const originalNumbers = installment.insNumber
        .split("+")
        .map((num) => num.replace("merged-", ""));
      newInstallments = installments
        .map((inst) =>
          originalNumbers.includes(inst.insNumber)
            ? { ...inst, show: true, checked: false }
            : inst.insNumber === installment.insNumber
            ? null
            : inst
        )
        .filter(Boolean);
    } else if (installment.isSplited) {
      const originalNumber = installment.insNumber.split(".")[0];
      newInstallments = installments.map((inst) => {
        if (inst.insNumber === originalNumber) {
          return { ...inst, show: true, checked: false };
        } else if (inst.insNumber.startsWith(`${originalNumber}.`)) {
          return { ...inst, show: false };
        }
        return inst;
      });

      const originalInstallment = newInstallments.find(
        (inst) => inst.insNumber === originalNumber
      );
    } else {
      newInstallments = [...installments];
    }

    setInstallments(newInstallments);
    console.log("After Undo:", newInstallments);
  };

  return {
    mergeInstallments,
    splitInstallment,
    handleUndo,
  };
};

export default useInstallmentAdvancedLogic;
