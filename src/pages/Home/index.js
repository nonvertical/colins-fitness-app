import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useLocalStorage from '../../hooks/useLocalStorage';
import {
  Page,
  Header,
  PageTitle,
  DateLabel,
  WeekSection,
  SectionTitle,
  WeekGrid,
  DayColumn,
  DayLabel,
  DayNumber,
  DayDots,
  WorkoutDot,
  DayDetail,
  DayDetailHeader,
  DayWorkoutRow,
  DayWorkoutName,
  DayWorkoutStatus,
  EmptyDay,
  HabitsSection,
  HabitCard,
  HabitCardInfo,
  HabitCardName,
  HabitCardMeta,
  StreakBadge,
  DoneCheck,
  HabitQuickButton,
  EmptyHabits,
  QuickActions,
  QuickActionButton,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  DurationGrid,
  DurationButton,
  EmptyDurationState,
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

function computeYearTotal(logs, habitId) {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const habitLogs = logs
    .filter((l) => l.habit_id === habitId && new Date(l.timestamp) >= yearStart)
    .map((l) => l.timestamp.split('T')[0]);
  const uniqueDays = new Set(habitLogs);
  const totalDays = daysBetween(yearStart, new Date()) + 1;
  return { done: uniqueDays.size, total: totalDays };
}

function isDoneToday(logs, habitId) {
  const today = todayStr();
  return logs.some((l) => l.habit_id === habitId && l.timestamp.startsWith(today));
}

function formatDuration(minutes) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return h + 'h';
    return h + 'h ' + m + 'm';
  }
  return minutes + 'm';
}

export default function Home() {
  const [workouts] = useLocalStorage('workouts', []);
  const [habits] = useLocalStorage('habits', []);
  const [habitLogs, setHabitLogs] = useLocalStorage('habit_logs', []);
  const [selectedDay, setSelectedDay] = useState(todayStr());
  const [durationModal, setDurationModal] = useState(null);
  const navigate = useNavigate();

  const weekDays = getWeekDays();
  const today = todayStr();
  const currentYear = new Date().getFullYear();

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Workouts for each day
  function workoutsForDay(dateStr) {
    return workouts.filter((w) => w.date === dateStr);
  }

  const selectedDayWorkouts = workoutsForDay(selectedDay);
  const selectedDayLabel = new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Habit logging
  function logOncePerDay(habitId) {
    if (isDoneToday(habitLogs, habitId)) return;
    setHabitLogs((prev) => [
      ...prev,
      {
        id: generateId(),
        habit_id: habitId,
        timestamp: new Date().toISOString(),
        value: true,
      },
    ]);
  }

  function logDuration(minutes) {
    setHabitLogs((prev) => [
      ...prev,
      {
        id: generateId(),
        habit_id: durationModal.id,
        timestamp: new Date().toISOString(),
        value: minutes,
      },
    ]);
    setDurationModal(null);
  }

  function handleDurationBackdropClick(e) {
    if (e.target === e.currentTarget) setDurationModal(null);
  }

  return (
    <Page>
      <Header>
        <PageTitle>Dojo</PageTitle>
        <DateLabel>{todayFormatted}</DateLabel>
      </Header>

      {/* ─── Week View ────────────────────────────────────────────────────── */}
      <WeekSection>
        <SectionTitle>This Week</SectionTitle>
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
      </WeekSection>

      {/* ─── Selected Day Detail ──────────────────────────────────────────── */}
      <DayDetail>
        <DayDetailHeader>{selectedDayLabel}</DayDetailHeader>
        {selectedDayWorkouts.length === 0 ? (
          <EmptyDay>No workouts scheduled</EmptyDay>
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
      </DayDetail>

      {/* ─── Habits Strip ─────────────────────────────────────────────────── */}
      <HabitsSection>
        <SectionTitle>Habits</SectionTitle>
        {habits.length === 0 ? (
          <EmptyHabits>No habits tracked yet</EmptyHabits>
        ) : (
          habits.slice(0, 3).map((habit) => {
            const streak = computeStreak(habitLogs, habit.id);
            const yearTotal = computeYearTotal(habitLogs, habit.id);
            const doneToday = isDoneToday(habitLogs, habit.id);

            return (
              <HabitCard key={habit.id}>
                <HabitCardInfo>
                  <HabitCardName>{habit.name}</HabitCardName>
                  <HabitCardMeta>
                    {streak > 0 && (
                      <StreakBadge>
                        &#128293; {streak}d
                      </StreakBadge>
                    )}
                    <span>{yearTotal.done}/{yearTotal.total} days in {currentYear}</span>
                  </HabitCardMeta>
                </HabitCardInfo>
                {habit.type === 'once_per_day' && doneToday ? (
                  <DoneCheck>&#10003;</DoneCheck>
                ) : (
                  <HabitQuickButton
                    type="button"
                    onClick={() => {
                      if (habit.type === 'once_per_day') {
                        logOncePerDay(habit.id);
                      } else {
                        setDurationModal(habit);
                      }
                    }}
                  >
                    +
                  </HabitQuickButton>
                )}
              </HabitCard>
            );
          })
        )}
      </HabitsSection>

      {/* ─── Quick Actions ────────────────────────────────────────────────── */}
      <QuickActions>
        <QuickActionButton type="button" onClick={() => navigate('/workouts')}>
          + Workout
        </QuickActionButton>
        <QuickActionButton type="button" onClick={() => navigate('/habits')}>
          + Habit
        </QuickActionButton>
      </QuickActions>

      {/* ─── Duration Modal ───────────────────────────────────────────────── */}
      {durationModal && (
        <ModalBackdrop onClick={handleDurationBackdropClick}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>Log Duration</ModalTitle>
            {durationModal.quick_select_options.length > 0 ? (
              <DurationGrid>
                {durationModal.quick_select_options.map((mins) => (
                  <DurationButton
                    key={mins}
                    type="button"
                    onClick={() => logDuration(mins)}
                  >
                    {formatDuration(mins)}
                  </DurationButton>
                ))}
              </DurationGrid>
            ) : (
              <EmptyDurationState>
                No quick select options configured. Edit this habit to add duration options.
              </EmptyDurationState>
            )}
          </ModalSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
