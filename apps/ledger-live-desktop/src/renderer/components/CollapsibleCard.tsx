import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Transition } from "react-transition-group";
import { RawCard, RawCardProps } from "~/renderer/components/Box/Card";
import ChevronRight from "../icons/ChevronRightSmall";
const Container: ThemedComponent<{
  timing: number;
} & RawCardProps> = styled(RawCard)`
  height: auto;
  transition: all ${p => p.timing}ms ease-in;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  width: auto;
  padding-left: ${p => (p.chevronVisible ? p.theme.space[6] : 0)}px;
  position: relative;
  & > * {
    flex: 1;
  }
`;
const transitionStyles = {
  entering: {
    opacity: 0,
    maxHeight: 0,
    overflow: "hidden",
  },
  entered: {
    opacity: 1,
    maxHeight: "100vh",
    overflow: "auto",
  },
  exiting: {
    opacity: 0,
    maxHeight: 0,
    overflow: "hidden",
  },
  exited: {
    opacity: 0,
    maxHeight: 0,
    overflow: "hidden",
  },
};
const ChildrenContainer = styled.div.attrs(p => ({
  style: {
    ...transitionStyles[p.state],
  },
}))`
  transition: all ${p => p.timing}ms ease-out;
  transform-origin: top;
  height: auto;
  width: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;
const Chevron = styled.div.attrs(p => ({
  style: {
    transform: `translateY(-50%) rotate(${p.open ? "90deg" : "0deg"})`,
  },
}))`
  width: 18px;
  height: 18px;
  padding: 11px;
  position: absolute;
  top: 50%;
  left: 0;
  box-sizing: content-box;
  transition: all ${p => p.timing / 2}ms ${p => p.timing / 2}ms ease-in;
  cursor: pointer;
`;
type Props = {
  /** header node */
  header: React.ReactNode;
  /** timing in ms for collapse animation */
  timing?: number;
  /** show header chevron */
  chevronVisible?: boolean;
  children?: React.ReactNode;
  open?: boolean;
  onOpen?: (isOpen: boolean) => void;
} & RawCardProps;
const CollapsibleCard = ({
  header,
  children,
  timing = 400,
  chevronVisible = true,
  open: defaultOpen,
  onOpen = () => null,
  ...props
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => {
    setOpen(!open);
    onOpen(!open);
  }, [open, onOpen]);
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);
  return (
    <Container {...props} timing={timing}>
      <HeaderContainer onClick={toggle} chevronVisible={chevronVisible}>
        {chevronVisible && (
          <Chevron open={open} timing={timing}>
            <ChevronRight size={18} />
          </Chevron>
        )}
        {header}
      </HeaderContainer>
      <Transition
        in={open}
        timeout={{
          appear: 0,
          enter: timing,
          exit: timing * 3, // leaves extra time for the animation to end before unmount
        }}
        unmountOnExit
      >
        {state => (
          <ChildrenContainer timing={timing} state={state}>
            {children}
          </ChildrenContainer>
        )}
      </Transition>
    </Container>
  );
};
export default CollapsibleCard;
