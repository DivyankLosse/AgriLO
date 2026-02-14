import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os
import json

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = "d:/Projects/Agri-Lo/Datasets/Root_Dataset"
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "root_model.h5")
INDICES_PATH = os.path.join(MODEL_DIR, "root_class_indices.json")

BATCH_SIZE = 32
IMG_SIZE = (224, 224)
EPOCHS = 5

def train_root_model():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset not found at {DATASET_DIR}")
        return

    # Check for empty directories
    for class_name in os.listdir(DATASET_DIR):
        class_path = os.path.join(DATASET_DIR, class_name)
        if os.path.isdir(class_path):
             files = os.listdir(class_path)
             if not files:
                 print(f"Warning: Class {class_name} is empty. Training might fail.")

    # Data Generators
    print("Setting up Data Generators...")
    datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2,
        rotation_range=20,
        horizontal_flip=True
    )

    try:
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
    except Exception as e:
        print(f"Error setting up data generators: {e}")
        return

    if train_generator.samples == 0:
        print("Error: No images found for training.")
        return

    # Create model directory
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
    base_model.trainable = False 

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
        steps_per_epoch=train_generator.samples // BATCH_SIZE if train_generator.samples >= BATCH_SIZE else 1,
        validation_steps=validation_generator.samples // BATCH_SIZE if validation_generator.samples >= BATCH_SIZE else 1
    )

    # Save
    model.save(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_root_model()
