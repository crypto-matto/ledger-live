import React from "react";
import styled from "styled-components";
import { components } from "react-select";
import Box from "~/renderer/components/Box";
import LabelInfoTooltip from "~/renderer/components/LabelInfoTooltip";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconCross from "~/renderer/icons/Cross";
import { useTranslation } from "react-i18next";
import { Option } from ".";
import SearchIcon from "~/renderer/icons/Search";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Props as SelectProps } from "~/renderer/components/Select";
import { rgba } from "~/renderer/styles/helpers";
type OptionProps = any;
const InputWrapper: ThemedComponent<{}> = styled(Box)`
  & input::placeholder {
    color: ${p => p.theme.colors.palette.text.shade30};
  }
`;
export default ({
  renderOption,
  renderValue,
  selectProps,
}: {
  renderOption: (a: Option) => Node;
  renderValue: (a: Option) => Node;
  selectProps: SelectProps;
}) => ({
  ...STYLES_OVERRIDE,
  Option: function Option(props: OptionProps) {
    const { data, isSelected, isDisabled } = props;
    const { disabledTooltipText } = selectProps;
    return (
      <components.Option {...props}>
        <Box horizontal pr={4} relative>
          <Box
            grow
            style={{
              flex: 1,
            }}
          >
            {renderOption ? renderOption(props) : data.label}
          </Box>
          {isSelected && (
            <InformativeContainer color="wallet">
              <IconCheck size={12} color={props.theme.colors.wallet} />
            </InformativeContainer>
          )}
          {isDisabled && disabledTooltipText && (
            <InformativeContainer disabled>
              <LabelInfoTooltip text={disabledTooltipText ?? ""} />
            </InformativeContainer>
          )}
        </Box>
      </components.Option>
    );
  },
  SingleValue: function SingleValue(props: OptionProps) {
    const { data, selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;
    return menuIsOpen && isSearchable ? null : (
      <components.SingleValue {...props}>
        {renderValue ? renderValue(props) : data.label}
      </components.SingleValue>
    );
  },
});
const STYLES_OVERRIDE = {
  DropdownIndicator: function DropdownIndicator(props: OptionProps) {
    return (
      <components.DropdownIndicator {...props}>
        <IconAngleDown size={20} color={props.isDisabled ? "transparent" : "currentcolor"} />
      </components.DropdownIndicator>
    );
  },
  ClearIndicator: function ClearIndicator(props: OptionProps) {
    return (
      <components.ClearIndicator {...props}>
        <IconCross size={16} />
      </components.ClearIndicator>
    );
  },
  Placeholder: function Input(props: OptionProps) {
    const { selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;
    return menuIsOpen && isSearchable ? null : <components.Placeholder {...props} />;
  },
  Input: function Input(props: OptionProps) {
    const { t } = useTranslation();
    const { selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;
    return menuIsOpen && isSearchable ? (
      <InputWrapper color={"palette.text.shade40"} alignItems="center" horizontal pr={3}>
        <SearchIcon size={16} />
        <components.Input
          {...props}
          style={{
            marginLeft: 10,
          }}
          placeholder={t("common.searchWithoutEllipsis")}
        />
      </InputWrapper>
    ) : (
      <components.Input
        {...props}
        style={{
          opacity: 0,
        }}
      />
    );
  },
};
const InformativeContainer = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  color: ${p => (p.disabled ? rgba(p.theme.colors.palette.secondary.main, 0.5) : null)};
`;
