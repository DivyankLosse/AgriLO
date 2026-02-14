import os
import shutil
from icrawler.builtin import BingImageCrawler

# Configuration
DATASET_ROOT = "d:/Projects/Agri-Lo/Datasets/Root_Dataset"
CLASSES = {
    "Healthy Root": "healthy plant roots",
    "Diseased Root": "diseased plant roots root rot",
}
MAX_IMAGES = 100

def create_dataset():
    if not os.path.exists(DATASET_ROOT):
        os.makedirs(DATASET_ROOT)

    for class_name, search_query in CLASSES.items():
        print(f"Processing class: {class_name}...")
        save_dir = os.path.join(DATASET_ROOT, class_name)
        
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        crawler = BingImageCrawler(
            feeder_threads=1,
            parser_threads=2,
            downloader_threads=4,
            storage={'root_dir': save_dir}
        )
        
        crawler.crawl(keyword=search_query, max_num=MAX_IMAGES)
        print(f"Finished downloading images for {class_name}")

if __name__ == "__main__":
    create_dataset()
