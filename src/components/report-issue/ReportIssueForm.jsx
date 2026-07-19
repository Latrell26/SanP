import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import {
  ISSUE_CATEGORIES,
  URGENCY_LEVELS,
  reportIssueSchema,
} from "@/lib/validations/report-issue";
import { SAN_PABLO_BARANGAYS } from "@/lib/data/barangays";

const HOTLINE_NUMBER = "(049) 562-0000";
const EMERGENCY_NUMBER = "911";

/** Small ripple glyph used as the signature element across the page. */
function RippleIcon({ rings = 2, className = "" }) {
  const radii = [7, 12, 17, 22].slice(0, rings);
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      {radii.map((r) => (
        <circle
          key={r}
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          opacity={1 - r / 28}
        />
      ))}
    </svg>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-[#B3261E]"
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

function Label({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-[#16231F]"
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[#B3261E]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-[#16231F] placeholder:text-[#8A968F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[#F2F4F2] disabled:text-[#8A968F]";
const inputValid =
  "border-[#D8DED9] focus:border-[#145850] focus:ring-[#145850]/40";
const inputInvalid =
  "border-[#B3261E] focus:border-[#B3261E] focus:ring-[#B3261E]/40";

function generateReferenceNumber(barangay) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const codeSeed = (barangay || "SPC").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "SPC";
  return `SP-${codeSeed}-${stamp}`;
}

export default function ReportIssueForm() {
  const formTitleId = useId();
  const liveRegionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success
  const [referenceNumber, setReferenceNumber] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportIssueSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      isAnonymous: false,
      reporterName: "",
      contactNumber: "",
      email: "",
      barangay: "",
      category: "",
      urgency: "medium",
      landmark: "",
      description: "",
      consent: false,
    },
  });

  const isAnonymous = watch("isAnonymous");
  const urgency = watch("urgency");
  const description = watch("description") || "";

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setValue("photo", undefined, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onValidSubmit(data) {
    setSubmitState("submitting");
    // Simulated submission. Swap for a real API call, e.g.:
    // await fetch("/api/reports", { method: "POST", body: buildFormData(data) });
    await new Promise((resolve) => setTimeout(resolve, 900));
    const refNumber = generateReferenceNumber(data.barangay);
    setReferenceNumber(refNumber);
    setSubmitState("success");
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Report submitted. Reference number ${refNumber}.`;
    }
  }

  function onInvalidSubmit(formErrors) {
    const firstErrorField = Object.keys(formErrors)[0];
    if (firstErrorField) setFocus(firstErrorField);
    if (liveRegionRef.current) {
      const count = Object.keys(formErrors).length;
      liveRegionRef.current.textContent = `${count} field${
        count === 1 ? "" : "s"
      } need${count === 1 ? "s" : ""} your attention before you can submit.`;
    }
  }

  function startNewReport() {
    clearPhoto();
    reset();
    setSubmitState("idle");
    setReferenceNumber(null);
  }

  if (submitState === "success") {
    return (
      <div
        className="mx-auto max-w-xl rounded-2xl border border-[#D8DED9] bg-white p-8 text-center shadow-sm"
        role="status"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF5F1] text-[#145850]">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#0D3B36]">
          Report received
        </h2>
        <p className="mt-2 text-[#3C4A44]">
          Thank you for helping look after San Pablo. Your report has been
          logged and routed to the office that handles it.
        </p>
        <div className="mt-5 rounded-lg border border-dashed border-[#D8DED9] bg-[#FBFAF7] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6E7A73]">
            Reference number
          </p>
          <p className="mt-0.5 font-mono text-lg font-semibold text-[#0D3B36]">
            {referenceNumber}
          </p>
        </div>
        <p className="mt-3 text-sm text-[#6E7A73]">
          Save this number to follow up with the City Hotline at{" "}
          <a
            href={`tel:${HOTLINE_NUMBER.replace(/[^0-9+]/g, "")}`}
            className="font-medium text-[#145850] underline underline-offset-2"
          >
            {HOTLINE_NUMBER}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={startNewReport}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#145850] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3B36] focus:outline-none focus:ring-2 focus:ring-[#145850]/40 focus:ring-offset-1"
        >
          File another report
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Live region for async status updates (assistive tech only) */}
      <div ref={liveRegionRef} aria-live="polite" className="sr-only" />

      <form
        noValidate
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        aria-labelledby={formTitleId}
        className="space-y-8"
      >
        <header className="relative overflow-hidden rounded-2xl bg-[#0D3B36] px-6 py-8 text-white sm:px-8">
          <RippleIcon
            rings={4}
            className="pointer-events-none absolute -right-6 -top-8 h-40 w-40 text-white/10"
          />
          <RippleIcon
            rings={3}
            className="pointer-events-none absolute -bottom-10 left-8 h-28 w-28 text-white/10"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-[#8FCFC0]">
            MySanPablo &middot; Citizen Services
          </p>
          <h1
            id={formTitleId}
            className="relative mt-1 font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          >
            Report an Issue
          </h1>
          <p className="relative mt-2 max-w-md text-sm text-[#D7EBE4]">
            Tell us what's wrong and where. Every report ripples out to the
            barangay or city office that can act on it.
          </p>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-[#F0D9A8] bg-[#FBF3E1] px-4 py-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#9A5B0A]"
            aria-hidden="true"
          />
          <p className="text-sm text-[#5C420C]">
            <span className="font-semibold">In a life-threatening emergency,</span>{" "}
            call{" "}
            <a href={`tel:${EMERGENCY_NUMBER}`} className="font-semibold underline">
              {EMERGENCY_NUMBER}
            </a>{" "}
            or the City Hotline at{" "}
            <a
              href={`tel:${HOTLINE_NUMBER.replace(/[^0-9+]/g, "")}`}
              className="font-semibold underline"
            >
              {HOTLINE_NUMBER}
            </a>{" "}
            now instead of filling out this form.
          </p>
        </div>

        {/* Section: Reporter information */}
        <fieldset className="rounded-2xl border border-[#D8DED9] bg-white p-5 sm:p-6">
          <legend className="px-1 font-serif text-lg font-semibold text-[#0D3B36]">
            Who's reporting
          </legend>

          <div className="mt-3 flex items-center gap-2.5">
            <input
              id="isAnonymous"
              type="checkbox"
              {...register("isAnonymous")}
              className="h-4 w-4 rounded border-[#B7C2BC] text-[#145850] focus:ring-2 focus:ring-[#145850]/40"
            />
            <label htmlFor="isAnonymous" className="text-sm text-[#3C4A44]">
              File this report anonymously
            </label>
          </div>

          {!isAnonymous && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="reporterName" required>
                  Full name
                </Label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A968F]"
                    aria-hidden="true"
                  />
                  <input
                    id="reporterName"
                    type="text"
                    autoComplete="name"
                    placeholder="Juan Dela Cruz"
                    aria-required="true"
                    aria-invalid={errors.reporterName ? "true" : "false"}
                    aria-describedby={
                      errors.reporterName ? "reporterName-error" : undefined
                    }
                    {...register("reporterName")}
                    className={`${inputBase} pl-9 ${
                      errors.reporterName ? inputInvalid : inputValid
                    }`}
                  />
                </div>
                <FieldError id="reporterName-error" message={errors.reporterName?.message} />
              </div>

              <div>
                <Label htmlFor="contactNumber" required>
                  Mobile number
                </Label>
                <div className="relative">
                  <Phone
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A968F]"
                    aria-hidden="true"
                  />
                  <input
                    id="contactNumber"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="09171234567"
                    aria-required="true"
                    aria-invalid={errors.contactNumber ? "true" : "false"}
                    aria-describedby={
                      errors.contactNumber ? "contactNumber-error" : undefined
                    }
                    {...register("contactNumber")}
                    className={`${inputBase} pl-9 ${
                      errors.contactNumber ? inputInvalid : inputValid
                    }`}
                  />
                </div>
                <FieldError
                  id="contactNumber-error"
                  message={errors.contactNumber?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">Email (optional)</Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A968F]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="juan@email.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                    className={`${inputBase} pl-9 ${
                      errors.email ? inputInvalid : inputValid
                    }`}
                  />
                </div>
                <FieldError id="email-error" message={errors.email?.message} />
                <p className="mt-1.5 text-xs text-[#6E7A73]">
                  We'll only use this to send you status updates on this report.
                </p>
              </div>
            </div>
          )}

          {isAnonymous && (
            <p className="mt-3 text-sm text-[#6E7A73]">
              Anonymous reports are still investigated, but the city won't be
              able to follow up with you directly.
            </p>
          )}
        </fieldset>

        {/* Section: Issue details */}
        <fieldset className="rounded-2xl border border-[#D8DED9] bg-white p-5 sm:p-6">
          <legend className="px-1 font-serif text-lg font-semibold text-[#0D3B36]">
            What's happening
          </legend>

          <div className="mt-3">
            <Label htmlFor="category" required>
              Issue category
            </Label>
            <select
              id="category"
              defaultValue=""
              aria-required="true"
              aria-invalid={errors.category ? "true" : "false"}
              aria-describedby={errors.category ? "category-error" : undefined}
              {...register("category")}
              className={`${inputBase} ${errors.category ? inputInvalid : inputValid}`}
            >
              <option value="" disabled>
                Select a category
              </option>
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <FieldError id="category-error" message={errors.category?.message} />
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-semibold text-[#16231F]">
              How urgent is this?
              <span className="ml-0.5 text-[#B3261E]" aria-hidden="true">
                *
              </span>
            </span>
            <div
              role="radiogroup"
              aria-required="true"
              aria-invalid={errors.urgency ? "true" : "false"}
              aria-describedby={errors.urgency ? "urgency-error" : undefined}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >
              {URGENCY_LEVELS.map((level, index) => {
                const isChecked = urgency === level.value;
                return (
                  <label
                    key={level.value}
                    htmlFor={`urgency-${level.value}`}
                    className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors focus-within:ring-2 focus-within:ring-[#145850]/40 ${
                      isChecked
                        ? "border-[#145850] bg-[#EEF5F1]"
                        : "border-[#D8DED9] bg-white hover:border-[#B7C2BC]"
                    }`}
                  >
                    <input
                      id={`urgency-${level.value}`}
                      type="radio"
                      value={level.value}
                      {...register("urgency")}
                      className="sr-only"
                    />
                    <RippleIcon
                      rings={index + 1}
                      className={`h-8 w-8 ${
                        isChecked ? "text-[#145850]" : "text-[#8A968F]"
                      }`}
                    />
                    <span className="text-sm font-semibold text-[#16231F]">
                      {level.label}
                    </span>
                    <span className="text-[11px] leading-tight text-[#6E7A73]">
                      {level.hint}
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError id="urgency-error" message={errors.urgency?.message} />

            {urgency === "emergency" && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[#9A5B0A]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                For emergencies, please call {EMERGENCY_NUMBER} or the City
                Hotline directly — this form is not monitored in real time.
              </p>
            )}
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="description" required>
                Describe the issue
              </Label>
              <span
                className={`text-xs ${
                  description.length > 1000 ? "text-[#B3261E]" : "text-[#8A968F]"
                }`}
                aria-hidden="true"
              >
                {description.length}/1000
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              placeholder="What did you see? Include anything that would help a crew understand the problem."
              aria-required="true"
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
              {...register("description")}
              className={`${inputBase} resize-y ${
                errors.description ? inputInvalid : inputValid
              }`}
            />
            {!errors.description && (
              <p id="description-hint" className="mt-1.5 text-xs text-[#6E7A73]">
                Minimum 20 characters.
              </p>
            )}
            <FieldError id="description-error" message={errors.description?.message} />
          </div>
        </fieldset>

        {/* Section: Location */}
        <fieldset className="rounded-2xl border border-[#D8DED9] bg-white p-5 sm:p-6">
          <legend className="px-1 font-serif text-lg font-semibold text-[#0D3B36]">
            Where it's happening
          </legend>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="barangay" required>
                Barangay
              </Label>
              <select
                id="barangay"
                defaultValue=""
                aria-required="true"
                aria-invalid={errors.barangay ? "true" : "false"}
                aria-describedby={errors.barangay ? "barangay-error" : undefined}
                {...register("barangay")}
                className={`${inputBase} ${errors.barangay ? inputInvalid : inputValid}`}
              >
                <option value="" disabled>
                  Select your barangay
                </option>
                {SAN_PABLO_BARANGAYS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <FieldError id="barangay-error" message={errors.barangay?.message} />
            </div>

            <div>
              <Label htmlFor="landmark" required>
                Street / landmark
              </Label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A968F]"
                  aria-hidden="true"
                />
                <input
                  id="landmark"
                  type="text"
                  placeholder="Near Lake Sampaloc, in front of the chapel"
                  aria-required="true"
                  aria-invalid={errors.landmark ? "true" : "false"}
                  aria-describedby={errors.landmark ? "landmark-error" : undefined}
                  {...register("landmark")}
                  className={`${inputBase} pl-9 ${
                    errors.landmark ? inputInvalid : inputValid
                  }`}
                />
              </div>
              <FieldError id="landmark-error" message={errors.landmark?.message} />
            </div>
          </div>
        </fieldset>

        {/* Section: Photo evidence */}
        <fieldset className="rounded-2xl border border-[#D8DED9] bg-white p-5 sm:p-6">
          <legend className="px-1 font-serif text-lg font-semibold text-[#0D3B36]">
            Photo evidence{" "}
            <span className="font-sans text-sm font-normal text-[#6E7A73]">
              (optional)
            </span>
          </legend>

          {!photoPreview ? (
            <label
              htmlFor="photo"
              className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D8DED9] bg-[#FBFAF7] px-4 py-8 text-center transition-colors hover:border-[#145850]"
            >
              <Camera className="h-6 w-6 text-[#6E7A73]" aria-hidden="true" />
              <span className="text-sm font-medium text-[#16231F]">
                Tap to attach a photo
              </span>
              <span className="text-xs text-[#6E7A73]">
                JPG, PNG, or WEBP — up to 5MB
              </span>
              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-describedby={errors.photo ? "photo-error" : undefined}
                {...register("photo")}
                ref={(el) => {
                  register("photo").ref(el);
                  fileInputRef.current = el;
                }}
                onChange={(e) => {
                  register("photo").onChange(e);
                  handlePhotoChange(e);
                }}
                className="sr-only"
              />
            </label>
          ) : (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#D8DED9] bg-[#FBFAF7] p-3">
              <img
                src={photoPreview}
                alt="Preview of the attached photo evidence"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#16231F]">
                  Photo attached
                </p>
                <p className="text-xs text-[#6E7A73]">Ready to submit</p>
              </div>
              <button
                type="button"
                onClick={clearPhoto}
                aria-label="Remove attached photo"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6E7A73] hover:bg-white hover:text-[#B3261E] focus:outline-none focus:ring-2 focus:ring-[#145850]/40"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          <FieldError id="photo-error" message={errors.photo?.message} />
        </fieldset>

        {/* Consent + submit */}
        <div className="rounded-2xl border border-[#D8DED9] bg-white p-5 sm:p-6">
          <div className="flex items-start gap-2.5">
            <input
              id="consent"
              type="checkbox"
              aria-required="true"
              aria-invalid={errors.consent ? "true" : "false"}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              {...register("consent")}
              className="mt-0.5 h-4 w-4 rounded border-[#B7C2BC] text-[#145850] focus:ring-2 focus:ring-[#145850]/40"
            />
            <label htmlFor="consent" className="text-sm text-[#3C4A44]">
              I confirm this report is accurate to the best of my knowledge,
              and I understand the City may use this information to respond
              to the issue.
            </label>
          </div>
          <FieldError id="consent-error" message={errors.consent?.message} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#145850] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0D3B36] focus:outline-none focus:ring-2 focus:ring-[#145850]/40 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting report&hellip;
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
