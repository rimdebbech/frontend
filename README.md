# 7Learnings Front-End Development Code Challenge

When all the prerequisites are met, you can install all required modules and serve the application:
 ```
 npm install
 ng serve --open
 ```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### TASK 1

  1. User input 
    Make it possible for user to input the search term.
    There is minimal template already defined, but it is only for illustration purposes to help you understand the task. Feel free to change it as you like.
    When user clicks the search button, backend service's search method should be called (if search term is valid, see next task).
    Don't spend time on styling, it will not be evaluated.


    Added 3 inputs for txt, min and max values.
    All inputs are with type text and their values will be stored in the searchTerm variable using ngModel.
    searchTerm: SearchTerm = {};

#### TASK 2

  2. Input validation
    A valid search term must satisfy:
      - At least one member (`txt`, `min` or `max`) should be set.
      - If set, `txt` must be a non-empty string.
      - If set, `min`, `max` must be numbers. Floating poinst / integers are both allowed.
      - If both set, `min` should be <= `max`.
      - {`txt`} and {`min`, `max`} members are mutually exclusive.
        If `txt` is set, `min` and `max` should be unset.
        If either `min` or `max` is set, `txt` should be unset.

    The function termIsValid() : boolean{} will returns false and display error message if input 
    is invalid, else returns true.


#### TASK 3

   3. Handling observables
      - Display all up-to-date values from backendService.viewCount$, backendService.commentCount$ and the result  of the search request (if any present).
      - Try to limit number of calls to the display method (pretend that displaying values is expensive operation).
      - Avoid calling the method consecutively with same values as currently displayed.
      - (bonus) 200 millisecond delay between value change and display is acceptable.
         For example, there is a new value from viewCount$ at X milliseconds and a new search term from user at time X+100 milliseconds.
         Instead of calling display method two times for each of these updates, you should call it once with both updated values.
 

    I didn't use the display method, since displaying is being done from the beginning in the template with 
    async pipe for both viewCount & commentCount.
    The searchResult is being set once the search is called.
