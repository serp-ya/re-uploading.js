# re-uploading.js
Uploading photos to the browser and sending them to the server when the connection is broken

Prototype of reuploading photos from browser to web-server. Photos temporary save to browser sessionStorage as base64 string and send to server. 

If the connection was interrupted at the time of transfer, the photo is not deleted, but tries to boot again.