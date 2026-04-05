import React, { useState } from 'react';

import {
  DetailPage,
  DetailHeader,
  BackRow,
  BackButton,
  DetailTitle,
  DetailMeta,
  TypeBadge,
  StreakBadge,
  DetailActions,
  ActionButton,
  StatsSection,
  PeriodSelector,
  PeriodOption,
  StatRow,
  StatLabel,
  StatValue,
  SectionTitle,
  CalendarSection,
  CalendarGrid,
  CalendarDayLabel,
  CalendarDay,
  CalendarNav,
  CalendarNavButton,
  CalendarMonthLabel,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  TypeSelector,
  TypeOption,
  ModalActions,
  SaveButton,
} from './styles';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}

function computeStreak(logs) {
  const uniqueDays = [...new Set(logs.map((l) => l.timestamp.split('T')[0]))].sort().reverse();
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

const PERIODS = [
  { key: 'week', label: '7 Days', days: 7 },
  { key: 'month', label: '30 Days', days: 30 },
  { key: '3month', label: '90 Days', days: 90 },
  { key: 'all', label: 'Since Started', days: null },
];

function computePeriodStats(logs, periodKey, trackingStartDate) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let start;
  const periodDef = PERIODS.find((p) => p.key === periodKey);

  if (periodDef.days) {
    start = new Date();
    start.setDate(start.getDate() - periodDef.days);
    start.setHours(0, 0, 0, 0);
  } else {
    start = trackingStartDate
      ? new Date(`${trackingStartDate}T00:00:00`)
      : new Date(now.getFullYear(), 0, 1);
  }

  const periodLogs = logs.filter((l) => {
    const d = new Date(l.timestamp);
    return d >= start && d <= now;
  });

  const uniqueDays = new Set(periodLogs.map((l) => l.timestamp.split('T')[0]));
  const totalDays = daysBetween(start, new Date()) + 1;
  const percentage = totalDays > 0 ? Math.round((uniqueDays.size / totalDays) * 100) : 0;

  return {
    daysLogged: uniqueDays.size,
    totalDays,
    percentage,
    entries: periodLogs.length,
  };
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i += 1) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    days.push(d);
  }
  return days;
}

export default function HabitDetail({ habit, logs, onUpdate, onDelete, onBack }) {
  const [period, setPeriod] = useState('month');
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', type: 'daily' });

  const isDaily = habit.type !== 'irregular';
  const streak = computeStreak(logs);
  const stats = computePeriodStats(logs, period, habit.tracking_start_date);

  const loggedDays = new Set(logs.map((l) => l.timestamp.split('T')[0]));
  const calendarDays = getCalendarDays(calYear, calMonth);
  const today = todayStr();

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  }

  const monthLabel = new Date(calYear, calMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function openEditModal() {
    setEditForm({ name: habit.name, type: habit.type || 'daily' });
    setEditModal(true);
  }

  function handleEditSave() {
    const trimmedName = editForm.name.trim();
    if (!trimmedName) return;
    onUpdate({ ...habit, name: trimmedName, type: editForm.type });
    setEditModal(false);
  }

  function handleEditBackdropClick(e) {
    if (e.target === e.currentTarget) setEditModal(false);
  }

  return (
    <DetailPage>
      <DetailHeader>
        <BackRow>
          <BackButton onClick={onBack}>&#8592; Habits</BackButton>
        </BackRow>
        <DetailTitle>{habit.name}</DetailTitle>
        <DetailMeta>
          <TypeBadge $type={habit.type}>
            {isDaily ? 'daily' : 'irregular'}
          </TypeBadge>
          {isDaily && streak > 0 && (
            <StreakBadge>&#128293; {streak} day streak</StreakBadge>
          )}
          {habit.tracking_start_date && (
            <span>Since {habit.tracking_start_date}</span>
          )}
        </DetailMeta>
      </DetailHeader>

      <DetailActions>
        <ActionButton type="button" onClick={openEditModal}>Edit</ActionButton>
        <ActionButton type="button" $variant="danger" onClick={onDelete}>Delete</ActionButton>
      </DetailActions>

      {/* ─── Tracking Stats ────────────────────────────────────────────────── */}
      <StatsSection>
        <SectionTitle>Tracking</SectionTitle>
        <PeriodSelector>
          {PERIODS.map((p) => (
            <PeriodOption
              key={p.key}
              type="button"
              $active={period === p.key}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </PeriodOption>
          ))}
        </PeriodSelector>

        {isDaily && (
          <StatRow>
            <StatLabel>Completion Rate</StatLabel>
            <StatValue>{stats.percentage}%</StatValue>
          </StatRow>
        )}
        <StatRow>
          <StatLabel>Days Logged</StatLabel>
          <StatValue>{stats.daysLogged} / {stats.totalDays} days</StatValue>
        </StatRow>
        {isDaily && (
          <StatRow>
            <StatLabel>Current Streak</StatLabel>
            <StatValue>{streak} day{streak !== 1 ? 's' : ''}</StatValue>
          </StatRow>
        )}
        {!isDaily && (
          <StatRow>
            <StatLabel>Total Entries</StatLabel>
            <StatValue>{stats.entries}</StatValue>
          </StatRow>
        )}
      </StatsSection>

      {/* ─── Calendar ─────────────────────────────────────────────────────── */}
      <CalendarSection>
        <SectionTitle>Calendar</SectionTitle>
        <CalendarNav>
          <CalendarNavButton type="button" onClick={prevMonth}>
            &#8592; Prev
          </CalendarNavButton>
          <CalendarMonthLabel>{monthLabel}</CalendarMonthLabel>
          <CalendarNavButton type="button" onClick={nextMonth}>
            Next &#8594;
          </CalendarNavButton>
        </CalendarNav>
        <CalendarGrid>
          {DAY_LABELS.map((d) => (
            <CalendarDayLabel key={d}>{d}</CalendarDayLabel>
          ))}
          {calendarDays.map((day, idx) => {
            if (day === null) {
              // eslint-disable-next-line react/no-array-index-key
              return <div key={`empty-${idx}`} />;
            }
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isLogged = loggedDays.has(dateStr);
            const isToday = dateStr === today;
            return (
              <CalendarDay key={dateStr} $logged={isLogged} $today={isToday}>
                {day}
              </CalendarDay>
            );
          })}
        </CalendarGrid>
      </CalendarSection>

      {/* ─── Edit Modal ───────────────────────────────────────────────────── */}
      {editModal && (
        <ModalBackdrop onClick={handleEditBackdropClick}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>Edit Habit</ModalTitle>

            <Label>Name</Label>
            <TextInput
              type="text"
              placeholder="Habit name"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(); }}
            />

            <Label>Frequency</Label>
            <TypeSelector>
              <TypeOption
                type="button"
                $active={editForm.type === 'daily'}
                onClick={() => setEditForm((f) => ({ ...f, type: 'daily' }))}
              >
                Daily
              </TypeOption>
              <TypeOption
                type="button"
                $active={editForm.type === 'irregular'}
                onClick={() => setEditForm((f) => ({ ...f, type: 'irregular' }))}
              >
                Irregular
              </TypeOption>
            </TypeSelector>

            <ModalActions>
              <SaveButton onClick={handleEditSave} disabled={!editForm.name.trim()}>
                Save Changes
              </SaveButton>
            </ModalActions>
          </ModalSheet>
        </ModalBackdrop>
      )}
    </DetailPage>
  );
}
