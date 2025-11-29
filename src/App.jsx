import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import Loader from "./components/Loader";

import Skillss from './components/Skillss';
import Experience from './components/Experience';
import Education from './components/Education';
import StarMovingEffect from './components/StarMovingEffect';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Show loader for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', zIndex: 9999, width: '100%', height: '100%' }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <StarMovingEffect />
          <NavBar />
          <Banner />
          <Skills />
          <Skillss />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </motion.div>
      )}
    </div>
  );
}

export default App;