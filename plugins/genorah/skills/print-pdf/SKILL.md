---
name: print-pdf
description: "Print and PDF patterns: print stylesheets, react-pdf generation, invoice/receipt layouts, resume templates, print-friendly tables, page breaks, PDF download buttons. Works with Next.js and Astro."
---

Use this skill when the user mentions print, PDF, invoice, receipt, resume, print stylesheet, page break, or PDF generation. Triggers on: print, PDF, invoice, receipt, resume, print style, page break, download PDF.

You are an expert at building print-optimized and PDF-generating UIs.

## Print Stylesheet

```css
/* globals.css or print.css */
@media print {
  /* Hide non-print elements */
  .no-print, nav, footer, .sidebar, button, .toast-container {
    display: none !important;
  }

  /* Reset backgrounds and colors for ink saving */
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt;
    line-height: 1.5;
  }

  /* Full width */
  .container, main {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Show URLs for links */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
  a[href^="#"]::after, a[href^="javascript"]::after {
    content: "";
  }

  /* Page breaks */
  h1, h2, h3 { page-break-after: avoid; }
  table, figure, img { page-break-inside: avoid; }
  .page-break { page-break-before: always; }

  /* Tables */
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  thead { display: table-header-group; } /* Repeat header on each page */
}
```

## Print Button Component

```tsx
function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()} className="no-print">
      <Printer className="h-4 w-4 mr-2" /> Print
    </Button>
  )
}
```

## Invoice Template

```tsx
function Invoice({ invoice }: { invoice: InvoiceData }) {
  return (
    <div className="max-w-3xl mx-auto p-8 print:p-0">
      <div className="no-print mb-4 flex justify-end gap-2">
        <PrintButton />
        <Button onClick={() => downloadPDF()}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
      </div>

      <div id="invoice-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-muted-foreground mt-1">#{invoice.number}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{invoice.company.name}</p>
            <p className="text-sm text-muted-foreground">{invoice.company.address}</p>
            <p className="text-sm text-muted-foreground">{invoice.company.email}</p>
          </div>
        </div>

        {/* Billing info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Bill To</p>
            <p className="font-medium">{invoice.client.name}</p>
            <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
          </div>
          <div className="text-right">
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Date:</span> {invoice.date}</p>
              <p><span className="text-muted-foreground">Due:</span> {invoice.dueDate}</p>
              <p><span className="text-muted-foreground">Status:</span>
                <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="ml-1 print:border print:border-black">
                  {invoice.status}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2 text-sm font-medium">Description</th>
              <th className="text-right py-2 text-sm font-medium">Qty</th>
              <th className="text-right py-2 text-sm font-medium">Rate</th>
              <th className="text-right py-2 text-sm font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="py-3 text-sm text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-right">${item.rate.toFixed(2)}</td>
                <td className="py-3 text-sm text-right">${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${invoice.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax ({invoice.taxRate}%)</span><span>${invoice.tax.toFixed(2)}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${invoice.total.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Notes</p>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

## PDF Generation with react-pdf

```tsx
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold' },
  table: { width: '100%', marginTop: 20 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingVertical: 8 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#000', paddingBottom: 8 },
  col: { flex: 1 },
  colRight: { flex: 1, textAlign: 'right' },
  total: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  totalLabel: { fontWeight: 'bold', fontSize: 14 },
})

function InvoicePDF({ invoice }: { invoice: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View><Text style={styles.title}>INVOICE</Text><Text>#{invoice.number}</Text></View>
          <View><Text style={{ fontWeight: 'bold' }}>{invoice.company.name}</Text></View>
        </View>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.col}>Description</Text>
            <Text style={styles.colRight}>Qty</Text>
            <Text style={styles.colRight}>Rate</Text>
            <Text style={styles.colRight}>Amount</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.col}>{item.description}</Text>
              <Text style={styles.colRight}>{item.quantity}</Text>
              <Text style={styles.colRight}>${item.rate.toFixed(2)}</Text>
              <Text style={styles.colRight}>${(item.quantity * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total: ${invoice.total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  )
}

// Download handler
async function downloadPDF(invoice: InvoiceData) {
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `invoice-${invoice.number}.pdf`; a.click()
  URL.revokeObjectURL(url)
}
```

## Best Practices

1. Use `@media print` for browser print, `@react-pdf/renderer` for PDF files
2. Hide UI controls with `.no-print` class in print stylesheet
3. `page-break-inside: avoid` on tables, images, cards
4. `thead { display: table-header-group }` repeats table headers on each page
5. Invoice: company info, billing info, line items table, totals, notes
6. Print button: `window.print()` is the simplest and most reliable approach
7. PDF download: generate blob with react-pdf, trigger download via anchor
8. For Astro: print CSS works the same, react-pdf requires React island
9. Use pt units in print stylesheets (12pt body, 24pt headings)
10. Test print preview in Chrome DevTools (Ctrl+Shift+P > "Show Rendering" > Emulate print media)
