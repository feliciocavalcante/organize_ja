
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface TelegramMessage { text?: string; chat: { id: number; }; } 
interface TelegramUpdate { message?: TelegramMessage; } 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}


console.log("Função whatsapp-webhook iniciada.");

serve(async (req: Request) => { 
  console.log(`Recebida requisição: Método=${req.method}, URL=${req.url}`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const verifyTokenFromSecrets = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
  if (!verifyTokenFromSecrets) {
       console.error("ERRO GRAVE: WHATSAPP_VERIFY_TOKEN não encontrado nos segredos!");
       return new Response('Configuração interna: Token de verificação não encontrado.', { status: 500 });
  }

  const url = new URL(req.url);

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

  if (req.method === 'POST') {
    console.log("Recebida requisição POST (mensagem WhatsApp).");
    let organizeJaUserId: string | null = null;
    let senderPhoneNumber: string | null = null;

    try {
      const body = await req.json();
      console.log("Corpo POST recebido:", JSON.stringify(body, null, 2));

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

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase URL/Key não encontradas no env.");
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      console.log("Cliente Supabase Admin criado.");

      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('phone_number', senderPhoneNumber)
        .single();

      if (profileError || !profileData) {
        console.error(`Número ${senderPhoneNumber} não encontrado/vinculado.`, profileError);
        return new Response('USER_NOT_FOUND_OR_LINKED', { status: 200 }); // Responde OK pro WhatsApp
      }
      organizeJaUserId = profileData.id;
      console.log(`Usuário encontrado: ${organizeJaUserId} para ${senderPhoneNumber}`);

      const parts: string[] = messageText.split(' ');
      const command: string | undefined = parts[0]?.toLowerCase();
      console.log(`Verificando formato: Comando='${command}', Parts Length=${parts.length}`);

      if ((command !== '/despesa' && command !== '/receita') || parts.length < 3) {
        console.log("Formato inválido para transação.");
        return new Response('INVALID_TRANSACTION_FORMAT', { status: 200 });
      }

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
        return new Response('INVALID_VALUE', { status: 200 });
      }

      console.log(`Tentando inserir: User=${organizeJaUserId}, Tipo=${tipo}, Valor=${valor}, Desc=${descricaoFinal}, Cat=${categoriaFinal}`);
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('transacoes')
        .insert({
          user_id: organizeJaUserId, tipo, valor,
          descricao: descricaoFinal, categoria: categoriaFinal,
          data: new Date().toISOString(),
        })
        .select(); 

      if (insertError) {
        console.error('ERRO AO INSERIR TRANSAÇÃO:', insertError);
        return new Response('DB_INSERT_ERROR', { status: 200 }); // Responde OK pro WhatsApp
      }

      console.log("INSERÇÃO NO BANCO REPORTADA COMO SUCESSO.");
      console.log("Dados retornados pelo insert:", JSON.stringify(insertedData, null, 2));

      console.log("Tentativa de envio de confirmação (opcional)...");

      return new Response('EVENT_RECEIVED', { status: 200, headers: corsHeaders });

    } catch (error) {
      console.error("ERRO GERAL NO PROCESSAMENTO POST:", error);
      return new Response('INTERNAL_SERVER_ERROR', { status: 200, headers: corsHeaders });
    }
  }

  console.log("Método não suportado ou requisição inválida.");
  return new Response('Method Not Allowed or Invalid Request', { status: 405, headers: corsHeaders });
})