import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@orchies.click';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123';

async function waitForPocketBase(url, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('PocketBase did not become ready in time');
}

async function createCollection(pb, def) {
  try {
    await pb.collections.create(def);
    console.log(`  ✓ Created collection: ${def.name}`);
  } catch (error: any) {
    if (error.status === 409) {
      console.log(`  - Collection already exists: ${def.name}`);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log('Waiting for PocketBase to be ready...');
  await waitForPocketBase(PB_URL);
  console.log('PocketBase is ready!\n');

  const pb = new PocketBase(PB_URL);

  console.log('Authenticating as admin...');
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('Authenticated!\n');

  const collections: CollectionDef[] = [
    {
      name: 'portfolio',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'clientName', type: 'text', required: true },
        { name: 'category', type: 'select', required: true, options: { 
          values: ['Wedding', 'Commercial', 'Music Video', 'Corporate', 'Documentary', 'Event', 'Brand Film', 'Travel', 'Other'] 
        }},
        { name: 'description', type: 'text', required: false },
        { name: 'thumbnail', type: 'file', required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'gallery', type: 'file', required: false, options: { maxSelect: 10, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'video/mp4'] }},
        { name: 'youtubeLink', type: 'url', required: false },
        { name: 'vimeoLink', type: 'url', required: false },
        { name: 'completionDate', type: 'date', required: false },
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: false }},
        { name: 'published', type: 'bool', required: false, options: { defaultValue: true }},
      ]
    },
    {
      name: 'services',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'icon', type: 'text', required: false },
        { name: 'startingPrice', type: 'number', required: false },
        { name: 'coverImage', type: 'file', required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: true }},
        { name: 'published', type: 'bool', required: false, options: { defaultValue: true }},
      ]
    },
    {
      name: 'categories',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
      ]
    },
    {
      name: 'products',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
        { name: 'category', type: 'relation', required: false, options: { collectionId: 'categories', maxSelect: 1 }},
        { name: 'salePrice', type: 'number', required: false },
        { name: 'rentalPrice', type: 'number', required: false },
        { name: 'stock', type: 'number', required: false, options: { defaultValue: 0 }},
        { name: 'condition', type: 'select', required: false, options: { values: ['New', 'Like New', 'Good', 'Fair'] }},
        { name: 'images', type: 'file', required: false, options: { maxSelect: 5, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'brand', type: 'text', required: false },
        { name: 'serialNumber', type: 'text', required: false },
        { name: 'available', type: 'bool', required: false, options: { defaultValue: true }},
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: false }},
        { name: 'productType', type: 'select', required: true, options: { values: ['Sale', 'Rental', 'Both'] }},
        { name: 'published', type: 'bool', required: false, options: { defaultValue: true }},
      ]
    },
    {
      name: 'rental_bookings',
      schema: [
        { name: 'customerName', type: 'text', required: true },
        { name: 'customerEmail', type: 'email', required: true },
        { name: 'customerPhone', type: 'text', required: true },
        { name: 'product', type: 'relation', required: true, options: { collectionId: 'products', maxSelect: 1 }},
        { name: 'pickupDate', type: 'date', required: true },
        { name: 'returnDate', type: 'date', required: true },
        { name: 'status', type: 'select', required: false, options: { values: ['Pending', 'Approved', 'Returned', 'Cancelled'], defaultValue: 'Pending' }},
        { name: 'notes', type: 'text', required: false },
      ]
    },
    {
      name: 'testimonials',
      schema: [
        { name: 'customerName', type: 'text', required: true },
        { name: 'photo', type: 'file', required: false, options: { maxSelect: 1, maxSize: 1048576, mimeTypes: ['image/png', 'image/jpeg'] }},
        { name: 'company', type: 'text', required: false },
        { name: 'review', type: 'text', required: true },
        { name: 'rating', type: 'number', required: false, options: { min: 1, max: 5 }},
        { name: 'published', type: 'bool', required: false, options: { defaultValue: true }},
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: false }},
      ]
    },
    {
      name: 'gallery',
      schema: [
        { name: 'image', type: 'file', required: true, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'category', type: 'text', required: false },
        { name: 'altText', type: 'text', required: false },
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: false }},
        { name: 'displayOrder', type: 'number', required: false, options: { defaultValue: 0 }},
      ]
    },
    {
      name: 'blog',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'content', type: 'text', required: true },
        { name: 'excerpt', type: 'text', required: false },
        { name: 'coverImage', type: 'file', required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'published', type: 'bool', required: false, options: { defaultValue: false }},
        { name: 'publishedAt', type: 'date', required: false },
        { name: 'featured', type: 'bool', required: false, options: { defaultValue: false }},
      ]
    },
    {
      name: 'contact_messages',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: false },
        { name: 'message', type: 'text', required: true },
        { name: 'read', type: 'bool', required: false, options: { defaultValue: false }},
        { name: 'archived', type: 'bool', required: false, options: { defaultValue: false }},
      ]
    },
    {
      name: 'homepage_settings',
      schema: [
        { name: 'heroImage', type: 'file', required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] }},
        { name: 'headline', type: 'text', required: false },
        { name: 'subtitle', type: 'text', required: false },
        { name: 'ctaText', type: 'text', required: false },
        { name: 'ctaLink', type: 'text', required: false },
        { name: 'phone', type: 'text', required: false },
        { name: 'email', type: 'text', required: false },
        { name: 'instagram', type: 'text', required: false },
        { name: 'facebook', type: 'text', required: false },
        { name: 'tiktok', type: 'text', required: false },
        { name: 'youtube', type: 'text', required: false },
      ]
    },
    {
      name: 'site_settings',
      schema: [
        { name: 'logo', type: 'file', required: false, options: { maxSelect: 1, maxSize: 1048576, mimeTypes: ['image/png', 'image/svg+xml', 'image/webp'] }},
        { name: 'favicon', type: 'file', required: false, options: { maxSelect: 1, maxSize: 524288, mimeTypes: ['image/x-icon', 'image/png'] }},
        { name: 'businessName', type: 'text', required: false },
        { name: 'address', type: 'text', required: false },
        { name: 'openingHours', type: 'text', required: false },
        { name: 'seoTitle', type: 'text', required: false },
        { name: 'seoDescription', type: 'text', required: false },
        { name: 'analyticsIds', type: 'text', required: false },
      ]
    }
  ];

  console.log('Creating collections...');
  for (const col of collections) {
    await createCollection(pb, col);
  }

  console.log('\nCreating indexes for list-type collections...');
  const listViewCollections = ['portfolio', 'services', 'products', 'testimonials', 'blog', 'gallery'];
  for (const name of listViewCollections) {
    try {
      await pb.collections.update(name, {
        viewRules: '@request.auth.id != "" || published = true',
        createRules: '@request.auth.role = "owner" || @request.auth.role = "assistant"',
        updateRules: '@request.auth.role = "owner" || @request.auth.role = "assistant"',
        deleteRules: '@request.auth.role = "owner" || @request.auth.role = "assistant"',
        listRules: '@request.auth.id != "" || published = true',
      });
      console.log(`  ✓ Updated rules for ${name}`);
    } catch (error: any) {
      if (error.status === 400 && error.data?.message?.includes('already has')) {
        console.log(`  - Rules already set for ${name}`);
      } else {
        console.error(`  ✗ Failed to update ${name}:`, error.message);
      }
    }
  }

  console.log('\nInitializing homepage settings...');
  try {
    const existing = await pb.collection('homepage_settings').getFirstListItem('id != ""');
    console.log('  - Homepage settings already exist');
  } catch {
    await pb.collection('homepage_settings').create({
      headline: 'CREATING VISUAL STORIES',
      subtitle: 'Videographer & Content Creator',
      ctaText: 'View My Work',
      ctaLink: '#portfolio',
      phone: '+2349161632641',
      email: 'info@orchies.click',
      instagram: '#',
      facebook: '#',
      tiktok: '#',
      youtube: '#',
    });
    console.log('  ✓ Created homepage settings');
  }

  console.log('\nInitializing site settings...');
  try {
    const existing = await pb.collection('site_settings').getFirstListItem('id != ""');
    console.log('  - Site settings already exist');
  } catch {
    await pb.collection('site_settings').create({
      businessName: 'Orchies Visual',
      address: 'Jahi, Abuja Nigeria',
      seoTitle: 'Orchies Visual | Videographer & Content Creator',
      seoDescription: 'Professional videography and content creation services',
    });
    console.log('  ✓ Created site settings');
  }

  console.log('\nInitializing categories...');
  const categories = [
    { name: 'Camera', slug: 'camera', description: 'Professional cameras' },
    { name: 'Lens', slug: 'lens', description: 'Camera lenses' },
    { name: 'Drone', slug: 'drone', description: 'Aerial drones' },
    { name: 'Lighting', slug: 'lighting', description: 'Studio and field lighting' },
    { name: 'Microphone', slug: 'microphone', description: 'Audio equipment' },
    { name: 'Accessories', slug: 'accessories', description: 'Camera accessories' },
    { name: 'Stabilizer', slug: 'stabilizer', description: 'Gimbals and stabilizers' },
  ];
  for (const cat of categories) {
    try {
      await pb.collection('categories').create(cat);
      console.log(`  ✓ Created category: ${cat.name}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Category already exists: ${cat.name}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\nInitializing services...');
  const services = [
    { title: 'Wedding', description: 'Cinematic wedding films that capture every emotion and moment of your special day.', icon: '🎬', startingPrice: 150000, featured: true },
    { title: 'Music Video', description: 'High-energy music videos that bring your sound to life with stunning visuals.', icon: '🎵', startingPrice: 200000, featured: true },
    { title: 'Drone', description: 'Breathtaking aerial footage that adds a cinematic dimension to any project.', icon: '🚁', startingPrice: 50000, featured: true },
    { title: 'Photography', description: 'Professional photography for events, portraits, and commercial shoots.', icon: '📷', startingPrice: 80000, featured: true },
    { title: 'Livestream', description: 'Professional live event coverage for conferences, weddings, and corporate events.', icon: '📡', startingPrice: 100000, featured: false },
    { title: 'Commercial', description: 'Brand films and commercial content that tell your story and drive results.', icon: '🏢', startingPrice: 250000, featured: true },
    { title: 'Documentary', description: 'In-depth documentary storytelling that captures real moments and real emotions.', icon: '🎥', startingPrice: 300000, featured: false },
  ];
  for (const svc of services) {
    try {
      await pb.collection('services').create(svc);
      console.log(`  ✓ Created service: ${svc.title}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Service already exists: ${svc.title}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\nInitializing sample portfolio items...');
  const portfolioItems = [
    { title: 'Iceland Expedition', clientName: 'Travel Channel', category: 'Travel', description: 'Cinematic travel documentary showcasing the stunning landscapes of Iceland.', featured: true, published: true },
    { title: 'Neon Dreams', clientName: 'Luna Ray', category: 'Music Video', description: 'Artist: Luna Ray - A vibrant music video with neon aesthetics.', featured: true, published: true },
    { title: 'Tech Startup Launch', clientName: 'NovaTech', category: 'Commercial', description: 'Brand: NovaTech - Corporate launch event coverage.', featured: true, published: true },
    { title: 'Urban Artists', clientName: 'Street Art Festival', category: 'Documentary', description: 'Street art culture documentary.', featured: false, published: true },
    { title: 'TEDx Talk', clientName: 'TEDxAbuja', category: 'Event', description: 'Keynote speaker coverage at TEDx event.', featured: false, published: true },
    { title: 'Heritage Brand', clientName: 'Heritage Co.', category: 'Brand Film', description: '100-year legacy celebration film.', featured: true, published: true },
  ];
  for (const item of portfolioItems) {
    try {
      await pb.collection('portfolio').create(item);
      console.log(`  ✓ Created portfolio: ${item.title}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Portfolio already exists: ${item.title}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\nInitializing sample products...');
  const products = [
    { name: 'Sony A7S III Body', description: '4K Video, Low Light Master', category: 'Camera', salePrice: 0, rentalPrice: 15000, stock: 2, condition: 'New', brand: 'Sony', productType: 'Rental', featured: true, published: true },
    { name: 'Canon RF 24-70mm f/2.8', description: 'Versatile Zoom Lens', category: 'Lens', salePrice: 0, rentalPrice: 8000, stock: 3, condition: 'Like New', brand: 'Canon', productType: 'Rental', featured: true, published: true },
    { name: 'Aputure 300d II', description: 'LED Light Kit', category: 'Lighting', salePrice: 0, rentalPrice: 10000, stock: 4, condition: 'Good', brand: 'Aputure', productType: 'Rental', featured: true, published: true },
    { name: 'Canon EOS R6 Kit', description: 'Body + 24-105mm Lens', category: 'Camera', salePrice: 850000, rentalPrice: 0, stock: 1, condition: 'New', brand: 'Canon', productType: 'Sale', featured: true, published: true },
    { name: 'DJI Mini 4 Pro', description: '4K/60fps, 34min Flight', category: 'Drone', salePrice: 450000, rentalPrice: 0, stock: 2, condition: 'New', brand: 'DJI', productType: 'Sale', featured: true, published: true },
    { name: 'Rode NTG4+ Mic', description: 'Shotgun Microphone', category: 'Microphone', salePrice: 85000, rentalPrice: 0, stock: 3, condition: 'Like New', brand: 'Rode', productType: 'Sale', featured: false, published: true },
  ];
  for (const prod of products) {
    try {
      await pb.collection('products').create(prod);
      console.log(`  ✓ Created product: ${prod.name}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Product already exists: ${prod.name}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\nInitializing sample testimonials...');
  const testimonials = [
    { customerName: 'Chidi Okafor', company: 'NovaTech', review: 'Orchies Visual delivered beyond our expectations. The commercial they produced for our startup launch was absolutely stunning.', rating: 5, featured: true, published: true },
    { customerName: 'Amina Bello', company: 'Wedding Couple', review: 'Our wedding film is a masterpiece. Every tear, every laugh, every dance - perfectly captured.', rating: 5, featured: true, published: true },
    { customerName: 'Emeka Nwosu', company: 'Luna Ray', review: 'The music video Orchies created for me broke records. Professional, creative, and delivered on time.', rating: 5, featured: true, published: true },
  ];
  for (const t of testimonials) {
    try {
      await pb.collection('testimonials').create(t);
      console.log(`  ✓ Created testimonial: ${t.customerName}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Testimonial already exists: ${t.customerName}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\nInitializing sample blog posts...');
  const blogPosts = [
    { title: 'Behind the Scenes: Iceland Expedition', slug: 'behind-the-scenes-iceland', excerpt: 'A look behind the camera on our recent Iceland documentary shoot.', content: 'Full blog post content here...', published: true, publishedAt: '2025-06-15', featured: true },
    { title: 'New Equipment Arrival: Sony A7S III', slug: 'new-equipment-sony-a7s-iii', excerpt: 'We have upgraded our gear with the latest Sony A7S III bodies.', content: 'Full blog post content here...', published: true, publishedAt: '2025-05-20', featured: false },
    { title: 'Tips for Wedding Videography', slug: 'tips-wedding-videography', excerpt: 'Essential tips for capturing beautiful wedding films.', content: 'Full blog post content here...', published: true, publishedAt: '2025-04-10', featured: true },
  ];
  for (const post of blogPosts) {
    try {
      await pb.collection('blog').create(post);
      console.log(`  ✓ Created blog post: ${post.title}`);
    } catch (error: any) {
      if (error.status === 409) {
        console.log(`  - Blog post already exists: ${post.title}`);
      } else {
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\n✨ PocketBase initialization complete!');
  console.log(`   Admin panel: ${PB_URL}/_/`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

main().catch(console.error);
