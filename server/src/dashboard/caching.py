import json
from pathlib import Path

CACHE_DIR_ROOT = Path.home() / ".cache" / "openml"
CACHE_DIR_ROOT.mkdir(parents=True, exist_ok=True)

CACHE_DIR_FLASK = CACHE_DIR_ROOT / "flask"
CACHE_DIR_FLASK.mkdir(exist_ok=True)

CACHE_DIR_DASHBOARD = CACHE_DIR_ROOT / "dashboard"
CACHE_DIR_DASHBOARD.mkdir(exist_ok=True)


def get_stats_cache_path(data_id):
    """Get the cache file path for dataset statistics JSON."""
    return CACHE_DIR_DASHBOARD / f"stats{data_id}.json"


def load_cached_stats(data_id):
    """
    Load cached statistics for a dataset.

    Args:
        data_id: OpenML dataset ID

    Returns:
        Dictionary with statistics or None if cache doesn't exist
    """
    cache_path = get_stats_cache_path(data_id)
    if cache_path.exists():
        try:
            with open(cache_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            # Cache corrupted, ignore
            return None
    return None


def save_stats_cache(data_id, stats):
    """
    Save computed statistics to cache.

    Args:
        data_id: OpenML dataset ID
        stats: Dictionary with statistics to cache
    """
    cache_path = get_stats_cache_path(data_id)
    try:
        with open(cache_path, 'w') as f:
            json.dump(stats, f, indent=2)
    except IOError as e:
        # Cache write failed, continue without caching
        pass


def clear_stats_cache(data_id):
    """
    Clear cached statistics for a dataset.

    Args:
        data_id: OpenML dataset ID
    """
    cache_path = get_stats_cache_path(data_id)
    if cache_path.exists():
        cache_path.unlink()
