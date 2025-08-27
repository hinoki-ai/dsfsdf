import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AgeVerification } from '@/components/age-verification'

// Mock the analytics module
jest.mock('@/lib/analytics', () => ({
  analytics: {
    trackEvent: jest.fn(),
  },
}))

// Mock the i18n module
jest.mock('@/lib/i18n', () => ({
  divineTranslationOracle: {
    getTranslation: jest.fn((locale, key, fallback) => fallback || key),
  },
  defaultLocale: 'es',
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('AgeVerification Component', () => {
  const mockOnVerified = jest.fn()
  const mockOnRejected = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ip: '192.168.1.1' }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders age verification form correctly', () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    expect(screen.getByText('Verificación de Edad')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verificar edad/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('shows error when no birth date is provided', async () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText('Por favor ingresa tu fecha de nacimiento')).toBeInTheDocument()
    })
  })

  it('shows error for underage users', async () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const dateInput = screen.getByLabelText('Fecha de Nacimiento')
    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })

    // Enter a date that makes user 17 years old
    const underageDate = new Date()
    underageDate.setFullYear(underageDate.getFullYear() - 17)
    const dateString = underageDate.toISOString().split('T')[0]

    fireEvent.change(dateInput, { target: { value: dateString } })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText(/Debes tener al menos 18 años/)).toBeInTheDocument()
    })

    expect(mockOnVerified).not.toHaveBeenCalled()
  })

  it('successfully verifies age for adult users', async () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const dateInput = screen.getByLabelText('Fecha de Nacimiento')
    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })

    // Enter a date that makes user 25 years old
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]

    fireEvent.change(dateInput, { target: { value: dateString } })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(mockOnVerified).toHaveBeenCalledWith(expect.any(Date))
    }, { timeout: 2000 })
  })

  it('calls onRejected when cancel button is clicked', () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockOnRejected).toHaveBeenCalled()
  })

  it('loads existing verification from localStorage', () => {
    const validVerification = {
      birthDate: '1990-01-01',
      verificationMethod: 'birthdate' as const,
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      sessionId: 'test-session',
    }

    localStorage.setItem('liquor_age_verification', JSON.stringify(validVerification))

    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    // Should call onVerified with the stored birth date
    expect(mockOnVerified).toHaveBeenCalledWith(new Date('1990-01-01'))
  })

  it('ignores expired verification from localStorage', () => {
    const expiredVerification = {
      birthDate: '1990-01-01',
      verificationMethod: 'birthdate' as const,
      timestamp: Date.now() - 1000 * 60 * 60 * 25, // 25 hours ago (expired)
      sessionId: 'test-session',
    }

    localStorage.setItem('liquor_age_verification', JSON.stringify(expiredVerification))

    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    // Should not call onVerified for expired verification
    expect(mockOnVerified).not.toHaveBeenCalled()
    
    // Should render the verification form
    expect(screen.getByText('Verificación de Edad')).toBeInTheDocument()
  })

  it('handles invalid date input', async () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const dateInput = screen.getByLabelText('Fecha de Nacimiento')
    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })

    fireEvent.change(dateInput, { target: { value: 'invalid-date' } })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText('Fecha de nacimiento inválida')).toBeInTheDocument()
    })

    expect(mockOnVerified).not.toHaveBeenCalled()
  })

  it('logs verification attempts to compliance API', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    global.fetch = mockFetch

    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
      />
    )

    const dateInput = screen.getByLabelText('Fecha de Nacimiento')
    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })

    // Enter valid adult birth date
    const adultDate = new Date()
    adultDate.setFullYear(adultDate.getFullYear() - 25)
    const dateString = adultDate.toISOString().split('T')[0]

    fireEvent.change(dateInput, { target: { value: dateString } })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/compliance/age-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"success":true'),
      })
    })
  })

  it('supports custom minimum age', async () => {
    render(
      <AgeVerification
        onVerified={mockOnVerified}
        onRejected={mockOnRejected}
        minimumAge={21}
      />
    )

    const dateInput = screen.getByLabelText('Fecha de Nacimiento')
    const verifyButton = screen.getByRole('button', { name: /verificar edad/i })

    // Enter a date that makes user 20 years old (under 21)
    const underageDate = new Date()
    underageDate.setFullYear(underageDate.getFullYear() - 20)
    const dateString = underageDate.toISOString().split('T')[0]

    fireEvent.change(dateInput, { target: { value: dateString } })
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText(/Debes tener al menos 21 años/)).toBeInTheDocument()
    })
  })
})