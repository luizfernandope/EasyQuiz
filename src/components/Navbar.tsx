import Link from 'next/link';
// Adicionamos o ícone de 'Search' (Lupa)
import { BookMarked, Search } from 'lucide-react'; 

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Lado Esquerdo: Logo */}
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="flex items-center text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity"
          >
            <BookMarked className="mr-2" />
            EasyQuiz
          </Link>
        </div>

        {/* Centro: Barra de Busca (Falsa) */}
        {/* Este é o novo elemento "intuitivo" */}
        <div className="flex-1 flex justify-center px-8">
          <Link 
            href="/browse"
            className="flex items-center w-full max-w-md p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-200 hover:border-gray-300 transition-colors"
          >
            <Search size={18} className="mr-2 text-gray-400" />
            Buscar por questões, provas, disciplinas...
          </Link>
        </div>
        
        {/* Lado Direito: Botões de Autenticação */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {/* Botão Secundário (Login) */}
          <Link 
            href="/auth/sign-in" 
            className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>

          {/* Botão Primário (Cadastrar) */}
          <Link 
            href="/auth/sign-up" 
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  );
}