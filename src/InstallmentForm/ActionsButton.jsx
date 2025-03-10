import React from "react";
import { Button, Row, Col } from "react-bootstrap";

const ActionsButtons = ({
  mergeInstallments,
  splitInstallment,
  installments,
}) => {
  return (
    <Row>
      <Col>
        <Button
          variant="secondary"
          className="me-2 btn-sm"
          onClick={mergeInstallments}
          disabled={installments.filter((inst) => inst.checked).length < 2}
        >
          Merge
        </Button>
        <Button
          variant="secondary"
          className="btn-sm"
          onClick={splitInstallment}
          disabled={installments.filter((inst) => inst.checked).length !== 1}
        >
          Split
        </Button>
      </Col>
    </Row>
  );
};

export default ActionsButtons;
