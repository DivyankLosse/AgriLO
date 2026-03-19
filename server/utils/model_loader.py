import json
import os
import tempfile
from typing import Any

import h5py
import tensorflow as tf


def _sanitize_keras_config(node: Any) -> None:
    if isinstance(node, dict):
        if node.get("class_name") == "InputLayer" and isinstance(node.get("config"), dict):
            config = node["config"]
            batch_shape = config.pop("batch_shape", None)
            if batch_shape is not None and "batch_input_shape" not in config:
                config["batch_input_shape"] = batch_shape
            config.pop("optional", None)

        for key, value in list(node.items()):
            if (
                key == "dtype"
                and isinstance(value, dict)
                and value.get("class_name") == "DTypePolicy"
            ):
                node[key] = value.get("config", {}).get("name", "float32")
            else:
                _sanitize_keras_config(value)
    elif isinstance(node, list):
        for item in node:
            _sanitize_keras_config(item)


def _read_sanitized_model_config(model_path: str) -> str:
    with h5py.File(model_path, "r") as source:
        model_config = source.attrs.get("model_config")
        if model_config is None:
            raise ValueError("Missing model_config in H5 model file")

        if isinstance(model_config, bytes):
            model_config = model_config.decode("utf-8")

    config_data = json.loads(model_config)
    _sanitize_keras_config(config_data)
    return json.dumps(config_data)


def _write_sanitized_h5_copy(model_path: str) -> str:
    fd, temp_path = tempfile.mkstemp(suffix=".h5")
    os.close(fd)

    with h5py.File(model_path, "r") as source, h5py.File(temp_path, "w") as target:
        for key, value in source.attrs.items():
            target.attrs[key] = value

        target.attrs["model_config"] = _read_sanitized_model_config(model_path).encode("utf-8")

        source.copy("model_weights", target)

        if "optimizer_weights" in source:
            source.copy("optimizer_weights", target)

    return temp_path


def load_model_with_compat(model_path: str):
    try:
        return tf.keras.models.load_model(model_path, compile=False)
    except Exception as original_error:
        print(f"[INFO] Retrying model load with sanitized H5 config for {os.path.basename(model_path)}")
        temp_path = _write_sanitized_h5_copy(model_path)
        try:
            return tf.keras.models.load_model(temp_path, compile=False)
        except Exception as sanitized_h5_error:
            print(f"[WARN] Sanitized H5 load failed: {sanitized_h5_error}")
            try:
                model_json = _read_sanitized_model_config(model_path)
                model = tf.keras.models.model_from_json(model_json)
                model.load_weights(model_path)
                return model
            except Exception as rebuilt_model_error:
                raise RuntimeError(
                    "Model load failed after standard, sanitized-H5, and rebuilt-model attempts. "
                    f"Original: {original_error}; sanitized_h5: {sanitized_h5_error}; "
                    f"rebuilt: {rebuilt_model_error}"
                ) from rebuilt_model_error
        finally:
            try:
                os.remove(temp_path)
            except OSError:
                pass
