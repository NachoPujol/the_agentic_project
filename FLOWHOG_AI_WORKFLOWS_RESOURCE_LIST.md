# Flowhog AI Workflows - Business Resource List

## 1. E-Commerce Data Scraper

**Problem:** Manually extracting product data from websites is slow, error-prone, and doesn't scale.

**Industry:** E-commerce, Retail, Product Management

**Who Benefits:** E-commerce managers migrating catalogs, product analysts managing inventory, teams doing competitive analysis.

**Before:** Hours copying product specs manually, inconsistent formatting, high error rates, lost progress when interrupted, difficulty handling product variants.

**After:** Automated extraction to CSV, consistent structured output, resume capability, intelligent variant handling, error logging without stopping entire process.

**How to Build:**

1. **Setup Environment**
   - Install Python 3.8+, create virtual environment
   - Install: crawl4ai, pydantic-ai, pandas, OpenAI library
   - Run: `crawl4ai-setup`

2. **Get API Keys**
   - OpenAI API key (for GPT models)
   - Optional: Logfire token (monitoring)

3. **Configure**
   - Create `.env` file with `OPENAI_API_KEY` and `LOGFIRE_TOKEN`
   - Prepare `products.csv` with columns: ID, url

4. **The AI Magic**
   - AI agent receives scraped webpage markdown
   - Extracts product variants, specs, attributes, parent-child relationships
   - Outputs structured data to CSV

5. **Run**
   - Execute: `python ecommerce_data_scraper/main.py`
   - Monitor: 30 requests per product to control costs
   - Output: Incremental CSV writing preserves progress

**Tools:** Python, crawl4ai, OpenAI GPT, pandas

---

## 2. Home Renovation Assistant

**Problem:** Renovation companies struggle to collect complete client information, causing miscommunication and costly revisions.

**Industry:** Home Services, Construction, Renovation

**Who Benefits:** Renovation companies, contractors, project managers preparing estimates, interior designers.

**Before:** Unstructured conversations miss details, multiple calls/emails to gather info, scattered client photos, inconsistent data collection, manual compilation into proposals.

**After:** Structured 15+ question interview, automatic photo organization in Google Drive, professional Google Docs report auto-generated, centralized team access, consistent data collection.

**How to Build:**

1. **Setup Environment**
   - Install Python 3.9+, Streamlit, pydantic-ai
   - Install Google Drive/Docs APIs
   - Get OpenAI API key, Langfuse account

2. **Google Cloud Setup**
   - Enable Drive and Docs APIs
   - Create Desktop OAuth Client
   - Download credentials
   - Authenticate: `gcloud auth application-default login`

3. **Configure**
   - `.env` file: Google Drive folder ID, OpenAI key, Langfuse keys
   - Share Drive folder with your account as Editor

4. **The AI Magic**
   - AI asks 15+ renovation questions (areas, plumbing, electrical, budget, timeline, style)
   - Professional, concise tone, contextually relevant questions
   - Collects photos, organizes by date

5. **Run**
   - Local: `streamlit run app.py`
   - Deploy: Google Cloud Run with service account

**Tools:** Streamlit, OpenAI GPT-4o-mini, Google Drive/Docs APIs, Langfuse

---

## 3. Influencer Marketing Reporting

**Problem:** Marketing teams spend hours manually analyzing campaigns and creating PowerPoint reports.

**Industry:** Marketing, Advertising, Influencer Marketing

**Who Benefits:** Marketing managers, social media agencies, brand managers, marketing analysts creating executive reports.

**Before:** Manual analysis takes hours/days, repetitive PowerPoint creation, delayed insights, inconsistent formatting, human calculation errors, slow response to performance questions.

**After:** Auto-generated reports within minutes, consistent PowerPoint format, immediate insights, 24-hour webhook monitoring, both CSV and presentation created, auto-uploaded to Drive.

**How to Build:**

1. **Setup Environment**
   - Install Python 3.8+, FastAPI, pandas, python-pptx
   - Install Google Cloud SDK
   - Get ngrok for local development

2. **Google Cloud Setup**
   - Create project, enable Drive API
   - Authenticate: `gcloud auth application-default login`
   - Create Drive folder, note folder ID

3. **Configure**
   - `.env`: Drive folder ID, webhook secret, webhook public URL
   - For local: Run `ngrok http 8000`, update webhook URL

4. **The Logic**
   - `create_campaign_summary()` analyzes campaign CSV
   - `create_powerpoint_report()` generates slides from summary
   - Data analysis logic, no LLM needed

5. **Run**
   - Start: `python webhook_server.py`
   - Auto-registers webhook on startup
   - Upload `campaign.csv` to Drive folder
   - Outputs: `generated_campaign_summary.csv` + `generated_report.pptx`

**Tools:** FastAPI, Google Drive API, pandas, python-pptx, ngrok

---

## 4. Listing Manager

**Problem:** Directory websites manually discover, vet, categorize, and publish AI tool listings.

**Industry:** Directory Publishing, SaaS Marketplaces, AI Tool Aggregation

**Who Benefits:** Directory owners, product hunt-style platforms, marketplace admins, content managers.

**Before:** Manual research, hours visiting websites, inconsistent listing quality, manual categorization/tagging, difficulty maintaining current info, no systematic corrections.

**After:** Automated discovery, intelligent filtering (true AI agents vs tools), automatic detail extraction, AI categorization/tagging, human review before publishing, feedback-driven corrections.

**How to Build:**

1. **Setup Environment**
   - Install Python 3.8+, LangGraph, pydantic-ai, Streamlit
   - Install asyncpg for PostgreSQL, crawl4ai
   - Get OpenAI API key

2. **Database Setup**
   - PostgreSQL or Supabase
   - Create listings table with categories, tags, features

3. **Configure**
   - `.env`: Database connection, OpenAI key
   - Set up search API access

4. **The AI Agents**
   - **Search Agent:** Discovers potential AI agents
   - **Filtering Agent:** Verifies if tool is actually an AI agent (confidence score)
   - **Summarizer Agent:** Extracts name, features, use cases, pricing, URLs
   - **Classifier Agent:** Assigns categories/tags with confidence
   - **Rectifier Agent:** Modifies based on your feedback
   - **DB Inserter Agent:** Publishes approved listings

5. **Run**
   - Execute: `streamlit run streamlit.py`
   - AI searches → filters → summarizes → classifies
   - You review → provide feedback → AI corrects OR publishes
   - Thread-based conversation memory

**Tools:** LangGraph, pydantic-ai, Streamlit, PostgreSQL/Supabase, OpenAI GPT, crawl4ai

---

## 5. Local AI Outlook Invoice Classifier

**Problem:** Finance teams manually sort emails to find, classify, and organize invoices.

**Industry:** Finance, Accounting, Administrative Services

**Who Benefits:** Finance managers, accountants, administrative assistants, CFOs streamlining processes.

**Before:** Manually checking emails, time-consuming categorization, missed invoices, inconsistent filing, difficulty tracking receipt, delayed payments.

**After:** Automatic real-time invoice detection, AI classification using local models (privacy-preserved), automatic Outlook categorization, instant processing.

**How to Build:**

1. **Azure Setup**
   - Create app in Azure Portal
   - Add permissions: Contacts.Read, Mail.ReadWrite, MailboxSettings.ReadWrite, User.Read
   - Grant admin consent
   - Save client ID, secret, tenant ID

2. **Docker Model Runner**
   - Enable in Docker Desktop → AI tab
   - Enable "Docker Model Runner" and "host-side TCP support" (port 12434)
   - Pull model: `docker model pull ai/mistral:7B-Q4_K_M`

3. **ngrok Setup**
   - Install: `brew install ngrok`
   - Add authtoken: `ngrok config add-authtoken <TOKEN>`
   - Run: `ngrok http --domain=<your-domain>.ngrok-free.app 8000`

4. **Configure**
   - `.env`: Azure credentials, user ID, ngrok webhook URL, category name
   - `OPENAI_API_KEY=dummy`, `LOCAL_API_URL=http://localhost:12434/engines/v1`

5. **The AI Magic**
   - Local Mistral 7B model (no cloud, privacy-preserved)
   - Classifies email content for invoices
   - Determines category, confidence scores
   - Zero data leaves your infrastructure

6. **Run**
   - Install: `uv sync` or `pip install -e .`
   - Start: `uv run main.py`
   - Create subscription: `curl -X POST http://localhost:8000/create-subscription`
   - Real-time processing as emails arrive

**Tools:** FastAPI, Microsoft Graph API, Docker Model Runner, Mistral 7B (local), ngrok

---

## 6. N8N Directory Automation

**Problem:** Directory websites manually process and upload listings.

**Industry:** Directory Publishing, Content Management

**Who Benefits:** Directory admins, content managers, marketing teams, community managers.

**Before:** Manual copying, time-consuming data entry, inconsistent formatting, difficulty scaling, manual image uploads.

**After:** Automated listing creation from chat, automatic data extraction from websites, image processing to Supabase, consistent format, scalable management.

**How to Build:**

1. **Setup Platforms**
   - n8n instance (self-hosted or cloud)
   - Supabase account and project
   - OpenAI API or compatible LLM

2. **Supabase Setup**
   - Create listings table with proper fields
   - Set up storage bucket for images
   - Note connection credentials

3. **n8n Configuration**
   - Import workflows: `listing_uploading_chat.json`, `image_uploader_to_supabase.json`
   - Add Supabase credentials
   - Add OpenAI/LLM credentials
   - Activate workflows

4. **The AI Magic**
   - LangChain extracts website content, cleans HTML
   - AI identifies service name from landing page
   - Determines open-source status (confidence >0.85)
   - Structures data for database

5. **Workflow Steps**
   - HTTP Request fetches website
   - Code node cleans HTML
   - LangChain LLM extracts info
   - Data structured
   - Supabase insertion
   - Image processing pipeline

**Tools:** n8n, Supabase, LangChain, OpenAI/LLM

---

## 7. SMS Booking Automation

**Problem:** Photography businesses lose bookings due to slow SMS responses and manual coordination.

**Industry:** Photography, Event Services, SMS-based Service Businesses

**Who Benefits:** Photography business owners, event photographers, service businesses using SMS, small business owners automating intake.

**Before:** Manual responses, slow reply times losing bookings, tracking info across conversations, manually collecting details, no after-hours coverage, manual data entry.

**After:** Instant AI responses 24/7, automatic detail extraction, smart filtering (ignores non-booking messages), automatic client/job creation, missing info detection, Telegram team notifications, existing client recognition.

**How to Build:**

1. **JustCall Setup**
   - Login to dashboard → Settings → Tags
   - Create automation tag
   - Purchase/configure phone number
   - APIs & Webhooks: Create webhook to `https://your-domain.app/webhook/sms`
   - Save webhook secret

2. **Telegram Bot**
   - Message @BotFather → `/newbot`
   - Save bot token
   - Send message to your bot
   - Get chat ID: `https://api.telegram.org/bot<TOKEN>/getUpdates`

3. **Infrastructure**
   - PostgreSQL database
   - Redis instance
   - ngrok: `ngrok http --domain=your_domain.app 8080`

4. **Configure**
   - `.env`: JustCall credentials, webhook secret, Telegram bot token/chat IDs, database URL, Redis URL, OpenAI key

5. **The AI Agents**
   - **SMS Filter Agent:** Determines if message is booking-related
   - **Info Collector Agent:** Extracts client details, event details, service requirements
   - **SMS Replier Agent:** Generates contextual responses based on job status and missing fields

6. **Run**
   - Docker: `docker-compose up -d`
   - Manual: `pip install -r requirements.txt`, `python -m app.main`
   - Test: `python demo_terminal.py` (simulates SMS workflow)

7. **The Flow**
   - Receive SMS → normalize phone → check existing client
   - New clients: filter non-booking messages
   - Extract info with AI → update/create client and job
   - Identify missing fields → generate reply based on status
   - Send SMS response → Telegram team notification

**Tools:** FastAPI, pydantic-ai, OpenAI, PostgreSQL, Redis, Celery, Docker, JustCall, Telegram, ngrok

---

## 8. WhatsApp Customer Support Agent

**Problem:** Businesses can't provide 24/7 WhatsApp support, causing slow responses and customer frustration.

**Industry:** Customer Service, E-commerce, SaaS, Any WhatsApp-using Business

**Who Benefits:** Support managers needing 24/7 coverage, e-commerce handling inquiries, SaaS technical support, small businesses without dedicated staff.

**Before:** Customers wait hours, support staff overwhelmed, no after-hours support, inconsistent answers, can't scale with growth, manual problem lookup.

**After:** Instant 24/7 responses, AI searches knowledge base, consistent answers, automatic escalation when needed, step-by-step resolution, reduced staff workload, conversation history.

**How to Build:**

1. **WhatsApp Business API**
   - Create Meta Developer account
   - Create app with WhatsApp Business API access
   - Get WhatsApp token and phone number ID
   - Configure webhook URL, set verification token

2. **Database Setup**
   - Create Supabase project
   - Enable pgvector extension
   - Create embeddings table for support documents
   - Populate with common problems/solutions
   - Generate embeddings with OpenAI

3. **Install UV**
   - `curl -sSf https://astral.sh/uv/install.sh | bash`
   - Create venv: `uv venv`, activate
   - Install: `uv pip install .`

4. **Configure**
   - `.env`: WhatsApp token, phone number ID, verify token, OpenAI key, Supabase URL/key

5. **ngrok Setup**
   - Install: `brew install ngrok`
   - Add authtoken: `ngrok config add-authtoken <TOKEN>`
   - Run: `ngrok http 8000`
   - Update webhook in Meta Developer Portal

6. **The AI Magic**
   - **System Prompt:** Check if additional info needed → consult knowledge base for problems → respond one step at a time → escalate if persists
   - **Tool:** `get_common_problems_and_solutions(query)` - vector search support docs
   - **Context:** Last 7 messages maintained
   - **Search:** Converts query to embedding, vector similarity search, returns top 3 docs

7. **Run**
   - Start: `uvicorn api.app:app --host 0.0.0.0 --port 8000`
   - Receive WhatsApp message → load history
   - Agent analyzes → searches knowledge base if needed
   - Generate step-by-step response → send via WhatsApp
   - Store in conversation history

**Tools:** FastAPI, pydantic-ai, LangGraph, OpenAI GPT-4o-mini, PostgreSQL+pgvector, Supabase, WhatsApp Business API, ngrok

---

## Summary

**8 Production-Ready AI Workflows** solving real business problems across:
- E-commerce & Retail
- Home Services & Construction
- Marketing & Advertising
- Finance & Accounting
- Directory Publishing
- Photography & Events
- Customer Support
- SaaS & Software

**Common Benefits:**
- 24/7 automation
- Instant processing (minutes vs hours)
- Consistent quality
- Reduced manual work
- Scalable operations
- Cost control

**Technology Stack:**
- **AI:** OpenAI GPT, local models (Mistral), LangGraph, pydantic-ai
- **Platforms:** FastAPI, Streamlit, n8n
- **Storage:** PostgreSQL, Supabase, Redis, Vector databases
- **APIs:** Google Drive/Docs, Microsoft Graph, WhatsApp, JustCall, Telegram
- **Infrastructure:** Docker, ngrok, Google Cloud Run

All workflows include human oversight options, privacy considerations, and are designed for business owners to deploy with technical support.
