import styled from "styled-components";
import ValidatorRow, { ValidatorRowProps } from "~/renderer/components/Delegation/ValidatorRow";
import Check from "~/renderer/icons/Check";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
export const StyledValidatorRow: ThemedComponent<ValidatorRowProps> = styled(ValidatorRow)`
  border-color: transparent;
  margin-bottom: 0;
`;
export const ChosenMark: ThemedComponent<{
  active: boolean;
}> = styled(Check).attrs(p => ({
  color: p.active ? p.theme.colors.palette.primary.main : "transparent",
  size: 14,
}))``;
