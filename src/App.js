import { HashRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  ListBotPage,
  ModePage,
  TutorialPage,
  MailPage,
  BotDetailPage,
  GridConfigPage,
  ReConfigPage
} from './pages/index'
import Layout from './layout/mainLayout.jsx'

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/list-bot"
            element={
              <Layout>
                <ListBotPage />
              </Layout>
            }
          />
          <Route
            path="/mode-bot"
            element={
              <Layout>
                <ModePage />
              </Layout>
            }
          />
          <Route
            path="/tutorial-bot"
            element={
              <Layout>
                <TutorialPage />
              </Layout>
            }
          />
          <Route
            path="/mail"
            element={
              <Layout>
                <MailPage />
              </Layout>
            }
          />
          <Route
            path="/bot-detail"
            element={
              <Layout>
                <BotDetailPage />
              </Layout>
            }
          />
          <Route
            path="/grid-config-comb"
            element={
              <Layout>
                <GridConfigPage />
              </Layout>
            }
          />
          <Route
            path="/re-config-comb"
            element={
              <Layout>
                <ReConfigPage />
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
