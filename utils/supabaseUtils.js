import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getUserData(userId) {
  const { data, error } = await supabase
    .from('escrowuser')
    .select('*')
    .eq('userid', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function getProjects(userId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or(`creator_id.eq.${userId},invited_user_id.eq.${userId}`);
  
  if (error) throw error;
  return data;
}

export async function getProjectDetails(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      offers(*),
      messages(*),
      work_submissions(*)
    `)
    .eq('id', projectId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createOffer(offerData) {
  const { data, error } = await supabase
    .from('offers')
    .insert(offerData)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function updateOfferStatus(offerId, status) {
  const { data, error } = await supabase
    .from('offers')
    .update({ status })
    .eq('id', offerId)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function sendMessage(messageData) {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function submitWork(submissionData) {
  const { data, error } = await supabase
    .from('work_submissions')
    .insert(submissionData)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function updateWorkSubmissionStatus(submissionId, status) {
  const { data, error } = await supabase
    .from('work_submissions')
    .update({ status })
    .eq('id', submissionId)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function createPayment(paymentData) {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function updatePaymentStatus(paymentId, status, paypalTransactionId) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status, paypal_transaction_id: paypalTransactionId })
    .eq('id', paymentId)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function searchUsers(query) {
  const { data, error } = await supabase
    .from('escrowuser')
    .select('userid, email')
    .ilike('email', `%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data;
}