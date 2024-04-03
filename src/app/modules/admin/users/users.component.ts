import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User } from './user.model'; // Import the 'User' class from the appropriate file
import { UserService } from './user.service';


@Component({
  selector: 'app-users',
  standalone: true, 
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule, 
    RouterLink, MatButtonModule, CdkScrollable
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
        users: User[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newUser:User = {name: '', email: '',password:'', phone: '', company: '', address: ''};


        constructor(private _userService: UserService) { }

        ngOnInit(): void {

            this._userService.getUsers().subscribe((users: User[]) => {
                this.users = (users);
            });
            }

            addUser(): void {
                console.log();
                this._userService.addUser(this.newUser).subscribe((user: User) => {
                  this.users.push(user);
                  
                });
              }
  editUser(user) {
    // Aquí va tu código para editar el usuario
  }
}

function subscribe(arg0: (user: User) => void) {
    throw new Error('Function not implemented.');
}

