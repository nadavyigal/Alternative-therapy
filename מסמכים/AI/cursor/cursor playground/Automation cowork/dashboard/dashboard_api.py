"""
Dashboard API routes for Automation Cowork
Serves the dashboard UI and provides data endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Dict, List, Any
import os

# Note: Update these imports based on your actual project structure
# from src.core.database import get_db_session
# from src.core.models import AutomationRun, LeadEnrichmentJob, PipelineExecution

# For now, we'll create a standalone dashboard that can work independently
app = FastAPI(title="Automation Cowork Dashboard")

# Enable CORS for dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get dashboard directory
DASHBOARD_DIR = Path(__file__).parent
LOG_FILE = Path("logs/automation.log")


@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    """Serve the main dashboard HTML"""
    html_file = DASHBOARD_DIR / "index.html"
    if not html_file.exists():
        raise HTTPException(status_code=404, detail="Dashboard not found")

    with open(html_file, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "automation-cowork-dashboard"}


@app.get("/api/dashboard/stats")
async def get_stats() -> Dict[str, int]:
    """Get dashboard statistics"""
    try:
        # TODO: Replace with actual database queries
        # For now, return mock data
        return {
            "total": 15,
            "running": 2,
            "completed": 10,
            "failed": 3,
            "pending": 0
        }

        # Example with actual DB (uncomment when integrated):
        # from src.core.database import get_db_session
        # from src.core.models import AutomationRun
        #
        # with get_db_session() as session:
        #     total = session.query(AutomationRun).count()
        #     running = session.query(AutomationRun).filter(
        #         AutomationRun.status == "running"
        #     ).count()
        #     completed = session.query(AutomationRun).filter(
        #         AutomationRun.status == "completed"
        #     ).count()
        #     failed = session.query(AutomationRun).filter(
        #         AutomationRun.status == "failed"
        #     ).count()
        #
        #     return {
        #         "total": total,
        #         "running": running,
        #         "completed": completed,
        #         "failed": failed
        #     }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")


@app.get("/api/dashboard/jobs")
async def get_recent_jobs(limit: int = 20) -> List[Dict[str, Any]]:
    """Get recent automation jobs"""
    try:
        # TODO: Replace with actual database queries
        # For now, return mock data
        from datetime import datetime, timedelta

        mock_jobs = [
            {
                "id": 1,
                "automation_name": "Lead Enrichment",
                "status": "completed",
                "email": "john@example.com",
                "company": "Acme Inc",
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                "error_message": None
            },
            {
                "id": 2,
                "automation_name": "ETL Pipeline",
                "status": "running",
                "rows_extracted": 150,
                "created_at": (datetime.now() - timedelta(minutes=30)).isoformat(),
                "error_message": None
            },
            {
                "id": 3,
                "automation_name": "Lead Enrichment",
                "status": "failed",
                "email": "test@test.com",
                "created_at": (datetime.now() - timedelta(hours=5)).isoformat(),
                "error_message": "API quota exceeded for Hunter.io"
            }
        ]

        return mock_jobs[:limit]

        # Example with actual DB (uncomment when integrated):
        # from src.core.database import get_db_session
        # from src.core.models import AutomationRun, LeadEnrichmentJob
        #
        # with get_db_session() as session:
        #     jobs = []
        #
        #     # Get automation runs
        #     runs = session.query(AutomationRun).order_by(
        #         AutomationRun.created_at.desc()
        #     ).limit(limit).all()
        #
        #     for run in runs:
        #         job_data = {
        #             "id": run.id,
        #             "automation_name": run.automation_name,
        #             "status": run.status,
        #             "created_at": run.started_at.isoformat(),
        #             "error_message": run.error_message
        #         }
        #
        #         # Get additional details for lead enrichment
        #         if run.automation_name == "lead_enrichment":
        #             enrichment = session.query(LeadEnrichmentJob).filter(
        #                 LeadEnrichmentJob.run_id == run.id
        #             ).first()
        #             if enrichment:
        #                 job_data.update({
        #                     "email": enrichment.email,
        #                     "company": enrichment.company
        #                 })
        #
        #         jobs.append(job_data)
        #
        #     return jobs

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")


@app.get("/api/dashboard/logs", response_class=PlainTextResponse)
async def get_logs(lines: int = 100):
    """Get recent log entries"""
    try:
        if not LOG_FILE.exists():
            return "No logs found. Log file: " + str(LOG_FILE)

        with open(LOG_FILE, "r", encoding="utf-8") as f:
            all_lines = f.readlines()
            recent_lines = all_lines[-lines:]
            return "".join(recent_lines)

    except Exception as e:
        return f"Error reading logs: {str(e)}"


@app.post("/api/dashboard/clear-failed")
async def clear_failed_jobs():
    """Clear all failed jobs from database"""
    try:
        # TODO: Implement actual database cleanup
        return {"message": "Failed jobs cleared", "count": 0}

        # Example with actual DB (uncomment when integrated):
        # from src.core.database import get_db_session
        # from src.core.models import AutomationRun
        #
        # with get_db_session() as session:
        #     deleted = session.query(AutomationRun).filter(
        #         AutomationRun.status == "failed"
        #     ).delete()
        #     session.commit()
        #
        #     return {"message": "Failed jobs cleared", "count": deleted}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear jobs: {str(e)}")


# Integration endpoints (to be used by the existing automation system)

@app.post("/api/webhook/lead")
async def lead_webhook_integration(data: Dict[str, Any]):
    """
    Integration endpoint for lead enrichment
    This should forward to your actual webhook handler
    """
    try:
        # TODO: Import and call your actual webhook handler
        # from src.automations.lead_enrichment.webhook import handle_lead
        # result = await handle_lead(data)
        # return result

        return {
            "status": "accepted",
            "message": "Lead enrichment job queued",
            "job_id": "mock-123"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/pipelines/run")
async def run_pipeline():
    """
    Integration endpoint to manually trigger ETL pipeline
    """
    try:
        # TODO: Import and call your ETL job
        # from src.automations.data_pipelines.etl_job import run_etl
        # result = await run_etl()
        # return result

        return {
            "status": "started",
            "message": "ETL pipeline started",
            "job_id": "mock-etl-456"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("🚀 Automation Cowork Dashboard Server")
    print("=" * 60)
    print(f"Dashboard URL: http://localhost:8000")
    print(f"API Health: http://localhost:8000/health")
    print(f"Logs: http://localhost:8000/api/dashboard/logs")
    print("=" * 60)
    print("\nPress Ctrl+C to stop the server")
    print()

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
