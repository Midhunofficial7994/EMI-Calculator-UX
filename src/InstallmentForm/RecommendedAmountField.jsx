import React from "react";
import { Form } from "react-bootstrap";

const RecommendedAmountField = ({
  recommendedAmount,
  handleRecommendedAmountChange,
}) => {
  return (
    <Form.Group className="mb-2">
      <Form.Label>Recommended Amount</Form.Label>
      <Form.Control
        type="text"
        value={recommendedAmount}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          handleRecommendedAmountChange(value ? Number(value) : "");
        }}
        style={{ fontSize: "14px", padding: "4px" }}
        onWheel={(e) => e.target.blur()}
      />
    </Form.Group>
  );
};

export default RecommendedAmountField;
