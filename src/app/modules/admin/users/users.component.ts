import { Component,OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { User } from './user.model'; // Import the 'User' class from the appropriate file
import { Observable, of } from 'rxjs'; // Import the 'Observable' class from the appropriate package


@Component({
  selector: 'app-users',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
        users: User[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newUser:User = {id:0, name: '', email: '',password:'', phone: '', company: '', address: '', created_at: '',updated_at: ''};


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

