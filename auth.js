import {createClient} from '@supabase/supabase-js';
const cfg=window.QUEST_CONFIG||{};
export const configured=Boolean(cfg.supabaseUrl&&cfg.supabasePublishableKey);
export const client=configured?createClient(cfg.supabaseUrl,cfg.supabasePublishableKey):null;
export async function loadProgress(){const {data,error}=await client.from('quest_progress').select('state,revision').maybeSingle();if(error)throw error;return data;}
export async function saveProgress(state,revision){const {data,error}=await client.rpc('save_quest_progress',{new_state:state,expected_revision:revision});if(error)throw error;return data;}
export async function signUp(email,password,name,alias,character='male'){const {data,error}=await client.auth.signUp({email,password,options:{data:{name,alias,character:character==='female'?'female':'male'},emailRedirectTo:location.origin+location.pathname}});if(error)throw error;return data;}
export async function signIn(email,password){const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;return data;}
