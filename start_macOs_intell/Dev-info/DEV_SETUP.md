# OpenML.org Local Dev Setup – Helder’s Fork (Nov 2025)

You have **two frontends** inside the same repo:

| Path                                | Tech     | Status       | How to run                                                |
| ----------------------------------- | -------- | ------------ | --------------------------------------------------------- |
| `openml.org/app/`                   | Next.js  | New dev UI   | `npm run dev` → http://localhost:3000                     |
| `openml.org/server/src/client/app/` | React 17 | Current prod | `npm run build && serve -s build` → http://localhost:5000 |

### Fastest way to get everything running (what you actually do every day)

```bash
# 1. Clone & enter
git clone https://github.com/HelderMendes/openml.org.git
cd openml.org

# 2. Python backend (Flask + DB)
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Start backend (in terminal 1)
source .venv/bin/activate
flask run --port 5000          # or: ./dev.sh if it exists

# 4. New frontend – Next.js (recommended for daily work) (in terminal 2)
cd app
npm install --legacy-peer-deps   # only needed once or after package changes
npm run dev                      # → http://localhost:3000

# 5. Old/current production frontend (if you need to test exactly what’s live)
cd server/src/client/app
npm install                      # once
npm run build                    # creates build/ folder
npx serve -s build               # → usually http://localhost:5000
```

### One-liner to launch both (add to your shell or VS Code tasks)

```bash
code . && (cd app && npm run dev) & source .venv/bin/activate && flask run --port 5000
```

### Common kill commands (you use these all the time)

```bash
Bashlsof -ti:3000 | xargs kill -9 # kill Next.js
lsof -ti:5000 | xargs kill -9 # kill Flask / old React serve
rm -rf app/.next # clear Next.js cache when things get weird
```

### Clean Install Steps

| Step                     | Command/Action                        |
| ------------------------ | ------------------------------------- |
| Stop Node.js servers     | lsof -i :<port>→kill -9 <PID>         |
| Stop Flask backend       | `ps aux                               |
| Remove venv              | rm -rf venv/                          |
| Stop Docker containers   | docker stop <container_id>            |
| Remove Docker containers | docker rm <container_id>              |
| Remove node_modules      | rm -rf node_modules package-lock.json |
| Reinstall dependencies   | npm install                           |

### Stop running servers and processes

| Step                       | Command/Action                                     |
| -------------------------- | -------------------------------------------------- |
| Stop Next.js dev server    | In terminal running it, pressCtrl + C              |
| Or manually stop by port   | lsof -t -i tcp:<port> \| xargs kill(replace<port>) |
| Stop Node.js servers       | lsof -i :<port>→kill <PID>orkill -9 <PID>          |
| Stop Flask backend         | Find with `ps aux                                  |
| Stop Docker containers     | docker stop <container_id>                         |
| Stop all Docker containers | docker stop $(docker ps -q)                        |

To stop all running processes, clean up any lingering server instances, virtual environments, and Docker containers, and ensure a clean slate for your development environment, follow these steps with senior-level terminology and best practices.

Stopping Running Processes
Identify and Terminate Running Node.js Servers

Use lsof or ps to find processes running on common ports (e.g., 3000, 5000, 8080).

Example:

bash
lsof -i :3000
kill -9 <PID>
For multiple ports, repeat for each relevant port.

Stop Any Background npm or npx Processes

If you used npx serve -s build, check for any running serve or node processes:

bash
ps aux | grep serve
kill -9 <PID>
Stop Flask Backend

If Flask is running, use Ctrl+C in the terminal where it's running, or find and kill the process:

bash
ps aux | grep python
kill -9 <PID>
Cleaning Up Virtual Environments
Remove Python Virtual Environment (venv)

If you created a venv in your project directory, remove it:

bash
rm -rf venv/
If you used a different name (e.g., .venv, env), adjust accordingly.

Managing Docker Containers
List and Stop Running Docker Containers

List all running containers:

bash
docker ps
Stop and remove containers:

bash
docker stop <container_id>
docker rm <container_id>
Remove all stopped containers:

bash
docker container prune
Remove unused images and networks (optional):

bash
docker system prune
Cleaning Node.js Dependencies
Remove Node Modules and Reinstall

Remove node_modules and package-lock.json:

bash
rm -rf node_modules package-lock.json
Reinstall dependencies:

bash
npm install
Checking for Lingering Processes
Verify No Processes Are Running

Check for any remaining processes:

bash
ps aux | grep -E "(node|python|serve)"
If any are found, terminate them with kill -9 <PID>.

Summary: Clean Install Steps
Step Command/Action
Stop Node.js servers lsof -i :<port> → kill -9 <PID>
Stop Flask backend `ps aux
Remove venv rm -rf venv/
Stop Docker containers docker stop <container_id>
Remove Docker containers docker rm <container_id>
Remove node_modules rm -rf node_modules package-lock.json
Reinstall dependencies npm install
This approach ensures a thorough cleanup of all running processes, virtual environments, and Docker containers, providing a clean slate for your next development session.
