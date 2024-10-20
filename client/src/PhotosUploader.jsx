import axios from "axios";
import { useState } from "react";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState(''); // initialize as empty string

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
      onChange(prev => [...prev, filename]);
      setPhotoLink('');
    } catch (error) {
      console.error("Failed to add photo by link", error);
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }
   axios.post('/upload', data, {
  headers: { 'Content-type': 'multipart/form-data' }
}).then(response => {
  const filenames = response.data.files; // Access the array from the 'files' property
  console.log(filenames);
  // Ensure filenames is an array before proceeding
  if (Array.isArray(filenames)) {
    onChange(prev => [...prev, ...filenames]);
  } else {
    console.error("Unexpected response format: ", filenames);
  }
}).catch(error => {
  console.error("Failed to upload photos", error);
});


  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange(addedPhotos.filter(photo => photo !== filename));
  }

  function selectAsMainPhoto(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter(photo => photo !== filename)]);
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          value={photoLink}
          onChange={ev => setPhotoLink(ev.target.value)}
          type="text"
          placeholder="Add using a link ....Jpg"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-primary text-white px-4 rounded-2xl font-bold"
        >
          Add&nbsp;photos
        </button>
      </div>
      <div className="mt-2 grid gap-3 grid-cols-3 lg:grid-cols-8 md:grid-cols-5">
        {addedPhotos.length > 0 && addedPhotos.map(link => (
          <div className="h-32 flex relative" key={link}>
            <img
              className="rounded-2xl w-full object-cover"
              src={`http://localhost:4000+${link}`}
              alt=""
            />
            <button
              onClick={ev => removePhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
            >
              {/* SVG for delete */}
            </button>
            <button
              onClick={ev => selectAsMainPhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
            >
              {link === addedPhotos[0] ? (
                <svg> {/* Star SVG for main photo */} </svg>
              ) : (
                <svg> {/* Unselected photo SVG */} </svg>
              )}
            </button>
          </div>
        ))}
        <label className="border bg-transparent rounded-2xl p-2 text-2xl text-gray-600 flex justify-center items-center gap-1 cursor-pointer">
          <input type="file" multiple className="hidden" onChange={uploadPhoto} />
          <svg> {/* Upload icon SVG */} </svg>
          Upload
        </label>
      </div>
    </>
  );
}
