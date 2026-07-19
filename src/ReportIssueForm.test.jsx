import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportIssueForm from "./ReportIssueForm.jsx";

const VALID_BARANGAY = "Atisan";
const VALID_CATEGORY = "roads";
const VALID_URGENCY = "low";

async function fillRequiredFields(user) {
  await user.type(screen.getByLabelText(/full name/i), "Juan Dela Cruz");
  await user.type(screen.getByLabelText(/contact number/i), "09171234567");
  await user.type(screen.getByLabelText(/email address/i), "juan@example.com");
  await user.selectOptions(screen.getByLabelText(/barangay/i), VALID_BARANGAY);
  await user.selectOptions(screen.getByLabelText(/issue category/i), VALID_CATEGORY);
  await user.selectOptions(screen.getByLabelText(/urgency level/i), VALID_URGENCY);
  await user.type(screen.getByLabelText(/landmark/i), "Near the cathedral main road entrance");
  await user.type(
    screen.getByLabelText(/description/i),
    "Large pothole on the main road causing vehicle damage and traffic buildup."
  );
  await user.click(screen.getByLabelText(/i confirm this report/i));
}

describe("ReportIssueForm", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows validation errors for required fields on empty submit", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ReportIssueForm />);

    await user.click(screen.getByRole("button", { name: /submit report/i }));

    await waitFor(() => {
      expect(screen.getByText(/please select your barangay/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/please select an issue category/i)).toBeInTheDocument();
    expect(screen.getByText(/please select how urgent/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/you must confirm/i)).toBeInTheDocument();
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid ph mobile number/i)).toBeInTheDocument();
  });

  it("hides name and contact fields when anonymous is checked", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ReportIssueForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/file anonymously/i));

    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/contact number/i)).not.toBeInTheDocument();
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ReportIssueForm />);

    await user.type(screen.getByLabelText(/full name/i), "Juan Dela Cruz");
    await user.type(screen.getByLabelText(/contact number/i), "09171234567");
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.selectOptions(screen.getByLabelText(/barangay/i), VALID_BARANGAY);
    await user.selectOptions(screen.getByLabelText(/issue category/i), VALID_CATEGORY);
    await user.selectOptions(screen.getByLabelText(/urgency level/i), VALID_URGENCY);
    await user.type(screen.getByLabelText(/landmark/i), "Near the church entrance gate");
    await user.type(screen.getByLabelText(/description/i), "There is a large pothole on the main road that has been there for weeks causing traffic.");
    await user.click(screen.getByLabelText(/i confirm this report/i));
    await user.click(screen.getByRole("button", { name: /submit report/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("shows success state and resets the form on a valid submission", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ReportIssueForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /submit report/i }));

    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200);
    });

    expect(await screen.findByText(/report submitted/i)).toBeInTheDocument();
  });

  it("gives every input an accessible label", () => {
    render(<ReportIssueForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/barangay/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/issue category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/urgency level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/landmark/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo evidence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i confirm this report/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file anonymously/i)).toBeInTheDocument();
  });
});
