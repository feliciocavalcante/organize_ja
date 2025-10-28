// supabase/functions/whatsapp-webhook/index.ts

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// --- Interfaces ---
interface TelegramMessage { text?: string; chat: { id: number; }; } // Reutilizando nome, mas é WhatsApp aqui
interface TelegramUpdate { message?: TelegramMessage; } // Reutilizando nome

// --- Headers CORS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Função Auxiliar Send (Opcional - Mantida Comentada por enquanto) ---
// async function sendWhatsAppMessage(to: string, text: string) { ... }

console.log("Função whatsapp-webhook iniciada.");

serve(async (req: Request) => { // Usando Request type
  console.log(`Recebida requisição: Método=${req.method}, URL=${req.url}`);

  // Trata CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Lê o token de verificação dos segredos
  const verifyTokenFromSecrets = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
  if (!verifyTokenFromSecrets) {
       console.error("ERRO GRAVE: WHATSAPP_VERIFY_TOKEN não encontrado nos segredos!");
       return new Response('Configuração interna: Token de verificação não encontrado.', { status: 500 });
  }

  const url = new URL(req.url);

  // --- LÓGICA DE VERIFICAÇÃO (GET) ---
  if (req.method === 'GET' && url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token')) {
    const hubChallenge = url.searchParams.get('hub.challenge');
    const hubVerifyToken = url.searchParams.get('hub.verify_token');
    console.log("Recebida requisição GET de verificação.");

    if (hubVerifyToken === verifyTokenFromSecrets) {
      console.log("Token de verificação CORRETO.");
      return new Response(hubChallenge || '', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    } else {
      console.error("Token de verificação INCORRETO!");
      return new Response('Verification token mismatch', { status: 403, headers: corsHeaders });
    }
  }

  // --- LÓGICA PARA RECEBER MENSAGENS (POST) ---
  if (req.method === 'POST') {
    console.log("Recebida requisição POST (mensagem WhatsApp).");
    let organizeJaUserId: string | null = null;
    let senderPhoneNumber: string | null = null;

    try {
      const body = await req.json();
      console.log("Corpo POST recebido:", JSON.stringify(body, null, 2));

      // Extrair dados (ajustado para estrutura comum)
      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!message || message.type !== 'text') {
        console.log("Payload não é mensagem de texto válida.");
        return new Response('EVENT_RECEIVED_NOT_TEXT', { status: 200, headers: corsHeaders });
      }

      senderPhoneNumber = message.from;
      const messageText = message.text?.body?.trim();

      if (!senderPhoneNumber || !messageText) {
          console.log("Não extraiu número ou texto.");
          return new Response('EVENT_RECEIVED_INVALID_DATA', { status: 200 });
      }
      console.log(`Mensagem de ${senderPhoneNumber}: "${messageText}"`);

      // Criar Cliente Supabase Admin
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase URL/Key não encontradas no env.");
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      console.log("Cliente Supabase Admin criado.");

      // Encontrar Usuário pelo Número
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('phone_number', senderPhoneNumber)
        .single();

      if (profileError || !profileData) {
        console.error(`Número ${senderPhoneNumber} não encontrado/vinculado.`, profileError);
        // Poderia enviar msg de erro aqui (comentado por enquanto)
        // await sendWhatsAppMessage(senderPhoneNumber, "Seu número não está vinculado...");
        return new Response('USER_NOT_FOUND_OR_LINKED', { status: 200 }); // Responde OK pro WhatsApp
      }
      organizeJaUserId = profileData.id;
      console.log(`Usuário encontrado: ${organizeJaUserId} para ${senderPhoneNumber}`);

      // Analisar Mensagem de Transação
      const parts: string[] = messageText.split(' ');
      const command: string | undefined = parts[0]?.toLowerCase();
      console.log(`Verificando formato: Comando='${command}', Parts Length=${parts.length}`);

      if ((command !== '/despesa' && command !== '/receita') || parts.length < 3) {
        console.log("Formato inválido para transação.");
        // await sendWhatsAppMessage(senderPhoneNumber, "Formato inválido...");
        return new Response('INVALID_TRANSACTION_FORMAT', { status: 200 });
      }

      // Extrair dados (lógica mantida)
      const tipo: 'saida' | 'entrada' = command === '/despesa' ? 'saida' : 'entrada';
      const valorStr = parts[1]?.replace(',', '.');
      const valor: number = parseFloat(valorStr);
      const descricaoSlice = parts.slice(2, parts.length > 3 ? -1 : undefined);
      const descricao: string = descricaoSlice.join(' ');
      const categoriaInput: string | undefined = parts.length > 3 ? parts[parts.length - 1] : undefined;
      const descricaoFinal: string = categoriaInput ? descricao : parts.slice(2).join(' ');
      const categoriaFinal: string = categoriaInput || 'Outros';

      if (isNaN(valor) || valor <= 0) {
        console.log("Valor inválido.");
        // await sendWhatsAppMessage(senderPhoneNumber, "Valor inválido...");
        return new Response('INVALID_VALUE', { status: 200 });
      }

      // Inserir Transação (com .select() e logs detalhados)
      console.log(`Tentando inserir: User=${organizeJaUserId}, Tipo=${tipo}, Valor=${valor}, Desc=${descricaoFinal}, Cat=${categoriaFinal}`);
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('transacoes')
        .insert({
          user_id: organizeJaUserId, tipo, valor,
          descricao: descricaoFinal, categoria: categoriaFinal,
          data: new Date().toISOString(),
        })
        .select(); // Pede retorno

      if (insertError) {
        console.error('ERRO AO INSERIR TRANSAÇÃO:', insertError);
        // await sendWhatsAppMessage(senderPhoneNumber, `Erro ao salvar: ${insertError.message}`);
        return new Response('DB_INSERT_ERROR', { status: 200 }); // Responde OK pro WhatsApp
      }

      // Se deu certo
      console.log("INSERÇÃO NO BANCO REPORTADA COMO SUCESSO.");
      console.log("Dados retornados pelo insert:", JSON.stringify(insertedData, null, 2));

      // (Opcional) Tentar enviar confirmação de volta
      console.log("Tentativa de envio de confirmação (opcional)...");
      // await sendWhatsAppMessage(senderPhoneNumber, `✅ Transação Salva: ${tipo} R$ ${valor.toFixed(2)}...`);

      // Responde 200 OK para o WhatsApp OBRIGATORIAMENTE
      return new Response('EVENT_RECEIVED', { status: 200, headers: corsHeaders });

    } catch (error) {
      console.error("ERRO GERAL NO PROCESSAMENTO POST:", error);
      // Responde 200 OK mesmo em erro para não quebrar o webhook
      return new Response('INTERNAL_SERVER_ERROR', { status: 200, headers: corsHeaders });
    }
  }

  // Se não for GET ou POST válido
  console.log("Método não suportado ou requisição inválida.");
  return new Response('Method Not Allowed or Invalid Request', { status: 405, headers: corsHeaders });
})