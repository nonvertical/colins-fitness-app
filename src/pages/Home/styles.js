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

// ─── Week View ──────────────────────────────────────────────────────────────

export const WeekSection = styled.section`
  padding: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

export const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: ${metrics.radius.medium};
  background: ${({ $isToday }) => ($isToday ? colors.surfaceElevated : 'transparent')};
  border: 1px solid ${({ $isToday }) => ($isToday ? colors.primary.main : 'transparent')};
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:hover {
    background: ${colors.surfaceElevated};
  }
`;

export const DayLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.text.light.medium};
  text-transform: uppercase;
`;

export const DayNumber = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isToday }) => ($isToday ? colors.primary.main : colors.text.light.very)};
`;

export const DayDots = styled.div`
  display: flex;
  gap: 3px;
  min-height: 8px;
`;

export const WorkoutDot = styled.div`
  width: 8px;
  height: 8px;
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

// ─── Day Detail ─────────────────────────────────────────────────────────────

export const DayDetail = styled.div`
  padding: 0 20px 20px;
`;

export const DayDetailHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.light.very};
  margin-bottom: 8px;
`;

export const DayWorkoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
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

export const DayWorkoutName = styled.span`
  font-size: 14px;
  color: ${colors.text.light.very};
`;

export const DayWorkoutStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: ${metrics.radius.full};
  background: ${({ $status }) => {
    switch ($status) {
      case 'finished': return 'rgba(34, 197, 94, 0.15)';
      case 'started': return 'rgba(255, 107, 53, 0.15)';
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
  padding: 8px 0;
`;

// ─── Habits Strip ───────────────────────────────────────────────────────────

export const HabitsSection = styled.section`
  padding: 0 20px 20px;
`;

export const HabitCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${metrics.radius.medium};
  margin-bottom: 8px;
`;

export const HabitCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HabitCardName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.text.light.very};
`;

export const HabitCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${colors.text.light.medium};
`;

export const StreakBadge = styled.span`
  color: ${colors.auxiliar.warning};
  font-weight: 600;
`;

export const DoneCheck = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${metrics.radius.full};
  background: rgba(34, 197, 94, 0.15);
  color: ${colors.auxiliar.success};
  font-size: 16px;
  font-weight: 700;
`;

export const HabitQuickButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${metrics.radius.full};
  background: rgba(255, 107, 53, 0.15);
  color: ${colors.primary.main};
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: rgba(255, 107, 53, 0.3);
  }
`;

export const EmptyHabits = styled.div`
  font-size: 13px;
  color: ${colors.text.light.little};
  padding: 12px 0;
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

// ─── Duration Modal ─────────────────────────────────────────────────────────

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${colors.surface};
  border-top-left-radius: ${metrics.radius.large};
  border-top-right-radius: ${metrics.radius.large};
  padding: 20px;
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

export const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const DurationButton = styled.button`
  padding: 14px;
  border-radius: ${metrics.radius.medium};
  background: ${colors.surfaceElevated};
  border: 1px solid ${colors.border};
  color: ${colors.text.light.very};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${metrics.transition.fast};

  &:active {
    background: ${colors.primary.main};
  }
`;

export const EmptyDurationState = styled.div`
  font-size: 13px;
  color: ${colors.text.light.little};
  text-align: center;
  padding: 20px 0;
`;
