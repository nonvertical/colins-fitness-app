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

// ─── Habit List ──────────────────────────────────────────────────────────────

export const List = styled.div`
  flex: 1;
  padding: 8px 0;
`;

export const HabitRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 20px;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${colors.borderSubtle};
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background ${metrics.transition.fast};
  gap: 12px;

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

export const HabitInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const HabitName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text.light.very};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HabitMeta = styled.span`
  font-size: 12px;
  color: ${colors.text.light.medium};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StreakBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.auxiliar.warning};
`;

export const TypeBadge = styled.span`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: ${metrics.radius.full};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ $type }) => {
    if ($type === 'timed') return colors.unit.time;
    if ($type === 'irregular') return colors.auxiliar.info;
    return colors.auxiliar.success;
  }};
  background: ${({ $type }) => {
    if ($type === 'timed') return `${colors.unit.time}22`;
    if ($type === 'irregular') return `${colors.auxiliar.info}22`;
    return `${colors.auxiliar.success}22`;
  }};
`;

export const DoneIndicator = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: ${colors.auxiliar.success}22;
  color: ${colors.auxiliar.success};
`;

export const QuickAddButton = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  background: ${colors.primary.main};
  color: #fff;
  border: none;
  transition: all ${metrics.transition.fast};

  &:active {
    transform: scale(0.9);
    background: ${colors.primary.dark};
  }
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
  background: rgba(0, 0, 0, 0.65);
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

export const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;

export const TypeOption = styled.button`
  padding: 9px 0;
  border-radius: ${metrics.radius.medium};
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? colors.primary.main : colors.border)};
  background: ${({ $active }) => ($active ? `${colors.primary.main}22` : colors.surfaceElevated)};
  color: ${({ $active }) => ($active ? colors.primary.main : colors.text.light.medium)};
  transition: all ${metrics.transition.fast};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }
`;

export const QuickSelectChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const QuickSelectChip = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: ${metrics.radius.full};
  font-size: 13px;
  font-weight: 500;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  color: ${colors.text.light.very};
`;

export const ChipRemove = styled.button`
  background: none;
  border: none;
  color: ${colors.text.light.medium};
  font-size: 14px;
  padding: 0 0 0 2px;
  line-height: 1;
  cursor: pointer;

  &:active {
    color: ${colors.auxiliar.danger};
  }
`;

export const AddChipRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

export const SmallInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.very};
  font-size: 13px;

  &::placeholder {
    color: ${colors.text.light.medium};
  }

  &:focus {
    border-color: ${colors.primary.main};
  }
`;

export const SmallButton = styled.button`
  padding: 8px 14px;
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  color: ${colors.text.light.medium};
  font-size: 13px;
  font-weight: 600;
  transition: all ${metrics.transition.fast};

  &:active {
    background: ${colors.border};
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

// ─── Duration Quick Select Modal ─────────────────────────────────────────────

export const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const DurationButton = styled.button`
  padding: 14px 8px;
  border-radius: ${metrics.radius.medium};
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${colors.border};
  background: ${colors.surfaceElevated};
  color: ${colors.text.light.very};
  transition: all ${metrics.transition.fast};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
    border-color: ${colors.primary.main};
    background: ${colors.primary.main}22;
    color: ${colors.primary.main};
  }
`;

// ─── Detail View ─────────────────────────────────────────────────────────────

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

export const DetailActions = styled.div`
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
    if ($variant === 'danger') return 'transparent';
    return colors.surfaceElevated;
  }};

  color: ${({ $variant }) => {
    if ($variant === 'danger') return colors.auxiliar.danger;
    return colors.text.light.very;
  }};

  border: ${({ $variant }) => (
    $variant === 'danger' ? `1px solid ${colors.auxiliar.danger}44` : 'none'
  )};

  &:active {
    transform: scale(0.97);
  }
`;

// ─── Stats Section ───────────────────────────────────────────────────────────

export const StatsSection = styled.div`
  padding: 16px 20px;
`;

export const PeriodSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

export const PeriodOption = styled.button`
  padding: 6px 12px;
  border-radius: ${metrics.radius.full};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? colors.primary.main : colors.border)};
  background: ${({ $active }) => ($active ? `${colors.primary.main}22` : 'transparent')};
  color: ${({ $active }) => ($active ? colors.primary.main : colors.text.light.medium)};
  transition: all ${metrics.transition.fast};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }
`;

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.borderSubtle};

  &:last-child {
    border-bottom: none;
  }
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${colors.text.light.medium};
`;

export const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

// ─── Quick Select Config ─────────────────────────────────────────────────────

export const ConfigSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${colors.border};
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text.light.very};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ─── Calendar ────────────────────────────────────────────────────────────────

export const CalendarSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${colors.border};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const CalendarDayLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${colors.text.light.medium};
  text-align: center;
  padding: 4px 0;
`;

export const CalendarDay = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${metrics.radius.small};
  font-size: 11px;
  font-weight: 500;
  color: ${({ $logged, $today }) => {
    if ($today) return colors.primary.main;
    if ($logged) return colors.text.light.very;
    return colors.text.light.little;
  }};
  background: ${({ $logged }) => ($logged ? `${colors.auxiliar.success}33` : 'transparent')};
  border: ${({ $today }) => ($today ? `1px solid ${colors.primary.main}` : '1px solid transparent')};
`;

export const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CalendarNavButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;

  &:active {
    opacity: 0.7;
  }
`;

export const CalendarMonthLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;
