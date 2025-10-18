import ButtonOrganize from "../button/ButtonOrganize";


export default function Function() {
    return(
        <section className="py-16 md:py-24 bg-gray-950 border-t border-b border-gray-800" id="como-funciona">
                <div className="container mx-auto px-4 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-12 text-white">Como Funciona o Organize Já?</h3>
        
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
                    <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-400 text-gray-900 font-extrabold text-2xl mb-4 mx-auto md:mx-0">
                        1
                      </div>
                      <h4 className="text-xl font-semibold mb-2 text-white">Conecte</h4>
                      <p className="text-gray-400">Integre suas contas e cartões com segurança bancária (opcional).</p>
                    </div>
        
                    <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-400 text-gray-900 font-extrabold text-2xl mb-4 mx-auto md:mx-0">
                        2
                      </div>
                      <h4 className="text-xl font-semibold mb-2 text-white">Visualize</h4>
                      <p className="text-gray-400">Veja seus gastos categorizados e o panorama financeiro em gráficos intuitivos.</p>
                    </div>
        
                    <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-400 text-gray-900 font-extrabold text-2xl mb-4 mx-auto md:mx-0">
                        3
                      </div>
                      <h4 className="text-xl font-semibold mb-2 text-white">Avance</h4>
                      <p className="text-gray-400">Defina metas e use os insights para tomar decisões que levam à liberdade.</p>
                    </div>
        
                  </div>
        
                  <ButtonOrganize />
        
                </div>
              </section>
    )
};