import Image from "next/image";

async function getFlickrPhotos() {
  const API_KEY = process.env.FLICKR_API_KEY;
  const USER_ID = "159879889@N02"; // Your ID from the URL provided

  // Method to get a user's public photos
  const res = await fetch(
    `https://www.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`,
    { next: { revalidate: 3600 } }, // Cache for 1 hour
  );

  const data = await res.json();
  return data.photos.photo;
}

export default async function GalleryPage() {
  const photos = await getFlickrPhotos();

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo: any) => {
        // Construct Flickr Image URL: https://farm{farm}.staticflickr.com/{server}/{id}_{secret}_{size}.jpg
        const src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`;

        return (
          <div key={photo.id} className="relative h-64">
            <Image
              src={src}
              alt={photo.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
