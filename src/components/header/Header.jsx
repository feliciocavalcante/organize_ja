import { CheckCircle } from "lucide-react";
import graphic from "../../assets/img-graphic.jpg";
import ButtonControl from "../button/ButtonControl";

export default function Header() {
    return (
        <header className="py-20 md:py-32 bg-gray-950">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                <div className="lg:order-1 order-2">
                    <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>Organize Já:</span>
                        Controle Suas Finanças na Hora.
                    </h2>
                    <p className='text-xl md:text-2xl mb-8text-gray-400'>
                        Diga adeus à confusão. Nossa plataforma transforma a desorganização em tranquilidade e crescimento imediato.
                    </p>

                    <ButtonControl />

                    <div className="mt-6 flex items-center space-x-4 text-gray-300">
                        <CheckCircle className="h-5 w-5 text-cyan-400" />
                        <span className="text-sm">Sem taxas ocultas. Segurança de nível bancário.</span>
                    </div>
                </div>

                <div className="lg:order-2 order-1 flex justify-center">
                    <img src={graphic} alt="" className="w-full max-w-lg border border-cyan-400 rounded-lg" />
                </div>
            </div>
        </header>
    )
};