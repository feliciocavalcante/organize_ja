// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CreditCard, User, Home, Lock } from 'lucide-react';

function CheckoutPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // --- States do Formulário ---
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    // 1. Busca o usuário e o nome dele (para preencher o formulário)
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
            setUser(user);

            // Busca o nome atual para preencher o campo
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id);
            
            if (!error && profiles && profiles.length > 0) {
                setFullName(profiles[0].full_name || '');
            }
            setLoading(false);
        };
        fetchUserData();
    }, [navigate]);

    // 2. Função de "Simular Pagamento"
    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        
        // Validação simples (só para simular)
        if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCVC.length < 3) {
            setError('Dados do cartão inválidos. Por favor, preencha corretamente.');
            return;
        }
        
        setLoading(true);
        setError('');

        // 3. A "COMPRA"!
        // Atualizamos o perfil com os novos dados E o novo plano
        const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: fullName,
                address: address,
                plan_type: 'pro' // <-- O UPGRADE ACONTECE AQUI!
            })
            .eq('id', user.id);

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
        } else {
            // 4. SUCESSO!
            // Espera 1 segundo para o usuário ver a "aprovação"
            setTimeout(() => {
                alert('Pagamento aprovado! Bem-vindo(a) ao Plano PRO!');
                navigate('/dashboard'); // Manda de volta para o dashboard
            }, 1000);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">
                Finalizar Assinatura - Plano PRO
            </h1>

            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                <form onSubmit={handleSubmitPayment}>
                    <div className="space-y-6">
                        
                        {/* --- Seção 1: Dados Pessoais --- */}
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                            <User className="w-5 h-5 mr-3 text-lime-400"/>
                            Seus Dados
                        </h2>
                        
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                                Nome Completo (como no cartão)
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                                Endereço (para fatura)
                            </label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ex: Rua Fictícia, 123 - Bairro"
                                required
                                className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500"
                            />
                        </div>

                        {/* --- Seção 2: Dados do Cartão (Fictício) --- */}
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                            <CreditCard className="w-5 h-5 mr-3 text-lime-400"/>
                            Dados de Pagamento (Simulado)
                        </h2>

                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                                Número do Cartão (16 dígitos)
                            </label>
                            <input
                                type="text"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} // Só números
                                placeholder="0000 0000 0000 0000"
                                maxLength={16}
                                required
                                className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300 mb-1">
                                    Validade (MM/AA)
                                </label>
                                <input
                                    type="text"
                                    id="cardExpiry"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="MM/AA"
                                    maxLength={4}
                                    required
                                    className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-300 mb-1">
                                    CVC (3 dígitos)
                                </label>
                                <input
                                    type="text"
                                    id="cardCVC"
                                    value={cardCVC}
                                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                    placeholder="123"
                                    maxLength={3}
                                    required
                                    className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500"
                                />
                            </div>
                        </div>

                        {/* --- Botão de Pagar --- */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center bg-lime-500 hover:bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Pagar e Ativar Plano PRO
                                </>
                            )}
                        </button>
                        
                        {error && (
                            <p className="text-red-400 text-center">{error}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutPage;