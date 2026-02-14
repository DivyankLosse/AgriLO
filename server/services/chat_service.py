import os
from groq import Groq
from config import settings
from typing import List

class ChatService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
            self.model = "llama-3.1-8b-instant"
        else:
            print("⚠️ GROQ_API_KEY not found. Chat will not work.")
            self.client = None

    async def get_response(self, message: str, history: List[dict] = [], language: str = "en"):
        if not self.client:
            return "AI Service Unavailable. Please configure API Key."

        try:
            # Construct System Prompt
            system_prompt = f"""
            You are 'Agri-Lo', an expert agricultural assistant for Indian farmers. 
            Answer in {language} language effectively.
            Keep answers short (max 3-4 sentences unless detailed step-by-step is asked).
            Use simple, clear language. Avoid technical jargon.
            If the user asks about crop diseases, ask for an image if not provided context.
            Be friendly and encouraging.
            """
            
            messages = [{"role": "system", "content": system_prompt}]
            
            # Append history (simple) - for now just current message as we are stateless here mostly
            # In a real app we'd map history properly
            messages.append({"role": "user", "content": message})
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
                top_p=1,
                stop=None,
                stream=False
            )
            
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Sorry, I am having trouble connecting to the AI expert right now."

chat_service = ChatService()
