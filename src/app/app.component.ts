/*
This is a practical test on a minimal made-up application. 
There are two main features:
 - We have a set of statistics (e.g. number of views, comments) that we want to display to the user.
 - User can send a search request either containing a text or number range, the response should be displayed along with the statistics.
The exact task is described in the comments below.
Solution shouldn't take more than two hours.
UX and styling will not be evaluated (don't spend time on them).
*/

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, timer, map, Observable, BehaviorSubject, distinctUntilChanged, retry } from 'rxjs';

/*
Search query representation.

User can either search by text (`txt` is set) or number range (`min`, `max` is set).
It is possible for user to specify only one of `min` or `max`, this way only one of the bounds will be accounted for.
*/
interface SearchTerm {
  txt?: string;
  min?: number;
  max?: number;
}

/*
Mock 'backend' service we will be using to emulate requests.
*/
export class BackendService {
  // These are the statistics for our app that we want to display
  viewCount$: Observable<number> = interval(700).pipe(map((x) => 50 + (x % 2)));
  commentCount$: Observable<number> = interval(1500).pipe(map((x) => 1 + x));

  // Use this method to send a search request to our 'server'.
  // The response of the server is `true` if value was found, or `false` otherwise.
  // Make sure the term is valid before calling (see task description below).
  search(term: SearchTerm) {
    return timer(3000).pipe(
      map((x) => {
        if (Math.random() < 0.5) {
          return Math.random() < 0.5;
        } else {
          throw new HttpErrorResponse({ status: 500 });
        }
      })
    );
  }
}

/*
TASK:
  1. User input 
    Make it possible for user to input the search term.
    There is minimal template already defined, but it is only for illustration purposes to help you understand the task. Feel free to change it as you like.
    When user clicks the search button, backend service's search method should be called (if search term is valid, see next task).
    Don't spend time on styling, it will not be evaluated.
  
  2. Input validation
    A valid search term must satisfy:
      - At least one member (`txt`, `min` or `max`) should be set.
      - If set, `txt` must be a non-empty string.
      - If set, `min`, `max` must be numbers. Floating poinst / integers are both allowed.
      - If both set, `min` should be <= `max`.
      - {`txt`} and {`min`, `max`} members are mutually exclusive.
        If `txt` is set, `min` and `max` should be unset.
        If either `min` or `max` is set, `txt` should be unset.
  
  3. Handling observables
    - Display all up-to-date values from backendService.viewCount$, backendService.commentCount$ and the result  of the search request (if any present).
    - Try to limit number of calls to the display method (pretend that displaying values is expensive operation).
      - Avoid calling the method consecutively with same values as currently displayed.
      - (bonus) 200 millisecond delay between value change and display is acceptable.
        For example, there is a new value from viewCount$ at X milliseconds and a new search term from user at time X+100 milliseconds.
        Instead of calling display method two times for each of these updates, you should call it once with both updated values.
  
  4. Error Handling
    - Call to backend service's `search` method has a chance of throwing an error.
      If an error is thrown, the request should be retried (if search term hasn't changed)
  
  Good luck!
*/

// to be used for the input validation (task2)
function xor(a: any, b: any) {
  return !!a !== !!b;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  backendService = new BackendService();
  searchTerm: SearchTerm = {};
  errorMessage: string = ''; // to display error message to the user
  isPresent: boolean = false; // a flag to tell if the search result is present or not
  loading: boolean = false; // a flag to tell the call is pending or completing

  private subjectSearchResult = new BehaviorSubject<boolean>(false);
  searchResult$: Observable<boolean> = this.subjectSearchResult.asObservable()

  // search function is executed on clicking on the button 'Search'
  search(){
    if (this.termIsValid()){ // input validation
      this.loading = true;
      this.isPresent = false;
      
      // Ideally, I will create a service file to call the backend api from there. Then subscribe to it here.
      // I understand that since we are using Mock backend service, I will call it from AppComponent
      // using the backService instance provided.
      const result = this.backendService.search(this.searchTerm).pipe(
        distinctUntilChanged(), // emit only if data changes since the last emit
        retry(1) // retry 1 time on error
    );

      result.subscribe({
        next: (data) => {
          this.isPresent = true; // display the search result by updating the flag
          this.loading = false; // loading/call is finished
          this.subjectSearchResult.next(data); // pass the response to the searchResult$
        },
        error: (e) => {
          this.isPresent = false; // in case of error, no need to display the previous searchResult$
          this.loading = false; // loading/call is finished
          this.errorMessage = 'Retried one time then quit! \n' + e.message; // significant message to the user
        }
      });
    }
  }

    // function returns false and display error message if input is invalid, else returns true
    termIsValid() : boolean{
      this.errorMessage = ""; // initialize the error message to prevent showing the previous message from previous call.
  
      if(Object.keys(this.searchTerm).length === 0) {
        this.errorMessage = 'At least one member (`txt`, `min` or `max`) should be set.';
        return false;
      }
  
      if( !xor((this.searchTerm.txt !== undefined && this.searchTerm.txt !=='') ,
          ((this.searchTerm.min !== undefined && this.searchTerm.min.toString() !== '') ||
              (this.searchTerm.max !== undefined && this.searchTerm.max.toString() !== '')))){
        this.errorMessage = '{`txt`} and {`min`, `max`} members are mutually exclusive.'
        return false;
      }
  
      if(this.searchTerm.txt !== undefined && this.searchTerm.txt !==''){
        return true;
      }
  
      if((this.searchTerm.min === undefined || isNaN(parseFloat(this.searchTerm.min.toString()))) ||
        (this.searchTerm.max === undefined || isNaN(parseFloat(this.searchTerm.max.toString())))){
        this.errorMessage = "`min`, `max` must be numbers. Floating point / integers are both allowed."
        return false;
      }
  
      this.searchTerm.min = parseFloat(this.searchTerm.min.toString());
      this.searchTerm.max = parseFloat(this.searchTerm.max.toString());
      if(this.searchTerm.min > this.searchTerm.max){
          this.errorMessage = "`min` should be <= `max`";
          return false;
      }
  
      return true;
    }

  // Example how the display method's signature could look like (you are free to change this)
  display(
    viewCount: number,
    commentCount: number,
    searchResult: boolean | null
  ) {}
}
