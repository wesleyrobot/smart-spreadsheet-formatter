# No início da função unified_ai_assistant, adicionar:

# Detectar MODO COMERCIAL
if 'comercial' in command_lower or 'formato comercial' in command_lower:
    print("🏢 MODO COMERCIAL DETECTADO")
    
    response = await comercial_format({"data": data})
    return response

# Detectar DIVIDIR PLANILHA
if 'dividir' in command_lower and ('planilha' in command_lower or 'partes' in command_lower):
    print("📊 DIVIDIR PLANILHA DETECTADO")
    
    # Extrair número de partes
    match = re.search(r'(\d+)\s*(?:planilhas?|partes?)', command_lower)
    partes = int(match.group(1)) if match else 8
    
    response = await dividir_planilha({"data": data, "partes": partes})
    return response
