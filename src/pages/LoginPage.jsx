import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import logoTop from '../assets/logoTop.png';

const LOGO_URL = "src/assets/logoTop.png";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState(''); // Novo estado para o nome
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const highlightGradient = 'bg-gradient-to-r from-blue-500 to-cyan-400';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let result;

        if (isLogin) {
            // Fluxo de LOGIN: Não precisa do nome
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
            // Fluxo de CADASTRO (SIGN UP)
            result = await supabase.auth.signUp({ email, password }, {}); 
        }

        const { data, error } = result;

        if (error) {
            setMessage(`ERRO: ${error.message}`);
        } else if (!isLogin && data.user) {
            
            // 🚨 NOVIDADE 1: Tenta salvar o nome do usuário na tabela 'profiles'
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        full_name: fullName 
                    },
                ]);

            if (profileError) {
                // Se o Supabase falhar em salvar o perfil, ainda podemos continuar
                console.error("Erro ao salvar perfil:", profileError.message);
            }
            // FIM DA NOVIDADE 1
            
            setMessage('Cadastro realizado! Verifique seu email para confirmar antes de fazer login.');
            setIsLogin(true); // Muda para login após o cadastro
            setFullName('');
            setEmail('');
            setPassword('');
        } else if (isLogin && data.user) {
            // Login bem-sucedido
            setMessage('Login bem-sucedido!');
            navigate('/dashboard'); 
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
                
                {/* ESPAÇO DA IMAGEM DA LOGO (mantido) */}
                {logoTop && (
                    <div className="flex justify-center mb-6">
                        <img 
                            src={logoTop} 
                            alt="Logo Organize Já" 
                            className="h-16 object-contain w-auto" 
                        />
                    </div>
                )}
                
                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {isLogin ? 'Bem-vindo de Volta' : 'Junte-se ao Organize Já'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? 'Acesse sua área de controle financeiro.' : 'Seu controle começa aqui. É rápido e grátis!'}
                </p>

                <form onSubmit={handleSubmit}>
                    
                    {/* 🚨 NOVIDADE 2: Input Nome (Apenas na tela de Cadastro) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Seu Nome Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors"
                                placeholder="Seu nome"
                            />
                        </div>
                    )}
                    {/* FIM DA NOVIDADE 2 */}


                    {/* Input Email */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors"
                            placeholder="seu@email.com"
                        />
                    </div>

                    {/* Input Senha */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors"
                            placeholder="******************"
                        />
                    </div>

                    {/* Mensagem de Status */}
                    {message && (
                        <p className={`mb-4 text-center text-sm ${message.startsWith('ERRO') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}

                    {/* Botão Principal */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-lg shadow-xl transition-all duration-300 ${
                                loading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : `${highlightGradient} hover:opacity-90 text-white`
                            }`}
                        >
                            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                        </button>
                    </div>
                </form>
                
                {/* Alternar Modo */}
                <p className="text-center text-gray-500 text-sm mt-4">
                    {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                            // Limpa o nome ao alternar
                            setFullName('');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                    >
                        {isLogin ? 'Crie uma agora' : 'Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;