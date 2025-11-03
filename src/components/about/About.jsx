// Importe a imagem da feature do WhatsApp (ajuste o caminho se necessário)
import imgZap from '../../assets/imgZap.png'; 

// Importe os ícones necessários
import { Briefcase, Shield, Target, CheckCircle } from "lucide-react";

export default function About() {
  return (
    // ADICIONADO: Fragmento (<>) para agrupar as duas seções
    <>
      {/* --- SEÇÃO SOBRE (COM CORES ATUALIZADAS) --- */}
      <section className="py-20 md:py-28 bg-gray-900" id="sobre">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-12">
            {/* CORREÇÃO DE COR: cyan -> lime */}
            Transforme <span className="text-cyan-400">Pontos de Melhoria</span> em <span className="text-cyan-400">Crescimento</span>.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              {/* CORREÇÃO DE COR: cyan -> lime */}
              <Target className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Foco no Futuro</h4>
              <p className='text-gray-400'>Pare de apagar incêndios e comece a traçar a rota para seus objetivos de longo prazo (viagens, casa própria).</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              {/* CORREÇÃO DE COR: cyan -> lime */}
              <Shield className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Paz de Espírito</h4>
              <p className='text-gray-400'>Tenha clareza sobre suas contas 24/7. Reduza o estresse financeiro e ganhe qualidade de vida.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              {/* CORREÇÃO DE COR: cyan -> lime */}
              <Briefcase className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Decisões Empoderadas</h4>
              <p className='text-gray-400'>Com relatórios visuais claros, você saberá exatamente quando e quanto pode investir ou economizar.</p>
            </div>
          </div>
        </div>
      </section> {/* <-- CORREÇÃO: Fechamento da seção "Sobre" */}

      
      {/* --- SEÇÃO DESTAQUE WHATSAPP (CORRIGIDA E SEPARADA) --- */}
      {/* Este é o "novo código" que implementa a imagem */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Coluna da Esquerda: Visual com a IMAGEM */}
          <div className="relative flex justify-center items-center">
            <img
              src={imgZap}
              alt="Smartphone com chat do WhatsApp"
              className="w-full max-w-md h-auto rounded-lg shadow-2xl relative z-10"
            />
            {/* Balões de chat flutuantes */}
            <div className="absolute top-10 -left-4 sm:top-1/4 sm:-left-16 bg-lime-500 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-lg transform -rotate-6 z-20 text-sm md:text-base">
              /despesa 50 Padaria
            </div>
            <div className="absolute bottom-10 -right-4 sm:bottom-1/4 sm:-right-16 bg-gray-700 text-white py-2 px-4 rounded-lg shadow-lg transform rotate-6 z-20 text-sm md:text-base">
              ✅ Transação salva!
            </div>
          </div>

          {/* Coluna da Direita: Texto (Mantido como estava) */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Do <span className="text-lime-400">WhatsApp</span> direto para o seu controle.
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Nunca mais esqueça de registrar um gasto. Com a nova integração do Organize Já, você adiciona despesas ou receitas enviando uma simples mensagem, de onde estiver, sem precisar abrir o aplicativo.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-6 w-6 text-lime-400 mr-3 flex-shrink-0" />
                <strong>Rápido e Fácil:</strong> Basta enviar <code>/despesa 10 Cafe</code>.
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-6 w-6 text-lime-400 mr-3 flex-shrink-0" />
                <strong>Sempre Disponível:</strong> Registre no momento exato da compra.
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-6 w-6 text-lime-400 mr-3 flex-shrink-0" />
                <strong>Confirmação Imediata:</strong> Receba a confirmação na hora.
              </li>
            </ul>
            <a
              href="#cadastro"
              className="mt-12  inline-flex items-center text-xl font-bold rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
              Organize Agora
            </a>
          </div>

        </div>
      </section>
    </> // <-- ADICIONADO: Fechamento do Fragmento
  )
};