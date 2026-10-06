import { useEffect, useRef, useState } from "react"
import { LuX } from "react-icons/lu"
import { TICKET_PRIORITIES } from "../../data/tickets"
import styles from "./styles.module.css"

const CreateTicketModal = ({ onClose, onCreate }) => {
  const modalRef = useRef(null)
  const subjectRef = useRef(null)
  const [priority, setPriority] = useState("Normal")

  useEffect(() => {
    const previousFocus = document.activeElement
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
        return
      }

      if (event.key !== "Tab") return
      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
      )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    subjectRef.current?.focus()
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const customer = formData.get("customer").trim()
    const subject = formData.get("subject").trim()
    const now = new Date()

    onCreate({
      id: "ST-" + String(Date.now()).slice(-4),
      subject,
      customer,
      email: formData.get("email").trim(),
      company: formData.get("company").trim() || "Independent",
      avatar: "",
      category: formData.get("category"),
      status: "Open",
      priority,
      assignee: "",
      updatedAt: now.toISOString(),
      messages: [
        {
          sender: customer,
          role: "customer",
          time: "Just now",
          text: formData.get("description").trim(),
        },
      ],
    })
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
        aria-describedby="create-ticket-description"
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="create-ticket-title">Create a ticket</h2>
            <p id="create-ticket-description">Add a customer request to the inbox.</p>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close dialog">
            <LuX aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className={styles.fullField}>
            Subject
            <input ref={subjectRef} name="subject" required maxLength="120" placeholder="What does the customer need help with?" />
          </label>
          <div className={styles.formRow}>
            <label>
              Customer name
              <input name="customer" required maxLength="80" placeholder="Name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required maxLength="120" placeholder="name@example.com" />
            </label>
          </div>
          <div className={styles.formRow}>
            <label>
              Company
              <input name="company" maxLength="80" placeholder="Optional" />
            </label>
            <label>
              Category
              <select name="category" defaultValue="General question">
                <option>General question</option>
                <option>Billing</option>
                <option>Account access</option>
                <option>Bug report</option>
                <option>Plan changes</option>
                <option>Getting started</option>
              </select>
            </label>
          </div>
          <label className={styles.fullField}>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              {TICKET_PRIORITIES.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className={styles.fullField}>
            Customer message
            <textarea name="description" required maxLength="1200" rows="4" placeholder="Describe the request..." />
          </label>
          <div className={styles.formFooter}>
            <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
            <button className={styles.createButton} type="submit">Create ticket</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CreateTicketModal
