export type PublicServiceOption = {
  id: string
  name: string
  categoryName: string
  description: string
  price: number
}

export const PUBLIC_SERVICES: PublicServiceOption[] = [
  { id: 'residential-cleaning', name: 'Regular Residential', categoryName: 'Normal Cleaning', description: 'Standard home cleaning for maintaining a fresh living space.', price: 150 },
  { id: 'office-cleaning', name: 'Regular Office', categoryName: 'Normal Cleaning', description: 'Professional workspace cleaning for productive environments.', price: 180 },
  { id: 'maid-cleaning-service', name: 'Maid Cleaning Service', categoryName: 'Normal Cleaning', description: 'Reliable maid cleaning for apartments and villas across Dubai.', price: 170 },
  { id: 'window-cleaning', name: 'Window Cleaning', categoryName: 'Normal Cleaning', description: 'Streak-free exterior and interior window restoration.', price: 140 },
  { id: 'balcony-deep-cleaning', name: 'Balcony Cleaning', categoryName: 'Normal Cleaning', description: 'Removing dust and sand from outdoor areas.', price: 160 },
  { id: 'sofa-deep-cleaning', name: 'Sofa Cleaning', categoryName: 'Normal Cleaning', description: 'Professional upholstery sanitization.', price: 170 },
  { id: 'curtain-cleaning', name: 'Curtain Cleaning', categoryName: 'Normal Cleaning', description: 'Fabric-safe steam curtain cleaning with dust and odor removal.', price: 175 },
  { id: 'carpets-deep-cleaning', name: 'Carpets Cleaning', categoryName: 'Normal Cleaning', description: 'Deep extraction cleaning for carpet fibers.', price: 190 },
  { id: 'mattress-deep-cleaning', name: 'Mattress Cleaning', categoryName: 'Normal Cleaning', description: 'Allergen and dust mite removal.', price: 150 },

  { id: 'grout-deep-cleaning', name: 'Grout Deep Clean', categoryName: 'Deep Cleaning', description: 'Tile and grout line restoration.', price: 220 },
  { id: 'garage-deep-cleaning', name: 'Garage Deep Clean', categoryName: 'Deep Cleaning', description: 'Heavy-duty cleaning for garages.', price: 250 },
  { id: 'kitchen-deep-cleaning', name: 'Kitchen Deep Clean', categoryName: 'Deep Cleaning', description: 'Comprehensive kitchen degreasing and sanitization.', price: 280 },
  { id: 'post-construction-cleaning', name: 'Post Construction', categoryName: 'Deep Cleaning', description: 'Dust and debris cleanup after renovation.', price: 320 },
  { id: 'office-deep-cleaning', name: 'Office Deep Clean', categoryName: 'Deep Cleaning', description: 'Detailed sanitization for office spaces.', price: 300 },
  { id: 'apartment-deep-cleaning', name: 'Apartment Deep', categoryName: 'Deep Cleaning', description: 'Top-to-bottom apartment deep cleaning.', price: 260 },
  { id: 'move-in-out-cleaning', name: 'Move In/Out', categoryName: 'Deep Cleaning', description: 'Move-in and move-out detailed cleaning.', price: 300 },
  { id: 'villa-deep-cleaning', name: 'Villa Deep Clean', categoryName: 'Deep Cleaning', description: 'Premium full-villa deep cleaning.', price: 450 },
  { id: 'floor-deep-cleaning', name: 'Floor Deep Clean', categoryName: 'Deep Cleaning', description: 'Deep scrubbing and polishing for hard floors.', price: 240 },

  { id: 'ac-duct-cleaning', name: 'AC Duct Cleaning', categoryName: 'Technical Services', description: 'Indoor air quality improvement through duct cleaning.', price: 350 },
  { id: 'ac-coil-cleaning', name: 'AC Coil Cleaning', categoryName: 'Technical Services', description: 'Coil cleaning for improved AC performance.', price: 280 },
  { id: 'kitchen-hood-cleaning', name: 'Kitchen Hood Cleaning', categoryName: 'Technical Services', description: 'Grease and residue removal from hood systems.', price: 320 },
  { id: 'grease-trap-cleaning', name: 'Grease Trap Clean', categoryName: 'Technical Services', description: 'Grease trap maintenance and cleaning.', price: 260 },
  { id: 'restaurant-cleaning', name: 'Restaurant Clean', categoryName: 'Technical Services', description: 'Commercial hospitality cleaning.', price: 380 },
  { id: 'water-tank-cleaning', name: 'Water Tank Clean', categoryName: 'Technical Services', description: 'Safe water tank sanitization.', price: 340 },
  { id: 'swimming-pool-cleaning', name: 'Swimming Pool', categoryName: 'Technical Services', description: 'Pool maintenance and cleaning.', price: 400 },
  { id: 'gym-deep-cleaning', name: 'Gym Deep Clean', categoryName: 'Technical Services', description: 'Equipment and facility sanitization.', price: 360 },
  { id: 'facade-cleaning', name: 'Facade Cleaning', categoryName: 'Technical Services', description: 'Exterior building cleaning solutions.', price: 500 },
]

export function groupPublicServicesByCategory() {
  const grouped: Record<string, PublicServiceOption[]> = {}

  for (const service of PUBLIC_SERVICES) {
    if (!grouped[service.categoryName]) grouped[service.categoryName] = []
    grouped[service.categoryName].push(service)
  }

  return grouped
}
