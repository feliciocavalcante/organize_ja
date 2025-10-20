// src/App.jsx
import logBlue from '../assets/logBlue.png';
import Header from '../components/header/Header';
import About from '../components/about/About';
import Function from '../components/function/Function';
import Depoiment from '../components/depoiment/Depoiment';
import Plans from '../components/plans/Plans';
import Register from '../components/register/Register';
import Footer from '../components/footer/Footer';



function App() {

  return (
    <div className='min-h-screen bg-gray-900 font-sans antialiased text-white'>

      <nav className="p-4 sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm shadow-xl shadow-gray-900/50">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
          <div className="flex items-center space-x-2">
            <img src={logBlue} alt="" className='w-40 h-15' />
          </div>
          <div className="flex items-center space-x-4">
            <a href="#planos" className="hidden sm:block text-gray-300 hover:text-cyan-400 font-medium">Planos</a>
            <a href="#cadastro" className="text-cyan-400 border border-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition-colors font-medium text-sm">
              Começar Grátis
            </a>
          </div>
        </div>
      </nav>

      <Header />

      <About />

      <Function />

      <Depoiment />

      <Plans />

      <Register />

      <Footer />
    </div>
  );
}

export default App;