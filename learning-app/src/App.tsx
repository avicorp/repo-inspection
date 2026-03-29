import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TopicHome from './pages/TopicHome'
import TopicDetail from './pages/TopicDetail'
import Quiz from './pages/Quiz'
import QuizStatus from './pages/QuizStatus'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quiz-status" element={<QuizStatus />} />
        <Route path="/:topic" element={<TopicHome />} />
        <Route path="/:topic/:subtopic" element={<TopicDetail />} />
        <Route path="/:topic/quiz" element={<Quiz />} />
        <Route path="/:topic/quiz/:subtopic" element={<Quiz />} />
      </Route>
    </Routes>
  )
}

export default App
