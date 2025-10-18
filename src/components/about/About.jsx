import { Briefcase, Shield, Target } from "lucide-react";


export default function About() {
    return(
        <section className="py-20 md:py-28 bg-gray-900" id="sobre">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-12">
            Transforme <span className="text-cyan-400">Pontos de Melhoria</span> em <span className="text-cyan-400">Crescimento</span>.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              <Target className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Foco no Futuro</h4>
              <p className='text-gray-400'>Pare de apagar incêndios e comece a traçar a rota para seus objetivos de longo prazo (viagens, casa própria).</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              <Shield className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Paz de Espírito</h4>
              <p className='text-gray-400'>Tenha clareza sobre suas contas 24/7. Reduza o estresse financeiro e ganhe qualidade de vida.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all">
              <Briefcase className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h4 className="text-2xl font-semibold mb-2 text-white">Decisões Empoderadas</h4>
              <p className='text-gray-400'>Com relatórios visuais claros, você saberá exatamente quando e quanto pode investir ou economizar.</p>
            </div>
          </div>
        </div>
      </section>
    )
};