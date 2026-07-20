import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ReportIssueForm from './ReportIssueForm'

describe('ReportIssueForm', () => {
  describe('accessibility', () => {
    it('every input has an accessible label', () => {
      render(<ReportIssueForm />)

      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Notification Preference')).toBeInTheDocument()
      expect(screen.getByLabelText('Mark as urgent')).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows all validation errors on empty submit', async () => {
      const user = userEvent.setup()
      render(<ReportIssueForm />)

      await user.click(screen.getByRole('button', { name: /submit report/i }))

      expect(await screen.findByText('Name is required and cannot be blank')).toBeInTheDocument()
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      expect(screen.getByText('Please select a notification preference')).toBeInTheDocument()
    })

    it('rejects invalid email', async () => {
      const user = userEvent.setup()
      render(<ReportIssueForm />)

      await user.type(screen.getByLabelText('Name'), 'Jane Doe')
      await user.type(screen.getByLabelText('Email'), 'not-an-email')
      await user.selectOptions(screen.getByLabelText('Notification Preference'), 'Email')
      await user.click(screen.getByRole('button', { name: /submit report/i }))

      expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument()
    })

    it('rejects whitespace-only name', async () => {
      const user = userEvent.setup()
      render(<ReportIssueForm />)

      await user.type(screen.getByLabelText('Name'), '   ')
      await user.type(screen.getByLabelText('Email'), 'jane@example.com')
      await user.selectOptions(screen.getByLabelText('Notification Preference'), 'SMS')
      await user.click(screen.getByRole('button', { name: /submit report/i }))

      expect(
        await screen.findByText('Name is required and cannot be blank'),
      ).toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('shows loading state and then success message, resets the form', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ReportIssueForm />)

      await user.type(screen.getByLabelText('Name'), 'Jane Doe')
      await user.type(screen.getByLabelText('Email'), 'jane@example.com')
      await user.selectOptions(screen.getByLabelText('Notification Preference'), 'Email')

      await user.click(screen.getByRole('button', { name: /submit report/i }))

      const submitButton = screen.getByRole('button', { name: /submitting/i })
      expect(submitButton).toBeDisabled()

      await vi.advanceTimersByTimeAsync(1000)

      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Issue reported successfully!')).toBeInTheDocument()

      expect(screen.getByLabelText('Name')).toHaveValue('')
      expect(screen.getByLabelText('Email')).toHaveValue('')
      expect(screen.getByLabelText('Notification Preference')).toHaveValue('')

      vi.useRealTimers()
    })
  })
})
