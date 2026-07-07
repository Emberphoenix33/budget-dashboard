# 💰 Budget Dashboard

A modern web-based budgeting and bills dashboard that stores your data **locally in your browser**—no accounts or cloud setup required.

## Features

- **📊 Budget Tracking**: Set monthly budgets by category and track spending in real-time
- **📋 Bill Management**: Track recurring bills with due dates, payment status, and overdue alerts
- **📈 Visual Reports**: Interactive charts showing spending by category, monthly trends, and budget vs actual
- **📥 CSV Import**: Import transactions directly from your bank's CSV export
- **💾 Export/Backup**: Download your data as JSON for backup
- **🔒 Private**: All data stored locally in your browser—nothing sent to servers

## Tech stack

React + Vite, Recharts for visualizations, React Bootstrap for UI, `pdfjs-dist` for parsing PDF bank statements client-side. No backend — everything runs and persists in the browser via `localStorage`.

## Quick Start

### Installation

```bash
cd budget-dashboard
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

## Importing Your Bank Data

### Option 1: Direct CSV Import (Easiest)

1. **Download transactions from your bank** as CSV
2. **Click "📥 Import CSV"** in the dashboard navbar
3. **Select your CSV file**
4. Done! Your transactions are loaded

**Supported CSV formats:**
- Chase, Bank of America, Wells Fargo, Citibank, Capital One
- Any CSV with columns: Date, Description, Amount

### Option 2: PDF Statement → CSV

If your bank only provides PDF statements:

1. **Open `pdf-converter.html`** in your browser
2. **Select your bank** (Chase, BoA, Wells Fargo, etc.)
3. **Upload your PDF statement**
4. **Review extracted transactions** and adjust patterns if needed
5. **Download as CSV** or copy to clipboard
6. **Import** into the dashboard using "📥 Import CSV"

**Note:** PDF extraction works best with digital PDFs (not scanned images). If extraction isn't accurate, try adjusting the regex patterns or check if your bank offers CSV export.

### Option 3: Use the CSV Converter

For other file formats:

1. Open `csv-converter.html` in your browser
2. Select your bank format
3. Upload your file (if already in CSV format)
4. Download the converted file
5. Import it into the dashboard

## Data Storage

Your data is stored in **localStorage** in your browser:
- ✅ No accounts needed
- ✅ No cloud sync
- ✅ Completely private
- ✅ Works offline

**Important:** Data is stored per-browser. If you clear your browser cache, you'll lose your data. Use the **💾 Export** button to backup regularly!

## Project Structure

```
budget-dashboard/
├── src/
│   ├── components/
│   │   ├── BudgetTracking.jsx    # Budget management UI
│   │   ├── BillManagement.jsx    # Bills tracking UI
│   │   └── VisualReports.jsx     # Charts and analytics
│   ├── App.jsx                   # Main dashboard with import/export
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Custom styles
├── csv-converter.html            # Standalone CSV converter tool
├── index.html
├── package.json
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## CSV Format

If you want to create CSVs manually, use this format:

```csv
Date,Category,Amount,Description
2026-03-01,Groceries,125.50,Weekly shopping
2026-03-05,Entertainment,45.00,Movie tickets
2026-03-10,Transportation,60.00,Gas
```

**Columns:**
- `Date` - YYYY-MM-DD format
- `Category` - Groceries, Entertainment, Transportation, Utilities, etc.
- `Amount` - Positive numbers
- `Description` - Optional notes

## Tips

1. **Backup your data:** Click "💾 Export" regularly to download a backup
2. **Import monthly:** Download your bank statement CSV at month-end and import
3. **Categorize as you go:** The auto-categorizer works well, but you can edit categories in the CSV before importing

## Troubleshooting

**Q: My CSV didn't import correctly**
- Make sure it has at least Date and Amount columns
- Check that amounts are numbers (not "$123.45" format)
- Try the csv-converter.html tool first

**Q: I lost my data after clearing browser cache**
- Use the Export feature to backup before clearing cache
- Import your backup JSON file to restore

**Q: Can I access my data from multiple devices?**
- Not currently. Data is stored per-browser
- Export from one device, import on another

## Future Enhancements

- [ ] Auto-categorization improvements
- [ ] Recurring transaction detection
- [ ] Budget rollover (unused budget carries to next month)
- [ ] Multiple budget periods (weekly, bi-weekly, monthly)
- [ ] Dark mode
- [ ] Mobile app

## Security Notes

⚠️ **Remember:**
- Your data is stored in browser localStorage
- Clearing browser data will delete everything
- Always export before switching browsers or devices
- Bank CSV files contain sensitive data—only import on trusted devices

## License

ISC
