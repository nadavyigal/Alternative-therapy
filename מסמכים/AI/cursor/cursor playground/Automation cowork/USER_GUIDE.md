# 🚀 Automation Cowork - Simple User Guide

Welcome! This guide will help you understand and use your automation system in simple terms.

---

## What is Automation Cowork?

Think of Automation Cowork as your **personal robot assistant** that does repetitive tasks for you automatically. Instead of manually enriching customer leads or moving data between systems, your automations do it for you - 24/7!

---

## What Can It Do?

### 1. **Lead Enrichment** 📧
**What it does:** When someone fills out a form on your website, this automation automatically finds their:
- Job title
- Company size
- LinkedIn profile
- Phone number
- And more!

**When it runs:** Instantly, whenever a new lead comes in

**Example:** Someone signs up with just their email → The system finds out they're a "Marketing Director at Google" and saves all that info

---

### 2. **Data Pipelines** 🔄
**What it does:** Moves and cleans data between your databases automatically

**When it runs:** Every night at 2 AM (you can change this)

**Example:** Takes customer data from your CRM, removes duplicates, and puts clean data into your data warehouse

---

### 3. **Smart Error Handling** 🛡️
**What it does:** If something goes wrong, the system:
- Tries again automatically (up to 3 times)
- Switches to backup services if one fails
- Sends you an email alert

**Why it matters:** You don't need to babysit it - it fixes itself most of the time!

---

## How to Use It

### Step 1: Open the Dashboard

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: `http://localhost:8000`
3. You'll see a beautiful purple dashboard with all your automation stats!

### Step 2: Understanding the Dashboard

**Top Cards (Statistics):**
- **Total Jobs:** How many automations have run overall
- **Running:** What's working right now
- **Completed:** Successfully finished jobs
- **Failed:** Jobs that had problems

**Recent Jobs List:**
- Shows your last 20 automation runs
- Color-coded badges:
  - 🟢 Green = Running
  - 🔵 Blue = Completed
  - 🔴 Red = Failed
  - 🟡 Yellow = Pending

**System Status:**
- Green dot = Everything is working
- Red dot = Something needs attention

### Step 3: Quick Actions

Click these buttons to do things quickly:

- **📨 Test Lead Enrichment:** Try enriching a sample email address
- **🔄 Run ETL Pipeline:** Manually start the data sync (normally runs automatically at 2 AM)
- **📋 View Logs:** See what the system is doing behind the scenes
- **🗑️ Clear Failed Jobs:** Remove old failed jobs from the list

### Step 4: Auto-Refresh

The dashboard automatically refreshes every 10 seconds, so you always see the latest data. You can also click the 🔄 button in the bottom-right corner to refresh manually.

---

## Starting the System

You have **two separate parts** to start:

### Part 1: Database (PostgreSQL)
This is where all your data is stored.

**Windows:**
```bash
docker-compose up -d
```

**What it does:** Starts your database in the background

**Check if it worked:**
- Open browser to `http://localhost:5051`
- Login with: `admin@automation-cowork.local` / `admin`
- You should see your database!

---

### Part 2: Dashboard Server (FastAPI)
This is the web interface and automation engine.

**Steps:**
1. Open Terminal/Command Prompt
2. Navigate to the dashboard folder:
   ```bash
   cd dashboard
   ```
3. Start the server:
   ```bash
   python dashboard_api.py
   ```

**Check if it worked:**
- Open browser to `http://localhost:8000`
- You should see the purple dashboard!

---

## Common Questions

### Q: "I tried `npm run dev` but nothing happened"
**A:** This is a **Python** project, not a Node.js project. Use the commands above instead!

### Q: "The dashboard shows 'API: Offline'"
**A:** The server isn't running. Follow "Part 2: Dashboard Server" above to start it.

### Q: "My lead enrichment isn't working"
**A:** You need to add API keys for the enrichment services. See the "Setting Up API Keys" section below.

### Q: "Where can I see what went wrong?"
**A:** Click the **📋 View Logs** button on the dashboard to see detailed error messages.

### Q: "Can I change when the nightly data sync runs?"
**A:** Yes! Edit the `.env` file and change the schedule settings.

---

## Setting Up API Keys (Important!)

For lead enrichment to work, you need API keys from these services:

### Hunter.io (Find email addresses)
1. Go to: https://hunter.io/
2. Sign up (FREE - 100 searches/month)
3. Go to Dashboard → API
4. Copy your API key
5. Paste it in your `.env` file next to `HUNTER_API_KEY=`

### Clearbit (Company info)
1. Go to: https://clearbit.com/
2. Sign up (FREE - 50 leads/month)
3. Go to Dashboard → API
4. Copy your API key
5. Paste it in your `.env` file next to `CLEARBIT_API_KEY=`

### Apollo.io (Contact data)
1. Go to: https://www.apollo.io/
2. Sign up (FREE - 10 credits/month)
3. Go to Settings → API
4. Generate a key
5. Paste it in your `.env` file next to `APOLLO_API_KEY=`

**Where is the `.env` file?**
In your project's main folder, you'll see a file called `.env`. Open it with Notepad and paste your keys there.

---

## Monitoring Your Automations

### Email Notifications
The system sends you emails when:
- ✅ A lead enrichment completes successfully
- ❌ Something fails
- 📊 A data pipeline finishes

**To enable emails:**
1. Open the `.env` file
2. Fill in your email settings (Gmail or SendGrid)
3. Example for Gmail:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=yourname@gmail.com
   SMTP_PASSWORD=your_app_password
   NOTIFY_EMAIL=yourname@gmail.com
   ```

**Note:** For Gmail, you need to create an "App Password" (not your regular password). Google for "Gmail app password" to learn how.

---

## Troubleshooting

### Problem: "Can't connect to database"
**Solution:**
1. Make sure Docker is running
2. Run: `docker ps` - you should see a container named `automation-db`
3. If not, run: `docker-compose up -d`

### Problem: "Dashboard won't load"
**Solution:**
1. Make sure the server is running (see "Part 2: Dashboard Server")
2. Check that nothing else is using port 8000
3. Try: `http://127.0.0.1:8000` instead

### Problem: "All my jobs show 'failed'"
**Solution:**
1. Check if your API keys are configured
2. Click **📋 View Logs** to see the actual error
3. Most likely: API quota exceeded or invalid API key

---

## Tips & Best Practices

### 💡 Tip 1: Check the Dashboard Daily
Make it a habit to check the dashboard once a day to catch any issues early.

### 💡 Tip 2: Monitor API Quotas
Free tier APIs have monthly limits. The dashboard shows how many requests you've made. If you're close to the limit, consider upgrading.

### 💡 Tip 3: Keep Logs Clean
Once a week, click **🗑️ Clear Failed Jobs** to remove old failed jobs and keep your dashboard clean.

### 💡 Tip 4: Test Before Production
Use the **📨 Test Lead Enrichment** button with a test email before connecting it to your real forms.

---

## Getting Help

### In the Dashboard
- Click **📋 View Logs** to see what's happening
- Red badges mean something failed - click to see details

### Documentation Files
- **CLAUDE.md** - Technical documentation for developers
- **README.md** - Quick start guide
- **This file (USER_GUIDE.md)** - User-friendly guide

### Still Stuck?
1. Check the logs: `logs/automation.log`
2. Try restarting: Stop everything and start again
3. Look at the error message carefully - it usually tells you what's wrong!

---

## Quick Command Reference

```bash
# Start database
docker-compose up -d

# Start dashboard
cd dashboard
python dashboard_api.py

# Open dashboard in browser
# Go to: http://localhost:8000

# View database
# Go to: http://localhost:5051

# Stop database
docker-compose down

# Check database is running
docker ps
```

---

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│  Your Website Form                                   │
│  "Enter your email: john@acme.com"                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Automation Cowork                                   │
│  - Receives email                                    │
│  - Searches Hunter.io, Clearbit, Apollo             │
│  - Finds: Name, Title, Company, Phone               │
│  - Saves to database                                 │
│  - Sends you notification                            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  You get enriched lead:                             │
│  John Doe, CEO at Acme Inc                          │
│  Phone: +1-555-0100                                 │
│  LinkedIn: linkedin.com/in/johndoe                  │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Start the database and dashboard
2. ✅ Add your API keys
3. ✅ Test with a sample email
4. ✅ Check the dashboard
5. ✅ Connect to your real forms
6. ✅ Monitor daily

---

## Remember

🎯 **The whole point is to save you time!**

Instead of:
- Manually searching LinkedIn for every lead
- Copy-pasting data between systems
- Running reports every morning

You now have:
- Automatic lead enrichment
- Automatic data syncing
- Automatic error handling
- Beautiful dashboard to monitor everything

**Sit back, relax, and let the robots do the work!** 🤖✨

---

*Last updated: 2026-02-03*
*Need help? Check the logs or read CLAUDE.md for technical details*
