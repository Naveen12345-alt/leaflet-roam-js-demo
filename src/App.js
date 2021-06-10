import L from "leaflet"
import "leaflet/dist/leaflet.css"
import React, { useEffect, useState } from "react"
import { Marker, Polyline, Popup, MapContainer, TileLayer } from "react-leaflet"
import "./App.css"

import roam from "roam-js"

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.7.1/dist/images/"

function App() {
  const pk = "380b6e2b8e0609e3ff114e7d314fe8f7a7d199d48bfd0f7c653fe7869dce6ebf"

  const [data, setData] = useState([
    {
      from_lat: "28.829263",
      from_long: "78.243747",
      id: "132512",
      to_lat: "28.829263",
      to_long: "78.243747",
    },
  ])

  useEffect(() => {
    roam
      .Initialize(pk)
      .then((client) => {
        client
          .userSubscription("60c1a0e251efb00f9d1a343f")
          .then((subscription) => {
            subscription.subscribe().then((msg) => {
              console.log(msg)
              //     subscription
              //       .unsubscribe()
              //       .then((msg) => {
              //         console.log(msg)
              //         client.disconnect().then((msg) => {
              //           console.log(msg)
              //         })
              //       })
              //       .catch((err) => {
              //         throw err
              //       })
            })
          })
          .catch((err) => {
            throw err
          })
        client.setCallback(function (message) {
          message = JSON.parse(message)
          setData((prev) => {
            const updatedState = [...prev]
            updatedState[0]["to_lat"] = `${message["latitude"]}`
            updatedState[0]["to_long"] = `${message["longitude"]}`
            return updatedState
          })
        })
      })
      .catch((err) => {
        throw err
      })
  }, [data])

  return (
    <React.Fragment>
      <MapContainer
        center={[28.829263, 78.243747]}
        zoom={16}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[28.829263, 78.243747]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {data.map(({ id, from_lat, from_long, to_lat, to_long }) => {
          return (
            <Polyline
              key={id}
              positions={[
                [from_lat, from_long],
                [to_lat, to_long],
              ]}
              color={"red"}
            />
          )
        })}
      </MapContainer>
    </React.Fragment>
  )
}

export default App
