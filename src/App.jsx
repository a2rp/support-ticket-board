import { useEffect, useState } from "react"
import styles from "./App.module.css"
import Header from "./components/header"
import QueueSidebar from "./components/queueSidebar"
import TicketList from "./components/ticketList"
import { DEFAULT_TICKETS } from "./data/tickets"

const loadTickets = () => {
  try {
    const savedTickets = localStorage.getItem("harbor-support-tickets")
    return savedTickets ? JSON.parse(savedTickets) : DEFAULT_TICKETS
  } catch {
    return DEFAULT_TICKETS
  }
}

const isInQueue = (ticket, queue) => {
  if (queue === "assigned") return ticket.assignee === "You" && ticket.status !== "Resolved"
  if (queue === "unassigned") return !ticket.assignee && ticket.status !== "Resolved"
  if (queue === "waiting") return ticket.status === "Waiting on customer"
  if (queue === "urgent") return ticket.priority === "Urgent" && ticket.status !== "Resolved"
  if (queue === "resolved") return ticket.status === "Resolved"
  return ticket.status !== "Resolved"
}

const getQueueCounts = (tickets) => ({
  open: tickets.filter((ticket) => ticket.status !== "Resolved").length,
  assigned: tickets.filter((ticket) => isInQueue(ticket, "assigned")).length,
  unassigned: tickets.filter((ticket) => isInQueue(ticket, "unassigned")).length,
  waiting: tickets.filter((ticket) => isInQueue(ticket, "waiting")).length,
  urgent: tickets.filter((ticket) => isInQueue(ticket, "urgent")).length,
  resolved: tickets.filter((ticket) => isInQueue(ticket, "resolved")).length,
})

const App = () => {
  const [tickets] = useState(loadTickets)
  const [activeQueue, setActiveQueue] = useState("open")
  const [selectedTicketId, setSelectedTicketId] = useState("ST-3842")
  const [query, setQuery] = useState("")
  const counts = getQueueCounts(tickets)
  const filteredTickets = tickets
    .filter((ticket) => isInQueue(ticket, activeQueue))
    .filter((ticket) => {
      const searchText = [ticket.id, ticket.subject, ticket.customer, ticket.company].join(" ").toLowerCase()
      return searchText.includes(query.trim().toLowerCase())
    })
  const selectedTicket = filteredTickets.find((ticket) => ticket.id === selectedTicketId) ?? filteredTickets[0]

  useEffect(() => {
    localStorage.setItem("harbor-support-tickets", JSON.stringify(tickets))
  }, [tickets])

  return (
    <div className={styles.appShell} id="inbox">
      <Header />
      <main className={styles.pageContent}>
        <div className={styles.pageHeading}>
          <div>
            <h1>Support inbox</h1>
            <p>Keep customer questions, replies, and follow-ups in one place.</p>
          </div>
          <p className={styles.summaryText}>{counts.open} open tickets <span /> {counts.urgent} urgent</p>
        </div>
        <div className={styles.workspace}>
          <QueueSidebar activeQueue={activeQueue} counts={counts} onChange={setActiveQueue} />
          <TicketList
            activeQueue={activeQueue}
            onSearch={setQuery}
            onSelect={setSelectedTicketId}
            query={query}
            selectedTicketId={selectedTicket?.id}
            tickets={filteredTickets}
          />
          <section className={styles.detailPlaceholder} aria-label="Ticket details">
            {selectedTicket ? (
              <>
                <span>{selectedTicket.id}</span>
                <h2>{selectedTicket.subject}</h2>
                <p>Ticket conversation and reply tools will appear here.</p>
              </>
            ) : (
              <p>No ticket selected.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
