import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import CompanyList from './pages/CompanyList';
import CompanyDetail from './pages/CompanyDetail';
import Approvals from './pages/Approvals';
import Activities from './pages/Activities';
import PeopleList from './pages/PeopleList';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ContractList from './pages/ContractList';
import HolidayManager from './pages/HolidayManager';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/people" element={<PeopleList />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/holidays" element={<HolidayManager />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;