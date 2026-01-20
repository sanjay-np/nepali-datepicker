# @munatech/nepali-datepicker

A modern, accessible Nepali (Bikram Sambat) date picker component for React 19 with Tailwind CSS v4 styling.

## ✨ Features

- 🗓️ **Bikram Sambat Calendar** — Full support for Nepali calendar (2000-2100 BS)
- 🔄 **BS ↔ AD Conversion** — Accurate date conversion between Bikram Sambat and Gregorian calendars
- 🌐 **Bilingual Support** — Full support for English and Nepali (नेपाली) languages
- 🔢 **Nepali Numerals** — Display dates using Nepali numerals (०१२३४५६७८९)
- ⚛️ **React 19** — Built with the latest React features and hooks
- 🎨 **Tailwind v4** — Modern CSS-first theming with design tokens
- 📱 **Accessible** — Full keyboard navigation and screen reader support
- 🧩 **Composable** — Use the full DatePicker or standalone Calendar component
- 📅 **Date Constraints** — Support for min/max date ranges
- 🎯 **Flexible Navigation** — Button or dropdown-based month/year navigation

## 📦 Tech Stack

- **React 19** — Latest React with modern hooks (`useState`, `useMemo`, `useCallback`)
- **TypeScript** — Full type safety with exported types
- **Tailwind CSS v4** — CSS-first configuration with `@tailwindcss/vite`
- **Vite 7** — Fast development and optimized builds

## 🚀 Quick Start

### Installation

```bash
npm install @munatech/nepali-datepicker
```

### Basic Usage

```tsx
import { useState } from 'react'
import { NepaliDatePicker } from '@munatech/nepali-datepicker'
import type { NepaliDate } from '@munatech/nepali-datepicker'
import '@munatech/nepali-datepicker/styles.css'

function App() {
  const [date, setDate] = useState<NepaliDate | undefined>()

  return (
    <NepaliDatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
    />
  )
}
```

## 📚 Components

### NepaliDatePicker

The main date picker component with a popover calendar.

```tsx
import { NepaliDatePicker } from '@munatech/nepali-datepicker'

<NepaliDatePicker
  value={date}
  onChange={setDate}
  language="ne"                        // 'en' | 'ne'
  dateFormat="YYYY-MM-DD"              // Display format
  placeholder="मिति छान्नुहोस्"
  minDate={{ year: 2080, month: 1, day: 1 }}
  maxDate={{ year: 2085, month: 12, day: 30 }}
  captionLayout="dropdown"             // 'buttons' | 'dropdown'
  closeOnSelect={true}                 // Close popover after selection
  disabled={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `NepaliDate \| undefined` | — | Selected date |
| `onChange` | `(date: NepaliDate \| undefined) => void` | — | Callback when date changes |
| `language` | `'en' \| 'ne'` | `'en'` | Display language |
| `dateFormat` | `string` | `'YYYY-MM-DD'` | Date format for display |
| `placeholder` | `string` | `'Pick a date'` | Placeholder text |
| `minDate` | `NepaliDate` | — | Minimum selectable date |
| `maxDate` | `NepaliDate` | — | Maximum selectable date |
| `captionLayout` | `'buttons' \| 'dropdown'` | `'buttons'` | Month/year navigation style |
| `closeOnSelect` | `boolean` | `true` | Close popover after selecting |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | `''` | Additional CSS classes for trigger button |

### Calendar

Standalone calendar component without the popover — perfect for inline date selection.

```tsx
import { Calendar } from '@munatech/nepali-datepicker'

<Calendar
  selected={date}
  onSelect={setDate}
  language="en"
  minDate={minDate}
  maxDate={maxDate}
  captionLayout="buttons"
  className="rounded-lg border shadow-sm"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `NepaliDate` | — | Currently selected date |
| `onSelect` | `(date: NepaliDate) => void` | — | Callback when a date is selected |
| `language` | `'en' \| 'ne'` | `'en'` | Display language |
| `minDate` | `NepaliDate` | — | Minimum selectable date |
| `maxDate` | `NepaliDate` | — | Maximum selectable date |
| `defaultMonth` | `NepaliDate` | — | Initial month to display |
| `captionLayout` | `'buttons' \| 'dropdown'` | `'buttons'` | Navigation style |
| `className` | `string` | `''` | Additional CSS classes |

### NepaliDatePickerWithToday

A variant of NepaliDatePicker that includes a "Today" button for quick selection.

```tsx
import { NepaliDatePickerWithToday } from '@munatech/nepali-datepicker'

<NepaliDatePickerWithToday
  value={date}
  onChange={setDate}
  language="en"
/>
```

## 🔧 Date Utilities

### Convert BS to AD

```tsx
import { bsToAd, bsToAdString } from '@munatech/nepali-datepicker'

const adDate = bsToAd(2082, 10, 6)
// Returns: { year: 2026, month: 1, day: 20 }

const adDateString = bsToAdString(2082, 10, 6)
// Returns: "2026-01-20"
```

### Convert AD to BS

```tsx
import { adToBs, adToBsString } from '@munatech/nepali-datepicker'

const bsDate = adToBs(2026, 1, 19)
// Returns: { year: 2082, month: 10, day: 5 }

const bsDateString = adToBsString(2026, 1, 19)
// Returns: "2082-10-05"
```

### Get Today's Date in BS

```tsx
import { getTodayBs, getTodayBsString } from '@munatech/nepali-datepicker'

const today = getTodayBs()
// Returns current date in BS format

const todayString = getTodayBsString()
// Returns current date formatted (e.g., "2082-10-06")
```

### Get Days in a BS Month

```tsx
import { getDaysInBsMonth } from '@munatech/nepali-datepicker'

const days = getDaysInBsMonth(2082, 10)
// Returns: 30 (days in Magh 2082)
```

### Date Validation

```tsx
import { isValidBsDate } from '@munatech/nepali-datepicker'

isValidBsDate(2082, 10, 15) // true
isValidBsDate(2082, 13, 1)  // false - invalid month
```

### Date Comparison

```tsx
import { compareBsDates, isBsDateInRange } from '@munatech/nepali-datepicker'

const date1 = { year: 2082, month: 10, day: 5 }
const date2 = { year: 2082, month: 10, day: 15 }

compareBsDates(date1, date2) // Returns -1 (date1 < date2)
compareBsDates(date2, date1) // Returns 1 (date2 > date1)
compareBsDates(date1, date1) // Returns 0 (equal)

// Check if date is within a range
isBsDateInRange(date1, minDate, maxDate) // true or false
```

### Get First Day of Month

```tsx
import { getFirstDayOfBsMonth } from '@munatech/nepali-datepicker'

const dayOfWeek = getFirstDayOfBsMonth(2082, 10)
// Returns 0-6 (0 = Sunday, 6 = Saturday)
```

## 📝 Date Formatting

### Format Dates

```tsx
import { formatBsDate, getBsDateString, formatAdDate } from '@munatech/nepali-datepicker'

const date = { year: 2082, month: 10, day: 15 }

formatBsDate(date, 'YYYY-MM-DD', 'en')
// "2082-10-15"

formatBsDate(date, 'MMMM D, YYYY', 'en')
// "Magh 15, 2082"

formatBsDate(date, 'MMMM D, YYYY', 'ne')
// "माघ १५, २०८२"

// Utility for BS date objects
getBsDateString(date, 'YYYY-MM-DD')
// "2082-10-15"

// Formatting English (AD) dates
formatAdDate({ year: 2026, month: 1, day: 20 }, 'MMMM D, YYYY')
// "January 20, 2026"
```

### Parse Dates

```tsx
import { parseBsDate } from '@munatech/nepali-datepicker'

const date = parseBsDate('2082-10-15')
// Returns: { year: 2082, month: 10, day: 15 }
```

### Convert to Nepali Numerals

```tsx
import { toNepaliNumeral } from '@munatech/nepali-datepicker'

toNepaliNumeral(2082)
// Returns: "२०८२"
```

### Get Month/Day Names

```tsx
import { getMonthName, getDayName, getMonthNames, getDayNames } from '@munatech/nepali-datepicker'

getMonthName(10, 'en')  // "Magh"
getMonthName(10, 'ne')  // "माघ"

getDayName(0, 'en')     // "Sun"
getDayName(0, 'ne')     // "आइत"

getMonthNames('en')     // ["Baisakh", "Jestha", ...]
getDayNames('ne')       // ["आइत", "सोम", ...]
```

### Format Tokens

| Token | Output (EN) | Output (NE) | Description |
|-------|-------------|-------------|-------------|
| `YYYY` | 2082 | २०८२ | Full year |
| `YY` | 82 | ८२ | Two-digit year |
| `MMMM` | Magh | माघ | Full month name |
| `MMM` | Mag | माघ | Short month name |
| `MM` | 10 | १० | Two-digit month |
| `M` | 10 | १० | Month number |
| `DD` | 15 | १५ | Two-digit day |
| `D` | 15 | १५ | Day number |

## 📅 Nepali Calendar Reference

### Month Names

| Month | English | Nepali |
|-------|---------|--------|
| 1 | Baisakh | बैशाख |
| 2 | Jestha | जेठ |
| 3 | Ashar | असार |
| 4 | Shrawan | श्रावण |
| 5 | Bhadra | भाद्र |
| 6 | Ashwin | आश्विन |
| 7 | Kartik | कार्तिक |
| 8 | Mangsir | मंसिर |
| 9 | Poush | पौष |
| 10 | Magh | माघ |
| 11 | Falgun | फाल्गुण |
| 12 | Chaitra | चैत्र |

### Day Names

| Day | English | Nepali (Short) | Nepali (Full) |
|-----|---------|----------------|---------------|
| 0 | Sunday | आइत | आइतबार |
| 1 | Monday | सोम | सोमबार |
| 2 | Tuesday | मंगल | मंगलबार |
| 3 | Wednesday | बुध | बुधबार |
| 4 | Thursday | बिहि | बिहिबार |
| 5 | Friday | शुक्र | शुक्रबार |
| 6 | Saturday | शनि | शनिबार |

## 🎨 Customization

### Theming with Tailwind v4

The components use CSS custom properties for theming. Override them in your CSS:

```css
@theme {
  --color-primary-500: oklch(0.50 0.15 250);
  --color-primary-600: oklch(0.40 0.12 250);
  --color-primary-700: oklch(0.32 0.10 250);
  --color-border: oklch(0.88 0.005 250);
  --color-muted: oklch(0.97 0.002 250);
  --color-muted-foreground: oklch(0.55 0.01 250);
}
```

### Custom Styling

Pass `className` to customize component appearance:

```tsx
<Calendar
  className="rounded-xl border-2 border-gray-300 shadow-lg"
/>

<NepaliDatePicker
  className="w-full max-w-sm"
/>
```

## 📝 TypeScript

All components and utilities are fully typed:

```tsx
import type { 
  NepaliDate, 
  EnglishDate, 
  Language,
} from '@munatech/nepali-datepicker'

// Component prop types
import type {
  NepaliDatePickerProps,
  CalendarProps,
} from '@munatech/nepali-datepicker'
```

### Type Definitions

```tsx
interface NepaliDate {
  year: number   // BS year (2000-2100)
  month: number  // 1-12
  day: number    // 1-32 (varies by month)
}

interface EnglishDate {
  year: number   // AD year
  month: number  // 1-12
  day: number    // 1-31
}

type Language = 'en' | 'ne'
```

## 🌐 Browser Support

- Chrome 111+
- Firefox 128+
- Safari 16.4+
- Edge 111+

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview

# Run type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
nepali-datepicker/
├── src/
│   ├── lib/                          # Core library
│   │   ├── nepali-date-data.ts       # Calendar data (2000-2100 BS)
│   │   ├── date-converter.ts         # BS↔AD conversion utilities
│   │   ├── date-formatter.ts         # Date formatting & Nepali numerals
│   │   └── index.ts                  # Library exports
│   ├── components/
│   │   ├── NepaliDatePicker/
│   │   │   ├── Calendar.tsx          # Calendar grid component
│   │   │   └── index.tsx             # DatePicker with popover
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Styled button component
│   │   │   ├── Popover.tsx           # Dropdown popover component
│   │   │   └── index.ts              # UI component exports
│   │   └── index.ts                  # Component exports
│   ├── App.tsx                       # Demo application
│   ├── App.css                       # Demo styles
│   ├── index.css                     # Global styles & Tailwind
│   ├── index.ts                      # Package exports
│   └── main.tsx                      # App entry point
├── public/                           # Static assets
├── index.html                        # HTML template
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
└── README.md                         # This file
```

## 📊 Exported Data

The package also exports calendar data constants for advanced use cases:

```tsx
import {
  NEPALI_MONTHS,      // { en: [...], ne: [...] }
  NEPALI_DAYS,        // Short day names
  NEPALI_DAYS_FULL,   // Full day names
  NEPALI_NUMERALS,    // ['०', '१', '२', ...]
  BS_MIN_YEAR,        // 2000
  BS_MAX_YEAR,        // 2100
} from '@munatech/nepali-datepicker'
```

## 📄 License

MIT © 2026

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Credits

- Bikram Sambat calendar data sourced from official Nepali calendar calculations
- UI design inspired by [shadcn/ui](https://ui.shadcn.com) patterns
- Built with [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), and [Vite](https://vite.dev)
