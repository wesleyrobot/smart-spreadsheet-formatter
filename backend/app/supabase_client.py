"""
Cliente Supabase - Conexão com banco de dados
"""
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Configure SUPABASE_URL e SUPABASE_KEY no .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print(f"✅ Conectado ao Supabase: {SUPABASE_URL}")

def get_supabase() -> Client:
    return supabase
