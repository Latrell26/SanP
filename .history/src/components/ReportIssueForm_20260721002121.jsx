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

function validate(data) {
  const errors = {};

  if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or fewer';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  if (data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters';
  } else if (data.description.trim().length > 1000) {
    errors.description = 'Description must be 1,000 characters or fewer';
  }

  if (data.location.trim().length < 3) {
    errors.location = 'Please enter a location or landmark';
  }

  if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.phone && data.phone.trim().length < 10) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
}

const initialForm = {
  title: '',
  description: '',
  category: '',
  location: '',
  fullName: '',
  email: '',
  phone: '',
};

export default function ReportIssueForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Report submitted:', form);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
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
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      noValidate
    >
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-gray-900">Report an Issue</h2>
        <p className="mt-1 text-sm text-gray-500">
          Help us improve San Pablo City by reporting infrastructure or hazard issues.
        </p>
      </div>

      <FormField label="Issue Title" icon={FileText} error={errors.title}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Pothole on Rizal Avenue"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      </FormField>

      <FormField label="Category" icon={Tag} error={errors.category}>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-400' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {ISSUE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" icon={FileText} error={errors.description}>
        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail. Include when you first noticed it and how severe it appears."
          className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      </FormField>

      <FormField label="Location / Landmark" icon={MapPin} error={errors.location}>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. In front of San Pablo City Hall"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location ? 'border-red-400' : 'border-gray-300'
          }`}
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

      <FormField label="Full Name" icon={User} error={errors.fullName}>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Juan Dela Cruz"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullName ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      </FormField>

      <FormField label="Email" icon={Mail} error={errors.email}>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      </FormField>

      <FormField label="Phone (optional)" icon={Phone} error={errors.phone}>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="0917 123 4567"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-400' : 'border-gray-300'
          }`}
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
