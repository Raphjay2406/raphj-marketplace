# Chart Types Data Catalog

> 25 chart type recommendations for data visualization in web applications.
> Each entry maps to DNA color tokens and includes accessibility guidance.

---

## Chart: Line Chart
- **Best For:** Time-series trends, continuous data, performance over time
- **Secondary Options:** Area chart (filled), sparkline (compact)
- **Performance:** Excellent (< 1000 points), Good (< 10000 points)
- **Accessibility:** Good -- use distinct stroke patterns (solid, dashed, dotted) alongside color
- **Libraries:** Recharts (React), Chart.js, D3, Nivo, Tremor
- **DNA Integration:** Use `primary` for main line, `secondary` for comparison, `accent` for highlight, `muted` for grid lines
- **Colorblind Safe:** Yes with dash patterns and point markers as secondary encoding
- **When to Avoid:** Categorical data with no time axis, fewer than 3 data points, more than 7 overlapping lines
- **Responsive Notes:** Reduce data density on mobile, hide legend below chart, enable horizontal scroll for long series

## Chart: Bar Chart (Vertical)
- **Best For:** Categorical comparison, discrete quantities, rankings
- **Secondary Options:** Horizontal bar (long labels), grouped bar (multi-series), stacked bar (composition)
- **Performance:** Excellent (< 100 bars), Good (< 500 bars)
- **Accessibility:** Good -- distinct patterns (stripes, dots, crosshatch) per series, aria-labels per bar
- **Libraries:** Recharts, Chart.js, D3, Nivo, Tremor
- **DNA Integration:** Use `primary` for main bars, sequential lightness variants for series, `border` for bar outlines
- **Colorblind Safe:** Yes with pattern fills as secondary encoding
- **When to Avoid:** Time-series data (use line), continuous data, more than 20 categories (use horizontal bar)
- **Responsive Notes:** Switch to horizontal bars on mobile for label readability, reduce bar count or paginate

## Chart: Horizontal Bar Chart
- **Best For:** Long category labels, survey results, ranked lists, progress comparison
- **Secondary Options:** Bullet chart (with target), Gantt-style (timelines)
- **Performance:** Excellent
- **Accessibility:** Good -- natural reading order (top-to-bottom), easy to label
- **Libraries:** Recharts, Chart.js, D3, Nivo
- **DNA Integration:** Use `primary` for bars, `surface` for track background, `text` for labels
- **Colorblind Safe:** Yes with value labels
- **When to Avoid:** Few categories with short labels (vertical is more compact), time-series data
- **Responsive Notes:** Naturally mobile-friendly; truncate long labels with ellipsis and tooltip

## Chart: Stacked Bar Chart
- **Best For:** Part-to-whole over categories, composition comparison across groups
- **Secondary Options:** 100% stacked bar (normalized), grouped bar (if overlap confusing)
- **Performance:** Excellent
- **Accessibility:** Moderate -- many segments can be hard to distinguish; limit to 5 segments
- **Libraries:** Recharts, Chart.js, D3, Nivo
- **DNA Integration:** Use sequential palette from `primary` through `secondary` to `accent` for segments
- **Colorblind Safe:** Add pattern fills; limit segments to 4-5
- **When to Avoid:** More than 5 segments, when exact comparison between segments is critical
- **Responsive Notes:** Consider switching to grouped bar on mobile; stack direction works well vertically

## Chart: Area Chart
- **Best For:** Volume over time, cumulative totals, trend with magnitude
- **Secondary Options:** Stacked area (composition over time), stream graph (organic flow)
- **Performance:** Good
- **Accessibility:** Moderate -- overlapping areas need transparency and distinct borders
- **Libraries:** Recharts, Chart.js, D3, Nivo, Tremor
- **DNA Integration:** Use `primary` at 20% opacity for fill, full `primary` for stroke, `bg` for base
- **Colorblind Safe:** Use distinct line patterns with semi-transparent fills
- **When to Avoid:** Discrete categories without time dimension, negative values, more than 4 overlapping series
- **Responsive Notes:** Reduce to key series on mobile, show legend below, simplify axis labels

## Chart: Pie Chart
- **Best For:** Simple part-to-whole (2-5 segments), percentage breakdown
- **Secondary Options:** Donut (modern look), waffle (better perception)
- **Performance:** Excellent
- **Accessibility:** Poor -- hard to compare similar slices; always add value labels
- **Libraries:** Recharts, Chart.js, D3, Nivo
- **DNA Integration:** Use `primary`, `secondary`, `accent` for top 3 segments, `muted` for remainder
- **Colorblind Safe:** No without patterns; add direct labels with values
- **When to Avoid:** More than 5 segments, comparing values across multiple pies, showing change over time
- **Responsive Notes:** Works at small sizes; increase label font size on mobile, consider donut alternative

## Chart: Donut Chart
- **Best For:** KPI with central metric, part-to-whole with hero number
- **Secondary Options:** Semi-circle donut, nested donut (hierarchical)
- **Performance:** Excellent
- **Accessibility:** Moderate -- center label improves context; same issues as pie
- **Libraries:** Recharts, Chart.js, D3, Nivo, Tremor
- **DNA Integration:** Center text uses `text` token, ring segments follow palette order, `surface` for empty ring
- **Colorblind Safe:** Add center label + value annotations per segment
- **When to Avoid:** More than 6 segments, when precise comparison is needed, multiple donuts side-by-side
- **Responsive Notes:** Scales well; center metric should use responsive font size, legend below on mobile

## Chart: Scatter Plot
- **Best For:** Correlation between two variables, outlier detection, clustering
- **Secondary Options:** Bubble chart (3rd variable as size), connected scatter (trajectory)
- **Performance:** Good (< 5000 points), Moderate (< 50000 with WebGL)
- **Accessibility:** Moderate -- provide data table alternative; use size + shape for categories
- **Libraries:** D3, Chart.js, Recharts, Plotly
- **DNA Integration:** Use `primary` for main series, `accent` for highlighted points, `glow` for selection state
- **Colorblind Safe:** Use shape encoding (circle, square, triangle) alongside color
- **When to Avoid:** Fewer than 10 data points, no meaningful correlation expected, categorical-only data
- **Responsive Notes:** Reduce point count on mobile, increase touch target size, use pinch-to-zoom for dense plots

## Chart: Bubble Chart
- **Best For:** Three-dimensional data comparison, relative sizing, market maps
- **Secondary Options:** Packed circle (hierarchical), scatter with annotations
- **Performance:** Moderate (< 500 bubbles)
- **Accessibility:** Poor -- size comparison is imprecise; add tooltips with exact values
- **Libraries:** D3, Chart.js, Plotly, Nivo
- **DNA Integration:** Bubble fill at 60% opacity of `primary`/`secondary`, stroke at full opacity
- **Colorblind Safe:** Use shape borders + size as primary encoding
- **When to Avoid:** Fewer than 5 data points (use bar), when exact values matter more than relative size
- **Responsive Notes:** Limit to top 10-15 bubbles on mobile, ensure tooltips work with touch

## Chart: Heatmap
- **Best For:** Density/intensity across two dimensions, correlation matrices, time patterns
- **Secondary Options:** Calendar heatmap (daily patterns), geographic heatmap
- **Performance:** Good (< 10000 cells)
- **Accessibility:** Poor -- color-only encoding; add value labels or provide table alternative
- **Libraries:** D3, Nivo, Recharts (limited), Plotly
- **DNA Integration:** Sequential scale from `bg` (low) through `primary` (mid) to `tension` (high)
- **Colorblind Safe:** No -- use sequential single-hue scale (light-to-dark) or add value labels
- **When to Avoid:** Sparse data with few cells, when exact values matter more than patterns
- **Responsive Notes:** Enable horizontal scroll or reduce dimensions on mobile; larger cells with values inside

## Chart: Funnel Chart
- **Best For:** Conversion pipeline, sales stages, user journey drop-off
- **Secondary Options:** Horizontal funnel, inverted pyramid
- **Performance:** Excellent
- **Accessibility:** Good -- sequential stages are intuitive; label each stage with count + percentage
- **Libraries:** Recharts (limited), D3, custom SVG, Plotly
- **DNA Integration:** Top stage uses `primary`, graduating to `muted` at bottom; `accent` for highlighted stage
- **Colorblind Safe:** Yes with sequential lightness scale + labels
- **When to Avoid:** Non-sequential data, more than 8 stages, when drop-off is not the primary story
- **Responsive Notes:** Stack stages vertically on mobile with percentage labels; horizontal funnel works well

## Chart: Gauge / Dial
- **Best For:** Single KPI against target, progress meters, health scores
- **Secondary Options:** Bullet chart (compact), progress bar (linear)
- **Performance:** Excellent
- **Accessibility:** Moderate -- provide numeric value alongside visual; use aria-valuenow
- **Libraries:** Custom SVG, D3, Recharts (custom), Tremor (progress)
- **DNA Integration:** Track uses `surface`, fill uses `primary` (normal), `accent` (warning), `tension` (critical)
- **Colorblind Safe:** Yes with numeric display; semantic colors need icon pairing
- **When to Avoid:** Multiple KPIs (use bullet chart row), when historical trend matters (use sparkline)
- **Responsive Notes:** Semi-circle gauge saves vertical space; ensure numeric value is prominent on mobile

## Chart: Candlestick / OHLC
- **Best For:** Financial price data (Open/High/Low/Close), stock charts, trading
- **Secondary Options:** Line chart (simplified), volume overlay
- **Performance:** Good (< 500 candles), Moderate with zoom
- **Accessibility:** Poor -- dense and color-dependent; provide data table
- **Libraries:** Lightweight Charts (TradingView), D3, Plotly, ECharts
- **DNA Integration:** Up candle: `primary` or green variant, Down candle: `tension`, Wicks: `border`
- **Colorblind Safe:** No -- use filled vs hollow candles as secondary encoding
- **When to Avoid:** Non-financial data, general audiences unfamiliar with OHLC, fewer than 20 data points
- **Responsive Notes:** Enable pinch-to-zoom and pan; show simplified line chart on small screens

## Chart: Treemap
- **Best For:** Hierarchical proportions, disk usage, budget allocation, portfolio composition
- **Secondary Options:** Sunburst (radial hierarchy), icicle chart (linear hierarchy)
- **Performance:** Good (< 1000 nodes)
- **Accessibility:** Poor -- nested rectangles are hard to navigate; provide collapsible tree alternative
- **Libraries:** D3, Recharts, Nivo, ECharts
- **DNA Integration:** Top-level categories use `primary`/`secondary`/`accent`, children use lightness variants
- **Colorblind Safe:** Add labels inside each rectangle; use lightness to distinguish levels
- **When to Avoid:** Flat data (no hierarchy), fewer than 5 items, when exact comparison matters
- **Responsive Notes:** Limit depth to 2 levels on mobile; provide drill-down interaction instead of showing all levels

## Chart: Sankey Diagram
- **Best For:** Flow quantities between nodes, budget allocation, user journey, energy flow
- **Secondary Options:** Alluvial diagram, chord diagram (circular)
- **Performance:** Moderate (< 100 nodes, < 500 links)
- **Accessibility:** Poor -- complex flows are hard to describe; provide summary table
- **Libraries:** D3, Plotly, ECharts, Google Charts
- **DNA Integration:** Nodes use distinct DNA colors, flows inherit source node color at 30% opacity
- **Colorblind Safe:** Label all flows; limit to 6-7 categories
- **When to Avoid:** Simple two-node flows (use bar), more than 15 nodes (becomes spaghetti)
- **Responsive Notes:** Not mobile-friendly; provide summary table on small screens or simplified top-5 flows

## Chart: Waterfall Chart
- **Best For:** Cumulative effect of sequential values, financial statements, profit/loss breakdown
- **Secondary Options:** Stacked bar (if subtotals unneeded), bridge chart
- **Performance:** Excellent
- **Accessibility:** Good -- sequential reading order; label increase/decrease/total
- **Libraries:** Recharts (custom), D3, Chart.js (plugin), Plotly
- **DNA Integration:** Increase bars: `primary`, Decrease bars: `tension`, Total bars: `secondary`, Connector lines: `border`
- **Colorblind Safe:** Use up/down icons alongside color; label each bar with signed value
- **When to Avoid:** Non-sequential accumulation, fewer than 4 steps, when total is not meaningful
- **Responsive Notes:** Rotate labels 45 degrees on mobile, reduce bar width, scroll horizontally if many steps

## Chart: Radar / Spider Chart
- **Best For:** Multi-variable comparison (3-8 axes), skill profiles, product comparison
- **Secondary Options:** Parallel coordinates (many variables), small multiples bar
- **Performance:** Excellent
- **Accessibility:** Poor -- radial layout is hard to read; provide table alternative with bar sparklines
- **Libraries:** Recharts, Chart.js, D3, Nivo
- **DNA Integration:** Fill area at 20% `primary` opacity, stroke at full `primary`, grid lines use `border`
- **Colorblind Safe:** Limit to 2-3 overlapping series; use fill patterns
- **When to Avoid:** More than 8 axes (becomes unreadable), single-variable data, precise value comparison
- **Responsive Notes:** Reduce to key axes on mobile; consider horizontal bar alternative for small screens

## Chart: Bullet Chart
- **Best For:** KPI vs target in compact space, dashboard cards, performance metrics
- **Secondary Options:** Gauge (if single KPI), progress bar (simpler)
- **Performance:** Excellent
- **Accessibility:** Good -- linear and labeled; include current value, target, and range labels
- **Libraries:** D3, custom SVG, Recharts (custom), Plotly
- **DNA Integration:** Range bands: `surface` to `muted` gradient, Actual bar: `primary`, Target marker: `tension`
- **Colorblind Safe:** Yes with numeric labels and distinct marker shapes
- **When to Avoid:** When gauge or sparkline suffices, non-KPI data, when target is not defined
- **Responsive Notes:** Naturally compact; works well in mobile dashboard cards, stack multiple bullets vertically

## Chart: Waffle Chart
- **Best For:** Proportional data (better than pie), percentage visualization, survey results
- **Secondary Options:** Pie/donut (traditional), icon array (pictographic)
- **Performance:** Excellent (100-cell grid standard)
- **Accessibility:** Good -- countable units; announce "X out of 100 squares filled"
- **Libraries:** D3, custom SVG/CSS Grid, Nivo
- **DNA Integration:** Filled cells use `primary`, empty cells use `surface`, highlighted use `accent`
- **Colorblind Safe:** Yes with pattern fills per category
- **When to Avoid:** Large datasets (use bar or treemap), when grid squares become too small to read
- **Responsive Notes:** 10x10 grid works well on mobile; reduce to 5x10 for very small viewports

## Chart: Sparkline
- **Best For:** Inline trend indicator, table cells, dashboard cards, compact KPIs
- **Secondary Options:** Micro bar chart, inline bullet
- **Performance:** Excellent
- **Accessibility:** Moderate -- provide alt text with trend direction and range
- **Libraries:** Recharts, Tremor, custom SVG, Chart.js (minimal config)
- **DNA Integration:** Line uses `primary`, fill uses `primary` at 10% opacity, end-dot uses `accent`
- **Colorblind Safe:** Yes -- typically single-series, no color differentiation needed
- **When to Avoid:** When exact values matter, standalone chart (needs context), multiple sparklines needing comparison
- **Responsive Notes:** Inherently mobile-friendly due to compact size; ensure min-width of 80px

## Chart: Sunburst Chart
- **Best For:** Multi-level hierarchical data, drill-down navigation, category trees
- **Secondary Options:** Treemap (rectangular), icicle (linear), collapsible tree
- **Performance:** Moderate (< 500 nodes)
- **Accessibility:** Poor -- radial hierarchy is difficult; provide breadcrumb trail and data table
- **Libraries:** D3, Plotly, ECharts, Nivo
- **DNA Integration:** Center ring: `primary`, outer rings: sequential lightness variants, selected: `accent`
- **Colorblind Safe:** Use concentric ring patterns; limit categories per level to 6
- **When to Avoid:** Flat data (use pie/donut), more than 3 hierarchy levels, non-technical audiences
- **Responsive Notes:** Not ideal for mobile; provide treemap or collapsible list alternative on small screens

## Chart: Box Plot / Violin
- **Best For:** Statistical distribution, outlier identification, group comparison
- **Secondary Options:** Histogram (single distribution), strip plot (raw data)
- **Performance:** Good
- **Accessibility:** Moderate -- label quartile values, median, and outlier count explicitly
- **Libraries:** D3, Plotly, ECharts, Observable Plot
- **DNA Integration:** Box fill: `primary` at 40%, median line: `accent`, whiskers: `border`, outliers: `tension`
- **Colorblind Safe:** Yes with labeled quartile values
- **When to Avoid:** Non-statistical audiences, fewer than 3 groups, when median alone suffices
- **Responsive Notes:** Simplify to box-only (no violin) on mobile; show key statistics as text alongside

## Chart: Chord Diagram
- **Best For:** Bidirectional flow between entities, inter-relationships, migration patterns
- **Secondary Options:** Sankey (directional), network graph (connection-focused)
- **Performance:** Moderate (< 20 entities)
- **Accessibility:** Poor -- circular layout is complex; provide matrix table alternative
- **Libraries:** D3, Plotly, ECharts
- **DNA Integration:** Each entity gets a distinct DNA token color, chords blend source/target at 30% opacity
- **Colorblind Safe:** Limit to 8 entities; use hover isolation + labels
- **When to Avoid:** Unidirectional flow (use Sankey), more than 12 entities, non-specialist audiences
- **Responsive Notes:** Not mobile-friendly; provide matrix table on small screens

## Chart: Network / Force Graph
- **Best For:** Relationships between entities, social graphs, dependency trees
- **Secondary Options:** Tree layout (hierarchical), adjacency matrix (dense)
- **Performance:** Moderate (< 200 nodes), Heavy (> 500 -- use WebGL)
- **Accessibility:** Poor -- provide adjacency list or searchable table
- **Libraries:** D3 (force simulation), Sigma.js, Cytoscape.js, vis.js
- **DNA Integration:** Default nodes: `primary`, selected: `accent`, edges: `border`, highlighted path: `glow`
- **Colorblind Safe:** Use node shapes (circle, square, diamond) for categories; size for importance
- **When to Avoid:** Hierarchical data (use tree), fewer than 10 nodes, strict layout requirements
- **Responsive Notes:** Not suited for mobile; provide searchable list view, or limit to ego-network (single node + neighbors)

## Chart: Calendar Heatmap
- **Best For:** Daily patterns over months/year, contribution graphs, activity tracking
- **Secondary Options:** Standard heatmap, time-series line chart
- **Performance:** Excellent (365 cells/year)
- **Accessibility:** Moderate -- announce date and value on focus; provide monthly summary
- **Libraries:** D3, Cal-Heatmap, custom CSS Grid, Nivo
- **DNA Integration:** Sequential scale: `bg` (none) -> `primary` at 25/50/75/100% intensity, `border` for cell outlines
- **Colorblind Safe:** Use single-hue sequential scale (light to dark); add tooltip values
- **When to Avoid:** Non-date data (use standard heatmap), fewer than 30 days, real-time data
- **Responsive Notes:** Show 3-month chunks on mobile with horizontal scroll; simplify to monthly summary bars
