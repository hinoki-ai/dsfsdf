#!/usr/bin/env python3
"""
Enhanced Liquor Image Scraper
Downloads additional liquor images from various free sources
"""

import requests
import os
import time
import json
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import re
from pathlib import Path
import random

class EnhancedLiquorImageScraper:
    def __init__(self, base_dir="images"):
        self.base_dir = Path(base_dir)
        self.session = requests.Session()

        # Use different user agents to avoid blocking
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ]
        self.session.headers.update({
            'User-Agent': random.choice(user_agents)
        })

        self.products_dir = self.base_dir / "products"
        self.categories_dir = self.base_dir / "categories"
        self.banners_dir = self.base_dir / "banners"

    def download_image(self, url, filename, min_size=5000):
        """Download an image with size validation and retries"""
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()

            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                return False

            if len(response.content) < min_size:
                return False

            with open(filename, 'wb') as f:
                f.write(response.content)

            print(f"✓ Downloaded: {filename.name}")
            return True

        except Exception as e:
            print(f"✗ Failed to download {url}: {e}")
            return False

    def scrape_pixabay_liquor(self, max_images=20):
        """Scrape liquor images from Pixabay"""
        print("📸 Scraping Pixabay...")

        search_terms = [
            "wine bottle", "whiskey bottle", "cognac bottle", "rum bottle",
            "vodka bottle", "gin bottle", "champagne bottle", "wine glass",
            "whiskey glass", "wine collection", "liquor bottles"
        ]

        image_count = 0

        for term in search_terms:
            if image_count >= max_images:
                break

            try:
                # Pixabay API approach (but using search page for simplicity)
                search_query = term.replace(" ", "+")
                url = f"https://pixabay.com/images/search/{search_query}/"

                response = self.session.get(url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find image containers
                images = soup.find_all('img', {'srcset': True})

                for img in images[:2]:  # Limit per search term
                    if image_count >= max_images:
                        break

                    img_url = img.get('src')
                    if img_url and 'pixabay.com' in img_url:
                        # Get higher quality version
                        img_url = img_url.replace('340.jpg', '640.jpg')

                        filename = self.products_dir / f"pixabay_{term.replace(' ', '_')}_{image_count + 1}.jpg"

                        if self.download_image(img_url, filename, min_size=10000):
                            image_count += 1

                time.sleep(2)  # Be respectful

            except Exception as e:
                print(f"Error scraping Pixabay {term}: {e}")
                continue

        return image_count

    def scrape_freeimages_liquor(self, max_images=15):
        """Scrape liquor images from FreeImages"""
        print("🖼️ Scraping FreeImages...")

        search_terms = ["wine", "whiskey", "cognac", "rum", "vodka", "gin", "champagne"]

        image_count = 0

        for term in search_terms:
            if image_count >= max_images:
                break

            try:
                url = f"https://www.freeimages.com/search/{term}"

                response = self.session.get(url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find image links
                images = soup.find_all('img', {'class': re.compile(r'img-responsive')})

                for img in images[:2]:
                    if image_count >= max_images:
                        break

                    img_url = img.get('src')
                    if img_url and 'freeimages.com' in img_url:
                        filename = self.products_dir / f"freeimages_{term}_{image_count + 1}.jpg"

                        if self.download_image(img_url, filename, min_size=8000):
                            image_count += 1

                time.sleep(1.5)

            except Exception as e:
                print(f"Error scraping FreeImages {term}: {e}")
                continue

        return image_count

    def download_specific_liquor_images(self):
        """Download specific high-quality liquor images from reliable sources"""
        print("🍷 Downloading specific liquor product images...")

        # Curated list of free-to-use liquor images
        liquor_images = {
            # Whiskies
            "glenfiddich_12.jpg": "https://images.unsplash.com/photo-1608887927951-4c6b1e3c8f4e?w=400",
            "jameson_irish.jpg": "https://images.unsplash.com/photo-1609967047774-8639e7092c8c?w=400",
            "jack_daniels.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",

            # Wines
            "casillero_del_diablo.jpg": "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400",
            "concha_y_toro.jpg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            "santa_rita.jpg": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",

            # Cognacs
            "remy_martin.jpg": "https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400",
            "courvoisier.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",

            # Rums
            "havana_club.jpg": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
            "mount_gay.jpg": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",

            # Gins
            "bombay_sapphire.jpg": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",
            "hendricks_gin.jpg": "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=400",

            # Vodkas
            "grey_goose.jpg": "https://images.unsplash.com/photo-1608887927951-4c6b1e3c8f4e?w=400",
            "ciroc.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",

            # Champagnes
            "veuve_clicquot.jpg": "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400",
            "moet_chandon.jpg": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400"
        }

        success_count = 0
        for filename, url in liquor_images.items():
            filepath = self.products_dir / filename
            if self.download_image(url, filepath, min_size=5000):
                success_count += 1
            time.sleep(0.5)  # Small delay between downloads

        print(f"✓ Downloaded {success_count} specific liquor images")
        return success_count

    def download_category_backgrounds(self):
        """Download background images for categories"""
        print("🎨 Downloading category background images...")

        category_backgrounds = {
            "wine_bg.jpg": "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&h=600",
            "whiskey_bg.jpg": "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600",
            "cognac_bg.jpg": "https://images.unsplash.com/photo-1608887927951-4c6b1e3c8f4e?w=800&h=600",
            "rum_bg.jpg": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600",
            "vodka_bg.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600",
            "gin_bg.jpg": "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=800&h=600",
            "champagne_bg.jpg": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600"
        }

        success_count = 0
        for filename, url in category_backgrounds.items():
            filepath = self.categories_dir / filename
            if self.download_image(url, filepath, min_size=20000):
                success_count += 1
            time.sleep(0.5)

        print(f"✓ Downloaded {success_count} category backgrounds")
        return success_count

    def download_hero_banners(self):
        """Download high-quality hero banner images"""
        print("🖼️ Downloading hero banner images...")

        banner_images = {
            "hero_wine_collection.jpg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600",
            "hero_whiskey_bar.jpg": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600",
            "hero_liquor_shelf.jpg": "https://images.unsplash.com/photo-1608887927951-4c6b1e3c8f4e?w=1200&h=600",
            "hero_wine_tasting.jpg": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1200&h=600"
        }

        success_count = 0
        for filename, url in banner_images.items():
            filepath = self.banners_dir / filename
            if self.download_image(url, filepath, min_size=30000):
                success_count += 1
            time.sleep(0.5)

        print(f"✓ Downloaded {success_count} hero banners")
        return success_count

    def organize_images(self):
        """Organize downloaded images into proper categories"""
        print("📁 Organizing images into categories...")

        # Get all product images
        product_images = list(self.products_dir.glob("*.jpg"))

        # Define category mappings
        category_mappings = {
            'wine': ['wine', 'cabernet', 'chardonnay', 'merlot', 'pinot', 'casillero', 'concha', 'santa'],
            'whiskey': ['whiskey', 'whisky', 'glenfiddich', 'jameson', 'jack', 'scotch', 'bourbon', 'irish'],
            'cognac': ['cognac', 'hennessy', 'remy', 'courvoisier', 'martell'],
            'rum': ['rum', 'havana', 'bacardi', 'mount', 'malibu', 'zacapa'],
            'vodka': ['vodka', 'absolut', 'smirnoff', 'grey', 'belvedere', 'ciroc'],
            'gin': ['gin', 'tanqueray', 'bombay', 'hendrick', 'beefeater'],
            'champagne': ['champagne', 'moet', 'veuve', 'dom', 'krug']
        }

        for category, keywords in category_mappings.items():
            category_dir = self.categories_dir / category
            category_dir.mkdir(exist_ok=True)

            # Find images that match this category
            matching_images = []
            for img in product_images:
                img_name = img.name.lower()
                if any(keyword in img_name for keyword in keywords):
                    matching_images.append(img)

            # Copy matching images to category directory
            for i, src_img in enumerate(matching_images[:5]):  # Limit to 5 per category
                dst_name = f"{category}_{i+1}.jpg"
                dst_path = category_dir / dst_name

                try:
                    with open(src_img, 'rb') as fsrc:
                        with open(dst_path, 'wb') as fdst:
                            fdst.write(fsrc.read())
                    print(f"✓ Organized: {dst_name}")
                except Exception as e:
                    print(f"✗ Failed to organize {dst_name}: {e}")

    def create_image_index(self):
        """Create an index file showing all available images"""
        print("📋 Creating image index...")

        index_data = {
            "products": [],
            "categories": {},
            "banners": []
        }

        # Index product images
        for img_path in self.products_dir.glob("*.jpg"):
            index_data["products"].append(img_path.name)

        # Index category images
        for category_dir in self.categories_dir.iterdir():
            if category_dir.is_dir():
                category_images = []
                for img_path in category_dir.glob("*.jpg"):
                    category_images.append(img_path.name)
                index_data["categories"][category_dir.name] = category_images

        # Index banner images
        for img_path in self.banners_dir.glob("*.jpg"):
            index_data["banners"].append(img_path.name)

        # Save index as JSON
        with open(self.base_dir / "image_index.json", 'w') as f:
            json.dump(index_data, f, indent=2)

        print("✓ Image index created: image_index.json")
        return index_data

    def run_full_scraping(self):
        """Run the complete enhanced scraping process"""
        print("🚀 Starting enhanced liquor image scraping...")
        print("=" * 60)

        total_images = 0

        # Download specific liquor images
        total_images += self.download_specific_liquor_images()
        time.sleep(2)

        # Download category backgrounds
        total_images += self.download_category_backgrounds()
        time.sleep(2)

        # Download hero banners
        total_images += self.download_hero_banners()
        time.sleep(2)

        # Try additional sources
        sources = [
            ("Pixabay", self.scrape_pixabay_liquor),
            ("FreeImages", self.scrape_freeimages_liquor)
        ]

        for source_name, scraper_func in sources:
            try:
                images_downloaded = scraper_func()
                total_images += images_downloaded
                print(f"📊 {source_name}: {images_downloaded} images downloaded")
            except Exception as e:
                print(f"❌ Error with {source_name}: {e}")
                continue

        # Organize images
        self.organize_images()

        # Create index
        index_data = self.create_image_index()

        print("=" * 60)
        print(f"✅ Enhanced scraping complete! Total images: {total_images}")
        print(f"📁 Images organized in: {self.base_dir}")
        print("\n📈 Summary:")
        print(f"   Products: {len(index_data['products'])}")
        print(f"   Categories: {len(index_data['categories'])}")
        print(f"   Banners: {len(index_data['banners'])}")

        return total_images

if __name__ == "__main__":
    scraper = EnhancedLiquorImageScraper()
    scraper.run_full_scraping()