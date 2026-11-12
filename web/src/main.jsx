import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import { Flagged, FlagsProvider } from './flags.jsx';
import Home from './pages/Home.jsx';
import WordPage from './pages/WordPage.jsx';
import MyWords from './pages/MyWords.jsx';
import TempsVerbaux from './pages/TempsVerbaux.jsx';
import ConjugationSetup from './pages/ConjugationSetup.jsx';
import ConjugationGame from './pages/ConjugationGame.jsx';
import Memoir from './pages/Memoir.jsx';
import Rappel from './pages/Rappel.jsx';
import Constructions from './pages/Constructions.jsx';
import WordLists from './pages/WordLists.jsx';
import WordList from './pages/WordList.jsx';
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
            <Route path="sac-de-mots" element={<Flagged name="sac-de-mots"><WordLists /></Flagged>} />
            <Route path="sac-de-mots/:id" element={<Flagged name="sac-de-mots"><WordList /></Flagged>} />
            <Route path="conjugaison" element={<ConjugationSetup />} />
            <Route path="memoir" element={<Memoir />} />
            <Route path="rappel" element={<Flagged name="cahier-rappel"><Rappel /></Flagged>} />
            <Route path="constructions" element={<Flagged name="cahier-constructions"><Navigate to="/constructions/prepositions" replace /></Flagged>} />
            <Route path="constructions/:game" element={<Flagged name="cahier-constructions"><Constructions /></Flagged>} />
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
