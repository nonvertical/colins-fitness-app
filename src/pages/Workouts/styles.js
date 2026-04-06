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

export const CountBadge = styled.span`
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

// ─── Workout List ────────────────────────────────────────────────────────────

export const List = styled.div`
  flex: 1;
  padding: 8px 0;
`;

const statusColors = {
  scheduled: colors.auxiliar.info,
  started: colors.auxiliar.warning,
  finished: colors.auxiliar.success,
  overdue: colors.auxiliar.danger,
};

export const WorkoutRow = styled.button`
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

export const WorkoutInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const WorkoutName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text.light.very};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WorkoutMeta = styled.span`
  font-size: 12px;
  color: ${colors.text.light.medium};
`;

export const StatusBadge = styled.span`
  flex-shrink: 0;
  margin-left: 12px;
  padding: 3px 9px;
  border-radius: ${metrics.radius.full};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ $status }) => statusColors[$status] || colors.text.light.medium};
  background: ${({ $status }) => `${statusColors[$status] || colors.text.light.medium}22`};
`;

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

// ─── Modal ───────────────────────────────────────────────────────────────────

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
  max-height: 85vh;
  overflow-y: auto;

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

export const DurationSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DurationOption = styled.button`
  padding: 8px 14px;
  border-radius: ${metrics.radius.medium};
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => $active ? colors.primary.main : colors.border};
  background: ${({ $active }) => $active ? `${colors.primary.main}22` : colors.surfaceElevated};
  color: ${({ $active }) => $active ? colors.primary.main : colors.text.light.medium};
  transition: all ${metrics.transition.fast};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }
`;

export const DateInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 15px;
  transition: border-color ${metrics.transition.fast};
  color-scheme: light;

  &:focus {
    border-color: ${colors.primary.main};
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

// ─── Workout Detail ──────────────────────────────────────────────────────────

export const DetailPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const DetailHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${colors.bgColor};
  border-bottom: 1px solid ${colors.border};
  padding: 16px 20px;
`;

export const BackRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  font-size: 14px;
  font-weight: 500;
  padding: 4px 0;
`;

export const DetailTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.text.light.very};
  letter-spacing: -0.3px;
`;

export const DetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 13px;
  color: ${colors.text.light.medium};
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid ${colors.border};
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${metrics.radius.medium};
  font-size: 14px;
  font-weight: 600;
  border: none;
  transition: all ${metrics.transition.fast};

  background: ${({ $variant }) => {
    if ($variant === 'start') return colors.auxiliar.success;
    if ($variant === 'finish') return colors.primary.main;
    if ($variant === 'danger') return 'transparent';
    return colors.surfaceElevated;
  }};

  color: ${({ $variant }) => {
    if ($variant === 'start') return '#fff';
    if ($variant === 'finish') return '#fff';
    if ($variant === 'danger') return colors.auxiliar.danger;
    return colors.text.light.very;
  }};

  border: ${({ $variant }) => (
    $variant === 'danger' ? `1px solid ${colors.auxiliar.danger}44` : 'none'
  )};

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ─── Training Blocks ─────────────────────────────────────────────────────────

export const BlocksContainer = styled.div`
  flex: 1;
  padding: 12px 0;
`;

export const Block = styled.div`
  margin-bottom: 4px;
`;

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`;

export const BlockLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.primary.main};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const BlockActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SmallButton = styled.button`
  padding: 4px 10px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.small};
  color: ${colors.text.light.medium};
  font-size: 12px;
  font-weight: 500;
  transition: all ${metrics.transition.fast};

  &:active {
    background: ${colors.border};
  }
`;

export const ExerciseItem = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid ${colors.borderSubtle};
`;

export const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ExerciseNameLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

export const ExerciseUnitBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: ${metrics.radius.full};
  color: ${({ $type }) => {
    const c = { reps: colors.unit.reps, time: colors.unit.time, distance: colors.unit.distance, cals: colors.unit.cals };
    return c[$type] || colors.text.light.medium;
  }};
  background: ${({ $type }) => {
    const c = { reps: colors.unit.reps, time: colors.unit.time, distance: colors.unit.distance, cals: colors.unit.cals };
    return `${c[$type] || colors.text.light.medium}22`;
  }};
`;

// ─── Sets ────────────────────────────────────────────────────────────────────

export const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
`;

export const SetNumber = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.text.light.medium};
  min-width: 28px;
`;

export const SetValue = styled.span`
  font-size: 14px;
  color: ${colors.text.light.very};
  flex: 1;
`;

export const SetDeleteButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.light.little};
  font-size: 14px;
  padding: 4px;
  transition: color ${metrics.transition.fast};

  &:active {
    color: ${colors.auxiliar.danger};
  }
`;

export const AddSetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  background: none;
  border: none;
  color: ${colors.primary.main};
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;

  &:active {
    opacity: 0.7;
  }
`;

// ─── Add Set Form ────────────────────────────────────────────────────────────

export const SetForm = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 8px 0;
`;

export const ValueControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const ValueLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${colors.text.light.medium};
`;

export const AdjusterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const AdjustButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.small};
  color: ${colors.text.light.very};
  font-size: 14px;
  font-weight: 600;

  &:active {
    background: ${colors.border};
  }
`;

export const ValueDisplay = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text.light.very};
  min-width: 40px;
  text-align: center;
`;

export const SetSaveButton = styled.button`
  padding: 6px 14px;
  background: ${colors.primary.main};
  color: #fff;
  border: none;
  border-radius: ${metrics.radius.small};
  font-size: 13px;
  font-weight: 600;
  align-self: flex-end;

  &:active {
    background: ${colors.primary.dark};
  }
`;

// ─── Add Exercise to Block ───────────────────────────────────────────────────

export const AddExerciseRow = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid ${colors.borderSubtle};
`;

export const ExerciseSearchInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 14px;

  &::placeholder {
    color: ${colors.text.light.medium};
  }

  &:focus {
    border-color: ${colors.primary.main};
  }
`;

export const ExerciseDropdown = styled.div`
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

export const ExerciseDropdownItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-bottom: 1px solid ${colors.borderSubtle};
  color: ${colors.text.light.very};
  font-size: 14px;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: ${colors.surface};
  }
`;

export const AddBlockButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: calc(100% - 40px);
  margin: 8px 20px;
  padding: 10px;
  background: none;
  border: 1px dashed ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.medium};
  font-size: 13px;
  font-weight: 500;
  transition: all ${metrics.transition.fast};

  &:active {
    border-color: ${colors.primary.main};
    color: ${colors.primary.main};
  }
`;

export const NotesSection = styled.div`
  padding: 12px 20px;
  border-top: 1px solid ${colors.border};
`;

export const NotesLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${colors.text.light.medium};
  margin-bottom: 6px;
  display: block;
`;
