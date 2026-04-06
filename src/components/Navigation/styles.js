import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import colors from '../../assets/styles/variables/colors';
import metrics from '../../assets/styles/variables/metrics';

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

export const Sidebar = styled.nav`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: ${metrics.sidebarWidth};
    height: 100%;
    background: ${colors.surface};
    border-right: 1px solid ${colors.border};
    z-index: 100;
    padding: 24px 0;
  }
`;

export const AppName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text.light.very};
  letter-spacing: -0.3px;
  padding: 0 20px 28px;
  border-bottom: 1px solid ${colors.border};
  margin-bottom: 12px;

  span {
    color: ${colors.primary.main};
  }
`;

export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? colors.text.light.very : colors.text.light.medium)};
  background: ${({ $active }) => ($active ? colors.surfaceElevated : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? colors.primary.main : 'transparent')};
  transition: all ${metrics.transition.fast};

  &:hover {
    background: ${colors.surfaceElevated};
    color: ${colors.text.light.very};
  }
`;

export const NavIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
`;

// ─── Mobile FAB ──────────────────────────────────────────────────────────────

export const MobileFAB = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: ${metrics.radius.full};
  background: ${colors.primary.main};
  border: none;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  z-index: 200;
  box-shadow: 0 4px 20px rgba(230, 0, 126, 0.3);
  transition: transform ${metrics.transition.fast}, background ${metrics.transition.fast};

  &:active {
    transform: scale(0.94);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Backdrop = styled.div`
  display: block;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 150;
  animation: ${fadeIn} ${metrics.transition.fast};

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileSheet = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 96px;
  right: 24px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.large};
  overflow: hidden;
  z-index: 200;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: ${slideUp} ${metrics.transition.fast};

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? colors.primary.main : colors.text.light.very)};
  background: ${({ $active }) => ($active ? colors.surfaceElevated : 'transparent')};
  border-bottom: 1px solid ${colors.borderSubtle};
  transition: background ${metrics.transition.fast};

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: ${colors.surfaceElevated};
  }
`;

export const MobileNavIcon = styled.span`
  font-size: 17px;
  width: 22px;
  text-align: center;
`;
