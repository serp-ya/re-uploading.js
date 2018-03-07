import { preloader } from "./preloader";

export default class FileLoader {


  constructor(options) {
    this.restPostUrl = options.restPostUrl;
    this.storage = options.storage;
    this.filesList = this.storage.store;

    this.fileIsSent = false;
    this.fileSender = null;
    this.queue = this._updateQueue();

    this._startWatcher();
  }


  _startWatcher() {
    setInterval(() => {
      if (this.filesList !== this.storage.store) {
        this._updateQueue();
        this.filesList = this.storage.store;
      }
    }, 250);
  }


  _sendFile(fileData) {
    const { restPostUrl } = this;
    const sendOptions = {
      method: 'POST',
      body: JSON.stringify(fileData.pictureObject),
      credentials: 'include',
      headers: {
        'Content-Type': 'Application/json'
      }
    };

    fetch(restPostUrl, sendOptions)
      .then(res => {

        if (this._checkResponseStatus(res)) {
          this.storage.updateFileSentStatus(fileData.id);
          this.fileIsSent = false;
          this._updateQueue();

        } else {
          throw new Error(`Uncorrect response status: ${res.status}`);
        }

      })
      .catch(error => {
        console.log(error);
        this.fileIsSent = false;
      });

    this.fileIsSent = true;
  }


  _checkResponseStatus({ status }) {
    return ((status >= 200) && (status <= 299));
  }


  _updateQueue() {
    if (this.fileSender) {
      clearInterval(this.fileSender);
    }
    this.queue = this.storage.getNotSentFiles();
    this._startSentFiles();

    if (this.queue && this.queue.length) {
      preloader.show();
    } else {
      preloader.hide();
    }
  }


  _startSentFiles() {
    let sentFileId = 0;
    this.fileSender = setInterval(() => {
      if (!this.fileIsSent && this.queue && this.queue[sentFileId]) {
        this._sendFile(this.queue[sentFileId]);
        sentFileId += 1;

        if (this.queue.length < sentFileId) {
          sentFileId = 0;
        }
      }
    }, 200);
  }


};