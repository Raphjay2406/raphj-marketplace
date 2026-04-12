---
name: interactive-content
description: Interactive content patterns — ROI calculator, quiz with personalized result, product configurator, budget planner, savings calculator. React + Recharts + react-hook-form. Conversion events fired on completion.
tier: domain
triggers: interactive-content, calculator, quiz, configurator, roi-tool, recharts
version: 0.1.0
---

# Interactive Content

Converts passive readers into active engagers — higher conversion than static pages for same content.

## Layer 1 — When to use

- SaaS site: ROI calculator (show savings vs alternative)
- Insurance: quote calculator (realistic price from inputs)
- Education: assessment quiz (recommend learning path)
- E-commerce: product configurator (build-your-own, with live preview)
- Financial: budget/savings planner (interactive charts)
- Real estate: affordability calculator (combined with listing filter)

## Layer 2 — Tech stack

- React + react-hook-form for form state
- Zod for input validation
- Recharts or d3-visx for data viz
- DNA-themed via Tailwind
- Analytics event at every step completion

## Layer 3 — ROI calculator pattern

```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Schema = z.object({
  team_size: z.number().int().min(1).max(10000),
  hourly_cost: z.number().min(10).max(500),
  hours_per_week: z.number().min(1).max(40),
});

export function RoiCalculator() {
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { team_size: 10, hourly_cost: 75, hours_per_week: 8 },
  });
  const values = watch();

  const annualCost = values.team_size * values.hourly_cost * values.hours_per_week * 50;
  const savings = annualCost * 0.4;  // Our product claim

  const data = [
    { name: 'Without us', cost: annualCost },
    { name: 'With us', cost: annualCost - savings },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Team size</span>
          <input type="number" {...register('team_size', { valueAsNumber: true })} />
          {errors.team_size && <p className="text-red-600 text-sm">{errors.team_size.message}</p>}
        </label>
        {/* ... other fields */}
      </form>
      <div>
        <p className="text-4xl font-display font-bold">
          Save ${savings.toLocaleString()} / year
        </p>
        <BarChart width={400} height={240} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="var(--color-primary)" />
        </BarChart>
        <a href="/demo" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg">
          See how — book a demo
        </a>
      </div>
    </div>
  );
}
```

## Layer 4 — Quiz with personalized result

```tsx
const questions = [
  { id: 'usage', text: 'How do you use our product?', options: ['solo', 'team', 'enterprise'] },
  // ...
];

const recommendations = {
  'solo,daily,technical': { plan: 'Pro', reason: 'Fits advanced individual workflows' },
  'team,weekly,non-technical': { plan: 'Starter Team', reason: 'Easy onboarding, collaborative' },
  // ...
};

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  if (step >= questions.length) {
    const key = Object.values(answers).join(',');
    const rec = recommendations[key];
    return <Recommendation rec={rec} />;
  }

  return <Question q={questions[step]} onAnswer={(v) => {
    setAnswers({ ...answers, [questions[step].id]: v });
    setStep(step + 1);
  }} />;
}
```

## Layer 5 — Product configurator

Multi-step tool-call pattern (shared with AI chat depth):

```tsx
function Configurator() {
  const [config, setConfig] = useState({});
  const steps = [
    { id: 'size', options: ['S','M','L','XL'] },
    { id: 'color', options: ['black','white','red'] },
    { id: 'engraving', input: 'text' },
  ];
  // Live 3D preview via react-three-fiber updates on config change
  return (
    <Canvas>
      <ProductModel {...config} />
    </Canvas>
  );
}
```

## Layer 6 — Archetype fit

| Archetype | Fit | Notes |
|---|---|---|
| Neo-Corporate | Excellent | ROI + quiz drive conversion |
| Data-Dense | Excellent | Calculators are native |
| Editorial | Moderate | One tool max per article; don't clutter |
| Brutalist | Use | Sharp, minimal UI; raw numbers |
| Playful | Excellent | Quiz + gamified configurator |
| Luxury | Restrained | Calculator only if clearly value-add; never "gamify" |

## Layer 7 — Integration

- Event tracking: `interactive_start`, `interactive_step_complete`, `interactive_finish`, `interactive_cta_click`
- Conversion-gate CV4 friction audit applies (max fields per intent)
- Ledger: `interactive-completed`
- Cost: minimal (client-side compute); no API unless personalization calls backend

## Layer 8 — Anti-patterns

- ❌ Calculator with 20 required fields — abandonment
- ❌ Quiz where all paths recommend same plan — distrust
- ❌ No shareable result (quiz with no URL-share) — miss viral loop
- ❌ No CTA at result stage — user completed, we got nothing
- ❌ Configurator without live preview — users don't trust output
