import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      },
      {
        name: 'Gion Geisha District Evening Walk',
        category: 'nightlife',
        description: 'Atmospheric walk past lantern-lit wooden machiya houses with geisha sightings.',
        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 80
      },
      {
        name: 'Kiyomizu-dera Wooden Stage Temple',
        category: 'culture',
        description: 'Historic hillside temple offering sweeping panoramic views over Kyoto city.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 90
      },
      {
        name: 'Kyoto Kaiseki Fine Dining Experience',
        category: 'food',
        description: 'Multi-course culinary masterpiece featuring seasonal delicacies and pristine presentation.',
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        cost: 8500.00,
        duration_minutes: 120
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
        cost: 2500.00,
        duration_minutes: 100
      },
      {
        name: 'Meiji Jingu Shrine & Yoyogi Park',
        category: 'sightseeing',
        description: 'Peaceful forested sanctuary dedicated to Emperor Meiji in the heart of Shibuya.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 75
      },
      {
        name: 'Akihabara Electronics & Arcade Tour',
        category: 'adventure',
        description: 'Explore Tokyo anime culture, retro gaming arcades, and cutting-edge tech multi-stores.',
        image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 120
      },
      {
        name: 'Tokyo Skytree Observation Deck',
        category: 'sightseeing',
        description: 'Take high-speed elevators up 450 meters for breathtaking views of Mount Fuji.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        cost: 2200.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    cost_index: 1.85,
    popularity_score: 9.8,
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Eiffel Tower Summit Access',
        category: 'sightseeing',
        description: 'Ascend the iconic Iron Lady for unmatched panoramic vistas across the City of Light.',
        image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 120
      },
      {
        name: 'Louvre Museum Masterpieces Tour',
        category: 'culture',
        description: 'Explore Mona Lisa, Venus de Milo, and world-renowned artistic treasures.',
        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        cost: 2400.00,
        duration_minutes: 180
      },
      {
        name: 'Seine River Sunset Dinner Cruise',
        category: 'food',
        description: 'Enjoy a gourmet 3-course French dinner gliding past illuminated Parisian bridges.',
        image_url: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?auto=format&fit=crop&w=800&q=80',
        cost: 7500.00,
        duration_minutes: 120
      },
      {
        name: 'Montmartre & Sacré-Cœur Walking Tour',
        category: 'sightseeing',
        description: 'Wander cobblestone lanes where Picasso and Van Gogh painted in bohemian Paris.',
        image_url: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 100
      },
      {
        name: 'Moulin Rouge Cabaret & Champagne',
        category: 'nightlife',
        description: 'World-famous French Cancan dancers, feather costumes, and sparkling spectacle.',
        image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        cost: 8500.00,
        duration_minutes: 130
      },
      {
        name: 'Latin Quarter Pastry & Bakery Crawl',
        category: 'food',
        description: 'Taste buttery croissants, artisanal macarons, and warm éclairs.',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        cost: 2000.00,
        duration_minutes: 90
      },
      {
        name: 'Palace of Versailles Day Excursion',
        category: 'culture',
        description: 'Marvel at the Hall of Mirrors and vast royal manicured fountain gardens.',
        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        cost: 3800.00,
        duration_minutes: 240
      },
      {
        name: 'Champs-Élysées & Arc de Triomphe',
        category: 'sightseeing',
        description: 'Climb the Arc de Triomphe for stunning radial views of grand boulevards.',
        image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        cost: 1400.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    cost_index: 1.55,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Colosseum & Roman Forum VIP Tour',
        category: 'culture',
        description: 'Step into ancient gladiator arena grounds and explore the heart of the Roman Empire.',
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        cost: 3800.00,
        duration_minutes: 150
      },
      {
        name: 'Vatican Museums & Sistine Chapel',
        category: 'culture',
        description: 'Gaze up at Michelangelo’s ceiling frescoes and St. Peter’s majestic Basilica.',
        image_url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
        cost: 3400.00,
        duration_minutes: 180
      },
      {
        name: 'Trastevere Culinary & Wine Walk',
        category: 'food',
        description: 'Taste authentic cacio e pepe, supplì, and crisp local Roman wines in lively piazzas.',
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        cost: 3500.00,
        duration_minutes: 120
      },
      {
        name: 'Trevi Fountain & Spanish Steps Stroll',
        category: 'sightseeing',
        description: 'Toss a coin into Bernini’s baroque fountain to ensure your return to Rome.',
        image_url: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 60
      },
      {
        name: 'Pantheon & Piazza Navona',
        category: 'sightseeing',
        description: 'Admire the architectural marvel of the Pantheon dome and Fountain of Four Rivers.',
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 75
      },
      {
        name: 'Roman Pizza & Gelato Masterclass',
        category: 'food',
        description: 'Knead authentic Roman thin-crust pizza dough and craft artisanal creamy gelato.',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        cost: 4200.00,
        duration_minutes: 120
      },
      {
        name: 'Borghese Gallery & Villa Gardens',
        category: 'culture',
        description: 'Intimate collection of Bernini sculptures and Caravaggio masterpieces in lush park.',
        image_url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
        cost: 2200.00,
        duration_minutes: 110
      },
      {
        name: 'Catacombs of Rome Underground Tour',
        category: 'adventure',
        description: 'Explore mysterious subterranean ancient Christian burial tunnels and crypts.',
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    cost_index: 1.35,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Sagrada Família Fast-Track Tour',
        category: 'culture',
        description: 'Gaudí’s magnificent basilica with tree-like stone columns and stained glass kaleidoscope.',
        image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 90
      },
      {
        name: 'Park Güell Monumental Zone',
        category: 'sightseeing',
        description: 'Colorful mosaic salamander and undulating stone benches overlooking the Mediterranean.',
        image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 100
      },
      {
        name: 'Gothic Quarter & Tapas Evening',
        category: 'food',
        description: 'Sample patatas bravas, jamón ibérico, and refreshing cava in medieval alleys.',
        image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 120
      },
      {
        name: 'Barceloneta Beach Sunset Paddle',
        category: 'adventure',
        description: 'Paddleboard along the Mediterranean coastline as the sun sets over Montjuïc.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 90
      },
      {
        name: 'Flamenco Dinner Show at Tablao Cordobes',
        category: 'nightlife',
        description: 'Passionate Andalusian acoustic guitar rhythms and fiery traditional flamenco dancing.',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        cost: 6500.00,
        duration_minutes: 110
      },
      {
        name: 'La Boqueria Market Tasting Tour',
        category: 'food',
        description: 'Fresh tropical fruit juices, Manchego cheese cones, and seafood plancha tapas.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 75
      },
      {
        name: 'Casa Batlló & Casa Milà (La Pedrera)',
        category: 'culture',
        description: 'Walk through Gaudí’s surreal marine-inspired organic apartments.',
        image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
        cost: 2900.00,
        duration_minutes: 100
      },
      {
        name: 'Montjuïc Cable Car & Castle',
        category: 'sightseeing',
        description: 'Ride the aerial cable car to the hilltop military fortress overlooking the seaport.',
        image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
        cost: 1400.00,
        duration_minutes: 80
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
        name: 'Oia Sunset Cliffside Catamaran Cruise',
        category: 'adventure',
        description: 'Sail into the submerged volcanic caldera with Greek BBQ lunch and Aegean snorkeling.',
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        cost: 8500.00,
        duration_minutes: 300
      },
      {
        name: 'Fira to Oia Caldera Hike',
        category: 'adventure',
        description: 'Scenic 10km coastal trek over volcanic ridge with whitewashed chapels.',
        image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 180
      },
      {
        name: 'Volcanic Winery Tasting Experience',
        category: 'food',
        description: 'Sample crisp Assyrtiko white wines paired with aged graviera cheese overlooking the sea.',
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        cost: 4200.00,
        duration_minutes: 90
      },
      {
        name: 'Red Beach & Akrotiri Ruins',
        category: 'culture',
        description: 'Explore the remarkably preserved prehistoric Bronze Age Minoan volcanic settlement.',
        image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        cost: 1600.00,
        duration_minutes: 120
      },
      {
        name: 'Perissa Black Sand Beach Relaxation',
        category: 'sightseeing',
        description: 'Lounge under sun umbrellas on dark volcanic sands with seaside taverna service.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 1000.00,
        duration_minutes: 180
      },
      {
        name: 'Open Air Cinema in Kamari',
        category: 'nightlife',
        description: 'Watch movies under the stars surrounded by garden eucalyptus trees with local cocktails.',
        image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
        cost: 900.00,
        duration_minutes: 120
      },
      {
        name: 'Pyrgos Medieval Village Stroll',
        category: 'sightseeing',
        description: 'Walk quiet labyrinthine alleys up to the Venetian castle at Santorini’s highest point.',
        image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 75
      },
      {
        name: 'Greek Meze Sunset Dinner in Ammoudi Bay',
        category: 'food',
        description: 'Dine right at the water’s edge on fresh grilled calamari and Greek salad.',
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        cost: 5500.00,
        duration_minutes: 120
      }
    ]
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    cost_index: 1.75,
    popularity_score: 9.5,
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Burj Khalifa At the Top (Level 148)',
        category: 'sightseeing',
        description: 'Stand on the world’s highest observation lounge with ultra-luxury terrace view.',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        cost: 8500.00,
        duration_minutes: 90
      },
      {
        name: 'Red Dunes Desert Safari & BBQ Camp',
        category: 'adventure',
        description: 'Exciting 4x4 dune bashing, camel riding, sandboarding, and Arabian buffet under stars.',
        image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
        cost: 4500.00,
        duration_minutes: 360
      },
      {
        name: 'Dubai Marina Luxury Yacht Cruise',
        category: 'sightseeing',
        description: 'Cruise past Ain Dubai and the Palm Jumeirah with open-deck refreshments.',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        cost: 3800.00,
        duration_minutes: 120
      },
      {
        name: 'Museum of the Future',
        category: 'culture',
        description: 'Interactive exhibition exploring robotics, artificial intelligence, and space.',
        image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
        cost: 3400.00,
        duration_minutes: 120
      },
      {
        name: 'Gold & Spice Souk Walking Tour',
        category: 'food',
        description: 'Cross Dubai Creek on a traditional wooden Abra boat and explore aromatic spice stalls.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 90
      },
      {
        name: 'Aquaventure Waterpark & Lost Chambers',
        category: 'adventure',
        description: 'Slide through shark-filled lagoons and explore Atlantis giant aquarium.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 7200.00,
        duration_minutes: 240
      },
      {
        name: 'Dubai Fountain Boardwalk Experience',
        category: 'sightseeing',
        description: 'Front-row view of the world’s largest choreographed water and music fountain show.',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        cost: 450.00,
        duration_minutes: 45
      },
      {
        name: 'Sky Views Glass Slide & Edge Walk',
        category: 'adventure',
        description: 'Slide down an all-glass exterior tube suspended 219 meters above downtown.',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        cost: 2100.00,
        duration_minutes: 60
      }
    ]
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    cost_index: 0.85,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Tegallalang Rice Terraces & Jungle Swing',
        category: 'adventure',
        description: 'Soar over emerald terraced valley on famous giant swing with traditional coffee tasting.',
        image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 120
      },
      {
        name: 'Uluwatu Temple & Kecak Fire Dance',
        category: 'culture',
        description: 'Watch dramatic cliffside sunset fire dance while Indian Ocean waves crash below.',
        image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        cost: 1200.00,
        duration_minutes: 120
      },
      {
        name: 'Mount Batur Sunrise Trekking & Breakfast',
        category: 'adventure',
        description: 'Early morning hike up active volcano to watch spectacular sunrise above the clouds.',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 360
      },
      {
        name: 'Sacred Monkey Forest Sanctuary',
        category: 'sightseeing',
        description: 'Wander lush tropical nutmeg forest inhabited by playful Balinese long-tailed macaques.',
        image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        cost: 450.00,
        duration_minutes: 90
      },
      {
        name: 'Jimbaran Bay Seafood Candlelight Dinner',
        category: 'food',
        description: 'Feast on grilled prawns, snapper, and sambal right on the soft sand at sunset.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 120
      },
      {
        name: 'Tirta Empul Holy Water Purification',
        category: 'culture',
        description: 'Participate in ancient Balinese Melukat purification ritual in crystal temple spring pools.',
        image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        cost: 600.00,
        duration_minutes: 90
      },
      {
        name: 'Canggu Beachfront Sunset Beach Club',
        category: 'nightlife',
        description: 'Relax in infinity pool with live DJ sets, tropical cocktails, and surf views.',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        cost: 2000.00,
        duration_minutes: 180
      },
      {
        name: 'Balinese Herbal Spa & Flower Bath',
        category: 'sightseeing',
        description: 'Indulge in 2-hour traditional deep tissue massage followed by fragrant frangipani bath.',
        image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 120
      }
    ]
  },
  {
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 0.70,
    popularity_score: 9.4,
    image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Amber Fort Elephant Ridge & Palace Tour',
        category: 'culture',
        description: 'Explore the majestic hilltop Rajput fortress with Sheesh Mahal (Mirror Palace).',
        image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 180
      },
      {
        name: 'Hawa Mahal (Palace of Winds) Photo Walk',
        category: 'sightseeing',
        description: 'Admire the 953 intricately carved pink honeycomb jharokhas facing bustling Old City.',
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        cost: 200.00,
        duration_minutes: 60
      },
      {
        name: 'City Palace Royal Heritage Guided Walk',
        category: 'culture',
        description: 'Visit royal courtyards, Peacock Gate, and museum of Maharaja textiles and armor.',
        image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        cost: 700.00,
        duration_minutes: 120
      },
      {
        name: 'Authentic Rajasthani Thali Dinner at Chokhi Dhani',
        category: 'food',
        description: 'Traditional village fair with folk dancers, puppet shows, and 30-dish royal thali.',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        cost: 1500.00,
        duration_minutes: 180
      },
      {
        name: 'Nahargarh Fort Sunset Over Pink City',
        category: 'sightseeing',
        description: 'Watch the sun sink beneath the Aravalli hills with illuminated city vistas.',
        image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        cost: 200.00,
        duration_minutes: 90
      },
      {
        name: 'Johari Bazaar Jewelry & Textile Shopping',
        category: 'food',
        description: 'Bargain for handmade gemstone jewelry, bandhani sarees, and blue pottery.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 120
      },
      {
        name: 'Hot Air Balloon Ride Over Palaces',
        category: 'adventure',
        description: 'Float peacefully above forts, desert villages, and Aravali hills at dawn.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 12500.00,
        duration_minutes: 180
      },
      {
        name: 'Jantar Mantar Astronomical Observatory',
        category: 'culture',
        description: 'UNESCO World Heritage site with giant 18th-century stone sundials and instruments.',
        image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        cost: 200.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    cost_index: 0.75,
    popularity_score: 9.5,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Old Goa Portuguese Cathedrals & Basilica',
        category: 'culture',
        description: 'Visit the Basilica of Bom Jesus and Se Cathedral featuring 16th-century Manueline architecture.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 120
      },
      {
        name: 'Dudhsagar Waterfalls Jeep Safari',
        category: 'adventure',
        description: 'Thrilling off-road drive through jungle trails to four-tiered sea of milk waterfall.',
        image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        cost: 2800.00,
        duration_minutes: 360
      },
      {
        name: 'Scuba Diving & Island Cruise at Grande Island',
        category: 'adventure',
        description: 'Discover colorful corals, tropical reef fish, and enjoy beach barbecue lunch.',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        cost: 3500.00,
        duration_minutes: 300
      },
      {
        name: 'Fontainhas Latin Quarter Heritage Walk',
        category: 'sightseeing',
        description: 'Wander among colorful Portuguese villas, tiled azulejos nameplates, and art cafes.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Goan Fish Curry & Prawn Balchão Tasting',
        category: 'food',
        description: 'Authentic beach shack feast of kingfish curry, poee bread, and feni cocktails.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 1200.00,
        duration_minutes: 90
      },
      {
        name: 'Anjuna Beach Sunset & Flea Market',
        category: 'nightlife',
        description: 'Lively beachfront market with handmade crafts, live acoustic music, and chill vibes.',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 150
      },
      {
        name: 'Spice Plantation Tour with Traditional Buffet',
        category: 'food',
        description: 'Walk through organic vanilla, cardamom, and cinnamon groves with elephant bath.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 150
      },
      {
        name: 'Mandovi River Luxury Sunset Cruise',
        category: 'sightseeing',
        description: 'Cruise past Panaji waterfront with live Goan folk dance and DJ entertainment.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        cost: 700.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Varanasi',
    country: 'India',
    region: 'Asia',
    cost_index: 0.60,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Dashashwamedh Ghat Grand Ganga Aarti',
        category: 'culture',
        description: 'Witness the mesmerizing synchronized evening fire ritual on the banks of holy river Ganga.',
        image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Sunrise Boat Cruise along 84 Ghats',
        category: 'sightseeing',
        description: 'Row peacefully along the misty Ganges watching morning bathers and ancient temples.',
        image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        cost: 600.00,
        duration_minutes: 100
      },
      {
        name: 'Kashi Vishwanath Golden Temple Darshan',
        category: 'culture',
        description: 'Visit one of the 12 sacred Jyotirlingas of Lord Shiva in the revitalized corridor.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 120
      },
      {
        name: 'Kachori Gali & Banarasi Paan Food Trail',
        category: 'food',
        description: 'Taste authentic hot kachori sabzi, creamy malaiyo froth sweet, and iconic Banarasi paan.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 400.00,
        duration_minutes: 90
      },
      {
        name: 'Sarnath Buddhist Deer Park Excursion',
        category: 'culture',
        description: 'Explore the Dhamek Stupa where Buddha gave his first sermon and the Ashoka Pillar.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 300.00,
        duration_minutes: 180
      }
    ]
  },
  {
    name: 'Kerala (Kochi & Backwaters)',
    country: 'India',
    region: 'Asia',
    cost_index: 0.70,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Alleppey Luxury Houseboat Overnight Cruise',
        category: 'adventure',
        description: 'Drift through emerald palm-fringed backwaters with traditional Kerala meals cooked onboard.',
        image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        cost: 6500.00,
        duration_minutes: 360
      },
      {
        name: 'Fort Kochi Chinese Fishing Nets & Sunset',
        category: 'sightseeing',
        description: 'Watch cantilevered 14th-century fishing nets lowered into Arabian Sea at golden hour.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Kathakali Dance & Kalaripayattu Martial Arts',
        category: 'culture',
        description: 'Dramatic classical dance performance with elaborate makeup followed by ancient martial arts.',
        image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 120
      },
      {
        name: 'Munnar Tea Plantation & Mountain Trek',
        category: 'adventure',
        description: 'Hike through misty rolling green tea hills and visit historic tea processing museum.',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        cost: 1200.00,
        duration_minutes: 240
      },
      {
        name: 'Traditional Kerala Sadya Banana Leaf Feast',
        category: 'food',
        description: 'Taste 24 vegetarian culinary delicacies served on fresh banana leaf with payasam dessert.',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        cost: 600.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Ladakh (Leh & Pangong)',
    country: 'India',
    region: 'Asia',
    cost_index: 0.85,
    popularity_score: 9.8,
    image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Pangong Tso High-Altitude Lake Camping',
        category: 'adventure',
        description: 'Camp by the crystal blue color-shifting lake at 14,270 ft surrounded by snowcapped Himalayas.',
        image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        cost: 4500.00,
        duration_minutes: 360
      },
      {
        name: 'Khardung La Pass Motorbike Expedition',
        category: 'adventure',
        description: 'Ride across one of the highest motorable mountain passes in the world at 17,982 ft.',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        cost: 3500.00,
        duration_minutes: 240
      },
      {
        name: 'Thiksey Monastery Sunrise Prayer Chant',
        category: 'culture',
        description: '12-story hilltop Tibetan Buddhist monastery with towering 49ft Maitreya Buddha statue.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 200.00,
        duration_minutes: 120
      },
      {
        name: 'Nubra Valley Hunder Double-Humped Camel Safari',
        category: 'adventure',
        description: 'Ride rare Bactrian camels across white cold desert sand dunes with mountain backdrop.',
        image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 120
      },
      {
        name: 'Tibetan Butter Tea & Steamed Momos at Leh Market',
        category: 'food',
        description: 'Warm up with salted yak butter tea, piping hot thukpa noodles, and spicy chutney momos.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 350.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Udaipur',
    country: 'India',
    region: 'Asia',
    cost_index: 0.70,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Lake Pichola Sunset Boat Cruise & Jag Mandir',
        category: 'sightseeing',
        description: 'Cruise past white marble palaces reflecting in the calm waters of Pichola at dusk.',
        image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 90
      },
      {
        name: 'Udaipur City Palace Museum Guided Tour',
        category: 'culture',
        description: 'Explore Rajasthan’s largest palace complex with mirror work, stained glass, and royal courtyards.',
        image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
        cost: 400.00,
        duration_minutes: 150
      },
      {
        name: 'Sajjangarh Monsoon Palace Hilltop Sunset',
        category: 'sightseeing',
        description: 'Perched on Bansdara peak offering sweeping views of Udaipur lakes and Aravalli mountain range.',
        image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
        cost: 250.00,
        duration_minutes: 100
      },
      {
        name: 'Lakeside Candlelight Dining at Ambrai',
        category: 'food',
        description: 'Romantic Mewari dining overlooking the illuminated City Palace and Lake Palace.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 120
      }
    ]
  },
  {
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    cost_index: 0.90,
    popularity_score: 9.7,
    image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Gateway of India & Taj Mahal Palace Walk',
        category: 'sightseeing',
        description: 'Iconic 1924 basalt triumphal arch overlooking Mumbai Harbour and the Arabian Sea.',
        image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 75
      },
      {
        name: 'Marine Drive Queen’s Necklace Sunset Stroll',
        category: 'sightseeing',
        description: '3.6-kilometer C-shaped boulevard with sweeping coastal views and evening sea breeze.',
        image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Elephanta Caves UNESCO Island Excursion',
        category: 'culture',
        description: 'Ferry ride to 5th-century rock-cut cave temples dedicated to Trimurti Shiva.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 650.00,
        duration_minutes: 240
      },
      {
        name: 'Chowpatty Beach Vada Pav & Chaat Crawl',
        category: 'food',
        description: 'Savor spicy vada pav, pav bhaji, bhel puri, and kulfi at bustling seaside food stalls.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 400.00,
        duration_minutes: 90
      }
    ]
  },
  {
    name: 'Agra',
    country: 'India',
    region: 'Asia',
    cost_index: 0.65,
    popularity_score: 9.8,
    image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Taj Mahal VIP Sunrise Tour',
        category: 'culture',
        description: 'Watch the morning sun illuminate the world’s most magnificent white marble monument to eternal love.',
        image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        cost: 1100.00,
        duration_minutes: 180
      },
      {
        name: 'Agra Fort Mughal Imperial Citadel',
        category: 'culture',
        description: 'Red sandstone fortress palace with views of Taj Mahal across the Yamuna River.',
        image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        cost: 650.00,
        duration_minutes: 120
      },
      {
        name: 'Mehtab Bagh Moonlight Garden Walk',
        category: 'sightseeing',
        description: 'Lush riverside botanical charbagh garden offering iconic uncrowded sunset photos of Taj Mahal.',
        image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        cost: 300.00,
        duration_minutes: 90
      },
      {
        name: 'Agra Petha & Mughlai Kebab Tasting',
        category: 'food',
        description: 'Sample world-famous Agra petha translucent sweets and galouti kebabs.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'Manali & Solang Valley',
    country: 'India',
    region: 'Asia',
    cost_index: 0.70,
    popularity_score: 9.5,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Solang Valley Paragliding & Adventure',
        category: 'adventure',
        description: 'Tandem paraglide above pine forests and snow peaks, quad biking, and zorbing.',
        image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 180
      },
      {
        name: 'Rohtang Pass & Atal Tunnel Snow Excursion',
        category: 'adventure',
        description: 'High mountain pass at 13,058 ft with eternal snowfields and panoramic Pir Panjal peaks.',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 300
      },
      {
        name: 'Hadimba Wooden Temple & Cedar Forest',
        category: 'culture',
        description: 'Unique 1553 pagoda-style wooden temple nestled inside towering giant deodar cedar grove.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 100.00,
        duration_minutes: 90
      },
      {
        name: 'Old Manali Riverside Cafe Crawl & Trout Fish',
        category: 'food',
        description: 'Bohemian cafes serving woodfired pizza, fresh Himalayan trout, and apple crumble.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 800.00,
        duration_minutes: 120
      }
    ]
  },
  {
    name: 'Hampi',
    country: 'India',
    region: 'Asia',
    cost_index: 0.60,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1600100397608-f010f443834a?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Vijaya Vittala Temple & Iconic Stone Chariot',
        category: 'culture',
        description: 'UNESCO World Heritage wonder with musical stone pillars and iconic monolithic chariot.',
        image_url: 'https://images.unsplash.com/photo-1600100397608-f010f443834a?auto=format&fit=crop&w=800&q=80',
        cost: 500.00,
        duration_minutes: 150
      },
      {
        name: 'Matanga Hill Sunrise Trek Over Boulder Landscape',
        category: 'adventure',
        description: 'Climb the highest point in Hampi for 360-degree sunrise views over ancient temple ruins.',
        image_url: 'https://images.unsplash.com/photo-1600100397608-f010f443834a?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 120
      },
      {
        name: 'Virupaksha Temple & Tungabhadra Coracle Ride',
        category: 'sightseeing',
        description: 'Active 7th-century sacred shrine followed by traditional round basket boat ride on the river.',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        cost: 400.00,
        duration_minutes: 120
      },
      {
        name: 'South Indian Filter Coffee & Mango Tree Cafe',
        category: 'food',
        description: 'Fresh coconut thali, banana flower curry, and piping hot brass tumbler filter coffee.',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        cost: 350.00,
        duration_minutes: 75
      }
    ]
  },
  {
    name: 'New York City',
    country: 'United States',
    region: 'Americas',
    cost_index: 2.10,
    popularity_score: 9.9,
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Empire State Building Observatory',
        category: 'sightseeing',
        description: '86th-floor open-air observatory with 360-degree views across Manhattan.',
        image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        cost: 4200.00,
        duration_minutes: 90
      },
      {
        name: 'Broadway Musical VIP Orchestra Tickets',
        category: 'nightlife',
        description: 'Experience world-class live theater production in Times Square theater district.',
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        cost: 11000.00,
        duration_minutes: 150
      },
      {
        name: 'Statue of Liberty & Ellis Island Ferry',
        category: 'culture',
        description: 'Cruise to Liberty Island and explore national museum of American immigration.',
        image_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 180
      },
      {
        name: 'Central Park Bike Tour & Picnic',
        category: 'sightseeing',
        description: 'Cycle past Bethesda Fountain, Strawberry Fields, and Bow Bridge.',
        image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        cost: 1800.00,
        duration_minutes: 120
      },
      {
        name: 'Metropolitan Museum of Art (The Met)',
        category: 'culture',
        description: 'Over 5,000 years of global art from Egyptian Temple of Dendur to European masters.',
        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        cost: 2800.00,
        duration_minutes: 180
      },
      {
        name: 'High Line Park & Chelsea Market Food Crawl',
        category: 'food',
        description: 'Elevated railway park stroll followed by Maine lobster rolls and artisanal tacos.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 3000.00,
        duration_minutes: 120
      },
      {
        name: 'Brooklyn Bridge Walk & DUMBO Sunset',
        category: 'sightseeing',
        description: 'Walk across the historic suspension bridge for iconic skyline sunset photography.',
        image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Greenwich Village Jazz Club Experience',
        category: 'nightlife',
        description: 'Live bebop and modern jazz in an intimate basement club with craft cocktails.',
        image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        cost: 3500.00,
        duration_minutes: 120
      }
    ]
  },
  {
    name: 'Zurich & Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    cost_index: 2.20,
    popularity_score: 9.6,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Jungfraujoch - Top of Europe Train Excursion',
        category: 'adventure',
        description: 'Cogwheel train to Europe’s highest railway station (3,454m) with Ice Palace tour.',
        image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        cost: 16500.00,
        duration_minutes: 420
      },
      {
        name: 'Lake Zurich Steamboat Cruise',
        category: 'sightseeing',
        description: 'Glide across pristine alpine waters with views of snowcapped mountain peaks.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        cost: 2500.00,
        duration_minutes: 90
      },
      {
        name: 'Swiss Chocolate & Cheese Fondue Tasting',
        category: 'food',
        description: 'Taste artisan Lindt truffles and dip crusty bread into bubbling Gruyère fondue.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cost: 4800.00,
        duration_minutes: 120
      },
      {
        name: 'Old Town (Altstadt) Walking Tour',
        category: 'culture',
        description: 'Cobblestone medieval streets, Grossmünster twin towers, and guild houses.',
        image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 90
      },
      {
        name: 'Uetliberg Mountain Viewpoint Hike',
        category: 'adventure',
        description: 'Panoramic mountain lookout tower offering sweeping views over Zurich and the Alps.',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        cost: 600.00,
        duration_minutes: 150
      },
      {
        name: 'Rhine Falls Boat Adventure',
        category: 'adventure',
        description: 'Experience Europe’s most powerful roaring waterfall up close by tourist boat.',
        image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        cost: 3200.00,
        duration_minutes: 240
      },
      {
        name: 'Bahnhofstrasse Luxury Window Shopping',
        category: 'sightseeing',
        description: 'World-famous exclusive boulevard known for haute horlogerie and Swiss watchmakers.',
        image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        cost: 0.00,
        duration_minutes: 75
      },
      {
        name: 'Thermal Baths & Spa Zurich Rooftop',
        category: 'sightseeing',
        description: 'Soak in thermal spring mineral waters in converted 100-year-old stone brewery vaults.',
        image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        cost: 3900.00,
        duration_minutes: 150
      }
    ]
  }
];

const seedDatabase = async () => {
  console.log('Seeding GlobeTrotter Smart database with cities, activities, admin, and demo trips...\n');

  // 1. Seed Cities & Activities
  const createdCities = [];
  for (const cityData of citiesData) {
    const { activities, ...cityInfo } = cityData;

    let city = await prisma.city.findFirst({
      where: { name: cityInfo.name }
    });

    if (!city) {
      city = await prisma.city.create({
        data: cityInfo
      });
      console.log(`Created city: ${city.name}, ${city.country}`);
    } else {
      city = await prisma.city.update({
        where: { id: city.id },
        data: cityInfo
      });
    }
    createdCities.push(city);

    // Seed activities for city
    for (const act of activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { city_id: city.id, name: act.name }
      });
      if (!existingAct) {
        await prisma.activity.create({
          data: {
            city_id: city.id,
            ...act
          }
        });
      }
    }
  }

  console.log(`Seeded ${createdCities.length} world-class cities with complete activities.`);

  // 2. Seed Admin & Demo Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: {
      role: 'admin',
      name: 'Admin Overseer'
    },
    create: {
      name: 'Admin Overseer',
      email: 'admin@globetrotter.com',
      password_hash: passwordHash,
      role: 'admin',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'alex.explorer@globetrotter.com' },
    update: {
      name: 'Alex Explorer',
      role: 'user'
    },
    create: {
      name: 'Alex Explorer',
      email: 'alex.explorer@globetrotter.com',
      password_hash: passwordHash,
      role: 'user',
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    }
  });

  console.log(`Seeded admin user: ${adminUser.email}`);
  console.log(`Seeded demo user: ${demoUser.email}`);

  // Fetch activities for trip building
  const tokyoCity = await prisma.city.findFirst({ where: { name: 'Tokyo' }, include: { activities: true } });
  const kyotoCity = await prisma.city.findFirst({ where: { name: 'Kyoto' }, include: { activities: true } });
  const parisCity = await prisma.city.findFirst({ where: { name: 'Paris' }, include: { activities: true } });
  const romeCity = await prisma.city.findFirst({ where: { name: 'Rome' }, include: { activities: true } });
  const barcelonaCity = await prisma.city.findFirst({ where: { name: 'Barcelona' }, include: { activities: true } });

  // 3. DEMO TRIP 1: "Japan Golden Route (Autumn Discovery)" -> HEALTHY TRIP
  await prisma.trip.deleteMany({ where: { share_slug: 'japan-autumn-healthy' } });

  const healthyTrip = await prisma.trip.create({
    data: {
      user_id: demoUser.id,
      name: 'Japan Golden Route (Autumn Discovery)',
      description: 'A well-balanced cultural journey across Tokyo and Kyoto with optimal pacing and under budget.',
      start_date: new Date('2026-10-10'),
      end_date: new Date('2026-10-15'),
      total_budget: 180000.00,
      cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      status: 'confirmed',
      is_public: true,
      share_slug: 'japan-autumn-healthy'
    }
  });

  await prisma.collaborator.create({
    data: {
      trip_id: healthyTrip.id,
      user_id: demoUser.id,
      role: 'owner',
      accepted_at: new Date()
    }
  });

  // Tokyo Stop
  const tokyoStop = await prisma.tripStop.create({
    data: {
      trip_id: healthyTrip.id,
      city_id: tokyoCity.id,
      order_index: 0,
      arrival_date: new Date('2026-10-10'),
      departure_date: new Date('2026-10-12')
    }
  });

  // Day 1 Tokyo
  if (tokyoCity.activities[0]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[0].id,
        day_number: 1,
        start_time: '09:30',
        order_index: 0
      }
    });
  }
  if (tokyoCity.activities[2]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[2].id,
        day_number: 1,
        start_time: '12:30',
        order_index: 1
      }
    });
  }
  if (tokyoCity.activities[3]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[3].id,
        day_number: 1,
        start_time: '15:30',
        order_index: 2
      }
    });
  }

  // Day 2 Tokyo
  if (tokyoCity.activities[1]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[1].id,
        day_number: 2,
        start_time: '10:00',
        order_index: 0
      }
    });
  }
  if (tokyoCity.activities[4]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[4].id,
        day_number: 2,
        start_time: '18:00',
        order_index: 1
      }
    });
  }

  // Day 3 Tokyo (Rest / Light exploration)
  if (tokyoCity.activities[5]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: tokyoStop.id,
        activity_id: tokyoCity.activities[5].id,
        day_number: 3,
        start_time: '11:00',
        order_index: 0
      }
    });
  }

  // Kyoto Stop
  const kyotoStop = await prisma.tripStop.create({
    data: {
      trip_id: healthyTrip.id,
      city_id: kyotoCity.id,
      order_index: 1,
      arrival_date: new Date('2026-10-13'),
      departure_date: new Date('2026-10-15')
    }
  });

  // Day 4 Kyoto (Rest day buffer)
  if (kyotoCity.activities[1]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: kyotoStop.id,
        activity_id: kyotoCity.activities[1].id,
        day_number: 4,
        start_time: '10:00',
        order_index: 0
      }
    });
  }

  // Day 5 Kyoto
  if (kyotoCity.activities[0]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: kyotoStop.id,
        activity_id: kyotoCity.activities[0].id,
        day_number: 5,
        start_time: '08:30',
        order_index: 0
      }
    });
  }
  if (kyotoCity.activities[2]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: kyotoStop.id,
        activity_id: kyotoCity.activities[2].id,
        day_number: 5,
        start_time: '14:00',
        order_index: 1
      }
    });
  }

  // Day 6 Kyoto
  if (kyotoCity.activities[3]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: kyotoStop.id,
        activity_id: kyotoCity.activities[3].id,
        day_number: 6,
        start_time: '11:30',
        order_index: 0
      }
    });
  }

  // Add healthy expenses
  await prisma.expense.createMany({
    data: [
      {
        trip_id: healthyTrip.id,
        category: 'transport',
        amount: 18000.00,
        note: 'Shinkansen Bullet Train Tokyo-Kyoto',
        trip_stop_id: tokyoStop.id
      },
      {
        trip_id: healthyTrip.id,
        category: 'stay',
        amount: 65000.00,
        note: 'Boutique Ryokan & Modern Hotel 5 Nights',
        trip_stop_id: kyotoStop.id
      },
      {
        trip_id: healthyTrip.id,
        category: 'meals',
        amount: 28000.00,
        note: 'Dining & street food budget',
        trip_stop_id: tokyoStop.id
      }
    ]
  });

  // Calculate Health Score for Healthy Trip
  await prisma.tripHealthScore.upsert({
    where: { trip_id: healthyTrip.id },
    update: {
      budget_score: 100,
      load_balance_score: 100,
      conflict_score: 100,
      buffer_score: 100,
      overall_score: 100,
      computed_at: new Date()
    },
    create: {
      trip_id: healthyTrip.id,
      budget_score: 100,
      load_balance_score: 100,
      conflict_score: 100,
      buffer_score: 100,
      overall_score: 100
    }
  });

  console.log(`Created Healthy Demo Trip: "${healthyTrip.name}" (Score: 100)`);

  // 4. DEMO TRIP 2: "Grand Euro Rush (Express Tour)" -> IMPERFECT OVERLOADED TRIP
  await prisma.trip.deleteMany({ where: { share_slug: 'euro-express-overloaded' } });

  const imperfectTrip = await prisma.trip.create({
    data: {
      user_id: demoUser.id,
      name: 'Grand Euro Rush (Express Tour)',
      description: 'Over-scheduled European multi-city blitz demoing budget alternatives, conflicts, and sanity flags.',
      start_date: new Date('2026-11-01'),
      end_date: new Date('2026-11-04'),
      total_budget: 65000.00,
      cover_photo_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      status: 'planning',
      is_public: true,
      share_slug: 'euro-express-overloaded'
    }
  });

  await prisma.collaborator.create({
    data: {
      trip_id: imperfectTrip.id,
      user_id: demoUser.id,
      role: 'owner',
      accepted_at: new Date()
    }
  });

  // Paris Stop
  const parisStop = await prisma.tripStop.create({
    data: {
      trip_id: imperfectTrip.id,
      city_id: parisCity.id,
      order_index: 0,
      arrival_date: new Date('2026-11-01'),
      departure_date: new Date('2026-11-02')
    }
  });

  // Day 1 Paris: 6 activities (Overloaded Day flag)
  const parisActivities = parisCity.activities.slice(0, 6);
  for (let i = 0; i < parisActivities.length; i++) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: parisStop.id,
        activity_id: parisActivities[i].id,
        day_number: 1,
        start_time: `${String(8 + i * 2).padStart(2, '0')}:00`,
        order_index: i
      }
    });
  }

  // Rome Stop
  const romeStop = await prisma.tripStop.create({
    data: {
      trip_id: imperfectTrip.id,
      city_id: romeCity.id,
      order_index: 1,
      arrival_date: new Date('2026-11-02'),
      departure_date: new Date('2026-11-03')
    }
  });

  // Day 2 Rome: Time Conflict! (Colosseum at 10:00 (150m = until 12:30) overlaps Vatican at 11:00)
  if (romeCity.activities[0] && romeCity.activities[1]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: romeStop.id,
        activity_id: romeCity.activities[0].id,
        day_number: 2,
        start_time: '10:00',
        order_index: 0
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: romeStop.id,
        activity_id: romeCity.activities[1].id,
        day_number: 2,
        start_time: '11:00', // Conflict with Colosseum
        order_index: 1
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: romeStop.id,
        activity_id: romeCity.activities[2].id,
        day_number: 2,
        start_time: '18:00',
        order_index: 2
      }
    });
  }

  // Barcelona Stop
  const barcelonaStop = await prisma.tripStop.create({
    data: {
      trip_id: imperfectTrip.id,
      city_id: barcelonaCity.id,
      order_index: 2,
      arrival_date: new Date('2026-11-03'),
      departure_date: new Date('2026-11-04')
    }
  });

  // Day 3 Barcelona: 3 packed activities
  if (barcelonaCity.activities[0] && barcelonaCity.activities[1] && barcelonaCity.activities[2]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[0].id,
        day_number: 3,
        start_time: '10:00',
        order_index: 0
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[1].id,
        day_number: 3,
        start_time: '13:30',
        order_index: 1
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[2].id,
        day_number: 3,
        start_time: '19:00',
        order_index: 2
      }
    });
  }

  // Day 4 Barcelona: 3 activities -> Triggers 4-consecutive packed days without rest!
  if (barcelonaCity.activities[3] && barcelonaCity.activities[4] && barcelonaCity.activities[5]) {
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[3].id,
        day_number: 4,
        start_time: '10:00',
        order_index: 0
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[4].id,
        day_number: 4,
        start_time: '14:00',
        order_index: 1
      }
    });
    await prisma.itineraryItem.create({
      data: {
        trip_stop_id: barcelonaStop.id,
        activity_id: barcelonaCity.activities[5].id,
        day_number: 4,
        start_time: '19:30',
        order_index: 2
      }
    });
  }

  // Add large expenses to exceed budget
  await prisma.expense.createMany({
    data: [
      {
        trip_id: imperfectTrip.id,
        category: 'transport',
        amount: 42000.00,
        note: 'Multi-flight & Eurostar tickets',
        trip_stop_id: parisStop.id
      },
      {
        trip_id: imperfectTrip.id,
        category: 'stay',
        amount: 72000.00,
        note: '4-Star hotels in Paris & Rome',
        trip_stop_id: romeStop.id
      },
      {
        trip_id: imperfectTrip.id,
        category: 'meals',
        amount: 35000.00,
        note: 'Fine dining & champagne',
        trip_stop_id: parisStop.id
      }
    ]
  });

  // Calculate Health Score for Imperfect Trip
  await prisma.tripHealthScore.upsert({
    where: { trip_id: imperfectTrip.id },
    update: {
      budget_score: 15,
      load_balance_score: 50,
      conflict_score: 40,
      buffer_score: 50,
      overall_score: 35,
      computed_at: new Date()
    },
    create: {
      trip_id: imperfectTrip.id,
      budget_score: 15,
      load_balance_score: 50,
      conflict_score: 40,
      buffer_score: 50,
      overall_score: 35
    }
  });

  console.log(`Created Imperfect Demo Trip: "${imperfectTrip.name}" (Score: 35)`);
  console.log('\nSeed execution finished successfully!');
};

seedDatabase()
  .catch((e) => {
    console.error('Seed failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
