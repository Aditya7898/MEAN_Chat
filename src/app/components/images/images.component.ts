import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  socket: any;
  user: any;
  images = [];

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.userService.getUserById(this.user._id).subscribe(data => {
      this.images = data.result.images;
      console.log(this.images);
    }, err => console.log(err));
  }

  OnFileSelected(event) {
    const file: File = event[0];
    this.ReadAsBase64(file).then((result) => {
      this.selectedFile = result;
    }).catch(err => console.log(err));
  }

  // Base 64 Read:
  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {

      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', (event) => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });
    return fileValue;
  }

  upload() {
    if (this.selectedFile) {
      this.userService.addImage(this.selectedFile).subscribe(data => {
        this.socket.emit('refresh', {});
        console.log(data);
        const filePath = <HTMLInputElement>document.getElementById('filePath');
        filePath.value = '';
      }, err => console.log(err));
    }
  }

  // set Profile Image
  setProfileImage(image) {
    console.log(image);
    this.userService.setProfileImage(image.imgId, image.imgVersion).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    }, err => console.log(err));
  }

}
