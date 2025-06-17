import { Outlet } from 'react-router-dom'
import Navbar from "./components/Navbar/Navbar";
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const selectedTheme = localStorage.getItem('selectedTheme') || 'light';
    document.documentElement.classList.add(selectedTheme);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}

export default App