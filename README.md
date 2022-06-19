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
    ```
    searchTerm: SearchTerm = {};
    ```

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

    The function termIsValid() : boolean{} will returns false and display error message if input is invalid, else returns true.
