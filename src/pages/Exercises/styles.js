import styled, { keyframes } from 'styled-components';
import colors from '../../assets/styles/variables/colors';
import metrics from '../../assets/styles/variables/metrics';

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
  padding: 20px 20px 0;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.text.light.very};
  letter-spacing: -0.4px;
`;

export const ExerciseCount = styled.span`
  font-size: 13px;
  color: ${colors.text.light.medium};
  font-weight: 400;
  margin-left: 8px;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${colors.primary.main};
  color: #fff;
  border: none;
  border-radius: ${metrics.radius.full};
  font-size: 14px;
  font-weight: 600;
  transition: background ${metrics.transition.fast}, transform ${metrics.transition.fast};

  &:active {
    transform: scale(0.96);
    background: ${colors.primary.dark};
  }
`;

export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 4px;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: ${colors.text.light.medium};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 38px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 14px;
  transition: border-color ${metrics.transition.fast};

  &::placeholder {
    color: ${colors.text.light.medium};
  }

  &:focus {
    border-color: ${colors.primary.main};
    background: ${colors.surfaceElevated};
  }
`;

// ─── Exercise List ────────────────────────────────────────────────────────────

export const List = styled.div`
  flex: 1;
  padding: 8px 0;
`;

export const ExerciseRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 20px;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${colors.borderSubtle};
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: ${colors.surface};
  }

  @media (hover: hover) {
    &:hover {
      background: ${colors.surface};
    }
  }
`;

export const ExerciseName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text.light.very};
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const unitColors = {
  reps: colors.unit.reps,
  time: colors.unit.time,
  distance: colors.unit.distance,
  cals: colors.unit.cals,
};

export const UnitBadge = styled.span`
  flex-shrink: 0;
  margin-left: 12px;
  padding: 3px 9px;
  border-radius: ${metrics.radius.full};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ $type }) => unitColors[$type] || colors.text.light.medium};
  background: ${({ $type }) => `${unitColors[$type]}22` || colors.surface};
`;

// ─── Empty State ─────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  gap: 8px;
  color: ${colors.text.light.medium};
  font-size: 15px;
  text-align: center;

  span:first-child {
    font-size: 32px;
    margin-bottom: 4px;
  }
`;

// ─── Modal ────────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  animation: ${fadeIn} 200ms ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 500px) {
    align-items: center;
  }
`;

export const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${colors.surface};
  border-radius: ${metrics.radius.large} ${metrics.radius.large} 0 0;
  padding: 24px 20px 32px;
  animation: ${slideUp} 200ms ease;

  @media (min-width: 500px) {
    border-radius: ${metrics.radius.large};
  }
`;

export const ModalHandle = styled.div`
  width: 36px;
  height: 4px;
  background: ${colors.border};
  border-radius: 2px;
  margin: 0 auto 20px;

  @media (min-width: 500px) {
    display: none;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text.light.very};
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${colors.text.light.medium};
  margin-bottom: 6px;
  margin-top: 16px;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 15px;
  transition: border-color ${metrics.transition.fast};

  &::placeholder {
    color: ${colors.text.light.medium};
  }

  &:focus {
    border-color: ${colors.primary.main};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 14px;
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
  transition: border-color ${metrics.transition.fast};

  &::placeholder {
    color: ${colors.text.light.medium};
  }

  &:focus {
    border-color: ${colors.primary.main};
  }
`;

export const UnitTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

export const UnitTypeOption = styled.button`
  padding: 9px 0;
  border-radius: ${metrics.radius.medium};
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${({ $active, $type }) => $active ? unitColors[$type] : colors.border};
  background: ${({ $active, $type }) => $active ? `${unitColors[$type]}22` : colors.surfaceElevated};
  color: ${({ $active, $type }) => $active ? unitColors[$type] : colors.text.light.medium};
  transition: all ${metrics.transition.fast};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;
`;

export const SaveButton = styled.button`
  flex: 1;
  padding: 13px;
  background: ${colors.primary.main};
  color: #fff;
  border: none;
  border-radius: ${metrics.radius.medium};
  font-size: 15px;
  font-weight: 600;
  transition: background ${metrics.transition.fast}, transform ${metrics.transition.fast};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    transform: scale(0.97);
    background: ${colors.primary.dark};
  }
`;

export const DeleteButton = styled.button`
  padding: 13px 18px;
  background: transparent;
  color: ${colors.auxiliar.danger};
  border: 1px solid ${colors.auxiliar.danger}44;
  border-radius: ${metrics.radius.medium};
  font-size: 15px;
  font-weight: 600;
  transition: all ${metrics.transition.fast};

  &:active {
    background: ${colors.auxiliar.danger}22;
  }
`;
