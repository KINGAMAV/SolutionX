import { supabase } from './lib/supabase';
import { ARTISANS, PRODUCTS } from './data';

export const seedDatabase = async () => {
  console.log('Starting seeding...');

  // Seed Artisans
  const { error: artisanError } = await supabase
    .from('artisans')
    .upsert(
      ARTISANS.map(a => ({
        name: a.name,
        category: a.category,
        experience: a.experience,
        rating: a.rating,
        hourly_rate: a.hourlyRate,
        verified: a.verified,
        specialty: a.specialty,
        zones: a.zones,
        avatar_url: a.avatar
      }))
    );

  if (artisanError) console.error('Error seeding artisans:', artisanError);

  // Seed Products
  const { error: productError } = await supabase
    .from('products')
    .upsert(
      PRODUCTS.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        image_url: p.image,
        available: true
      }))
    );

  if (productError) console.error('Error seeding products:', productError);

  console.log('Seeding finished!');
};
