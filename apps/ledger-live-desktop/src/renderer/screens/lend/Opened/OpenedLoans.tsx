import React from "react";
import styled from "styled-components";
import { OpenedLoansHistory, OpenedLoanHistory } from "@ledgerhq/live-common/compound/types";
import { useTranslation } from "react-i18next";
import { getAccountName } from "@ledgerhq/live-common/account/index";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import ToolTip from "~/renderer/components/Tooltip";
const Header = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};

  > * {
    flex-basis: 25%;
  }

  > *:last-child {
    text-align: right;
  }
`;
const RowContent = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  padding: 10px 24px;

  > * {
    flex-basis: 25%;
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    max-width: 25%;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
  }
`;
const RowAccount = styled(Box)`
  margin-left: 12px;
  align-items: flex-start;
  /* the calc here uses the margin left + icon size */
  max-width: calc(90% - 12px - 32px);
`;
const Amount = styled(Box)`
  flex-direction: column;
  align-items: flex-start;
  flex-basis: 25%;
  max-width: 25%;
`;
const Date = styled(Box)`
  flex-direction: column;
  align-items: flex-end;
`;
type RowProps = {
  loan: OpenedLoanHistory;
};
const Row = ({ loan }: RowProps) => {
  const { account, parentAccount, amountSupplied, interestsEarned, startingDate } = loan;
  const { token } = account;
  const name = getAccountName(account);
  return (
    <RowContent>
      <Box>
        <CryptoCurrencyIcon currency={token} size={32} />
        <RowAccount>
          <Ellipsis fontSize={10} color="palette.text.shade50">
            <Text ff="Inter|SemiBold">{parentAccount?.name}</Text>
          </Ellipsis>
          <ToolTip content={name} delay={1200}>
            <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={14}>
              {name}
            </Ellipsis>
          </ToolTip>
        </RowAccount>
      </Box>
      <Amount>
        <Ellipsis ff="Inter|SemiBold">
          <FormattedVal
            color="palette.text.shade100"
            unit={token.units[0]}
            val={amountSupplied}
            fontSize={4}
            showCode
          />
        </Ellipsis>
        <Ellipsis ff="Inter|Medium">
          <CounterValue
            currency={token}
            value={amountSupplied}
            disableRounding
            color="palette.text.shade50"
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </Ellipsis>
      </Amount>
      <Amount>
        <Ellipsis ff="Inter|SemiBold">
          <FormattedVal
            color="palette.text.shade100"
            unit={token.units[0]}
            val={interestsEarned}
            fontSize={4}
            showCode
          />
        </Ellipsis>
        <Ellipsis ff="Inter|Medium">
          <CounterValue
            currency={token}
            value={interestsEarned}
            disableRounding
            color="palette.text.shade50"
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </Ellipsis>
      </Amount>
      <Date>
        <Text ff="Inter|SemiBold" fontSize={3} color="palette.text.shade100">
          {startingDate.toDateString()}
        </Text>
      </Date>
    </RowContent>
  );
};
type Props = {
  loans: OpenedLoansHistory;
};
const OpenedLoans = ({ loans }: Props) => {
  const { t } = useTranslation();
  return (
    <Card>
      <Header px={24} py={16} horizontal flex>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.opened.assetLended")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.opened.amount")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.opened.accruedInterest")}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
          {t("lend.headers.opened.date")}
        </Text>
      </Header>
      {loans.map((l, i) => (
        <Row key={`${l.startingDate.toDateString()}${i}`} loan={l} />
      ))}
    </Card>
  );
};
export default OpenedLoans;
