import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const indianCities = [
  {
    name: 'Ahmedabad',
    country: 'India',
    region: 'Asia',
    cost_index: 0.70,
    popularity_score: 9.3,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Sabarmati Ashram Heritage Tour',
        category: 'culture',
        description: 'Visit Mahatma Gandhi’s historic headquarters on the banks of Sabarmati river.',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Adalaj Stepwell Architectural Walk',
        category: 'sightseeing',
        description: 'Explore the 15th-century intricately carved Solanki subterranean water palace.',
        cost: 100.00,
        duration_minutes: 75
      },
      {
        name: 'Manek Chowk Midnight Street Food Safari',
        category: 'food',
        description: 'Taste Gwalior butter dosa, chocolate sandwich, and kesar kulfi in bustling night square.',
        cost: 600.00,
        duration_minutes: 90
      },
      {
        name: 'Sabarmati Riverfront Sunset Stroll',
        category: 'sightseeing',
        description: 'Scenic pedestrian promenade with botanical flower park and skyline views.',
        cost: 50.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    cost_index: 1.25,
    popularity_score: 9.8,
    image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Gateway of India & Taj Mahal Palace Walk',
        category: 'sightseeing',
        description: 'Colonial monument facing Mumbai Harbor and historic heritage palace hotel.',
        cost: 0.00,
        duration_minutes: 60
      },
      {
        name: 'Elephanta Caves Island Boat Excursion',
        category: 'culture',
        description: 'Ferry across harbor to UNESCO rock-cut Hindu temple caves dating to 5th century.',
        cost: 900.00,
        duration_minutes: 240
      },
      {
        name: 'Marine Drive & Chowpatty Street Food',
        category: 'food',
        description: 'Evening promenade along the Queen’s Necklace with authentic bhelpuri and pav bhaji.',
        cost: 400.00,
        duration_minutes: 90
      },
      {
        name: 'Bandra Art & Celebrity Bungalows Walk',
        category: 'culture',
        description: 'Explore hip street art murals, Portuguese churches, and Bandstand sea breeze.',
        cost: 0.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Udaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 0.80,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'City Palace & Crystal Gallery Guided Tour',
        category: 'culture',
        description: 'Rajasthan’s largest palace complex perched majestically on Lake Pichola.',
        cost: 700.00,
        duration_minutes: 150
      },
      {
        name: 'Lake Pichola Sunset Boat Cruise to Jag Mandir',
        category: 'sightseeing',
        description: 'Peaceful boat glide past Taj Lake Palace and water gates at golden hour.',
        cost: 900.00,
        duration_minutes: 75
      },
      {
        name: 'Bagore Ki Haveli Dharohar Folk Dance Show',
        category: 'nightlife',
        description: 'Lively Rajasthani puppetry, fire dances, and balancing brass pots on waterfront.',
        cost: 300.00,
        duration_minutes: 75
      },
      {
        name: 'Saheliyon-ki-Bari Marble Fountain Gardens',
        category: 'sightseeing',
        description: 'Lush historic royal gardens with lotus pools and bird fountains.',
        cost: 150.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Varanasi',
    country: 'India',
    region: 'Asia',
    cost_index: 0.60,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Dashashwamedh Ghat Grand Evening Ganga Aarti',
        category: 'culture',
        description: 'Spectacular Vedic brass lamp rituals and chants by priests on holy Ganges riverbanks.',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Sunrise Ganges Boat Ride & Ghat Walk',
        category: 'sightseeing',
        description: 'Rowboat glide at dawn seeing morning bathers, historic ghats, and sunrise mist.',
        cost: 500.00,
        duration_minutes: 105
      },
      {
        name: 'Sarnath Buddhist Deer Park & Dhamekh Stupa',
        category: 'culture',
        description: 'Ancient site where Buddha gave his first sermon with Ashoka Pillar.',
        cost: 300.00,
        duration_minutes: 150
      },
      {
        name: 'Kachori Gali & Malaiyo Sweet Tasting Tour',
        category: 'food',
        description: 'Warm crispy kachoris, thick Banarasi lassi in clay kulhads, and winter saffron foam.',
        cost: 300.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Kochi (Cochin)',
    country: 'India',
    region: 'Asia',
    cost_index: 0.75,
    popularity_score: 9.4,
    image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Fort Kochi Chinese Fishing Nets at Sunset',
        category: 'sightseeing',
        description: 'Iconic cantilevered shore nets operated by fishermen since 14th century.',
        cost: 0.00,
        duration_minutes: 60
      },
      {
        name: 'Kerala Backwaters Day Houseboat Cruise',
        category: 'adventure',
        description: 'Cruise tranquil palm-fringed backwater lagoons with traditional Kerala sadhya lunch.',
        cost: 4500.00,
        duration_minutes: 300
      },
      {
        name: 'Kathakali Dance Drama & Makeup Demonstration',
        category: 'culture',
        description: 'Watch elaborate facial makeup application followed by expressive classical dance.',
        cost: 600.00,
        duration_minutes: 120
      },
      {
        name: 'Jew Town & Paradesi Synagogue Walk',
        category: 'culture',
        description: 'Antique shops, spice warehouses, and 1568 Commonwealth Jewish synagogue.',
        cost: 100.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Amritsar',
    country: 'India',
    region: 'Asia',
    cost_index: 0.65,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1588096344356-9b5963f25c76?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Golden Temple (Harmandir Sahib) & Pavitra Sarovar',
        category: 'culture',
        description: 'Glistening gold sanctum surrounded by holy pool with peaceful 24/7 Gurbani kirtan.',
        cost: 0.00,
        duration_minutes: 150
      },
      {
        name: 'Langar Mega-Kitchen Volunteer Seva Experience',
        category: 'culture',
        description: 'Help roll rotis or serve free meals in the world’s largest community kitchen (100k meals/day).',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Attari-Wagah Border Beating Retreat Ceremony',
        category: 'sightseeing',
        description: 'High-energy military drill ceremony and flag lowering at India-Pakistan border.',
        cost: 0.00,
        duration_minutes: 180
      },
      {
        name: 'Amritsari Kulcha & Makhan Lassi Feast',
        category: 'food',
        description: 'Tandoor-baked flaky potato-paneer kulchas dripping in white butter with chole.',
        cost: 350.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Bengaluru',
    country: 'India',
    region: 'Asia',
    cost_index: 1.10,
    popularity_score: 9.4,
    image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Lalbagh Botanical Garden & Glass House',
        category: 'sightseeing',
        description: '240-acre garden with centuries-old trees, lotus ponds, and London Crystal Palace replica.',
        cost: 100.00,
        duration_minutes: 100
      },
      {
        name: 'Bangalore Palace Royal Tudor Tour',
        category: 'culture',
        description: '19th-century royal wooden carvings, stained glass, and hunting memorabilia.',
        cost: 500.00,
        duration_minutes: 90
      },
      {
        name: 'Indiranagar Craft Microbrewery & Gastropub Trail',
        category: 'nightlife',
        description: 'Sample tropical mango IPAs, Belgian wits, and wood-fired sourdough pizzas.',
        cost: 2200.00,
        duration_minutes: 150
      },
      {
        name: 'Cubbon Park Morning Cycle & Filter Coffee',
        category: 'sightseeing',
        description: 'Tree-canopied green lungs of the city followed by Brahmin’s Coffee Bar idli-vada.',
        cost: 200.00,
        duration_minutes: 90
      }
    ]
  }
];

const seedIndianCities = async () => {
  console.log('Seeding deep Indian cities with hand-tuned cost indexes, popularity, and activities...\n');

  for (const cityData of indianCities) {
    const { activities, ...info } = cityData;

    let city = await prisma.city.findFirst({
      where: { name: info.name, country: info.country }
    });

    if (!city) {
      city = await prisma.city.create({
        data: info
      });
      console.log(`Created city: ${city.name}, ${city.country}`);
    } else {
      city = await prisma.city.update({
        where: { id: city.id },
        data: info
      });
      console.log(`Updated city: ${city.name}, ${city.country}`);
    }

    // Seed activities
    for (const act of activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { city_id: city.id, name: act.name }
      });
      if (!existingAct) {
        await prisma.activity.create({
          data: {
            city_id: city.id,
            image_url: info.image_url,
            ...act
          }
        });
      }
    }
  }

  console.log('\nFinished seeding Indian cities successfully!');
};

seedIndianCities()
  .catch((err) => {
    console.error('Failed to seed Indian cities:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
