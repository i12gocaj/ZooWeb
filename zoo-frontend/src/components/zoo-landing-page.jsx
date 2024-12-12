'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, CreditCard, CalendarDays, Mail, Send } from 'lucide-react'

export function ZooLandingPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const notificationData = {
      email,
      subject: 'Contact from Natural Zoo', 
      message: `We have received your contact request and will respond as soon as possible.
                
                Regards, Natural Zoo. 
      `,
    }

    const contactData = {
      email,
      message,
    }

    try {
      // 1. Enviar correo de notificación
      const notificationResponse = await fetch('http://localhost:5001/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      })

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json()
        console.error('Error al enviar el correo:', errorData)
        alert('Hubo un error al enviar el mensaje, por favor intenta nuevamente.')
        return
      }

      // 2. Almacenar el mensaje en la base de datos
      const messageResponse = await fetch('http://localhost:5001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!messageResponse.ok) {
        const errorData = await messageResponse.json()
        console.error('Error al guardar el mensaje:', errorData)
        alert('Hubo un error al almacenar el mensaje, por favor intenta nuevamente.')
        return
      }

      console.log('Mensaje guardado correctamente')
      alert('Your message has been sent successfully.')

      // Limpiar campos del formulario
      setEmail('')
      setMessage('')
    } catch (error) {
      console.error('Error en la solicitud:', error)
      alert('Error en la solicitud, por favor verifica tu conexión.')
    }
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold text-green-900 mb-4">
          Welcome to the Natural Zoo
        </h2>
        <p className="text-xl text-green-800 mb-6">
          Discover the wonder of wildlife in a safe and educational environment
        </p>
        <Image
          src="/placeholder.png"
          alt="Zoo Panorama"
          width={800}
          height={400}
          className="rounded-lg shadow-lg mx-auto"
        />
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Information Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>123 Animals Avenue</p>
            <p>Natura City, ZIP 12345</p>
            <Link href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              <Button variant="link" className="mt-2 p-0">View on Google Maps</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" /> Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Monday to Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturdays and Sundays: 10:00 AM - 8:00 PM</p>
            <p>Holidays: 10:00 AM - 4:00 PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2" /> Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Adults: €15</p>
            <p>Children (3-12 years): €10</p>
            <p>Students and Seniors: €12</p>
            <p>Under 3 years: Free</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2" /> Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
              <Textarea
                placeholder="Reason for contact"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required />
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <section className="text-center mb-12">
        <h3 className="text-2xl font-bold text-green-900 mb-4">Upcoming Events</h3>
        <div className="flex justify-center items-center space-x-2 text-green-800">
          <CalendarDays />
          <p>World Animal Day: October 4th - Free entry for children</p>
        </div>
      </section>

      <div className="text-center">
        <Link href="/zoo-home">
        <Button type="submit" className=" items-center justify-center">
                  
                 EXPLORE THE ZOO
                </Button>
        </Link>
      </div>
    </main>
  )
}
