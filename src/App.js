import logo from './logo.svg';
import './App.css';
import './firebase'
import { getDatabase, ref, onValue } from "firebase/database";


const db = getDatabase();
const data = ref(db, 'porta_fechada');
onValue(data, (snapshot) => {
  console.log(snapshot.val());
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Funciona me ajuda Deus aaaaaa
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
