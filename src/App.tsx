import { useState } from 'react'
import type { NepaliDate, Language } from './index'
import {
  NepaliDatePicker,
  Calendar,
  getTodayBs,
  formatBsDate,
  bsToAd,
  adToBs,
  getDaysInBsMonth,
  isValidBsDate,
  toNepaliNumeral,
  getMonthName,
  parseBsDate,
  // String utility functions
  getTodayBsString,
  bsToAdString,
  adToBsString,
  formatAdDate,
  getBsDateString,
} from './index'
import './index.css'

// Code block component for displaying examples
function CodeBlock({ code, result }: { code: string; result: string }) {
  return (
    <div className="ndp-rounded-md ndp-border ndp-overflow-hidden">
      <pre className="ndp-bg-muted ndp-p-3 ndp-text-sm ndp-overflow-x-auto">
        <code>{code}</code>
      </pre>
      <div className="ndp-border-t ndp-bg-card ndp-p-3">
        <span className="ndp-text-xs ndp-text-muted-foreground">Result: </span>
        <span className="ndp-text-sm ndp-font-mono">{result}</span>
      </div>
    </div>
  )
}

function App() {
  const [selectedDate, setSelectedDate] = useState<NepaliDate | undefined>()
  const [language, setLanguage] = useState<Language>('en')
  const [standaloneDate, setStandaloneDate] = useState<NepaliDate | undefined>()

  const today = getTodayBs()

  // Min/Max date for constrained picker
  const minDate: NepaliDate = { year: today.year, month: 1, day: 1 }
  const maxDate: NepaliDate = { year: today.year + 1, month: 12, day: 30 }

  return (
    <div className="ndp-min-h-screen ndp-bg-background">
      {/* Header */}
      <header className="ndp-border-b">
        <div className="ndp-mx-auto ndp-max-w-5xl ndp-px-6 ndp-py-6">
          <h1 className="ndp-text-2xl ndp-font-semibold ndp-tracking-tight">
            Nepali Date Picker
          </h1>
          <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
            A modern React component for selecting Nepali (Bikram Sambat) dates
          </p>
        </div>
      </header>

      <main className="ndp-mx-auto ndp-max-w-5xl ndp-px-6 ndp-py-10">
        {/* Language Toggle */}
        <div className="ndp-mb-8 ndp-flex ndp-items-center ndp-gap-4">
          <span className="ndp-text-sm ndp-font-medium">Language:</span>
          <div className="ndp-flex ndp-overflow-hidden ndp-rounded-md ndp-border">
            <button
              onClick={() => setLanguage('en')}
              className={`ndp-btn ndp-p-1-5 ndp-text-sm ndp-font-medium ndp-rounded-none ${language === 'en'
                ? 'ndp-bg-muted ndp-text-foreground'
                : 'ndp-bg-background ndp-text-foreground'
                }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`ndp-btn ndp-p-1-5 ndp-text-sm ndp-font-medium ndp-rounded-none ${language === 'ne'
                ? 'ndp-bg-muted ndp-text-foreground'
                : 'ndp-bg-background ndp-text-foreground'
                }`}
            >
              नेपाली
            </button>
          </div>
        </div>

        <div className="ndp-grid ndp-gap-8 ndp-md-grid-cols-2">
          {/* Basic Date Picker */}
          <section className="ndp-rounded-lg ndp-border ndp-p-6">
            <h2 className="ndp-font-semibold">
              Basic Date Picker
            </h2>
            <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
              Click to open the calendar popover and select a date.
            </p>

            <div className="ndp-mt-4">
              <NepaliDatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                language={language}
                placeholder={language === 'ne' ? 'मिति छान्नुहोस्' : 'Pick a date'}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            {selectedDate && (
              <div className="ndp-mt-4 ndp-rounded-md ndp-bg-muted ndp-p-3">
                <p className="ndp-text-sm">
                  <span className="ndp-font-medium">Selected (BS):</span>{' '}
                  {formatBsDate(selectedDate, 'MMMM D, YYYY', language)}
                </p>
                <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
                  <span className="ndp-font-medium">Equivalent (AD):</span>{' '}
                  {(() => {
                    const ad = bsToAd(selectedDate.year, selectedDate.month, selectedDate.day)
                    return `${ad.year}-${String(ad.month).padStart(2, '0')}-${String(ad.day).padStart(2, '0')}`
                  })()}
                </p>
              </div>
            )}
          </section>

          {/* With Dropdown Caption */}
          <section className="ndp-rounded-lg ndp-border ndp-p-6">
            <h2 className="ndp-font-semibold">
              With Dropdown Navigation
            </h2>
            <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
              Month and year can be selected via dropdowns for faster navigation.
            </p>

            <div className="ndp-mt-4">
              <NepaliDatePicker
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
          <section className="ndp-rounded-lg ndp-border ndp-p-6">
            <h2 className="ndp-font-semibold">
              Date Range Constraints
            </h2>
            <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
              Dates outside the allowed range are disabled.
            </p>

            <div className="ndp-mt-4">
              <NepaliDatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                language={language}
                minDate={minDate}
                maxDate={maxDate}
                captionLayout="dropdown"
                placeholder="Select within range"
              />
            </div>

            <p className="ndp-mt-3 ndp-text-xs ndp-text-muted-foreground">
              Range: {formatBsDate(minDate, 'YYYY-MM-DD', 'en')} to {formatBsDate(maxDate, 'YYYY-MM-DD', 'en')}
            </p>
          </section>

          {/* Today's Date Display */}
          <section className="ndp-rounded-lg ndp-border ndp-p-6">
            <h2 className="ndp-font-semibold">
              Today's Date
            </h2>

            <div className="ndp-mt-4 ndp-space-y-3">
              <div className="ndp-rounded-md ndp-border ndp-bg-card ndp-p-4">
                <p className="ndp-text-xl ndp-font-semibold">
                  {formatBsDate(today, 'MMMM D, YYYY', language)}
                </p>
                <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
                  {formatBsDate(today, 'YYYY-MM-DD', 'en')} BS
                </p>
              </div>

              <div className="ndp-rounded-md ndp-bg-muted ndp-p-3">
                <p className="ndp-text-sm ndp-text-muted-foreground">
                  Equivalent AD:{' '}
                  {(() => {
                    const ad = bsToAd(today.year, today.month, today.day)
                    return new Date(ad.year, ad.month - 1, ad.day).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  })()}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Standalone Calendar */}
        <section className="ndp-mt-8 ndp-rounded-lg ndp-border ndp-p-6">
          <h2 className="ndp-font-semibold">
            Standalone Calendar
          </h2>
          <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
            The Calendar component can be used standalone without the popover.
          </p>

          <div className="ndp-mt-4 ndp-flex ndp-flex-wrap ndp-gap-8">
            <Calendar
              selected={standaloneDate}
              onSelect={setStandaloneDate}
              language={language}
              className="ndp-rounded-md ndp-border"
            />

            <div className="ndp-min-w-[200px] ndp-flex-1">
              {standaloneDate ? (
                <div className="ndp-rounded-md ndp-bg-muted ndp-p-4">
                  <p className="ndp-font-medium">Selected Date:</p>
                  <p className="ndp-mt-1 ndp-text-lg">
                    {formatBsDate(standaloneDate, 'MMMM D, YYYY', language)}
                  </p>
                  <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
                    {formatBsDate(standaloneDate, 'YYYY-MM-DD', 'en')}
                  </p>
                </div>
              ) : (
                <p className="ndp-text-muted-foreground">
                  Click a date on the calendar to select it.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="ndp-mt-8">
          <h2 className="ndp-font-semibold">
            Features
          </h2>

          <div className="ndp-mt-4 ndp-grid ndp-gap-4 ndp-grid-cols-1 ndp-md-grid-cols-2 ndp-lg-grid-cols-4">
            {[
              { title: 'React 19', desc: 'Built with latest React' },
              { title: 'Custom CSS', desc: 'No heavy CSS frameworks' },
              { title: 'TypeScript', desc: 'Full type safety' },
              { title: 'Bilingual', desc: 'English & Nepali support' },
              { title: 'Accessible', desc: 'Keyboard navigation' },
              { title: 'BS ↔ AD', desc: 'Date conversion utilities' },
              { title: 'Composable', desc: 'Modular component design' },
              { title: 'Customizable', desc: 'Flexible theming options' },
            ].map((feature, idx) => (
              <div key={idx} className="ndp-rounded-md ndp-border ndp-p-4">
                <h3 className="ndp-font-medium">{feature.title}</h3>
                <p className="ndp-text-sm ndp-text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Examples */}
        <section className="ndp-mt-8">
          <h2 className="ndp-text-xl ndp-font-semibold">
            API Examples
          </h2>
          <p className="ndp-mt-1 ndp-text-sm ndp-text-muted-foreground">
            Utility functions for date conversion, formatting, and validation.
          </p>

          <div className="ndp-mt-6 ndp-space-y-6">
            {/* Date Conversion */}
            <div>
              <h3 className="ndp-font-semibold ndp-text-lg ndp-mb-3">Date Conversion</h3>
              <div className="ndp-grid ndp-gap-4 ndp-md-grid-cols-2">
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">bsToAd() - BS to AD conversion</p>
                  <CodeBlock
                    code={`bsToAd(2082, 10, 6)`}
                    result={JSON.stringify(bsToAd(2082, 10, 6))}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">adToBs() - AD to BS conversion</p>
                  <CodeBlock
                    code={`adToBs(2026, 1, 20)`}
                    result={JSON.stringify(adToBs(2026, 1, 20))}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">getTodayBs() - Get today in BS</p>
                  <CodeBlock
                    code={`getTodayBs()`}
                    result={JSON.stringify(getTodayBs())}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">getDaysInBsMonth() - Days in a month</p>
                  <CodeBlock
                    code={`getDaysInBsMonth(2082, 10)`}
                    result={String(getDaysInBsMonth(2082, 10))}
                  />
                </div>
              </div>
            </div>

            {/* Date Formatting */}
            <div>
              <h3 className="ndp-font-semibold ndp-text-lg ndp-mb-3">Date Formatting</h3>
              <div className="ndp-grid ndp-gap-4 ndp-md-grid-cols-2">
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">formatBsDate() - Format in English</p>
                  <CodeBlock
                    code={`formatBsDate({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'en')`}
                    result={formatBsDate({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY', 'en')}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">formatBsDate() - Format in Nepali</p>
                  <CodeBlock
                    code={`formatBsDate({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY', 'ne')`}
                    result={formatBsDate({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY', 'ne')}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">parseBsDate() - Parse date string</p>
                  <CodeBlock
                    code={`parseBsDate('2082-10-06')`}
                    result={JSON.stringify(parseBsDate('2082-10-06'))}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">getMonthName() - Get month name</p>
                  <CodeBlock
                    code={`getMonthName(10, 'en') / getMonthName(10, 'ne')`}
                    result={`"${getMonthName(10, 'en')}" / "${getMonthName(10, 'ne')}"`}
                  />
                </div>
              </div>
            </div>

            {/* Validation & Numerals */}
            <div>
              <h3 className="ndp-font-semibold ndp-text-lg ndp-mb-3">Validation & Numerals</h3>
              <div className="ndp-grid ndp-gap-4 ndp-md-grid-cols-2">
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">isValidBsDate() - Validate BS date</p>
                  <CodeBlock
                    code={`isValidBsDate(2082, 10, 6) / isValidBsDate(2082, 13, 35)`}
                    result={`${isValidBsDate(2082, 10, 6)} / ${isValidBsDate(2082, 13, 35)}`}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">toNepaliNumeral() - Convert to Nepali</p>
                  <CodeBlock
                    code={`toNepaliNumeral(2082)`}
                    result={toNepaliNumeral(2082)}
                  />
                </div>
              </div>
            </div>

            {/* String Utilities */}
            <div>
              <h3 className="ndp-font-semibold ndp-text-lg ndp-mb-3">String Utilities</h3>
              <p className="ndp-text-sm ndp-text-muted-foreground ndp-mb-4">
                Convenience functions that return formatted date strings directly.
              </p>
              <div className="ndp-grid ndp-gap-4 ndp-md-grid-cols-2">
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">getTodayBsString() - Today as string</p>
                  <CodeBlock
                    code={`getTodayBsString()\ngetTodayBsString('MMMM D, YYYY', 'ne')`}
                    result={`"${getTodayBsString()}" / "${getTodayBsString('MMMM D, YYYY', 'ne')}"`}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">bsToAdString() - BS to AD string</p>
                  <CodeBlock
                    code={`bsToAdString(2082, 10, 6)\nbsToAdString(2082, 10, 6, 'MMMM D, YYYY')`}
                    result={`"${bsToAdString(2082, 10, 6)}" / "${bsToAdString(2082, 10, 6, 'MMMM D, YYYY')}"`}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">adToBsString() - AD to BS string</p>
                  <CodeBlock
                    code={`adToBsString(2026, 1, 20)\nadToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne')`}
                    result={`"${adToBsString(2026, 1, 20)}" / "${adToBsString(2026, 1, 20, 'MMMM D, YYYY', 'ne')}"`}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">formatAdDate() - Format AD date</p>
                  <CodeBlock
                    code={`formatAdDate({year: 2026, month: 1, day: 20}, 'MMMM D, YYYY')`}
                    result={`"${formatAdDate({ year: 2026, month: 1, day: 20 }, 'MMMM D, YYYY')}"`}
                  />
                </div>
                <div>
                  <p className="ndp-text-sm ndp-font-medium ndp-mb-2">getBsDateString() - Format BS date object</p>
                  <CodeBlock
                    code={`getBsDateString({year: 2082, month: 10, day: 6}, 'MMMM D, YYYY')`}
                    result={`"${getBsDateString({ year: 2082, month: 10, day: 6 }, 'MMMM D, YYYY')}"`}
                  />
                </div>
              </div>
            </div>

            {/* Format Tokens Reference */}
            <div>
              <h3 className="ndp-font-semibold ndp-text-lg ndp-mb-3">Format Tokens</h3>
              <div className="ndp-rounded-md ndp-border ndp-overflow-hidden">
                <table className="ndp-w-full ndp-text-sm">
                  <thead className="ndp-bg-muted">
                    <tr>
                      <th className="ndp-p-3 ndp-text-left ndp-font-medium">Token</th>
                      <th className="ndp-p-3 ndp-text-left ndp-font-medium">Description</th>
                      <th className="ndp-p-3 ndp-text-left ndp-font-medium">Example</th>
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
                      <tr key={idx} className={idx % 2 === 0 ? 'ndp-bg-card' : 'ndp-bg-background'}>
                        <td className="ndp-p-3 ndp-font-mono">{row.token}</td>
                        <td className="ndp-p-3">{row.desc}</td>
                        <td className="ndp-p-3 ndp-font-mono">{row.example}</td>
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
      <footer className="ndp-mt-12 ndp-border-t">
        <div className="ndp-mx-auto ndp-max-w-5xl ndp-px-6 ndp-py-6 ndp-text-center ndp-text-sm ndp-text-muted-foreground">
          Nepali Date Picker &bull; React 19 + Custom CSS
        </div>
      </footer>
    </div>
  )
}

export default App
