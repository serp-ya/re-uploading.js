import config from './config';
import PictureStorage from './components/PictureStorage';
import FileLoader from './components/FileLoader';
import addFileHandler from './eventHandlers/addFileHandler';

// TODO: загружать параметры сжатия в зависимости от типа с сервера

function findUIElements({formId, inputId}) {
  const sendPhotosForm = document.getElementById(formId);
  const addPhotosInput = document.getElementById(inputId);

  return {
    sendPhotosForm,
    addPhotosInput
  }
}

function addEventListeners({ addPhotosInput, storage }) {
  addPhotosInput.addEventListener('change', addFileHandler({ storage }));
}

function initPicturesSessionStorage() {
  const storage = new PictureStorage();
  const loader = new FileLoader({storage, restPostUrl: config.restPostUrl});
  const { addPhotosInput } = findUIElements(config);

  addEventListeners({ addPhotosInput, storage });

}

initPicturesSessionStorage();

// canvas.toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function() {

        var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++ ) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback( new Blob( [arr], {type: type || 'image/png'} ) );

      });
    }
  });
}
// canvas.toBlob polyfill