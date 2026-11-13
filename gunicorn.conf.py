import os
import shutil

from server.src.dashboard.caching import CACHE_DIR_DASHBOARD


# According to Gunicorn: "Workers ≠ clients. Gunicorn typically needs only 4–12 workers to handle
# heavy traffic. Too many workers waste resources and can reduce throughput."
workers = int(os.getenv("GUNICORN_N_WORKERS", 2))
worker_class = "gthread"    # Threaded worker with a thread pool per worker process.
threads = int(os.getenv("GUNICORN_N_THREADS", 2))
max_requests = 5000         # mitigating memory leaks: kill each worker after this many requests.
max_requests_jitter = 500


def on_starting(server):
    shutil.rmtree(CACHE_DIR_DASHBOARD)
    CACHE_DIR_DASHBOARD.mkdir()
