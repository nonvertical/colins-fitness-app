import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useLocalStorage from '../../hooks/useLocalStorage';
import {
  DetailPage,
  DetailHeader,
  BackRow,
  BackButton,
  DetailTitle,
  DetailMeta,
  TypeBadge,
  StreakBadge,
  MoreButton,
  MoreMenuBackdrop,
  MoreMenuDropdown,
  MoreMenuItem,
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
  CycleSection,
  CycleCurrentCard,
  CycleCardRow,
  CycleName,
  CycleDate,
  CycleBadge,
  CycleRow,
  CycleRowInfo,
  CycleStat,
  ViewingBanner,
  ViewingBannerButton,
  ModalBackdrop,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  Label,
  TextInput,
  TypeSelector,
  TypeOption,
  ToggleRow,
  ToggleLabel,
  ToggleSwitch,
  ChipGroup,
  Chip,
  ChipRemove,
  AddChipRow,
  SmallInput,
  SmallButton,
  ModalActions,
  SaveButton,
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
  { key: 'all', label: 'Full Cycle', days: null },
];

function filterLogsToCycle(allLogs, habitId, cycle) {
  return allLogs.filter((l) => {
    if (l.habit_id !== habitId) return false;
    const logDate = l.timestamp.split('T')[0];
    if (logDate < cycle.start_date) return false;
    if (cycle.end_date && logDate > cycle.end_date) return false;
    return true;
  });
}

function computePeriodStats(logs, periodKey, cycleStartDate) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let start;
  const periodDef = PERIODS.find((p) => p.key === periodKey);

  if (periodDef.days) {
    start = new Date();
    start.setDate(start.getDate() - periodDef.days);
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date(`${cycleStartDate}T00:00:00`);
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

function computeCompletedCycleStats(logs) {
  const uniqueDays = new Set(logs.map((l) => l.timestamp.split('T')[0]));
  return {
    daysLogged: uniqueDays.size,
    entries: logs.length,
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

function ensureCycles(habitCycles, setHabitCycles, habit) {
  const existing = habitCycles.filter((c) => c.habit_id === habit.id);
  if (existing.length > 0) return existing;

  const initial = {
    id: generateId(),
    habit_id: habit.id,
    name: 'Cycle 1',
    start_date: habit.tracking_start_date || todayStr(),
    end_date: null,
    duration_type: 'ongoing',
    planned_end_date: null,
  };
  setHabitCycles((prev) => [...prev, initial]);
  return [initial];
}

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [habitLogs, setHabitLogs] = useLocalStorage('habit_logs', []);
  const [habitCycles, setHabitCycles] = useLocalStorage('habit_cycles', []);

  const [period, setPeriod] = useState('month');
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', type: 'daily', timed: false, counted: false, quick_time_options: [], quick_count_options: [],
  });
  const [timeChipInput, setTimeChipInput] = useState('');
  const [countChipInput, setCountChipInput] = useState('');
  const [resetForm, setResetForm] = useState({ name: '', duration_type: 'ongoing', planned_end_date: '' });
  const [viewingCycleId, setViewingCycleId] = useState(null);
  const [editingCycleName, setEditingCycleName] = useState(null);
  const [cycleNameInput, setCycleNameInput] = useState('');

  const habit = habits.find((h) => h.id === id);

  // Ensure cycles exist for this habit
  useEffect(() => {
    if (habit) {
      ensureCycles(habitCycles, setHabitCycles, habit);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit?.id]);

  if (!habit) {
    return (
      <DetailPage>
        <DetailHeader>
          <BackRow>
            <BackButton onClick={() => navigate('/habits')}>&#8592; Habits</BackButton>
          </BackRow>
          <DetailTitle>Habit not found</DetailTitle>
        </DetailHeader>
      </DetailPage>
    );
  }

  const cycles = habitCycles
    .filter((c) => c.habit_id === habit.id)
    .sort((a, b) => b.start_date.localeCompare(a.start_date));

  const currentCycle = cycles.find((c) => !c.end_date) || cycles[0];
  const pastCycles = cycles.filter((c) => c.end_date);
  const viewingCycle = viewingCycleId ? cycles.find((c) => c.id === viewingCycleId) : null;
  const activeCycle = viewingCycle || currentCycle;

  const cycleLogs = activeCycle
    ? filterLogsToCycle(habitLogs, habit.id, activeCycle)
    : [];

  const isDaily = habit.type !== 'irregular';
  const streak = viewingCycle ? 0 : computeStreak(cycleLogs);
  const stats = activeCycle
    ? computePeriodStats(cycleLogs, period, activeCycle.start_date)
    : { daysLogged: 0, totalDays: 0, percentage: 0, entries: 0 };

  const loggedDays = new Set(cycleLogs.map((l) => l.timestamp.split('T')[0]));
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

  // ─── More Menu Actions ─────────────────────────────────────────────────────

  function openEditModal() {
    setEditForm({
      name: habit.name,
      type: habit.type || 'daily',
      timed: habit.timed || false,
      counted: habit.counted || false,
      quick_time_options: habit.quick_time_options || [],
      quick_count_options: habit.quick_count_options || [],
    });
    setTimeChipInput('');
    setCountChipInput('');
    setEditModal(true);
    setMenuOpen(false);
  }

  function handleEditSave() {
    const trimmedName = editForm.name.trim();
    if (!trimmedName) return;
    setHabits((prev) => prev.map((h) => (
      h.id === habit.id ? {
        ...h,
        name: trimmedName,
        type: editForm.type,
        timed: editForm.timed,
        counted: editForm.counted,
        quick_time_options: editForm.timed ? editForm.quick_time_options : [],
        quick_count_options: editForm.counted ? editForm.quick_count_options : [],
      } : h
    )));
    setEditModal(false);
  }

  function addTimeChip() {
    const val = parseInt(timeChipInput, 10);
    if (!val || val <= 0) return;
    if (editForm.quick_time_options.includes(val)) return;
    setEditForm((f) => ({
      ...f,
      quick_time_options: [...f.quick_time_options, val].sort((a, b) => a - b),
    }));
    setTimeChipInput('');
  }

  function removeTimeChip(minutes) {
    setEditForm((f) => ({
      ...f,
      quick_time_options: f.quick_time_options.filter((v) => v !== minutes),
    }));
  }

  function addCountChip() {
    const val = parseInt(countChipInput, 10);
    if (!val || val <= 0) return;
    if (editForm.quick_count_options.includes(val)) return;
    setEditForm((f) => ({
      ...f,
      quick_count_options: [...f.quick_count_options, val].sort((a, b) => a - b),
    }));
    setCountChipInput('');
  }

  function removeCountChip(count) {
    setEditForm((f) => ({
      ...f,
      quick_count_options: f.quick_count_options.filter((v) => v !== count),
    }));
  }

  function handleDelete() {
    setMenuOpen(false);
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (!window.confirm(`Delete "${habit.name}" and all its logs?`)) return;
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
    setHabitLogs((prev) => prev.filter((l) => l.habit_id !== habit.id));
    setHabitCycles((prev) => prev.filter((c) => c.habit_id !== habit.id));
    navigate('/habits');
  }

  function openResetModal() {
    const nextNum = cycles.length + 1;
    setResetForm({
      name: `Cycle ${nextNum}`,
      duration_type: 'ongoing',
      planned_end_date: '',
    });
    setResetModal(true);
    setMenuOpen(false);
  }

  function handleReset() {
    const trimmedName = resetForm.name.trim();
    if (!trimmedName) return;

    // End current cycle
    if (currentCycle) {
      setHabitCycles((prev) => prev.map((c) => (
        c.id === currentCycle.id ? { ...c, end_date: todayStr() } : c
      )));
    }

    // Create new cycle
    const newCycle = {
      id: generateId(),
      habit_id: habit.id,
      name: trimmedName,
      start_date: todayStr(),
      end_date: null,
      duration_type: resetForm.duration_type,
      planned_end_date: resetForm.duration_type === 'fixed' ? resetForm.planned_end_date : null,
    };
    setHabitCycles((prev) => [...prev, newCycle]);
    setResetModal(false);
    setViewingCycleId(null);
  }

  // ─── Cycle Name Editing ────────────────────────────────────────────────────

  function startEditCycleName(cycle) {
    setEditingCycleName(cycle.id);
    setCycleNameInput(cycle.name);
  }

  function saveCycleName(cycleId) {
    const trimmed = cycleNameInput.trim();
    if (trimmed) {
      setHabitCycles((prev) => prev.map((c) => (
        c.id === cycleId ? { ...c, name: trimmed } : c
      )));
    }
    setEditingCycleName(null);
  }

  function handleModalBackdrop(e) {
    if (e.target === e.currentTarget) {
      setEditModal(false);
      setResetModal(false);
    }
  }

  return (
    <DetailPage>
      <DetailHeader>
        <BackRow>
          <BackButton onClick={() => navigate('/habits')}>&#8592; Habits</BackButton>
          <MoreButton onClick={() => setMenuOpen(!menuOpen)}>
            &#8943;
            {menuOpen && (
              <>
                <MoreMenuBackdrop onClick={() => setMenuOpen(false)} />
                <MoreMenuDropdown>
                  <MoreMenuItem type="button" onClick={openEditModal}>Edit</MoreMenuItem>
                  <MoreMenuItem type="button" onClick={openResetModal}>Reset</MoreMenuItem>
                  <MoreMenuItem type="button" $variant="danger" onClick={handleDelete}>Delete</MoreMenuItem>
                </MoreMenuDropdown>
              </>
            )}
          </MoreButton>
        </BackRow>
        <DetailTitle>{habit.name}</DetailTitle>
        <DetailMeta>
          <TypeBadge $type={habit.type}>
            {isDaily ? 'daily' : 'irregular'}
          </TypeBadge>
          {isDaily && streak > 0 && (
            <StreakBadge>&#128293; {streak} day streak</StreakBadge>
          )}
          {activeCycle && (
            <span>{activeCycle.name}</span>
          )}
        </DetailMeta>
      </DetailHeader>

      {viewingCycle && (
        <ViewingBanner>
          <span>Viewing: {viewingCycle.name} ({viewingCycle.start_date} &mdash; {viewingCycle.end_date})</span>
          <ViewingBannerButton type="button" onClick={() => setViewingCycleId(null)}>
            &#10005; Back to Current
          </ViewingBannerButton>
        </ViewingBanner>
      )}

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
        {isDaily && !viewingCycle && (
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

      {/* ─── Cycles ───────────────────────────────────────────────────────── */}
      <CycleSection>
        <SectionTitle>Cycles</SectionTitle>

        {currentCycle && (
          <CycleCurrentCard>
            <CycleCardRow>
              {editingCycleName === currentCycle.id ? (
                <input
                  type="text"
                  value={cycleNameInput}
                  onChange={(e) => setCycleNameInput(e.target.value)}
                  onBlur={() => saveCycleName(currentCycle.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveCycleName(currentCycle.id); }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #4285F4',
                    color: '#1D1D1F',
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '2px 0',
                    outline: 'none',
                    width: '60%',
                  }}
                />
              ) : (
                <CycleName
                  onClick={() => startEditCycleName(currentCycle)}
                  style={{ cursor: 'pointer' }}
                >
                  {currentCycle.name}
                </CycleName>
              )}
              <CycleBadge $active>current</CycleBadge>
            </CycleCardRow>
            <CycleDate>
              Started {currentCycle.start_date}
              {currentCycle.duration_type === 'fixed' && currentCycle.planned_end_date && (
                <> &middot; Ends {currentCycle.planned_end_date}</>
              )}
              {currentCycle.duration_type === 'ongoing' && (
                <> &middot; Ongoing</>
              )}
            </CycleDate>
          </CycleCurrentCard>
        )}

        {pastCycles.length > 0 && (
          <>
            <SectionTitle style={{ fontSize: 12, marginTop: 16 }}>Past Cycles</SectionTitle>
            {pastCycles.map((cycle) => {
              const cLogs = filterLogsToCycle(habitLogs, habit.id, cycle);
              const cStats = computeCompletedCycleStats(cLogs);
              const cDays = daysBetween(cycle.start_date, cycle.end_date) + 1;
              const cPct = isDaily && cDays > 0
                ? Math.round((cStats.daysLogged / cDays) * 100)
                : null;

              return (
                <CycleRow
                  key={cycle.id}
                  onClick={() => setViewingCycleId(cycle.id)}
                >
                  <CycleRowInfo>
                    <CycleName>{cycle.name}</CycleName>
                    <CycleDate>{cycle.start_date} &mdash; {cycle.end_date}</CycleDate>
                  </CycleRowInfo>
                  <CycleStat>
                    {cPct !== null ? `${cPct}%` : `${cStats.entries} entries`}
                  </CycleStat>
                </CycleRow>
              );
            })}
          </>
        )}
      </CycleSection>

      {/* ─── Edit Modal ───────────────────────────────────────────────────── */}
      {editModal && (
        <ModalBackdrop onClick={handleModalBackdrop}>
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

            <Label>Tracking Options</Label>
            <ToggleRow>
              <ToggleLabel>Timed</ToggleLabel>
              <ToggleSwitch
                type="button"
                $on={editForm.timed}
                onClick={() => setEditForm((f) => ({ ...f, timed: !f.timed }))}
              />
            </ToggleRow>
            {editForm.timed && (
              <>
                <ChipGroup>
                  {editForm.quick_time_options.map((mins) => (
                    <Chip key={mins}>
                      {mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}` : `${mins}m`}
                      <ChipRemove type="button" onClick={() => removeTimeChip(mins)}>&#215;</ChipRemove>
                    </Chip>
                  ))}
                  {editForm.quick_time_options.length === 0 && (
                    <span style={{ fontSize: 12, color: '#666' }}>No quick-entry durations</span>
                  )}
                </ChipGroup>
                <AddChipRow>
                  <SmallInput
                    type="number"
                    placeholder="Minutes"
                    value={timeChipInput}
                    onChange={(e) => setTimeChipInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addTimeChip(); }}
                  />
                  <SmallButton type="button" onClick={addTimeChip}>Add</SmallButton>
                </AddChipRow>
              </>
            )}

            <ToggleRow>
              <ToggleLabel>Counted</ToggleLabel>
              <ToggleSwitch
                type="button"
                $on={editForm.counted}
                onClick={() => setEditForm((f) => ({ ...f, counted: !f.counted }))}
              />
            </ToggleRow>
            {editForm.counted && (
              <>
                <ChipGroup>
                  {editForm.quick_count_options.map((count) => (
                    <Chip key={count}>
                      {count}
                      <ChipRemove type="button" onClick={() => removeCountChip(count)}>&#215;</ChipRemove>
                    </Chip>
                  ))}
                  {editForm.quick_count_options.length === 0 && (
                    <span style={{ fontSize: 12, color: '#666' }}>No quick-entry amounts</span>
                  )}
                </ChipGroup>
                <AddChipRow>
                  <SmallInput
                    type="number"
                    placeholder="Amount"
                    value={countChipInput}
                    onChange={(e) => setCountChipInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCountChip(); }}
                  />
                  <SmallButton type="button" onClick={addCountChip}>Add</SmallButton>
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

      {/* ─── Reset Modal ──────────────────────────────────────────────────── */}
      {resetModal && (
        <ModalBackdrop onClick={handleModalBackdrop}>
          <ModalSheet>
            <ModalHandle />
            <ModalTitle>New Cycle</ModalTitle>

            <Label>Cycle Name</Label>
            <TextInput
              type="text"
              placeholder="Cycle name"
              value={resetForm.name}
              onChange={(e) => setResetForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleReset(); }}
            />

            <Label>Duration</Label>
            <TypeSelector>
              <TypeOption
                type="button"
                $active={resetForm.duration_type === 'ongoing'}
                onClick={() => setResetForm((f) => ({ ...f, duration_type: 'ongoing' }))}
              >
                Ongoing
              </TypeOption>
              <TypeOption
                type="button"
                $active={resetForm.duration_type === 'fixed'}
                onClick={() => setResetForm((f) => ({ ...f, duration_type: 'fixed' }))}
              >
                Fixed
              </TypeOption>
            </TypeSelector>

            {resetForm.duration_type === 'fixed' && (
              <>
                <Label>End Date</Label>
                <TextInput
                  type="date"
                  value={resetForm.planned_end_date}
                  onChange={(e) => setResetForm((f) => ({ ...f, planned_end_date: e.target.value }))}
                />
              </>
            )}

            <ModalActions>
              <SaveButton
                onClick={handleReset}
                disabled={!resetForm.name.trim() || (resetForm.duration_type === 'fixed' && !resetForm.planned_end_date)}
              >
                Start New Cycle
              </SaveButton>
            </ModalActions>
          </ModalSheet>
        </ModalBackdrop>
      )}
    </DetailPage>
  );
}
