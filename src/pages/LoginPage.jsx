import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logBluee from '../assets/logBluee.png';
import { Eye, EyeOff } from 'lucide-react'; 

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const highlightGradient = 'bg-gradient-to-r from-blue-500 to-cyan-400';


    useEffect(() => {
        if (isLogin) { 
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail) {
                setEmail(rememberedEmail);
                setRememberMe(true);
            }
        } else {
           
             setRememberMe(false); 
        }
    }, [isLogin]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let result;

        if (isLogin) {
   
            result = await supabase.auth.signInWithPassword({ email, password });
        } else {
           
            result = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } }
            });
        }

        const { data, error } = result;

        if (error) {
            setMessage(`ERRO: ${error.message}`);
        } else if (!isLogin && data.user) {

            setMessage('Cadastro realizado! Verifique seu email para confirmar.');
            setIsLogin(true); 
            setFullName(''); setEmail(''); setPassword('');
        } else if (isLogin && data.user) {

            setMessage('Login bem-sucedido!');

 
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            navigate('/dashboard');
        } else if (!isLogin && !data.user && !error) {
     
             setMessage('Cadastro realizado! Verifique seu email para confirmar.');
             setIsLogin(true);
             setFullName(''); setEmail(''); setPassword('');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">

                <div className="flex justify-center mb-6">
                    <img src={logBluee} alt="Logo Organize Já" className="h-16 object-contain w-auto" />
                </div>

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {isLogin ? 'Bem-vindo de Volta' : 'Junte-se ao Organize Já'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? 'Acesse sua área de controle financeiro.' : 'Seu controle começa aqui. É rápido e grátis!'}
                </p>

                <form onSubmit={handleSubmit}>


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

                  
                    <div className="mb-4 relative">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Senha</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 pr-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800 transition-colors"
                            placeholder="••••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            
                            className="cursor-pointer absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5" 
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>

             
                     {isLogin && (
                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="cursor-pointer h-4 w-4 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-offset-gray-900 focus:ring-cyan-500" // Adicionado focus:ring-offset
                            />
                            <label htmlFor="rememberMe" className="cursor-pointer ml-2 block text-sm text-gray-300">
                                Lembrar meu email
                            </label>
                        
                        </div>
                    )}

                    
                    {!isLogin && <div className="mb-6"></div>}


                    {message && (
                         <p className={`mb-4 text-center text-sm ${message.startsWith('ERRO') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}

               
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-lg shadow-xl transition-all duration-300 ${
                                loading
                                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                : `${highlightGradient} hover:opacity-90 text-white`
                            }`}
                        >
                            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-500 text-sm mt-4">
                    {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                          
                            setFullName('');
                 
                            setPassword('');
                            setShowPassword(false); 
                           
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