---
name: chart-data-viz
description: "Chart and data visualization patterns: Recharts with shadcn styling, stat cards with sparklines, area/bar/donut/line charts, responsive containers, real-time updates, accessible charts. v3.1: volume-threshold + a11y-grade + library-rec decision matrix distilled from UI UX PRO MAX."
tier: domain
triggers: "chart, graph, visualization, sparkline, donut, area chart, bar chart, line chart, analytics, metrics, recharts, chart-type selection, a11y chart"
version: "3.1.0"
---

## v3.1 Addendum: Chart-Type Decision Matrix

Distilled from PRO MAX charts.csv (25 patterns). Use this before reaching for default Recharts components.

### Data type → Chart type selection

| Data Type | Best Chart | Secondary | Volume Threshold | A11y Grade | Library Rec |
|-----------|-----------|-----------|------------------|------------|-------------|
| Single metric over time | Line | Area | Up to 10k points in single series | A (needs axis labels + legend) | Recharts |
| Part-to-whole (≤6 parts) | Donut | Stacked bar | 2-6 slices ideal | B (aria-label per slice) | Recharts |
| Part-to-whole (7+ parts) | Stacked bar | Treemap | prefer bar over pie for >6 | A (bar a11y-default) | Recharts |
| Distribution | Histogram | Violin (advanced) | Up to 1k bins | B (bins need labels) | Recharts + D3 |
| Comparison (categorical) | Horizontal bar | Grouped bar | ≤15 categories readable | A | Recharts |
| Comparison (2-3 series over time) | Multi-line | Area-stacked | ≤5 series, else soup | A-B | Recharts |
| Correlation | Scatter | Bubble | ≤500 points | B | Recharts |
| Flow/pipeline | Sankey | Funnel | ≤8 stages | C (pattern explanation) | react-flow or D3 |
| Hierarchy | Treemap | Sunburst | ≤4 depth levels | C (color alone insufficient) | D3 |
| Geographic | Choropleth | Symbol map | country-level or sub-division | B (table fallback) | react-simple-maps |
| Real-time streaming | Live line | Live area | update UI ≤10Hz, data ≤100Hz | B (aria-live on significant changes) | Recharts + SWR |

### Key rules (from PRO MAX Decision_Rules)

- **≤6 slices in a pie/donut.** Above 6, switch to horizontal bar — always.
- **Never 3D charts.** 3D distorts data perception. Flat only.
- **Sort bars.** Horizontal bars should sort by value (descending), never alphabetically, unless alphabetical carries meaning.
- **Time on X, value on Y.** For time series, always. No exceptions.
- **Color-safe palettes.** Use ColorBrewer palettes for multi-series. Avoid red+green for positive/negative (CVD fails) — use red+blue or red+teal.
- **Always provide data-table fallback.** Every chart must have `aria-describedby` or a visible data table for screen readers. Canvas-based charts need an off-screen table.

### Library recommendation (framework-aware)

| Framework | Primary | Alternative |
|-----------|---------|-------------|
| Next.js / React / Vite | Recharts | Tremor (dashboards), D3 (bespoke) |
| Astro | Recharts (in React islands) | Chart.js (plain JS) |
| Vue / Nuxt | Vue-ECharts | Chart.js |
| SvelteKit | Layercake | Chart.js |

Genorah builders default to Recharts for all React/Next/Vite projects. Only escalate to D3 when the visualization doesn't fit the Recharts component catalog.

---


Use this skill when the user mentions charts, graphs, data visualization, sparklines, donut chart, area chart, bar chart, line chart, analytics dashboard, or metrics display. Triggers on: chart, graph, visualization, sparkline, donut, area chart, bar chart, line chart, analytics, metrics, recharts.

You are an expert at building beautiful, accessible data visualizations with Recharts and shadcn/ui Chart components.

## shadcn/ui Chart Setup

```tsx
// shadcn charts use Recharts under the hood with ChartContainer for theming
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { type ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
  expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig
```

## Area Chart with Gradient Fill

```tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  // ...
]

<ChartContainer config={chartConfig} className="h-[300px] w-full">
  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <defs>
      <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
    <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
    <YAxis className="text-xs" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#fillRevenue)" strokeWidth={2} />
  </AreaChart>
</ChartContainer>
```

## Bar Chart

```tsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

<ChartContainer config={chartConfig} className="h-[300px] w-full">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
    <YAxis tickLine={false} axisLine={false} className="text-xs" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>
```

## Donut Chart with Center Label

```tsx
import { Pie, PieChart, Cell } from 'recharts'

const statusData = [
  { name: 'Active', value: 340, color: 'hsl(var(--chart-1))' },
  { name: 'Inactive', value: 120, color: 'hsl(var(--chart-2))' },
  { name: 'Pending', value: 45, color: 'hsl(var(--chart-3))' },
]

<div className="relative">
  <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
    <PieChart>
      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
        {statusData.map((entry, i) => (
          <Cell key={i} fill={entry.color} strokeWidth={0} />
        ))}
      </Pie>
      <ChartTooltip content={<ChartTooltipContent />} />
    </PieChart>
  </ChartContainer>
  {/* Center label */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-3xl font-bold">{statusData.reduce((a, b) => a + b.value, 0)}</span>
    <span className="text-xs text-muted-foreground">Total</span>
  </div>
</div>
```

## Stat Card with Sparkline

```tsx
import { Line, LineChart, ResponsiveContainer } from 'recharts'

function StatCardWithSparkline({ title, value, change, trend, sparkData }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className={cn("flex items-center text-xs mt-1",
              trend === 'up' ? "text-green-600" : "text-red-600"
            )}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </div>
          </div>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={trend === 'up' ? '#22c55e' : '#ef4444'}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Accessible Charts

```tsx
// Always provide a data table alternative
function AccessibleChart({ data, chartConfig }: ChartProps) {
  return (
    <div>
      {/* Visual chart */}
      <div role="img" aria-label="Revenue overview chart showing monthly trends">
        <ChartContainer config={chartConfig} className="h-[300px]">
          {/* ... chart components ... */}
        </ChartContainer>
      </div>

      {/* Hidden data table for screen readers */}
      <table className="sr-only">
        <caption>Revenue overview by month</caption>
        <thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th></tr></thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}><td>{row.month}</td><td>${row.revenue}</td><td>${row.expenses}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## Best Practices

1. **Use ChartContainer**: It handles theming, responsive sizing, and CSS variable colors
2. **Gradient fills on area charts**: Fade from color to transparent for depth
3. **Round bar corners**: `radius={[4, 4, 0, 0]}` makes bars feel polished
4. **Remove axis lines**: `tickLine={false} axisLine={false}` for cleaner look
5. **Color-blind safe**: Use the accessible palette from `accessibility-patterns` skill
6. **Responsive containers**: Always use `className="h-[300px] w-full"` on ChartContainer
7. **Accessible**: Add `role="img"` with `aria-label` and a hidden data table
8. **Donut center labels**: Use absolute positioning over the chart for center metrics
