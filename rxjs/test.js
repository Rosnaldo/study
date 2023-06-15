import { from } from 'rxjs'
import { mapTo, tap } from 'rxjs/operators'

const numbers = [1, 2, 3, 4, 5]
const numbers$ = from(numbers).pipe(
  mapTo('You clicked!')
  )

numbers$.subscribe(console.log)