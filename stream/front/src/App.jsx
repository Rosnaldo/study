import streamSaver from 'streamsaver'

function App() {
  const handle = async () => {
    const response = await fetch('http://localhost:3000/stream3')
    response.body.pipeTo(streamSaver.createWriteStream('example.txt'))
  }

  return (
    <div className="App">
      <button onClick={handle}>gerar</button>
    </div>
  )
}

export default App
