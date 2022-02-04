import React, { useEffect, useLayoutEffect, useState } from "react";
import './App.css';
import './firebase';
import { getDatabase, ref, onValue, set } from "firebase/database";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';

function App() {
  var [loading, setLoading] = useState(true);
  var [temperatura, setTemperatura] = useState([]);
  var [umidade, setUmidade] = useState([]);
  var [porta, setPorta] = useState(false);
  var [maxTempState, setMaxTempState] = useState([]);
  var [minTempState, setMinTempState] = useState([]);
  var [maxTempAviso, setMaxTempAviso] = useState(false);
  var [minTempAviso, setMinTempAviso] = useState(false);
  var [iminenteMaxAviso, setIminenteMaxAviso] = useState(false);
  var [iminenteMinAviso, setIminenteMinAviso] = useState(false);
  var [isOn, setIsOn] = useState(false); //Verifica se app está rodando
  var [isOptionSelected, setIsOptionSelected] = useState(false); //Verifica se opção de preset foi selecionada
  var [timer, setTimer] = useState(false);

  const db = getDatabase();

  const getIsOn = () => {
    var data = ref(db, 'monitoramento_ativo');
    onValue(data, (snapshot) => {
      setIsOn(snapshot.val())
    });
  }

  const getTemperatura = () => {
    var data = ref(db, 'temperatura');
    onValue(data, (snapshot) => {
      setTemperatura(snapshot.val())
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
      setLoading(false);
    });
  }

  const [preset, setPreset] = useState([]);
  const handlePreset = (event) => {
    setPreset(event.target.value)
    setIsOptionSelected(true);
  }

  var minTemp, maxTemp;
  const setMinTemp = (min) => {
    minTemp = min;
    setMinTempState(min);
  }

  const setMaxTemp = (max) => {
    maxTemp = max;
    setMaxTempState(max);
  }

  var timer;

  const handleIniciar = () => {
    if (isOptionSelected) {
      //Atualizando temperaturas mínima e máxima
      if (preset === 1) {
        setMinTemp(65);
        set(ref(db, 'min_temp'), minTemp);

        setMaxTemp(150);
        set(ref(db, 'max_temp'), maxTemp);
      }
      if (preset === 2) {
        setMinTemp(6);
        set(ref(db, 'min_temp'), minTemp);

        setMaxTemp(10);
        set(ref(db, 'max_temp'), maxTemp);
      }
      if (preset === 3) {
        setMinTemp(4);
        set(ref(db, 'min_temp'), minTemp);

        setMaxTemp(6);
        set(ref(db, 'max_temp'), maxTemp);
      }
      if (preset === 4) {
        setMinTemp(-18);
        set(ref(db, 'min_temp'), minTemp);

        setMaxTemp(-15);
        set(ref(db, 'max_temp'), maxTemp);
      }
      //Altera estado do monitoramento para ativo
      set(ref(db, 'monitoramento_ativo'), true);
      setIsOn(true);

      timer = setInterval(alertas(), 10000);
    }
  }

  const handleEncerrar = () => {
    set(ref(db, 'monitoramento_ativo'), false);
    setIsOn(false);
    clearInterval(timer);
    setIminenteMaxAviso(false);
    setIminenteMinAviso(false);
    setMaxTempAviso(false);
    setMinTempAviso(false);
  }

  const handleCloseMin = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMinTempAviso(false);
  };

  const handleCloseMax = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMaxTempAviso(false);
  };

  const handleCloseIMin = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIminenteMinAviso(false);
  };

  const handleCloseIMax = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIminenteMaxAviso(false);
  };

  const alertas = () => {
    console.log(maxTemp, minTemp + ' tá indo');
    //Temperatura máxima
    if (temperatura === maxTemp - 1) {

      //Emite alerta que temperatura está próxima de atingir o máximo
      setIminenteMaxAviso(true)
    }
    else if (temperatura >= maxTemp) {
      //Emite alerta de temperatura máxima atingida
      setMaxTempAviso(true)
    }
    //Temperatura mínima
    else if (temperatura === minTemp + 1) {
      //Emite alerta que temperatura está próxima de atingir o mínimo
      setIminenteMaxAviso(true)
    }
    else if (temperatura <= minTemp) {
      //Emite alerta de temperatura mínima atingida
      setMinTempAviso(true);
    }
  }

  useEffect(() => {
    getIsOn();
    getTemperatura();
    getUmidade();
    getPorta();
    alertas();
  }, []);


  if (loading === true)
    return <h1>Carregando...</h1>

  else if (loading === false) {
    if (!isOn) {
      return (
        <>
          <div className="container">
            <div className="header">
              <h2>Bem-vindo!</h2>
            </div>
            <div>
              Selecione o padrão:
            </div>
            <div className="form-container">
              <FormControl fullWidth>
                <InputLabel id="form-preset">Selecione um padrão...</InputLabel>
                <Select
                  labelId="form-preset"
                  id="form-preset"
                  value={preset}
                  variant="filled"
                  onChange={handlePreset}
                >
                  <MenuItem value={1}>Quente (&gt; 65°C)</MenuItem>
                  <MenuItem value={2}>Resfriado (&gt; 6°C, &lt; 10°C)</MenuItem>
                  <MenuItem value={3}>Refrigerado (&gt; 4°C, &lt; 6°C)</MenuItem>
                  <MenuItem value={4}>Congelado (&gt; -18°C, &lt; -15°C)</MenuItem>
                </Select>
                <div className="iniciar" onClick={handleIniciar} style={{ opacity: isOptionSelected ? '100%' : '20%' }}>
                  INICIAR
                </div>
              </FormControl>
            </div>
          </div>
        </>
      );
    }
    else if (isOn) {
      return (
        <>
          <div className="box-container">
            <div className="box">
              <span className="box-title">Temperatura (°C)</span>
              <span className="box-info">{temperatura}</span>
            </div>
            <div className="box">
              <span className="box-title">Umidade (%)</span>
              <span className="box-info">{umidade}</span>
            </div>
            <div className="encerrar" onClick={handleEncerrar}>
              ENCERRAR
            </div>
          </div>
          <Snackbar open={maxTempAviso} onClose={handleCloseMax}>
            <Alert onClose={handleCloseMax} severity="error" variant="filled" sx={{ width: '100%' }}>
              TEMPERATURA MÁXIMA ATINGIDA!
            </Alert>
          </Snackbar>

          <Snackbar open={minTempAviso} onClose={handleCloseMin}>
            <Alert onClose={handleCloseMin} severity="error" variant="filled" sx={{ width: '100%' }}>
              TEMPERATURA MÍNIMA ATINGIDA!
            </Alert>
          </Snackbar>

          <Snackbar open={iminenteMaxAviso} onClose={handleCloseIMax}>
            <Alert onClose={handleCloseIMax} severity="warning" variant="filled" sx={{ width: '100%' }}>
              ATENÇÃO! Temperatura está EM ALTA!
            </Alert>
          </Snackbar>

          <Snackbar open={iminenteMinAviso} onClose={handleCloseIMin}>
            <Alert onClose={handleCloseIMin} severity="warning" variant="filled" sx={{ width: '100%' }}>
              ATENÇÃO! Temperatura está EM QUEDA!
            </Alert>
          </Snackbar>
        </>
      )
    }
  }
}

export default App;
