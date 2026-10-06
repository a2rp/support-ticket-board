import { useState } from "react"
import { LuArrowUpRight, LuCheck, LuCornerDownLeft, LuMessageSquare, LuPaperclip, LuSend } from "react-icons/lu"
import { TEAM_MEMBERS, TICKET_PRIORITIES, TICKET_STATUSES } from "../../data/tickets"
import styles from "./styles.module.css"

const getInitials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("")

const TicketDetails = ({ onReply, onUpdate, ticket }) => {
  const [replyText, setReplyText] = useState("")
  const [isInternalNote, setIsInternalNote] = useState(false)
  const avatarUrl = ticket.avatar ? import.meta.env.BASE_URL + ticket.avatar : ""

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = replyText.trim()
    if (!text) return
    onReply(ticket.id, text, isInternalNote)
    setReplyText("")
    setIsInternalNote(false)
  }

  return (
    <section className={styles.ticketDetails} aria-label="Ticket conversation">
      <div className={styles.detailHeader}>
        <div className={styles.subjectBlock}>
          <div className={styles.ticketMeta}>
            <span>{ticket.id}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{ticket.category}</span>
          </div>
          <h2>{ticket.subject}</h2>
        </div>
        <span className={styles.statusBadge}>{ticket.status}</span>
      </div>

      <div className={styles.customerBlock}>
        {avatarUrl ? (
          <img className={styles.avatar} src={avatarUrl} alt="" />
        ) : (
          <span className={styles.initials} aria-hidden="true">{getInitials(ticket.customer)}</span>
        )}
        <div className={styles.customerInfo}>
          <strong>{ticket.customer}</strong>
          <span>{ticket.email}</span>
          <span>{ticket.company}</span>
        </div>
        <a className={styles.customerLink} href={"mailto:" + ticket.email} aria-label={"Email " + ticket.customer}>
          <LuArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div className={styles.ticketControls}>
        <label>
          Status
          <select
            value={ticket.status}
            onChange={(event) => onUpdate(ticket.id, { status: event.target.value })}
          >
            {TICKET_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label>
          Priority
          <select
            value={ticket.priority}
            onChange={(event) => onUpdate(ticket.id, { priority: event.target.value })}
          >
            {TICKET_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </label>
        <label>
          Assigned to
          <select
            value={ticket.assignee}
            onChange={(event) => onUpdate(ticket.id, { assignee: event.target.value })}
          >
            <option value="">Unassigned</option>
            {TEAM_MEMBERS.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.conversationHeading}>
        <h3>Conversation</h3>
        <span>{ticket.messages.length} messages</span>
      </div>

      <div className={styles.messages} aria-live="polite">
        {ticket.messages.map((message, index) => (
          <article
            className={styles.message + " " + (message.role === "agent" ? styles.agentMessage : "") + " " + (message.role === "note" ? styles.noteMessage : "")}
            key={ticket.id + "-" + index}
          >
            <div className={styles.messageHeader}>
              <strong>{message.role === "agent" || message.role === "note" ? "You" : message.sender}</strong>
              {message.role === "note" && <span className={styles.noteLabel}>Internal note</span>}
              <time>{message.time}</time>
            </div>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <form className={styles.replyForm} onSubmit={handleSubmit}>
        <div className={styles.replyModes} aria-label="Reply type">
          <button
            className={!isInternalNote ? styles.modeActive : ""}
            type="button"
            aria-pressed={!isInternalNote}
            onClick={() => setIsInternalNote(false)}
          >
            <LuMessageSquare aria-hidden="true" />
            Reply
          </button>
          <button
            className={isInternalNote ? styles.modeActive : ""}
            type="button"
            aria-pressed={isInternalNote}
            onClick={() => setIsInternalNote(true)}
          >
            <LuCornerDownLeft aria-hidden="true" />
            Internal note
          </button>
        </div>
        <label className={styles.visuallyHidden} htmlFor="ticket-reply">Write a reply</label>
        <textarea
          id="ticket-reply"
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
          placeholder={isInternalNote ? "Write a note for your team..." : "Write a reply to the customer..."}
          rows="3"
        />
        <div className={styles.composerFooter}>
          <span className={styles.replyHint}>
            {isInternalNote ? "Only your team can see this note." : "The customer will receive this reply."}
          </span>
          <div className={styles.composerActions}>
            <button className={styles.attachButton} type="button" aria-label="Attachments are not available in this demo" title="Attachments are not available in this demo" disabled>
              <LuPaperclip aria-hidden="true" />
            </button>
            <button className={styles.sendButton} type="submit" disabled={!replyText.trim()}>
              <LuSend aria-hidden="true" />
              {isInternalNote ? "Add note" : "Send reply"}
              <LuCheck className={styles.sentIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default TicketDetails
