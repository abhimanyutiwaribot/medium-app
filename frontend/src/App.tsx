import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/sign-up'
import Signin from './pages/sign-in'
import Editor from './pages/editor'
import Article from './pages/article'
import type { JSX } from 'react'
import VersionHistoryPage from './pages/version-history'
import ArticleDiffPage from './pages/diff-history'
import HomePage from './pages/home'
import { Layout } from './components/layout'
import DraftsPage from './pages/draft-articles'
import ArticlePreviewPage from './pages/article-preview'
import Profile from './pages/profile'
import PublicProfile from './pages/public-profile'
import NotificationsPage from './pages/notifications'
import SettingsPage from './pages/settings'
import LandingPage from './pages/landing'
import { AuthProvider, useAuth } from './context/auth-context'
import { Toaster } from 'sonner'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          theme="light"
          toastOptions={{
            className: 'rounded-none border border-border shadow-2xl font-medium',
          }}
        />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/article/:id" element={<Article />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/:username" element={<PublicProfile />} />

          <Route
            path='/article/drafts'
            element={
              <ProtectedRoute>
                <DraftsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/article/:id/preview'
            element={
              <ProtectedRoute>
                <ArticlePreviewPage />
              </ProtectedRoute>
            }
          />

          <Route path="/editor" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } />

          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } />

          <Route path="/article/:id/vS" element={
            <ProtectedRoute>
              <VersionHistoryPage />
            </ProtectedRoute>
          } />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/article/:id/diff"
            element={
              <ProtectedRoute>
                <ArticleDiffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<RootRoute />}
          />

          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
