import styles from "./App.module.css"
import Header from "./components/header"

const App = () => {
  return (
    <div className={styles.appShell} id="inbox">
      <Header />
      <main className={styles.pageContent}>
        <h1>A calmer way to handle customer questions.</h1>
        <p>Your support inbox is taking shape.</p>
      </main>
    </div>
  )
}

export default App
