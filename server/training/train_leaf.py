import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os
import json

# Paths
DATASET_DIR = "d:/Projects/Agri-Lo/Datasets/PlantVillage-Dataset-master/raw/color"
# Use absolute path relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "leaf_model.h5")
INDICES_PATH = os.path.join(MODEL_DIR, "class_indices.json")

BATCH_SIZE = 32
IMG_SIZE = (224, 224)
EPOCHS = 15  # Increased to 15 for better accuracy

def train_leaf_model():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset not found at {DATASET_DIR}")
        return

    # Data Generators
    print("Setting up Data Generators...")
    datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2,
        rotation_range=20,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    train_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # Create model directory if it doesn't exist
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    # Save class indices
    class_indices = train_generator.class_indices
    with open(INDICES_PATH, 'w') as f:
        json.dump(class_indices, f)
    print(f"Class indices saved to {INDICES_PATH}")

    # Model Building (Transfer Learning)
    print("Building Model (MobileNetV2)...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False  # Freeze base layers for speed

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)
    predictions = Dense(len(class_indices), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Train
    print(f"Starting Training for {EPOCHS} epochs...")
    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_steps=validation_generator.samples // BATCH_SIZE
    )

    # Save
    model.save(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_leaf_model()
