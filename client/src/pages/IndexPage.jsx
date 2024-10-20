import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
    const [places, setPlaces] = useState([]); // Initialize places as an empty array
     // For error handling
    const [loading, setLoading] = useState(true); // For loading state

    useEffect(() => {
        // Fetch the places data
        axios.get('/places')
            .then(response => {
                console.log('API response:', response.data); // Debugging the API response
                // Ensure that the data is an array
                setPlaces(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching places:', err);
                setLoading(false);
            });
    }, []);

    // Log places to debug any issues
    console.log('places:', places);

    if (loading) {
        return <p>Loading places...</p>;
    }

    

    return (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.isArray(places) && places.length > 0 ? (
                places.map((place) => (
                    <Link key={place._id} to={'/place/' + place._id}>
                        <div className="bg-gray-500 mb-2 rounded-2xl flex">
                            {place.photos?.[0] && (
                                <Image className="rounded-2xl object-cover aspect-square" src={place.photos[0]} alt={place.title} />
                            )}
                        </div>
                        <h2 className="font-bold">{place.address}</h2>
                        <h3 className="text-sm text-gray-500">{place.title}</h3>
                        <div className="mt-1">
                            <span className="font-bold">${place.price}</span> per night
                        </div>
                    </Link>
                ))
            ) : (
                <p>No places available.</p>
            )}
        </div>
    );
}
