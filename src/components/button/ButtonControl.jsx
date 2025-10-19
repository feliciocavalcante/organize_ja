import { Zap} from "lucide-react";

export default function ButtonControl() {
    return (
        <button href="#cadastro" className='inline-flex items-center text-xl font-bold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white'>
            <a href="#cadastro"> Quero o Controle Agora! </a>  <Zap className="ml-3 h-6 w-6" />
        </button>
    );
};

