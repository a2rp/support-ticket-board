import { useMemo, useState } from "react"
import styles from "./App.module.css"
import Header from "./components/header"
import QueueSidebar from "./components/queueSidebar"
import { DEFAULT_TICKETS } from "./data/tickets"

const getQueueCounts = (tickets) => ({
  open: tickets.filter((ticket) => ticket.status !== "Resolved").length,
  assigned: tickets.filter((ticket) => ticket.assignee === "You" && ticket.status !== "Resolved").length,
  unassigned: tickets.filter((ticket) => !ticket.assignee && ticket.status !== "Resolved").length,
  waiting: tickets.filter((ticket) => ticket.status === "Waiting on customer").length,
  urgent: tickets.filter((ticket) => ticket.priority === "Urgent" && ticket.status !== "Resolved").length,
  resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
})

const App = () => {
  const [activeQueue, setActiveQueue] = useState("open")
  const counts = useMemo(() => getQueueCounts(DEFAULT_TICKETS), [])

  return (
    <div className={styles.appShell} id="inbox">
      <Header />
      <main className={styles.pageContent}>
        <QueueSidebar activeQueue={activeQueue} counts={counts} onChange={setActiveQueue} />
        <section className={styles.emptyMessage}>
          <h1>Your {activeQueue === "open" ? "open" : activeQueue} tickets</h1>
          <p>{counts[activeQueue]} conversations in this queue.</p>
        </section>
      </main>
    </div>
  )
}

export default App
