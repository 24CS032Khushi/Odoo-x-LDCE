import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const citiesData = [
  {
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    cost_index: 1.40,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Fushimi Inari Taisha Shrine',
        category: 'culture',
        description: 'Walk through thousands of vibrant vermilion torii gates winding up sacred Mount Inari.',
        image_url: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 120
      },
      {
        name: 'Arashiyama Bamboo Grove Walk',
        category: 'sightseeing',
        description: 'Stroll along towering green bamboo stalks swaying gently in the mountain breeze.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Traditional Tea Ceremony in Gion',
        category: 'culture',
        description: 'Experience an authentic matcha tea ceremony guided by a certified tea master.',
        image_url: 'https://images.unsplash.com/photo-1545048702-79360700129e?auto=format&fit=crop&w=800&q=80',
        cost: 3500.00,
        duration_minutes: 75
      },
      {
        name: 'Nishiki Market Street Food Tour',
        category: 'food',
        description: 'Sample skewers of grilled seafood, matcha sweets, and traditional Japanese pickles.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 2200.00,
        duration_minutes: 105
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        category: 'sightseeing',
        description: 'Marvel at the Zen Buddhist temple whose top two floors are completely covered in gold leaf.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        cost: 400.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    cost_index: 1.60,
    popularity_score: 9.9,
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Shibuya Crossing & Hachiko Statue',
        category: 'sightseeing',
        description: 'Cross the world’s busiest pedestrian intersection and pay homage to the legendary loyal dog.',
        image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 45
      },
      {
        name: 'Senso-ji Temple & Nakamise Dori',
        category: 'culture',
        description: 'Visit Tokyo’s oldest Buddhist temple and explore traditional souvenir and craft stalls.',
        image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Tsukiji Outer Market Sushi Tasting',
        category: 'food',
        description: 'Enjoy world-class fresh sashimi, nigiri, and sea urchin prepared by master chefs.',
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        cost: 4500.00,
        duration_minutes: 90
      },
      {
        name: 'teamLab Planets Digital Art Museum',
        category: 'adventure',
        description: 'Immerse your senses walking barefoot through interactive digital water and crystal light installations.',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        cost: 2800.00,
        duration_minutes: 120
      },
      {
        name: 'Shinjuku Golden Gai Night Walk',
        category: 'nightlife',
        description: 'Explore charming narrow alleys filled with cozy themed micro-bars and izakayas.',
        image_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    cost_index: 1.70,
    popularity_score: 9.8,
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Oia Sunset Viewing & Cliff Walk',
        category: 'sightseeing',
        description: 'Watch the sun dip beneath the Aegean Sea against whitewashed cliffside villas and blue domes.',
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Caldera Catamaran Sailing Cruise',
        category: 'adventure',
        description: 'Sail around volcanic hot springs, Red Beach, and White Beach with fresh Mediterranean barbecue.',
        image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        cost: 8500.00,
        duration_minutes: 240
      },
      {
        name: 'Santorini Wine Tasting Tour',
        category: 'food',
        description: 'Sample volcanic Assyrtiko wines paired with local goat cheese at clifftop estates.',
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        cost: 4200.00,
        duration_minutes: 120
      },
      {
        name: 'Fira to Oia Scenic Hike',
        category: 'adventure',
        description: 'Trek along the volcanic rim trail taking in panoramic 360-degree views of the caldera.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 180
      }
    ]
  },
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    cost_index: 1.80,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Eiffel Tower Summit Tour',
        category: 'sightseeing',
        description: 'Ascend to the highest observation deck for breathtaking views over the City of Light.',
        image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 120
      },
      {
        name: 'Louvre Museum Masterpieces Tour',
        category: 'culture',
        description: 'Explore the world’s largest art museum, including the Mona Lisa and Venus de Milo.',
        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        cost: 2200.00,
        duration_minutes: 180
      },
      {
        name: 'Seine River Sunset Cruise',
        category: 'relaxation',
        description: 'Glide past Notre-Dame and historic Parisian bridges aboard an illuminated river cruise.',
        image_url: 'https://images.unsplash.com/photo-1471623320832-be52e8cf9c3c?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 75
      },
      {
        name: 'Montmartre & Sacré-Cœur Walking Tour',
        category: 'culture',
        description: 'Wander cobblestone streets where Picasso painted and enjoy panoramic vistas from the basilica.',
        image_url: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    cost_index: 1.50,
    popularity_score: 9.5,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Colosseum & Roman Forum Guided Tour',
        category: 'culture',
        description: 'Step into gladiatorial history and wander the ancient ruins of the Roman Empire.',
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        cost: 3000.00,
        duration_minutes: 150
      },
      {
        name: 'Vatican Museums & Sistine Chapel',
        category: 'culture',
        description: 'Admire Michelangelo’s masterpiece ceiling frescoes and St. Peter’s Basilica.',
        image_url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80',
        cost: 2800.00,
        duration_minutes: 180
      },
      {
        name: 'Trevi Fountain & Gelato Stroll',
        category: 'food',
        description: 'Toss a coin into the iconic Baroque fountain and indulge in artisan pistachio gelato.',
        image_url: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 60
      },
      {
        name: 'Trastevere Pasta Making Workshop',
        category: 'food',
        description: 'Learn to make fresh fettuccine and carbonara from scratch with a local Roman nonna.',
        image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
        cost: 4500.00,
        duration_minutes: 150
      }
    ]
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    cost_index: 1.90,
    popularity_score: 9.4,
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Burj Khalifa Observation Deck',
        category: 'sightseeing',
        description: 'Ride the world’s fastest elevator to levels 124 & 125 of the tallest skyscraper on Earth.',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        cost: 4100.00,
        duration_minutes: 90
      },
      {
        name: 'Desert Safari with Dune Bashing & BBQ',
        category: 'adventure',
        description: 'Experience 4x4 dune bashing, camel riding, sandboarding, and an open-air Arabian feast.',
        image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
        cost: 5500.00,
        duration_minutes: 360
      },
      {
        name: 'Dubai Marina Yacht Tour',
        category: 'relaxation',
        description: 'Cruise past Bluewaters Island and Ain Dubai with chilled beverages and skylines.',
        image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
        cost: 3800.00,
        duration_minutes: 120
      },
      {
        name: 'Gold & Spice Souk Walking Tour',
        category: 'culture',
        description: 'Take a traditional abra boat across Dubai Creek and haggle for saffron and perfumes.',
        image_url: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
        cost: 600.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    cost_index: 0.90,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Tegallalang Rice Terraces & Jungle Swing',
        category: 'adventure',
        description: 'Soar high above emerald rice terraces and lush valley palm trees on a giant swing.',
        image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 120
      },
      {
        name: 'Uluwatu Clifftop Temple & Kecak Dance',
        category: 'culture',
        description: 'Watch the hypnotic fire dance at sunset perched high above crashing ocean surf.',
        image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        cost: 1200.00,
        duration_minutes: 120
      },
      {
        name: 'Nusa Penida Snorkel Safari',
        category: 'adventure',
        description: 'Swim with gentle manta rays and marvel at crystal clear waters around Kelingking cliff.',
        image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        cost: 4500.00,
        duration_minutes: 300
      },
      {
        name: 'Traditional Balinese Spa & Flower Bath',
        category: 'relaxation',
        description: 'Rejuvenate with a 90-minute herbal aromatherapy massage and aromatic petal soak.',
        image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        cost: 2200.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 0.80,
    popularity_score: 9.3,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Amber Fort & Palace Tour',
        category: 'sightseeing',
        description: 'Explore the grand hilltop fort, Sheesh Mahal (Mirror Palace), and royal courtyards.',
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 150
      },
      {
        name: 'Hawa Mahal (Palace of Winds) Photo Walk',
        category: 'culture',
        description: 'Photograph the honeycomb pink facade designed with 953 intricate jharokha windows.',
        image_url: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80',
        cost: 200.00,
        duration_minutes: 60
      },
      {
        name: 'Authentic Rajasthani Thali Dining',
        category: 'food',
        description: 'Savor dal baati churma, gatte ki sabzi, and royal desserts at an heritage haveli.',
        image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        cost: 1100.00,
        duration_minutes: 90
      },
      {
        name: 'Nahargarh Fort Sunset Viewpoint',
        category: 'sightseeing',
        description: 'Enjoy sweeping panoramic vistas over the Pink City as golden hour illuminates the hills.',
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        cost: 300.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    cost_index: 0.85,
    popularity_score: 9.2,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Palolem Beach Sunset & Kayaking',
        category: 'relaxation',
        description: 'Paddle through gentle waves in South Goa surrounded by coconut palm groves.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 90
      },
      {
        name: 'Fontainhas Latin Quarter Heritage Walk',
        category: 'culture',
        description: 'Discover colourful Portuguese colonial mansions, tiled nameplates, and vintage bakeries.',
        image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 75
      },
      {
        name: 'Dudhsagar Waterfalls Trek',
        category: 'adventure',
        description: 'Ride a 4x4 through the Mollem National Park to the four-tiered roaring milky waterfall.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 240
      },
      {
        name: 'Beach Shack Seafood Dinner',
        category: 'food',
        description: 'Taste authentic Goan fish curry, butter garlic prawns, and fresh poi bread by the ocean.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 1400.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    cost_index: 1.45,
    popularity_score: 9.4,
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Sagrada Família Basilica Tour',
        category: 'culture',
        description: 'Marvel at Antoni Gaudí’s breathtaking nature-inspired stained-glass forest columns.',
        image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
        cost: 2800.00,
        duration_minutes: 120
      },
      {
        name: 'Park Güell Mosaic Promenade',
        category: 'sightseeing',
        description: 'Walk through Gaudí’s whimsical mosaic dragon and panoramic city terrace.',
        image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
        cost: 1200.00,
        duration_minutes: 90
      },
      {
        name: 'Gothic Quarter Tapas & Sangria Crawl',
        category: 'food',
        description: 'Sample patatas bravas, Iberian jamón, and pimientos de Padrón in historic taverns.',
        image_url: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 150
      },
      {
        name: 'Barceloneta Beach Sunset Stroll',
        category: 'relaxation',
        description: 'Walk along the Mediterranean seaside promenade with cool sea breezes and music.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Zurich & Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    cost_index: 2.20,
    popularity_score: 9.3,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Lake Zurich Scenic Boat Cruise',
        category: 'relaxation',
        description: 'Glide across pristine alpine waters with views of historic lakeside chateaux.',
        image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        cost: 2600.00,
        duration_minutes: 90
      },
      {
        name: 'Mount Titlis Glacier Excursion',
        category: 'adventure',
        description: 'Ride the revolving Rotair cable car to explore ice caves and the cliff walk bridge.',
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        cost: 7500.00,
        duration_minutes: 300
      },
      {
        name: 'Swiss Fondue & Chocolate Tasting',
        category: 'food',
        description: 'Dip into bubbling Gruyère cheese fondue followed by handmade artisan Swiss truffles.',
        image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        cost: 4800.00,
        duration_minutes: 105
      }
    ]
  },
  {
    name: 'New York City',
    country: 'United States',
    region: 'Americas',
    cost_index: 2.10,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Central Park Bike & Walk Tour',
        category: 'sightseeing',
        description: 'Ride beneath tree canopies past Bethesda Terrace, Bow Bridge, and Strawberry Fields.',
        image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 120
      },
      {
        name: 'Summit One Vanderbilt Glass Skydeck',
        category: 'adventure',
        description: 'Step onto mirrored glass boxes suspended 1,000 feet above Manhattan.',
        image_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
        cost: 4200.00,
        duration_minutes: 90
      },
      {
        name: 'Brooklyn Bridge & DUMBO Walk',
        category: 'sightseeing',
        description: 'Walk across the historic suspension bridge and capture skyline photos from DUMBO.',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Broadway Musical Evening',
        category: 'culture',
        description: 'Experience a world-class theatrical performance in the heart of Times Square.',
        image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        cost: 7200.00,
        duration_minutes: 150
      }
    ]
  }
];

async function main() {
  console.log('Seeding GlobeTrotter Smart database with realistic travel destinations and activities...');

  for (const cityItem of citiesData) {
    const { activities, ...cityData } = cityItem;

    const existingCity = await prisma.city.findFirst({
      where: { name: cityData.name, country: cityData.country }
    });

    let cityId;
    if (existingCity) {
      const updated = await prisma.city.update({
        where: { id: existingCity.id },
        data: cityData
      });
      cityId = updated.id;
      console.log(`Updated city: ${cityData.name}, ${cityData.country}`);
    } else {
      const created = await prisma.city.create({
        data: cityData
      });
      cityId = created.id;
      console.log(`Created city: ${cityData.name}, ${cityData.country}`);
    }

    // Seed activities for this city
    for (const act of activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { city_id: cityId, name: act.name }
      });

      if (!existingAct) {
        await prisma.activity.create({
          data: {
            ...act,
            city_id: cityId
          }
        });
      }
    }
  }

  console.log(`Successfully seeded ${citiesData.length} world-class cities with complete activities!`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
