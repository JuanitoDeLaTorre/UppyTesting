import {
  Uppy,
  DragDrop,
  Dashboard,
  XHRUpload,
  Compressor,
} from "https://releases.transloadit.com/uppy/v3.12.0/uppy.min.mjs";
const uppy = new Uppy({
  // onBeforeUpload: async (file) => {
  //     const fileKey = Object.keys(file)[0];
  //     const size = file[fileKey].data.size;
  //     if(size > 100000) {
  //         uppy.info(`AM I RUN`, 'error', 500)
  //         const compressedFile = await compressImage(file[fileKey], 0.5)
  //         file[fileKey] = compressedFile;
  //     }
  // },
  // onBeforeFileAdded: (file)=> {
  //     console.log(file['data']['size'])
  // }
});
uppy.use(Dashboard, { inline: true, target: "#uppy" });
uppy.use(XHRUpload, {
  endpoint: "http://localhost:3030/image",
  fieldName: "photo",
  formData: true,
});

//fires after the user selects the file for upload
//apply increasing compression levels for larger images, none for smaller (< 1MB)
uppy.on("file-added", (file) => {
  if (file.data.size > 1000000 && file.data.size < 3000000) {
    console.log("Light Compression");
    uppy.use(Compressor, { quality: 0.6 });
  } else if (file.data.size > 3000000) {
    console.log("Mid level Compression");
    uppy.use(Compressor, { quality: 0.4 });
  } else if (file.data.size > 10000000) {
    console.log("Aggressive Compression");
    uppy.use(Compressor, { quality: 0.2 });
  }
});

document.querySelector("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let value = document.querySelector("#name").value;
  let name = "name";

  try {
    const send = await fetch("http://localhost:3030/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: value }),
    });
  } catch (err) {
    console.log(err);
  }
});
