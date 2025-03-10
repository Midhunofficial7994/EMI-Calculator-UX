import { useState } from "react";

const useInstallmentLogic = () => {
  const [recommendedAmount, setRecommendedAmount] = useState(10000);
  const [installmentCount, setInstallmentCount] = useState(11);
  const [installments, setInstallments] = useState([]);

  const updateInstallments = (newTotal, newCount) => {
    if (newTotal > 0 && newCount > 0) {
      const newInstallments = Array.from({ length: newCount }, (_, index) => ({
        id: index + 1,
        insNumber: String(index + 1),
        checked: false,
        amount: (newTotal / newCount).toFixed(2),
        dueDate: "",
        show: true,
        isMerged: false,
        isSplited: false,
      }));
      setInstallments(newInstallments);
    } else {
      setInstallments([]);
    }
  };

  const handleRecommendedAmountChange = (value) => {
    setRecommendedAmount(value);
    updateInstallments(value, installmentCount);
  };

  const handleInstallmentCountChange = (value) => {
    setInstallmentCount(value);
    updateInstallments(recommendedAmount, value);
  };

  const toggleInstallmentSelection = (insNumber) => {
    setInstallments((prevInstallments) =>
      prevInstallments.map((installment) =>
        installment.insNumber === insNumber
          ? { ...installment, checked: !installment.checked }
          : installment
      )
    );
  };

  const updateDueDate = (insNumber, date) => {
    setInstallments((prevInstallments) => {
      const updatedInstallments = prevInstallments.map((installment) => {
        if (installment.insNumber === insNumber && installment.show) {
          return { ...installment, dueDate: date };
        }
        return installment;
      });

      if (insNumber === "1" && date) {
        const firstDate = new Date(date);
        for (let i = 1; i < updatedInstallments.length; i++) {
          const currentInstallment = updatedInstallments[i];
          if (currentInstallment.show) {
            const newDate = new Date(firstDate);
            newDate.setMonth(newDate.getMonth() + i);
            updatedInstallments[i] = {
              ...currentInstallment,
              dueDate: `${newDate.getFullYear()}-${String(
                newDate.getMonth() + 1
              ).padStart(2, "0")}-${String(newDate.getDate()).padStart(
                2,
                "0"
              )}`,
            };
          }
        }
      }

      return updatedInstallments;
    });
  };

  return {
    recommendedAmount,
    handleRecommendedAmountChange,
    installmentCount,
    handleInstallmentCountChange,
    installments,
    setInstallments, // Include setInstallments in the returned object
    toggleInstallmentSelection,
    updateDueDate,
  };
};

export default useInstallmentLogic;
