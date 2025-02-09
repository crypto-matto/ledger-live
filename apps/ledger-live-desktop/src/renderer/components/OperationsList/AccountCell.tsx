import React, { PureComponent } from "react";
import styled from "styled-components";
import { Currency } from "@ledgerhq/types-cryptoassets";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import Tooltip from "~/renderer/components/Tooltip";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
const Cell: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 4,
  horizontal: true,
  alignItems: "center",
  height: "100%",
}))`
  flex: 1 1 auto;
  overflow: hidden;
  max-width: 400px;
`;
type Props = {
  currency: Currency;
  accountName: string;
};
class AccountCell extends PureComponent<Props> {
  render() {
    const { currency, accountName } = this.props;
    return (
      <Cell horizontal flow={2}>
        <Box alignItems="center" justifyContent="center">
          <CryptoCurrencyIcon size={16} currency={currency} />
        </Box>
        <Tooltip delay={1200} content={accountName}>
          <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
            {accountName}
          </Ellipsis>
        </Tooltip>
      </Cell>
    );
  }
}
export default AccountCell;
