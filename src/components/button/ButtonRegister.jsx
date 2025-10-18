import { ArrowRight } from "lucide-react";

export default function ButtonRegister() {
    return(
         <button>
            <a href="/auth" className='inline-flex items-center text-xl font-bold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-xl bg-cyan-400 text-gray-900 hover:bg-cyan-500'>
            Cadastre-se e Comece Grátis <ArrowRight className="ml-3 h-6 w-6" />
          </a>
          </button>
    )
};