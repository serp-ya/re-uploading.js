export default class ImageObject {

  constructor(file){
    const {name, size, type} = file;
    this.name = name;
    this.size = size;
    this.type = type;
    this.file = file;
    this.uploadDate = new Date();
  }

}