import styled, { keyframes } from 'styled-components';
import colors from '../../assets/styles/variables/colors';
import metrics from '../../assets/styles/variables/metrics';

// ─── Shared ──────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// ─── Page Layout ─────────────────────────────────────────────────────────────

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${colors.bgColor};
  border-bottom: 1px solid ${colors.border};
  padding: 20px;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.text.light.very};
  letter-spacing: -0.4px;
`;

// ─── Sections ───────────────────────────────────────────────────────────────

export const Section = styled.section`
  padding: 20px;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const AddButton = styled.button`
  padding: 6px 14px;
  border-radius: ${metrics.radius.full};
  background: rgba(66, 133, 244, 0.12);
  border: none;
  color: ${colors.primary.main};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: rgba(66, 133, 244, 0.25);
  }
`;

// ─── Stat Cards ─────────────────────────────────────────────────────────────

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  margin-bottom: 8px;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:hover {
    background: ${colors.surfaceElevated};
  }
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${colors.text.light.medium};
`;

export const StatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

export const EmptyValue = styled.span`
  font-size: 14px;
  color: ${colors.text.light.little};
  font-style: italic;
`;

// ─── List Items ─────────────────────────────────────────────────────────────

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  margin-bottom: 6px;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:hover {
    background: ${colors.surfaceElevated};
  }
`;

export const ListItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ListItemName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text.light.very};
`;

export const ListItemMeta = styled.span`
  font-size: 12px;
  color: ${colors.text.light.medium};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px;
  color: ${colors.text.light.little};
  font-size: 14px;
`;

// ─── Goals ──────────────────────────────────────────────────────────────────

export const GoalRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  margin-bottom: 6px;
`;

export const GoalText = styled.span`
  font-size: 14px;
  color: ${colors.text.light.very};
  flex: 1;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${colors.auxiliar.danger};
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.6;
  transition: opacity ${metrics.transition.fast};

  &:hover {
    opacity: 1;
  }
`;

// ─── Modal ──────────────────────────────────────────────────────────────────

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} ${metrics.transition.fast};
`;

export const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${colors.surface};
  border-top-left-radius: ${metrics.radius.large};
  border-top-right-radius: ${metrics.radius.large};
  padding: 20px;
  animation: ${slideUp} ${metrics.transition.fast};
`;

export const ModalHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${colors.border};
  margin: 0 auto 16px;
`;

export const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.text.light.very};
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  margin-bottom: 6px;
  margin-top: 14px;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: ${metrics.radius.medium};
  border: 1px solid ${colors.border};
  background: ${colors.surfaceElevated};
  color: ${colors.text.light.very};
  font-size: 15px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary.main};
  }

  &::placeholder {
    color: ${colors.text.light.little};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border-radius: ${metrics.radius.medium};
  border: 1px solid ${colors.border};
  background: ${colors.surfaceElevated};
  color: ${colors.text.light.very};
  font-size: 15px;
  outline: none;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary.main};
  }

  &::placeholder {
    color: ${colors.text.light.little};
  }
`;

export const UnitSelector = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const UnitOption = styled.button`
  padding: 8px 14px;
  border-radius: ${metrics.radius.full};
  border: 1px solid ${({ $active }) => ($active ? colors.primary.main : colors.border)};
  background: ${({ $active }) => ($active ? 'rgba(66, 133, 244, 0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primary.main : colors.text.light.medium)};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${metrics.transition.fast};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const SaveButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: ${metrics.radius.medium};
  background: ${colors.primary.main};
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background: ${colors.primary.dark};
  }
`;

export const DeleteButton = styled.button`
  padding: 14px 20px;
  border-radius: ${metrics.radius.medium};
  background: rgba(248, 113, 113, 0.1);
  border: none;
  color: ${colors.auxiliar.danger};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: rgba(248, 113, 113, 0.2);
  }
`;
