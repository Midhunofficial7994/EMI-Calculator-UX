import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useInstallmentAdvancedLogic from "./useInstallmentAdvancedLogic";
import useInstallmentLogic from "./useInstallmentLogic";

const InsForm = () => {
  const {
    recommendedAmount,
    handleRecommendedAmountChange,
    installmentCount,
    handleInstallmentCountChange,
    installments,
    setInstallments,
    toggleInstallmentSelection,
    updateDueDate,
  } = useInstallmentLogic();

  const { mergeInstallments, splitInstallment, handleUndo } =
    useInstallmentAdvancedLogic(installments, setInstallments);

  return (
    <Container className="mt-2" style={{ maxWidth: "600px" }}>
      <Card className="p-2">
        <Card.Body>
          <Row className="mb-2">
            <Col>
              <Form.Group>
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
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label>Installment Count</Form.Label>
                <Form.Select
                  value={installmentCount}
                  onChange={(e) =>
                    handleInstallmentCountChange(Number(e.target.value))
                  }
                  style={{ fontSize: "14px", padding: "4px" }}
                >
                  {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

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
                            ? installments[Number(installment.insNumber) - 2]
                                ?.dueDate
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

          <Row>
            <Col>
              <Button
                variant="secondary"
                className="me-2 btn-sm"
                onClick={mergeInstallments}
                disabled={
                  installments.filter((inst) => inst.checked).length < 2
                }
              >
                Merge
              </Button>
              <Button
                variant="secondary"
                className="btn-sm"
                onClick={splitInstallment}
                disabled={
                  installments.filter((inst) => inst.checked).length !== 1
                }
              >
                Split
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InsForm;
