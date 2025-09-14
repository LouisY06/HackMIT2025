from typing import Literal, Dict, Any
from . import prompts
from ..config import (
    OPENAI_API_KEY, ANTHROPIC_API_KEY,
    OPENAI_MODEL, ANTHROPIC_MODEL,
)

class LLMClient:
    def __init__(self, provider: Literal["openai","anthropic"]):
        self.provider = provider
        if provider == "openai":
            from openai import OpenAI
            self.client = OpenAI(api_key=OPENAI_API_KEY)
        elif provider == "anthropic":
            import anthropic
            self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        else:
            raise ValueError("Unsupported provider")

    def complete_json(self, system: str, user: str, schema_hint: str) -> Dict[str, Any]:
        """Ask model for structured JSON; includes a schema hint string to steer shape."""
        if self.provider == "openai":
            resp = self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role":"system","content": system + "\nReturn ONLY valid JSON."},
                    {"role":"user","content": user + f"\n\nJSON schema (informal):\n{schema_hint}"}
                ],
                temperature=0.2,
            )
            import json
            return json.loads(resp.choices[0].message.content)
        else:  # anthropic
            msg = self.client.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=2000,
                temperature=0.2,
                system=system + "\nReturn ONLY valid JSON.",
                messages=[{"role":"user","content": user + f"\n\nJSON schema (informal):\n{schema_hint}"}],
            )
            import json
            # Anthropics returns a list of content blocks; take the text
            text = "".join([b.text for b in msg.content if hasattr(b, "text")])
            return json.loads(text)
