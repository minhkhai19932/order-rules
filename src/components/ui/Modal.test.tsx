import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "../../test/render";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render when open=true", () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should not render when open=false", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open={false} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it("should call onClose on Escape key", () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose on backdrop click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const backdrop = screen.getByRole("dialog");
    expect(backdrop).toBeInTheDocument();

    // Click on the backdrop (the dialog element itself)
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when clicking inside modal content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        <div data-testid="modal-content">Modal content</div>
      </Modal>
    );

    const content = screen.getByTestId("modal-content");
    await user.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });
});

