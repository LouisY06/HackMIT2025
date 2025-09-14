from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import date, timedelta
import logging
from ..db import SessionLocal
from ..models import MetricsDaily, WasteLog, Pickup, Distribution
from ..ml.train import train_all_models
from ..ml.predict import batch_predict_all_models
from ..services.finance import calculate_retail_value
from ..services.carbon import calculate_co2e_factor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone="America/New_York")

def materialize_daily_metrics():
    """Nightly job to materialize daily metrics from raw events."""
    logger.info("Starting nightly metrics materialization")
    
    db = SessionLocal()
    try:
        yesterday = date.today() - timedelta(days=1)
        
        # Get all store-item combinations that had activity yesterday
        waste_logs = db.query(WasteLog).filter(
            WasteLog.event_ts >= yesterday,
            WasteLog.event_ts < yesterday + timedelta(days=1)
        ).all()
        
        pickups = db.query(Pickup).filter(
            Pickup.scanned_ts >= yesterday,
            Pickup.scanned_ts < yesterday + timedelta(days=1)
        ).all()
        
        distributions = db.query(Distribution).filter(
            Distribution.confirmed_ts >= yesterday,
            Distribution.confirmed_ts < yesterday + timedelta(days=1)
        ).all()
        
        # Group by store_id and item_id
        metrics_by_key = {}
        
        # Process waste logs
        for log in waste_logs:
            key = (log.store_id, log.item_id)
            if key not in metrics_by_key:
                metrics_by_key[key] = {
                    'store_id': log.store_id,
                    'item_id': log.item_id,
                    'kg_waste': 0,
                    'kg_collected': 0,
                    'kg_distributed': 0,
                    'dollar_loss': 0,
                    'co2e_kg': 0
                }
            metrics_by_key[key]['kg_waste'] += log.kg
            
            # Calculate dollar loss and CO2e
            item = log.item
            dollar_loss = calculate_retail_value(item.category, log.kg)
            co2e = calculate_co2e_factor(item.category) * log.kg
            metrics_by_key[key]['dollar_loss'] += dollar_loss
            metrics_by_key[key]['co2e_kg'] += co2e
        
        # Process pickups (collected)
        for pickup in pickups:
            key = (pickup.store_id, pickup.item_id)
            if key not in metrics_by_key:
                metrics_by_key[key] = {
                    'store_id': pickup.store_id,
                    'item_id': pickup.item_id,
                    'kg_waste': 0,
                    'kg_collected': 0,
                    'kg_distributed': 0,
                    'dollar_loss': 0,
                    'co2e_kg': 0
                }
            metrics_by_key[key]['kg_collected'] += pickup.kg
        
        # Process distributions
        for dist in distributions:
            # For distributions, we need to map back to store_id
            # This is simplified - in reality you'd track the flow
            key = (1, dist.item_id)  # Assuming store_id 1 for now
            if key not in metrics_by_key:
                metrics_by_key[key] = {
                    'store_id': 1,
                    'item_id': dist.item_id,
                    'kg_waste': 0,
                    'kg_collected': 0,
                    'kg_distributed': 0,
                    'dollar_loss': 0,
                    'co2e_kg': 0
                }
            metrics_by_key[key]['kg_distributed'] += dist.kg
        
        # Save metrics to database
        for (store_id, item_id), metrics in metrics_by_key.items():
            existing = db.query(MetricsDaily).filter(
                MetricsDaily.date == yesterday,
                MetricsDaily.store_id == store_id,
                MetricsDaily.item_id == item_id
            ).first()
            
            if existing:
                # Update existing
                existing.kg_waste = metrics['kg_waste']
                existing.kg_collected = metrics['kg_collected']
                existing.kg_distributed = metrics['kg_distributed']
                existing.dollar_loss = metrics['dollar_loss']
                existing.co2e_kg = metrics['co2e_kg']
            else:
                # Create new
                daily_metric = MetricsDaily(
                    date=yesterday,
                    store_id=store_id,
                    item_id=item_id,
                    kg_waste=metrics['kg_waste'],
                    kg_collected=metrics['kg_collected'],
                    kg_distributed=metrics['kg_distributed'],
                    dollar_loss=metrics['dollar_loss'],
                    co2e_kg=metrics['co2e_kg']
                )
                db.add(daily_metric)
        
        db.commit()
        logger.info(f"Materialized metrics for {len(metrics_by_key)} store-item combinations")
        
    except Exception as e:
        logger.error(f"Error in nightly metrics job: {e}")
        db.rollback()
    finally:
        db.close()

def weekly_training_and_forecasting():
    """Weekly job to retrain models and generate forecasts."""
    logger.info("Starting weekly training and forecasting")
    
    db = SessionLocal()
    try:
        # Train all models
        training_results = train_all_models(db)
        logger.info(f"Trained {len(training_results)} models")
        
        # Generate forecasts
        forecast_results = batch_predict_all_models(db)
        logger.info(f"Generated {forecast_results.get('predictions_created', 0)} forecasts")
        
    except Exception as e:
        logger.error(f"Error in weekly training job: {e}")
    finally:
        db.close()

# Schedule jobs
scheduler.add_job(
    materialize_daily_metrics,
    CronTrigger(hour=2, minute=0),  # 2:00 AM daily
    id='daily_metrics'
)

scheduler.add_job(
    weekly_training_and_forecasting,
    CronTrigger(day_of_week='sun', hour=3, minute=0),  # Sunday 3:00 AM
    id='weekly_training'
)

def start_scheduler():
    """Start the scheduler."""
    scheduler.start()
    logger.info("Scheduler started")

def stop_scheduler():
    """Stop the scheduler."""
    scheduler.shutdown()
    logger.info("Scheduler stopped")
