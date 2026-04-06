import styled from 'styled-components';
import colors from '../../assets/styles/variables/colors';
import metrics from '../../assets/styles/variables/metrics';

// ─── Page Layout ─────────────────────────────────────────────────────────────

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 100px;
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${colors.bgColor};
  border-bottom: 1px solid ${colors.border};
  padding: 20px;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.text.light.very};
  letter-spacing: -0.4px;
  margin-bottom: 4px;
`;

export const DateLabel = styled.div`
  font-size: 14px;
  color: ${colors.text.light.medium};
`;

// ─── Widget Container ──────────────────────────────────────────────────────

export const WidgetGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

export const Widget = styled.section`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.large};
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const WidgetTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const WidgetAction = styled.button`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.primary.main};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

// ─── Workouts Widget ────────────────────────────────────────────────────────

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 12px;
`;

export const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 2px;
  border-radius: ${metrics.radius.small};
  background: ${({ $isToday }) => ($isToday ? colors.surfaceElevated : 'transparent')};
  border: 1px solid ${({ $isToday }) => ($isToday ? colors.border : 'transparent')};
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:hover {
    background: ${colors.surfaceElevated};
  }
`;

export const DayLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
`;

export const DayNumber = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $isToday }) => ($isToday ? colors.text.light.very : colors.text.light.very)};
`;

export const DayDots = styled.div`
  display: flex;
  gap: 3px;
  min-height: 6px;
`;

export const WorkoutDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: ${metrics.radius.full};
  background: ${({ $status }) => {
    switch ($status) {
      case 'finished': return colors.text.light.very;
      case 'started': return colors.text.light.medium;
      case 'overdue': return colors.auxiliar.danger;
      default: return colors.text.light.little;
    }
  }};
`;

export const DayWorkoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: ${colors.surfaceElevated};
  border-radius: ${metrics.radius.small};
  margin-bottom: 4px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DayWorkoutName = styled.span`
  font-size: 13px;
  color: ${colors.text.light.very};
`;

export const DayWorkoutStatus = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: ${metrics.radius.full};
  background: ${colors.surfaceElevated};
  color: ${({ $status }) => {
    switch ($status) {
      case 'finished': return colors.text.light.very;
      case 'started': return colors.primary.main;
      case 'overdue': return colors.auxiliar.danger;
      default: return colors.text.light.medium;
    }
  }};
`;

export const EmptyDay = styled.div`
  font-size: 13px;
  color: ${colors.text.light.little};
  padding: 4px 0;
`;

// ─── Habits Widget ──────────────────────────────────────────────────────────

export const HabitCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: ${colors.surfaceElevated};
  border-radius: ${metrics.radius.small};
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HabitCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

export const HabitCardName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

export const HabitCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${colors.text.light.medium};
`;

export const StreakBadge = styled.span`
  color: ${colors.text.light.medium};
  font-weight: 600;
`;

export const PercentBadge = styled.span`
  color: ${colors.text.light.medium};
  font-weight: 600;
`;

export const DoneCheck = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${metrics.radius.full};
  background: ${colors.surfaceElevated};
  color: ${colors.text.light.very};
  font-size: 14px;
  font-weight: 700;
  border: 1px solid ${colors.border};
`;

export const HabitQuickButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${metrics.radius.full};
  background: ${colors.surfaceElevated};
  color: ${colors.text.light.medium};
  font-size: 16px;
  font-weight: 700;
  border: 1px solid ${colors.border};
  cursor: pointer;
  transition: all ${metrics.transition.fast};

  &:hover {
    border-color: ${colors.text.light.medium};
    color: ${colors.text.light.very};
  }

  &:active {
    background: ${colors.border};
  }
`;

export const TypeLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${colors.text.light.little};
`;

export const EmptyWidget = styled.div`
  font-size: 13px;
  color: ${colors.text.light.little};
  padding: 8px 0;
`;

// ─── Health Widget ──────────────────────────────────────────────────────────

export const HealthStat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.borderSubtle};
  }
`;

export const HealthStatLabel = styled.span`
  font-size: 13px;
  color: ${colors.text.light.medium};
`;

export const HealthStatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

// ─── Quick Actions ──────────────────────────────────────────────────────────

export const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px 20px;
`;

export const QuickActionButton = styled.button`
  flex: 1;
  padding: 14px;
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  background: ${colors.surface};
  color: ${colors.text.light.very};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: ${colors.surfaceElevated};
  }
`;

// ─── Log Modal ──────────────────────────────────────────────────────────────

export const LogModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 769px) {
    align-items: center;
  }
`;

export const LogModalSheet = styled.div`
  background: ${colors.surface};
  border-radius: ${metrics.radius.large} ${metrics.radius.large} 0 0;
  padding: 20px;
  width: 100%;
  max-width: 420px;

  @media (min-width: 769px) {
    border-radius: ${metrics.radius.large};
  }
`;

export const LogModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text.light.very};
  margin-bottom: 16px;
`;

export const LogChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const LogChip = styled.button`
  padding: 8px 16px;
  border-radius: ${metrics.radius.full};
  border: 1px solid ${({ $selected }) => ($selected ? colors.text.light.very : colors.border)};
  background: ${({ $selected }) => ($selected ? colors.text.light.very : colors.surface)};
  color: ${({ $selected }) => ($selected ? '#fff' : colors.text.light.very)};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${metrics.transition.fast};

  &:hover {
    border-color: ${colors.text.light.medium};
  }
`;

export const LogCustomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const LogInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.small};
  font-size: 14px;
  color: ${colors.text.light.very};
  background: ${colors.surface};

  &:focus {
    border-color: ${colors.text.light.medium};
  }
`;

export const LogInputLabel = styled.span`
  font-size: 13px;
  color: ${colors.text.light.medium};
  white-space: nowrap;
`;

export const LogSectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
`;

export const LogModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const LogCancelButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.small};
  background: ${colors.surface};
  color: ${colors.text.light.medium};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const LogSaveButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: ${metrics.radius.small};
  background: ${colors.text.light.very};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
`;
