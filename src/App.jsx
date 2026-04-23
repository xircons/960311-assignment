import './App.css'
import Greeting from './Greeting'

function App() {
  const tips = [
    'Take one small action before aiming for perfect results.',
    'Focus on progress, not pressure.',
    'Pause, breathe, and restart with clarity when stuck.',
    'Protect your energy by finishing one task at a time.',
  ]

  return (
    <main className="page">
      <section className="card">
        <Greeting name="Wuttikan" />

        <div className="tips-block">
          <h2>Motivational Tips</h2>
          <ul className="tips-list">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default App
