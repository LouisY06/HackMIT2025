import streamlit as st
import pandas as pd
import requests
import json
from datetime import date, timedelta
import plotly.express as px
import plotly.graph_objects as go

# Configuration
API_BASE_URL = "http://localhost:8000"
DASHBOARD_TOKEN = "super_secret_token"  # In production, this would be from env

# Authentication
def check_auth():
    if 'authenticated' not in st.session_state:
        token = st.text_input("Enter dashboard token:", type="password")
        if st.button("Login"):
            if token == DASHBOARD_TOKEN:
                st.session_state.authenticated = True
                st.rerun()
            else:
                st.error("Invalid token")
        return False
    return True

def main():
    st.set_page_config(
        page_title="Reflourish AI Dashboard",
        page_icon="🌱",
        layout="wide"
    )
    
    if not check_auth():
        return
    
    st.title("🌱 Reflourish AI Integration Dashboard")
    st.markdown("---")
    
    # Sidebar navigation
    st.sidebar.header("Navigation")
    view = st.sidebar.radio("Select View", [
        "🏪 Stores", 
        "👥 Volunteers", 
        "🏠 Foodbanks", 
        "🤖 AI Report",
        "📊 Analytics"
    ])
    
    if view == "🏪 Stores":
        show_stores_view()
    elif view == "👥 Volunteers":
        show_volunteers_view()
    elif view == "🏠 Foodbanks":
        show_foodbanks_view()
    elif view == "🤖 AI Report":
        show_ai_report_view()
    elif view == "📊 Analytics":
        show_analytics_view()

def show_stores_view():
    st.header("🏪 Store Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        store_id = st.number_input("Store ID", min_value=1, value=1)
        days_back = st.slider("Days to analyze", 1, 30, 7)
    
    with col2:
        if st.button("🔍 Analyze Store"):
            analyze_store(store_id, days_back)

def analyze_store(store_id: int, days: int):
    """Analyze a specific store's performance."""
    end_date = date.today()
    start_date = end_date - timedelta(days=days-1)
    
    try:
        # Get daily metrics
        response = requests.get(f"{API_BASE_URL}/metrics/daily", params={
            "store_id": store_id,
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        })
        
        if response.status_code == 200:
            metrics = response.json()
            
            if metrics:
                df = pd.DataFrame(metrics)
                
                # Summary metrics
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total Waste", f"{df['kg_waste'].sum():.1f} kg")
                with col2:
                    st.metric("Total Collected", f"{df['kg_collected'].sum():.1f} kg")
                with col3:
                    st.metric("Dollar Loss", f"${df['dollar_loss'].sum():.2f}")
                with col4:
                    st.metric("CO2e Prevented", f"{df['co2e_kg'].sum():.1f} kg")
                
                # Charts
                col1, col2 = st.columns(2)
                
                with col1:
                    # Waste over time
                    fig = px.line(df, x='date', y='kg_waste', title='Daily Waste (kg)')
                    st.plotly_chart(fig, use_container_width=True)
                
                with col2:
                    # Dollar loss over time
                    fig = px.line(df, x='date', y='dollar_loss', title='Daily Dollar Loss ($)')
                    st.plotly_chart(fig, use_container_width=True)
                
                # Efficiency score
                efficiency = (df['kg_collected'].sum() / df['kg_waste'].sum() * 100) if df['kg_waste'].sum() > 0 else 0
                st.metric("Collection Efficiency", f"{efficiency:.1f}%")
                
            else:
                st.warning(f"No data found for Store {store_id}")
        else:
            st.error("Failed to fetch store data")
            
    except Exception as e:
        st.error(f"Error analyzing store: {e}")

def show_volunteers_view():
    st.header("👥 Volunteer Performance")
    st.info("Volunteer analytics coming soon...")

def show_foodbanks_view():
    st.header("🏠 Foodbank Management")
    st.info("Foodbank analytics coming soon...")

def show_ai_report_view():
    st.header("🤖 AI-Generated Weekly Report")
    
    col1, col2 = st.columns([1, 3])
    
    with col1:
        store_id = st.number_input("Store ID for Report", min_value=1, value=1)
        if st.button("📝 Generate AI Report"):
            generate_ai_report(store_id)
    
    with col2:
        st.info("AI reports provide insights, recommendations, and predictions based on historical data and ML models.")

def generate_ai_report(store_id: int):
    """Generate and display AI report."""
    try:
        with st.spinner("Generating AI report..."):
            response = requests.get(f"{API_BASE_URL}/reports/weekly/{store_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Key findings
                st.subheader("🔍 Key Findings")
                for finding in data.get("key_findings", []):
                    st.write(f"• {finding}")
                
                # Report content
                st.subheader("📊 Detailed Report")
                st.markdown(data.get("report", "No report generated"))
                
                # Store actions
                if data.get("store_actions"):
                    st.subheader("🎯 Recommended Actions")
                    for action in data["store_actions"]:
                        st.write(f"**Store {action.get('store_id')}:**")
                        for act in action.get("actions", []):
                            st.write(f"• {act}")
                
                # Order changes
                if data.get("next_week_order_changes"):
                    st.subheader("📦 Recommended Order Changes")
                    df_changes = pd.DataFrame(data["next_week_order_changes"])
                    st.dataframe(df_changes)
                
                # Risks
                if data.get("risks"):
                    st.subheader("⚠️ Risk Factors")
                    for risk in data["risks"]:
                        st.write(f"• {risk}")
                        
            else:
                st.error("Failed to generate AI report")
                
    except Exception as e:
        st.error(f"Error generating report: {e}")

def show_analytics_view():
    st.header("📊 Platform Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 Trends")
        st.info("Platform-wide analytics coming soon...")
    
    with col2:
        st.subheader("🎯 Forecasts")
        st.info("Forecasting dashboard coming soon...")

if __name__ == "__main__":
    main()
