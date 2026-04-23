function Greeting({ name }) {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })
  const localizedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const moodLine =
    hour < 12
      ? 'A fresh start is a powerful advantage.'
      : hour < 18
        ? 'You are in the middle of your strongest hours.'
        : 'Wind down with intention and a grateful mindset.'

  return (
    <header>
      <p className="greeting-label">{dayOfWeek}</p>
      <div className="greeting-block">
        <h1>
          {greeting}, {name}
        </h1>
      </div>
      <p className="date-time">Current time: {localizedTime}</p>
      <p className="hour-line">Current hour: {hour}:00</p>
      <p className="mood-line">{moodLine}</p>
    </header>
  )
}

export default Greeting
