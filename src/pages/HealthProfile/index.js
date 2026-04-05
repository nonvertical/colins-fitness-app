import React, { useState, useRef, useEffect } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';
import {
  Page,
  Header,
  HeaderTop,
  PageTitle,
  Section,
  SectionHeader,
  SectionTitle,
  AddButton,
  StatCard,
  StatLabel,
  StatValue,
  EmptyValue,
  ListItem,
  ListItemText,
  ListItemName,
  ListItemMeta,
  GoalRow,
  GoalText,
  RemoveButton,
  EmptyState,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  Textarea,
  UnitSelector,
  UnitOption,
  ModalActions,
  SaveButton,
  DeleteButton,
} from './styles';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const DEFAULT_PROFILE = {
  weight: null,
  weight_unit: 'lbs',
  body_fat: null,
  goals: [],
  prs: [],
  custom_metrics: [],
};

const METRIC_UNITS = [
  { value: 'number', label: 'Number' },
  { value: 'time', label: 'Time' },
  { value: 'text', label: 'Text' },
  { value: 'lbs', label: 'lbs' },
  { value: 'kg', label: 'kg' },
];

export default function HealthProfile() {
  const [profile, setProfile] = useLocalStorage('health_profile', DEFAULT_PROFILE);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (modal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [modal]);

  function updateProfile(updates) {
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) setModal(null);
  }

  // ─── Weight Modal ─────────────────────────────────────────────────────────

  function openWeightModal() {
    setForm({ value: profile.weight || '', unit: profile.weight_unit || 'lbs' });
    setModal('weight');
  }

  function saveWeight() {
    const val = parseFloat(form.value);
    updateProfile({ weight: val || null, weight_unit: form.unit });
    setModal(null);
  }

  // ─── Body Fat Modal ───────────────────────────────────────────────────────

  function openBodyFatModal() {
    setForm({ value: profile.body_fat || '' });
    setModal('body_fat');
  }

  function saveBodyFat() {
    const val = parseFloat(form.value);
    updateProfile({ body_fat: val || null });
    setModal(null);
  }

  // ─── Goals ────────────────────────────────────────────────────────────────

  function openAddGoal() {
    setForm({ text: '' });
    setModal('add_goal');
  }

  function saveGoal() {
    const text = form.text.trim();
    if (!text) return;
    updateProfile({ goals: [...(profile.goals || []), { id: generateId(), text }] });
    setModal(null);
  }

  function removeGoal(id) {
    updateProfile({ goals: (profile.goals || []).filter((g) => g.id !== id) });
  }

  // ─── PRs ──────────────────────────────────────────────────────────────────

  function openAddPR() {
    setForm({ exercise: '', value: '', notes: '' });
    setModal('add_pr');
  }

  function savePR() {
    const exercise = form.exercise.trim();
    if (!exercise) return;
    const pr = {
      id: generateId(),
      exercise,
      value: form.value.trim(),
      notes: form.notes.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    updateProfile({ prs: [...(profile.prs || []), pr] });
    setModal(null);
  }

  function openEditPR(pr) {
    setForm({ exercise: pr.exercise, value: pr.value, notes: pr.notes || '' });
    setModal({ type: 'edit_pr', pr });
  }

  function saveEditPR() {
    const exercise = form.exercise.trim();
    if (!exercise) return;
    const updated = (profile.prs || []).map((p) => (
      p.id === modal.pr.id
        ? { ...p, exercise, value: form.value.trim(), notes: form.notes.trim() }
        : p
    ));
    updateProfile({ prs: updated });
    setModal(null);
  }

  function deletePR() {
    updateProfile({ prs: (profile.prs || []).filter((p) => p.id !== modal.pr.id) });
    setModal(null);
  }

  // ─── Custom Metrics ───────────────────────────────────────────────────────

  function openAddMetric() {
    setForm({ name: '', unit_type: 'number', value: '' });
    setModal('add_metric');
  }

  function saveMetric() {
    const name = form.name.trim();
    if (!name) return;
    const metric = {
      id: generateId(),
      name,
      unit_type: form.unit_type,
      entries: form.value.trim()
        ? [{ id: generateId(), value: form.value.trim(), date: new Date().toISOString().split('T')[0] }]
        : [],
    };
    updateProfile({ custom_metrics: [...(profile.custom_metrics || []), metric] });
    setModal(null);
  }

  function openEditMetric(metric) {
    setForm({
      name: metric.name,
      unit_type: metric.unit_type,
      value: metric.entries.length > 0 ? metric.entries[metric.entries.length - 1].value : '',
    });
    setModal({ type: 'edit_metric', metric });
  }

  function saveEditMetric() {
    const name = form.name.trim();
    if (!name) return;
    const updated = (profile.custom_metrics || []).map((m) => {
      if (m.id !== modal.metric.id) return m;
      const newEntries = [...m.entries];
      if (form.value.trim()) {
        newEntries.push({
          id: generateId(),
          value: form.value.trim(),
          date: new Date().toISOString().split('T')[0],
        });
      }
      return { ...m, name, unit_type: form.unit_type, entries: newEntries };
    });
    updateProfile({ custom_metrics: updated });
    setModal(null);
  }

  function deleteMetric() {
    updateProfile({ custom_metrics: (profile.custom_metrics || []).filter((m) => m.id !== modal.metric.id) });
    setModal(null);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const modalType = typeof modal === 'string' ? modal : (modal && modal.type);

  return (
    <Page>
      <Header>
        <HeaderTop>
          <PageTitle>Health Profile</PageTitle>
        </HeaderTop>
      </Header>

      {/* ─── Body Stats ───────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Body Stats</SectionTitle>
        <StatCard onClick={openWeightModal}>
          <StatLabel>Weight</StatLabel>
          {profile.weight ? (
            <StatValue>{profile.weight} {profile.weight_unit}</StatValue>
          ) : (
            <EmptyValue>Tap to add</EmptyValue>
          )}
        </StatCard>
        <StatCard onClick={openBodyFatModal}>
          <StatLabel>Body Fat %</StatLabel>
          {profile.body_fat ? (
            <StatValue>{profile.body_fat}%</StatValue>
          ) : (
            <EmptyValue>Tap to add</EmptyValue>
          )}
        </StatCard>
      </Section>

      {/* ─── Goals ────────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Goals</SectionTitle>
          <AddButton onClick={openAddGoal}>+ Add</AddButton>
        </SectionHeader>
        {(!profile.goals || profile.goals.length === 0) ? (
          <EmptyState>No goals set</EmptyState>
        ) : (
          profile.goals.map((goal) => (
            <GoalRow key={goal.id}>
              <GoalText>{goal.text}</GoalText>
              <RemoveButton onClick={() => removeGoal(goal.id)}>&#215;</RemoveButton>
            </GoalRow>
          ))
        )}
      </Section>

      {/* ─── PRs ─────────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>PRs</SectionTitle>
          <AddButton onClick={openAddPR}>+ Add</AddButton>
        </SectionHeader>
        {(!profile.prs || profile.prs.length === 0) ? (
          <EmptyState>No PRs recorded</EmptyState>
        ) : (
          profile.prs.map((pr) => (
            <ListItem key={pr.id} onClick={() => openEditPR(pr)}>
              <ListItemText>
                <ListItemName>{pr.exercise}</ListItemName>
                <ListItemMeta>
                  {pr.value && pr.value}
                  {pr.date && ' · ' + pr.date}
                </ListItemMeta>
              </ListItemText>
            </ListItem>
          ))
        )}
      </Section>

      {/* ─── Custom Metrics ───────────────────────────────────────────────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Custom Metrics</SectionTitle>
          <AddButton onClick={openAddMetric}>+ Add</AddButton>
        </SectionHeader>
        {(!profile.custom_metrics || profile.custom_metrics.length === 0) ? (
          <EmptyState>No custom metrics</EmptyState>
        ) : (
          profile.custom_metrics.map((metric) => {
            const latest = metric.entries.length > 0
              ? metric.entries[metric.entries.length - 1]
              : null;
            return (
              <ListItem key={metric.id} onClick={() => openEditMetric(metric)}>
                <ListItemText>
                  <ListItemName>{metric.name}</ListItemName>
                  <ListItemMeta>
                    {latest ? latest.value + ' · ' + latest.date : 'No entries'}
                    {' · ' + metric.unit_type}
                  </ListItemMeta>
                </ListItemText>
              </ListItem>
            );
          })
        )}
      </Section>

      {/* ─── Modals ───────────────────────────────────────────────────────── */}
      {modal && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ModalSheet>
            <ModalHandle />

            {/* Weight */}
            {modalType === 'weight' && (
              <>
                <ModalTitle>Update Weight</ModalTitle>
                <Label>Weight</Label>
                <TextInput
                  ref={inputRef}
                  type="number"
                  placeholder="Enter weight"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveWeight(); }}
                />
                <Label>Unit</Label>
                <UnitSelector>
                  <UnitOption
                    type="button"
                    $active={form.unit === 'lbs'}
                    onClick={() => setForm((f) => ({ ...f, unit: 'lbs' }))}
                  >
                    lbs
                  </UnitOption>
                  <UnitOption
                    type="button"
                    $active={form.unit === 'kg'}
                    onClick={() => setForm((f) => ({ ...f, unit: 'kg' }))}
                  >
                    kg
                  </UnitOption>
                </UnitSelector>
                <ModalActions>
                  <SaveButton onClick={saveWeight}>Save</SaveButton>
                </ModalActions>
              </>
            )}

            {/* Body Fat */}
            {modalType === 'body_fat' && (
              <>
                <ModalTitle>Update Body Fat %</ModalTitle>
                <Label>Body Fat %</Label>
                <TextInput
                  ref={inputRef}
                  type="number"
                  placeholder="Enter body fat %"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveBodyFat(); }}
                />
                <ModalActions>
                  <SaveButton onClick={saveBodyFat}>Save</SaveButton>
                </ModalActions>
              </>
            )}

            {/* Add Goal */}
            {modalType === 'add_goal' && (
              <>
                <ModalTitle>Add Goal</ModalTitle>
                <Label>Goal</Label>
                <TextInput
                  ref={inputRef}
                  type="text"
                  placeholder="Enter a goal"
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveGoal(); }}
                />
                <ModalActions>
                  <SaveButton onClick={saveGoal} disabled={!form.text || !form.text.trim()}>
                    Add Goal
                  </SaveButton>
                </ModalActions>
              </>
            )}

            {/* Add PR */}
            {modalType === 'add_pr' && (
              <>
                <ModalTitle>Add PR</ModalTitle>
                <Label>Exercise</Label>
                <TextInput
                  ref={inputRef}
                  type="text"
                  placeholder="Exercise name"
                  value={form.exercise}
                  onChange={(e) => setForm((f) => ({ ...f, exercise: e.target.value }))}
                />
                <Label>Value</Label>
                <TextInput
                  type="text"
                  placeholder="e.g., 225 lbs, 2:30 min"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any notes..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                <ModalActions>
                  <SaveButton onClick={savePR} disabled={!form.exercise || !form.exercise.trim()}>
                    Add PR
                  </SaveButton>
                </ModalActions>
              </>
            )}

            {/* Edit PR */}
            {modalType === 'edit_pr' && (
              <>
                <ModalTitle>Edit PR</ModalTitle>
                <Label>Exercise</Label>
                <TextInput
                  ref={inputRef}
                  type="text"
                  placeholder="Exercise name"
                  value={form.exercise}
                  onChange={(e) => setForm((f) => ({ ...f, exercise: e.target.value }))}
                />
                <Label>Value</Label>
                <TextInput
                  type="text"
                  placeholder="e.g., 225 lbs, 2:30 min"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any notes..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                <ModalActions>
                  <DeleteButton type="button" onClick={deletePR}>Delete</DeleteButton>
                  <SaveButton onClick={saveEditPR} disabled={!form.exercise || !form.exercise.trim()}>
                    Save
                  </SaveButton>
                </ModalActions>
              </>
            )}

            {/* Add Custom Metric */}
            {modalType === 'add_metric' && (
              <>
                <ModalTitle>Add Custom Metric</ModalTitle>
                <Label>Name</Label>
                <TextInput
                  ref={inputRef}
                  type="text"
                  placeholder="e.g., Stamina, Flexibility"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Label>Unit Type</Label>
                <UnitSelector>
                  {METRIC_UNITS.map((u) => (
                    <UnitOption
                      key={u.value}
                      type="button"
                      $active={form.unit_type === u.value}
                      onClick={() => setForm((f) => ({ ...f, unit_type: u.value }))}
                    >
                      {u.label}
                    </UnitOption>
                  ))}
                </UnitSelector>
                <Label>Initial Value (optional)</Label>
                <TextInput
                  type="text"
                  placeholder="e.g., 2 minutes, 3 minutes no stopping"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
                <ModalActions>
                  <SaveButton onClick={saveMetric} disabled={!form.name || !form.name.trim()}>
                    Add Metric
                  </SaveButton>
                </ModalActions>
              </>
            )}

            {/* Edit Custom Metric */}
            {modalType === 'edit_metric' && (
              <>
                <ModalTitle>Edit Metric</ModalTitle>
                <Label>Name</Label>
                <TextInput
                  ref={inputRef}
                  type="text"
                  placeholder="Metric name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Label>Unit Type</Label>
                <UnitSelector>
                  {METRIC_UNITS.map((u) => (
                    <UnitOption
                      key={u.value}
                      type="button"
                      $active={form.unit_type === u.value}
                      onClick={() => setForm((f) => ({ ...f, unit_type: u.value }))}
                    >
                      {u.label}
                    </UnitOption>
                  ))}
                </UnitSelector>
                <Label>Add New Entry</Label>
                <TextInput
                  type="text"
                  placeholder="New value"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
                <ModalActions>
                  <DeleteButton type="button" onClick={deleteMetric}>Delete</DeleteButton>
                  <SaveButton onClick={saveEditMetric} disabled={!form.name || !form.name.trim()}>
                    Save
                  </SaveButton>
                </ModalActions>
              </>
            )}
          </ModalSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
