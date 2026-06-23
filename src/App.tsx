import { HomeComponent } from './Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { RegistrationComponent } from './Registration';

function App(){
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeComponent/>} />
          <Route path="/register" element={<RegistrationComponent/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;