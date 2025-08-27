#!/usr/bin/env python3
"""
Liquor Website Image Scraper
Scrapes product images from various liquor websites for the ARAMAC website replica.
"""

import requests
import os
import time
import json
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import re
from pathlib import Path
import argparse

class LiquorImageScraper:
    def __init__(self, base_dir="images"):
        self.base_dir = Path(base_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

        # Create directories
        self.products_dir = self.base_dir / "products"
        self.categories_dir = self.base_dir / "categories"
        self.banners_dir = self.base_dir / "banners"

        for dir_path in [self.products_dir, self.categories_dir, self.banners_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

    def download_image(self, url, filename, min_size=5000):
        """Download an image with size validation"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            # Check content type
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                return False

            # Check size
            if len(response.content) < min_size:
                return False

            # Save image
            with open(filename, 'wb') as f:
                f.write(response.content)

            print(f"✓ Downloaded: {filename.name}")
            return True

        except Exception as e:
            print(f"✗ Failed to download {url}: {e}")
            return False

    def scrape_wine_com(self, max_images=20):
        """Scrape wine images from wine.com"""
        print("🍷 Scraping Wine.com...")

        categories = [
            "red-wine",
            "white-wine",
            "sparkling-wine",
            "rose-wine"
        ]

        image_count = 0

        for category in categories:
            if image_count >= max_images:
                break

            try:
                url = f"https://www.wine.com/list/wine/{category}/7155-124-2-0"
                response = self.session.get(url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find product images
                images = soup.find_all('img', {'class': re.compile(r'product-image')})

                for img in images:
                    if image_count >= max_images:
                        break

                    img_url = img.get('src') or img.get('data-src')
                    if img_url:
                        # Convert to high quality if available
                        if '150x150' in img_url:
                            img_url = img_url.replace('150x150', '300x300')

                        filename = self.products_dir / f"wine_{category}_{image_count + 1}.jpg"

                        if self.download_image(img_url, filename):
                            image_count += 1

                time.sleep(2)  # Be respectful

            except Exception as e:
                print(f"Error scraping Wine.com {category}: {e}")
                continue

        return image_count

    def scrape_unsplash_liquor(self, max_images=15):
        """Scrape liquor images from Unsplash"""
        print("📸 Scraping Unsplash liquor images...")

        # Unsplash search URLs for liquor-related terms
        search_terms = [
            "wine", "whiskey", "whisky", "cognac", "rum", "vodka", "gin",
            "champagne", "wine-bottle", "liquor", "spirits"
        ]

        image_count = 0

        for term in search_terms:
            if image_count >= max_images:
                break

            try:
                # Unsplash API approach (requires API key for production)
                # For demo, we'll use direct search URLs
                url = f"https://unsplash.com/s/photos/{term}"

                response = self.session.get(url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find image elements
                images = soup.find_all('img', {'src': re.compile(r'images\.unsplash\.com')})

                for img in images[:3]:  # Limit per search term
                    if image_count >= max_images:
                        break

                    img_url = img.get('src')
                    if img_url and 'images.unsplash.com' in img_url:
                        # Get higher quality version
                        img_url = re.sub(r'(\?|&)w=\d+', r'\g<1>w=800', img_url)
                        img_url = re.sub(r'(\?|&)h=\d+', r'\g<1>h=600', img_url)

                        filename = self.products_dir / f"unsplash_{term}_{image_count + 1}.jpg"

                        if self.download_image(img_url, filename, min_size=10000):
                            image_count += 1

                time.sleep(1)  # Be respectful

            except Exception as e:
                print(f"Error scraping Unsplash {term}: {e}")
                continue

        return image_count

    def scrape_pexels_liquor(self, max_images=10):
        """Scrape liquor images from Pexels"""
        print("🖼️ Scraping Pexels liquor images...")

        search_terms = ["wine", "whiskey", "cognac", "rum", "vodka"]

        image_count = 0

        for term in search_terms:
            if image_count >= max_images:
                break

            try:
                url = f"https://www.pexels.com/search/{term}/"
                response = self.session.get(url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find image elements
                images = soup.find_all('img', {'data-big-src': True})

                for img in images[:2]:  # Limit per search term
                    if image_count >= max_images:
                        break

                    img_url = img.get('data-big-src') or img.get('src')
                    if img_url:
                        filename = self.products_dir / f"pexels_{term}_{image_count + 1}.jpg"

                        if self.download_image(img_url, filename, min_size=15000):
                            image_count += 1

                time.sleep(1.5)  # Be respectful

            except Exception as e:
                print(f"Error scraping Pexels {term}: {e}")
                continue

        return image_count

    def create_category_images(self):
        """Create category-specific images by renaming some products"""
        print("📁 Creating category-specific images...")

        categories = {
            'wine': ['cabernet', 'chardonnay', 'merlot', 'pinot'],
            'whiskey': ['scotch', 'bourbon', 'irish', 'canadian'],
            'cognac': ['hennessy', 'remy', 'courvoisier', 'martell'],
            'rum': ['bacardi', 'havana', 'mount_gay', 'malibu'],
            'vodka': ['absolut', 'smirnoff', 'grey_goose', 'belvedere'],
            'gin': ['tanqueray', 'bombay', 'hendrick', 'beefeater'],
            'champagne': ['moet', 'veuve_clicquot', 'dom_perignon', 'krug']
        }

        # Get list of downloaded images
        product_images = list(self.products_dir.glob("*.jpg"))

        for category, brands in categories.items():
            category_dir = self.categories_dir / category
            category_dir.mkdir(exist_ok=True)

            # Copy/create images for each category
            for i, brand in enumerate(brands):
                if i < len(product_images):
                    src = product_images[i]
                    dst = category_dir / f"{brand}.jpg"

                    try:
                        # Copy file
                        with open(src, 'rb') as fsrc:
                            with open(dst, 'wb') as fdst:
                                fdst.write(fsrc.read())
                        print(f"✓ Created category image: {dst.name}")
                    except Exception as e:
                        print(f"✗ Failed to create {dst.name}: {e}")

    def download_featured_images(self):
        """Download some specific featured product images"""
        print("🌟 Downloading featured product images...")

        # Some free-to-use liquor images from reliable sources
        featured_images = {
            "macallan_18.jpg": "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400",
            "cabernet_sauvignon.jpg": "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400",
            "hennessy_vsop.jpg": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",
            "zacapa_23.jpg": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
            "tanqueray_gin.jpg": "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=400"
        }

        for filename, url in featured_images.items():
            filepath = self.products_dir / filename
            self.download_image(url, filepath, min_size=5000)
            time.sleep(0.5)

    def create_banner_images(self):
        """Create banner images from some of the downloaded images"""
        print("🎨 Creating banner images...")

        # Get some product images to use as banners
        product_images = list(self.products_dir.glob("*.jpg"))[:3]

        for i, src in enumerate(product_images):
            dst = self.banners_dir / f"banner_{i + 1}.jpg"
            try:
                with open(src, 'rb') as fsrc:
                    with open(dst, 'wb') as fdst:
                        fdst.write(fsrc.read())
                print(f"✓ Created banner: {dst.name}")
            except Exception as e:
                print(f"✗ Failed to create banner {dst.name}: {e}")

    def run_scraping(self):
        """Run the complete scraping process"""
        print("🚀 Starting liquor image scraping process...")
        print("=" * 50)

        total_images = 0

        # Download featured images first
        self.download_featured_images()

        # Scrape from multiple sources
        sources = [
            ("Wine.com", self.scrape_wine_com),
            ("Unsplash", self.scrape_unsplash_liquor),
            ("Pexels", self.scrape_pexels_liquor)
        ]

        for source_name, scraper_func in sources:
            try:
                images_downloaded = scraper_func()
                total_images += images_downloaded
                print(f"📊 {source_name}: {images_downloaded} images downloaded")
            except Exception as e:
                print(f"❌ Error with {source_name}: {e}")
                continue

        # Create category-specific images
        self.create_category_images()

        # Create banner images
        self.create_banner_images()

        print("=" * 50)
        print(f"✅ Scraping complete! Total images: {total_images}")
        print(f"📁 Images saved to: {self.base_dir}")

        return total_images

def main():
    parser = argparse.ArgumentParser(description='Scrape liquor product images')
    parser.add_argument('--output', '-o', default='images', help='Output directory')
    parser.add_argument('--max-images', '-m', type=int, default=50, help='Maximum images to download')

    args = parser.parse_args()

    scraper = LiquorImageScraper(args.output)

    # Update the scraper functions to respect max_images
    original_wine_com = scraper.scrape_wine_com
    def limited_wine_com():
        return original_wine_com(args.max_images // 4)

    original_unsplash = scraper.scrape_unsplash_liquor
    def limited_unsplash():
        return original_unsplash(args.max_images // 3)

    original_pexels = scraper.scrape_pexels_liquor
    def limited_pexels():
        return original_pexels(args.max_images // 4)

    # Replace functions
    scraper.scrape_wine_com = limited_wine_com
    scraper.scrape_unsplash_liquor = limited_unsplash
    scraper.scrape_pexels_liquor = limited_pexels

    scraper.run_scraping()

if __name__ == "__main__":
    main()