import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'fitness:data:v1'
const today = () => new Date().toISOString().split('T')[0]

const DEFAULT_EXERCISES = [
  'Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Cable Fly', 'Close-Grip Bench Press',
  'Squat', 'Front Squat', 'Bulgarian Split Squat', 'Leg Press', 'Leg Extension', 'Leg Curl', 'Calf Raise',
  'Deadlift', 'Romanian Deadlift', 'Sumo Deadlift', 'Hip Thrust', 'Lunge',
  'Overhead Press', 'Push Press', 'Lateral Raise', 'Face Pull',
  'Barbell Row', 'Pendlay Row', 'Seated Row', 'Lat Pulldown',
  'Pull-up', 'Chin-up', 'Dip',
  'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl',
  'Tricep Pushdown', 'Skull Crusher', 'Overhead Tricep Extension',
]

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return { workouts: [], meals: [], exerciseLibrary: DEFAULT_EXERCISES }
    return {
      workouts: saved.workouts ?? [],
      meals: saved.meals ?? [],
      exerciseLibrary: saved.exerciseLibrary ?? DEFAULT_EXERCISES,
    }
  } catch {
    return { workouts: [], meals: [], exerciseLibrary: DEFAULT_EXERCISES }
  }
}

// ── Shared styles
const s = {
  card: {
    background: 'var(--card)',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 12,
    border: '1px solid var(--border)',
  },
  input: {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--ink)',
    padding: '10px 12px',
    fontFamily: 'DM Mono, monospace',
    fontSize: 14,
    boxSizing: 'border-box',
    marginBottom: 10,
  },
  label: {
    display: 'block',
    color: 'var(--muted)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  btnPrimary: {
    background: 'var(--lime)',
    color: '#0d1117',
    border: 'none',
    borderRadius: 8,
    padding: '12px 20px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    width: '100%',
    minHeight: 44,
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--muted)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 16px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    minHeight: 44,
  },
  meta: {
    color: 'var(--muted)',
    fontFamily: 'DM Mono, monospace',
    fontSize: 12,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--muted)',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: 1,
    minWidth: 44,
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 0 0 8px',
    flexShrink: 0,
  },
}

// ── Icons
function IconDumbbell({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="4" height="6" rx="1" />
      <rect x="18" y="9" width="4" height="6" rx="1" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <rect x="5" y="7" width="3" height="10" rx="1" />
      <rect x="16" y="7" width="3" height="10" rx="1" />
    </svg>
  )
}

function IconBowl({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11c0 4.418 3.582 8 8 8s8-3.582 8-8H4z" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

function IconTrend({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

// ── ExerciseSearch — live autocomplete
function ExerciseSearch({ library, onAdd }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const lower = query.toLowerCase().trim()
  const matches = lower ? library.filter(e => e.toLowerCase().includes(lower)).slice(0, 8) : []
  const canAddNew = lower && !library.some(e => e.toLowerCase() === lower)
  const showDropdown = open && (matches.length > 0 || canAddNew)

  function pick(name) {
    onAdd(name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        style={{ ...s.input, marginBottom: 0 }}
        placeholder="Search or type to add..."
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
      />
      {showDropdown && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 8, zIndex: 200, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          maxHeight: 220, overflowY: 'auto',
        }}>
          {matches.map(name => (
            <button key={name} type="button" onPointerDown={e => { e.preventDefault(); pick(name) }}
              style={{ display: 'block', width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', color: 'var(--ink)', padding: '11px 14px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: 14, cursor: 'pointer' }}>
              {name}
            </button>
          ))}
          {canAddNew && (
            <button type="button" onPointerDown={e => { e.preventDefault(); pick(query.trim()) }}
              style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--lime)', padding: '11px 14px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: 14, cursor: 'pointer' }}>
              + Add "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── ExerciseTracker — live set-by-set logging
function ExerciseTracker({ exercise, onChange, onRemove }) {
  const lastWeight = exercise.sets.length > 0 ? String(exercise.sets[exercise.sets.length - 1].weight) : ''
  const [kg, setKg] = useState(lastWeight)
  const [reps, setReps] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const repsRef = useRef(null)

  function confirmSet() {
    if (!kg && !reps) return
    onChange({ ...exercise, sets: [...exercise.sets, { weight: kg, reps }] })
    setReps('')
    setTimeout(() => repsRef.current?.focus(), 30)
  }

  function removeSet(i) {
    onChange({ ...exercise, sets: exercise.sets.filter((_, idx) => idx !== i) })
  }

  const hasSets = exercise.sets.length > 0
  const maxWeight = hasSets ? Math.max(...exercise.sets.map(s => Number(s.weight) || 0)) : 0

  return (
    <div style={{ ...s.card, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 8, minHeight: 36 }}
        >
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--ink)', letterSpacing: '0.02em' }}>
            {exercise.name}
          </span>
          {collapsed && hasSets && (
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>
              {exercise.sets.length} sets{maxWeight > 0 ? ` · ${maxWeight}kg` : ''}
            </span>
          )}
          <span style={{ color: 'var(--muted)', fontSize: 14, marginLeft: 'auto', paddingRight: 4 }}>
            {collapsed ? '▸' : '▾'}
          </span>
        </button>
        <button type="button" onClick={onRemove} style={{ ...s.deleteBtn, marginLeft: 4 }}>×</button>
      </div>

      {!collapsed && (
        <>
        {/* Completed sets */}
        {hasSets && (
          <div style={{ marginTop: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <span style={{ ...s.label, width: 28, textAlign: 'center', marginBottom: 0 }}>SET</span>
              <span style={{ ...s.label, flex: 1, textAlign: 'center', marginBottom: 0 }}>KG</span>
              <span style={{ ...s.label, flex: 1, textAlign: 'center', marginBottom: 0 }}>REPS</span>
              <span style={{ width: 36 }} />
            </div>
            {exercise.sets.map((set, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ width: 28, textAlign: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--muted)', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 4px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 14, color: 'var(--ink)' }}>
                  {set.weight || '—'}
                </div>
                <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 4px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 14, color: 'var(--ink)' }}>
                  {set.reps || '—'}
                </div>
                <button type="button" onClick={() => removeSet(i)} style={{ ...s.deleteBtn, width: 36, minWidth: 36, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Live-add row */}
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          paddingTop: hasSets ? 8 : 4,
          borderTop: hasSets ? '1px solid var(--border)' : 'none',
        }}>
        <span style={{ width: 28, textAlign: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--lime)', flexShrink: 0 }}>
          {exercise.sets.length + 1}
        </span>
        <input
          type="number" inputMode="decimal" placeholder="kg"
          value={kg}
          onChange={e => setKg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && repsRef.current?.focus()}
          style={{ ...s.input, flex: 1, marginBottom: 0, textAlign: 'center', padding: '9px 4px', borderColor: 'rgba(126,231,135,0.4)' }}
        />
        <input
          ref={repsRef}
          type="number" inputMode="numeric" placeholder="reps"
          value={reps}
          onChange={e => setReps(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && confirmSet()}
          style={{ ...s.input, flex: 1, marginBottom: 0, textAlign: 'center', padding: '9px 4px' }}
        />
        <button
          type="button"
          onClick={confirmSet}
          style={{ width: 38, minWidth: 38, height: 40, background: 'var(--lime)', border: 'none', borderRadius: 8, color: '#0d1117', fontWeight: 900, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          ✓
        </button>
        </div>
        </>
      )}
    </div>
  )
}

// ── SessionCard — one training session for a day
function SessionCard({ session, onUpdate, onDelete, exerciseLibrary }) {
  function addExercise(name) {
    onUpdate({ exercises: [...session.exercises, { name, sets: [] }] })
  }

  function updateExercise(i, updated) {
    onUpdate({ exercises: session.exercises.map((e, idx) => idx === i ? updated : e) })
  }

  function removeExercise(i) {
    onUpdate({ exercises: session.exercises.filter((_, idx) => idx !== i) })
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {session.name}
        </span>
        <button onClick={onDelete} style={s.deleteBtn} aria-label="Delete session">×</button>
      </div>

      {session.exercises.map((ex, i) => (
        <ExerciseTracker
          key={i}
          exercise={ex}
          onChange={updated => updateExercise(i, updated)}
          onRemove={() => removeExercise(i)}
        />
      ))}

      <div style={{ ...s.card, background: 'transparent', border: '1px dashed var(--border)', marginBottom: 0 }}>
        <label style={s.label}>Add Exercise</label>
        <ExerciseSearch library={exerciseLibrary} onAdd={addExercise} />
      </div>
    </div>
  )
}

// ── MonthGrid — calendar grid
function MonthGrid({ year, month, selectedDate, workoutDates, onDayClick }) {
  const firstOffset = (() => {
    const d = new Date(year, month, 1).getDay()
    return d === 0 ? 6 : d - 1 // Mon=0 … Sun=6
  })()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today()

  const cells = []
  for (let i = 0; i < firstOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--muted)', letterSpacing: '0.06em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === todayStr
          const hasWorkout = workoutDates.has(dateStr)

          return (
            <button
              key={i}
              onClick={() => onDayClick(dateStr)}
              style={{
                position: 'relative',
                border: 'none',
                borderRadius: 8,
                minHeight: 44,
                background: isSelected
                  ? 'var(--lime)'
                  : isToday
                  ? 'rgba(126,231,135,0.1)'
                  : 'transparent',
                color: isSelected ? '#0d1117' : isToday ? 'var(--lime)' : 'var(--ink)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: isSelected || isToday ? 700 : 400,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                outline: isToday && !isSelected ? '1px solid rgba(126,231,135,0.3)' : 'none',
              }}
            >
              {day}
              {hasWorkout && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: isSelected ? '#0d1117' : 'var(--lime)',
                  position: 'absolute',
                  bottom: 5,
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── CalendarView — full calendar + day sessions
function CalendarView({ workouts, onAddSession, onUpdateSession, onDeleteSession, exerciseLibrary }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(today())
  const [addingSession, setAddingSession] = useState(false)
  const [sessionName, setSessionName] = useState('')

  const workoutDateSet = new Set(workouts.map(w => w.date))
  const daySessions = workouts.filter(w => w.date === selectedDate)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function startSession(e) {
    e.preventDefault()
    if (!sessionName.trim()) return
    onAddSession(selectedDate, sessionName.trim())
    setSessionName('')
    setAddingSession(false)
  }

  const dateLabel = (() => {
    if (selectedDate === today()) return 'Today'
    const d = new Date(selectedDate + 'T00:00:00')
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  })()

  return (
    <div>
      {/* Month header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button onClick={prevMonth} style={{ ...s.deleteBtn, padding: 0, fontSize: 22, color: 'var(--ink)' }}>‹</button>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--ink)', letterSpacing: '0.04em' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ ...s.deleteBtn, padding: 0, fontSize: 22, color: 'var(--ink)' }}>›</button>
      </div>

      <MonthGrid
        year={viewYear}
        month={viewMonth}
        selectedDate={selectedDate}
        workoutDates={workoutDateSet}
        onDayClick={setSelectedDate}
      />

      {/* Day divider */}
      <div style={{ margin: '20px 0 16px', borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 20, color: selectedDate === today() ? 'var(--lime)' : 'var(--ink)', margin: 0, letterSpacing: '0.03em' }}>
          {dateLabel}
        </h2>
      </div>

      {/* Sessions for selected day */}
      {daySessions.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          onUpdate={updates => onUpdateSession(session.id, updates)}
          onDelete={() => onDeleteSession(session.id)}
          exerciseLibrary={exerciseLibrary}
        />
      ))}

      {/* Add session */}
      {!addingSession ? (
        <button style={s.btnPrimary} onClick={() => setAddingSession(true)}>
          + New Session
        </button>
      ) : (
        <form onSubmit={startSession} style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...s.input, flex: 1, marginBottom: 0 }}
            placeholder="e.g. Push Day"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            autoFocus
          />
          <button type="submit" style={{ ...s.btnPrimary, width: 'auto', padding: '0 18px' }}>+</button>
          <button type="button" style={{ ...s.btnGhost, padding: '0 14px' }} onClick={() => setAddingSession(false)}>×</button>
        </form>
      )}
    </div>
  )
}

// ── MealsView
function MealsView({ meals, onAdd, onDelete }) {
  const blank = { name: '', calories: '', protein: '', notes: '', date: today() }
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, calories: Number(form.calories) || 0, protein: Number(form.protein) || 0 })
    setForm(blank)
    setOpen(false)
  }

  const todayMeals = meals.filter(m => m.date === today())
  const totalCals = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const totalProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0)

  return (
    <div>
      {todayMeals.length > 0 && (
        <div style={{ ...s.card, marginBottom: 20, display: 'flex', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 32, color: 'var(--lime)', lineHeight: 1 }}>{totalCals}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>kcal today</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 32, color: 'var(--lime)', lineHeight: 1 }}>{totalProtein}g</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>protein today</div>
          </div>
        </div>
      )}
      {!open ? (
        <button style={{ ...s.btnPrimary, marginBottom: 20 }} onClick={() => setOpen(true)}>+ Log Meal</button>
      ) : (
        <div style={{ ...s.card, marginBottom: 20 }}>
          <form onSubmit={submit}>
            <label style={s.label}>Meal Name</label>
            <input style={s.input} placeholder="e.g. Post-workout shake" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Calories</label>
                <input style={s.input} type="number" inputMode="numeric" placeholder="500" min="0" value={form.calories} onChange={e => set('calories', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Protein (g)</label>
                <input style={s.input} type="number" inputMode="numeric" placeholder="40" min="0" value={form.protein} onChange={e => set('protein', e.target.value)} />
              </div>
            </div>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            <label style={s.label}>Notes</label>
            <textarea style={{ ...s.input, resize: 'vertical', minHeight: 64 }} placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ ...s.btnPrimary, flex: 1 }}>Save</button>
              <button type="button" style={s.btnGhost} onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {meals.length === 0 ? (
        <p style={{ ...s.meta, textAlign: 'center', marginTop: 48, fontSize: 13 }}>No meals logged yet.</p>
      ) : (
        meals.map(m => (
          <div key={m.id} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--ink)', lineHeight: 1.2 }}>{m.name}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  {m.calories > 0 && <span style={{ ...s.meta, color: 'var(--lime)', fontSize: 13 }}>{m.calories} kcal</span>}
                  {m.protein > 0 && <span style={s.meta}>{m.protein}g protein</span>}
                  <span style={s.meta}>{m.date}</span>
                </div>
                {m.notes ? <p style={{ ...s.meta, marginTop: 8, lineHeight: 1.6 }}>{m.notes}</p> : null}
              </div>
              <button style={s.deleteBtn} onClick={() => onDelete(m.id)} aria-label="Delete meal">×</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── ProgressView
function ProgressView({ workouts }) {
  const [selected, setSelected] = useState(null)

  const stats = {}
  for (const w of workouts) {
    for (const ex of (w.exercises || [])) {
      if (!stats[ex.name]) stats[ex.name] = { sessions: [], pr: null }
      const validSets = ex.sets.filter(s => Number(s.weight) > 0 || Number(s.reps) > 0)
      stats[ex.name].sessions.push({ date: w.date, workoutName: w.name, sets: validSets })
      for (const set of validSets) {
        const kg = Number(set.weight) || 0
        const reps = Number(set.reps) || 0
        const cur = stats[ex.name].pr
        if (!cur || kg > cur.weight || (kg === cur.weight && reps > cur.reps)) {
          stats[ex.name].pr = { weight: kg, reps }
        }
      }
    }
  }
  for (const key of Object.keys(stats)) {
    stats[key].sessions.sort((a, b) => b.date.localeCompare(a.date))
  }

  const exercises = Object.keys(stats).sort()

  if (selected) {
    const data = stats[selected] || { sessions: [], pr: null }
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ ...s.btnGhost, marginBottom: 16 }}>← Back</button>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 26, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
            {selected}
          </h2>
          {data.pr && data.pr.weight > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, background: 'var(--bg)', border: '1px solid var(--lime)', borderRadius: 6, padding: '5px 12px' }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, color: 'var(--lime)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>PR</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: 'var(--ink)' }}>{data.pr.weight}kg × {data.pr.reps}</span>
            </div>
          )}
        </div>
        {data.sessions.map((session, i) => (
          <div key={i} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{session.workoutName}</span>
              <span style={s.meta}>{session.date}</span>
            </div>
            {session.sets.map((set, j) => (
              <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                <span style={{ ...s.meta, width: 36 }}>Set {j + 1}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--ink)' }}>
                  {Number(set.weight) > 0 ? `${set.weight}kg` : '—'} × {Number(set.reps) > 0 ? set.reps : '—'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {exercises.length === 0 ? (
        <p style={{ ...s.meta, textAlign: 'center', marginTop: 48, fontSize: 13 }}>
          Log workouts with exercises to see your progress here.
        </p>
      ) : (
        exercises.map(name => {
          const data = stats[name]
          return (
            <button key={name} onClick={() => setSelected(name)}
              style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>{name}</div>
                {data.pr && data.pr.weight > 0 && <div style={s.meta}>PR: {data.pr.weight}kg × {data.pr.reps}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={s.meta}>{data.sessions.length} session{data.sessions.length !== 1 ? 's' : ''}</div>
                <div style={{ color: 'var(--muted)', fontSize: 20, lineHeight: 1, marginTop: 2 }}>›</div>
              </div>
            </button>
          )
        })
      )}
    </div>
  )
}

// ── BottomNav
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'workouts', label: 'Workouts', Icon: IconDumbbell },
    { id: 'meals', label: 'Meals', Icon: IconBowl },
    { id: 'progress', label: 'Progress', Icon: IconTrend },
  ]
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 100 }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = tab === id
        return (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active ? 'var(--lime)' : 'var(--muted)', minHeight: 56 }}>
            <Icon color={active ? 'var(--lime)' : 'var(--muted)'} />
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ── App
export default function App() {
  const [data, setData] = useState(loadData)
  const [tab, setTab] = useState('workouts')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  function addSession(date, name) {
    const session = { id: Date.now(), date, name, exercises: [] }
    const newLib = [...data.exerciseLibrary]
    setData(d => ({ ...d, workouts: [session, ...d.workouts] }))
  }

  function updateSession(id, updates) {
    setData(d => ({
      ...d,
      workouts: d.workouts.map(w => w.id === id ? { ...w, ...updates } : w),
    }))
  }

  function deleteSession(id) {
    setData(d => ({ ...d, workouts: d.workouts.filter(w => w.id !== id) }))
  }

  function addMeal(meal) {
    setData(d => ({ ...d, meals: [{ id: Date.now(), ...meal }, ...d.meals] }))
  }

  function deleteMeal(id) {
    setData(d => ({ ...d, meals: d.meals.filter(m => m.id !== id) }))
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', position: 'relative' }}>
      <header style={{ padding: '14px 20px 12px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 26, color: 'var(--lime)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Khashi Fit
        </h1>
      </header>
      <main style={{ padding: '20px 16px 100px' }}>
        {tab === 'workouts' && (
          <CalendarView
            workouts={data.workouts}
            onAddSession={addSession}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
            exerciseLibrary={data.exerciseLibrary}
          />
        )}
        {tab === 'meals' && <MealsView meals={data.meals} onAdd={addMeal} onDelete={deleteMeal} />}
        {tab === 'progress' && <ProgressView workouts={data.workouts} />}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
