import os


def configure_tensorflow_env() -> None:
    """Force TensorFlow to use bundled tf.keras instead of legacy tf_keras."""
    current = os.environ.pop("TF_USE_LEGACY_KERAS", None)
    if current is not None:
        print(
            f"[INFO] Removing TF_USE_LEGACY_KERAS={current!r} before TensorFlow model loading"
        )


configure_tensorflow_env()
