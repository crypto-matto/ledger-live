import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => rgba(p.theme.colors.palette.secondary.main, 0.02)};
  > * {
    width: 20%;
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  > *:nth-of-type(4) {
    width: 25%;
  }
  > *:nth-of-type(5) {
    width: 15%;
  }
`;
const Header = () => (
  <Wrapper>
    <Text ff="Inter|SemiBold" color="palette.text.shade50" fontSize={3}>
      <Trans i18nKey={"distribution.asset"} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade50" fontSize={3}>
      <Trans i18nKey={"distribution.price"} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade50" fontSize={3}>
      <Trans i18nKey={"distribution.distribution"} />
    </Text>
    <Text
      ff="Inter|SemiBold"
      color="palette.text.shade50"
      style={{
        justifyContent: "flex-end",
      }}
      fontSize={3}
    >
      <Trans i18nKey={"distribution.amount"} />
    </Text>
    <Text
      ff="Inter|SemiBold"
      color="palette.text.shade50"
      style={{
        justifyContent: "flex-end",
      }}
      fontSize={3}
    >
      <Trans i18nKey={"distribution.value"} />
    </Text>
  </Wrapper>
);
export default Header;
