import React, { useState, useRef, useEffect } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';
import defaultExercises from '../../data/defaultExercises';
import {
  Page,
  Header,
  HeaderTop,
  PageTitle,
  ExerciseCount,
  AddButton,
  SearchBar,
  SearchIcon,
  SearchInput,
  List,
  ExerciseRow,
  ExerciseName,
  UnitBadge,
  EmptyState,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  Textarea,
  UnitTypeSelector,
  UnitTypeOption,
  ModalActions,
  SaveButton,
  DeleteButton,
} from './styles';

const UNIT_TYPES = [
  { value: 'reps', label: 'Reps' },
  { value: 'time', label: 'Time' },
  { value: 'distance', label: 'Distance' },
  { value: 'cals', label: 'Cals' },
];

const EMPTY_FORM = { name: '', unit_type: 'reps', notes: '' };

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function Exercises() {
  const [exercises, setExercises] = useLocalStorage(
    'exercises',
    defaultExercises,
  );
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const nameInputRef = useRef(null);

  // Focus name input when modal opens
  useEffect(() => {
    if (modal) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [modal]);

  const filtered = exercises
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  function openAdd() {
    setForm(EMPTY_FORM);
    setModal({ mode: 'add' });
  }

  function openEdit(exercise) {
    setForm({
      name: exercise.name,
      unit_type: exercise.unit_type,
      notes: exercise.notes || '',
    });
    setModal({ mode: 'edit', exercise });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSave() {
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    if (modal.mode === 'add') {
      setExercises((prev) => [
        ...prev,
        {
          id: generateId(),
          name: trimmedName,
          unit_type: form.unit_type,
          notes: form.notes.trim(),
        },
      ]);
    } else {
      setExercises((prev) => (
        prev.map((e) => (
          e.id === modal.exercise.id
            ? {
              ...e,
              name: trimmedName,
              unit_type: form.unit_type,
              notes: form.notes.trim(),
            }
            : e
        ))
      ));
    }
    closeModal();
  }

  function handleDelete() {
    setExercises((prev) => prev.filter((e) => e.id !== modal.exercise.id));
    closeModal();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeModal();
  }

  return (
    <Page>
      <Header>
        <HeaderTop>
          <PageTitle>
            Exercises
            {search && (
              <ExerciseCount>{filtered.length} results</ExerciseCount>
            )}
            {!search && <ExerciseCount>{exercises.length}</ExerciseCount>}
          </PageTitle>
          <AddButton onClick={openAdd}>+ Add</AddButton>
        </HeaderTop>
        <SearchBar>
          <SearchIcon>⌕</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>
      </Header>

      <List>
        {filtered.length === 0 ? (
          <EmptyState>
            <span role="img" aria-label="search">🔍</span>
            <span>No exercises found</span>
            {search && (
              <span style={{ fontSize: 13 }}>
                Try a different search or add a new one
              </span>
            )}
          </EmptyState>
        ) : (
          filtered.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              onClick={() => openEdit(exercise)}
            >
              <ExerciseName>{exercise.name}</ExerciseName>
              <UnitBadge $type={exercise.unit_type}>
                {exercise.unit_type}
              </UnitBadge>
            </ExerciseRow>
          ))
        )}
      </List>

      {modal && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>
              {modal.mode === 'add' ? 'New Exercise' : 'Edit Exercise'}
            </ModalTitle>

            <Label>Name</Label>
            <TextInput
              ref={nameInputRef}
              type="text"
              placeholder="Exercise name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />

            <Label>Unit Type</Label>
            <UnitTypeSelector>
              {UNIT_TYPES.map(({ value, label }) => (
                <UnitTypeOption
                  key={value}
                  $type={value}
                  $active={form.unit_type === value}
                  onClick={() => setForm((f) => ({ ...f, unit_type: value }))}
                  type="button"
                >
                  {label}
                </UnitTypeOption>
              ))}
            </UnitTypeSelector>

            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any notes about this exercise…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />

            <ModalActions>
              {modal.mode === 'edit' && (
                <DeleteButton type="button" onClick={handleDelete}>
                  Delete
                </DeleteButton>
              )}
              <SaveButton onClick={handleSave} disabled={!form.name.trim()}>
                {modal.mode === 'add' ? 'Add Exercise' : 'Save Changes'}
              </SaveButton>
            </ModalActions>
          </ModalSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
