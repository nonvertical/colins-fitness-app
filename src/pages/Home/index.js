import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useLocalStorage from '../../hooks/useLocalStorage';
import {
  Page,
  Header,
  PageTitle,
  DateLabel,
  WidgetGrid,
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetAction,
  WeekGrid,
  DayColumn,
  DayLabel,
  DayNumber,
  DayDots,
  WorkoutDot,
  DayWorkoutRow,
  DayWorkoutName,
  DayWorkoutStatus,
  EmptyDay,
  HabitCard,
  HabitCardInfo,
  HabitCardName,
  HabitCardMeta,
  StreakBadge,
  PercentBadge,
  DoneCheck,
  HabitQuickButton,
  TypeLabel,
  EmptyWidget,
  HealthStat,
  HealthStatLabel,
  HealthStatValue,
  QuickActions,
  QuickActionButton,
  LogModalBackdrop,
  LogModalSheet,
  LogModalTitle,
  LogChipGroup,
  LogChip,
  LogCustomRow,
  LogInput,
  LogInputLabel,
  LogSectionLabel,
  LogModalActions,
  LogCancelButton,
  LogSaveButton,
} from './styles';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function getWeekDays() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);

  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
    });
  }
  return days;
}

function computeDisplayStatus(workout) {
  if (workout.status === 'finished') return 'finished';
  if (workout.status === 'started') return 'started';
  if (workout.date && new Date(workout.date + 'T23:59:59') < new Date() && workout.status === 'scheduled') {
    return 'overdue';
  }
  return workout.status;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}

function computeStreak(logs, habitId) {
  const habitLogs = logs
    .filter((l) => l.habit_id === habitId)
    .map((l) => l.timestamp.split('T')[0]);
  const uniqueDays = [...new Set(habitLogs)].sort().reverse();
  if (uniqueDays.length === 0) return 0;

  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterdayDate) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    if (daysBetween(uniqueDays[i - 1], uniqueDays[i]) === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function computePercentage(logs, habitId, daysBack) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - daysBack);
  start.setHours(0, 0, 0, 0);

  const habitLogs = logs
    .filter((l) => l.habit_id === habitId && new Date(l.timestamp) >= start)
    .map((l) => l.timestamp.split('T')[0]);
  const uniqueDays = new Set(habitLogs);
  return Math.round((uniqueDays.size / daysBack) * 100);
}

function isDoneToday(logs, habitId) {
  const today = todayStr();
  return logs.some((l) => l.habit_id === habitId && l.timestamp.startsWith(today));
}

function todayCount(logs, habitId) {
  const today = todayStr();
  return logs.filter((l) => l.habit_id === habitId && l.timestamp.startsWith(today)).length;
}

function formatDuration(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${seconds}s`;
}

const DEFAULT_PROFILE = {
  weight: null,
  weight_unit: 'lbs',
  body_fat: null,
  goals: [],
  prs: [],
  custom_metrics: [],
};

export default function Home() {
  const [workouts] = useLocalStorage('workouts', []);
  const [habits] = useLocalStorage('habits', []);
  const [habitLogs, setHabitLogs] = useLocalStorage('habit_logs', []);
  const [profile] = useLocalStorage('health_profile', DEFAULT_PROFILE);
  const [selectedDay, setSelectedDay] = useState(todayStr());
  const [logModal, setLogModal] = useState(null); // { habit, selectedTime, selectedCount, customTime, customCount }
  const navigate = useNavigate();

  const weekDays = getWeekDays();
  const today = todayStr();

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const activeHabits = habits.filter((h) => h.active !== false);

  function workoutsForDay(dateStr) {
    return workouts.filter((w) => w.date === dateStr);
  }

  const selectedDayWorkouts = workoutsForDay(selectedDay);
  const selectedDayLabel = new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  function directLog(habit) {
    const isDaily = habit.type !== 'irregular';
    if (isDaily && isDoneToday(habitLogs, habit.id)) return;
    setHabitLogs((prev) => [
      ...prev,
      { id: generateId(), habit_id: habit.id, timestamp: new Date().toISOString(), value: true },
    ]);
  }

  function openLogModal(habit) {
    const hasTimed = habit.timed && habit.quick_time_options && habit.quick_time_options.length > 0;
    const hasCounted = habit.counted && habit.quick_count_options && habit.quick_count_options.length > 0;

    if (!hasTimed && !hasCounted) {
      directLog(habit);
      return;
    }

    setLogModal({
      habit,
      selectedTime: null,
      selectedCount: null,
      customTime: '',
      customCount: '',
    });
  }

  function submitLog() {
    if (!logModal) return;
    const { habit, selectedTime, selectedCount, customTime, customCount } = logModal;

    const logEntry = {
      id: generateId(),
      habit_id: habit.id,
      timestamp: new Date().toISOString(),
      value: true,
    };

    // Attach time if selected
    const timeVal = selectedTime || (customTime ? Number(customTime) * 60 : null);
    if (timeVal) logEntry.duration = timeVal;

    // Attach count if selected
    const countVal = selectedCount || (customCount ? Number(customCount) : null);
    if (countVal) logEntry.count = countVal;

    setHabitLogs((prev) => [...prev, logEntry]);
    setLogModal(null);
  }

  return (
    <Page>
      <Header>
        <PageTitle>Dojo</PageTitle>
        <DateLabel>{todayFormatted}</DateLabel>
      </Header>

      <WidgetGrid>
        {/* ─── Workouts Widget ──────────────────────────────────────────── */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle>Training</WidgetTitle>
            <WidgetAction onClick={() => navigate('/workouts')}>View All</WidgetAction>
          </WidgetHeader>

          <WeekGrid>
            {weekDays.map((day) => {
              const dayWorkouts = workoutsForDay(day.date);
              const isToday = day.date === today;
              return (
                <DayColumn
                  key={day.date}
                  $isToday={isToday}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <DayLabel>{day.dayLabel}</DayLabel>
                  <DayNumber $isToday={isToday}>{day.dayNumber}</DayNumber>
                  <DayDots>
                    {dayWorkouts.map((w) => (
                      <WorkoutDot key={w.id} $status={computeDisplayStatus(w)} />
                    ))}
                  </DayDots>
                </DayColumn>
              );
            })}
          </WeekGrid>

          {selectedDayWorkouts.length === 0 ? (
            <EmptyDay>{selectedDayLabel} — no workouts</EmptyDay>
          ) : (
            selectedDayWorkouts.map((w) => {
              const status = computeDisplayStatus(w);
              return (
                <DayWorkoutRow key={w.id} onClick={() => navigate('/workouts')}>
                  <DayWorkoutName>{w.name}</DayWorkoutName>
                  <DayWorkoutStatus $status={status}>{status}</DayWorkoutStatus>
                </DayWorkoutRow>
              );
            })
          )}
        </Widget>

        {/* ─── Habits Widget ────────────────────────────────────────────── */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle>Habits</WidgetTitle>
            <WidgetAction onClick={() => navigate('/habits')}>View All</WidgetAction>
          </WidgetHeader>

          {activeHabits.length === 0 ? (
            <EmptyWidget>No active habits</EmptyWidget>
          ) : (
            activeHabits.map((habit) => {
              const streak = computeStreak(habitLogs, habit.id);
              const pct7 = computePercentage(habitLogs, habit.id, 7);
              const doneToday = isDoneToday(habitLogs, habit.id);
              const count = todayCount(habitLogs, habit.id);
              const isDaily = habit.type !== 'irregular';

              return (
                <HabitCard key={habit.id}>
                  <HabitCardInfo>
                    <HabitCardName>{habit.name}</HabitCardName>
                    <HabitCardMeta>
                      <TypeLabel $type={habit.type}>
                        {isDaily ? 'daily' : 'irregular'}
                      </TypeLabel>
                      {isDaily && streak > 0 && (
                        <StreakBadge>&#128293; {streak}d</StreakBadge>
                      )}
                      {isDaily && (
                        <PercentBadge>{pct7}% (7d)</PercentBadge>
                      )}
                      {!isDaily && count > 0 && (
                        <span>{count}x today</span>
                      )}
                    </HabitCardMeta>
                  </HabitCardInfo>
                  {isDaily && doneToday ? (
                    <DoneCheck>&#10003;</DoneCheck>
                  ) : (
                    <HabitQuickButton
                      type="button"
                      onClick={() => openLogModal(habit)}
                    >
                      +
                    </HabitQuickButton>
                  )}
                </HabitCard>
              );
            })
          )}
        </Widget>

        {/* ─── Health Profile Widget ────────────────────────────────────── */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle>Health</WidgetTitle>
            <WidgetAction onClick={() => navigate('/health')}>View All</WidgetAction>
          </WidgetHeader>

          {profile.weight ? (
            <HealthStat>
              <HealthStatLabel>Weight</HealthStatLabel>
              <HealthStatValue>{profile.weight} {profile.weight_unit}</HealthStatValue>
            </HealthStat>
          ) : null}
          {profile.body_fat ? (
            <HealthStat>
              <HealthStatLabel>Body Fat</HealthStatLabel>
              <HealthStatValue>{profile.body_fat}%</HealthStatValue>
            </HealthStat>
          ) : null}
          {profile.prs && profile.prs.length > 0 && (
            <HealthStat>
              <HealthStatLabel>PRs</HealthStatLabel>
              <HealthStatValue>{profile.prs.length} tracked</HealthStatValue>
            </HealthStat>
          )}
          {!profile.weight && !profile.body_fat && (!profile.prs || profile.prs.length === 0) && (
            <EmptyWidget>Tap "View All" to add health data</EmptyWidget>
          )}
        </Widget>
      </WidgetGrid>

      <QuickActions>
        <QuickActionButton type="button" onClick={() => navigate('/workouts')}>
          + Workout
        </QuickActionButton>
        <QuickActionButton type="button" onClick={() => navigate('/habits')}>
          + Habit
        </QuickActionButton>
      </QuickActions>

      {/* ─── Log Modal ──────────────────────────────────────────────────── */}
      {logModal && (
        <LogModalBackdrop onClick={() => setLogModal(null)}>
          <LogModalSheet onClick={(e) => e.stopPropagation()}>
            <LogModalTitle>Log {logModal.habit.name}</LogModalTitle>

            {logModal.habit.timed && logModal.habit.quick_time_options && logModal.habit.quick_time_options.length > 0 && (
              <>
                <LogSectionLabel>Duration</LogSectionLabel>
                <LogChipGroup>
                  {logModal.habit.quick_time_options.map((seconds) => (
                    <LogChip
                      key={seconds}
                      $selected={logModal.selectedTime === seconds}
                      onClick={() => setLogModal((m) => ({
                        ...m,
                        selectedTime: m.selectedTime === seconds ? null : seconds,
                        customTime: '',
                      }))}
                    >
                      {formatDuration(seconds)}
                    </LogChip>
                  ))}
                </LogChipGroup>
                <LogCustomRow>
                  <LogInput
                    type="number"
                    placeholder="Custom"
                    value={logModal.customTime}
                    onChange={(e) => setLogModal((m) => ({ ...m, customTime: e.target.value, selectedTime: null }))}
                  />
                  <LogInputLabel>minutes</LogInputLabel>
                </LogCustomRow>
              </>
            )}

            {logModal.habit.counted && logModal.habit.quick_count_options && logModal.habit.quick_count_options.length > 0 && (
              <>
                <LogSectionLabel>Count</LogSectionLabel>
                <LogChipGroup>
                  {logModal.habit.quick_count_options.map((count) => (
                    <LogChip
                      key={count}
                      $selected={logModal.selectedCount === count}
                      onClick={() => setLogModal((m) => ({
                        ...m,
                        selectedCount: m.selectedCount === count ? null : count,
                        customCount: '',
                      }))}
                    >
                      {count}
                    </LogChip>
                  ))}
                </LogChipGroup>
                <LogCustomRow>
                  <LogInput
                    type="number"
                    placeholder="Custom"
                    value={logModal.customCount}
                    onChange={(e) => setLogModal((m) => ({ ...m, customCount: e.target.value, selectedCount: null }))}
                  />
                  <LogInputLabel>count</LogInputLabel>
                </LogCustomRow>
              </>
            )}

            <LogModalActions>
              <LogCancelButton onClick={() => setLogModal(null)}>Cancel</LogCancelButton>
              <LogSaveButton onClick={submitLog}>Log</LogSaveButton>
            </LogModalActions>
          </LogModalSheet>
        </LogModalBackdrop>
      )}
    </Page>
  );
}
