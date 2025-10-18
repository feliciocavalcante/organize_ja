import {ArrowRight} from "lucide-react";

export default function ButtonOrganize() {
    return (
         <button>
            <a href="#cadastro" className='mt-12 inline-flex items-center text-xl font-bold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-xl bg-cyan-400 text-gray-900 hover:bg-cyan-500'>
            Quero Me Organizar Agora! <ArrowRight className="ml-3 h-6 w-6" />
          </a>
          </button>
    )
};