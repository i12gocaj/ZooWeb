'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, MapPin, User, Instagram, Facebook, Search, Database, Settings, ShieldCheck } from 'lucide-react' // Iconos actualizados
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Updated data for the animal catalog and biomes
const animalCatalog = [
  {
    biome: "Savanna",
    description: "A biome of vast grasslands and scattered trees. The warm climate with wet and dry seasons predominates, and it is home to large herbivores and predators.",
    animals: [
      { name: "Lion", description: "King of the savanna and apex predator" },
      { name: "Giraffe", description: "Long-necked herbivore adapted to reach high leaves" },
      { name: "African Elephant", description: "The largest land mammal, known for its intelligence" },
      { name: "Rhinoceros", description: "Thick-skinned herbivore with distinctive horns" },
      { name: "Zebra", description: "Equine with characteristic black and white stripes" },
      { name: "Ostrich", description: "The world's largest flightless bird" },
      { name: "Meerkat", description: "Small mammal known for its vigilant behavior" },
      { name: "Cheetah", description: "The fastest feline in the world, capable of reaching speeds up to 110 km/h in short sprints" },
      { name: "Hyena", description: "Scavenger and opportunistic hunter, known for its distinctive laugh" },
      { name: "African Buffalo", description: "Robust and dangerous herbivore, often called 'the silent killer'" },
    ]
  },
  {
    biome: "Tropical Rainforest",
    description: "Ecosystem with dense vegetation and high biodiversity. Warm and humid climate year-round, ideal for species adapted to an exuberant and lush environment.",
    animals: [
      { name: "Tiger", description: "Striped feline and powerful predator" },
      { name: "Gorilla", description: "Large and strong primate" },
      { name: "Capuchin Monkey", description: "Small primate known for its intelligence" },
      { name: "Anteater", description: "Mammal with an elongated snout specialized in eating ants" },
      { name: "Toucan", description: "Colorful bird with a large, distinctive beak" },
      { name: "Sloth", description: "Arboreal mammal with slow movements" },
      { name: "Python Snake", description: "Large constrictor reptile" },
      { name: "Jaguar", description: "The largest feline in America, known for its strength and swimming ability" },
      { name: "Anaconda", description: "One of the largest snakes in the world, an aquatic hunter" },
      { name: "Tapir", description: "Herbivorous mammal with a small prehensile trunk" },
    ]
  },
  {
    biome: "Desert",
    description: "Arid biome with extreme temperatures and sparse vegetation. Animals are adapted to dry conditions and often have abilities to conserve water and withstand heat.",
    animals: [
      { name: "Camel", description: "Mammal adapted to survive long periods without water" },
      { name: "Fennec Fox", description: "Small fox with large ears for temperature regulation" },
      { name: "Sand Snake", description: "Reptile adapted to move efficiently in sand" },
      { name: "Scorpion", description: "Venomous nocturnal arthropod" },
      { name: "Horned Lizard", description: "Reptile with defensive spines" },
      { name: "Dromedary", description: "Single-humped camelid adapted to the desert" },
      { name: "Addax", description: "Desert antelope critically endangered" },
      { name: "Dama Gazelle", description: "Fast antelope adapted to desert conditions" },
      { name: "Desert Vulture", description: "Scavenging bird adapted to arid climates" },
    ]
  },
  {
    biome: "Temperate Forest",
    description: "Deciduous and coniferous forests with well-defined seasons. Animals adapt to temperature changes and food availability.",
    animals: [
      { name: "Gray Wolf", description: "Social canid and apex predator" },
      { name: "Black Bear", description: "Omnivorous adaptable to various habitats" },
      { name: "Deer", description: "Herbivore with branched antlers" },
      { name: "Bald Eagle", description: "Bird of prey and national symbol of the United States" },
      { name: "Owl", description: "Nocturnal bird of prey" },
      { name: "Raccoon", description: "Omnivorous mammal with a distinctive facial mask" },
      { name: "Red Fox", description: "Adaptable and opportunistic canid" },
      { name: "Puma", description: "Agile and powerful feline hunter, also known as the mountain lion" },
      { name: "Beaver", description: "Semi-aquatic rodent known for building dams" },
      { name: "Brown Bear", description: "Large omnivore, includes subspecies like the grizzly bear" },
    ]
  },
  {
    biome: "Taiga or Boreal Forest",
    description: "Coniferous forests with a cold climate, long winters, and short summers. Animals are adapted to low temperatures and snow.",
    animals: [
      { name: "Lynx", description: "Medium-sized feline adapted to snow" },
      { name: "Moose", description: "The largest deer with palmate antlers" },
      { name: "Arctic Fox", description: "Canid that changes color with the seasons" },
      { name: "Snowy Owl", description: "White bird of prey adapted to the Arctic" },
      { name: "Wolverine", description: "Resilient and strong carnivorous mammal" },
      { name: "Reindeer", description: "Migratory cervid adapted to cold climates" },
      { name: "Marten", description: "Small arboreal carnivorous mammal" },
      { name: "Black Grouse", description: "Galliform bird adapted to coniferous forests" },
    ]
  },
  {
    biome: "Polar Region (Arctic and Antarctic)",
    description: "Extremely cold climate and permanent snow. This biome can be simulated in zoos with refrigerated areas for Arctic species.",
    animals: [
      { name: "Penguin", description: "Flightless bird adapted to swimming (only certain species)" },
      { name: "Polar Bear", description: "The largest land carnivore" },
      { name: "Arctic Fox", description: "Canid adapted to extreme cold" },
      { name: "Seal", description: "Marine mammal adapted to life on ice and in water" },
      { name: "Arctic Wolf", description: "Social canid adapted to polar conditions" },
      { name: "Walrus", description: "Large pinniped with prominent tusks" },
      { name: "Musk Ox", description: "Bovine adapted to Arctic cold" },
      { name: "Arctic Hare", description: "Lagomorph that changes color in winter" },
    ]
  },
  {
    biome: "Swamp and Wetlands",
    description: "Areas of fresh or saltwater with dense vegetation, moist soil, and a transitional ecosystem between land and water. Animals are adapted to aquatic conditions.",
    animals: [
      { name: "Crocodile", description: "Semi-aquatic predatory reptile" },
      { name: "Hippopotamus", description: "Large semi-aquatic herbivorous mammal" },
      { name: "Flamingo", description: "Wading bird known for its pink color" },
      { name: "Otter", description: "Playful aquatic mammal" },
      { name: "Ibis", description: "Wading bird with a curved beak" },
      { name: "Caiman", description: "Reptile similar to the crocodile" },
      { name: "Heron", description: "Wading fishing bird" },
      { name: "Manatee", description: "Herbivorous marine mammal, also known as the sea cow" },
      { name: "Bullfrog", description: "Large amphibian known for its strong croak" },
      { name: "Softshell Turtle", description: "Aquatic reptile with a flexible shell" },
    ]
  },
  {
    biome: "Prairie",
    description: "Biome of vast grasslands with a temperate and semi-arid climate. Ideal for species that inhabit open terrains with few wooded areas.",
    animals: [
      { name: "Bison", description: "Large herbivorous mammal, symbol of North American prairies" },
      { name: "Meerkat", description: "Small social mammal known for its upright stance" },
      { name: "Golden Eagle", description: "Large-winged bird of prey" },
      { name: "Coyote", description: "Adaptable and opportunistic canid" },
      { name: "Prairie Dog", description: "Social rodent that lives in underground colonies" },
      { name: "American Antelope", description: "Fast herbivore native to North American prairies" },
      { name: "Black-Footed Ferret", description: "Small endangered carnivore" },
      { name: "Canadian Crane", description: "Large migratory bird" },
    ]
  },
  {
    biome: "Mountain or Alpine Zone",
    description: "Elevated and rocky terrains with variable climates and adaptations to altitude and cold.",
    animals: [
      { name: "Mountain Goat", description: "Agile mammal adapted to steep terrains" },
      { name: "Condor", description: "Scavenging bird with the largest wingspan" },
      { name: "Brown Bear", description: "Large omnivore adaptable to various habitats" },
      { name: "Puma", description: "Agile and powerful feline hunter" },
      { name: "Eagle", description: "Bird of prey adapted to hunting in mountainous terrains" },
      { name: "Llama", description: "Domesticated camelid adapted to high altitudes" },
      { name: "Snow Leopard", description: "Elusive feline adapted to cold mountainous terrains" },
      { name: "Marmot", description: "Hibernating rodent common in alpine zones" },
    ]
  },
]

export function ZooHomeComponent() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCatalog = animalCatalog
    .filter(biome => 
      biome.biome.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      biome.animals.some(animal =>  
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      biome.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(biome => ({
      ...biome,
      animals: biome.animals.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))

    return (
      <div className="min-h-screen bg-stone-100">
        <main className="container mx-auto mt-8 p-4">
          <Tabs defaultValue="specimens" className="w-full mb-8">
            <TabsList className="flex border-b border-gray-300">
              {/* Pestaña de Specimens */}
              <TabsTrigger
  value="specimens"
  className="flex-1 flex items-center justify-center px-4 py-2 text-gray-600 hover:text-green-600 transition-colors duration-300
             border-b-4 border-transparent
             data-[state=active]:text-green-700 
             data-[state=active]:border-green-700
             data-[state=active]:bg-custom-light-green  {/* Usando el color personalizado */}
             data-[state=active]:font-semibold
             data-[state=active]:shadow-md
             "
>
  <Database className="mr-2 h-5 w-5" />
  Specimens
</TabsTrigger>
  
              {/* Pestaña de Services */}
              <TabsTrigger
                value="services"
                className="flex-1 flex items-center justify-center px-4 py-2 text-gray-600 hover:text-green-600 transition-colors duration-300
                           border-b-4 border-transparent
                           data-[state=active]:text-green-700 
                           data-[state=active]:border-green-700
                           data-[state=active]:bg-custom-light-green
                           data-[state=active]:font-semibold
                           data-[state=active]:shadow-md
                           "
              >
                <Settings className="mr-2 h-5 w-5" />
                Services
              </TabsTrigger>
  
              {/* Pestaña de Conservation */}
              <TabsTrigger
                value="conservation"
                className="flex-1 flex items-center justify-center px-4 py-2 text-gray-600 hover:text-green-600 transition-colors duration-300
                           border-b-4 border-transparent
                           data-[state=active]:text-green-700 
                           data-[state=active]:border-green-700
                           data-[state=active]:bg-custom-light-green
                           data-[state=active]:font-semibold
                           data-[state=active]:shadow-md
                           "
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Conservation
              </TabsTrigger>
          </TabsList>

          {/* Contenido de Specimens */}
          <TabsContent value="specimens">
            <Card>
              <CardHeader>
                <CardTitle>Animal Catalog by Biomes</CardTitle>
                <CardDescription>Explore our diverse collection of animals organized by their natural habitats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search animals or biomes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={<Search className="h-4 w-4 text-gray-500" />} />
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {filteredCatalog.map((biome, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-xl font-semibold text-gray-700">
                        {biome.biome}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-4 text-sm text-gray-600">{biome.description}</p>
                        <ul className="space-y-2">
                          {biome.animals.map((animal, animalIndex) => (
                            <li key={animalIndex} className="bg-white p-3 rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                              <h4 className="font-semibold text-green-700">{animal.name}</h4>
                              <p className="text-sm text-gray-600">{animal.description}</p>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido de Services */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
                <CardDescription>Discover all the amenities we offer to make your visit unforgettable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Restaurants and Cafeterias */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Restaurants and Cafeterias</h3>
                    <p className="text-sm text-gray-600">Indulge in a wide variety of culinary delights tailored to every palate. From quick bites to gourmet meals, enjoy a delightful dining experience in a family-friendly and welcoming atmosphere.</p>
                  </div>
                  {/* Souvenir Shop */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Souvenir Shop</h3>
                    <p className="text-sm text-gray-600">Find the perfect memento of your visit in our unique souvenir shop. Browse a curated selection of products inspired by our diverse wildlife and handcrafted by local artisans.</p>
                  </div>
                  {/* Children's Play Areas */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Children&apos;s Play Areas</h3>
                    <p className="text-sm text-gray-600">Safe and fun-filled spaces where your little ones can play and learn about nature while having a great time. Our play areas are designed to spark creativity and curiosity.</p>
                  </div>
                  {/* Educational Centers */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Educational Centers</h3>
                    <p className="text-sm text-gray-600">Engage in our educational programs and workshops designed for all ages. Promote conservation and respect for biodiversity through interactive and inspiring learning experiences.</p>
                  </div>
                  {/* Rest and Picnic Areas */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Rest and Picnic Areas</h3>
                    <p className="text-sm text-gray-600">Relax and unwind in our green spaces equipped with picnic tables and shaded areas. Perfect for enjoying a meal amidst nature’s beauty.</p>
                  </div>
                  {/* Accessibility Services */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Accessibility Services</h3>
                    <p className="text-sm text-gray-600">We are committed to ensuring a comfortable experience for everyone. Our facilities include ramps, available wheelchairs, and adapted routes to accommodate visitors with reduced mobility.</p>
                  </div>
                  {/* Parking */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Parking</h3>
                    <p className="text-sm text-gray-600">Enjoy ample free parking with 24/7 security, conveniently located near all major areas of the zoo for your ease and safety.</p>
                  </div>
                  {/* Free Wi-Fi */}
                  <div className="p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Free Wi-Fi</h3>
                    <p className="text-sm text-gray-600">Stay connected throughout your visit with our complimentary Wi-Fi service available across the entire zoo premises.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido de Conservation */}
          <TabsContent value="conservation">
            <Card>
              <CardHeader>
                <CardTitle>Our Conservation Efforts</CardTitle>
                <CardDescription>Protecting biodiversity and natural habitats with passion and purpose</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Conservation Programs */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <Leaf className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700">Endangered Species Breeding Programs</h3>
                      <p className="text-sm text-gray-600">We work tirelessly to safeguard endangered species through breeding programs that aim to restore population numbers. By supporting genetic diversity and healthy reintroductions, we’re giving many species a renewed chance in the wild.</p>
                    </div>
                  </div>
                  {/* Habitat Restoration */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <MapPin className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700">Natural Habitat Restoration</h3>
                      <p className="text-sm text-gray-600">Our team collaborates on projects to restore natural habitats, creating safe and sustainable ecosystems for animals to thrive. We’re committed to repairing the land, from local wetlands to forested areas, allowing native flora and fauna to flourish.</p>
                    </div>
                  </div>
                  {/* Research and Education */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <User className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700">Research and Education Initiatives</h3>
                      <p className="text-sm text-gray-600">In partnership with leading conservationists, our research and education programs engage visitors in learning about ecosystems, the importance of biodiversity, and the impact of conservation efforts on global wildlife populations.</p>
                    </div>
                  </div>
                  {/* Support Our Conservation */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-md shadow hover:bg-green-50 transition-colors duration-200">
                    <Instagram className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700">Support Our Projects</h3>
                      <p className="text-sm text-gray-600">Every visit and donation contributes directly to these conservation projects. Join us in making a difference by supporting the preservation of wildlife and natural habitats for future generations.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}