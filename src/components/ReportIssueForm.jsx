import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Send,
  MapPin,
  FileText,
  Tag,
  User,
  Mail,
  Phone,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

const ISSUE_CATEGORIES = [
  { value: 'road', label: 'Road Damage' },
  { value: 'water', label: 'Water / Drainage' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'waste', label: 'Waste Management' },
  { value: 'flooding', label: 'Flooding' },
  { value: 'public_safety', label: 'Public Safety' },
  { value: 'other', label: 'Other' },
];

const reportSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be 100 characters or fewer'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be 1,000 characters or fewer'),
  category: z.enum(ISSUE_CATEGORIES.map((c) => c.value), {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  location: z.string().min(3, 'Please enter a location or landmark'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
});

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ReportIssueForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Report submitted:', data);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
        <h2 className="mb-2 text-2xl font-semibold text-green-900">Report Submitted</h2>
        <p className="mb-6 text-green-700">
          Thank you for reporting this issue. Our team will review it and take appropriate action.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      noValidate
    >
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-gray-900">Report an Issue</h2>
        <p className="mt-1 text-sm text-gray-500">
          Help us improve San Pablo City by reporting infrastructure or hazard issues.
        </p>
      </div>

      <FormField label="Issue Title" icon={FileText} error={errors.title?.message}>
        <input
          type="text"
          placeholder="e.g. Pothole on Rizal Avenue"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('title')}
        />
      </FormField>

      <FormField label="Category" icon={Tag} error={errors.category?.message}>
        <select
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('category')}
        >
          <option value="">Select a category</option>
          {ISSUE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" icon={FileText} error={errors.description?.message}>
        <textarea
          rows={4}
          placeholder="Describe the issue in detail. Include when you first noticed it and how severe it appears."
          className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('description')}
        />
      </FormField>

      <FormField label="Location / Landmark" icon={MapPin} error={errors.location?.message}>
        <input
          type="text"
          placeholder="e.g. In front of San Pablo City Hall"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('location')}
        />
      </FormField>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
        <Camera className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-sm text-gray-500">Photo upload coming soon</p>
      </div>

      <hr className="border-gray-200" />

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Contact Information
      </p>

      <FormField label="Full Name" icon={User} error={errors.fullName?.message}>
        <input
          type="text"
          placeholder="Juan Dela Cruz"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullName ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('fullName')}
        />
      </FormField>

      <FormField label="Email" icon={Mail} error={errors.email?.message}>
        <input
          type="email"
          placeholder="you@example.com"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('email')}
        />
      </FormField>

      <FormField label="Phone (optional)" icon={Phone} error={errors.phone?.message}>
        <input
          type="tel"
          placeholder="0917 123 4567"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register('phone')}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} />
            Submit Report
          </>
        )}
      </button>
    </form>
  );
}
