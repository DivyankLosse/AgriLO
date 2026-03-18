import os


def configure_tensorflow_env() -> None:
    """Force TensorFlow to use bundled tf.keras instead of legacy tf_keras."""
    current = os.environ.get("TF_USE_LEGACY_KERAS")
    if current and current.lower() not in {"0", "false", "no"}:
        print(
            f"[INFO] Overriding TF_USE_LEGACY_KERAS={current!r} to '0' for TensorFlow model loading"
        )
    os.environ["TF_USE_LEGACY_KERAS"] = "0"


configure_tensorflow_env()
