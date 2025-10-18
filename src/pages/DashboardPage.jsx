import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';

// IMPORTAÇÃO DO MODAL DE TRANSAÇÕES
import TransactionModal from '/src/pages/TransactionModal.jsx'; // Certifique-se de que o caminho está correto!

// 🚨 CORREÇÃO: O caminho deve ser relativo à raiz pública (folder 'public')
const LOGO_URL = "src/assets/logo1.png";

// --- Componentes Reutilizáveis (MANTIDOS) ---

const MetricCard = ({ title, value, icon: Icon, color, isTotal = false }) => (
    <div className={`p-6 rounded-lg shadow-lg ${isTotal ? 'bg-cyan-600' : 'bg-white'} text-gray-900`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className={`text-sm font-medium ${isTotal ? 'text-white' : 'text-gray-500'}`}>{title}</h3>
            {Icon && <Icon className={`w-6 h-6 ${color} ${isTotal ? 'text-white' : ''}`} />}
        </div>
        <p className={`text-3xl font-extrabold ${isTotal ? 'text-white' : 'text-gray-900'}`}>
            {value}
        </p>
    </div>
);

const TransactionTable = () => {
    // Dados de exemplo para ilustrar a estrutura
    const exampleTransactions = [
        { title: "Compra no mercado", value: "- R$ 150,00", category: "Alimentação", date: "18/Out" },
        { title: "Salário Mensal", value: "+ R$ 3.500,00", category: "Receita", date: "05/Out" },
        { title: "Streaming", value: "- R$ 39,90", category: "Lazer", date: "01/Out" },
    ];

    return (
        <div className="bg-gray-900 rounded-lg shadow-xl mt-8 p-4">
            {/* Cabeçalho da Tabela (Visível apenas em Desktop) */}
            <div className="hidden md:grid grid-cols-6 gap-4 text-gray-500 font-semibold border-b border-gray-700 pb-3 mb-3 ">
                <div className="col-span-2">Título</div>
                <div>Valor</div>
                <div>Categoria</div>
                <div>Data</div>
                <div>Ações</div>
            </div>

            {/* Linhas da Tabela */}
            {exampleTransactions.map((tx, index) => (
                <div key={index} className="border-b border-gray-800 py-3 last:border-b-0 hover:bg-gray-800 transition-colors md:grid md:grid-cols-6 md:gap-4 flex flex-col md:flex-row">

                    {/* Estrutura Responsiva Mobile/Desktop */}
                    <div className="col-span-2 text-white font-semibold">{tx.title}</div>
                    <div className={`font-bold ${tx.value.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{tx.value}</div>
                    <div className="text-gray-400 text-sm md:text-base">{tx.category}</div>
                    <div className="text-gray-400 text-sm md:text-base">{tx.date}</div>

                    {/* Coluna Ações (Exemplo) */}
                    <div className="mt-2 md:mt-0">
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm">Editar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- Dashboard Principal ---

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // NOVO ESTADO DO MODAL
    const navigate = useNavigate();

    // Lógica de Autenticação (Mantida)
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/auth');
                return;
            }

            setUser(user);
            setFullName(user.email); // Fallback

            // Tenta buscar o nome do perfil
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (!error && profile && profile.full_name) {
                setFullName(profile.full_name);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleTransactionSaved = () => {
        // Função que será chamada após salvar no Modal.
        // Futuramente, chamará a função para RECARREGAR os dados e métricas.
        console.log('Transação salva! Recarregando dados...');
        // Ex: fetchMetrics(); 
    };

    // Simulação dos dados financeiros
    const metrics = {
        entradas: "R$ 4.500,00",
        saidas: "R$ 1.250,00",
        total: "R$ 3.250,00"
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-cyan-400 text-xl font-bold">Carregando Dashboard...</div>;
    }

    if (!user) {
        return null;
    }

    const firstName = fullName.split(' ')[0];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* HEADER FIXO */}
            <header className="bg-fuchsia-800 p-4 shadow-xl sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">

                    {/* Logo/Marca */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={LOGO_URL}
                            alt="Organize Já Logo"
                            // Removido h-15 pois é uma classe inválida; use h-8 ou h-12
                            className="h-10 w-auto object-contain" 
                        />
                        <span className="hidden sm:inline text-white text-xl font-extrabold"> | Olá, {firstName}!</span>
                    </div>

                    {/* Botão Nova Transação (Canto Superior Direito) */}
                    <button 
                        onClick={() => setIsModalOpen(true)} // AÇÃO: Abre o Modal
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm md:text-base"
                    >
                        Nova Transação
                    </button>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (Cards e Tabela) */}
            <main className="container mx-auto p-16 max-w-7xl">

                {/* 1. CARDS DE MÉTRICAS (Resumo) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transform -translate-y-12">
                    {/* Os Cards de métricas */}
                    <MetricCard title="Entradas" value={metrics.entradas} icon={ArrowUp} color="text-green-500" />
                    <MetricCard title="Saídas" value={metrics.saidas} icon={ArrowDown} color="text-red-500" />
                    <MetricCard title="Total" value={metrics.total} icon={DollarSign} color="text-white" isTotal={true} />
                </div>

                {/* 2. TABELA DE TRANSAÇÕES */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Minhas Transações</h2>
                    <TransactionTable />
                </div>

                {/* Botão Sair */}
                <div className="mt-10 text-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center mx-auto bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-300"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair da Conta
                    </button>
                </div>
            </main>
            
            {/* 3. MODAL DE TRANSAÇÃO (NOVIDADE) */}
            <TransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // Fecha o modal
                onTransactionSaved={handleTransactionSaved} // Ação de sucesso
            />
        </div>
    );
};

export default DashboardPage;