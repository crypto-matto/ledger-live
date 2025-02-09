import invariant from "invariant";
import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { StepProps } from "../types";
import { getMainAccount } from "@ledgerhq/live-common/account/index";
import { formatCurrencyUnit } from "@ledgerhq/live-common/currencies/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import { localeSelector } from "~/renderer/reducers/settings";
import { BigNumber } from "bignumber.js";
import ClaimRewardsIllu from "~/renderer/images/claim-rewards.svg";
import Image from "~/renderer/components/Image";
const IconWrapperCircle = styled(Box)`
  align-items: center;
  justify-content: center;
  align-self: center;
`;
export default function StepRewards({ account, parentAccount, reward }: StepProps) {
  const locale = useSelector(localeSelector);
  invariant(account, "account is required");
  const mainAccount = getMainAccount(account, parentAccount);
  const formattedReward = formatCurrencyUnit(mainAccount.unit, BigNumber(reward || 0), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    locale,
  });
  return (
    <Box flow={1}>
      <TrackPage category="Claim Reward Flow" name="Step reward" />
      <Box>
        <IconWrapperCircle>
          <Image alt="" resource={ClaimRewardsIllu} width="100" />
        </IconWrapperCircle>
      </Box>
      <Box px={6} py={4}>
        <Text ff="Inter|Medium" textAlign="center" fontSize={4}>
          <Trans
            i18nKey="claimReward.steps.rewards.description"
            values={{
              amount: formattedReward,
            }}
          >
            {"placeholder"}
            <Text ff="Inter|SemiBold">{"placeholder"}</Text>
            {"placeholder"}
          </Trans>
        </Text>
      </Box>
      <Alert type="primary" mx={4}>
        <Trans i18nKey="claimReward.steps.rewards.info" />
      </Alert>
    </Box>
  );
}
export function StepRewardsFooter({ transitionTo, account, parentAccount, onClose }: StepProps) {
  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!account} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
