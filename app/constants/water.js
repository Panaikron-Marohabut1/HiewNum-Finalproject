// Default water intake goals based on gender
export const DEFAULT_GOAL = {
  DEFAULT: 2500, // ml per day
  MALE: 3000,    // ml per day
  FEMALE: 2200,  // ml per day
};

// Container sizes for quick add options
export const CONTAINER_SIZES = [
  { id: 1, name: 'Glass', amount: 200, icon: 'glass-mug' },
  { id: 2, name: 'Bottle', amount: 500, icon: 'bottle-soda' },
  { id: 3, name: 'Small Bottle', amount: 330, icon: 'bottle-soda-outline' },
  { id: 4, name: 'Cup', amount: 250, icon: 'cup' },
];

// Measurement units
export const UNITS = {
  ML: 'ml',
  OZ: 'oz',
};

// Conversion factors
export const CONVERSION = {
  ML_TO_OZ: 0.033814, // 1ml = 0.033814oz
  OZ_TO_ML: 29.5735,  // 1oz = 29.5735ml
};

// Reminder frequency options (in minutes)
export const REMINDER_FREQUENCY = [
  { id: 1, label: 'Every hour', value: 60 },
  { id: 2, label: 'Every 2 hours', value: 120 },
  { id: 3, label: 'Every 3 hours', value: 180 },
];

// Water tips content
export const WATER_TIPS = [
  {
    id: 1,
    title: 'Benefits of Proper Hydration',
    content: 'Staying hydrated improves energy levels, brain function, and helps regulate body temperature. It also aids digestion and nutrient absorption.',
  },
  {
    id: 2,
    title: 'Signs of Dehydration',
    content: 'Watch for dark yellow urine, dry mouth, fatigue, headache, dizziness, and decreased urination. These are all signs that you need to drink more water.',
  },
  {
    id: 3,
    title: 'Hydration During Exercise',
    content: 'Drink about 500ml of water 2-3 hours before exercise, 250ml 10-15 minutes before, and 200-250ml every 15-20 minutes during exercise.',
  },
  {
    id: 4,
    title: 'Daily Water Needs',
    content: 'A good rule of thumb is to drink at least 8 glasses (about 2 liters) of water daily. Active individuals and those in hot climates may need more.',
  },
  {
    id: 5,
    title: 'Improving Water Intake',
    content: 'Keep a water bottle with you, set reminders, add natural flavors like lemon or cucumber, and eat water-rich foods like watermelon and oranges.',
  },
]; 