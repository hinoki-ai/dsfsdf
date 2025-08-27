#!/usr/bin/env python3
"""
Update HTML files to use downloaded images
Replaces placeholder gradients with actual product images
"""

import json
import os
from pathlib import Path
import re

class HTMLImageUpdater:
    def __init__(self, base_dir=".", images_dir="images"):
        self.base_dir = Path(base_dir)
        self.images_dir = Path(images_dir)

        # Load image index
        with open(self.images_dir / "image_index.json", 'r') as f:
            self.image_index = json.load(f)

    def update_homepage_hero(self):
        """Update homepage hero section with banner image"""
        homepage = self.base_dir / "index.html"

        if not homepage.exists():
            print("❌ Homepage not found")
            return False

        with open(homepage, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace hero section background
        hero_pattern = r'(<section class="hero">)'
        hero_replacement = r'<section class="hero" style="background-image: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(220, 38, 38, 0.1)), url(\'images/banners/hero_wine_collection.jpg\'); background-size: cover; background-position: center;">'

        content = re.sub(hero_pattern, hero_replacement, content)

        with open(homepage, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✓ Updated homepage hero section")
        return True

    def update_product_images(self):
        """Update product images in various pages"""
        product_mapping = {
            "Whisky Macallan 18 Años": "macallan_18.jpg",
            "Vino Cabernet Sauvignon": "cabernet_sauvignon.jpg",
            "Coñac Hennessy VSOP": "hennessy_vsop.jpg",
            "Ron Zacapa 23": "zacapa_23.jpg",
            "Tanqueray London Dry": "tanqueray_gin.jpg"
        }

        # Update homepage
        self._update_page_product_images("index.html", product_mapping)

        # Update products page
        self._update_page_product_images("productos.html", product_mapping)

        # Update cart page
        self._update_page_product_images("carrito.html", product_mapping)

        # Update checkout page
        self._update_page_product_images("checkout.html", product_mapping)

        print("✓ Updated product images across pages")
        return True

    def _update_page_product_images(self, page_name, product_mapping):
        """Update product images in a specific page"""
        page_path = self.base_dir / page_name

        if not page_path.exists():
            return False

        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace product images with real ones
        for product_name, image_name in product_mapping.items():
            # Pattern to match the product name and replace the image div
            pattern = rf'(<h3 class="product-title">{re.escape(product_name)}</h3>)'
            replacement = f'<h3 class="product-title">{product_name}</h3>\n                <div class="product-image" style="background-image: url(\'images/products/{image_name}\'); background-size: cover; background-position: center;">'

            content = re.sub(pattern, replacement, content)

        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True

    def update_category_backgrounds(self):
        """Update category pages with real background images"""
        categories_page = self.base_dir / "categorias.html"

        if not categories_page.exists():
            print("❌ Categories page not found")
            return False

        with open(categories_page, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update category background images
        category_backgrounds = {
            "Vinos": "wine_bg.jpg",
            "Whiskies": "whiskey_bg.jpg",
            "Coñacs": "cognac_bg.jpg",
            "Rones": "rum_bg.jpg",
            "Vodkas": "vodka_bg.jpg",
            "Gins": "gin_bg.jpg",
            "Champagnes": "champagne_bg.jpg"
        }

        for category_name, bg_image in category_backgrounds.items():
            pattern = rf'(<h2 class="category-title">{re.escape(category_name)}</h2>)'
            replacement = f'<h2 class="category-title">{category_name}</h2>\n                        <div class="category-image" style="background-image: url(\'images/categories/{bg_image}\'); background-size: cover; background-position: center;">'

            content = re.sub(pattern, replacement, content)

        with open(categories_page, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✓ Updated category backgrounds")
        return True

    def update_wishlist_images(self):
        """Update wishlist page with real product images"""
        wishlist_page = self.base_dir / "wishlist.html"

        if not wishlist_page.exists():
            print("❌ Wishlist page not found")
            return False

        with open(wishlist_page, 'r', encoding='utf-8') as f:
            content = f.read()

        # Map wishlist items to available images
        wishlist_mapping = {
            "Whisky Macallan 18 Años Single Malt": "macallan_18.jpg",
            "Vino Cabernet Sauvignon Maipo Valley": "cabernet_sauvignon.jpg",
            "Coñac Hennessy VSOP Privilege": "hennessy_vsop.jpg",
            "Ron Zacapa 23 Centenario": "zacapa_23.jpg",
            "Tanqueray London Dry": "tanqueray_gin.jpg"
        }

        for product_name, image_name in wishlist_mapping.items():
            # Replace the background gradient with actual image
            pattern = rf'(<h3 class="item-title">{re.escape(product_name)}</h3>)'
            replacement = f'<h3 class="item-title">{product_name}</h3>\n                    <div class="item-image" style="background-image: url(\'images/products/{image_name}\'); background-size: cover; background-position: center;">'

            content = re.sub(pattern, replacement, content)

        with open(wishlist_page, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✓ Updated wishlist images")
        return True

    def add_image_css_optimization(self):
        """Add CSS optimization for better image loading"""
        css_file = self.base_dir / "styles.css"

        if not css_file.exists():
            print("❌ CSS file not found")
            return False

        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Add image optimization CSS
        image_css = """
/* Image optimization */
.product-image, .item-image, .category-image {
    background-repeat: no-repeat;
    background-attachment: local;
    transition: background-image 0.3s ease;
}

.product-image::before, .item-image::before, .category-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
}

.product-card:hover .product-image::before,
.wishlist-item:hover .item-image::before {
    background: rgba(255, 255, 255, 0.05);
}

/* Responsive image loading */
@media (prefers-reduced-motion: reduce) {
    .product-image, .item-image, .category-image {
        transition: none;
    }
}

/* Image lazy loading fallback */
.product-image, .item-image, .category-image {
    background-color: hsl(var(--secondary));
}
"""

        # Insert before the final closing brace
        content = content.rstrip() + "\n" + image_css + "\n}"

        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✓ Added image optimization CSS")
        return True

    def create_image_preloader(self):
        """Create a JavaScript image preloader"""
        preloader_js = """
// Image preloader for better performance
document.addEventListener('DOMContentLoaded', function() {
    const imageElements = document.querySelectorAll('.product-image, .item-image, .category-image');

    imageElements.forEach(img => {
        if (img.style.backgroundImage && img.style.backgroundImage !== 'none') {
            const imgUrl = img.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (imgUrl && imgUrl[1]) {
                const fullUrl = imgUrl[1];

                // Create a temporary image to preload
                const tempImg = new Image();
                tempImg.onload = function() {
                    // Image loaded successfully
                    img.style.opacity = '1';
                };
                tempImg.onerror = function() {
                    // Fallback to gradient if image fails to load
                    img.style.backgroundImage = 'linear-gradient(135deg, hsl(var(--amber-100)), hsl(var(--burgundy-100)))';
                };
                tempImg.src = fullUrl;
            }
        }
    });

    console.log('🍷 ARAMAC image preloader initialized');
});
"""

        js_file = self.base_dir / "image-preloader.js"
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(preloader_js)

        print("✓ Created image preloader script")
        return True

    def update_all_pages(self):
        """Update all pages with real images"""
        print("🚀 Starting HTML image updates...")
        print("=" * 40)

        updates = [
            ("Homepage hero", self.update_homepage_hero),
            ("Product images", self.update_product_images),
            ("Category backgrounds", self.update_category_backgrounds),
            ("Wishlist images", self.update_wishlist_images),
            ("CSS optimization", self.add_image_css_optimization),
            ("Image preloader", self.create_image_preloader)
        ]

        successful_updates = 0

        for update_name, update_func in updates:
            try:
                if update_func():
                    successful_updates += 1
                    print(f"✅ {update_name}")
                else:
                    print(f"❌ {update_name}")
            except Exception as e:
                print(f"❌ {update_name}: {e}")

        print("=" * 40)
        print(f"✅ Update complete! {successful_updates}/{len(updates)} updates successful")

        return successful_updates == len(updates)

if __name__ == "__main__":
    updater = HTMLImageUpdater()
    updater.update_all_pages()