

import React from 'react';
import { X, Zap } from 'lucide-react'; 

function UpgradeModal({ isOpen, onClose, onUpgrade }) {
  if (!isOpen) return null;

  return (

    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose} >
    
      <div 
        className="relative z-50 w-full max-w-md p-6 mx-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}  >
       
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

      
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#0096c7] text-gray-900 mb-4">
            <Zap className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Seu Plano Gratuito Chegou ao Limite!
          </h2>

          <p className="text-gray-300 mb-6">
            Você atingiu o máximo de 5 transações permitidas no Plano Gratuito.
            Para adicionar transações ilimitadas e ter acesso a todos os relatórios, faça o upgrade.
          </p>

          <button
            onClick={onUpgrade} 
            className="w-full cursor-pointer bg-[#0096c7] hover:bg-[#007595] text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Assinar o Plano PRO
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;