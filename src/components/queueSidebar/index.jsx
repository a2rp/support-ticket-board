import {
    LuCircleCheck,
    LuClock3,
    LuInbox,
    LuTriangleAlert,
    LuUserRound,
    LuUserX,
} from "react-icons/lu";
import { QUEUES } from "../../data/tickets";
import styles from "./styles.module.css";

const queueIcons = {
    open: LuInbox,
    assigned: LuUserRound,
    unassigned: LuUserX,
    waiting: LuClock3,
    urgent: LuTriangleAlert,
    resolved: LuCircleCheck,
};

const QueueSidebar = ({ activeQueue, counts, onChange }) => {
    return (
        <aside className={styles.queueSidebar} aria-label="Ticket queues">
            <h2 className={styles.title}>Queues</h2>
            <nav className={styles.queueList}>
                {QUEUES.map((queue) => {
                    const Icon = queueIcons[queue.id];
                    const isActive = queue.id === activeQueue;

                    return (
                        <button
                            key={queue.id}
                            className={
                                styles.queueButton +
                                " " +
                                (isActive ? styles.active : "")
                            }
                            type="button"
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => onChange(queue.id)}
                        >
                            <Icon
                                className={styles.queueIcon}
                                aria-hidden="true"
                            />
                            <span className={styles.queueName}>
                                {queue.label}
                            </span>
                            <span className={styles.count}>
                                {counts[queue.id] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </nav>
            <p className={styles.note}>Keep every conversation moving.</p>
        </aside>
    );
};

export default QueueSidebar;
