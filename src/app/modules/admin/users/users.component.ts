import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { User } from './user.model'; // Import the 'User' class from the appropriate file
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  standalone: true, 
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
    MatCheckboxModule, MatProgressSpinnerModule,MatSnackBarModule,
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

        signInForm: FormGroup; 

        constructor(
          private _userService: UserService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
        ) { }

        ngOnInit(): void {

          this.loadUsers();

          this.signInForm = this._formBuilder.group({               
            name     : ['', [Validators.required]],            
            email    : ['', [Validators.required]],
            password     : ['', [Validators.required]],            
            phone    : ['', [Validators.required]],
            company     : ['', [Validators.required]],            
            address    : ['', [Validators.required]],
          });

            }

            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            addUser(): void {
              
              if (!this.signInForm.valid) {
                this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                return;
              }      
              
                const name = this.signInForm.get('name').value;
                const email = this.signInForm.get('email').value;
                const password = this.signInForm.get('password').value;
                const phone = this.signInForm.get('phone').value;
                const company = this.signInForm.get('company').value;
                const address = this.signInForm.get('address').value;

              const importExists = this.users.some(usr => usr.name === name.trim());
              if (importExists) {
                this.openSnackBar('El usuario ya existe.', 'Error');
                return;
              }    
            
              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newUser: User = {                
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                phone: phone.trim(),
                company: company.trim(),
                address: address.trim(),
              };

              this._userService.addUser(newUser).subscribe({
                next: () => {
                  this.openSnackBar('Usuario agregado exitosamente.', 'Success');                  
                  this.signInForm.reset();
                  this.loadUsers();                  
                },
                error: (error) => {
                  console.error('Error al agregar el usuario', error);
                  this.openSnackBar('Error al agregar el usuario. Por favor intente nuevamente.', 'Error');    
                }
              });
            }


              selectUserForEdit(user: User): void {
                //this.selectedUser = { ...user };               
                console.log('Seleccionando usuario para editar:', user);
                // Aquí se permite el ID cero como válido.
                if (user && (user.id || user.id === 0)) {
                this.selectedUser = { ...user };
                } else {
                console.error('El usuario seleccionado no tiene un ID válido.');
                }
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
                      this.users[index] = {...updatedUser, ...response};
                    }

                    this.users = [...this.users];
                    this.filteredUsers = this.users;

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
                  const valueA = a[field] ? a[field].toString().toLowerCase() : '';
                  const valueB = b[field] ? b[field].toString().toLowerCase() : '';
              
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
