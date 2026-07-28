import Link from "next/link";
import { pb } from "@/lib/pocketbase";
import { HomepageSettingsRecord, PortfolioRecord, TestimonialRecord } from "@/types";
import ContactForm from "@/components/ContactForm";

async function getHomepageSettings(): Promise<HomepageSettingsRecord | null> {
  try {
    const settings = await pb.collection("homepage_settings").getFirstListItem('id != ""');
    return settings as unknown as HomepageSettingsRecord;
  } catch {
    return null;
  }
}

async function getFeaturedPortfolio(): Promise<PortfolioRecord[]> {
  try {
    const records = await pb.collection("portfolio").getFullList({
      filter: 'featured = true && published = true',
      sort: '-completionDate',
      limit: 6,
    });
    return records as unknown as PortfolioRecord[];
  } catch {
    return [];
  }
}

async function getFeaturedTestimonials(): Promise<TestimonialRecord[]> {
  try {
    const records = await pb.collection("testimonials").getFullList({
      filter: 'featured = true && published = true',
      sort: '-created',
      limit: 3,
    });
    return records as unknown as TestimonialRecord[];
  } catch {
    return [];
  }
}

async function getServices() {
  try {
    const records = await pb.collection("services").getFullList({
      filter: 'published = true && featured = true',
      sort: '-created',
    });
    return records as any[];
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    const records = await pb.collection("products").getFullList({
      filter: 'published = true && featured = true',
      sort: '-created',
      limit: 6,
    });
    return records as any[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [settings, portfolio, testimonials, services, products] = await Promise.all([
    getHomepageSettings(),
    getFeaturedPortfolio(),
    getFeaturedTestimonials(),
    getServices(),
    getProducts(),
  ]);

  return (
    <div>
      <Hero settings={settings} />
      <PortfolioSection items={portfolio} />
      <ServicesSection services={services} />
      <ProductsSection products={products} />
      <TestimonialsSection items={testimonials} />
      <AboutSection />
      <ClientsSection />
      <ContactSection settings={settings} />
    </div>
  );
}

function Hero({ settings }: { settings: HomepageSettingsRecord | null }) {
  const heroImage = settings?.heroImage 
    ? `${pb.baseUrl}/api/files/${settings.id}/${settings.heroImage}` 
    : null;

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Hero background"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
      )}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          {settings?.headline || "CREATING VISUAL STORIES"}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          {settings?.subtitle || "Videographer & Content Creator"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#portfolio"
            className="px-8 py-4 bg-accent text-background font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          >
            {settings?.ctaText || "View My Work"}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border border-foreground/20 text-foreground font-semibold rounded-lg hover:bg-surface transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function PortfolioSection({ items }: { items: PortfolioRecord[] }) {
  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected Work</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collection of my recent projects
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">No portfolio items yet. Add some in the admin panel!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const imageUrl = item.thumbnail
                ? `${pb.baseUrl}/api/files/${item.id}/${item.thumbnail}`
                : null;

              return (
                <Link
                  key={item.id}
                  href={`/portfolio#${item.id}`}
                  className="group block bg-surface rounded-xl overflow-hidden hover:ring-2 hover:ring-accent transition-all"
                >
                  <div className="aspect-video bg-surface-light relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-600">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    {item.clientName && (
                      <p className="text-xs text-gray-500 mt-2">Client: {item.clientName}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-background transition-colors rounded-lg font-medium"
          >
            View All Work
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }: { services: any[] }) {
  return (
    <section id="services" className="py-24 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional services tailored to bring your vision to life
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services yet. Add some in the admin panel!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-background p-8 rounded-xl border border-surface-light hover:border-accent/50 transition-colors"
              >
                <div className="text-4xl mb-4">{service.icon || '🎬'}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                {service.startingPrice && (
                  <p className="text-accent font-semibold">
                    From ₦{service.startingPrice.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductsSection({ products }: { products: any[] }) {
  const rentalProducts = products.filter((p) => p.productType === 'Rental' || p.productType === 'Both');
  const saleProducts = products.filter((p) => p.productType === 'Sale' || p.productType === 'Both');

  return (
    <section id="products" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Equipment & Resources</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional gear rentals, sales & learning materials for creators
          </p>
        </div>

        {rentalProducts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-accent">Rentals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalProducts.map((product) => {
                const imageUrl = product.images?.[0]
                  ? `${pb.baseUrl}/api/files/${product.id}/${product.images[0]}`
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-surface rounded-xl overflow-hidden border border-surface-light hover:border-accent/50 transition-colors"
                  >
                    <div className="aspect-video bg-surface-light relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {product.category || 'Equipment'} · Rental
                      </span>
                      <h4 className="text-lg font-bold mt-2 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                      {product.rentalPrice > 0 && (
                        <p className="text-accent font-semibold">
                          ₦{product.rentalPrice.toLocaleString()}/day
                        </p>
                      )}
                      <Link
                        href={`/rentals?product=${product.id}`}
                        className="mt-4 inline-block px-4 py-2 bg-accent text-background text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {saleProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8 text-accent">Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleProducts.map((product) => {
                const imageUrl = product.images?.[0]
                  ? `${pb.baseUrl}/api/files/${product.id}/${product.images[0]}`
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-surface rounded-xl overflow-hidden border border-surface-light hover:border-accent/50 transition-colors"
                  >
                    <div className="aspect-video bg-surface-light relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {product.category || 'Product'} · Sale
                      </span>
                      <h4 className="text-lg font-bold mt-2 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                      {product.salePrice > 0 && (
                        <p className="text-accent font-semibold">
                          ₦{product.salePrice.toLocaleString()}
                        </p>
                      )}
                      <Link
                        href={`/products#${product.id}`}
                        className="mt-4 inline-block px-4 py-2 border border-accent text-accent text-sm font-medium rounded-lg hover:bg-accent hover:text-background transition-colors"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <p className="text-center text-gray-500">No products yet. Add some in the admin panel!</p>
        )}
      </div>
    </section>
  );
}

function TestimonialsSection({ items }: { items: TestimonialRecord[] }) {
  return (
    <section className="py-24 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            What my clients say about working together
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">No testimonials yet. Add some in the admin panel!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-background p-8 rounded-xl border border-surface-light"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= item.rating ? 'text-accent' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">&quot;{item.review}&quot;</p>
                <div>
                  <p className="font-semibold">{item.customerName}</p>
                  {item.company && (
                    <p className="text-sm text-gray-400">{item.company}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
            <p className="text-gray-300 text-lg mb-6">
              I&apos;m a passionate videographer and content creator based in Nigeria, specializing in crafting visual narratives that resonate.
            </p>
            <p className="text-gray-400 mb-8">
              With over 8 years of experience in the industry, I&apos;ve had the privilege of working with brands, artists, and storytellers across the globe. My approach combines technical expertise with artistic vision to create content that doesn&apos;t just look good — it feels right.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎬', title: 'Cinematography' },
                { icon: '✂️', title: 'Editing' },
                { icon: '🎨', title: 'Color Grading' },
                { icon: '📱', title: 'Social Content' },
                { icon: '🎵', title: 'Sound Design' },
                { icon: '🚀', title: 'Motion Graphics' },
              ].map((skill) => (
                <div key={skill.title} className="flex items-center space-x-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-sm font-medium">{skill.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { number: '200+', label: 'Projects Completed' },
              { number: '50+', label: 'Happy Clients' },
              { number: '10M+', label: 'Views Generated' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  const clients = [
    'DSTV', 'MTN', 'AIRTEL', 'GLO', 'ZENITH BANK', 'GTBank', 'FIRST BANK', 'SHOWMAX'
  ];

  return (
    <section id="clients" className="py-24 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Clients & Collaborators</h2>
          <p className="text-gray-400 text-lg">Brands I&apos;ve had the pleasure of working with</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {clients.map((client) => (
            <div
              key={client}
              className="flex items-center justify-center h-20 bg-background rounded-lg border border-surface-light hover:border-accent/30 transition-colors"
            >
              <span className="text-xl font-bold text-gray-400 hover:text-accent transition-colors">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ settings }: { settings: HomepageSettingsRecord | null }) {
  return <ContactForm settings={settings} />;
}
