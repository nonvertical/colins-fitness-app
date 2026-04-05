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
  ConfigSection,
  SectionTitle,
  QuickSelectChips,
  QuickSelectChip,
  ChipRemove,
  AddChipRow,
  SmallInput,
  SmallButton,
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
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    const diff = daysBetween(uniqueDays[i - 1], uniqueDays[i]);
    if (diff === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function formatDuration(minutes) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }
  return `${minutes}m`;
}

const PERIODS = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'Since Started' },
];

function getPeriodStart(periodKey, trackingStartDate) {
  const now = new Date();
  switch (periodKey) {
    case 'week': {
      const d = new Date(now);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'quarter': {
      const qMonth = Math.floor(now.getMonth() / 3) * 3;
      return new Date(now.getFullYear(), qMonth, 1);
    }
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'all':
      return trackingStartDate ? new Date(trackingStartDate + 'T00:00:00') : new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.getFullYear(), 0, 1);
  }
}

function computePeriodStats(logs, periodKey, trackingStartDate, habitType) {
  const start = getPeriodStart(periodKey, trackingStartDate);
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const periodLogs = logs.filter((l) => {
    const d = new Date(l.timestamp);
    return d >= start && d <= now;
  });

  const uniqueDays = new Set(periodLogs.map((l) => l.timestamp.split('T')[0]));
  const totalDays = daysBetween(start, new Date()) + 1;

  const stats = {
    daysLogged: uniqueDays.size,
    totalDays,
  };

  if (habitType === 'timed') {
    const totalMinutes = periodLogs.reduce((sum, l) => sum + (typeof l.value === 'number' ? l.value : 0), 0);
    stats.totalMinutes = totalMinutes;
    stats.entries = periodLogs.length;
  }

  return stats;
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
  const [editForm, setEditForm] = useState({ name: '', type: 'once_per_day' });
  const [chipInput, setChipInput] = useState('');

  const streak = computeStreak(logs);
  const stats = computePeriodStats(logs, period, habit.tracking_start_date, habit.type);

  // Calendar log lookup
  const loggedDays = new Set(
    logs.map((l) => l.timestamp.split('T')[0]),
  );

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

  // ─── Edit Modal ────────────────────────────────────────────────────────────

  function openEditModal() {
    setEditForm({
      name: habit.name,
      type: habit.type,
      quick_select_options: [...habit.quick_select_options],
    });
    setChipInput('');
    setEditModal(true);
  }

  function handleEditSave() {
    const trimmedName = editForm.name.trim();
    if (!trimmedName) return;
    onUpdate({
      ...habit,
      name: trimmedName,
      type: editForm.type,
      quick_select_options: editForm.type === 'timed' ? editForm.quick_select_options : [],
    });
    setEditModal(false);
  }

  function addChip() {
    const val = parseInt(chipInput, 10);
    if (!val || val <= 0) return;
    if (editForm.quick_select_options.includes(val)) return;
    setEditForm((f) => ({
      ...f,
      quick_select_options: [...f.quick_select_options, val].sort((a, b) => a - b),
    }));
    setChipInput('');
  }

  function removeChip(minutes) {
    setEditForm((f) => ({
      ...f,
      quick_select_options: f.quick_select_options.filter((v) => v !== minutes),
    }));
  }

  function handleEditBackdropClick(e) {
    if (e.target === e.currentTarget) setEditModal(false);
  }

  // ─── Quick Select Config (inline) ──────────────────────────────────────────

  function addQuickSelectOption() {
    const val = parseInt(chipInput, 10);
    if (!val || val <= 0) return;
    if (habit.quick_select_options.includes(val)) return;
    onUpdate({
      ...habit,
      quick_select_options: [...habit.quick_select_options, val].sort((a, b) => a - b),
    });
    setChipInput('');
  }

  function removeQuickSelectOption(minutes) {
    onUpdate({
      ...habit,
      quick_select_options: habit.quick_select_options.filter((v) => v !== minutes),
    });
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
            {habit.type === 'timed' ? 'timed' : 'daily'}
          </TypeBadge>
          {streak > 0 && (
            <StreakBadge>
              &#128293; {streak} day streak
            </StreakBadge>
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

        <StatRow>
          <StatLabel>Days Logged</StatLabel>
          <StatValue>{stats.daysLogged} / {stats.totalDays} days</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Completion Rate</StatLabel>
          <StatValue>
            {stats.totalDays > 0
              ? Math.round((stats.daysLogged / stats.totalDays) * 100)
              : 0}%
          </StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Current Streak</StatLabel>
          <StatValue>{streak} day{streak !== 1 ? 's' : ''}</StatValue>
        </StatRow>
        {habit.type === 'timed' && (
          <>
            <StatRow>
              <StatLabel>Total Time</StatLabel>
              <StatValue>{formatDuration(stats.totalMinutes || 0)}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Total Entries</StatLabel>
              <StatValue>{stats.entries || 0}</StatValue>
            </StatRow>
          </>
        )}
      </StatsSection>

      {/* ─── Quick Select Config (timed habits) ──────────────────────────── */}
      {habit.type === 'timed' && (
        <ConfigSection>
          <SectionTitle>Quick Select Options</SectionTitle>
          <QuickSelectChips>
            {habit.quick_select_options.map((mins) => (
              <QuickSelectChip key={mins}>
                {formatDuration(mins)}
                <ChipRemove type="button" onClick={() => removeQuickSelectOption(mins)}>
                  &#215;
                </ChipRemove>
              </QuickSelectChip>
            ))}
            {habit.quick_select_options.length === 0 && (
              <span style={{ fontSize: 13, color: '#999' }}>No options configured</span>
            )}
          </QuickSelectChips>
          <AddChipRow>
            <SmallInput
              type="number"
              placeholder="Minutes"
              value={chipInput}
              onChange={(e) => setChipInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addQuickSelectOption(); }}
            />
            <SmallButton type="button" onClick={addQuickSelectOption}>Add</SmallButton>
          </AddChipRow>
        </ConfigSection>
      )}

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

            <Label>Type</Label>
            <TypeSelector>
              <TypeOption
                type="button"
                $active={editForm.type === 'once_per_day'}
                onClick={() => setEditForm((f) => ({ ...f, type: 'once_per_day' }))}
              >
                Once Per Day
              </TypeOption>
              <TypeOption
                type="button"
                $active={editForm.type === 'timed'}
                onClick={() => setEditForm((f) => ({ ...f, type: 'timed' }))}
              >
                Timed
              </TypeOption>
            </TypeSelector>

            {editForm.type === 'timed' && (
              <>
                <Label>Quick Select Durations (minutes)</Label>
                <QuickSelectChips>
                  {editForm.quick_select_options.map((mins) => (
                    <QuickSelectChip key={mins}>
                      {formatDuration(mins)}
                      <ChipRemove type="button" onClick={() => removeChip(mins)}>
                        &#215;
                      </ChipRemove>
                    </QuickSelectChip>
                  ))}
                </QuickSelectChips>
                <AddChipRow>
                  <SmallInput
                    type="number"
                    placeholder="Minutes"
                    value={chipInput}
                    onChange={(e) => setChipInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addChip(); }}
                  />
                  <SmallButton type="button" onClick={addChip}>Add</SmallButton>
                </AddChipRow>
              </>
            )}

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
