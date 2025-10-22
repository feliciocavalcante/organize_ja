import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
// Mantendo apenas a logo usada
import logBluee from '../assets/logBluee.png';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Mantendo o gradiente original
    const highlightGradient = 'bg-gradient-to-r from-blue-500 to-cyan-400';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let result;

        if (isLogin) {
            // --- Fluxo de LOGIN ---
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
            // --- Fluxo de CADASTRO (SIGN UP) ---
            
            // CORREÇÃO ESSENCIAL: Passar o nome para options.data
            result = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName // Chave deve ser 'full_name'
                    }
                }
            });
        }

        const { data, error } = result;

        if (error) {
            setMessage(`ERRO: ${error.message}`);
        } else if (!isLogin && data.user) {
            // Cadastro OK (Trigger cuidará do profile)
            setMessage('Cadastro realizado! Verifique seu email para confirmar antes de fazer login.');
            setIsLogin(true); // Muda para login
            // Limpa os campos
            setFullName('');
            setEmail('');
            setPassword('');
            
            // REMOVIDO: Tentativa manual de insert (Trigger faz isso)
            /*
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: data.user.id, full_name: fullName }]);
            if (profileError) console.error("Erro perfil:", profileError.message);
            */

        } else if (isLogin && data.user) {
            // Login OK
            setMessage('Login bem-sucedido!');
            navigate('/dashboard');
        } else if (!isLogin && !data.user && !error) {
             // Caso: SignUp OK mas requer confirmação
             setMessage('Cadastro realizado! Verifique seu email para confirmar antes de fazer login.');
             setIsLogin(true);
             setFullName('');
             setEmail('');
             setPassword('');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={logBluee}
                        alt="Logo Organize Já"
                        className="h-16 object-contain w-auto"
                    />
                </div>

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {isLogin ? 'Bem-vindo de Volta' : 'Junte-se ao Organize Já'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? 'Acesse sua área de controle financeiro.' : 'Seu controle começa aqui. É rápido e grátis!'}
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Input Nome (Apenas Cadastro) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Seu Nome Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors" // Cor original cyan
                                placeholder="Seu nome"
                            />
                        </div>
                    )}

                    {/* Input Email */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors" // Cor original cyan
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
                            className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors" // Cor original cyan
                            placeholder="••••••••••••"
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
                            // Usando gradiente original
                            className={`w-full py-3 rounded-lg font-bold text-lg shadow-xl transition-all duration-300 ${
                                loading
                                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                                : `${highlightGradient} hover:opacity-90 text-white` // Cor original text-white
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
                            setFullName(''); 
                        }}
                        // Cor original cyan
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