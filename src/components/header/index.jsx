import { LuArrowUpRight, LuLifeBuoy } from "react-icons/lu"
import styles from "./styles.module.css"

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#inbox" aria-label="Harbor support desk home">
          <span className={styles.brandIcon} aria-hidden="true">
            <LuLifeBuoy />
          </span>
          <span className={styles.brandName}>harbor</span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.brandLabel}>Support desk</span>
        </a>
        <a
          className={styles.repository}
          href="https://github.com/a2rp/support-ticket-board"
          target="_blank"
          rel="noreferrer"
        >
          <span>Repository</span>
          <LuArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}

export default Header
