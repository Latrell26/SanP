import ReportIssueForm from './components/ReportIssueForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">MySanPablo</h1>
        <p className="mt-1 text-gray-500">Citizen Services Platform</p>
      </header>
      <ReportIssueForm />
    </div>
  )
}

export default App
