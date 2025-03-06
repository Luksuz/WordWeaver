from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(supabase_url=os.getenv("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
