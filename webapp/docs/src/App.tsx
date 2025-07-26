import { Route, Routes } from 'react-router-dom';
import Docs from './components/Docs';
import Documentation from './components/Documentation';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function App() {
  return (
    <Routes>
      <Route index element={<Docs />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
    </Routes>
  );
}

export default App;
