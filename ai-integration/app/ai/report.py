from .providers import LLMClient
from .prompts import REPORT_SYSTEM, REPORT_USER_FMT, SCHEMA_HINT
from ..config import LLM_PRIMARY, LLM_FALLBACK

def _choose_client():
    try:
        return LLMClient(LLM_PRIMARY)
    except Exception:
        return LLMClient(LLM_FALLBACK)

def generate_weekly_report(aggregates, dollar_table, co2e_table, forecast_summary):
    user = REPORT_USER_FMT.format(
        aggregates=aggregates,
        dollar_table=dollar_table,
        co2e_table=co2e_table,
        forecast_summary=forecast_summary,
    )
    client = _choose_client()
    return client.complete_json(REPORT_SYSTEM, user, SCHEMA_HINT)
