import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from sklearn.utils.class_weight import compute_class_weight
import os
import json
import numpy as np

# Paths
DATASET_DIR = r"d:\Projects\Agri-Lo\Datasets\plantvillage dataset\color"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
# Save as v2 first for verification
MODEL_PATH = os.path.join(MODEL_DIR, "final_model_v2.h5")
INDICES_PATH = os.path.join(MODEL_DIR, "class_indices_v2.json")

BATCH_SIZE = 32
IMG_SIZE = (256, 256) # Matching prediction service
INITIAL_EPOCHS = 10
FINE_TUNE_EPOCHS = 10

def train_leaf_model():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset not found at {DATASET_DIR}")
        return

    # Data Generators with Heavy Augmentation
    print("Setting up Data Generators...")
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode='nearest'
    )

    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    validation_generator = val_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    # Class Weight Calculation
    class_indices = train_generator.class_indices
    class_counts = {}
    for cls in train_generator.classes:
        class_counts[cls] = class_counts.get(cls, 0) + 1
    
    unique_classes = np.unique(train_generator.classes)
    weights = compute_class_weight(
        class_weight='balanced',
        classes=unique_classes,
        y=train_generator.classes
    )
    class_weight_dict = dict(zip(unique_classes, weights))
    
    print(f"Calculated class weights for {len(unique_classes)} classes.")

    # Save class indices
    with open(INDICES_PATH, 'w') as f:
        json.dump(class_indices, f)
    print(f"Class indices saved to {INDICES_PATH}")

    # Model Building (Transfer Learning)
    print("Building Model (MobileNetV2)...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(len(class_indices), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])

    # Callbacks
    early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=0.00001)
    checkpoint = ModelCheckpoint(MODEL_PATH, monitor='val_accuracy', save_best_only=True, mode='max')

    # Phase 1: Train Top Layers
    print(f"Phase 1: Starting Initial Training for {INITIAL_EPOCHS} epochs...")
    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=INITIAL_EPOCHS,
        class_weight=class_weight_dict,
        callbacks=[early_stop, reduce_lr, checkpoint]
    )

    # Phase 2: Fine-Tuning
    print("Phase 2: Fine-Tuning (unfreezing top layers)...")
    base_model.trainable = True
    # Freeze all layers except the last 20
    fine_tune_at = len(base_model.layers) - 20
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])

    print(f"Proceeding with Fine-Tuning for {FINE_TUNE_EPOCHS} more epochs...")
    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=INITIAL_EPOCHS + FINE_TUNE_EPOCHS,
        initial_epoch=INITIAL_EPOCHS,
        class_weight=class_weight_dict,
        callbacks=[early_stop, reduce_lr, checkpoint]
    )

    # Save Final
    model.save(MODEL_PATH)
    print(f"Improved model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_leaf_model()
