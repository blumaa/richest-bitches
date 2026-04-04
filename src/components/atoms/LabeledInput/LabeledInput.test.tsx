import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LabeledInput } from "./LabeledInput";

describe("LabeledInput", () => {
  const defaultProps = {
    id: "test-input",
    label: "Test Label",
    type: "text" as const,
    value: "",
    onChange: vi.fn(),
  };

  it("renders label associated with input via htmlFor", () => {
    render(<LabeledInput {...defaultProps} />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("displays error message when error prop is set", () => {
    render(<LabeledInput {...defaultProps} error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets aria-invalid when error is present", () => {
    render(<LabeledInput {...defaultProps} error="Bad input" />);
    expect(screen.getByLabelText("Test Label")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-describedby pointing to error element", () => {
    render(<LabeledInput {...defaultProps} error="Bad input" />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveAttribute("aria-describedby", "test-input-error");
  });

  it("calls onChange with new value on user input", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LabeledInput {...defaultProps} onChange={onChange} />);
    await user.type(screen.getByLabelText("Test Label"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("respects disabled attribute", () => {
    render(<LabeledInput {...defaultProps} disabled />);
    expect(screen.getByLabelText("Test Label")).toBeDisabled();
  });

  it("respects maxLength attribute", () => {
    render(<LabeledInput {...defaultProps} maxLength={10} />);
    expect(screen.getByLabelText("Test Label")).toHaveAttribute("maxLength", "10");
  });
});
