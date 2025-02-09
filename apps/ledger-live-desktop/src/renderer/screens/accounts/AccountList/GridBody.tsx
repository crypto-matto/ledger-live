import React from "react";
import styled from "styled-components";
import { Account, TokenAccount } from "@ledgerhq/types-live";
import { PortfolioRange } from "@ledgerhq/live-common/portfolio/v2/types";
import Box from "~/renderer/components/Box";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import AccountCard from "../AccountGridItem";
import AccountCardPlaceholder from "../AccountGridItem/Placeholder";
type Props = {
  visibleAccounts: (Account | TokenAccount)[];
  hiddenAccounts: (Account | TokenAccount)[];
  onAccountClick: (a: Account | TokenAccount) => void;
  lookupParentAccount: (id: string) => Account | undefined | null;
  range: PortfolioRange;
  showNewAccount: boolean;
};
export default function GridBody({
  visibleAccounts,
  hiddenAccounts,
  range,
  showNewAccount,
  onAccountClick,
  lookupParentAccount,
  ...rest
}: Props) {
  return (
    <GridBox {...rest}>
      {[
        ...visibleAccounts,
        ...(showNewAccount ? [null] : []),
        ...hiddenAccounts,
      ].map((account, i) =>
        !account ? (
          <AccountCardPlaceholder key="placeholder" />
        ) : (
          <AccountCard
            hidden={i >= visibleAccounts.length}
            key={account.id}
            account={account}
            parentAccount={
              account.type !== "Account" ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ),
      )}
    </GridBox>
  );
}
const GridBox: ThemedComponent<{}> = styled(Box)`
  margin-top: 18px;
  display: grid;
  grid-gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;
