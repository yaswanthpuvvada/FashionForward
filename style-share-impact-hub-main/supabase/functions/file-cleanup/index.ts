
// This edge function cleans up orphaned files in storage
// It will be triggered by a cron job (not implemented yet)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    // Get all files in products bucket
    const { data: productFiles, error: productFilesError } = await supabaseClient
      .storage
      .from('products')
      .list()
      
    if (productFilesError) {
      throw productFilesError
    }
    
    // Get all files in donations bucket
    const { data: donationFiles, error: donationFilesError } = await supabaseClient
      .storage
      .from('donations')
      .list()
      
    if (donationFilesError) {
      throw donationFilesError
    }
    
    // Log the number of files found
    console.log(`Found ${productFiles.length} files in products bucket`)
    console.log(`Found ${donationFiles.length} files in donations bucket`)
    
    return new Response(
      JSON.stringify({ 
        message: 'File cleanup function executed successfully',
        products_files_count: productFiles.length,
        donation_files_count: donationFiles.length
      }),
      { 
        headers: { ...corsHeaders,  'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in file-cleanup function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
