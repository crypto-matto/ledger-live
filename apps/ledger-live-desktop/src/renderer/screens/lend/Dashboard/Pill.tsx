import React from "react";
import { useTranslation } from "react-i18next";
import { CompoundAccountStatus } from "@ledgerhq/live-common/compound/types";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
const colorMap = {
  ENABLING: {
    background: "palette.text.shade10",
    text: "palette.text.shade80",
  },
  INACTIVE: {
    background: "blueTransparentBackground",
    text: "wallet",
  },
  SUPPLYING: {
    background: "wallet",
    text: "white",
  },
  EARNING: {
    background: "wallet",
    text: "white",
  },
};
const Wrapper: ThemedComponent<{}> = styled(Box)`
  padding: 4px 8px;
  border-radius: 64px;
`;
const Pill = ({
  children,
  background = "blueTransparentBackground",
  color = "wallet",
  fontSize = 2,
}: {
  children: React.ReactNode;
  background?: string;
  color?: string;
  fontSize?: number;
}) => {
  return (
    <Wrapper backgroundColor={background}>
      <Text ff="Inter|Bold" color={color} fontSize={fontSize}>
        {children}
      </Text>
    </Wrapper>
  );
};
type Props = {
  type: CompoundAccountStatus;
};
export const StatusPill = ({ type }: Props) => {
  const { t } = useTranslation();
  if (!type) return null;
  const { background, text } = colorMap[type];
  const Wrapper = type === "ENABLING" || type === "INACTIVE" ? ToolTip : null;
  const label = t(`lend.headers.types.${type.toLowerCase()}`).toUpperCase();
  return Wrapper ? (
    <Wrapper
      content={
        type === "ENABLING"
          ? t("lend.headers.status.enablingTooltip")
          : t("lend.headers.status.toSupplyTooltip")
      }
    >
      <Pill background={background} color={text}>
        {label}
      </Pill>
    </Wrapper>
  ) : (
    <Pill background={background} color={text}>
      {label}
    </Pill>
  );
};
export default Pill;
