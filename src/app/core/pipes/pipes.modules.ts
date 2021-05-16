import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago.pipe';
import { FirstCharPipe } from './first-char.pipe';
import { DurationPipe } from './duration.pipe';
@NgModule({
    declarations: [TimeAgoPipe, DurationPipe, FirstCharPipe],
    imports     : [],
    exports     : [TimeAgoPipe, DurationPipe, FirstCharPipe]
})

export class DbPipesModule { }
