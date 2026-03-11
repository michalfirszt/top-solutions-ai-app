import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SolutionCreatePage } from './pages/SolutionCreatePage'
import { SolutionDetailsPage } from './pages/SolutionDetailsPage'
import { SolutionEditPage } from './pages/SolutionEditPage'
import { SolutionsListPage } from './pages/SolutionsListPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<SolutionsListPage />} />
          <Route path="/solutions/new" element={<SolutionCreatePage />} />
          <Route path="/solutions/:id" element={<SolutionDetailsPage />} />
          <Route path="/solutions/:id/edit" element={<SolutionEditPage />} />
        </Route>
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
