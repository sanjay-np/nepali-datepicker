# @munatech/nepali-datepicker 🇳🇵

A modern, lightweight, and highly customizable React component library for selecting **Nepali (Bikram Sambat)** dates. Built for **React 19** with **Tailwind CSS v4** and full **TypeScript** support.

[![NPM Version](https://img.shields.io/npm/v/@munatech/nepali-datepicker?style=flat-square)](https://www.npmjs.com/package/@munatech/nepali-datepicker)
[![Build Status](https://img.shields.io/github/actions/workflow/status/munatech/nepali-datepicker/release.yml?style=flat-square)](https://github.com/munatech/nepali-datepicker/actions)
[![License](https://img.shields.io/npm/l/@munatech/nepali-datepicker?style=flat-square)](https://github.com/munatech/nepali-datepicker/blob/main/LICENSE)

## ✨ Features

- 🗓️ **Complete BS Calendar** — Full support for Bikram Sambat (2000-2100 BS).
- 🔄 **Bidirectional Conversion** — Seamlessly convert between BS and AD (Gregorian).
- 🌐 **Fully Bilingual** — Switch between English and Nepali (माघ / Magh) with one prop.
- 🔢 **Native Numerals** — Toggle between standard (1, 2, 3) and Nepali (१, २, ३) numerals.
- ⚛️ **Modern Architecture** — Optimized for React 19 and Vite 7.
- 🎨 **Tailwind CSS v4** — Built-in design system with namespaced tokens to avoid conflicts.
- 📋 **Form Ready** — Native `<input type="hidden">` support for standard forms and **React Hook Form**.
- 📱 **Responsive & Accessible** — Mobile-friendly touch support and keyboard navigation.

---

## 🚀 Quick Start

### 1. Install

```bash
npm install @munatech/nepali-datepicker
```

### 2. Import Styles

Add this to your `main.tsx` or `App.tsx`:

```tsx
import '@munatech/nepali-datepicker/dist/style.css'
```

### 3. Basic Usage

```tsx
import { useState } from 'react'
import { Picker } from '@munatech/nepali-datepicker'

function MyComponent() {
  const [date, setDate] = useState()

  return (
    <Picker 
      value={date} 
      onChange={setDate} 
      placeholder="Pick a Nepali Date" 
    />
  )
}
```

---

## 🛠️ Components

### `Picker` (Standard Date Picker)
The primary selection component featuring a trigger button and a calendar popover.

```tsx
import { Picker } from '@munatech/nepali-datepicker'

<Picker
  language="ne"               // 'en' | 'ne'
  captionLayout="dropdown"    // 'buttons' | 'dropdown'
  dateFormat="YYYY-MM-DD"     // Format for view
  minDate={{ year: 2080, month: 1, day: 1 }}
  maxDate={{ year: 2085, month: 12, day: 30 }}
/>
```

### `DateRangePicker`
Perfect for booking systems or date-range filtering.

```tsx
import { DateRangePicker } from '@munatech/nepali-datepicker'

const [range, setRange] = useState({ from: undefined, to: undefined });

<DateRangePicker
  value={range}
  onChange={setRange}
  placeholder="Select date range"
/>
```

### `Calendar` (Standalone)
Use the calendar grid directly on your page without a popover.

```tsx
import { Calendar } from '@munatech/nepali-datepicker'

<Calendar
  selected={date}
  onSelect={setDate}
  language="ne"
  className="border p-4 rounded-xl shadow-lg"
/>
```

---

## 📋 Form Integration

### Native HTML Forms
The picker includes a hidden input field, making it work out-of-the-box with standard form submissions.

```tsx
<form action="/api/submit" method="POST">
  <Picker name="birth_date" />
  <button type="submit">Submit</button>
</form>
// Submits: birth_date=2082-10-06 (in standard YYYY-MM-DD format)
```

### React Hook Form (RHF)
The components support `forwardRef`, allowing seamless integration with `Controller`.

```tsx
import { useForm, Controller } from 'react-hook-form'
import { Picker } from '@munatech/nepali-datepicker'

const { control, handleSubmit } = useForm();

<Controller
  name="appointmentDate"
  control={control}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <Picker
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur} // Support for validation triggers
      ref={field.ref}       // Support for focusing on error
    />
  )}
/>
```

---

## 📚 API Reference

### Component Props (Picker & DateRangePicker)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `NepaliDate` | — | Current date selection |
| `onChange` | `Function` | — | Triggered when selection changes |
| `language` | `'en' \| 'ne'` | `'en'` | Display language for labels and numbers |
| `dateFormat` | `string` | `'YYYY-MM-DD'` | Display format in the trigger button |
| `name` | `string` | — | Input name for native form submission |
| `captionLayout` | `'buttons' \| 'dropdown'` | `'buttons'` | Navigation interface style |
| `minDate` | `NepaliDate` | — | Earliest selectable date |
| `maxDate` | `NepaliDate` | — | Latest selectable date |
| `closeOnSelect` | `boolean` | `true` | Auto-close popover after choosing |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `className` | `string` | — | Additional CSS classes for the trigger button |
| `calendarClassName` | `string` | — | Additional CSS classes for the calendar popover |

### `PickerWithToday` Specific Props
Includes all `Picker` props plus:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `containerClassName` | `string` | — | Classes for the outer wrapper `div` |
| `todayButtonClassName` | `string` | — | Classes for the "Today" shortcut button |

### Main Utility Functions

| Function | Description |
| :--- | :--- |
| `bsToAd(y, m, d)` | Returns `{ year, month, day }` in Gregorian. |
| `adToBs(y, m, d)` | Returns `{ year, month, day }` in Bikram Sambat. |
| `formatBsDate(date, str, lang)` | Formats a BS date object using tokens (YYYY, MMMM, D). |
| `getTodayBs()` | Returns the current date as a BS object. |
| `isValidBsDate(y, m, d)` | Validates if a BS date exists in history. |

---

## 🎨 Customization (Tailwind v4)

This library uses the **NDP Namespace** (`-ndp`) for all Tailwind classes to ensure zero CSS conflicts with your existing project styles.

To customize the colors, add these CSS variables to your theme:

```css
:root {
  --background-ndp: #ffffff;
  --primary-ndp: #dc2626; /* Nepali Flag Red */
  --primary-foreground-ndp: #ffffff;
  --border-ndp: #e2e8f0;
  --radius-ndp: 0.75rem;
}
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/cool-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## 📄 License

MIT © 2026. Built with ❤️ for the Nepali dev community.
