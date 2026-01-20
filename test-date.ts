import { adToBs } from './src/lib/date-converter'

try {
    const result = adToBs(2026, 1, 19)
    console.log('AD: 2026-01-19')
    console.log('BS Result:', result)
} catch (e) {
    console.error(e)
}
