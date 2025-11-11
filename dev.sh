#!/bin/bash
# dev.sh → the ONLY file you will ever run
# GYRNc colours + zero bugs + Next.js 16.0.1 + Flask
#
# USAGE:
#.  chmod +x dev.sh && ./dev.sh
#   chmod +x dev.sh                # Make it executable (first time only)
#   ./dev.sh                       # Start everything
#
# This starts:
#   - Flask backend on port 5000
#   - Next.js frontend on port 3000  
#   - Optional nginx proxy on port 8080
#
# Press Ctrl+C to stop all services
#
set -e

G='\033[0;32m' Y='\033[1;33m' R='\033[0;31m' N='\033[1m' c='\033[0m'

echo -e "${G}${N}OPENML.ORG → ONE-CLICK DEV${c}"

# 1. Flask backend (root folder)
echo -e "${Y}Flask → port 5000${c}"
source .venv/bin/activate
export FLASK_APP=autoapp.py          # ← real location
export FLASK_DEBUG=1
python create_user_table.py 2>/dev/null || true
flask run --port=5000 &
BACK=$!

# 2. Next.js frontend (app folder)
echo -e "${Y}Next.js → port 3000${c}"
cd app
npm run dev &                        # ← NO --host flag (Next 16 uses turbopack)
FRONT=$!
cd ..

# 3. Optional proxy (if you have nginx config)
if [[ -f server-proxy/dev-nginx.conf ]]; then
    echo -e "${Y}Proxy → port 8080${c}"
    nginx -c "$(pwd)/server-proxy/dev-nginx.conf" &
    PROXY=$!
fi

# 4. Ctrl+C kills everything
trap "echo -e '${R}STOPPING…${c}'; kill $BACK $FRONT ${PROXY:-} 2>/dev/null; exit" INT TERM

# 5. Victory screen
echo -e "${G}${N}DONE!${c}"
echo -e "   UI  → http://localhost:3000"
echo -e "   API → http://localhost:5000"
[[ -n "$PROXY" ]] && echo -e "   ALL → http://localhost:8080"
echo -e "${Y}Press Ctrl+C to stop${c}"

wait