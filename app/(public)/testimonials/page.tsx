"use client"

import { motion } from 'framer-motion'
import { Star, Quote, User } from 'lucide-react'

const testimonials = [
  {
    name: "Mr. Riaz",
    role: "Food Outlet Owner, Dubai",
    content: "We recently switched from an old cleaning company to Homework. Despite recurring spills and stains in food outlets, they were efficient at their work and managed to eliminate even the most stubborn blemishes that left me truly delighted. I am glad to recommend them to others as well.",
    rating: 5
  },
  {
    name: "Roza Khan",
    role: "Resident, Abu Dhabi",
    content: "Highly skilled home cleaners brought in the latest equipment for cleaning our badly stained curtains. Within a matter of hours, the curtains looked as good as new. They were professional and gave a completely brilliant clean service - Highly recommended! Thank you!",
    rating: 5
  },
  {
    name: "Mrs. Ema Henrick",
    role: "Townhouse Owner",
    content: "Having lived in the townhouse for decades, dust and cobwebs accumulated in areas with limited access. The kitchen sinks, hoods and exhausts had layers of grease. I roped in Homework for the cleaning service. The team was flexible when setting the schedule, plus they did a fabulous job. I was so elated that I right away referred them to my neighbors.",
    rating: 5
  },
  {
    name: "Mr. Hirachand Lalvani",
    role: "Supermarket Chain Owner",
    content: "Homework sanitized our chain of grocery stores and supermarkets. The team is polite and a pleasure to work with. Apart from an intensive disinfection drive, our premise are totally pathogen-free. They left with valuable tips and guidelines for ongoing sanitization service.",
    rating: 5
  },
  {
    name: "Mr. Waseem Khan",
    role: "Office Manager",
    content: "I am a very particular person when it comes to aspects of cleanliness. The Homework crew never disappointed me in this area. The house cleaning team arrived on time and literally cleaned every nook and corner of the office. After they left the entire environment was so refreshing.",
    rating: 5
  },
  {
    name: "Mr. Parmar Bhansali",
    role: "Apartment Owner, Sharjah",
    content: "The team is truly professional and proficient at their job. They reached my apartment on time on a Friday. They did top-notch deep cleaning work that fetched a good deal with tenants. I look forward to using their house cleaning services again and would recommend them to my contacts.",
    rating: 5
  },
  {
    name: "Mr. Nafiz Bangara",
    role: "Retail Outlet Manager",
    content: "We have booked Homework cleaning services to clean our retail outlets since we opened. Apart from a good cleaning service, we found the team to be flexible and accommodating. They have always agreed for extra-cleaning chores even at short notices. I happily recommend them for their exceptional cleaning service.",
    rating: 5
  },
  {
    name: "Mr. Mina Bilal",
    role: "Resident",
    content: "From start to finish the home cleaners were professional and provided quick efficient service. Our large leather sofas, lounge carpets and furniture cabinets were cleaned. The team was flexible to fit into the requested schedule. I definitely recommend their upholstery cleaning services and would hire them again.",
    rating: 5
  },
  {
    name: "Ms. Lisa Ray",
    role: "Garden Enthusiast",
    content: "I love my plants and flower pots dearly. Hence I was finicky when choosing a cleaning company. I assigned the job to Homework based on a friend's recommendation and I was delighted by their service level. The garden was cleaned and plants pruned to perfection with no damage to my plants. I will surely contact them again.",
    rating: 5
  },
  {
    name: "Mrs. Samantha Jane",
    role: "Resident",
    content: "It was depressing to sit daily on a badly stained couch. We had trialed 2 cleaning companies in the past. Unfortunately, they didn't fetch us the results. Within one visit, Homework impressed us with the Sofa's transformed look. All it took was one phone call to arrange their service. I have preserved their card.",
    rating: 5
  },
  {
    name: "Mr. Amir Gaffry",
    role: "Resident",
    content: "Homework is one of the finest cleaning services in UAE I have ever booked. They delivered an exceptional cleaning job with dedication and utmost professionalism. I really appreciate the expertise, courtesy and candidness the cleaners display.",
    rating: 5
  },
  {
    name: "Ms. Mariam Roza",
    role: "Resident",
    content: "Homework did our move in cleaning flawlessly. They left no blemish or dark corner untouched. The tiles were shining when we entered the house. Very professional and incredibly reliable! Thanks to their cleaning services we could move in worry-free.",
    rating: 5
  },
  {
    name: "Mariam Khalid",
    role: "Resident, Dubai",
    content: "I just gave initial instructions to the house cleaning team and left for a party. When I came back I was amazed by the level of tidiness. Everything was spick and span. I would definitely rebook Homework cleaning services Dubai for any upcoming cleaning sessions.",
    rating: 5
  },
  {
    name: "Ms. Olga Ivanov",
    role: "Resident",
    content: "Living in the outskirts, the windows were in desperate need of a major clean after the dry summer dust storms. The home cleaners washed our windows and balconies inside and out, removed and cleaned the fly screens. They did an amazing job and the whole house looks different. I recommend them highly enough for all your house cleaning needs.",
    rating: 5
  },
  {
    name: "Mr. Zubaid Abdullah",
    role: "Business Owner",
    content: "I recently had disinfected and sanitized my home during the holidays. I was 100% satisfied with their service. With the pandemic, we take no chance and will regularly hire Homework cleaning company to sanitize our commercial establishments as well.",
    rating: 5
  },
  {
    name: "Mr. Majid Ahmed",
    role: "Warehouse Manager",
    content: "I used Homework for the first time to get our old warehouses cleaned and their level of service amazed my team. The premise came up so good that we didn't need as much renovation as we thought. I would highly recommend them to other organizations looking for reliable and efficient commercial cleaning services.",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <div className="flex flex-col overflow-hidden pt-20">
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              Member Stories
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
              What Our <span className="text-primary italic">Clients</span> Say
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Join thousands of satisfied premium clients who trust Homework UAE for their hygiene needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-primary/10 mb-6" />
                  <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8 italic">
                    "{t.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{t.name}</h4>
                    <p className="text-sm text-slate-500 font-bold">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
