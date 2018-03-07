export default class PictureStorage {


  constructor() {
    if (!sessionStorage.picturesStorage) {
      sessionStorage.picturesStorage = JSON.stringify([]);
    }

    const parsedStorage = JSON.parse(sessionStorage.picturesStorage);
    this.store = Object.freeze(parsedStorage);
    this.idStore = (this.store.length) ? this.store.map(file => file.id) : [];
  }


  addPicture({ pictureObject, id = this._createNewId(), isSent = false }) {
    const requiredFieldsExists = this._checkRequiredFieldsExists({ id, pictureObject });
    const fileAlreadyAdded = this._checkFileAlreadyAdded(pictureObject);

    if (!requiredFieldsExists || fileAlreadyAdded) {
      !requiredFieldsExists && console.log('Не все обязательные поля заполнены');
      fileAlreadyAdded && console.log('Файл уже добавлен');

      return false;
    }

    const newPicture = { id, pictureObject, isSent };

    return this._releaseStore([...this.store, newPicture]);
  }


  _createNewId() {
    const { idStore } = this;
    const lastIdNumber = idStore.length ? idStore[idStore.length - 1].split('_')[1] : 0;
    const newId = `id_${Number(lastIdNumber) + 1}`;
    this.idStore = [...idStore, newId];

    return newId;
  }


  _checkRequiredFieldsExists({ id, pictureObject }) {
    return [
      id,
      pictureObject.name,
      pictureObject.size,
      pictureObject.type,
      pictureObject.file
    ].every(item => !!item);
  }


  _checkFileAlreadyAdded(pictureObject) {
    return this.store.some(file => (
      (
        (file.pictureObject.name === pictureObject.name) &&
        (file.pictureObject.size === pictureObject.size) &&
        (file.pictureObject.type === pictureObject.type)
      )
    ))
  }


  _releaseStore(newStoreState) {
    try {
      if (this.store === newStoreState) {
        throw new Error('An attempt to change an immutable object: this.store')
      }

      sessionStorage.picturesStorage = JSON.stringify(newStoreState);
      this.store = Object.freeze(newStoreState);
      return true;

    } catch (error) {
      console.error(error);
      return false;
    }
  }


  getNotSentFiles() {
    this._checkSentStatus();
    return [...this.store];
  }


  _checkSentStatus() {
    const notSentPictures = this.store.filter(picObj => !picObj.isSent);

    return this._releaseStore([...notSentPictures]);
  }


  updateFileSentStatus(fileId) {
    const storeCopy = [...this.store].map(item => {
      const itemCopy = {...item};
      if (itemCopy.id === fileId) {
        itemCopy.isSent = true;
      }
      return itemCopy;
    });

    return this._releaseStore(storeCopy);
  }

}