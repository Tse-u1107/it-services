import './App.css';
import Main from './layout/main';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import HomeRoute from './routes/home/home';
import CategoryRoute from './routes/categories/category';
import GuideRoute from './routes/guides/guides';
import FaqRoute from './routes/faq';
import AboutRoute from './routes/about';
import TypesafeI18n from './i18n/i18n-react';
import CallbackRoute from './routes/callBack/callbackRoute';

function App() {
  return (
    <TypesafeI18n locale="en">
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </TypesafeI18n>
  );
}

function RouterContent() {

  return (
    <Main>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/categories" element={<CategoryRoute />} />
        <Route path="/guides/*" element={<GuideRoute />} />
        <Route path="/faq" element={<FaqRoute />} />
        <Route path="/about" element={<AboutRoute />} />

        <Route path="/callback" element={<CallbackRoute />} />
      </Routes>
    </Main>
  );
}


export default App;
