import PictureObject from '../components/PictureObject';


export default ({ storage }) => (event) => {
  const files = [...event.currentTarget.files];
  // TODO: доработать интервал
  // const filesCount = files.length;
  // let sentFiles = 0;
  //
  // if (files && filesCount && (filesCount > sentFiles)) {
  //   const sender = setInterval(() => {
  //     compressAndSaveToStore({ pictureObject: new PictureObject(files[sentFiles++]), storage });
  //
  //     if (filesCount < sentFiles) {
  //       clearInterval(sender);
  //     }
  //   }, 100);
  // }

  [...event.currentTarget.files].forEach(file => {
    compressAndSaveToStore({ pictureObject: new PictureObject(file), storage });
  });
}


function compressAndSaveToStore({ pictureObject, storage }) {
  const maxSize = {width: 200, height: 200};

  readDataAsBase64(pictureObject)
    .then(pictureObject => loadImage(pictureObject))
    .then(({ image, pictureObject }) => drawCanvasImage({ image, pictureObject, maxSize }))
    .then(pictureObject => storage.addPicture({ pictureObject }))
    .catch(error => console.log(error));
}


function readDataAsBase64(pictureObject) {
  return new Promise((done, fail) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        pictureObject.file = event.currentTarget.result;

        done(pictureObject)
      };

      fileReader.readAsDataURL(pictureObject.file);

    } catch (error) {
      fail(error);
    }
  });
}


function loadImage(pictureObject) {
  return new Promise((done, fail) => {
    const image = document.createElement('img');
    image.src = pictureObject.file;

    image.onload = function () {
      try {
        done({ image, pictureObject })

      } catch (error) {
        fail(error);
      }
    }
  });
}


function calculateResultSize(originalSize, maxSize) {
  const { width: originalWidth, height: originalHeight } = originalSize;
  const { width: maxWidth, height: maxHeight } = maxSize;
  const originalSizeDiff = originalWidth / originalHeight;

  let targetWidth;
  let targetHeight;

  targetWidth = targetHeight = Math.min(Math.max(originalWidth, originalHeight), Math.min(maxWidth, maxHeight));

  if (originalSizeDiff < 1) {
    targetWidth = targetHeight * originalSizeDiff;
  } else {
    targetHeight = targetWidth / originalSizeDiff;
  }

  return {width: targetWidth, height: targetHeight};
}


function drawCanvasImage({ image, pictureObject, maxSize }) {
  return new Promise((done, fail) => {
    try {
      const { type } = pictureObject;
      const { width, height } = image;
      const { width: resultWidth, height: resultHeight} = calculateResultSize({ width, height }, maxSize);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = resultWidth;
      canvas.height = resultHeight;

      ctx.drawImage(image, 0, 0, resultWidth, resultHeight);

      pictureObject.file = canvas.toDataURL(type);
      done(pictureObject);

    } catch (error) {
      fail(error);
    }
  });
}
