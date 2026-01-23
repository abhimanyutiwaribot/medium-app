import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import { apifetch } from './api/client'
import './App.css'
import Signup from './pages/sign-up'
import Signin from './pages/sign-in'
import Editor from './pages/editor'
import Article from './pages/article'
import type { JSX } from 'react'
import VersionHistoryPage from './pages/version-history'
import ArticleDiffPage from './pages/diff-history'
import HomePage from './pages/home'
import ArticleVersion from './pages/article-version'
import { Layout } from './components/layout'
import DraftsPage from './pages/draft-articles'
import ArticlePreviewPage from './pages/article-preview'
// import ArticleDiffPage from './components/diff/diff-function'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} /> {/* the signup page */}
          <Route path="/signin" element={<Signin />} />  {/* the signin page */}

          <Route path="/article/:id"
            element={
              <Article />
            } /> {/* the article renderer page based on articleId */}

          {/* <Route 
            path="/article/:id"
            element={
              <ProtectedRoute>
                <ArticleVersion />
              </ProtectedRoute>
            }
          />   */}

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
          }
          />  {/* the editor page */}

          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
          />  {/* another editor page for editing */}


          <Route path="/article/:id/vS" element={
            <ProtectedRoute>
              <VersionHistoryPage />
            </ProtectedRoute>
          }
          />  {/* the editor page */}

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
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/signin" replace />} />  {/* fallback */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
