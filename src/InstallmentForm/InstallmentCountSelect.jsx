import React from "react";
import { Form } from "react-bootstrap";

const InstallmentCountSelect = ({
  installmentCount,
  handleInstallmentCountChange,
}) => {
  return (
    <Form.Group className="mb-2">
      <Form.Label>Installment Count</Form.Label>
      <Form.Select
        value={installmentCount}
        onChange={(e) => handleInstallmentCountChange(Number(e.target.value))}
        style={{ fontSize: "14px", padding: "4px" }}
      >
        {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default InstallmentCountSelect;
