// src/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function SettingsPage() {
    // --- State de Autenticação ---
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    // --- State do Perfil (Nome) ---
    const [fullName, setFullName] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // --- State da Senha ---
    const [newPassword, setNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // 1. Busca o usuário logado e seu 'full_name' atual
    useEffect(() => {
        const fetchUserAndProfile = async () => {
            setLoadingUser(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                navigate('/auth');
                return;
            }
            setUser(user);

            // Busca o 'full_name' da tabela 'profiles'
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();
            
            if (profile) {
                setFullName(profile.full_name || ''); // Preenche o formulário com o nome atual
            }
            setLoadingUser(false);
        };
        fetchUserAndProfile();
    }, [navigate]);

    // 2. Função para o formulário de ATUALIZAR NOME
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' }); // Limpa msg anterior

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName }) // Atualiza o nome
            .eq('id', user.id);

        if (error) {
            setProfileMessage({ type: 'error', text: `Erro: ${error.message}` });
        } else {
            setProfileMessage({ type: 'success', text: 'Nome atualizado com sucesso!' });
        }
        setProfileLoading(false);
    };

    // 3. Função para o formulário de ALTERAR SENHA
    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }
        
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' }); // Limpa msg anterior

        // Função nativa do Supabase para mudar a senha do usuário logado
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setPasswordMessage({ type: 'error', text: `Erro: ${error.message}` });
        } else {
            setPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setNewPassword(''); // Limpa o campo de senha
        }
        setPasswordLoading(false);
    };

    // Renderiza um 'loading' enquanto busca os dados do usuário
    if (loadingUser) {
        return <div className="p-8 text-white">Carregando configurações...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">
                Configurações da Conta
            </h1>
            
            {/* Grid para os cards */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- Card 1: Atualizar Perfil --- */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Meu Perfil
                    </h2>
                    
                    <form onSubmit={handleUpdateProfile}>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {profileLoading ? 'Salvando...' : 'Salvar Nome'}
                        </button>
                        
                        {/* Mensagem de Sucesso/Erro */}
                        {profileMessage.text && (
                            <p className={`mt-3 text-sm text-center ${profileMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {profileMessage.text}
                            </p>
                        )}
                    </form>
                </div>

                {/* --- Card 2: Alterar Senha --- */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Alterar Senha
                    </h2>
                    
                    <form onSubmit={handleChangePassword}>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
                        </button>

                        {/* Mensagem de Sucesso/Erro */}
                        {passwordMessage.text && (
                            <p className={`mt-3 text-sm text-center ${passwordMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {passwordMessage.text}
                            </p>
                        )}
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default SettingsPage;