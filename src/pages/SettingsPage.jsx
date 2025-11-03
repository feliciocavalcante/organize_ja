

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

function SettingsPage() {
 
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [newPassword, setNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isWhatsAppLinked, setIsWhatsAppLinked] = useState(false);
    const [whatsAppLoading, setWhatsAppLoading] = useState(false);
    const [whatsAppCheckLoading, setWhatsAppCheckLoading] = useState(true);

 
    useEffect(() => {
        const fetchUserAndProfile = async () => {
            setLoadingUser(true);
            setWhatsAppCheckLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate('/auth'); return; }
            setUser(user);

       
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('full_name, phone_number') 
                .eq('id', user.id)
                .single();

            if (profile) {
                setFullName(profile.full_name || '');
           
                setPhoneNumber(profile.phone_number || '');
                setIsWhatsAppLinked(!!profile.phone_number);
            } else if (error && error.code !== 'PGRST116') {
                console.error("Erro ao buscar perfil:", error);
            }
            setWhatsAppCheckLoading(false); 
            setLoadingUser(false);
        };
        fetchUserAndProfile();
    }, [navigate]);

   
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });
        const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName }).eq('id', user.id);
        if (error) { setProfileMessage({ type: 'error', text: `Erro: ${error.message}` }); }
        else { setProfileMessage({ type: 'success', text: 'Nome atualizado!' }); }
        setProfileLoading(false);
    };


    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) { setPasswordMessage({ type: 'error', text: 'Senha curta (min 6).' }); return; }
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) { setPasswordMessage({ type: 'error', text: `Erro: ${error.message}` }); }
        else { setPasswordMessage({ type: 'success', text: 'Senha alterada!' }); setNewPassword(''); }
        setPasswordLoading(false);
    };

    const handleLinkWhatsApp = async (e) => {
        e.preventDefault();
        if (!phoneNumber.trim() || !user) { toast.error('Insira nº WhatsApp (55XX9...).'); return; }
        if (!/^\d{12,13}$/.test(phoneNumber.replace('+', ''))) { toast.error('Formato inválido (Ex: 55119...).'); return; }
        setWhatsAppLoading(true);
        const numberToSave = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
        const { error } = await supabase.from('profiles').update({ phone_number: numberToSave }).eq('id', user.id);
        if (error) {
            if (error.code === '23505'){ toast.error('Número já vinculado a outra conta.'); }
            else { toast.error(`Erro: ${error.message}`); }
            console.error("Erro WhatsApp Link:", error);
        } else { toast.success('WhatsApp vinculado!'); setIsWhatsAppLinked(true); }
        setWhatsAppLoading(false);
    };

    const handleUnlinkWhatsApp = async () => {
        if (!user) return;
        if (window.confirm('Desvincular WhatsApp?')) {
            setWhatsAppLoading(true);
            const { error } = await supabase.from('profiles').update({ phone_number: null }).eq('id', user.id);
            if (error) { toast.error(`Erro: ${error.message}`); console.error("Erro WhatsApp Unlink:", error); }
            else { toast.success('WhatsApp desvinculado!'); setIsWhatsAppLinked(false); setPhoneNumber(''); }
            setWhatsAppLoading(false);
        }
    };

    if (loadingUser) { return <div className="p-8 text-white text-center">Carregando...</div>; }

    return (
        <div className="p-8">
            <h1 className="text-center text-3xl font-bold text-white mb-8">Configurações da Conta</h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl lg:col-span-1">
                     <h2 className="text-xl font-semibold text-white mb-4">Meu Perfil</h2>
                     <form onSubmit={handleUpdateProfile}>
                         <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label><input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" className="px-4 py-2 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/></div>
                         <button type="submit" disabled={profileLoading} className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50">{profileLoading ? 'Salvando...' : 'Salvar Nome'}</button>
                         {profileMessage.text && (<p className={`mt-3 text-sm text-center ${profileMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{profileMessage.text}</p>)}
                     </form>
                </div>

              
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl lg:col-span-1">
                     <h2 className="text-xl font-semibold text-white mb-4">Alterar Senha</h2>
                     <form onSubmit={handleChangePassword}>
                         <div><label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">Nova Senha</label><input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className=" px-4 py-2 w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/></div>
                         <button type="submit" disabled={passwordLoading} className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50">{passwordLoading ? 'Alterando...' : 'Alterar Senha'}</button>
                         {passwordMessage.text && (<p className={`mt-3 text-sm text-center ${passwordMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{passwordMessage.text}</p>)}
                     </form>
                </div>

              
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl lg:col-span-1">
                    <h2 className="text-xl font-semibold text-white mb-4">Vincular WhatsApp</h2>

                    {whatsAppCheckLoading ? (
                        <p className="text-gray-400">Verificando...</p>
                    ) : isWhatsAppLinked ? (
                       
                        <div className="text-center">
                            <div className="bg-green-900/50 border border-green-700 p-4 rounded-md mb-4">
                                <p className="font-semibold text-green-300">✅ WhatsApp Vinculado!</p>
                                <p className="text-sm text-green-400 mt-1">Número: +{phoneNumber}</p>
                                <p className="text-sm text-gray-400 mt-2">Você pode enviar comandos para o número de teste.</p>
                            </div>
                            <button
                                onClick={handleUnlinkWhatsApp}
                                disabled={whatsAppLoading}
                                className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm disabled:opacity-50"
                            >
                                {whatsAppLoading ? 'Desvinculando...' : 'Desvincular WhatsApp'}
                            </button>
                        </div>
                    ) : (
                        
                        <>
                            <p className="text-gray-300 mb-4 text-sm">
                                Vincule seu nº WhatsApp (<code>55XX9...</code>) para add transações.
                            </p>
                            <form onSubmit={handleLinkWhatsApp}>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">Seu Nº WhatsApp</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder="5511987654321"
                                        required
                                        pattern="^\d{12,13}$"
                                        title="Use apenas números: 55 + DDD + Número (Ex: 5511987654321)"
                                        className="w-full bg-gray-700 border-gray-600 rounded-md text-white shadow-sm focus:ring-lime-500 focus:border-lime-500 px-4 py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={whatsAppLoading}
                                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                                >
                                    {whatsAppLoading ? 'Vinculando...' : 'Vincular WhatsApp'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">
                                Certifique-se de que este número foi verificado na plataforma Meta.
                            </p>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SettingsPage;