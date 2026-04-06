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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02);
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
  border: 1px solid ${({ $isToday }) => ($isToday ? colors.primary.main : 'transparent')};
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
  color: ${({ $isToday }) => ($isToday ? colors.primary.main : colors.text.light.very)};
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
      case 'finished': return colors.auxiliar.success;
      case 'started': return colors.primary.main;
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
  background: ${({ $status }) => {
    switch ($status) {
      case 'finished': return 'rgba(34, 197, 94, 0.15)';
      case 'started': return 'rgba(230, 0, 126, 0.15)';
      case 'overdue': return 'rgba(248, 113, 113, 0.15)';
      default: return 'rgba(153, 153, 153, 0.15)';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'finished': return colors.auxiliar.success;
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
  color: ${colors.auxiliar.warning};
  font-weight: 600;
`;

export const PercentBadge = styled.span`
  color: ${({ $pct }) => {
    if ($pct >= 80) return colors.auxiliar.success;
    if ($pct >= 50) return colors.auxiliar.warning;
    return colors.auxiliar.danger;
  }};
  font-weight: 600;
`;

export const DoneCheck = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${metrics.radius.full};
  background: rgba(34, 197, 94, 0.15);
  color: ${colors.auxiliar.success};
  font-size: 14px;
  font-weight: 700;
`;

export const HabitQuickButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${metrics.radius.full};
  background: rgba(230, 0, 126, 0.15);
  color: ${colors.primary.main};
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;

  &:active {
    background: rgba(230, 0, 126, 0.3);
  }
`;

export const TypeLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${({ $type }) => ($type === 'irregular' ? colors.auxiliar.info : colors.auxiliar.success)};
  margin-right: 6px;
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
  color: ${colors.primary.main};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: ${colors.surfaceElevated};
  }
`;
