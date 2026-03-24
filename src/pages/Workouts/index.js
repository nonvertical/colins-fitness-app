import React, { useState, useRef, useEffect } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';
import WorkoutDetail from './WorkoutDetail';
import {
  Page,
  Header,
  HeaderTop,
  PageTitle,
  CountBadge,
  AddButton,
  List,
  WorkoutRow,
  WorkoutInfo,
  WorkoutName,
  WorkoutMeta,
  StatusBadge,
  EmptyState,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  DateInput,
  DurationSelector,
  DurationOption,
  ModalActions,
  SaveButton,
} from './styles';

const DURATION_PRESETS = [30, 45, 60, 75, 90, 105, 120];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function computeDisplayStatus(workout) {
  if (workout.status === 'finished') return 'finished';
  if (workout.status === 'started') return 'started';
  if (workout.date && new Date(workout.date + 'T23:59:59') < new Date() && workout.status === 'scheduled') {
    return 'overdue';
  }
  return workout.status;
}

const EMPTY_FORM = {
  name: '',
  date: new Date().toISOString().split('T')[0],
  duration_preset: null,
};

export default function Workouts() {
  const [workouts, setWorkouts] = useLocalStorage('workouts', []);
  const [exercises] = useLocalStorage('exercises', []);
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (modal) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [modal]);

  const selected = workouts.find((w) => w.id === selectedId);

  // Sort: most recent date first
  const sorted = [...workouts].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  function openCreate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setForm({ ...EMPTY_FORM, name: `New Workout ${dateStr}` });
    setModal(true);
  }

  function handleCreate() {
    const name = form.name.trim();
    if (!name) return;

    const newWorkout = {
      id: generateId(),
      name,
      date: form.date,
      duration_preset: form.duration_preset,
      start_time: null,
      end_time: null,
      status: 'scheduled',
      notes: '',
      blocks: [],
    };

    setWorkouts((prev) => [...prev, newWorkout]);
    setModal(false);
    setSelectedId(newWorkout.id);
  }

  function handleUpdate(updated) {
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }

  function handleDelete(id) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setSelectedId(null);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) setModal(false);
  }

  // ─── Detail View ─────────────────────────────────────────────────────────

  if (selected) {
    return (
      <WorkoutDetail
        workout={selected}
        exercises={exercises}
        onUpdate={handleUpdate}
        onBack={() => setSelectedId(null)}
        onDelete={() => handleDelete(selected.id)}
      />
    );
  }

  // ─── List View ───────────────────────────────────────────────────────────

  return (
    <Page>
      <Header>
        <HeaderTop>
          <PageTitle>
            Workouts
            <CountBadge>{workouts.length}</CountBadge>
          </PageTitle>
          <AddButton onClick={openCreate}>+ New</AddButton>
        </HeaderTop>
      </Header>

      <List>
        {sorted.length === 0 ? (
          <EmptyState>
            <span>📋</span>
            <span>No workouts yet</span>
            <span style={{ fontSize: 13 }}>Tap "+ New" to create your first workout</span>
          </EmptyState>
        ) : (
          sorted.map((workout) => {
            const status = computeDisplayStatus(workout);
            return (
              <WorkoutRow key={workout.id} onClick={() => setSelectedId(workout.id)}>
                <WorkoutInfo>
                  <WorkoutName>{workout.name}</WorkoutName>
                  <WorkoutMeta>
                    {workout.date && formatDate(workout.date)}
                    {workout.duration_preset && ` · ${workout.duration_preset} min`}
                    {workout.blocks.length > 0 && ` · ${workout.blocks.reduce((n, b) => n + b.exercises.length, 0)} exercises`}
                  </WorkoutMeta>
                </WorkoutInfo>
                <StatusBadge $status={status}>{status}</StatusBadge>
              </WorkoutRow>
            );
          })
        )}
      </List>

      {modal && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>New Workout</ModalTitle>

            <Label>Name</Label>
            <TextInput
              ref={nameInputRef}
              type="text"
              placeholder="Workout name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
            />

            <Label>Date</Label>
            <DateInput
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />

            <Label>Duration (optional)</Label>
            <DurationSelector>
              {DURATION_PRESETS.map((d) => (
                <DurationOption
                  key={d}
                  type="button"
                  $active={form.duration_preset === d}
                  onClick={() => setForm((f) => ({
                    ...f,
                    duration_preset: f.duration_preset === d ? null : d,
                  }))}
                >
                  {d} min
                </DurationOption>
              ))}
            </DurationSelector>

            <ModalActions>
              <SaveButton onClick={handleCreate} disabled={!form.name.trim()}>
                Create Workout
              </SaveButton>
            </ModalActions>
          </ModalSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
