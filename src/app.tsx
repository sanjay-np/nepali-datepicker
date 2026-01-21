import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Calendar,
  Picker,
  DateRangePicker,
  adToBs,
  bsToAd,
  formatBsDate,
  getBsDateString,
  getDaysInBsMonth,
  getMonthName,
  getTodayBs,
  getTodayBsString,
  isValidBsDate,
  parseBsDate,
  toNepaliNumeral,
  bsToAdString,
  adToBsString,
  formatAdDate,
} from '@/index'
import type { DateRange, Language, NepaliDate } from '@/index'
import '@/index.css'

import { Button } from '@/components/ui/button'

/**
 * CodeBlock component for displaying code examples and results.
 */
function CodeBlock({ code, result }: { code: string; result: string }) {
  return (
    <div className="rounded-ndp border-border-ndp border overflow-hidden">
      <pre className="bg-muted-ndp overflow-x-auto p-3 text-sm">
        <code>{code}</code>
      </pre>
      <div className="border-border-ndp bg-card-ndp border-t p-3">
        <span className="text-muted-foreground-ndp text-xs">Result: </span>
        <span className="font-mono text-sm">{result}</span>
      </div>
    </div>
  )
}

function App() {
  const [selectedDate, setSelectedDate] = useState<NepaliDate | undefined>()
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [language, setLanguage] = useState<Language>('en')
  const [standaloneDate, setStandaloneDate] = useState<NepaliDate | undefined>()

  const today = getTodayBs()

  // React Hook Form initialization
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birthDate: undefined as NepaliDate | undefined,
    },
  })

  // Min/Max date for constrained picker
  const minDate: NepaliDate = { year: today.year, month: 1, day: 1 }
  const maxDate: NepaliDate = { year: today.year + 1, month: 12, day: 30 }

  return (
    <div className="bg-background-ndp min-h-screen text-foreground-ndp">
      {/* Header */}
      <header className="border-border-ndp border-b">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Nepali Date Picker</h1>
          <p className="text-muted-foreground-ndp mt-1 text-sm">
            A modern React component for selecting Nepali (Bikram Sambat) dates
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Language Toggle */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm font-medium">Language:</span>
          <div className="rounded-ndp border-border-ndp flex overflow-hidden border">
            <button
              onClick={() => setLanguage('en')}
              className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors ${language === 'en' ? 'bg-muted-ndp text-foreground-ndp' : 'bg-background-ndp text-foreground-ndp'
                }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors ${language === 'ne' ? 'bg-muted-ndp text-foreground-ndp' : 'bg-background-ndp text-foreground-ndp'
                }`}
            >
              नेपाली
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Date Picker */}
          <section className="border-border-ndp bg-card-ndp rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Basic Date Picker</h2>
            <p className="text-muted-foreground-ndp mt-1 text-sm">
              Click to open the calendar popover and select a date.
            </p>

            <div className="mt-4">
              <Picker
                value={selectedDate}
                onChange={setSelectedDate}
                language={language}
                placeholder={language === 'ne' ? 'मिति छान्नुहोस्' : 'Pick a date'}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            {selectedDate && (
              <div className="rounded-ndp bg-muted-ndp mt-4 p-3">
                <p className="text-sm">
                  <span className="font-medium">Selected (BS):</span>{' '}
                  {formatBsDate(selectedDate, 'MMMM D, YYYY', language)}
                </p>
                <p className="text-muted-foreground-ndp mt-1 text-sm">
                  <span className="font-medium">Equivalent (AD):</span>{' '}
                  {(() => {
                    const ad = bsToAd(selectedDate.year, selectedDate.month, selectedDate.day)
                    return `${ad.year}-${String(ad.month).padStart(2, '0')}-${String(ad.day).padStart(2, '0')}`
                  })()}
                </p>
              </div>
            )}
          </section>

          {/* Form Hooks Integration */}
          <section className="border-border-ndp bg-card-ndp rounded-lg border p-6">
            <h2 className="text-lg font-semibold">React Hook Form Integration</h2>
            <p className="text-muted-foreground-ndp mt-1 text-sm">
              Works perfectly with react-hook-form using Controller or custom refs.
            </p>

            <form
              onSubmit={handleSubmit((data) => {
                alert(`Form Submitted!\n${JSON.stringify(data, null, 2)}`)
              })}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Birth Date (Required)</label>
                <Controller
                  name="birthDate"
                  control={control}
                  rules={{ required: 'Birth date is required' }}
                  render={({ field }) => (
                    <Picker
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      language={language}
                      className={errors.birthDate ? 'border-destructive-ndp' : ''}
                    />
                  )}
                />
                {errors.birthDate && (
                  <p className="text-destructive-ndp mt-1 text-xs">{errors.birthDate.message}</p>
                )}
              </div>

              <Button type="submit" size="sm">
                Submit Form
              </Button>
            </form>
          </section>

          {/* With Dropdown Caption */}
          <section className="border-border-ndp bg-card-ndp rounded-lg border p-6">
            <h2 className="text-lg font-semibold">With Dropdown Navigation</h2>
            <p className="text-muted-foreground-ndp mt-1 text-sm">
              Month and year can be selected via dropdowns for faster navigation.
            </p>

            <div className="mt-4">
              <Picker
                value={selectedDate}
                onChange={setSelectedDate}
                language={language}
                captionLayout="dropdown"
                placeholder={language === 'ne' ? 'मिति छान्नुहोस्' : 'Select date'}
                dateFormat="MMMM D, YYYY"
              />
            </div>
          </section>

          {/* Date Range Constrained */}
          <section className="border-border-ndp bg-card-ndp rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Date Range Constraints</h2>
            <p className="text-muted-foreground-ndp mt-1 text-sm">
              Dates outside the allowed range are disabled.
            </p>

            <div className="mt-4">
              <Picker
                value={selectedDate}
                onChange={setSelectedDate}
                language={language}
                minDate={minDate}
                maxDate={maxDate}
                captionLayout="dropdown"
                placeholder="Select within range"
              />
            </div>

            <p className="text-muted-foreground-ndp mt-3 text-xs">
              Allowed: {formatBsDate(minDate, 'YYYY-MM-DD', 'en')} to{' '}
              {formatBsDate(maxDate, 'YYYY-MM-DD', 'en')}
            </p>
          </section>

          {/* Date Range Picker */}
          <section className="border-border-ndp bg-card-ndp rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Date Range Picker</h2>
            <p className="text-muted-foreground-ndp mt-1 text-sm">
              Select a start and end date range.
            </p>

            <div className="mt-4">
              <DateRangePicker
                value={selectedRange}
                onChange={setSelectedRange}
                language={language}
                placeholder={language === 'ne' ? 'अवधि छान्नुहोस्' : 'Select date range'}
              />
            </div>

            {selectedRange?.from && (
              <div className="rounded-ndp bg-muted-ndp mt-4 p-3">
                <p className="text-sm">
                  <span className="font-medium">Range:</span>{' '}
                  {formatBsDate(selectedRange.from, 'YYYY-MM-DD', language)}
                  {selectedRange.to
                    ? ` to ${formatBsDate(selectedRange.to, 'YYYY-MM-DD', language)}`
                    : ' - ...'}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Standalone Calendar */}
        <section className="border-border-ndp bg-card-ndp mt-8 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Standalone Calendar</h2>
          <p className="text-muted-foreground-ndp mt-1 text-sm">
            The Calendar component can be used standalone without the popover.
          </p>

          <div className="mt-4 flex flex-wrap gap-8">
            <Calendar
              selected={standaloneDate}
              onSelect={setStandaloneDate}
              language={language}
              className="rounded-ndp border-border-ndp bg-background-ndp border"
            />

            <div className="min-w-[200px] flex-1">
              {standaloneDate ? (
                <div className="rounded-ndp bg-muted-ndp p-4">
                  <p className="font-medium">Selected Date:</p>
                  <p className="mt-1 text-xl">
                    {formatBsDate(standaloneDate, 'MMMM D, YYYY', language)}
                  </p>
                  <p className="text-muted-foreground-ndp mt-1 text-sm">
                    {formatBsDate(standaloneDate, 'YYYY-MM-DD', 'en')}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground-ndp">
                  Click a date on the calendar to select it.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Features</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'React 19', desc: 'Built with latest React' },
              { title: 'Tailwind CSS v4', desc: 'Modern styling engine' },
              { title: 'TypeScript', desc: 'Full type safety' },
              { title: 'Bilingual', desc: 'English & Nepali support' },
              { title: 'Accessible', desc: 'Keyboard navigation' },
              { title: 'BS ↔ AD', desc: 'Date conversion utilities' },
              { title: 'Composable', desc: 'Modular component design' },
              { title: 'Customizable', desc: 'Flexible theming options' },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-ndp border-border-ndp bg-card-ndp border p-4">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-muted-foreground-ndp text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Examples */}
        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-semibold">API Examples</h2>
          <p className="text-muted-foreground-ndp mb-8 text-sm">
            Utility functions for date conversion, formatting, and validation.
          </p>

          <div className="space-y-10">
            {/* Date Conversion */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Date Conversion</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">bsToAd() - BS to AD conversion</p>
                  <CodeBlock
                    code={`bsToAd(2082, 10, 6)`}
                    result={JSON.stringify(bsToAd(2082, 10, 6))}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">adToBs() - AD to BS conversion</p>
                  <CodeBlock
                    code={`adToBs(2026, 1, 20)`}
                    result={JSON.stringify(adToBs(2026, 1, 20))}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">getTodayBs() - Get today in BS</p>
                  <CodeBlock code={`getTodayBs()`} result={JSON.stringify(getTodayBs())} />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">getDaysInBsMonth() - Days in a month</p>
                  <CodeBlock
                    code={`getDaysInBsMonth(2082, 10)`}
                    result={String(getDaysInBsMonth(2082, 10))}
                  />
                </div>
              </div>
            </div>

            {/* Date Formatting */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Date Formatting</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">formatBsDate() - Format in English</p>
                  <CodeBlock
                    code={`formatBsDate({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'en')`}
                    result={formatBsDate({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY', 'en')}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">formatBsDate() - Format in Nepali</p>
                  <CodeBlock
                    code={`formatBsDate({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'ne')`}
                    result={formatBsDate({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY', 'ne')}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">parseBsDate() - Parse date string</p>
                  <CodeBlock
                    code={`parseBsDate('2082-10-06')`}
                    result={JSON.stringify(parseBsDate('2082-10-06'))}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">getMonthName() - Get month name</p>
                  <CodeBlock
                    code={`getMonthName(10, 'en') / getMonthName(10, 'ne')`}
                    result={`"${getMonthName(10, 'en')}" / "${getMonthName(10, 'ne')}"`}
                  />
                </div>
              </div>
            </div>

            {/* Validation & Numerals */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Validation & Numerals</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">isValidBsDate() - Validate BS date</p>
                  <CodeBlock
                    code={`isValidBsDate(2082, 10, 6) / isValidBsDate(2082, 13, 35)`}
                    result={`${isValidBsDate(2082, 10, 6)} / ${isValidBsDate(2082, 13, 35)}`}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">toNepaliNumeral() - Convert to Nepali</p>
                  <CodeBlock code={`toNepaliNumeral(2082)`} result={toNepaliNumeral(2082)} />
                </div>
              </div>
            </div>

            {/* String Utilities */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">String Utilities</h3>
              <p className="text-muted-foreground-ndp mb-4 text-sm">
                Convenience functions that return formatted date strings directly.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">getTodayBsString() - Today as string</p>
                  <CodeBlock
                    code={`getTodayBsString()\ngetTodayBsString('MMMM D, YYYY', 'ne')`}
                    result={`"${getTodayBsString()}" / "${getTodayBsString('MMMM D, YYYY', 'ne')}"`}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">bsToAdString() - BS to AD string</p>
                  <CodeBlock
                    code={`bsToAdString(2082, 10, 6)\nbsToAdString(2082, 10, 6, 'MMMM D, YYYY')`}
                    result={`"${bsToAdString(2082, 10, 6)}" / "${bsToAdString(2082, 10, 6, 'MMMM D, YYYY')}"`}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">adToBsString() - AD to BS string</p>
                  <CodeBlock
                    code={`adToBsString(2026, 1, 20)\nadToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne')`}
                    result={`"${adToBsString(2026, 1, 20)}" / "${adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne')}"`}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">formatAdDate() - Format AD date</p>
                  <CodeBlock
                    code={`formatAdDate({year: 2026, month: 1, day: 20}, 'MMMM D, YYYY')`}
                    result={`"${formatAdDate({ year: 2026, month: 1, day: 20 }, 'MMMM D, YYYY')}"`}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    getBsDateString() - Format BS date object
                  </p>
                  <CodeBlock
                    code={`getBsDateString({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY')`}
                    result={`"${getBsDateString({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY')}"`}
                  />
                </div>
              </div>
            </div>

            {/* Format Tokens Reference */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Format Tokens</h3>
              <div className="rounded-ndp border-border-ndp overflow-hidden border">
                <table className="w-full text-sm">
                  <thead className="bg-muted-ndp">
                    <tr>
                      <th className="p-3 text-left font-medium">Token</th>
                      <th className="p-3 text-left font-medium">Description</th>
                      <th className="p-3 text-left font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { token: 'YYYY', desc: 'Full year', example: '2082' },
                      { token: 'YY', desc: 'Two-digit year', example: '82' },
                      { token: 'MMMM', desc: 'Full month name', example: 'Magh' },
                      { token: 'MMM', desc: 'Short month name', example: 'Mag' },
                      { token: 'MM', desc: 'Two-digit month', example: '10' },
                      { token: 'M', desc: 'Month number', example: '10' },
                      { token: 'DD', desc: 'Two-digit day', example: '06' },
                      { token: 'D', desc: 'Day number', example: '6' },
                    ].map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-card-ndp' : 'bg-background-ndp'}>
                        <td className="p-3 font-mono">{row.token}</td>
                        <td className="p-3">{row.desc}</td>
                        <td className="p-3 font-mono">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border-ndp mt-12 border-t py-8">
        <div className="text-muted-foreground-ndp mx-auto max-w-5xl px-6 text-center text-sm">
          Nepali Date Picker &bull; React 19 + Tailwind CSS v4
        </div>
      </footer>
    </div>
  )
}

export default App
