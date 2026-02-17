import os

DATASET_DIR = r"d:\Projects\Agri-Lo\Datasets\plantvillage dataset\color"

def check_distribution():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset not found at {DATASET_DIR}")
        return

    classes = [d for d in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, d))]
    
    distribution = {}
    total_images = 0
    
    for cls in classes:
        cls_path = os.path.join(DATASET_DIR, cls)
        count = len([f for f in os.listdir(cls_path) if os.path.isfile(os.path.join(cls_path, f))])
        distribution[cls] = count
        total_images += count
        
    print(f"Total images: {total_images}")
    print("Class distribution:")
    for cls, count in sorted(distribution.items()):
        print(f"{cls}: {count}")

if __name__ == "__main__":
    check_distribution()
