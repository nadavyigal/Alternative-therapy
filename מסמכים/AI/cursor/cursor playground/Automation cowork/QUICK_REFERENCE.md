# 🚀 Automation Cowork - Quick Reference Card

**Keep this handy! Print it or bookmark it!**

---

## ⚡ Starting the System (2 Simple Steps)

### Step 1: Start Database
```bash
docker-compose up -d
```
✅ Starts PostgreSQL database on port 5433

### Step 2: Start Dashboard
```bash
cd dashboard
python dashboard_api.py
```
✅ Starts web dashboard on http://localhost:8000

**Or just double-click:** `dashboard/start_dashboard.bat` (Windows)

---

## 🌐 Important URLs

| Service | URL | Login |
|---------|-----|-------|
| **Dashboard** | http://localhost:8000 | None needed |
| **Database Admin** | http://localhost:5051 | admin@automation-cowork.local / admin |
| **API Health** | http://localhost:8000/health | None needed |
| **Logs** | http://localhost:8000/api/dashboard/logs | None needed |

---

## 📊 Dashboard Quick Actions

Click these buttons to:
- **📨 Test Lead Enrichment** - Try enriching a sample email
- **🔄 Run ETL Pipeline** - Manually sync data
- **📋 View Logs** - See what's happening
- **🗑️ Clear Failed Jobs** - Clean up old errors
- **🔄 (bottom right)** - Refresh data manually

---

## 🎯 What Each Automation Does

### Lead Enrichment
- **Trigger:** When someone submits a form
- **What it does:** Finds their job title, company, phone, LinkedIn
- **How long:** ~2-5 seconds
- **Runs:** Immediately when triggered

### Data Pipeline
- **Trigger:** Automatic (2 AM daily)
- **What it does:** Syncs data between databases
- **How long:** 5-30 minutes (depends on data size)
- **Runs:** Nightly at 2 AM Asia/Jerusalem

---

## 🎨 Status Badge Colors

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 **Green** | Running | Job is working right now |
| 🔵 **Blue** | Completed | Job finished successfully |
| 🔴 **Red** | Failed | Something went wrong |
| 🟡 **Yellow** | Pending | Waiting to start |

---

## 🔑 API Keys You Need

Get free API keys from:

1. **Hunter.io** → https://hunter.io/
   - Free: 100 searches/month
   - Used for: Finding emails

2. **Clearbit** → https://clearbit.com/
   - Free: 50 leads/month
   - Used for: Company info

3. **Apollo.io** → https://www.apollo.io/
   - Free: 10 credits/month
   - Used for: Contact data

**Where to put them:** In the `.env` file at the project root

---

## 🛠️ Common Commands

### Check if database is running
```bash
docker ps | grep automation-db
```

### View recent logs
```bash
tail -f logs/automation.log
```

### Restart database
```bash
docker-compose restart
```

### Access database directly
```bash
docker exec -it automation-db psql -U automation_user -d automation_cowork
```

### Test webhook manually
```bash
curl -X POST http://localhost:8000/api/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","company":"Test Co"}'
```

---

## 🚨 Troubleshooting - First Steps

| Problem | Quick Fix |
|---------|-----------|
| Dashboard won't open | Run: `python dashboard/dashboard_api.py` |
| "API Offline" | Check if server is running (see above) |
| "Database Offline" | Run: `docker-compose up -d` |
| Jobs all failing | Check if API keys are in `.env` file |
| Can't find .env file | It's in the project root folder |

---

## 📝 File Locations

```
automation-cowork/
├── dashboard/              ← Dashboard files
│   ├── index.html         ← Dashboard UI
│   ├── dashboard_api.py   ← Server
│   └── start_dashboard.bat ← Quick launcher
├── .env                   ← Configuration (API keys)
├── logs/
│   └── automation.log     ← System logs
├── USER_GUIDE.md          ← Simple guide
├── CLAUDE.md              ← Technical docs
└── QUICK_REFERENCE.md     ← This file!
```

---

## 💡 Pro Tips

1. **Keep dashboard open** - Auto-refreshes every 10 seconds
2. **Check logs daily** - Catch issues early
3. **Monitor API quotas** - Free tiers have monthly limits
4. **Test before production** - Use the test button first!
5. **Clear failed jobs weekly** - Keep dashboard clean

---

## 📞 Getting Help

### Steps to debug:
1. Check the dashboard - what's the error message?
2. Click **📋 View Logs** - read the latest entries
3. Read [USER_GUIDE.md](USER_GUIDE.md) - detailed help
4. Check [CLAUDE.md](CLAUDE.md) - technical details

### Common error messages:
- **"API quota exceeded"** → Wait until next month or upgrade plan
- **"Connection refused"** → Service not running
- **"Invalid API key"** → Check `.env` file
- **"Database error"** → Database not started

---

## 🎯 Daily Checklist

Morning routine (2 minutes):
- [ ] Open http://localhost:8000
- [ ] Check if any jobs failed (red badges)
- [ ] Look at "Failed" counter - should be 0 or low
- [ ] Click **📋 View Logs** - scan for errors
- [ ] If everything green, you're good! ✅

Weekly routine (5 minutes):
- [ ] Check API usage (don't exceed free tier)
- [ ] Click **🗑️ Clear Failed Jobs**
- [ ] Review completed jobs count
- [ ] Update API keys if expiring soon

---

## ⚙️ Configuration Files

### .env (Main configuration)
```env
# Database
DATABASE_URL=postgresql://...

# Lead Enrichment
HUNTER_API_KEY=your_key_here
CLEARBIT_API_KEY=your_key_here
APOLLO_API_KEY=your_key_here

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@gmail.com
NOTIFY_EMAIL=your_email@gmail.com
```

### When to edit .env:
- Adding new API keys
- Changing email settings
- Modifying database connection
- Adjusting schedule times

---

## 🎨 Customizing the Dashboard

Want to change colors? Edit `dashboard/index.html`:

```css
/* Find this line: */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Replace with: */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); /* Blue */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* Green */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); /* Pink */
```

---

## 📅 Auto-Schedule

The system runs automatically:
- **Lead Enrichment:** Instant (webhook-triggered)
- **Data Pipeline:** 2 AM daily (Asia/Jerusalem timezone)
- **Health Checks:** Every 10 seconds (on dashboard)
- **Email Alerts:** When jobs complete/fail

---

## 🔐 Security Reminders

- ⚠️ Never commit `.env` file to GitHub
- ⚠️ Change default PostgreSQL password before production
- ⚠️ Add authentication if exposing dashboard to internet
- ⚠️ Keep API keys secret
- ⚠️ Use HTTPS in production

---

## 📱 Mobile Access

The dashboard is mobile-friendly! Access from your phone:
1. Make sure phone is on same WiFi as computer
2. Find your computer's IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Open browser on phone: `http://YOUR_IP:8000`
4. Example: `http://192.168.1.100:8000`

---

## 🎓 Learning Path

**Week 1:** Get it running
- [ ] Start database and dashboard
- [ ] Add API keys
- [ ] Test with sample data

**Week 2:** Understand it
- [ ] Read USER_GUIDE.md
- [ ] Monitor jobs daily
- [ ] Learn to read logs

**Week 3:** Customize it
- [ ] Change dashboard colors
- [ ] Adjust email notifications
- [ ] Tweak schedule times

**Week 4:** Master it
- [ ] Integrate with your forms
- [ ] Set up production monitoring
- [ ] Create custom workflows

---

## 🌟 Success Metrics

You're doing great if:
- ✅ Dashboard shows mostly green/blue badges
- ✅ Failed count stays low (< 5%)
- ✅ Data pipeline runs every night
- ✅ You're getting email notifications
- ✅ Lead enrichment completes in < 5 seconds

---

**Print this page and keep it at your desk!** 📄

*Updated: 2026-02-03*
