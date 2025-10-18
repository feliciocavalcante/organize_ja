import ButtonRegister from "../button/ButtonRegister";


export default function Register() {
    return (
        <section id="cadastro" className="bg-gray-800 py-16 md:py-20">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Pare de Adiar. Comece Agora.
                </h3>
                <p className="text-xl text-gray-300 mb-8">
                    Sua jornada para a paz financeira está a um clique de distância.
                </p>

                <ButtonRegister />

            </div>
        </section>
    )

};