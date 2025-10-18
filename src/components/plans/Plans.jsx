import { CheckCircle } from "lucide-react";


export default function Plans(){
    return(
        <section id="planos" className="py-20 md:py-32 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Escolha o Seu Rumo</h3>
          <p className='text-xl mb-16 text-gray-400 max-w-2xl mx-auto'>
            Comece grátis, faça upgrade para desbloquear ferramentas avançadas de crescimento e investimento.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

            <div className="p-8 rounded-2xl shadow-2xl transition-all duration-300 bg-gray-800 border border-gray-700 hover:border-cyan-400">

              <h4 className="text-3xl font-extrabold mb-2 text-white">Starter (Grátis)</h4>
              <p className="text-5xl font-bold mb-6 text-white">R$ 0</p>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Controle de 1 Conta
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Lançamentos Manuais
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Relatórios Básicos
                </li>
              </ul>

              <a href="#cadastro" className="w-full block text-center py-3 rounded-full font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Começar Grátis
              </a>
            </div>

            <div className="p-8 rounded-2xl shadow-2xl transition-all duration-300 bg-gray-800 border-4 border-cyan-400 transform scale-105">

              <div className="mb-4 inline-block bg-cyan-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Mais Popular</div>

              <h4 className="text-3xl font-extrabold mb-2 text-white">PRO <br /> (Mais Popular)</h4>
              <p className="text-5xl font-bold mb-6 text-white">R$ 19,90 /mês</p>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Todas as Contas Ilimitadas
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Categorização Automática
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Metas e Orçamentos Ilimitados
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Suporte Prioritário
                </li>
              </ul>

              <a href="#cadastro" className="w-full block text-center py-3 rounded-full font-bold bg-cyan-400 text-gray-900 hover:bg-cyan-500 transition-colors">
                Assinar Plano Pro
              </a>
            </div>

            <div className="p-8 rounded-2xl shadow-2xl transition-all duration-300 bg-gray-800 border border-gray-700 hover:border-cyan-400">

              <h4 className="text-3xl font-extrabold mb-2 text-white">Premium</h4>
              <p className="text-5xl font-bold mb-6 text-white">R$ 49,90 /mês</p>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Tudo do Pro
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Consultoria em Grupo Mensal
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Relatórios de Imposto de Renda
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />Análise de Investimentos
                </li>
              </ul>
              <a href="#cadastro" className="w-full block text-center py-3 rounded-full font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Assinar Plano Premium
              </a>
            </div>
          </div>
        </div>
      </section>
    )
};