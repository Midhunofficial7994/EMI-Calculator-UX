import React from "react";
import { Table, Form, Button } from "react-bootstrap";

const InstallmentsTable = ({
  installments,
  toggleInstallmentSelection,
  updateDueDate,
  handleUndo,
}) => {
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Action</th>
          <th>Install No</th>
          <th>Amount</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {installments.map((installment) => {
          if (!installment.show) return null;

          return (
            <tr key={installment.id}>
              <td>
                {installment.isMerged ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUndo(installment)}
                  >
                    Undo Merge
                  </Button>
                ) : installment.isSplited ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUndo(installment)}
                  >
                    Undo Split
                  </Button>
                ) : (
                  <Form.Check
                    type="checkbox"
                    checked={installment.checked}
                    onChange={() =>
                      toggleInstallmentSelection(installment.insNumber)
                    }
                  />
                )}
              </td>
              <td>{installment.insNumber}</td>
              <td>{installment.amount}</td>
              <td>
                <Form.Control
                  type="date"
                  value={installment.dueDate}
                  onChange={(e) =>
                    updateDueDate(installment.insNumber, e.target.value)
                  }
                  min={
                    installment.insNumber > "1"
                      ? installments[Number(installment.insNumber) - 2]?.dueDate
                      : ""
                  }
                  style={{ fontSize: "12px", padding: "4px" }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default InstallmentsTable;
