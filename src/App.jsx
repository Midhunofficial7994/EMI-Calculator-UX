
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
import useInstallmentLogic from "./useInstallmentState";

const InstallmentPaymentUI = () => {
  const {
    recommendedAmount,
    setRecommendedAmount,
    installmentCount,
    setInstallmentCount,
    selectedInstallments,
    dueDates,
    mergedInstallments,
    splitInstallments,
    installmentAmount,
    handleInstallmentSelect,
    handleDueDateChange,
    handleMerge,
    handleSplit,
    handleUndoMerge,
    handleUndoSplit,
    handleMergedDueDateChange,
  } = useInstallmentLogic();

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
                    setRecommendedAmount(value ? Number(value) : "");
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
                  onChange={(e) => setInstallmentCount(Number(e.target.value))}
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
              {Array(installmentCount)
                .fill()
                .map((_, index) => {
                  const installNo = index + 1;
                  const mergedItem = mergedInstallments[installNo];
                  const splitItems = splitInstallments[installNo];

                  if (mergedItem) {
                    return (
                      <tr key={installNo}>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUndoMerge(installNo)}
                          >
                            Undo Merge
                          </Button>
                        </td>
                        <td>{mergedItem.included.join("+")}</td>
                        <td>{mergedItem.amount.toFixed(2)}</td>
                        <td>
                          <Form.Control
                            type="date"
                            value={dueDates[installNo] || ""}
                            onChange={(e) =>
                              handleMergedDueDateChange(
                                installNo,
                                e.target.value
                              )
                            }
                            min={installNo > 1 ? dueDates[installNo - 1] ? new Date(
                              new Date(dueDates[installNo - 1]).getTime() +
                                30 * 24 * 60 * 60 * 1000
                            ).toISOString().split("T")[0] : undefined : undefined}
                            style={{ fontSize: "12px", padding: "4px" }}
                          />
                        </td>
                      </tr>
                    );
                  }

                  if (splitItems) {
                    return splitItems.map((split, splitIndex) => (
                      <tr key={split.id}>
                        <td>
                          {splitIndex === 0 && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleUndoSplit(installNo)}
                            >
                              Undo Split
                            </Button>
                          )}
                        </td>
                        <td>{split.id}</td>
                        <td>{split.amount}</td>
                        <td>
                          <Form.Control
                            type="date"
                            value={dueDates[split.id] || ""}
                            onChange={(e) =>
                              handleDueDateChange(split.id, e.target.value)
                            }
                            min={installNo > 1 ? dueDates[installNo - 1] ? new Date(
                              new Date(dueDates[installNo - 1]).getTime() +
                                30 * 24 * 60 * 60 * 1000
                            ).toISOString().split("T")[0] : undefined : undefined}
                            style={{ fontSize: "12px", padding: "4px" }}
                          />
                        </td>
                      </tr>
                    ));
                  }

                  if (
                    Object.values(mergedInstallments).some(
                      (merge) =>
                        merge.included.includes(installNo) &&
                        merge.included[0] !== installNo
                    ) ||
                    Object.values(splitInstallments).some(
                      (splits) =>
                        splits.some((s) => s.id.startsWith(`${installNo}.`)) &&
                        !installNo.toString().includes(".")
                    )
                  ) {
                    return null;
                  }

                  return (
                    <tr key={installNo}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedInstallments.includes(installNo)}
                          onChange={() => handleInstallmentSelect(installNo)}
                        />
                      </td>
                      <td>{installNo}</td>
                      <td>{installmentAmount.toFixed(2)}</td>
                      <td>
                        <Form.Control
                          type="date"
                          value={dueDates[installNo] || ""}
                          onChange={(e) =>
                            handleDueDateChange(installNo, e.target.value)
                          }
                          min={installNo > 1 ? dueDates[installNo - 1] ? new Date(
                            new Date(dueDates[installNo - 1]).getTime() +
                              30 * 24 * 60 * 60 * 1000
                            ).toISOString().split("T")[0] : undefined : undefined}
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
                onClick={handleMerge}
                disabled={selectedInstallments.length < 2}
              >
                Merge
              </Button>
              <Button
                variant="secondary"
                className="btn-sm"
                onClick={handleSplit}
                disabled={selectedInstallments.length !== 1}
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

export default InstallmentPaymentUI;