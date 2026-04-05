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
  ActiveToggle,
  EmptyState,
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
  DeleteButton,
} from './styles';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

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
    const diff = daysBetween(uniqueDays[i - 1], uniqueDays[i]);
    if (diff === 1) {
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

const EMPTY_FORM = {
  name: '',
  type: 'daily',
};

export default function Habits() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [habitLogs, setHabitLogs] = useLocalStorage('habit_logs', []);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
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
          active: true,
          tracking_start_date: todayStr(),
        },
      ]);
    } else {
      setHabits((prev) => prev.map((h) => (
        h.id === modal.habit.id
          ? { ...h, name: trimmedName, type: form.type }
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

  // ─── Active Toggle ────────────────────────────────────────────────────────

  function toggleActive(habitId, e) {
    e.stopPropagation();
    setHabits((prev) => prev.map((h) => (
      h.id === habitId ? { ...h, active: !h.active } : h
    )));
  }

  // ─── Logging ───────────────────────────────────────────────────────────────

  function logDaily(habitId, e) {
    e.stopPropagation();
    if (isDoneToday(habitLogs, habitId)) return;
    setHabitLogs((prev) => [
      ...prev,
      { id: generateId(), habit_id: habitId, timestamp: new Date().toISOString(), value: true },
    ]);
  }

  function logIrregular(habitId, e) {
    e.stopPropagation();
    setHabitLogs((prev) => [
      ...prev,
      { id: generateId(), habit_id: habitId, timestamp: new Date().toISOString(), value: true },
    ]);
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

  const activeHabits = habits.filter((h) => h.active !== false);
  const inactiveHabits = habits.filter((h) => h.active === false);

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
          <>
            {activeHabits.map((habit) => {
              const isDaily = habit.type !== 'irregular';
              const streak = computeStreak(habitLogs, habit.id);
              const pct7 = isDaily ? computePercentage(habitLogs, habit.id, 7) : 0;
              const doneToday = isDoneToday(habitLogs, habit.id);
              const count = todayCount(habitLogs, habit.id);

              return (
                <HabitRow key={habit.id} onClick={() => setSelectedId(habit.id)}>
                  <HabitInfo>
                    <HabitName>{habit.name}</HabitName>
                    <HabitMeta>
                      {isDaily && streak > 0 && (
                        <StreakBadge>&#128293; {streak}d</StreakBadge>
                      )}
                      {isDaily && <span>{pct7}% (7d)</span>}
                      {!isDaily && count > 0 && <span>{count}x today</span>}
                    </HabitMeta>
                  </HabitInfo>
                  <TypeBadge $type={habit.type}>
                    {isDaily ? 'daily' : 'irregular'}
                  </TypeBadge>
                  <ActiveToggle
                    type="button"
                    $active
                    onClick={(e) => toggleActive(habit.id, e)}
                    title="Active — shown on home"
                  />
                  {isDaily && doneToday ? (
                    <DoneIndicator>&#10003;</DoneIndicator>
                  ) : (
                    <QuickAddButton
                      type="button"
                      onClick={(e) => (isDaily ? logDaily(habit.id, e) : logIrregular(habit.id, e))}
                    >
                      +
                    </QuickAddButton>
                  )}
                </HabitRow>
              );
            })}

            {inactiveHabits.length > 0 && (
              <>
                <div style={{ padding: '16px 20px 8px', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Inactive
                </div>
                {inactiveHabits.map((habit) => {
                  const isDaily = habit.type !== 'irregular';

                  return (
                    <HabitRow key={habit.id} $inactive onClick={() => setSelectedId(habit.id)}>
                      <HabitInfo>
                        <HabitName style={{ opacity: 0.5 }}>{habit.name}</HabitName>
                      </HabitInfo>
                      <TypeBadge $type={habit.type} style={{ opacity: 0.5 }}>
                        {isDaily ? 'daily' : 'irregular'}
                      </TypeBadge>
                      <ActiveToggle
                        type="button"
                        $active={false}
                        onClick={(e) => toggleActive(habit.id, e)}
                        title="Inactive — not shown on home"
                      />
                    </HabitRow>
                  );
                })}
              </>
            )}
          </>
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

            <Label>Frequency</Label>
            <TypeSelector>
              <TypeOption
                type="button"
                $active={form.type === 'daily'}
                onClick={() => setForm((f) => ({ ...f, type: 'daily' }))}
              >
                Daily
              </TypeOption>
              <TypeOption
                type="button"
                $active={form.type === 'irregular'}
                onClick={() => setForm((f) => ({ ...f, type: 'irregular' }))}
              >
                Irregular
              </TypeOption>
            </TypeSelector>

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
    </Page>
  );
}
