import React, { useCallback, useState } from "react";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import { StepId } from "./types";
type State = {
  stepId: StepId;
};
const INITIAL_STATE = {
  stepId: "amount",
};
type Props = {
  currency: CryptoCurrency | TokenCurrency;
};
const SupplyModal = (props: Props) => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const { stepId } = state;
  const handleStepChange = useCallback(
    (stepId: StepId) => {
      setState(prev => ({
        ...prev,
        stepId,
      }));
    },
    [setState],
  );
  const handleReset = useCallback(() => setState(INITIAL_STATE), [setState]);
  const isModalLocked = ["connectDevice", "confirmation"].includes(stepId);
  return (
    <Modal
      {...props}
      name="MODAL_LEND_SUPPLY"
      centered
      refocusWhenChange={stepId}
      onHide={handleReset}
      preventBackdropClick={isModalLocked}
      render={({ onClose, data }) => (
        <Body
          stepId={stepId}
          name="MODAL_LEND_SUPPLY"
          onClose={onClose}
          onChangeStepId={handleStepChange}
          params={data || {}}
        />
      )}
    />
  );
};
export default SupplyModal;
