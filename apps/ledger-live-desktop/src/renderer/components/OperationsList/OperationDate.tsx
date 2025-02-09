import React, { PureComponent } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import FormattedDate from "../FormattedDate";
const Hour: ThemedComponent<{}> = styled(Text).attrs(() => ({
  color: "palette.text.shade60",
  fontSize: 3,
  ff: "Inter",
}))`
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;
export default class OperationDate extends PureComponent<{
  date: Date;
}> {
  render() {
    const { date } = this.props;
    return (
      <Hour>
        <FormattedDate date={date} format="LT" />
      </Hour>
    );
  }
}
