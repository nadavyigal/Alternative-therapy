# 📊 Automation Cowork Dashboard

A beautiful, real-time web dashboard to monitor and manage your automation workflows.

## 🚀 Quick Start

### Windows
Double-click `start_dashboard.bat` or run:
```bash
start_dashboard.bat
```

### Mac/Linux
```bash
chmod +x start_dashboard.sh
./start_dashboard.sh
```

### Manual Start
```bash
python dashboard_api.py
```

Then open your browser to: **http://localhost:8000**

---

## ✨ Features

- **Real-time monitoring** - Auto-refreshes every 10 seconds
- **Beautiful UI** - Modern, responsive design with purple gradient
- **Job tracking** - See all your automation runs in one place
- **System status** - Check if API and database are healthy
- **Quick actions** - Test webhooks, run pipelines, view logs
- **Color-coded badges** - Quickly identify job status
- **Mobile-friendly** - Works on phones and tablets

---

## 📸 What You'll See

### Dashboard Metrics
- **Total Jobs** - Lifetime automation executions
- **Running** - Currently active jobs
- **Completed** - Successfully finished
- **Failed** - Jobs that need attention

### Recent Jobs List
Shows your last 20 automation runs with:
- Automation name
- Status (color-coded)
- Details (email, company, rows processed)
- Timestamp
- Error messages (if failed)

### System Status
- API connection status
- Database connection status
- Real-time health checks

### Quick Actions
- **Test Lead Enrichment** - Try enriching a sample email
- **Run ETL Pipeline** - Manually trigger data sync
- **View Logs** - See detailed system logs
- **Clear Failed Jobs** - Remove old failures

---

## 🔧 Configuration

The dashboard connects to your automation system via REST API.

**Default endpoints:**
- Dashboard UI: `http://localhost:8000`
- API Health: `http://localhost:8000/health`
- Statistics: `http://localhost:8000/api/dashboard/stats`
- Jobs: `http://localhost:8000/api/dashboard/jobs`
- Logs: `http://localhost:8000/api/dashboard/logs`

---

## 🎨 Customization

### Colors
Edit `index.html` CSS variables to change the color scheme:
```css
/* Purple gradient (default) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Blue gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Green gradient */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

### Refresh Rate
Change auto-refresh interval in `index.html`:
```javascript
// Default: 10 seconds (10000ms)
refreshInterval = setInterval(loadDashboard, 10000);

// Faster: 5 seconds
refreshInterval = setInterval(loadDashboard, 5000);
```

---

## 📡 API Integration

The dashboard is designed to work with your automation system. To integrate with actual data:

### Option 1: Standalone (Current)
The dashboard runs independently with mock data. Good for testing!

### Option 2: Integrated (Production)
Uncomment the database integration code in `dashboard_api.py`:

```python
# Replace this:
return {
    "total": 15,
    "running": 2,
    "completed": 10,
    "failed": 3
}

# With this:
from src.core.database import get_db_session
from src.core.models import AutomationRun

with get_db_session() as session:
    total = session.query(AutomationRun).count()
    # ... etc
```

---

## 🐛 Troubleshooting

### Dashboard won't load
1. Make sure the server is running: `python dashboard_api.py`
2. Check port 8000 isn't used: `netstat -ano | findstr :8000`
3. Try: `http://127.0.0.1:8000` instead

### "API: Offline" error
1. Check if the API server is running
2. Verify the API_BASE URL in `index.html` is correct
3. Check browser console for errors (F12)

### Database shows offline
1. Start database: `docker-compose up -d`
2. Verify it's running: `docker ps | grep automation-db`
3. Check connection string in `.env`

### Jobs not showing
1. Make sure you've run at least one automation
2. Check if database has data: `docker exec -it automation-db psql -U automation_user -d automation_cowork -c "SELECT COUNT(*) FROM automation_runs;"`
3. Verify API endpoints are returning data

---

## 📝 Files

- **index.html** - Dashboard UI (HTML/CSS/JavaScript)
- **dashboard_api.py** - FastAPI server with REST endpoints
- **start_dashboard.bat** - Windows launcher script
- **start_dashboard.sh** - Mac/Linux launcher script
- **README.md** - This file

---

## 🔐 Security Notes

**For Development:**
- CORS is enabled for all origins (allow_origins=["*"])
- No authentication required

**For Production:**
- Add authentication middleware
- Restrict CORS to specific domains
- Use HTTPS
- Add rate limiting
- Implement API keys

---

## 🎯 Next Steps

1. ✅ Start the dashboard
2. ✅ Open http://localhost:8000
3. ✅ Test the webhook with sample data
4. ✅ Check the logs
5. ✅ Customize the colors if you want
6. ✅ Integrate with your real automation database

---

## 📚 Related Documentation

- **USER_GUIDE.md** - User-friendly guide for non-technical users
- **CLAUDE.md** - Full technical documentation
- **README.md** (main) - Project overview

---

## 💡 Tips

- Keep the dashboard open during development to monitor jobs in real-time
- Use the refresh button (bottom-right) if data seems stale
- Check logs frequently when debugging
- Clear failed jobs weekly to keep the dashboard clean

---

**Built with ❤️ using FastAPI + Vanilla JavaScript**

*Simple, fast, and beautiful - no frameworks needed!*
