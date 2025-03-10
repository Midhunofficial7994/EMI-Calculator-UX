import { useState } from "react";

const useUpdate = (initialTotal, initialCount) => {
  const [total, setTotal] = useState(initialTotal);
  const [count, setCount] = useState(initialCount);
  const [installments, setInstallments] = useState([]);

  const updateInstallments = (newTotal, newCount) => {
    if (newTotal > 0 && newCount > 0) {
      const newInstallments = Array.from({ length: newCount }, (_, index) => ({
        id: index + 1,
        insNumber: index + 1,
        checked: false,
        amount: Math.floor(newTotal / newCount).toFixed(2),
        dueDate: "",
        show: true,
      }));
      setInstallments(newInstallments);
    } else {
      setInstallments([]);
    }
  };

  const handleTotalChange = (value) => {
    setTotal(value);
    updateInstallments(value, count);
  };

  const handleCountChange = (value) => {
    setCount(value);
    updateInstallments(total, value);
  };

  return {
    total,
     handleTotalChange,
    count,
    handleCountChange,
    installments,
    setInstallments,
  };
};

export default useUpdate;