import React, { PureComponent } from "react";
import logger from "~/renderer/logger";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/currencies/index";
import { compose } from "redux";
import { connect } from "react-redux";
import { TFunction } from "react-i18next";
import Modal from "~/renderer/components/Modal";
import Stepper, { Step } from "~/renderer/components/Stepper";
import StepOverview, {
  StepOverviewFooter,
} from "~/renderer/modals/MigrateAccounts/steps/StepOverview";
import StepConnectDevice from "~/renderer/modals/MigrateAccounts/steps/StepConnectDevice";
import StepCurrency, {
  StepCurrencyFooter,
} from "~/renderer/modals/MigrateAccounts/steps/StepCurrency";
import { createStructuredSelector } from "reselect";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector, migratableAccountsSelector } from "~/renderer/reducers/accounts";
import { replaceAccounts } from "~/renderer/actions/accounts";
import { closeModal } from "~/renderer/actions/modals";
import { Account } from "@ledgerhq/types-live";
import { CryptoCurrency } from "@ledgerhq/live-common/generated/types";
import { Device } from "@ledgerhq/live-common/hw/actions/types";
type ScanStatus = "idle" | "scanning" | "error" | "finished" | "finished-empty";
export type StepProps = {
  t: TFunction;
  transitionTo: (a: string) => void;
  replaceAccounts: (a: Account[]) => void;
  replaceStarAccountId: (a: { oldId: string; newId: string }) => void;
  currencyIds: string[];
  migratableAccounts: Account[];
  migratedAccounts: {
    [key: string]: Account[];
  };
  err: Error | undefined | null;
  accounts: Account[];
  totalMigratableAccounts: number;
  currency: CryptoCurrency | undefined | null;
  setScanStatus: (b: ScanStatus, a?: Error | null) => string;
  addMigratedAccount: (b: CryptoCurrency, a: Account) => void;
  device: Device | undefined | null;
  flushMigratedAccounts: () => void;
  moveToNextCurrency: (a?: boolean | null) => void;
  getNextCurrency: () => CryptoCurrency;
  scanStatus: ScanStatus;
  onCloseModal: () => void;
  hideLoopNotice: boolean;
};
type StepId = "overview" | "device" | "currency";
type St = Step<StepId, StepProps>;
type State = {
  stepId: StepId;
  currency: CryptoCurrency | undefined | null;
  scanStatus: ScanStatus;
  err: Error | undefined | null;
  migratedAccounts: {
    [key: string]: Account[];
  };
};
const createSteps = (): St[] => {
  const onBack = ({ transitionTo }) => {
    transitionTo("overview");
  };
  return [
    {
      id: "overview",
      component: StepOverview,
      footer: StepOverviewFooter,
    },
    {
      id: "device",
      component: StepConnectDevice,
      onBack,
    },
    {
      id: "currency",
      component: StepCurrency,
      footer: StepCurrencyFooter,
    },
  ];
};
const INITIAL_STATE = {
  stepId: "overview",
  currency: null,
  scanStatus: "idle",
  err: null,
  migratedAccounts: {},
};
class MigrateAccounts extends PureComponent<any, State> {
  state = INITIAL_STATE;
  componentDidMount() {
    this.handleMoveToNextCurrency();
  }

  hideLoopNotice = true;
  STEPS = createSteps();
  handleStepChange = (step: St) =>
    this.setState({
      stepId: step.id,
    });

  handleSetScanStatus = (scanStatus: ScanStatus, err: Error | undefined | null = null) => {
    if (err) {
      logger.critical(err);
    }
    this.setState({
      scanStatus,
      err,
    });
  };

  getNextCurrency = () => {
    const { currencyIds } = this.props;
    this.hideLoopNotice = false;
    const { currency } = this.state;
    const nextCurrencyId = currencyIds[currencyIds.indexOf(currency && currency.id) + 1];
    return (nextCurrencyId && getCryptoCurrencyById(nextCurrencyId)) || null;
  };

  handleMoveToNextCurrency = (forceNull = false) => {
    const nextCurrency = this.getNextCurrency();
    this.setState({
      currency: (!forceNull && nextCurrency) || null,
    });
  };

  handleCloseModal = () => this.props.closeModal("MODAL_MIGRATE_ACCOUNTS");
  addMigratedAccount = (currency: CryptoCurrency, account: Account) =>
    this.setState(state => {
      const alreadyMigrated = state.migratedAccounts[currency.id] || [];
      return {
        migratedAccounts: {
          [currency.id]: [...alreadyMigrated, account],
        },
      };
    });

  render() {
    const { device, migratableAccounts, currencyIds, accounts, replaceAccounts } = this.props;
    const { stepId, err, scanStatus, currency } = this.state;
    const stepperProps = {
      replaceAccounts,
      migratableAccounts,
      currencyIds,
      accounts,
      device,
      currency,
      err,
      scanStatus,
      addMigratedAccount: this.addMigratedAccount,
      migratedAccounts: this.state.migratedAccounts,
      hideLoopNotice: this.hideLoopNotice,
      setScanStatus: this.handleSetScanStatus,
      moveToNextCurrency: this.handleMoveToNextCurrency,
      getNextCurrency: this.getNextCurrency,
      onCloseModal: this.handleCloseModal,
    };
    const errorSteps = err ? [2] : [];
    const disableDismiss = scanStatus === "scanning";
    return (
      <Modal
        centered
        name="MODAL_MIGRATE_ACCOUNTS"
        preventBackdropClick={disableDismiss}
        onHide={
          disableDismiss
            ? undefined
            : () =>
                this.setState({
                  ...INITIAL_STATE,
                })
        }
        render={({ onClose }) => (
          <Stepper
            hideBreadcrumb
            stepId={stepId}
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
            errorSteps={errorSteps}
            {...stepperProps}
          />
        )}
      />
    );
  }
}
const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
  migratableAccounts: migratableAccountsSelector,
  currencyIds: state =>
    migratableAccountsSelector(state)
      .reduce((c, a) => (c.includes(a.currency.id) ? c : [...c, a.currency.id]), [])
      .sort(),
});
const mapDispatchToProps = {
  replaceAccounts,
  closeModal,
};
const ConnectedMigrateAccounts: React$ComponentType<any> = compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MigrateAccounts);
export default ConnectedMigrateAccounts;
