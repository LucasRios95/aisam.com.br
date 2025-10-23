import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminVagas from './pages/Admin/Vagas';
import AdminAreas from './pages/Admin/Areas';
import AdminAssociados from './pages/Admin/Associados';
import AdminRecrutadores from './pages/Admin/Recrutadores';

// Recrutador Pages
import RecrutadorDashboard from './pages/Recrutador/Dashboard';
import RecrutadorVagas from './pages/Recrutador/Vagas';
import NovaVaga from './pages/Recrutador/NovaVaga';
import RecrutadorCandidaturas from './pages/Recrutador/Candidaturas';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* ===== Rotas Admin ===== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vagas"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
                <AdminVagas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/areas"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
                <AdminAreas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/associados"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
                <AdminAssociados />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recrutadores"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_AISAM']}>
                <AdminRecrutadores />
              </ProtectedRoute>
            }
          />

          {/* ===== Rotas Recrutador ===== */}
          <Route
            path="/recrutador"
            element={
              <ProtectedRoute allowedRoles={['RECRUTADOR']}>
                <RecrutadorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recrutador/vagas"
            element={
              <ProtectedRoute allowedRoles={['RECRUTADOR']}>
                <RecrutadorVagas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recrutador/vagas/nova"
            element={
              <ProtectedRoute allowedRoles={['RECRUTADOR']}>
                <NovaVaga />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recrutador/candidaturas"
            element={
              <ProtectedRoute allowedRoles={['RECRUTADOR']}>
                <RecrutadorCandidaturas />
              </ProtectedRoute>
            }
          />

          {/* Rotas futuras */}
          {/* <Route path="/admin/relatorios" element={...} /> */}
          {/* <Route path="/recrutador/vagas/:id" element={...} /> */}
          {/* <Route path="/recrutador/vagas/:id/editar" element={...} /> */}
          {/* <Route path="/candidato/*" element={<CandidatoLayout />} /> */}

          {/* Rota 404 - deve ser a última */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
