'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CalendarDays, Ticket } from 'lucide-react'

export function TourReservationComponent() {
  const [activeTab, setActiveTab] = useState('reservation')

  // === Tour Reservations ===
  const [resFullName, setResFullName] = useState('')
  const [resEmail, setResEmail] = useState('')
  const [resTourDate, setResTourDate] = useState('')
  const [resTourTime, setResTourTime] = useState('')
  const [resChildren, setResChildren] = useState(0)
  const [resYouth, setResYouth] = useState(0)
  const [resAdults, setResAdults] = useState(0)
  const [resSeniors, setResSeniors] = useState(0)
  const [resComments, setResComments] = useState('')
  const [resTotalPrice, setResTotalPrice] = useState(0)

  // === Ticket Purchases ===
  const [ticFullName, setTicFullName] = useState('')
  const [ticEmail, setTicEmail] = useState('')
  const [ticChildren, setTicChildren] = useState(0)
  const [ticYouth, setTicYouth] = useState(0)
  const [ticAdults, setTicAdults] = useState(0)
  const [ticSeniors, setTicSeniors] = useState(0)
  const [ticUnder3, setTicUnder3] = useState(0)
  const [ticTotalPrice, setTicTotalPrice] = useState(0)
  const [ticComments, setTicComments] = useState('')

  // List of available times for reservations
  const availableTimes = [
    "09:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM"
  ]

  // Price for Tour Reservations
  const tourPrices = {
    children: 9,
    youth: 12,
    adults: 16,
    seniors: 12
  }

  // Price for Ticket Purchases
  const ticketPrices = {
    children: 7,
    youth: 10,
    adults: 14,
    seniors: 10,
    under3: 0
  }

  // === Calculate Total Price for Reservation ===
  useEffect(() => {
    const price = (resChildren * tourPrices.children) + 
                  (resYouth * tourPrices.youth) + 
                  (resAdults * tourPrices.adults) + 
                  (resSeniors * tourPrices.seniors)
    setResTotalPrice(price)
  }, [resChildren, resYouth, resAdults, resSeniors])

  // === Calculate Total Price for Tickets ===
  useEffect(() => {
    const price = (ticChildren * ticketPrices.children) + 
                  (ticYouth * ticketPrices.youth) + 
                  (ticAdults * ticketPrices.adults) + 
                  (ticSeniors * ticketPrices.seniors) + 
                  (ticUnder3 * ticketPrices.under3)
    setTicTotalPrice(price)
  }, [ticChildren, ticYouth, ticAdults, ticSeniors, ticUnder3])

// === Handle Reservation ===
const handleReservation = async (e) => {
  e.preventDefault();

  // Concatenar la fecha y la hora de la reserva
  const fullReservationDate = `${resTourDate} ${resTourTime}`;

  // Convertir la fecha y hora al formato de MySQL (YYYY-MM-DD HH:MM:SS)
  const formattedReservationDate = new Date(fullReservationDate);
  const mysqlFormattedDate = formattedReservationDate.toISOString().slice(0, 19).replace('T', ' ');

  // Preparar la descripción de la reserva
  const description = `Children: ${resChildren}, Youth: ${resYouth}, Adults: ${resAdults}, Seniors: ${resSeniors}.`;

  const reservationData = {
    cantidad_pagada: resTotalPrice,
    correo_usuario: resEmail,
    descripcion: description,
    fecha_reserva: mysqlFormattedDate // Usamos la fecha con el formato correcto para MySQL
  };

  try {
    // Almacenar la reserva
    const response = await fetch("http://localhost:5001/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (response.ok) {
      // Enviar correo al backend
      const emailResponse = await fetch("http://localhost:5001/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resEmail,
          subject: "Reservation Confirmation",
          message: `
            Dear ${resFullName},

            Thank you for your reservation! Here are your details:

            - Date: ${resTourDate}
            - Time: ${resTourTime}
            - Number of tickets:
              * Children: ${resChildren}
              * Youth: ${resYouth}
              * Adults: ${resAdults}
              * Seniors: ${resSeniors}

            Total Price: €${resTotalPrice}

            We look forward to seeing you!

            Regards,
            Natural Zoo
          `,
        }),
      });

      if (emailResponse.ok) {
        alert(`Reservation successful! Confirmation email sent to ${resEmail}.`);
        // Reset the form
        setResFullName("");
        setResEmail("");
        setResTourDate("");
        setResTourTime("");
        setResChildren(0);
        setResYouth(0);
        setResAdults(0);
        setResSeniors(0);
        setResComments("");
      } else {
        const errorData = await emailResponse.json();
        console.error("Error sending email:", errorData);
        alert("Failed to send confirmation email. Please try again.");
      }
    } else {
      const errorData = await response.json();
      console.error("Error storing reservation:", errorData);
      alert("Failed to store reservation. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your reservation.");
  }
};

  // === Handle Ticket Purchase ===
  const handleTicketPurchase = async (e) => {
    e.preventDefault();

    // Preparar la descripción de la compra
    const description = `Children: ${ticChildren},Youth: ${ticYouth},Adults: ${ticAdults},Seniors: ${ticSeniors},Under 3: ${ticUnder3}`;

    const ticketData = {
      cantidad_pagada: ticTotalPrice,
      correo_usuario: ticEmail,
      descripcion: description
    };

    try {
      // Almacenar el pago
      const response = await fetch("http://localhost:5001/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        // Enviar correo de confirmación
        const emailResponse = await fetch("http://localhost:5001/api/notifications/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: ticEmail,
            subject: "Purchase Confirmation",
            message: `
              Dear ${ticFullName},

              Thank you for your purchase! Here are your details:

              - Number of tickets:
                * Children: ${ticChildren}
                * Youth: ${ticYouth}
                * Adults: ${ticAdults}
                * Seniors: ${ticSeniors}
                * Under 3: ${ticUnder3}

              Total Price: €${ticTotalPrice}

              We look forward to seeing you!

              Regards,
              Natural Zoo
            `,
          }),
        });

        if (emailResponse.ok) {
          alert(`Purchase successful! Confirmation email sent to ${ticEmail}.`);
          // Reset the form
          setTicFullName("");
          setTicEmail("");
          setTicChildren(0);
          setTicYouth(0);
          setTicAdults(0);
          setTicSeniors(0);
          setTicUnder3(0);
          setTicComments("");
        } else {
          const errorData = await emailResponse.json();
          console.error("Error sending email:", errorData);
          alert("Failed to send confirmation email. Please try again.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error storing payment:", errorData);
        alert("Failed to store payment. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your payment.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <main className="container mx-auto mt-8 p-4 space-y-8">

        {/* Tabs for Reservation and Purchase */}
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 text-center transition-colors duration-300 ${
                activeTab === 'reservation'
                  ? 'border-b-2 border-blue-500 text-blue-500 bg-backgroundGrey'
                  : 'text-gray-600 bg-white'
              }`}
              onClick={() => setActiveTab('reservation')}
            >
              Tour Reservation
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center transition-colors duration-300 ${
                activeTab === 'ticket'
                  ? 'border-b-2 border-blue-500 text-blue-500 bg-backgroundGrey'
                  : 'text-gray-600 bg-white'
              }`}
              onClick={() => setActiveTab('ticket')}
            >
              Ticket Purchase
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'reservation' && (
              <form onSubmit={handleReservation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="resFullName" className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      id="resFullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={resFullName}
                      onChange={(e) => setResFullName(e.target.value)}
                      required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="resEmail" className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input
                      id="resEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={resEmail}
                      onChange={(e) => setResEmail(e.target.value)}
                      required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="resTourDate" className="text-sm font-medium text-gray-700">Tour Date</label>
                    <Input
                      id="resTourDate"
                      type="date"
                      value={resTourDate}
                      onChange={(e) => setResTourDate(e.target.value)}
                      required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="resTourTime" className="text-sm font-medium text-gray-700">Tour Time</label>
                    <select
                      id="resTourTime"
                      value={resTourTime}
                      onChange={(e) => setResTourTime(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="" disabled>Select a time</option>
                      {availableTimes.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Number of Tickets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="resChildren" className="block text-sm text-gray-600">Children (3-12)</label>
                      <Input
                        id="resChildren"
                        type="number"
                        min="0"
                        value={resChildren}
                        onChange={(e) => setResChildren(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="resYouth" className="block text-sm text-gray-600">Youth (13-17)</label>
                      <Input
                        id="resYouth"
                        type="number"
                        min="0"
                        value={resYouth}
                        onChange={(e) => setResYouth(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="resAdults" className="block text-sm text-gray-600">Adults (18-64)</label>
                      <Input
                        id="resAdults"
                        type="number"
                        min="0"
                        value={resAdults}
                        onChange={(e) => setResAdults(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="resSeniors" className="block text-sm text-gray-600">Seniors (65+)</label>
                      <Input
                        id="resSeniors"
                        type="number"
                        min="0"
                        value={resSeniors}
                        onChange={(e) => setResSeniors(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Total Price */}
                <div className="text-lg font-semibold text-gray-800">
                  Total Price: €{resTotalPrice}
                </div>

                <div className="space-y-2">
                  <label htmlFor="resComments" className="text-sm font-medium text-gray-700">Additional Comments</label>
                  <textarea
                    id="resComments"
                    rows="4"
                    placeholder="Enter any requests or comments"
                    value={resComments}
                    onChange={(e) => setResComments(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full flex items-center justify-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book Tour
                </Button>
              </form>
            )}

            {activeTab === 'ticket' && (
              <form onSubmit={handleTicketPurchase} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ticFullName" className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      id="ticFullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={ticFullName}
                      onChange={(e) => setTicFullName(e.target.value)}
                      required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ticEmail" className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input
                      id="ticEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={ticEmail}
                      onChange={(e) => setTicEmail(e.target.value)}
                      required />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Number of Tickets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label htmlFor="ticChildren" className="block text-sm text-gray-600">Children (3-12)</label>
                      <Input
                        id="ticChildren"
                        type="number"
                        min="0"
                        value={ticChildren}
                        onChange={(e) => setTicChildren(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticYouth" className="block text-sm text-gray-600">Youth (13-17)</label>
                      <Input
                        id="ticYouth"
                        type="number"
                        min="0"
                        value={ticYouth}
                        onChange={(e) => setTicYouth(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticAdults" className="block text-sm text-gray-600">Adults (18-64)</label>
                      <Input
                        id="ticAdults"
                        type="number"
                        min="0"
                        value={ticAdults}
                        onChange={(e) => setTicAdults(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticSeniors" className="block text-sm text-gray-600">Seniors (65+)</label>
                      <Input
                        id="ticSeniors"
                        type="number"
                        min="0"
                        value={ticSeniors}
                        onChange={(e) => setTicSeniors(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticUnder3" className="block text-sm text-gray-600">Under 3 years</label>
                      <Input
                        id="ticUnder3"
                        type="number"
                        min="0"
                        value={ticUnder3}
                        onChange={(e) => setTicUnder3(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Total Price */}
                <div className="text-lg font-semibold text-gray-800">
                  Total Price: €{ticTotalPrice}
                </div>

                <div className="space-y-2">
                  <label htmlFor="ticComments" className="text-sm font-medium text-gray-700">Additional Comments</label>
                  <textarea
                    id="ticComments"
                    rows="4"
                    placeholder="Enter any requests or comments"
                    value={ticComments}
                    onChange={(e) => setTicComments(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full flex items-center justify-center">
                  <Ticket className="mr-2 h-4 w-4" />
                  Purchase Tickets
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Informational Section */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Tours and Experiences - Discover our zoo with expert guides</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="mb-4">
              <h2 className="text-xl font-semibold">Our Guides</h2>
              <ul className="list-disc list-inside">
                <li><strong>Dr. Carlos Mendoza</strong> - Specialist in mammals</li>
                <li><strong>Dr. Ana López</strong> - Expert in birds and conservation</li>
                <li><strong>Lic. Miguel Ángel Ruiz</strong> - Herpetologist and environmental educator</li>
              </ul>
            </section>
            <section className="mb-4">
              <h2 className="text-xl font-semibold">Tour Duration</h2>
              <p>Approximately 2 hours, including breaks.</p>
            </section>
            <section className="mb-4">
              <h2 className="text-xl font-semibold">What You Will See</h2>
              <ul className="list-disc list-inside">
                <li>Lions and giraffes in our Savannah area</li>
                <li>Tigers and gorillas in the Tropical Forest area</li>
                <li>Penguins and polar bears in our Polar Region</li>
                <li>Crocodiles and hippos in the Swamps and Wetlands zone</li>
                <li>And many more species in their simulated natural habitats</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Prices</h2>
              
              {/* Prices for Tour Reservations */}
              <h3 className="mt-4 text-lg font-semibold">Prices for Tour Reservations</h3>
              <table className="min-w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Age Group</th>
                    <th className="px-4 py-2">Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Children (3-12 years)</td>
                    <td className="border px-4 py-2">{tourPrices.children}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">Youth (13-17 years)</td>
                    <td className="border px-4 py-2">{tourPrices.youth}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Adults (18-64 years)</td>
                    <td className="border px-4 py-2">{tourPrices.adults}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">Seniors (65+ years)</td>
                    <td className="border px-4 py-2">{tourPrices.seniors}</td>
                  </tr>
                </tbody>
              </table>

              {/* Prices for Ticket Purchases */}
              <h3 className="mt-6 text-lg font-semibold">Prices for Ticket Purchases</h3>
              <table className="min-w-full table-auto mt-2">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Age Group</th>
                    <th className="px-4 py-2">Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Children (3-12 years)</td>
                    <td className="border px-4 py-2">{ticketPrices.children}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">Youth (13-17 years)</td>
                    <td className="border px-4 py-2">{ticketPrices.youth}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Adults (18-64 years)</td>
                    <td className="border px-4 py-2">{ticketPrices.adults}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">Seniors (65+ years)</td>
                    <td className="border px-4 py-2">{ticketPrices.seniors}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Under 3 years</td>
                    <td className="border px-4 py-2">Free</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">*These prices are in addition to the zoo entrance fee.</p>
            </section>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}