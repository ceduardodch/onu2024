import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { forkJoin, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

export const initialDataResolver = () =>
{
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);
    const shortcutsService = inject(ShortcutsService);

    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get().pipe(first(), catchError(error => of(null))),
        messagesService.getAll().pipe(first(), catchError(error => of(null))),
        shortcutsService.getAll().pipe(first(), catchError(error => of(null))),
    ]);
};
