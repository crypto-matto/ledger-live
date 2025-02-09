import React, { useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
const ScrollAreaContainer: ThemedComponent<any> = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  padding-bottom: ${({ isInsideDrawer }) => (isInsideDrawer ? "80px" : "0px")};
`;
const ScrollableContentContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: ${({ hideScrollbar }) => (hideScrollbar ? "none" : "initial")};
  }
`;
const ScrollHintAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
`;
const ScrollHint = styled.div.attrs(({ visible }) => ({
  style: {
    opacity: visible ? 1 : 0,
  },
}))`
  width: 30px;
  height: 50px;
  border-radius: 25px;
  box-shadow: inset 0 0 0 1px ${p => p.theme.colors.palette.text.shade80};
  position: absolute;
  bottom: 40px;
  right: 40px;
  transition: opacity 150ms ease-out;
  pointer-events: none;

  &:after {
    content: "";
    width: 4px;
    height: 8px;
    margin-left: -2px;
    background-color: ${p => p.theme.colors.palette.text.shade80};
    position: absolute;
    left: 50%;
    top: 8px;
    border-radius: 4px;
    animation: ${ScrollHintAnimation} 1250ms infinite;
  }
`;
type ScrollAreaProps = {
  className?: string;
  children?: React.ReactNode;
  withHint?: boolean;
  hideScrollbar?: boolean;
  isInsideDrawer?: boolean;
};
export function ScrollArea({
  className,
  children,
  withHint = false,
  hideScrollbar = false,
  isInsideDrawer = false,
}: ScrollAreaProps) {
  const [hintVisible, setHintVisible] = useState(true);
  const handleScroll = useCallback(event => {
    setHintVisible(event.target.scrollTop === 0);
  }, []);
  return (
    <ScrollAreaContainer className={className} isInsideDrawer={isInsideDrawer}>
      {withHint ? <ScrollHint visible={hintVisible} /> : null}
      <ScrollableContentContainer
        id="page-scroller"
        onScroll={handleScroll}
        hideScrollbar={hideScrollbar}
      >
        {children}
      </ScrollableContentContainer>
    </ScrollAreaContainer>
  );
}
