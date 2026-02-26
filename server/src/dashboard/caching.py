from pathlib import Path

CACHE_DIR_ROOT = Path.home() / ".cache" / "openml"
CACHE_DIR_ROOT.mkdir(parents=True, exist_ok=True)

CACHE_DIR_FLASK = CACHE_DIR_ROOT / "flask"
CACHE_DIR_FLASK.mkdir(exist_ok=True)

CACHE_DIR_DASHBOARD = CACHE_DIR_ROOT / "dashboard"
CACHE_DIR_DASHBOARD.mkdir(exist_ok=True)
