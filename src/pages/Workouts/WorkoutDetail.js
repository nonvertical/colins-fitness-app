import React, { useState, useRef, useEffect } from 'react';

import {
  DetailPage,
  DetailHeader,
  BackRow,
  BackButton,
  DetailTitle,
  DetailMeta,
  StatusBadge,
  ActionBar,
  ActionButton,
  BlocksContainer,
  Block,
  BlockHeader,
  BlockLabel,
  BlockActions,
  SmallButton,
  ExerciseItem,
  ExerciseHeader,
  ExerciseNameLabel,
  ExerciseUnitBadge,
  SetsList,
  SetRow,
  SetNumber,
  SetValue,
  SetDeleteButton,
  AddSetButton,
  SetForm,
  ValueControl,
  ValueLabel,
  AdjusterRow,
  AdjustButton,
  ValueDisplay,
  SetSaveButton,
  AddExerciseRow,
  ExerciseSearchInput,
  ExerciseDropdown,
  ExerciseDropdownItem,
  AddBlockButton,
  NotesSection,
  NotesLabel,
  Textarea,
} from './styles';

const BLOCK_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'Finisher'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDuration(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m} min`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getUnitLabel(unitType) {
  const labels = { reps: 'reps', time: '', distance: 'm', cals: 'cal' };
  return labels[unitType] || '';
}

function formatSetValue(set, unitType) {
  let val = '';
  if (unitType === 'time') {
    const min = Math.floor(set.value / 60);
    const sec = set.value % 60;
    val = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  } else {
    val = `${set.value} ${getUnitLabel(unitType)}`;
  }
  if (set.weight) {
    val += ` @ ${set.weight} lbs`;
  }
  return val;
}

// ─── Value Adjuster Component ────────────────────────────────────────────────

function ValueAdjuster({ label, value, onChange, adjustments }) {
  return (
    <ValueControl>
      <ValueLabel>{label}</ValueLabel>
      <AdjusterRow>
        {adjustments.map((adj) => (
          <AdjustButton
            key={`dec-${adj}`}
            type="button"
            onClick={() => onChange(Math.max(0, value - adj))}
          >
            -{adj > 99 ? `${adj / 100}h` : adj}
          </AdjustButton>
        ))}
        <ValueDisplay>{label === 'Time' ? `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}` : value}</ValueDisplay>
        {adjustments.map((adj) => (
          <AdjustButton
            key={`inc-${adj}`}
            type="button"
            onClick={() => onChange(value + adj)}
          >
            +{adj > 99 ? `${adj / 100}h` : adj}
          </AdjustButton>
        ))}
      </AdjusterRow>
    </ValueControl>
  );
}

// ─── Add Set Inline Form ─────────────────────────────────────────────────────

function AddSetForm({ unitType, onSave }) {
  const [value, setValue] = useState(unitType === 'time' ? 60 : unitType === 'reps' ? 10 : 0);
  const [weight, setWeight] = useState(0);

  const adjustments = {
    reps: [1],
    time: [5, 60],
    distance: [5, 100],
    cals: [1, 10],
  };

  return (
    <SetForm>
      <ValueAdjuster
        label={unitType === 'time' ? 'Time' : unitType.charAt(0).toUpperCase() + unitType.slice(1)}
        value={value}
        onChange={setValue}
        adjustments={adjustments[unitType] || [1]}
      />
      <ValueAdjuster
        label="Weight"
        value={weight}
        onChange={setWeight}
        adjustments={[5]}
      />
      <SetSaveButton type="button" onClick={() => onSave({ value, weight })}>
        Save
      </SetSaveButton>
    </SetForm>
  );
}

// ─── Add Exercise Search ─────────────────────────────────────────────────────

function AddExerciseSearch({ exercises, onSelect, onCreate, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = exercises.filter(
    (e) => e.name.toLowerCase().includes(query.toLowerCase()),
  );

  const exactMatch = query && exercises.some(
    (e) => e.name.toLowerCase() === query.toLowerCase(),
  );

  return (
    <AddExerciseRow>
      <ExerciseSearchInput
        ref={inputRef}
        type="text"
        placeholder="Search or create exercise…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      />
      {query && (
        <ExerciseDropdown>
          {filtered.slice(0, 8).map((ex) => (
            <ExerciseDropdownItem key={ex.id} onClick={() => onSelect(ex)}>
              {ex.name}
              <ExerciseUnitBadge $type={ex.unit_type}>{ex.unit_type}</ExerciseUnitBadge>
            </ExerciseDropdownItem>
          ))}
          {!exactMatch && (
            <ExerciseDropdownItem onClick={() => onCreate(query.trim())}>
              + Create "{query.trim()}"
            </ExerciseDropdownItem>
          )}
        </ExerciseDropdown>
      )}
    </AddExerciseRow>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function WorkoutDetail({ workout, exercises, onUpdate, onBack, onDelete, onCreateExercise }) {
  const [addingExerciseTo, setAddingExerciseTo] = useState(null);
  const [addingSetTo, setAddingSetTo] = useState(null);

  function computeStatus() {
    if (workout.status === 'finished') return 'finished';
    if (workout.status === 'started') return 'started';
    if (workout.date && new Date(workout.date + 'T23:59:59') < new Date() && workout.status === 'scheduled') {
      return 'overdue';
    }
    return workout.status;
  }

  const displayStatus = computeStatus();

  function handleStart() {
    onUpdate({ ...workout, status: 'started', start_time: Date.now() });
  }

  function handleFinish() {
    onUpdate({ ...workout, status: 'finished', end_time: Date.now() });
  }

  function handleAddBlock() {
    const usedLabels = workout.blocks.map((b) => b.label);
    const nextLabel = BLOCK_LABELS.find((l) => !usedLabels.includes(l)) || `Block ${workout.blocks.length + 1}`;
    onUpdate({
      ...workout,
      blocks: [...workout.blocks, { id: generateId(), label: nextLabel, exercises: [] }],
    });
  }

  function handleRemoveBlock(blockId) {
    onUpdate({
      ...workout,
      blocks: workout.blocks.filter((b) => b.id !== blockId),
    });
  }

  function handleAddExercise(blockId, exercise) {
    onUpdate({
      ...workout,
      blocks: workout.blocks.map((b) =>
        b.id === blockId
          ? {
            ...b,
            exercises: [
              ...b.exercises,
              { id: generateId(), exercise_id: exercise.id, name: exercise.name, unit_type: exercise.unit_type, sets: [], notes: '' },
            ],
          }
          : b,
      ),
    });
    setAddingExerciseTo(null);
  }

  function handleRemoveExercise(blockId, exerciseEntryId) {
    onUpdate({
      ...workout,
      blocks: workout.blocks.map((b) =>
        b.id === blockId
          ? { ...b, exercises: b.exercises.filter((e) => e.id !== exerciseEntryId) }
          : b,
      ),
    });
  }

  function handleAddSet(blockId, exerciseEntryId, setData) {
    onUpdate({
      ...workout,
      blocks: workout.blocks.map((b) =>
        b.id === blockId
          ? {
            ...b,
            exercises: b.exercises.map((e) =>
              e.id === exerciseEntryId
                ? { ...e, sets: [...e.sets, { id: generateId(), set_number: e.sets.length + 1, ...setData }] }
                : e,
            ),
          }
          : b,
      ),
    });
    setAddingSetTo(null);
  }

  function handleDeleteSet(blockId, exerciseEntryId, setId) {
    onUpdate({
      ...workout,
      blocks: workout.blocks.map((b) =>
        b.id === blockId
          ? {
            ...b,
            exercises: b.exercises.map((e) =>
              e.id === exerciseEntryId
                ? {
                  ...e,
                  sets: e.sets
                    .filter((s) => s.id !== setId)
                    .map((s, i) => ({ ...s, set_number: i + 1 })),
                }
                : e,
            ),
          }
          : b,
      ),
    });
  }

  function handleNotesChange(val) {
    onUpdate({ ...workout, notes: val });
  }

  return (
    <DetailPage>
      <DetailHeader>
        <BackRow>
          <BackButton onClick={onBack}>← Workouts</BackButton>
        </BackRow>
        <DetailTitle>{workout.name || 'Untitled Workout'}</DetailTitle>
        <DetailMeta>
          {workout.date && <span>{formatDate(workout.date)}</span>}
          {workout.duration_preset && <span>{formatDuration(workout.duration_preset)}</span>}
          <StatusBadge $status={displayStatus}>{displayStatus}</StatusBadge>
          {workout.start_time && <span>Started {formatTime(workout.start_time)}</span>}
          {workout.end_time && <span>Finished {formatTime(workout.end_time)}</span>}
        </DetailMeta>
      </DetailHeader>

      <ActionBar>
        {displayStatus === 'scheduled' && (
          <ActionButton $variant="start" onClick={handleStart}>Start Workout</ActionButton>
        )}
        {displayStatus === 'overdue' && (
          <ActionButton $variant="start" onClick={handleStart}>Start Workout</ActionButton>
        )}
        {displayStatus === 'started' && (
          <ActionButton $variant="finish" onClick={handleFinish}>Finish Workout</ActionButton>
        )}
        <ActionButton $variant="danger" onClick={onDelete}>Delete</ActionButton>
      </ActionBar>

      <BlocksContainer>
        {workout.blocks.map((block) => (
          <Block key={block.id}>
            <BlockHeader>
              <BlockLabel>{block.label} Block</BlockLabel>
              <BlockActions>
                <SmallButton onClick={() => setAddingExerciseTo(addingExerciseTo === block.id ? null : block.id)}>
                  + Exercise
                </SmallButton>
                <SmallButton onClick={() => handleRemoveBlock(block.id)}>×</SmallButton>
              </BlockActions>
            </BlockHeader>

            {addingExerciseTo === block.id && (
              <AddExerciseSearch
                exercises={exercises}
                onSelect={(ex) => handleAddExercise(block.id, ex)}
                onCreate={(name) => {
                  const newEx = onCreateExercise(name);
                  handleAddExercise(block.id, newEx);
                }}
                onClose={() => setAddingExerciseTo(null)}
              />
            )}

            {block.exercises.map((entry, exIdx) => (
              <ExerciseItem key={entry.id}>
                <ExerciseHeader>
                  <ExerciseNameLabel>
                    {block.label}{exIdx + 1}. {entry.name}
                  </ExerciseNameLabel>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ExerciseUnitBadge $type={entry.unit_type}>{entry.unit_type}</ExerciseUnitBadge>
                    <SmallButton onClick={() => handleRemoveExercise(block.id, entry.id)}>×</SmallButton>
                  </div>
                </ExerciseHeader>

                <SetsList>
                  {entry.sets.map((set) => (
                    <SetRow key={set.id}>
                      <SetNumber>Set {set.set_number}</SetNumber>
                      <SetValue>{formatSetValue(set, entry.unit_type)}</SetValue>
                      <SetDeleteButton onClick={() => handleDeleteSet(block.id, entry.id, set.id)}>×</SetDeleteButton>
                    </SetRow>
                  ))}
                </SetsList>

                {addingSetTo === entry.id ? (
                  <AddSetForm
                    unitType={entry.unit_type}
                    onSave={(data) => handleAddSet(block.id, entry.id, data)}
                    onCancel={() => setAddingSetTo(null)}
                  />
                ) : (
                  <AddSetButton onClick={() => setAddingSetTo(entry.id)}>+ Add Set</AddSetButton>
                )}
              </ExerciseItem>
            ))}

            {block.exercises.length === 0 && (
              <div style={{ padding: '16px 20px', fontSize: 13, color: '#666' }}>
                No exercises — tap "+ Exercise" to add one
              </div>
            )}
          </Block>
        ))}

        <AddBlockButton onClick={handleAddBlock}>+ Add Block</AddBlockButton>
      </BlocksContainer>

      <NotesSection>
        <NotesLabel>Notes</NotesLabel>
        <Textarea
          placeholder="Workout notes…"
          value={workout.notes || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </NotesSection>
    </DetailPage>
  );
}
