import { useState, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const reportIssueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required and cannot be blank'),
  email: z.email('Please enter a valid email address'),
  notificationPreference: z.enum(['Email', 'SMS', 'None'], {
    message: 'Please select a notification preference',
  }),
  urgent: z.boolean().optional(),
})

export function useReportIssueForm() {
  return useForm({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      name: '',
      email: '',
      notificationPreference: undefined,
      urgent: false,
    },
  })
}

export default function ReportIssueForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useReportIssueForm()

  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    reset()
  }

  const handleDismissSuccess = () => setSubmitted(false)

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Report an Issue</h2>

      {submitted && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-medium text-green-800">Issue reported successfully!</p>
            <p className="mt-1 text-sm text-green-700">
              Thank you for your report. We will get back to you soon.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismissSuccess}
            className="text-sm font-medium text-green-800 underline hover:text-green-900"
            aria-label="Dismiss success message"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <FieldGroup label="Name" error={errors.name} inputId="report-name">
            <input
              {...register('name')}
              type="text"
              id="report-name"
              aria-label="Name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'report-name-error' : undefined}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Your full name"
            />
          </FieldGroup>

          <FieldGroup label="Email" error={errors.email} inputId="report-email">
            <input
              {...register('email')}
              type="email"
              id="report-email"
              aria-label="Email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'report-email-error' : undefined}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </FieldGroup>

          <FieldGroup
            label="Notification Preference"
            error={errors.notificationPreference}
            inputId="report-notification"
          >
            <select
              {...register('notificationPreference')}
              id="report-notification"
              aria-label="Notification Preference"
              aria-invalid={!!errors.notificationPreference}
              aria-describedby={
                errors.notificationPreference ? 'report-notification-error' : undefined
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Select a preference
              </option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="None">None</option>
            </select>
          </FieldGroup>

          <div className="flex items-center gap-3">
            <input
              {...register('urgent')}
              type="checkbox"
              id="report-urgent"
              aria-label="Mark as urgent"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="report-urgent" className="text-sm font-medium text-gray-700">
              Mark as urgent
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  )
}

function FieldGroup({ label, error, inputId, children }) {
  const errorId = `${inputId}-error`

  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  )
}
