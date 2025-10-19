import './App.css';
import Main from './layout/main';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import HomeRoute from './routes/home';
import CategoryRoute from './routes/categories';
import GuideRoute from './routes/guides';
import FaqRoute from './routes/faq';
import AboutRoute from './routes/about';
import TypesafeI18n from './i18n/i18n-react';

function App() {
  return (
    <TypesafeI18n locale="en">
      <BrowserRouter>
        <Main>
          <Routes>
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeRoute />} />
            <Route path="/categories" element={<CategoryRoute />} />
            <Route path="/guides" element={<GuideRoute />} />
            <Route path="/faq" element={<FaqRoute />} />
            <Route path="/about" element={<AboutRoute />} />
          </Routes>
        </Main>
      </BrowserRouter>
    </TypesafeI18n>
  );
}

export default App;
