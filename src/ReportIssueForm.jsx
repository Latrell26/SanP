import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Upload,
  User,
  MapPin,
  FileText,
  Phone,
  Mail,
  Shield,
} from "lucide-react";

import { reportIssueSchema, ISSUE_CATEGORIES, URGENCY_LEVELS, validateExtras } from "@/data/report-issue";
import { SAN_PABLO_BARANGAYS } from "@/data/barangays";

const inputClass = (error) =>
  `w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

const selectClass = (error) =>
  `w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 flex items-center gap-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export default function ReportIssueForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    setValue,
    reset,
    control,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      isAnonymous: false,
      reporterName: "",
      contactNumber: "",
      email: "",
      barangay: "",
      category: "",
      urgency: "",
      landmark: "",
      description: "",
      photo: undefined,
      consent: false,
    },
  });

  const isAnonymous = useWatch({ control, name: "isAnonymous" });

  async function onSubmit(e) {
    e.preventDefault();

    const zodValid = await trigger();
    const data = getValues();

    const extraErrors = validateExtras(data);
    extraErrors.forEach(({ name, type, message }) => {
      setError(name, { type, message });
    });

    if (!zodValid || extraErrors.length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        setIsSubmitted(true);
        reset();
        setSubmitting(false);
        resolve();
      }, 1200);
    });
  }

  function handleAnonymousChange(e) {
    const checked = e.target.checked;
    setValue("isAnonymous", checked, { shouldValidate: true });
    if (checked) {
      setValue("reporterName", "");
      setValue("contactNumber", "");
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-3 py-8 text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900">Report Submitted</h2>
          <p className="text-sm text-gray-600 max-w-sm">
            Thank you for your report. The appropriate city office will review it and follow up if
            needed.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Report an Issue</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tell us what is wrong and we will route it to the right city office.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        {/* Anonymous toggle */}
        <div className="mb-5 flex items-center gap-3 rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
          <input
            id="report-anonymous"
            type="checkbox"
            {...register("isAnonymous")}
            onChange={handleAnonymousChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="report-anonymous" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-gray-500" aria-hidden="true" />
            File anonymously
          </label>
        </div>

        {/* Reporter identity - shown when not anonymous */}
        {!isAnonymous && (
          <>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                Full Name
              </label>
              <input
                id="report-name"
                type="text"
                placeholder="Juan Dela Cruz"
                {...register("reporterName")}
                aria-invalid={Boolean(errors.reporterName)}
                aria-describedby={errors.reporterName ? "err-reporterName" : undefined}
                className={inputClass(errors.reporterName)}
              />
              <FieldError id="err-reporterName" message={errors.reporterName?.message} />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label htmlFor="report-contact" className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                Contact Number
              </label>
              <input
                id="report-contact"
                type="tel"
                placeholder="09171234567"
                {...register("contactNumber")}
                aria-invalid={Boolean(errors.contactNumber)}
                aria-describedby={errors.contactNumber ? "err-contactNumber" : undefined}
                className={inputClass(errors.contactNumber)}
              />
              <FieldError id="err-contactNumber" message={errors.contactNumber?.message} />
            </div>
          </>
        )}

        {/* Email - always shown */}
        <div className="mb-4">
          <label htmlFor="report-email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            Email Address {isAnonymous ? "(optional)" : ""}
          </label>
          <input
            id="report-email"
            type="email"
            placeholder="juan@example.com"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={inputClass(errors.email)}
          />
          <FieldError id="err-email" message={errors.email?.message} />
        </div>

        {/* Barangay */}
        <div className="mb-4">
          <label htmlFor="report-barangay" className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            Barangay
          </label>
          <select
            id="report-barangay"
            {...register("barangay")}
            aria-invalid={Boolean(errors.barangay)}
            aria-describedby={errors.barangay ? "err-barangay" : undefined}
            className={selectClass(errors.barangay)}
          >
            <option value="">Select your barangay...</option>
            {SAN_PABLO_BARANGAYS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <FieldError id="err-barangay" message={errors.barangay?.message} />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="report-category" className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            Issue Category
          </label>
          <select
            id="report-category"
            {...register("category")}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "err-category" : undefined}
            className={selectClass(errors.category)}
          >
            <option value="">Select a category...</option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <FieldError id="err-category" message={errors.category?.message} />
        </div>

        {/* Urgency */}
        <div className="mb-4">
          <label htmlFor="report-urgency" className="block text-sm font-medium text-gray-700 mb-1">
            Urgency Level
          </label>
          <select
            id="report-urgency"
            {...register("urgency")}
            aria-invalid={Boolean(errors.urgency)}
            aria-describedby={errors.urgency ? "err-urgency" : undefined}
            className={selectClass(errors.urgency)}
          >
            <option value="">How urgent is this?</option>
            {URGENCY_LEVELS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label} - {u.hint}
              </option>
            ))}
          </select>
          <FieldError id="err-urgency" message={errors.urgency?.message} />
        </div>

        {/* Landmark */}
        <div className="mb-4">
          <label htmlFor="report-landmark" className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            Nearby Landmark / Location Detail
          </label>
          <input
            id="report-landmark"
            type="text"
            placeholder="e.g. beside San Pablo Cathedral, Barangay Hall road"
            {...register("landmark")}
            aria-invalid={Boolean(errors.landmark)}
            aria-describedby={errors.landmark ? "err-landmark" : undefined}
            className={inputClass(errors.landmark)}
          />
          <FieldError id="err-landmark" message={errors.landmark?.message} />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="report-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description of the Issue
          </label>
          <textarea
            id="report-description"
            rows={4}
            placeholder="Describe what you see, when it started, and how many people are affected..."
            {...register("description")}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "err-description" : undefined}
            className={`${inputClass(errors.description)} resize-y`}
          />
          <FieldError id="err-description" message={errors.description?.message} />
        </div>

        {/* Photo */}
        <div className="mb-4">
          <label htmlFor="report-photo" className="block text-sm font-medium text-gray-700 mb-1">
            <Upload className="inline h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            Photo Evidence (optional)
          </label>
          <input
            id="report-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            {...register("photo")}
            aria-invalid={Boolean(errors.photo)}
            aria-describedby={errors.photo ? "err-photo" : undefined}
            className={`w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
              errors.photo ? "text-red-600" : ""
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WEBP up to 5 MB</p>
          <FieldError id="err-photo" message={errors.photo?.message} />
        </div>

        {/* Consent */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <input
              id="report-consent"
              type="checkbox"
              {...register("consent")}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "err-consent" : undefined}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="report-consent" className="text-sm text-gray-700">
              I confirm this report is accurate and I am filing it in good faith.
            </label>
          </div>
          <FieldError id="err-consent" message={errors.consent?.message} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          aria-label={submitting ? "Submitting report" : "Submit report"}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
