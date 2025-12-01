# Pauli Test Scoring

How oPau calculates and interprets your test results

## What's a Pauli Test?

Basically you add pairs of single-digit numbers (1-9) and only care about the last digit. Work as fast as you can while staying accurate.

```
7 + 8 = 15 → answer: 5
3 + 4 = 7  → answer: 7
9 + 9 = 18 → answer: 8
```

Simple math, but doing it for 5-10 minutes straight tests your focus and stamina.

## Why Digital Is Better

The old paper version sucked to score (manual counting = hours of work). Digital version:

- Instant results
- Millisecond-accurate timing per answer
- Tracks if you changed answers
- Automatic charts and stats
- No human error in counting

## The Four Metrics (Panker, Tianker, Janker, Hanker)

These are the traditional names from the original test. Yeah they sound weird but they're legit psychological terms.

### 1. Panker (Speed)

**Measures:** How fast you work

**Metric:** APM (additions per minute)

```typescript
apm = totalAnswered / (durationMs / 60000)
```

**Thresholds:**

- ≥35 APM = Excellent (zooming)
- 25-34 = Good
- 15-24 = Moderate
- <15 = Poor (maybe take some coffee?)

### 2. Tianker (Accuracy)

**Measures:** How correct you are

**Metric:** Accuracy percentage

```typescript
accuracy = (totalCorrect / totalAnswered) × 100
```

**Thresholds:**

- ≥90% = Excellent (almost perfect)
- 80-89% = Good
- 70-79% = Moderate
- <70% = Poor (slow down maybe?)

### 3. Janker (Consistency)

**Measures:** How stable your performance is across grids

**Metric:** Coefficient of variation (CV)

Basically: Are you consistently good or all over the place?

**Thresholds:**

- <5% CV = Excellent (rock solid)
- 5-9% = Good
- 10-14% = Moderate
- ≥15% = Poor (inconsistent af)

**Note:** Needs at least 2 grids to calculate

### 4. Hanker (Endurance)

**Measures:** Do you get tired? Does your performance drop?

**How It Works:** Splits your answers into thirds (early/middle/late) and compares them

```typescript
degradation = ((earlyAccuracy - lateAccuracy) / earlyAccuracy) × 100
```

**Thresholds:**

- <5% = Excellent (no fatigue!)
- 5-9% = Good
- 10-19% = Moderate (getting tired)
- ≥20% = Significant fatigue
- Negative = Improvement (you got BETTER over time, nice!)

**Note:** Needs at least 9 answers to calculate

## How It's Calculated

### Basic Validation

```typescript
expectedAnswer = (num1 + num2) % 10
isCorrect = userAnswer === expectedAnswer
```

### Per-Grid Stats

```typescript
gridAccuracy = (correct / answered) × 100
gridAPM = answered / (durationMs / 60000)
```

### Overall Test

```typescript
totalAccuracy = (all correct / all answered) × 100
totalAPM = all answered / (total time ms / 60000)
```

### For Consistency (Janker)

```typescript
mean = average of all grid accuracies
stdDev = standard deviation
CV = (stdDev / mean) × 100
```

Lower CV = more consistent

## Implementation (for Nerds)

This app uses clean architecture so the scoring logic is totally separate from Vue/UI stuff.

### Folder Structure

```
src/
├── domain/pauli/           # pure calculation logic (no Vue/UI stuff)
│   ├── calculations/       # panker, tianker, janker, hanker calculators
│   ├── interpretations/    # threshold checking
│   └── PauliTestOrchestrator.ts  # runs everything
│
├── services/              # thin wrapper layer
│   └── resultCalculator.ts
│
├── stores/               # pinia state (grids, answers, timing)
│   └── test.ts
│
├── composables/          # vue reactive logic
│   ├── grid/            # grid management
│   ├── test/            # timer, config
│   └── chart/           # chart stuff
│
├── components/          # vue components
│   ├── test-result/    # all the result display stuff
│   └── history/        # history views
│
├── infrastructure/     # database (IndexedDB)
│   └── database/
│
└── views/             # pages
    ├── TestView.vue
    ├── TestResultView.vue
    └── HistoryView.vue
```

### Key Points

**Domain Layer = Pure Functions**

- No framework dependencies
- Easy to test
- Can reuse in other projects

**Composables = Feature-Based**

- One composable per feature (grid, timer, chart, etc)
- Not one giant file

**State = Pinia**

- Test results auto-calculated via computed properties
- Updates when you change answers

**Storage = IndexedDB**

- All data stays local
- Repository pattern for clean separation

### How Scoring Works

```typescript
// 1. you take the test (answers stored in pinia)
grids[0].answers.set(cellIndex, { value: 5, timestamp: Date.now(), isChanged: false })

// 2. test ends, orchestrator runs
const result = orchestrateTestCalculation(grids, startTime, endTime, ...)

// 3. inside orchestrator:
// - process each grid
// - calculate tianker (accuracy)
// - calculate panker (speed)
// - calculate janker if ≥2 grids (consistency)
// - calculate hanker if ≥9 answers (endurance)

// 4. results displayed instantly
```

### Tech Stack

- Vue 3.5 + TypeScript 5.8 (strict mode, no `any` types)
- Pinia for state
- Unovis for charts
- IndexedDB for storage
- Tailwind CSS for styling

## Example Result

Say you complete a 5-minute test:

**Raw Data:**

- 140 answers total
- 118 correct, 22 wrong
- 84.3% accuracy
- 27.1 APM

**Interpretation:**

- **Panker (speed):** 27.1 APM → **Good** (above average)
- **Tianker (accuracy):** 84.3% → **Good** (minor mistakes)
- **Janker (consistency):** 6.8% CV → **Good** (pretty stable)
- **Hanker (endurance):** 14.9% degradation → **Moderate** (got tired near end)

**Verdict:** Decent speed and accuracy, consistent work, but shows fatigue. Maybe take breaks or work on stamina.

## Edge Cases

**Not Enough Data?**

- Janker needs ≥2 grids
- Hanker needs ≥9 answers
- If not met, those metrics just won't show

**Negative Degradation?**

- Means you IMPROVED during the test
- Learning effect or warm-up period
- Actually a good thing!

**Changed Answers?**

- Tracked automatically
- Shows self-correction behavior
- Counts in total answered

## References

Based on traditional Pauli test methodology adapted for digital use. Thresholds are from actual psychological assessment standards.

- Khuzaimah, U. (2014). Tes Inventory: EPPS & PAULI.
- Pane, H., & Fauziah, N. (2020). _Rancang Bangun Aplikasi Kraepelin Test Berbasis Web Menggunakan Metode Bubble Sort_. Jakarta Selatan: JOINTECS.

---

**Version:** 3.0  
**Updated:** December 2025  
**Status:** Prototype phase
