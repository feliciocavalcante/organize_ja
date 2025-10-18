import { Star } from "lucide-react";


export default function Depoiment() {
    return(
        <section id="depoimentos" className="py-20 md:py-28 bg-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-white">O que nossos usuários dizem?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 shadow-lg text-left">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={`juliana-star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-300 italic mb-4">"Consegui finalmente sair do vermelho em 3 meses! Os relatórios são simples e o app é lindo."</p>
              <p className="font-semibold text-cyan-400">- Juliana F.</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 shadow-lg text-left">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={`ricardo-star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-300 italic mb-4">"O melhor gerenciador que já usei. A categorização automática me economizou horas de trabalho."</p>
              <p className="font-semibold text-cyan-400">- Ricardo V.</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 shadow-lg text-left">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={`beatriz-star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-300 italic mb-4">"Me senti empoderada para tomar decisões. Antes era só um chute, agora tenho certeza do que posso gastar."</p>
              <p className="font-semibold text-cyan-400">- Beatriz S.</p>
            </div>

          </div>
        </div>
      </section>
    )
}