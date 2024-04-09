import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
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
    RouterLink, MatButtonModule, CdkScrollable, MatFormField
  ],
  animations: [
    trigger('fadeOutRight', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition(':leave', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
        users: User[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newUser:User = {
          name: '', email: '',password: '', phone: '', company: '', address: ''};
        filteredUsers: User[] = [];
        searchTerm: string = '';
        selectedUser:  User | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        constructor(private _userService: UserService) { }

        ngOnInit(): void {

          this.loadUsers();

            }

            addUser(): void {
              this._userService.addUser(this.newUser).subscribe({
                next: () => {
                  this.loadUsers();
                  this.newUser = { 
                    name: '', email: '',password:'', phone: '', company: '', address: ''};
                },
                error: (error) => {
                  console.error('Error al agregar la user', error);
                }
              });
            }

              selectUserForEdit(user: User): void {
                this.selectedUser = { ...user };               
              }
            
              updateUser(updatedUser: User): void {
                
                if (!updatedUser.id) {
                  console.error('Error al actualizar: ID de user no proporcionado');
                  return;
                }
                this._userService.updateUser(updatedUser.id, updatedUser).subscribe({
                  next: (response) => {
                    // Actualizar la lista de users en el frontend
                    const index = this.users.findIndex(user => user.id === updatedUser.id);
                    if (index !== -1) {
                      this.users[index] = updatedUser;
                    }
                    console.log('User actualizada:', response);
                    this.selectedUser = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el user', error);
                  }
                });
              }

              deleteUser(userId: number): void {
                if (!userId) {
                  console.error('Error al eliminar: ID de user no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este user?');
                if (!confirmation) {
                  return;
                }
              
                this._userService.deleteUser(userId).subscribe({
                  next: () => {
                    // Eliminar el user de la lista en el frontend
                    this.loadUsers();
                    this.users = this.users.filter(user => user.id !== userId);
                    console.log('User eliminado con éxito');
                    this.selectedUser = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el user', error);
                  }
                });
              }             

              loadUsers(): void {
                this._userService.getUsers().subscribe({
                  next: (data) => {
                    this.users = data;
                    this.filteredUsers = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredUsers = this.searchTerm
                  ? this.users.filter(user =>
                      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      user.phone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      user.company.toLowerCase().includes(this.searchTerm.toLowerCase())
                    )
                  : this.users;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredUsers.sort((a, b) => {
                  const valueA = a[field].toLowerCase();
                  const valueB = b[field].toLowerCase();
              
                  // Comparar los valores para el ordenamiento
                  if (valueA < valueB) {
                    return this.orderAsc ? -1 : 1;
                  }
                  if (valueA > valueB) {
                    return this.orderAsc ? 1 : -1;
                  }
                  return 0;
                });
              }
            
              cancelEdit(): void {
                this.selectedUser = null;
                this.searchTerm = '';
                this.applyFilter();
              }
}
