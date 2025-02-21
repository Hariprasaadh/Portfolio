import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";

import Skillss from './components/Skillss';
import Experience from './components/Experience';
import Education from './components/Education';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Skills />
      <Skillss />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      
    </div>
  );
}

export default App;
