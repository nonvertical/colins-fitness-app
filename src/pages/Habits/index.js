import React, { useState, useRef, useEffect } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';
import HabitDetail from './HabitDetail';
import {
  Page,
  Header,
  HeaderTop,
  PageTitle,
  CountBadge,
  AddButton,
  List,
  HabitRow,
  HabitInfo,
  HabitName,
  HabitMeta,
  StreakBadge,
  TypeBadge,
  DoneIndicator,
  QuickAddButton,
  EmptyState,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  TypeSelector,
  TypeOption,
  QuickSelectChips,
  QuickSelectChip,
  ChipRemove,
  AddChipRow,
  SmallInput,
  SmallButton,
  ModalActions,
  SaveButton,
  DeleteButton,
  DurationGrid,
  DurationButton,
} from './styles';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function getStartOfYear() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1);
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
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Streak must include today or yesterday
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

function computeYearTotal(logs, habitId) {
  const yearStart = getStartOfYear();
  const habitLogs = logs
    .filter((l) => l.habit_id === habitId && new Date(l.timestamp) >= yearStart)
    .map((l) => l.timestamp.split('T')[0]);
  const uniqueDays = new Set(habitLogs);
  const totalDaysThisYear = daysBetween(yearStart, new Date()) + 1;
  return { done: uniqueDays.size, total: totalDaysThisYear };
}

function isDoneToday(logs, habitId) {
  const today = todayStr();
  return logs.some((l) => l.habit_id === habitId && l.timestamp.startsWith(today));
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

const EMPTY_FORM = {
  name: '',
  type: 'once_per_day',
  quick_select_options: [],
};

export default function Habits() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [habitLogs, setHabitLogs] = useLocalStorage('habit_logs', []);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [durationModal, setDurationModal] = useState(null);
  const [chipInput, setChipInput] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (modal) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [modal]);

  const selected = habits.find((h) => h.id === selectedId);

  // ─── Add / Edit Habit ──────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY_FORM);
    setChipInput('');
    setModal({ mode: 'add' });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSave() {
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    if (modal.mode === 'add') {
      setHabits((prev) => [
        ...prev,
        {
          id: generateId(),
          name: trimmedName,
          type: form.type,
          quick_select_options: form.type === 'timed' ? form.quick_select_options : [],
          tracking_start_date: todayStr(),
        },
      ]);
    } else {
      setHabits((prev) => prev.map((h) => (
        h.id === modal.habit.id
          ? {
            ...h,
            name: trimmedName,
            type: form.type,
            quick_select_options: form.type === 'timed' ? form.quick_select_options : [],
          }
          : h
      )));
    }
    closeModal();
  }

  function handleDelete() {
    setHabits((prev) => prev.filter((h) => h.id !== modal.habit.id));
    setHabitLogs((prev) => prev.filter((l) => l.habit_id !== modal.habit.id));
    closeModal();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeModal();
  }

  // ─── Quick Select Options ──────────────────────────────────────────────────

  function addChip() {
    const val = parseInt(chipInput, 10);
    if (!val || val <= 0) return;
    if (form.quick_select_options.includes(val)) return;
    setForm((f) => ({
      ...f,
      quick_select_options: [...f.quick_select_options, val].sort((a, b) => a - b),
    }));
    setChipInput('');
  }

  function removeChip(minutes) {
    setForm((f) => ({
      ...f,
      quick_select_options: f.quick_select_options.filter((v) => v !== minutes),
    }));
  }

  // ─── Logging ───────────────────────────────────────────────────────────────

  function logOncePerDay(habitId, e) {
    e.stopPropagation();
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

  function logIrregular(habitId, e) {
    e.stopPropagation();
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

  function openDurationModal(habit, e) {
    e.stopPropagation();
    setDurationModal(habit);
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

  // ─── Detail View ───────────────────────────────────────────────────────────

  function handleUpdateHabit(updated) {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  }

  function handleDeleteFromDetail(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setHabitLogs((prev) => prev.filter((l) => l.habit_id !== id));
    setSelectedId(null);
  }

  if (selected) {
    return (
      <HabitDetail
        habit={selected}
        logs={habitLogs.filter((l) => l.habit_id === selected.id)}
        onUpdate={handleUpdateHabit}
        onDelete={() => handleDeleteFromDetail(selected.id)}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  // ─── List View ─────────────────────────────────────────────────────────────

  return (
    <Page>
      <Header>
        <HeaderTop>
          <PageTitle>
            Habits
            <CountBadge>{habits.length}</CountBadge>
          </PageTitle>
          <AddButton onClick={openAdd}>+ Add</AddButton>
        </HeaderTop>
      </Header>

      <List>
        {habits.length === 0 ? (
          <EmptyState>
            <span>&#127919;</span>
            <span>No habits yet</span>
            <span style={{ fontSize: 13 }}>
              Tap "+ Add" to start tracking a habit
            </span>
          </EmptyState>
        ) : (
          habits.map((habit) => {
            const streak = computeStreak(habitLogs, habit.id);
            const yearTotal = computeYearTotal(habitLogs, habit.id);
            const doneToday = isDoneToday(habitLogs, habit.id);
            const currentYear = new Date().getFullYear();

            return (
              <HabitRow key={habit.id} onClick={() => setSelectedId(habit.id)}>
                <HabitInfo>
                  <HabitName>{habit.name}</HabitName>
                  <HabitMeta>
                    {streak > 0 && (
                      <StreakBadge>
                        &#128293; {streak}d
                      </StreakBadge>
                    )}
                    <span>{yearTotal.done}/{yearTotal.total} days in {currentYear}</span>
                  </HabitMeta>
                </HabitInfo>
                <TypeBadge $type={habit.type}>
                  {habit.type === 'timed' ? 'timed' : habit.type === 'irregular' ? 'irregular' : 'daily'}
                </TypeBadge>
                {habit.type === 'once_per_day' && doneToday ? (
                  <DoneIndicator>&#10003;</DoneIndicator>
                ) : (
                  <QuickAddButton
                    type="button"
                    onClick={(e) => {
                      if (habit.type === 'once_per_day') {
                        logOncePerDay(habit.id, e);
                      } else if (habit.type === 'timed') {
                        openDurationModal(habit, e);
                      } else {
                        logIrregular(habit.id, e);
                      }
                    }}
                  >
                    +
                  </QuickAddButton>
                )}
              </HabitRow>
            );
          })
        )}
      </List>

      {/* ─── Add / Edit Habit Modal ──────────────────────────────────────────── */}
      {modal && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>
              {modal.mode === 'add' ? 'New Habit' : 'Edit Habit'}
            </ModalTitle>

            <Label>Name</Label>
            <TextInput
              ref={nameInputRef}
              type="text"
              placeholder="Habit name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />

            <Label>Type</Label>
            <TypeSelector>
              <TypeOption
                type="button"
                $active={form.type === 'once_per_day'}
                onClick={() => setForm((f) => ({ ...f, type: 'once_per_day' }))}
              >
                Daily
              </TypeOption>
              <TypeOption
                type="button"
                $active={form.type === 'timed'}
                onClick={() => setForm((f) => ({ ...f, type: 'timed' }))}
              >
                Timed
              </TypeOption>
              <TypeOption
                type="button"
                $active={form.type === 'irregular'}
                onClick={() => setForm((f) => ({ ...f, type: 'irregular' }))}
              >
                Irregular
              </TypeOption>
            </TypeSelector>

            {form.type === 'timed' && (
              <>
                <Label>Quick Select Durations (minutes)</Label>
                <QuickSelectChips>
                  {form.quick_select_options.map((mins) => (
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
              {modal.mode === 'edit' && (
                <DeleteButton type="button" onClick={handleDelete}>
                  Delete
                </DeleteButton>
              )}
              <SaveButton onClick={handleSave} disabled={!form.name.trim()}>
                {modal.mode === 'add' ? 'Add Habit' : 'Save Changes'}
              </SaveButton>
            </ModalActions>
          </ModalSheet>
        </ModalBackdrop>
      )}

      {/* ─── Duration Quick Select Modal ─────────────────────────────────────── */}
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
              <EmptyState style={{ padding: '24px 0' }}>
                <span style={{ fontSize: 15 }}>No quick select options configured</span>
                <span style={{ fontSize: 13 }}>Edit this habit to add duration options</span>
              </EmptyState>
            )}
          </ModalSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
