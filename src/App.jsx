import { useCallback, useEffect, useState } from "react"
import styles from "./App.module.css"
import CreateTicketModal from "./components/createTicketModal"
import Header from "./components/header"
import QueueSidebar from "./components/queueSidebar"
import TicketDetails from "./components/ticketDetails"
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
  const [tickets, setTickets] = useState(loadTickets)
  const [activeQueue, setActiveQueue] = useState("open")
  const [selectedTicketId, setSelectedTicketId] = useState("ST-3842")
  const [query, setQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const counts = getQueueCounts(tickets)
  const filteredTickets = tickets
    .filter((ticket) => isInQueue(ticket, activeQueue))
    .filter((ticket) => {
      const searchText = [ticket.id, ticket.subject, ticket.customer, ticket.company].join(" ").toLowerCase()
      return searchText.includes(query.trim().toLowerCase())
    })
  const selectedTicket = filteredTickets.find((ticket) => ticket.id === selectedTicketId) ?? filteredTickets[0]

  useEffect(() => {
    try {
      localStorage.setItem("harbor-support-tickets", JSON.stringify(tickets))
    } catch {
      return
    }
  }, [tickets])

  const closeCreateModal = useCallback(() => setIsCreateOpen(false), [])

  const updateTicket = (ticketId, updates) => {
    setTickets((currentTickets) => currentTickets.map((ticket) => (
      ticket.id === ticketId
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    )))
  }

  const addReply = (ticketId, text, isInternalNote) => {
    const time = "Today, " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    setTickets((currentTickets) => currentTickets.map((ticket) => {
      if (ticket.id !== ticketId) return ticket
      return {
        ...ticket,
        status: isInternalNote ? ticket.status : "Open",
        updatedAt: new Date().toISOString(),
        messages: [
          ...ticket.messages,
          { sender: "You", role: isInternalNote ? "note" : "agent", time, text },
        ],
      }
    }))
  }

  const createTicket = (ticket) => {
    setTickets((currentTickets) => [ticket, ...currentTickets])
    setSelectedTicketId(ticket.id)
    setActiveQueue("open")
    setQuery("")
    setIsCreateOpen(false)
  }

  return (
    <div className={styles.appShell} id="inbox">
      <Header onCreateTicket={() => setIsCreateOpen(true)} />
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
          {selectedTicket ? (
            <TicketDetails ticket={selectedTicket} onUpdate={updateTicket} onReply={addReply} />
          ) : (
            <section className={styles.noSelection}>
              <h2>No ticket in this view</h2>
              <p>Choose another queue or update your search to see a conversation.</p>
            </section>
          )}
        </div>
      </main>
      {isCreateOpen && (
        <CreateTicketModal onClose={closeCreateModal} onCreate={createTicket} />
      )}
    </div>
  )
}

export default App
