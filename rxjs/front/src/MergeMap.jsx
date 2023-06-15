import { fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, delay } from 'rxjs/operators';

const example = () => {
  const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';

// streams
  const click$ = fromEvent(window, 'click');

  click$
    .pipe(
      /*
      * Using mergeMap for example, but generally for GET requests
      * you will prefer switchMap.
      * Also, if you do not need the parameter like
      * below you could use mergeMapTo instead.
      * ex. mergeMapTo(ajax.getJSON(API_URL))
      */
      mergeMap(() => ajax.getJSON(API_URL))
    )
    // { userId: 1, id: 1, ...}
    .subscribe(console.log);
}

const example2= () => {
    // RxJS v6+

  // faking network request for save
  const saveLocation = location => {
    return of(location).pipe(delay(500));
  };
  // streams
  const click$ = fromEvent(document, 'click');

  click$
    .pipe(
      mergeMap((e) => {
        return saveLocation({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
      })
    )
    // Saved! {x: 98, y: 170, ...}
    .subscribe(r => console.log('Saved!', r));
}



function MergeMap() {
  example2()

  return (
    <div>
       
    </div>
  )
}

export default MergeMap
