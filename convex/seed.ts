import { mutation } from "./_generated/server"

// Seed initial data for the liquor store
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    
    // Create categories
    const wineCategory = await ctx.db.insert("categories", {
      name: "Vinos",
      slug: "vinos",
      description: "Selección premium de vinos tintos, blancos y rosados",
      nameEs: "Vinos",
      nameEn: "Wines",
      descriptionEs: "Selección premium de vinos tintos, blancos y rosados",
      descriptionEn: "Premium selection of red, white and rosé wines",
      isActive: true,
      sortOrder: 1,
      metaTitle: "Vinos Premium - Licorería ARAMAC",
      metaDescription: "Descubre nuestra selección de vinos chilenos e internacionales",
      createdAt: now,
      updatedAt: now,
    })
    
    const beerCategory = await ctx.db.insert("categories", {
      name: "Cervezas",
      slug: "cervezas",
      description: "Cervezas artesanales y comerciales de todo el mundo",
      nameEs: "Cervezas",
      nameEn: "Beers", 
      descriptionEs: "Cervezas artesanales y comerciales de todo el mundo",
      descriptionEn: "Craft and commercial beers from around the world",
      isActive: true,
      sortOrder: 2,
      metaTitle: "Cervezas - Licorería ARAMAC",
      metaDescription: "Amplia variedad de cervezas nacionales e internacionales",
      createdAt: now,
      updatedAt: now,
    })
    
    const spiritsCategory = await ctx.db.insert("categories", {
      name: "Destilados",
      slug: "destilados",
      description: "Ron, whisky, vodka, gin y otros destilados finos",
      nameEs: "Destilados",
      nameEn: "Spirits",
      descriptionEs: "Ron, whisky, vodka, gin y otros destilados finos",
      descriptionEn: "Fine rum, whisky, vodka, gin and other distillates",
      isActive: true,
      sortOrder: 3,
      metaTitle: "Destilados Premium - Licorería ARAMAC",
      metaDescription: "Destilados de alta calidad y marcas reconocidas mundialmente",
      createdAt: now,
      updatedAt: now,
    })
    
    // Create sample products
    const products = [
      // Chilean Wines
      {
        name: "Casillero del Diablo Cabernet Sauvignon",
        slug: "casillero-diablo-cabernet-sauvignon",
        description: "Vino tinto chileno con notas frutales y especiadas, perfecto para carnes rojas",
        shortDescription: "Vino tinto chileno premium con 13.5% de alcohol",
        price: 8990,
        compareAtPrice: 10990,
        sku: "WINE-CDD-CAB-001",
        categoryId: wineCategory,
        images: [
          {
            url: "/images/products/casillero-diablo-cab.jpg",
            alt: "Casillero del Diablo Cabernet Sauvignon",
            isPrimary: true,
          }
        ],
        alcoholData: {
          abv: 13.5,
          volume: 750,
          volumeUnit: "ml",
          origin: "Valle Central, Chile",
          producer: "Concha y Toro",
          variety: "Cabernet Sauvignon",
          vintage: 2021,
        },
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
          legalNotice: "Prohibida su venta a menores de 18 años",
        },
        inventory: {
          quantity: 50,
          reserved: 0,
          lowStockThreshold: 10,
          trackInventory: true,
        },
        isActive: true,
        isFeatured: true,
        nameEs: "Casillero del Diablo Cabernet Sauvignon",
        nameEn: "Casillero del Diablo Cabernet Sauvignon",
        metaTitle: "Casillero del Diablo Cabernet Sauvignon - Vino Chileno",
        metaDescription: "Vino tinto chileno premium, ideal para ocasiones especiales",
        createdAt: now,
        updatedAt: now,
      },
      
      // Chilean Beer
      {
        name: "Cristal Cerveza Lager",
        slug: "cristal-cerveza-lager",
        description: "Cerveza lager chilena refrescante y suave, perfecta para acompañar comidas",
        shortDescription: "Cerveza lager chilena clásica con 4.6% de alcohol",
        price: 1290,
        sku: "BEER-CRIS-LAG-001",
        categoryId: beerCategory,
        images: [
          {
            url: "/images/products/cristal-lager.jpg",
            alt: "Cristal Cerveza Lager",
            isPrimary: true,
          }
        ],
        alcoholData: {
          abv: 4.6,
          volume: 350,
          volumeUnit: "ml",
          origin: "Chile",
          producer: "Cervecería Chile",
        },
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
          legalNotice: "Prohibida su venta a menores de 18 años",
        },
        inventory: {
          quantity: 100,
          reserved: 0,
          lowStockThreshold: 20,
          trackInventory: true,
        },
        isActive: true,
        isFeatured: false,
        nameEs: "Cristal Cerveza Lager",
        nameEn: "Cristal Lager Beer",
        metaTitle: "Cristal Lager - Cerveza Chilena",
        metaDescription: "Cerveza lager chilena refrescante, tradición desde 1850",
        createdAt: now,
        updatedAt: now,
      },
      
      // Premium Whisky
      {
        name: "Johnnie Walker Black Label",
        slug: "johnnie-walker-black-label",
        description: "Whisky escocés premium envejecido 12 años, con sabores complejos y ahumados",
        shortDescription: "Whisky escocés premium 12 años con 40% de alcohol",
        price: 32990,
        compareAtPrice: 36990,
        sku: "WHIS-JW-BL-001",
        categoryId: spiritsCategory,
        images: [
          {
            url: "/images/products/johnnie-walker-black.jpg", 
            alt: "Johnnie Walker Black Label",
            isPrimary: true,
          }
        ],
        alcoholData: {
          abv: 40,
          volume: 750,
          volumeUnit: "ml",
          origin: "Escocia",
          producer: "Diageo",
          agingProcess: "12 años en barricas de roble",
        },
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
          legalNotice: "Prohibida su venta a menores de 18 años",
        },
        inventory: {
          quantity: 25,
          reserved: 0,
          lowStockThreshold: 5,
          trackInventory: true,
        },
        isActive: true,
        isFeatured: true,
        nameEs: "Johnnie Walker Black Label",
        nameEn: "Johnnie Walker Black Label",
        metaTitle: "Johnnie Walker Black Label - Whisky Escocés Premium",
        metaDescription: "Whisky escocés envejecido 12 años, sabor excepcional y carácter distintivo",
        createdAt: now,
        updatedAt: now,
      },
      
      // Pisco (Chilean Spirit)
      {
        name: "Pisco Capel Reservado",
        slug: "pisco-capel-reservado",
        description: "Pisco chileno de alta calidad, destilado artesanalmente en el valle de Elqui",
        shortDescription: "Pisco chileno premium con 40% de alcohol",
        price: 12990,
        sku: "PISC-CAP-RES-001",
        categoryId: spiritsCategory,
        images: [
          {
            url: "/images/products/pisco-capel-reservado.jpg",
            alt: "Pisco Capel Reservado",
            isPrimary: true,
          }
        ],
        alcoholData: {
          abv: 40,
          volume: 700,
          volumeUnit: "ml",
          origin: "Valle de Elqui, Chile",
          producer: "Cooperativa Capel",
          variety: "Moscatel de Alejandría",
        },
        ageRequirement: {
          minimumAge: 18,
          requiresVerification: true,
          legalNotice: "Prohibida su venta a menores de 18 años",
        },
        inventory: {
          quantity: 40,
          reserved: 0,
          lowStockThreshold: 8,
          trackInventory: true,
        },
        isActive: true,
        isFeatured: true,
        nameEs: "Pisco Capel Reservado",
        nameEn: "Pisco Capel Reserved",
        metaTitle: "Pisco Capel Reservado - Destilado Chileno Premium",
        metaDescription: "Pisco chileno de alta calidad del Valle de Elqui, tradición desde 1938",
        createdAt: now,
        updatedAt: now,
      }
    ]
    
    // Insert all products
    for (const product of products) {
      await ctx.db.insert("products", product)
    }
    
    return {
      categoriesCreated: 3,
      productsCreated: products.length,
      message: "Database seeded successfully with Chilean liquor store data"
    }
  },
})