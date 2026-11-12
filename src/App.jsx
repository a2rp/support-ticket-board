import { useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";
import AppFooter from "./components/appFooter";
import BackToTop from "./components/backToTop";
import CreateTicketModal from "./components/createTicketModal";
import Header from "./components/header";
import QueueSidebar from "./components/queueSidebar";
import TicketDetails from "./components/ticketDetails";
import TicketList from "./components/ticketList";
import { DEFAULT_TICKETS, TICKET_PRIORITIES, TICKET_STATUSES } from "./data/tickets";

const isValidTicket = (ticket) =>
    ticket &&
    typeof ticket === "object" &&
    typeof ticket.id === "string" &&
    ticket.id.length > 0 &&
    typeof ticket.subject === "string" &&
    typeof ticket.customer === "string" &&
    typeof ticket.email === "string" &&
    typeof ticket.company === "string" &&
    typeof ticket.category === "string" &&
    TICKET_STATUSES.includes(ticket.status) &&
    TICKET_PRIORITIES.includes(ticket.priority) &&
    typeof ticket.assignee === "string" &&
    !Number.isNaN(Date.parse(ticket.updatedAt)) &&
    Array.isArray(ticket.messages) &&
    ticket.messages.every(
        (message) =>
            message &&
            typeof message.sender === "string" &&
            ["customer", "agent", "note"].includes(message.role) &&
            typeof message.time === "string" &&
            typeof message.text === "string",
    );

const loadTickets = () => {
    try {
        const savedTickets = localStorage.getItem("harbor-support-tickets");
        if (!savedTickets) return DEFAULT_TICKETS;

        const parsed = JSON.parse(savedTickets);
        if (!Array.isArray(parsed) || !parsed.every(isValidTicket)) {
            return DEFAULT_TICKETS;
        }
        const ids = parsed.map((ticket) => ticket.id);
        return new Set(ids).size === ids.length ? parsed : DEFAULT_TICKETS;
    } catch {
        return DEFAULT_TICKETS;
    }
};

const isInQueue = (ticket, queue) => {
    if (queue === "assigned")
        return ticket.assignee === "You" && ticket.status !== "Resolved";
    if (queue === "unassigned")
        return !ticket.assignee && ticket.status !== "Resolved";
    if (queue === "waiting") return ticket.status === "Waiting on customer";
    if (queue === "urgent")
        return ticket.priority === "Urgent" && ticket.status !== "Resolved";
    if (queue === "resolved") return ticket.status === "Resolved";
    return ticket.status !== "Resolved";
};

const getQueueCounts = (tickets) => ({
    open: tickets.filter((ticket) => ticket.status !== "Resolved").length,
    assigned: tickets.filter((ticket) => isInQueue(ticket, "assigned")).length,
    unassigned: tickets.filter((ticket) => isInQueue(ticket, "unassigned"))
        .length,
    waiting: tickets.filter((ticket) => isInQueue(ticket, "waiting")).length,
    urgent: tickets.filter((ticket) => isInQueue(ticket, "urgent")).length,
    resolved: tickets.filter((ticket) => isInQueue(ticket, "resolved")).length,
});

const getNextTicketId = (tickets) => {
    const highestNumber = tickets.reduce((highest, ticket) => {
        const match = /^ST-(\d+)$/.exec(ticket.id);
        return match ? Math.max(highest, Number(match[1])) : highest;
    }, 3842);
    return `ST-${highestNumber + 1}`;
};

const App = () => {
    const [tickets, setTickets] = useState(loadTickets);
    const [activeQueue, setActiveQueue] = useState("open");
    const [selectedTicketId, setSelectedTicketId] = useState("ST-3842");
    const [query, setQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const counts = getQueueCounts(tickets);
    const filteredTickets = tickets
        .filter((ticket) => isInQueue(ticket, activeQueue))
        .filter((ticket) => {
            const searchText = [
                ticket.id,
                ticket.subject,
                ticket.customer,
                ticket.company,
            ]
                .join(" ")
                .toLowerCase();
            return searchText.includes(query.trim().toLowerCase());
        });
    const selectedTicket =
        filteredTickets.find((ticket) => ticket.id === selectedTicketId) ??
        filteredTickets[0];

    useEffect(() => {
        try {
            localStorage.setItem(
                "harbor-support-tickets",
                JSON.stringify(tickets),
            );
        } catch {
            return;
        }
    }, [tickets]);

    const closeCreateModal = useCallback(() => setIsCreateOpen(false), []);

    const updateTicket = (ticketId, updates) => {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === ticketId
                    ? {
                          ...ticket,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                      }
                    : ticket,
            ),
        );
    };

    const addReply = (ticketId, text, isInternalNote) => {
        const time =
            "Today, " +
            new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            });
        setTickets((currentTickets) =>
            currentTickets.map((ticket) => {
                if (ticket.id !== ticketId) return ticket;
                return {
                    ...ticket,
                    status: isInternalNote ? ticket.status : "Open",
                    updatedAt: new Date().toISOString(),
                    messages: [
                        ...ticket.messages,
                        {
                            sender: "You",
                            role: isInternalNote ? "note" : "agent",
                            time,
                            text,
                        },
                    ],
                };
            }),
        );
    };

    const createTicket = (ticket) => {
        const newTicket = { ...ticket, id: getNextTicketId(tickets) };
        setTickets((currentTickets) => [newTicket, ...currentTickets]);
        setSelectedTicketId(newTicket.id);
        setActiveQueue("open");
        setQuery("");
        setIsCreateOpen(false);
    };

    return (
        <div className={styles.appShell} id="inbox">
            <Header onCreateTicket={() => setIsCreateOpen(true)} />
            <main className={styles.pageContent}>
                <div className={styles.pageHeading}>
                    <div>
                        <h1>Support inbox</h1>
                        <p>
                            Keep customer questions, replies, and follow-ups in
                            one place.
                        </p>
                    </div>
                    <p className={styles.summaryText}>
                        {counts.open} open tickets <span /> {counts.urgent}{" "}
                        urgent
                    </p>
                </div>
                <div className={styles.workspace}>
                    <QueueSidebar
                        activeQueue={activeQueue}
                        counts={counts}
                        onChange={setActiveQueue}
                    />
                    <TicketList
                        activeQueue={activeQueue}
                        onSearch={setQuery}
                        onSelect={setSelectedTicketId}
                        query={query}
                        selectedTicketId={selectedTicket?.id}
                        tickets={filteredTickets}
                    />
                    {selectedTicket ? (
                        <TicketDetails
                            key={selectedTicket.id}
                            ticket={selectedTicket}
                            onUpdate={updateTicket}
                            onReply={addReply}
                        />
                    ) : (
                        <section className={styles.noSelection}>
                            <h2>No ticket in this view</h2>
                            <p>
                                Choose another queue or update your search to
                                see a conversation.
                            </p>
                        </section>
                    )}
                </div>
            </main>
            <AppFooter />
            <BackToTop />
            {isCreateOpen && (
                <CreateTicketModal
                    onClose={closeCreateModal}
                    onCreate={createTicket}
                />
            )}
        </div>
    );
};

export default App;
