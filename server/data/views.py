import json
import os
import tempfile
from datetime import datetime
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import arff
import openml
import pandas as pd
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

from server.setup import setup_openml_config
from server.src.dashboard.caching import (
    CACHE_DIR_DASHBOARD,
    load_cached_stats,
    save_stats_cache,
)
from server.src.dashboard.helpers import compute_dataset_stats
from server.utils import current_user

data_blueprint = Blueprint(
    "data", __name__, static_folder="server/src/client/app/build"
)

CORS(data_blueprint)


@data_blueprint.before_request
def setup():
    setup_openml_config()


@data_blueprint.route("/data-edit", methods=["GET", "POST"])
@jwt_required()
def data_edit():
    user = current_user()

    url = request.args.get("url")
    parsed = urlparse(url)
    dataset_id = parse_qs(parsed.query)["id"]
    dataset_id = int(dataset_id[0])
    print(dataset_id)
    if request.method == "GET":

        dataset_info = openml.datasets.list_datasets([dataset_id])
        dataset_info = list(dataset_info.items())
        # Its a nested ordered dictionary the first index is to get id,
        # second to get info and third for upload
        uploader_id = dataset_info[0][1]["uploader"]
        owner = "false"
        dataset = openml.datasets.get_dataset(dataset_id)
        if int(user.id) == int(uploader_id):
            owner = "true"
        print(
            jsonify(
                {
                    "user_id": user.id,
                    "name": dataset.name,
                    "description": dataset.description,
                    "creator": dataset.creator,
                    "date": dataset.collection_date,
                    "citation": dataset.citation,
                    "language": dataset.language,
                    "default_target_attribute": dataset.default_target_attribute,
                    "ignore_attribute": dataset.ignore_attribute,
                    "row_id_attribute": dataset.row_id_attribute,
                    "owner": owner,
                    "original_data_url": dataset.original_data_url,
                    "paper_url": dataset.paper_url,
                }
            )
        )
        return (
            jsonify(
                {
                    "user_id": user.id,
                    "name": dataset.name,
                    "description": dataset.description,
                    "creator": dataset.creator,
                    "date": dataset.collection_date,
                    "citation": dataset.citation,
                    "language": dataset.language,
                    "default_target_attribute": dataset.default_target_attribute,
                    "ignore_attribute": dataset.ignore_attribute,
                    "row_id_attribute": dataset.row_id_attribute,
                    "owner": owner,
                    "original_data_url": dataset.original_data_url,
                    "paper_url": dataset.paper_url,
                }
            ),
            200,
        )
    elif request.method == "POST":
        j_obj = request.get_json()

        owner = j_obj["owner"]
        description = j_obj["description"]
        creator = j_obj["creator"]
        collection_date = j_obj["date"]
        citation = j_obj["citation"]
        language = j_obj["language"]
        original_data_url = j_obj["original_data_url"]
        paper_url = j_obj["paper_url"]
        if description == "":
            description = None
        if creator == "":
            creator = None
        if collection_date == "":
            collection_date = None
        if citation == "":
            citation = None
        if language == "":
            language = None
        if original_data_url == "":
            original_data_url = None
        if paper_url == "":
            paper_url = None
        if owner == "false":
            openml.datasets.edit_dataset(
                dataset_id,
                description=description,
                creator=creator,
                collection_date=collection_date,
                citation=citation,
                language=language,
                original_data_url=original_data_url,
                paper_url=paper_url
            )
        elif owner == "true":
            default_target_attribute = j_obj["default_target_attribute"]
            ignore_attribute = j_obj["ignore_attribute"]
            row_id_attribute = j_obj["row_id_attribute"]
            if default_target_attribute == "":
                default_target_attribute = None
            if ignore_attribute == "":
                ignore_attribute = None
            if row_id_attribute == "":
                row_id_attribute = None
            openml.datasets.edit_dataset(
                dataset_id,
                description=description,
                creator=creator,
                collection_date=collection_date,
                citation=citation,
                language=language,
                default_target_attribute=default_target_attribute,
                ignore_attribute=ignore_attribute,
                row_id_attribute=row_id_attribute,
                original_data_url=original_data_url,
                paper_url=paper_url
            )

        return str("data edit successful")


@data_blueprint.route("/data-upload", methods=["POST"])
@jwt_required()
def data_upload():
    """
    Function to upload dataset
    """

    user = current_user()
    user_api_key = user.session_hash

    data_file = request.files["dataset"]
    metadata = request.files["metadata"]

    with tempfile.TemporaryDirectory() as tmpdirname:
        path = Path(tmpdirname) / f"{user_api_key}?{secure_filename(data_file.filename)}"
        data_file.save(path)

        metadata = metadata.read()
        metadata = json.loads(metadata)
        dataset_name = metadata["dataset_name"]
        description = metadata["description"]
        creator = metadata["creator"] or None
        contributor = metadata["contributor"] or None
        collection_date = metadata["collection_date"] or None
        licence = metadata["licence"] or None
        language = metadata["language"] or None
        # attribute = metadata['attribute']
        def_tar_att = metadata["def_tar_att"] or None
        ignore_attribute = metadata["ignore_attribute"] or None
        citation = metadata["citation"] or None
        file_name, file_extension = os.path.splitext(data_file.filename)
        # TODO: Support custom attribute types
        supported_extensions = [".csv", ".parquet", ".json", ".feather", ".arff"]

        if file_extension not in supported_extensions:
            return jsonify({"msg": "format not supported"})

        elif file_extension == ".arff":
            with open(path, "r") as arff_file:
                arff_dict = arff.load(arff_file)
            attribute_names, dtypes = zip(*arff_dict["attributes"])
            data = pd.DataFrame(arff_dict["data"], columns=attribute_names)
            for attribute_name, dtype in arff_dict["attributes"]:
                # 'real' and 'numeric' are probably interpreted correctly.
                # Date support needs to be added.
                if isinstance(dtype, list):
                    data[attribute_name] = data[attribute_name].astype("category")
            df = data

        elif file_extension == ".csv":
            df = pd.read_csv(path)

        elif file_extension == ".json":
            df = pd.read_json(path)

        elif file_extension == ".parquet":
            df = pd.read_parquet(path)

        elif file_extension == ".feather":
            df = pd.read_feather(path)

        oml_dataset = openml.datasets.create_dataset(
            name=dataset_name,
            description=description,
            data=df,
            creator=creator,
            contributor=contributor,
            collection_date=collection_date,
            licence=licence,
            language=language,
            attributes="auto",
            default_target_attribute=def_tar_att,
            ignore_attribute=ignore_attribute,
            citation=citation,
        )
        oml_dataset.publish()

    # TODO Add error for bad dataset
    return jsonify({"msg": "dataset uploaded"}), 200


@data_blueprint.route("/data-tag", methods=["POST"])
@jwt_required()
def data_tag():
    j_obj = request.get_json()
    tag = j_obj['tag']
    url = request.args.get("url")
    parsed = urlparse(url)
    dataset_id = parse_qs(parsed.query)["id"]
    dataset_id = int(dataset_id[0])

    dataset = openml.datasets.get_dataset(dataset_id)
    dataset.push_tag(tag)


@data_blueprint.route("/api/v1/datasets/<int:dataset_id>/stats", methods=["GET"])
def get_dataset_stats(dataset_id):
    """
    Returns JSON statistics for a dataset.

    Query params:
    - max_preview_rows (int, default=100): Max rows in preview
    - force_refresh (bool, default=False): Skip cache, recompute

    Returns:
    {
      "dataset_id": int,
      "computed_at": str (ISO timestamp),
      "cached": bool,
      "statistics": {
        "distribution": {...},
        "correlation": {...},
        "preview": {...}
      }
    }
    """
    try:
        max_preview = request.args.get('max_preview_rows', 100, type=int)
        force_refresh = request.args.get('force_refresh', False, type=bool)

        # Try loading from JSON cache first
        if not force_refresh:
            cached_stats = load_cached_stats(dataset_id)
            if cached_stats is not None:
                # Validate cache has expected max_preview_rows
                current_preview_rows = len(cached_stats.get("preview", {}).get("rows", []))
                if current_preview_rows >= max_preview:
                    # Cache is valid, return it
                    return jsonify({
                        "dataset_id": dataset_id,
                        "computed_at": datetime.utcnow().isoformat() + "Z",
                        "cached": True,
                        "statistics": cached_stats
                    }), 200

        # Cache miss or force refresh - compute stats
        stats = compute_dataset_stats(dataset_id, max_preview_rows=max_preview)

        # Save to JSON cache
        save_stats_cache(dataset_id, stats)

        return jsonify({
            "dataset_id": dataset_id,
            "computed_at": datetime.utcnow().isoformat() + "Z",
            "cached": False,
            "statistics": stats
        }), 200

    except Exception as e:
        # Log the error for debugging
        import logging
        logger = logging.getLogger("data")
        logger.error(f"Error computing stats for dataset {dataset_id}: {str(e)}", exc_info=True)

        return jsonify({"error": str(e)}), 500

