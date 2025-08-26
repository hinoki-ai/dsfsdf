import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { divineTranslationOracle } from "@/lib/i18n"
import {
  Wine,
  Beer,
  FlaskConical,
  Martini,
  Shield,
  Truck,
  Star,
  Users,
  Award,
  CheckCircle,
  Sparkles,
  Crown,
  Heart,
  ArrowRight,
  Play
} from "lucide-react"

interface HomePageProps {
  params: {
    locale: string
  }
}

// Mobile-first premium homepage with divine parsing oracle i18n
export default function Home({ params: { locale } }: HomePageProps) {
  // Get translations using divine parsing oracle
  const t = (key: string, fallback?: string) =>
    divineTranslationOracle.getTranslation(locale as any, key, fallback)

  return (
    <div className="min-h-screen bg-background mobile-first">
      <Header locale={locale} />

      {/* Premium Hero Section with Glass Morphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Background with Gradient and Glass Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-burgundy-500/10" />

        {/* Floating Elements for Premium Feel */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy-500/5 rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Premium Hero Content */}
            <div className="text-center mb-16 animate-fade-in-up">
              {/* Premium Badge with Glass Effect */}
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-white/10">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">{t('hero.ageVerification')}</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              {/* Premium Title with Enhanced Typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
                <span className="text-shadow">{t('hero.title')}</span>{' '}
                <span className="bg-gradient-to-r from-amber-500 via-red-500 to-burgundy-500 bg-clip-text text-transparent animate-fade-in-up">
                  ARAMAC
                </span>
              </h1>

              {/* Premium Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                {t('hero.description')}
              </p>

              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white shadow-premium px-8 py-6 text-lg font-semibold rounded-full group transition-all duration-300 hover:scale-105"
                >
                  {t('hero.exploreProducts')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-effect border-white/20 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {t('hero.viewPromotions')}
                </Button>
              </div>
            </div>

            {/* Premium Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {[
                { number: '1000+', label: t('stats.products'), icon: Wine },
                { number: '5000+', label: t('stats.clients'), icon: Users },
                { number: '98%', label: t('stats.satisfaction'), icon: Star },
                { number: '24/7', label: t('stats.support'), icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="text-center glass-effect rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/5 hover:border-amber-400/30 transition-all duration-300 group">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-amber-400 group-hover:text-amber-300 transition-colors" />
                  <div className="text-3xl font-bold mb-1 text-foreground">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Premium Categories Section with Enhanced Mobile Design */}
      <section className="py-20 bg-gradient-to-b from-background/50 to-background/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                name: t('categories.wine.name'),
                description: t('categories.wine.description'),
                icon: Wine,
                color: 'from-red-500 to-burgundy-500',
                bgColor: 'from-red-50 to-burgundy-50 dark:from-red-950/20 dark:to-burgundy-950/20'
              },
              {
                name: t('categories.beer.name'),
                description: t('categories.beer.description'),
                icon: Beer,
                color: 'from-amber-500 to-yellow-500',
                bgColor: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20'
              },
              {
                name: t('categories.spirits.name'),
                description: t('categories.spirits.description'),
                icon: FlaskConical,
                color: 'from-purple-500 to-indigo-500',
                bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20'
              },
              {
                name: t('categories.cocktails.name'),
                description: t('categories.cocktails.description'),
                icon: Martini,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
              }
            ].map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-premium transition-all duration-500 cursor-pointer glass-effect border-white/10 hover:border-white/20 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center p-8">
                  <div className={`mx-auto mb-6 w-20 h-20 bg-gradient-to-br ${category.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                    <category.icon className={`w-10 h-10 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3">{category.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-gradient-to-r from-background via-background/95 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: t('features.securePurchase.title'),
                description: t('features.securePurchase.description'),
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
              },
              {
                icon: Truck,
                title: t('features.reliableDelivery.title'),
                description: t('features.reliableDelivery.description'),
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
              },
              {
                icon: Award,
                title: t('features.premiumProducts.title'),
                description: t('features.premiumProducts.description'),
                color: 'from-amber-500 to-yellow-500',
                bgColor: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up glass-effect rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`mx-auto mb-6 w-20 h-20 bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                  <feature.icon className={`w-10 h-10 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer with Enhanced Mobile Design */}
      <footer className="bg-gradient-to-t from-background/95 to-background border-t border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Wine className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                  Licorería ARAMAC
                </span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
                  <Star className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
                  <Crown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-6 text-lg">{t('footer.categories')}</h4>
              <ul className="space-y-3">
                {['Vinos', 'Cervezas', 'Licores', 'Bebidas'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold mb-6 text-lg">{t('footer.services')}</h4>
              <ul className="space-y-3">
                {[t('footer.shipping'), t('footer.returns'), t('footer.support'), t('footer.faq')].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-6 text-lg">{t('footer.legal')}</h4>
              <ul className="space-y-3">
                {[t('footer.terms'), t('footer.privacy'), t('footer.agePolicy'), t('footer.contact')].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Footer Bottom */}
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 Licorería ARAMAC. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}