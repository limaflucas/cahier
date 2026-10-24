import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import { FlagsProvider } from './flags.jsx';
import Home from './pages/Home.jsx';
import WordPage from './pages/WordPage.jsx';
import MyWords from './pages/MyWords.jsx';
import TempsVerbaux from './pages/TempsVerbaux.jsx';
import ConjugationSetup from './pages/ConjugationSetup.jsx';
import ConjugationGame from './pages/ConjugationGame.jsx';
import Memoir from './pages/Memoir.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlagsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mot/:word" element={<WordPage />} />
            <Route path="mes-mots" element={<MyWords />} />
            <Route path="conjugaison" element={<ConjugationSetup />} />
            <Route path="memoir" element={<Memoir />} />
          </Route>
          <Route element={<Layout wide />}>
            <Route path="temps-verbaux" element={<TempsVerbaux />} />
            <Route path="conjugaison/:verb" element={<ConjugationGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FlagsProvider>
  </StrictMode>,
);
