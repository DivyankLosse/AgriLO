import tensorflow as tf


def build_leaf_model(num_classes: int) -> tf.keras.Model:
    base_model = tf.keras.applications.MobileNetV2(
        weights=None,
        include_top=False,
        input_shape=(256, 256, 3),
    )
    base_model.trainable = False

    x = base_model.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.5)(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)

    return tf.keras.Model(inputs=base_model.input, outputs=outputs)


def build_root_model(num_classes: int) -> tf.keras.Model:
    base_model = tf.keras.applications.MobileNetV2(
        weights=None,
        include_top=False,
        input_shape=(224, 224, 3),
    )
    base_model.trainable = False

    x = base_model.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)

    return tf.keras.Model(inputs=base_model.input, outputs=outputs)
