import { LuSearch } from "react-icons/lu"
import { QUEUES } from "../../data/tickets"
import styles from "./styles.module.css"

const formatUpdateTime = (value) => {
  const updatedAt = new Date(value)
  const now = new Date()
  const dayGap = Math.floor((new Date(now.toDateString()) - new Date(updatedAt.toDateString())) / 86400000)
  const time = updatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

  if (dayGap === 0) return "Today, " + time
  if (dayGap === 1) return "Yesterday, " + time
  return updatedAt.toLocaleDateString([], { month: "short", day: "numeric" }) + ", " + time
}

const getInitials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("")

const TicketList = ({
  activeQueue,
  onSearch,
  onSelect,
  query,
  selectedTicketId,
  tickets,
}) => {
  const queueName = QUEUES.find((queue) => queue.id === activeQueue)?.label ?? "Tickets"

  return (
    <section className={styles.ticketList} aria-labelledby="ticket-list-title">
      <div className={styles.listHeader}>
        <div className={styles.headingRow}>
          <h2 id="ticket-list-title">{queueName}</h2>
          <span className={styles.ticketCount}>{tickets.length}</span>
        </div>
        <label className={styles.searchBox}>
          <LuSearch aria-hidden="true" />
          <span className={styles.visuallyHidden}>Search tickets</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search tickets"
          />
          {query && (
            <button type="button" onClick={() => onSearch("")} aria-label="Clear search">
              Clear
            </button>
          )}
        </label>
      </div>

      <div className={styles.ticketItems} role="list">
        {tickets.map((ticket) => {
          const isSelected = ticket.id === selectedTicketId
          const avatarUrl = ticket.avatar ? import.meta.env.BASE_URL + ticket.avatar : ""

          return (
            <button
              key={ticket.id}
              className={styles.ticketCard + " " + (isSelected ? styles.selected : "")}
              type="button"
              role="listitem"
              aria-current={isSelected ? "true" : undefined}
              onClick={() => onSelect(ticket.id)}
            >
              <span className={styles.ticketTopline}>
                <span className={styles.ticketId}>{ticket.id}</span>
                <span className={styles.updatedAt}>{formatUpdateTime(ticket.updatedAt)}</span>
              </span>
              <span className={styles.subject}>{ticket.subject}</span>
              <span className={styles.customerRow}>
                {avatarUrl ? (
                  <img className={styles.avatar} src={avatarUrl} alt="" />
                ) : (
                  <span className={styles.initials} aria-hidden="true">{getInitials(ticket.customer)}</span>
                )}
                <span className={styles.customerInfo}>
                  <span className={styles.customerName}>{ticket.customer}</span>
                  <span className={styles.company}>{ticket.company}</span>
                </span>
              </span>
              <span className={styles.ticketFooter}>
                <span className={styles.status}>{ticket.status}</span>
                <span className={styles.priority + " " + styles[ticket.priority.toLowerCase()]}>
                  {ticket.priority}
                </span>
              </span>
            </button>
          )
        })}
        {tickets.length === 0 && (
          <div className={styles.emptyState}>
            <p>No tickets match this view.</p>
            <span>Try another queue or clear your search.</span>
          </div>
        )}
      </div>
    </section>
  )
}

export default TicketList
