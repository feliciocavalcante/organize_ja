// src/components/Modal/UpgradeModal.jsx

import React from 'react';
import { X, Zap } from 'lucide-react'; 

function UpgradeModal({ isOpen, onClose, onUpgrade }) {
  if (!isOpen) return null;

  return (
    // Backdrop (fundo escuro)
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose} // Fecha ao clicar fora
    >
      {/* O Card do Modal */}
      <div 
        className="relative z-50 w-full max-w-md p-6 mx-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
      >
        {/* Botão de Fechar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Conteúdo */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-lime-400 text-gray-900 mb-4">
            <Zap className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Seu Plano Gratuito Chegou ao Limite!
          </h2>

          <p className="text-gray-300 mb-6">
            Você atingiu o máximo de 10 transações permitidas no Plano Gratuito.
            Para adicionar transações ilimitadas e ter acesso a todos os relatórios, faça o upgrade.
          </p>

          <button
            onClick={onUpgrade} 
            className="w-full bg-lime-500 hover:bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Assinar o Plano PRO
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;