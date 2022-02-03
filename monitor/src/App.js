import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import './firebase';
import firebase from "firebase/compat/app"
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  var [loading, setLoading] = useState(true);
  var [temperatura, setTemperatura] = useState([]);
  var [umidade, setUmidade] = useState([]);
  var [porta, setPorta] = useState(false);
  var [maxtempstate, setMaxtempstate] = useState([]);
  var [novaTemp, setNovaTemp] = useState([]);

  const db = getDatabase();
  
  const getTemperatura = () => {
    console.log("\tEntrou em getTemperatura");
    var data = ref(db, 'temperatura');
    onValue(data, (snapshot) => {
      setTemperatura(snapshot.val())
      console.log('\tTemperatura: ' + snapshot.val( ))
    });
  }

  const getUmidade = () => {
    var data = ref(db, 'umidade');
    onValue(data, (snapshot) => {
      setUmidade(snapshot.val())
    });
  }

  const getPorta = () => {
    var data = ref(db, 'porta_fechada');
    onValue(data, (snapshot) => {
      setPorta(snapshot.val());
      //setLoading(false);
    });
  }

  const getMaxTemp = () => {
    var data = ref(db, 'max_temp');
    onValue(data, (snapshot) => {
      setMaxtempstate(snapshot.val());
      setLoading(false);
    });
  }

  const setMaxTemp = (nova_temp) => {
    set(ref(db, 'max_temp'), nova_temp);
  }

  const handleSubmit = (event) => {
    //event.preventDefault();
    setMaxTemp(parseFloat(novaTemp));
  }

  useEffect(() => {
    getTemperatura();
    getUmidade();
    getPorta();
    getMaxTemp();
  }, []);


  if(loading === true)
    return <h1>Carregando...</h1>

  else if (loading === false)
    return (
      <><div className="App">
        Carregado.
        <p>{temperatura}</p>
        <p>{umidade}</p>
        <p>{maxtempstate}</p>
        {porta ? (
          <p>Fechada</p>)
          :
          (<p>Aberta</p>
          )}
      </div>
      <div>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label>
                <p>Temperatura máxima</p>
                <input 
                  type='number' step='0.1'
                  value={novaTemp} 
                  onChange={(e) => setNovaTemp(e.target.value)}
                  />
              </label>
            </fieldset>
            <button type="submit">Enviar</button>
          </form>
          </div>
          </>
  );
}

export default App;
